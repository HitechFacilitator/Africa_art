"use client";

import { useState, useEffect } from "react";
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
import AdvisorHeader from "@/components/advisor/AdvisorHeader";
import OverviewView from "@/components/advisor/OverviewView";
import ConsultationsManageView from "@/components/advisor/ConsultationsManageView";
import ClientsView from "@/components/advisor/ClientsView";
import PlacementsView from "@/components/advisor/PlacementsView";
import ActivityView from "@/components/advisor/ActivityView";
import AdvisorSettingsView from "@/components/advisor/AdvisorSettingsView";
import AdvisorChatView from "@/components/advisor/AdvisorChatView";

const VIEW_STACK = [AdvisorView.Overview];

export default function AdvisorPage() {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<AdvisorView>(AdvisorView.Overview);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewHistory, setViewHistory] = useState<AdvisorView[]>([AdvisorView.Overview]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [consultations, setConsultations] = useState<AdvisorConsultation[]>([]);
  const [clients, setClients] = useState<AdvisorClient[]>([]);
  const [placements, setPlacements] = useState<AdvisorPlacement[]>([]);
  const [activities, setActivities] = useState<AdvisorActivity[]>([]);

  useEffect(() => {
    advisorApi.getConsultations().then(res => setConsultations(res.data as AdvisorConsultation[])).catch(() => {});
    advisorApi.getClients().then(res => setClients(res.data as AdvisorClient[])).catch(() => {});
    advisorApi.getPlacements().then(res => setPlacements(res.data as AdvisorPlacement[])).catch(() => {});
    advisorApi.getActivities().then(res => setActivities(res.data as AdvisorActivity[])).catch(() => {});
    chatApi.getThreads().then(res => setChatThreads(res.data as ChatThread[])).catch(() => {});
  }, []);

  useChatSSE({
    "new-message": (data: unknown) => {
      const { threadId, message } = data as { threadId: number; message: { id: string; senderId: string; senderName: string; senderRole: string; text: string; timestamp: string; read: boolean } };
      setChatThreads(prev => prev.map(t => {
        if (t.id !== `thr-${threadId}`) return t;
        const alreadyExists = t.messages.some(m => m.id === message.id);
        if (alreadyExists) return t;
        return { ...t, messages: [...t.messages, { ...message, senderRole: message.senderRole as ChatMessage["senderRole"] }], lastMessage: message.text, lastMessageTime: message.timestamp };
      }));
    },
  });

  const canGoBack = viewHistory.length > 1;

  const handleSetActiveView = (view: AdvisorView) => {
    setViewHistory(prev => [...prev, view]);
    setActiveView(view);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = viewHistory.slice(0, -1);
      setViewHistory(newHistory);
      setActiveView(newHistory[newHistory.length - 1]);
    }
  };

  const handleSendMessage = async (threadId: string, text: string) => {
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
  };

  return (
    <AuthGuard permission="advisor_dashboard">
      <div className="bg-background min-h-screen font-sans flex flex-col">
        <AdvisorSidebar activeView={activeView} setActiveView={handleSetActiveView} open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
          <AdvisorHeader activeView={activeView} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onBack={handleBack} canGoBack={canGoBack} />

          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1440px] mx-auto w-full">
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
                  <ConsultationsManageView consultations={consultations} />
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
                  <AdvisorChatView threads={chatThreads} onSendMessage={handleSendMessage} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
