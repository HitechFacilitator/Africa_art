"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { SupportTab } from "@/lib/supportTypes";
import { chatApi, dashboardApi } from "@/lib/api";
import type { ChatThread } from "@/lib/chatTypes";
import type { ChatMessage } from "@/lib/chatTypes";
import { AnimatePresence, motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";
import { useChatSSE } from "@/lib/useChatSSE";

import SupportSidebar from "@/components/support/SupportSidebar";
import SupportHeader from "@/components/support/SupportHeader";

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
    try {
      const res = await chatApi.sendMessage(threadId, {
        senderId: user?.id,
        senderName: user?.name,
        senderRole: user?.role || "support",
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
          <SupportHeader
            activeTab={activeTab}
            onMenuToggle={handleMenuToggle}
            onBack={handleBack}
            canGoBack={canGoBack}
          />

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
