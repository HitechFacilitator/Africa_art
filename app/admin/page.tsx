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
import ArtworkWizard from "@/components/admin/ArtworkWizard";
import PORView from "@/components/admin/PORView";

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
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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

  return (
    <AuthGuard permission="admin_panel">
      <div className="bg-parchment-ivory min-h-screen font-sans flex flex-col">
        <AdminSidebar activeView={activeView} setActiveView={(view) => { setViewHistory((prev) => [...prev, activeView]); setActiveView(view); }} open={sidebarOpen} setOpen={setSidebarOpen} unreadCounts={{
          [AdminView.SupportManagement]: supportTickets.filter(t => t.status === "Open" || t.status === "In Progress").length,
        }} />

        <div className="flex-1 min-h-screen flex flex-col">
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
