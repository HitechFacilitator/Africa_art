"use client";

import { useState, useCallback } from "react";
import { useTranslate } from "@/lib/translations";
import { AdminView, AdminArtwork, AdminCollector, EscrowTransaction, AuditLogEntry } from "@/lib/adminTypes";
import { INITIAL_ADMIN_ARTWORKS, INITIAL_ADMIN_COLLECTORS, INITIAL_ESCROW, INITIAL_AUDIT_LOGS } from "@/lib/adminData";
import { AnimatePresence, motion } from "motion/react";
import { FileText, HelpCircle } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import ArtworksView from "@/components/admin/ArtworksView";
import CollectorsView from "@/components/admin/CollectorsView";
import EscrowView from "@/components/admin/EscrowView";
import AuditLogView from "@/components/admin/AuditLogView";
import ComplianceView from "@/components/admin/ComplianceView";
import SettingsView from "@/components/admin/SettingsView";

export default function AdminPage() {
  const { lang } = useTranslate();
  const [activeView, setActiveView] = useState<AdminView>(AdminView.Artworks);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [prefilledArtwork, setPrefilledArtwork] = useState<AdminArtwork | null>(null);

  const [artworks, setArtworks] = useState<AdminArtwork[]>(INITIAL_ADMIN_ARTWORKS);
  const [collectors, setCollectors] = useState<AdminCollector[]>(INITIAL_ADMIN_COLLECTORS);
  const [escrows, setEscrows] = useState<EscrowTransaction[]>(INITIAL_ESCROW);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

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

  return (
    <div className="bg-background text-ebony-deep min-h-screen font-sans flex flex-col">
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      <main className="flex-1 lg:ml-64 bg-background min-h-screen px-4 sm:px-8 lg:px-12 py-12 lg:py-16 pt-20 lg:pt-16 max-w-7xl mx-auto w-full">
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
                setActiveView={setActiveView}
              />
            )}
            {activeView === AdminView.Collectors && (
              <CollectorsView
                collectors={collectors}
                onAddCollector={handleAddCollector}
                onToggleAML={handleToggleAML}
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
            {activeView === AdminView.Docs && <DocsView />}
            {activeView === AdminView.Support && <SupportView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function DocsView() {
  const { lang } = useTranslate();
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-6">{lang === "fr" ? "Documentation" : "Documentation"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6">
          <FileText className="w-8 h-8 text-gold-leaf mb-3" />
            <h3 className="font-serif text-lg font-medium text-ebony-deep mb-2">
            {lang === "fr" ? "Aperçu du Protocole" : "Protocol Overview"}
          </h3>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            The Aduna Gallery ledger system uses a multi-signature escrow protocol for all
            high-value transactions. Each artwork is registered with a cryptographic provenance
            hash that tracks its full ownership chain.
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6">
          <FileText className="w-8 h-8 text-gold-leaf mb-3" />
            <h3 className="font-serif text-lg font-medium text-ebony-deep mb-2">
            {lang === "fr" ? "Standards de Provenance" : "Provenance Standards"}
          </h3>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            All provenance records must comply with the UNESCO 1970 Convention and UNIDROIT
            1995 Convention. Artifacts require verified export permits from source countries
            and clearance from national heritage commissions.
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6">
          <FileText className="w-8 h-8 text-gold-leaf mb-3" />
            <h3 className="font-serif text-lg font-medium text-ebony-deep mb-2">
            {lang === "fr" ? "Séquestre Multi-Sig" : "Multi-Sig Escrow"}
          </h3>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Escrow contracts require dual authentication from both buyer and seller before
            fund release. The system maintains a cryptographic audit trail of all state
            transitions for regulatory compliance.
          </p>
        </div>
      </div>
    </div>
  );
}

function SupportView() {
  const { lang } = useTranslate();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setMessage("");
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-6">{lang === "fr" ? "Demande de Support" : "Support Request"}</h2>
      <div className="max-w-xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <p className="font-sans text-xs text-on-surface-variant mb-4">
          {lang === "fr" ? "Soumettre un ticket de support à l'équipe technique d'Aduna Gallery. Délai de réponse : dans les 24 heures ouvrables." : "Submit a support ticket to the Aduna Gallery technical team. Response time: within 24 business hours."}
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder={lang === "fr" ? "Décrivez votre problème ou demande..." : "Describe your issue or request..."}
          className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf resize-none mb-4"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2.5 bg-ebony-deep text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          {submitted ? (lang === "fr" ? "Ticket Soumis" : "Ticket Submitted") : (lang === "fr" ? "Soumettre le Ticket" : "Submit Ticket")}
        </button>
      </div>
    </div>
  );
}
