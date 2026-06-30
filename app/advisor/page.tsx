"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { AdvisorView, AdvisorConsultation, AdvisorClient, AdvisorPlacement, AdvisorActivity } from "@/lib/advisorTypes";
import { advisorApi, chatApi } from "@/lib/api";
import type { ChatThread, ChatMessage } from "@/lib/chatTypes";
import { AnimatePresence, motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";
import { useAgoraChat, agoraMsgToChatMsg } from "@/lib/useAgoraChat";
import AdvisorSidebar from "@/components/advisor/AdvisorSidebar";
import Navbar from "@/components/layout/Navbar";

const OverviewView = dynamic(() => import("@/components/advisor/OverviewView"), { ssr: false });
const ConsultationsManageView = dynamic(() => import("@/components/advisor/ConsultationsManageView"), { ssr: false });
const ClientsView = dynamic(() => import("@/components/advisor/ClientsView"), { ssr: false });
const PlacementsView = dynamic(() => import("@/components/advisor/PlacementsView"), { ssr: false });
const ActivityView = dynamic(() => import("@/components/advisor/ActivityView"), { ssr: false });
const AdvisorSettingsView = dynamic(() => import("@/components/advisor/AdvisorSettingsView"), { ssr: false });
const AdvisorChatView = dynamic(() => import("@/components/advisor/AdvisorChatView"), { ssr: false });

const VIEW_STACK = [AdvisorView.Overview];

function AdvisorPageContent() {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewFromUrl = searchParams.get("tab") as AdvisorView | null;
  const [activeView, setActiveView] = useState<AdvisorView>(
    viewFromUrl && Object.values(AdvisorView).includes(viewFromUrl as AdvisorView)
      ? (viewFromUrl as AdvisorView)
      : AdvisorView.Overview
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewHistory, setViewHistory] = useState<AdvisorView[]>([AdvisorView.Overview]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [consultations, setConsultations] = useState<AdvisorConsultation[]>([]);
  const [clients, setClients] = useState<AdvisorClient[]>([]);
  const [placements, setPlacements] = useState<AdvisorPlacement[]>([]);
  const [activities, setActivities] = useState<AdvisorActivity[]>([]);

  // Sync activeView with URL search params (e.g., from notification clicks)
  useEffect(() => {
    const view = searchParams.get("tab") as AdvisorView | null;
    if (view && Object.values(AdvisorView).includes(view as AdvisorView)) {
      if (view !== activeView) {
        setActiveView(view);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    advisorApi.getConsultations().then(res => setConsultations(res.data as AdvisorConsultation[])).catch(() => {});
    advisorApi.getClients().then(res => setClients(res.data as AdvisorClient[])).catch(() => {});
    advisorApi.getPlacements().then(res => setPlacements(res.data as AdvisorPlacement[])).catch(() => {});
    advisorApi.getActivities().then(res => setActivities(res.data as AdvisorActivity[])).catch(() => {});
    chatApi.getThreads().then(res => setChatThreads(res.data as ChatThread[])).catch(() => {});
  }, []);

  // Agora Chat: real-time messaging via SDK
  const { isConnected: agoraConnected, agoraMessages, sendMessage: agoraSendMessage, sendFile: agoraSendFile, joinGroup: agoraJoinGroup, agoraAppId } = useAgoraChat(user?.id, user?.name);

  // Agora Chat: sync incoming messages into chatThreads
  useEffect(() => {
    if (!agoraMessages || agoraMessages.size === 0) return;
    setChatThreads((prev) => {
      let changed = false;
      const next = prev.map((t) => {
        const agoraGroupId = `agora-${t.id}`;
        const incoming = agoraMessages.get(agoraGroupId);
        if (!incoming || incoming.length === 0) return t;

        const existingIds = new Set(t.messages.map((m) => m.id));
        const newMsgs = incoming
          .filter((m) => !existingIds.has(m.id))
          .map((m) => agoraMsgToChatMsg(m, user?.id, user?.role));
        if (newMsgs.length === 0) return t;

        changed = true;
        const lastMsg = newMsgs[newMsgs.length - 1];
        const isFromOther = String(lastMsg.senderId) !== user?.id;
        return {
          ...t,
          messages: [...t.messages, ...newMsgs],
          lastMessage: lastMsg.text,
          lastMessageTime: lastMsg.timestamp,
          unreadCount: isFromOther ? t.unreadCount + 1 : t.unreadCount,
        };
      });
      return changed ? next : prev;
    });
  }, [agoraMessages, user?.id]);

  const canGoBack = viewHistory.length > 1;

  const handleSetActiveView = useCallback((view: AdvisorView) => {
    setViewHistory(prev => [...prev, view]);
    setActiveView(view);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", view);
    router.replace(`/advisor?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handleBack = useCallback(() => {
    if (viewHistory.length > 1) {
      const newHistory = viewHistory.slice(0, -1);
      setViewHistory(newHistory);
      setActiveView(newHistory[newHistory.length - 1]);
    }
  }, [viewHistory]);

  const handleSendMessage = useCallback(async (threadId: string, text: string) => {
    const tempMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "advisor",
      senderName: user?.name || "Dr. Fatima Benali",
      senderRole: (user?.role || "advisor") as "advisor",
      text,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
      read: true,
    };
    setChatThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return { ...t, messages: [...t.messages, tempMsg], lastMessage: text, lastMessageTime: tempMsg.timestamp };
    }));

    // PRIMARY: Save to DB via backend API
    try {
      await chatApi.sendMessage(threadId, {
        senderId: user?.id,
        senderName: user?.name,
        senderRole: user?.role,
        text,
      });
    } catch (err) {
      console.error("API sendMessage failed:", err);
    }

    // OPTIONAL: Also send via Agora for real-time delivery
    try {
      const agoraGroupId = `agora-${threadId}`;
      await agoraSendMessage(agoraGroupId, text);
    } catch (err) {
      console.warn("Agora sendMessage failed (non-critical):", err);
    }
  }, [user, agoraSendMessage]);

  const handleSendFile = useCallback(async (threadId: string, file: File) => {
    const tempMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "advisor",
      senderName: user?.name || "Dr. Fatima Benali",
      senderRole: (user?.role || "advisor") as ChatMessage["senderRole"],
      text: `[FILE:${file.name}] sending...`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
      read: true,
    };
    setChatThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return { ...t, messages: [...t.messages, tempMsg], lastMessage: `[File] ${file.name}`, lastMessageTime: tempMsg.timestamp };
    }));
    try {
      // 1. Upload file to backend
      const uploadRes = await chatApi.uploadChatFile(file);
      const fileUrl = uploadRes.data.url;
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isAudio = file.type.startsWith("audio/");
      const fileText = isImage ? `[IMAGE:${file.name}] ${fileUrl}` : isVideo ? `[VIDEO:${file.name}] ${fileUrl}` : isAudio ? `[AUDIO:${file.name}] ${fileUrl}` : `[FILE:${file.name}] ${fileUrl}`;

      // 2. Save message with file URL to DB
      await chatApi.sendMessage(threadId, {
        senderId: user?.id,
        senderName: user?.name,
        senderRole: user?.role,
        text: fileText,
      });

      // Refresh threads
      const res = await chatApi.getThreads();
      setChatThreads(res.data as ChatThread[]);
    } catch (err) {
      console.error("Failed to send file:", err);
    }
  }, [user]);

  const advisorUnreadCounts = useMemo(() => ({
    [AdvisorView.Chat]: chatThreads.reduce((sum, t) => sum + (t.unreadCount || 0), 0),
  }), [chatThreads]);

  const handleMenuToggle = useCallback(() => setSidebarOpen(prev => !prev), []);

  return (
    <AuthGuard permission="advisor_dashboard">
      <div className="bg-background min-h-screen font-sans flex flex-col">
        <AdvisorSidebar activeView={activeView} setActiveView={handleSetActiveView} open={sidebarOpen} setOpen={setSidebarOpen} unreadCounts={advisorUnreadCounts} />

        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar />

          <main className={`flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1440px] mx-auto w-full transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {activeView === AdvisorView.Overview && (
                  <OverviewView
                    consultations={consultations}
                    clients={clients}
                    placements={placements}
                    activities={activities}
                    setActiveView={handleSetActiveView}
                  />
                )}
                {activeView === AdvisorView.Consultations && (
                  <ConsultationsManageView />
                )}
                {activeView === AdvisorView.Clients && (
                  <ClientsView clients={clients} />
                )}
                {activeView === AdvisorView.Placements && (
                  <PlacementsView placements={placements} />
                )}
                {activeView === AdvisorView.Activity && (
                  <ActivityView activities={activities} />
                )}
                {activeView === AdvisorView.Settings && (
                  <AdvisorSettingsView />
                )}
                {activeView === AdvisorView.Chat && (
                  <AdvisorChatView threads={chatThreads} onSendMessage={handleSendMessage} onMarkRead={(threadId) => setChatThreads(prev => prev.map(t => t.id === threadId ? { ...t, unreadCount: 0 } : t))} onSendFile={handleSendFile} agoraAppId={agoraAppId} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function AdvisorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-terracotta-earth border-t-transparent rounded-full animate-spin" /></div>}>
      <AdvisorPageContent />
    </Suspense>
  );
}
