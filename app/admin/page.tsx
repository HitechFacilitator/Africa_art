"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslate } from "@/lib/translations";
import { AdminView, AdminArtwork, AdminCollector, AdminUser, AdminCertificate, EscrowTransaction, AuditLogEntry } from "@/lib/adminTypes";
import { adminApi } from "@/lib/api";
import type { SupportTicket } from "@/lib/chatTypes";
import { AnimatePresence, motion } from "motion/react";

import AuthGuard from "@/components/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ArtworksView from "@/components/admin/ArtworksView";
import UsersView from "@/components/admin/UsersView";
import CollectorsView from "@/components/admin/CollectorsView";
import CertificatesView from "@/components/admin/CertificatesView";
import EscrowView from "@/components/admin/EscrowView";
import AuditLogView from "@/components/admin/AuditLogView";
import ComplianceView from "@/components/admin/ComplianceView";
import SettingsView from "@/components/admin/SettingsView";
import SupportManagementView from "@/components/admin/SupportManagementView";

export default function AdminPage() {
  const { lang } = useTranslate();
  const [activeView, setActiveView] = useState<AdminView>(AdminView.Artworks);
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

  // Fetch real data from API
  useEffect(() => {
    adminApi.getArtworks().then(res => setArtworks(res.data as AdminArtwork[])).catch(() => {});
    adminApi.getUsers().then(res => setUsers(res.data as AdminUser[])).catch(() => {});
    adminApi.getCollectors().then(res => setCollectors(res.data as AdminCollector[])).catch(() => {});
    adminApi.getCertificates().then(res => setCertificates(res.data as AdminCertificate[])).catch(() => {});
    adminApi.getEscrow().then(res => setEscrows(res.data as EscrowTransaction[])).catch(() => {});
    adminApi.getAuditLogs().then(res => setAuditLogs(res.data as AuditLogEntry[])).catch(() => {});
    adminApi.getSupportTickets().then(res => setSupportTickets(res.data as SupportTicket[])).catch(() => {});
  }, []);

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
  }, [activeView]);

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
    setArtworks((prev) => [artwork, ...prev]);
    appendAudit("Julien D.", `New artwork added: ${artwork.id}`);
  };

  const handleDeleteArtwork = (id: string) => {
    const art = artworks.find((a) => a.id === id);
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    if (art) appendAudit("Julien D.", `Artwork archived: ${art.id} — ${art.title}`);
  };

  const handleUpdateArtworkStatus = (id: string, status: AdminArtwork["status"]) => {
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    appendAudit("Julien D.", `Artwork ${id} status changed to ${status}`);
  };

  const handleAddCollector = (collector: AdminCollector) => {
    setCollectors((prev) => [collector, ...prev]);
    appendAudit("Helena S.", `New collector enrolled: ${collector.id} — ${collector.name}`);
  };

  const handleUpdateUserStatus = (id: string, status: AdminUser["status"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    appendAudit("Admin", `User ${id} status changed to ${status}`);
  };

  const handleDeleteUser = (id: string) => {
    const u = users.find((usr) => usr.id === id);
    setUsers((prev) => prev.filter((usr) => usr.id !== id));
    if (u) appendAudit("Admin", `User deleted: ${u.id} — ${u.name}`);
  };

  const handleRevokeCertificate = (id: string) => {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Revoked" as const } : c)));
    appendAudit("Admin", `Certificate ${id} revoked`);
  };

  const handleCreateCertificate = (cert: AdminCertificate) => {
    setCertificates((prev) => [cert, ...prev]);
    appendAudit("Admin", `Certificate created: ${cert.id} — ${cert.artworkTitle}`);
  };

  const handleUpdateCertificate = (id: string, data: Partial<AdminCertificate>) => {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    appendAudit("Admin", `Certificate ${id} updated`);
  };

  const handleDeleteCertificate = (id: string) => {
    const c = certificates.find((cert) => cert.id === id);
    setCertificates((prev) => prev.filter((cert) => cert.id !== id));
    if (c) appendAudit("Admin", `Certificate deleted: ${c.id} — ${c.artworkTitle}`);
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

  const handleReleaseEscrow = (id: string) => {
    setEscrows((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Released" as const, notes: t.notes + " Funds released." } : t))
    );
    appendAudit("Julien D.", `Escrow ${id} funds released and disbursed`);
  };

  const handleDisputeEscrow = (id: string) => {
    setEscrows((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Disputed" as const, notes: t.notes + " Dispute initiated." } : t))
    );
    appendAudit("Julien D.", `Escrow ${id} dispute initiated`);
  };

  const handleRefundEscrow = (id: string) => {
    setEscrows((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Refunded" as const, notes: t.notes + " Refund processed." } : t))
    );
    appendAudit("Julien D.", `Escrow ${id} refund processed`);
  };

  const handleVerifyLog = (id: string) => {
    setAuditLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, signed: true } : l))
    );
  };

  const handleVerifyAll = () => {
    setAuditLogs((prev) => prev.map((l) => ({ ...l, signed: true })));
  };

  const handleRiskScan = (artwork: AdminArtwork) => {
    setPrefilledArtwork(artwork);
  };

  const handleComplianceScan = (artwork: AdminArtwork) => {
    appendAudit("Julien D.", `Compliance scan initiated for ${artwork.id}`);
  };

  const handleUpdateTicketStatus = (id: string, status: SupportTicket["status"]) => {
    setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, status, lastUpdate: new Date().toISOString().slice(0, 10) } : t));
    appendAudit("Julien D.", `Support ticket ${id} status changed to ${status}`);
  };

  const handleAddTicketResponse = (id: string, text: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        responses: [...t.responses, { author: "Admin", text, timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC" }],
        lastUpdate: new Date().toISOString().slice(0, 10),
      };
    }));
  };

  return (
    <AuthGuard permission="admin_panel">
      <div className="bg-parchment-ivory min-h-screen font-sans flex flex-col">
        <AdminSidebar activeView={activeView} setActiveView={(view) => { setViewHistory((prev) => [...prev, activeView]); setActiveView(view); }} open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
          <AdminHeader activeView={activeView} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onBack={handleBack} canGoBack={canGoBack} />

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
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
