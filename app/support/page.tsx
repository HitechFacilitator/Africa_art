"use client";

import { useState, useEffect } from "react";
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
import SupportView from "@/components/dashboard/SupportView";
import ChatView from "@/components/dashboard/ChatView";
import SettingsView from "@/components/dashboard/SettingsView";

export default function SupportPage() {
  const { lang } = useTranslate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SupportTab>(SupportTab.Tickets);
  const [viewHistory, setViewHistory] = useState<SupportTab[]>([SupportTab.Tickets]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    chatApi.getThreads().then(res => setChatThreads(res.data as ChatThread[])).catch(() => {});
  }, []);

  useChatSSE({
    "new-message": (data: unknown) => {
      const { threadId, message } = data as { threadId: number; message: { id: string; senderId: string; senderName: string; senderRole: string; text: string; timestamp: string; read: boolean } };
      setChatThreads(prev => prev.map(t => {
        if (t.id !== `thr-${threadId}`) return t;
        const alreadyExists = t.messages.some(m => m.id === message.id);
        if (alreadyExists) return t;
        const isFromOther = message.senderId !== user?.id;
        return { ...t, messages: [...t.messages, { ...message, senderRole: message.senderRole as ChatMessage["senderRole"] }], lastMessage: message.text, lastMessageTime: message.timestamp, unreadCount: isFromOther ? t.unreadCount + 1 : t.unreadCount };
      }));
    },
  });

  const canGoBack = viewHistory.length > 1;

  const handleSetActiveTab = (tab: SupportTab) => {
    setViewHistory(prev => [...prev, tab]);
    setActiveTab(tab);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = viewHistory.slice(0, -1);
      setViewHistory(newHistory);
      setActiveTab(newHistory[newHistory.length - 1]);
    }
  };

  const handleSendMessage = async (threadId: string, text: string) => {
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
  };

  const totalUnreadMessages = chatThreads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

  const defaultProfile = {
    name: user?.name || "Support Staff",
    tier: "Support",
    currency: "EUR (€)",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    curatorName: "Aduna Support Desk",
    regionsOfInterest: ["West Africa", "Central Africa", "East Africa"],
  };

  return (
    <AuthGuard permission="dashboard">
      <div className="bg-background min-h-screen font-sans flex flex-col">
        <SupportSidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          unreadCounts={{
            [SupportTab.Chat]: totalUnreadMessages,
          }}
        />

        <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
          <SupportHeader
            activeTab={activeTab}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onBack={handleBack}
            canGoBack={canGoBack}
          />

          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1440px] mx-auto w-full">
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
