"use client";

import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/translations";
import { AdminView, AdminArtwork, AdminCollector, AdminUser, AdminCertificate, EscrowTransaction, AuditLogEntry } from "@/lib/adminTypes";
import { adminApi, chatApi } from "@/lib/api";
import type { SupportTicket, ChatThread, ChatMessage } from "@/lib/chatTypes";
import type { Inquiry } from "@/lib/dashboardTypes";
import { AnimatePresence, motion } from "motion/react";
import { useChatSSE, useSSE } from "@/lib/useChatSSE";
import { useAgoraChat, agoraMsgToChatMsg } from "@/lib/useAgoraChat";
import { useAuth } from "@/lib/auth";

import AuthGuard from "@/components/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/layout/Navbar";

const ArtworksView = dynamic(() => import("@/components/admin/ArtworksView"), { ssr: false });
const UsersView = dynamic(() => import("@/components/admin/UsersView"), { ssr: false });
const CollectorsView = dynamic(() => import("@/components/admin/CollectorsView"), { ssr: false });
const CertificatesView = dynamic(() => import("@/components/admin/CertificatesView"), { ssr: false });
const EscrowView = dynamic(() => import("@/components/admin/EscrowView"), { ssr: false });
const AuditLogView = dynamic(() => import("@/components/admin/AuditLogView"), { ssr: false });
const ComplianceView = dynamic(() => import("@/components/admin/ComplianceView"), { ssr: false });
const SettingsView = dynamic(() => import("@/components/admin/SettingsView"), { ssr: false });
const SupportManagementView = dynamic(() => import("@/components/admin/SupportManagementView"), { ssr: false });
const ArtworkWizard = dynamic(() => import("@/components/admin/ArtworkWizard"), { ssr: false });
const PORView = dynamic(() => import("@/components/admin/PORView"), { ssr: false });
const ChatView = dynamic(() => import("@/components/dashboard/ChatView"), { ssr: false });

