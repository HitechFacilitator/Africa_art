"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { AdvisorView, AdvisorConsultation, AdvisorClient, AdvisorPlacement, AdvisorActivity } from "@/lib/advisorTypes";
import { advisorApi, chatApi } from "@/lib/api";
import type { ChatThread } from "@/lib/chatTypes";
import type { ChatMessage } from "@/lib/chatTypes";
import { AnimatePresence, motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";
import { useChatSSE } from "@/lib/useChatSSE";
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

  useChatSSE({
    "new-message": (data: unknown) => {
      const { threadId, message } = data as { threadId: number; message: { id: string; senderId: string | number; senderName: string; senderRole: string; text: string; timestamp: string; read: boolean } };
      setChatThreads(prev => prev.map(t => {
        if (t.id !== `thr-${threadId}`) return t;
        const alreadyExists = t.messages.some(m => m.id === message.id);
        if (alreadyExists) return t;
        const isFromOther = String(message.senderId) !== user?.id;
        return { ...t, messages: [...t.messages, { ...message, senderRole: message.senderRole as ChatMessage["senderRole"] }], lastMessage: message.text, lastMessageTime: message.timestamp, unreadCount: isFromOther ? t.unreadCount + 1 : t.unreadCount };
      }));
    },
  });

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
    try {
      const res = await chatApi.sendMessage(threadId, {
        senderId: user?.id,
        senderName: user?.name,
        senderRole: user?.role || "advisor",
        text,
      });
      const serverMsg = res.data;
      setChatThreads(prev => prev.map(t => {
        if (t.id !== threadId) return t;
        return { ...t, messages: t.messages.map(m => m.id === tempMsg.id ? { ...m, id: serverMsg.id } : m) };
      }));
    } catch (err) {
      console.error("Failed to send message:", err);
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
                  <AdvisorChatView threads={chatThreads} onSendMessage={handleSendMessage} onMarkRead={(threadId) => setChatThreads(prev => prev.map(t => t.id === threadId ? { ...t, unreadCount: 0 } : t))} />
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
