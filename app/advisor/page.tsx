"use client";

import { useState } from "react";
import { AdvisorView } from "@/lib/advisorTypes";
import { INITIAL_CONSULTATIONS, INITIAL_CLIENTS, INITIAL_PLACEMENTS, INITIAL_ADVISOR_ACTIVITY } from "@/lib/advisorData";
import { INITIAL_CHAT_THREADS } from "@/lib/chatData";
import { AnimatePresence, motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
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
  const [chatThreads, setChatThreads] = useState(INITIAL_CHAT_THREADS);

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

  const handleSendMessage = (threadId: string, text: string) => {
    setChatThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId: user?.id || "advisor",
        senderName: user?.name || "Dr. Fatima Benali",
        senderRole: (user?.role || "advisor") as "advisor",
        text,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        read: true,
      };
      return { ...t, messages: [...t.messages, newMsg], lastMessage: text, lastMessageTime: newMsg.timestamp };
    }));
  };

  return (
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
                  consultations={INITIAL_CONSULTATIONS}
                  clients={INITIAL_CLIENTS}
                  placements={INITIAL_PLACEMENTS}
                  activities={INITIAL_ADVISOR_ACTIVITY}
                  setActiveView={handleSetActiveView}
                />
              )}
              {activeView === AdvisorView.Consultations && (
                <ConsultationsManageView consultations={INITIAL_CONSULTATIONS} />
              )}
              {activeView === AdvisorView.Clients && (
                <ClientsView clients={INITIAL_CLIENTS} />
              )}
              {activeView === AdvisorView.Placements && (
                <PlacementsView placements={INITIAL_PLACEMENTS} />
              )}
              {activeView === AdvisorView.Activity && (
                <ActivityView activities={INITIAL_ADVISOR_ACTIVITY} />
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
  );
}
