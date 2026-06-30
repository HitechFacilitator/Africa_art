"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { SupportTab } from "@/lib/supportTypes";
import { chatApi, dashboardApi } from "@/lib/api";
import type { ChatThread, ChatMessage } from "@/lib/chatTypes";
import { AnimatePresence, motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";
import { useAgoraChat, agoraMsgToChatMsg } from "@/lib/useAgoraChat";

import SupportSidebar from "@/components/support/SupportSidebar";
import Navbar from "@/components/layout/Navbar";

const SupportView = dynamic(() => import("@/components/dashboard/SupportView"), { ssr: false });
const ChatView = dynamic(() => import("@/components/dashboard/ChatView"), { ssr: false });
const SettingsView = dynamic(() => import("@/components/dashboard/SettingsView"), { ssr: false });

function SupportPageContent() {
  const { lang } = useTranslate();
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as SupportTab | null;
  const [activeTab, setActiveTab] = useState<SupportTab>(
    tabFromUrl && Object.values(SupportTab).includes(tabFromUrl as SupportTab)
      ? (tabFromUrl as SupportTab)
      : SupportTab.Tickets
  );
  const [viewHistory, setViewHistory] = useState<SupportTab[]>([SupportTab.Tickets]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [selectedChatThreadId, setSelectedChatThreadId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("light");

  // Sync activeTab with URL search params (e.g., from notification clicks)
  useEffect(() => {
    const tab = searchParams.get("tab") as SupportTab | null;
    if (tab && Object.values(SupportTab).includes(tab as SupportTab)) {
      if (tab !== activeTab) {
        setActiveTab(tab);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const threadFromUrl = searchParams.get("thread");
    if (threadFromUrl) {
      setSelectedChatThreadId(threadFromUrl);
      if (activeTab !== SupportTab.Chat) {
        handleSetActiveTab(SupportTab.Chat);
      }
    }
  }, [searchParams]);

  useEffect(() => {
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

  const handleSetActiveTab = useCallback((tab: SupportTab) => {
    setViewHistory(prev => [...prev, tab]);
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/support?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handleBack = useCallback(() => {
    if (viewHistory.length > 1) {
      const newHistory = viewHistory.slice(0, -1);
      setViewHistory(newHistory);
      setActiveTab(newHistory[newHistory.length - 1]);
    }
  }, [viewHistory]);

  const handleSendMessage = useCallback(async (threadId: string, text: string) => {
    const tempMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "support",
      senderName: user?.name || "Support",
      senderRole: (user?.role || "support") as "support",
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
      senderId: user?.id || "support",
      senderName: user?.name || "Support",
      senderRole: (user?.role || "support") as ChatMessage["senderRole"],
      text: `[FILE] ${file.name}`,
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

  const handleCreateThread = useCallback(async (subject: string) => {
    try {
      await chatApi.createThread({
        subject,
        clientName: user?.name || "User",
        clientRole: user?.role || "collector",
      });
      // Refresh threads
      chatApi.getThreads().then(res => setChatThreads(res.data as ChatThread[])).catch(() => {});
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  }, [user]);

  const totalUnreadMessages = useMemo(() => chatThreads.reduce((sum, t) => sum + (t.unreadCount || 0), 0), [chatThreads]);

  const supportUnreadCounts = useMemo(() => ({
    [SupportTab.Chat]: totalUnreadMessages,
  }), [totalUnreadMessages]);

  const handleMenuToggle = useCallback(() => setSidebarOpen(prev => !prev), []);

  const defaultProfile = useMemo(() => ({
    name: user?.name || "Support Staff",
    tier: "Support",
    currency: "EUR (€)",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    curatorName: "Aduna Support Desk",
    regionsOfInterest: ["West Africa", "Central Africa", "East Africa"],
  }), [user]);

  return (
    <AuthGuard permission="support_panel">
      <div className="bg-background min-h-screen font-sans flex flex-col">
        <SupportSidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          unreadCounts={supportUnreadCounts}
        />

        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar />

          <main className={`flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1440px] mx-auto w-full transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === SupportTab.Tickets && (
                  <SupportView lang={lang} />
                )}
                {activeTab === SupportTab.Chat && (
                  <ChatView
                    threads={chatThreads}
                    onSendMessage={handleSendMessage}
                    onMarkRead={(threadId) => setChatThreads(prev => prev.map(t => t.id === threadId ? { ...t, unreadCount: 0 } : t))}
                    selectedThreadId={selectedChatThreadId}
                    onSelectThread={setSelectedChatThreadId}
                    onCreateThread={handleCreateThread}
                    onSendFile={handleSendFile}
                    agoraAppId={agoraAppId}
                    canCreateThread={user?.role === "admin" || user?.role === "advisor"}
                  />
                )}
                {activeTab === SupportTab.Settings && (
                  <SettingsView
                    profile={defaultProfile}
                    setProfile={() => {}}
                    onClearCache={() => {}}
                    theme={theme}
                    onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-terracotta-earth border-t-transparent rounded-full animate-spin" /></div>}>
      <SupportPageContent />
    </Suspense>
  );
}