function AdminPageContent() {
  const { lang } = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const viewFromUrl = searchParams.get("tab") as AdminView | null;
  const [activeView, setActiveView] = useState<AdminView>(
    viewFromUrl && Object.values(AdminView).includes(viewFromUrl as AdminView)
      ? (viewFromUrl as AdminView)
      : AdminView.Artworks
  );
  const [viewHistory, setViewHistory] = useState<AdminView[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prefilledArtwork, setPrefilledArtwork] = useState<AdminArtwork | null>(null);

  const [artworks, setArtworks] = useState<AdminArtwork[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [collectors, setCollectors] = useState<AdminCollector[]>([]);
  const [certificates, setCertificates] = useState<AdminCertificate[]>([]);
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [selectedChatThreadId, setSelectedChatThreadId] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);

  // Fetch real data from API
  const fetchAllData = useCallback(() => {
    adminApi.getArtworks().then(res => setArtworks(res.data as AdminArtwork[])).catch(() => {});
    adminApi.getUsers().then(res => setUsers(res.data as AdminUser[])).catch(() => {});
    adminApi.getCollectors().then(res => setCollectors(res.data as AdminCollector[])).catch(() => {});
    adminApi.getCertificates().then(res => setCertificates(res.data as AdminCertificate[])).catch(() => {});
    adminApi.getEscrow().then(res => setEscrows(res.data as EscrowTransaction[])).catch(() => {});
    adminApi.getAuditLogs().then(res => setAuditLogs(res.data as AuditLogEntry[])).catch(() => {});
    adminApi.getSupportTickets().then(res => setSupportTickets(res.data as SupportTicket[])).catch(() => {});
    adminApi.getInquiries().then(res => setInquiries(res.data as Inquiry[])).catch(() => {});
    chatApi.getThreads().then(res => setChatThreads(res.data as ChatThread[])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const threadFromUrl = searchParams.get("thread");
    if (threadFromUrl) {
      setSelectedChatThreadId(threadFromUrl);
      if (activeView !== AdminView.Chat) {
        navigateView(AdminView.Chat);
      }
    }
  }, [searchParams]);

  // Ticket updates still via SSE (tickets are unchanged)
  useChatSSE({
    "ticket-update": (data: unknown) => {
      const { ticketId, response } = data as { ticketId: number; response?: { author: string; text: string; timestamp: string } };
      setSupportTickets(prev => prev.map(t => {
        const numId = parseInt(t.id.replace("tkt-", ""), 10);
        if (numId !== ticketId) return t;
        if (response) {
          const alreadyExists = t.responses.some(r => r.timestamp === response.timestamp && r.text === response.text);
          if (alreadyExists) return t;
          return { ...t, responses: [...t.responses, response], lastUpdate: new Date().toISOString().slice(0, 10) };
        }
        return t;
      }));
    },
    "new-message": () => {
      // Re-fetch threads when a new message is saved via API (backup for Agora)
      chatApi.getThreads().then(res => setChatThreads(res.data as ChatThread[])).catch(() => {});
    },
  });

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

  // Real-time SSE: inquiry updates, consultation updates
  useSSE("/api/v1/events", {
    "inquiry-update": (data: unknown) => {
      const { inquiryId, message } = data as { inquiryId: number; message?: { sender: string; text: string; timestamp: string } };
      if (message) {
        setInquiries(prev => prev.map(inq => {
          const numId = parseInt(inq.id.replace("inq-", ""), 10);
          if (numId !== inquiryId) return inq;
          const alreadyExists = inq.messages.some(m => m.timestamp === message.timestamp && m.text === message.text);
          if (alreadyExists) return inq;
          return { ...inq, messages: [...inq.messages, message as Inquiry["messages"][0]] };
        }));
      }
    },
    "consultation-update": () => {
      // Consultation status changed — no admin consultation view but keep data fresh
    },
  });

  const canGoBack = viewHistory.length > 0;

  const handleBack = () => {
    if (viewHistory.length === 0) return;
    const prev = viewHistory[viewHistory.length - 1];
    setViewHistory((h) => h.slice(0, -1));
    setActiveView(prev);
  };

  const navigateView = useCallback((view: AdminView) => {
    setViewHistory((prev) => [...prev, activeView]);
    setActiveView(view);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", view);
    router.replace(`/admin?${params.toString()}`, { scroll: false });
  }, [activeView, router, searchParams]);

  const appendAudit = useCallback((user: string, action: string) => {
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        user,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        action,
        txHash: `0x${Math.floor(Math.random() * 0xffffff).toString(16).padStart(4, "0")}...${Math.floor(Math.random() * 0xffffff).toString(16).padStart(4, "0")}`,
        signed: false,
      },
      ...prev,
    ]);
  }, []);

  const handleAddArtwork = (artwork: AdminArtwork) => {
    setEditingArtworkId(null);
    setWizardOpen(true);
  };

  const handleEditArtwork = (id: string) => {
    setEditingArtworkId(id);
    setWizardOpen(true);
  };

  const handleWizardComplete = () => {
    setWizardOpen(false);
    setEditingArtworkId(null);
    fetchAllData();
  };

  const handleDeleteArtwork = async (id: string) => {
    const art = artworks.find((a) => a.id === id);
    try {
      await adminApi.deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
      if (art) appendAudit("Julien D.", `Artwork archived: ${art.id} — ${art.title}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdateArtworkStatus = async (id: string, status: AdminArtwork["status"]) => {
    try {
      await adminApi.updateArtworkStatus(id, status);
      appendAudit("Julien D.", `Artwork ${id} status changed to ${status}`);
      fetchAllData();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleAddCollector = (collector: AdminCollector) => {
    setCollectors((prev) => [collector, ...prev]);
    appendAudit("Helena S.", `New collector enrolled: ${collector.id} — ${collector.name}`);
  };

  const handleUpdateUserStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateUserStatus(id, status);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      appendAudit("Admin", `User ${id} status changed to ${status}`);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const u = users.find((usr) => usr.id === id);
    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((usr) => usr.id !== id));
      if (u) appendAudit("Admin", `User deleted: ${u.id} — ${u.name}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleRevokeCertificate = async (id: string) => {
    try {
      await adminApi.revokeCertificate(id);
      setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Revoked" as const } : c)));
      appendAudit("Admin", `Certificate ${id} revoked`);
    } catch (err) {
      console.error("Revoke failed:", err);
    }
  };

  const handleCreateCertificate = (_cert: AdminCertificate) => {
    fetchAllData();
    appendAudit("Admin", `Certificate created`);
  };

  const handleUpdateCertificate = (_id: string, _data: Partial<AdminCertificate>) => {
    fetchAllData();
    appendAudit("Admin", `Certificate ${_id} updated`);
  };

  const handleDeleteCertificate = async (id: string) => {
    const c = certificates.find((cert) => cert.id === id);
    try {
      await adminApi.deleteCertificate(id);
      setCertificates((prev) => prev.filter((cert) => cert.id !== id));
      if (c) appendAudit("Admin", `Certificate deleted: ${c.id} — ${c.artworkTitle}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleToggleAML = (id: string) => {
    setCollectors((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next =
          c.amlStatus === "Verified"
            ? ("Pending" as const)
            : c.amlStatus === "Pending"
            ? ("Unverified" as const)
            : ("Verified" as const);
        return { ...c, amlStatus: next };
      })
    );
    appendAudit("Helena S.", `AML status cycled for ${id}`);
  };

  const handleReleaseEscrow = async (id: string) => {
    try {
      await adminApi.releaseEscrow(id);
      fetchAllData();
      appendAudit("Julien D.", `Escrow ${id} funds released and disbursed`);
    } catch (err) {
      console.error("Release escrow failed:", err);
    }
  };

  const handleDisputeEscrow = async (id: string) => {
    try {
      await adminApi.disputeEscrow(id);
      fetchAllData();
      appendAudit("Julien D.", `Escrow ${id} dispute initiated`);
    } catch (err) {
      console.error("Dispute escrow failed:", err);
    }
  };

  const handleRefundEscrow = async (id: string) => {
    try {
      await adminApi.refundEscrow(id);
      fetchAllData();
      appendAudit("Julien D.", `Escrow ${id} refund processed`);
    } catch (err) {
      console.error("Refund escrow failed:", err);
    }
  };

  const handleVerifyLog = async (id: string) => {
    try {
      await adminApi.verifyAuditLog(id);
      setAuditLogs((prev) =>
        prev.map((l) => (l.id === id ? { ...l, signed: true } : l))
      );
    } catch (err) {
      console.error("Verify log failed:", err);
    }
  };

  const handleVerifyAll = async () => {
    try {
      await adminApi.verifyAllAuditLogs();
      setAuditLogs((prev) => prev.map((l) => ({ ...l, signed: true })));
    } catch (err) {
      console.error("Verify all failed:", err);
    }
  };

  const handleRiskScan = (artwork: AdminArtwork) => {
    setPrefilledArtwork(artwork);
  };

  const handleComplianceScan = (artwork: AdminArtwork) => {
    appendAudit("Julien D.", `Compliance scan initiated for ${artwork.id}`);
  };

  const handleUpdateTicketStatus = async (id: string, status: SupportTicket["status"]) => {
    try {
      await adminApi.updateSupportTicketStatus(id, status);
      setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, status, lastUpdate: new Date().toISOString().slice(0, 10) } : t));
      appendAudit("Julien D.", `Support ticket ${id} status changed to ${status}`);
    } catch (err) {
      console.error("Update ticket status failed:", err);
    }
  };

  const handleAddTicketResponse = async (id: string, text: string) => {
    try {
      await adminApi.addSupportTicketResponse(id, text);
      setSupportTickets(prev => prev.map(t => {
        if (t.id !== id) return t;
        return {
          ...t,
          responses: [...t.responses, { author: "Admin", text, timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC" }],
          lastUpdate: new Date().toISOString().slice(0, 10),
        };
      }));
    } catch (err) {
      console.error("Add ticket response failed:", err);
    }
  };

  const handleSendMessage = useCallback(async (threadId: string, text: string) => {
    const tempMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "admin",
      senderName: user?.name || "Admin",
      senderRole: (user?.role || "admin") as "admin",
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
      senderId: user?.id || "admin",
      senderName: user?.name || "Admin",
      senderRole: (user?.role || "admin") as ChatMessage["senderRole"],
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

  const adminUnreadCounts = useMemo(() => ({
    [AdminView.SupportManagement]: supportTickets.filter(t => t.status === "Open" || t.status === "In Progress").length,
    [AdminView.Chat]: chatThreads.reduce((sum, t) => sum + (t.unreadCount || 0), 0),
  }), [supportTickets, chatThreads]);

  const handleMenuToggle = useCallback(() => setSidebarOpen(prev => !prev), []);

  return (
    <AuthGuard permission="admin_panel">
      <div className="bg-parchment-ivory min-h-screen font-sans flex flex-col">
        <AdminSidebar activeView={activeView} setActiveView={navigateView} open={sidebarOpen} setOpen={setSidebarOpen} unreadCounts={adminUnreadCounts} />

        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1440px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {activeView === AdminView.Artworks && (
                  <ArtworksView
                    artworks={artworks}
                    auditLogs={auditLogs}
                    onAddArtwork={handleAddArtwork}
                    onEditArtwork={handleEditArtwork}
                    onDeleteArtwork={handleDeleteArtwork}
                    onUpdateStatus={handleUpdateArtworkStatus}
                    onRiskScan={handleRiskScan}
                    setActiveView={navigateView}
                  />
                )}
                {activeView === AdminView.Collectors && (
                  <CollectorsView
                    collectors={collectors}
                    onAddCollector={handleAddCollector}
                    onToggleAML={handleToggleAML}
                  />
                )}
                {activeView === AdminView.Users && (
                  <UsersView
                    users={users}
                    onUpdateStatus={handleUpdateUserStatus}
                    onDelete={handleDeleteUser}
                  />
                )}
                {activeView === AdminView.Certificates && (
                  <CertificatesView
                    certificates={certificates}
                    onCreate={handleCreateCertificate}
                    onUpdate={handleUpdateCertificate}
                    onRevoke={handleRevokeCertificate}
                    onDelete={handleDeleteCertificate}
                  />
                )}
                {activeView === AdminView.Escrow && (
                  <EscrowView
                    transactions={escrows}
                    onRelease={handleReleaseEscrow}
                    onDispute={handleDisputeEscrow}
                    onRefund={handleRefundEscrow}
                  />
                )}
                {activeView === AdminView.AuditLog && (
                  <AuditLogView
                    logs={auditLogs}
                    onVerify={handleVerifyLog}
                    onVerifyAll={handleVerifyAll}
                  />
                )}
                {activeView === AdminView.Compliance && (
                  <ComplianceView
                    artworks={artworks}
                    prefilledArtwork={prefilledArtwork}
                    onScan={handleComplianceScan}
                  />
                )}
                {activeView === AdminView.Settings && <SettingsView />}
                {activeView === AdminView.SupportManagement && (
                  <SupportManagementView
                    tickets={supportTickets}
                    onUpdateStatus={handleUpdateTicketStatus}
                    onAddResponse={handleAddTicketResponse}
                  />
                )}
                {activeView === AdminView.POR && <PORView />}
                {activeView === AdminView.Chat && (
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
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      {wizardOpen && (
        <ArtworkWizard
          artworkId={editingArtworkId}
          onClose={() => { setWizardOpen(false); setEditingArtworkId(null); }}
          onComplete={handleWizardComplete}
        />
      )}
    </AuthGuard>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-parchment-ivory flex items-center justify-center"><div className="w-8 h-8 border-2 border-terracotta-earth border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminPageContent />
    </Suspense>
  );
}
