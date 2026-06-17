"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActiveTab, Acquisition, Inquiry, Consultation, LogisticsShipment, SecurityRecord, CollectorProfile } from "@/lib/dashboardTypes";
import { dashboardApi, consultationsApi, chatApi } from "@/lib/api";
import type { ChatThread } from "@/lib/chatTypes";
import type { ChatMessage } from "@/lib/chatTypes";
import { FileText, X, Download, Award, BookLock, Bell, TrendingUp, Eye, Clock, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Gavel, Flame, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";
import { useChatSSE } from "@/lib/useChatSSE";
import { useTranslatedAcquisitions, useTranslatedInquiries, useTranslatedConsultations } from "@/lib/useTranslatedDashboard";

import Sidebar from "@/components/dashboard/Sidebar";
import CollectorHeader from "@/components/dashboard/CollectorHeader";
import DashboardView from "@/components/dashboard/DashboardView";
import PortfolioView from "@/components/dashboard/PortfolioView";
import InquiriesView from "@/components/dashboard/InquiriesView";
import ConsultationsView from "@/components/dashboard/ConsultationsView";
import LogisticsView from "@/components/dashboard/LogisticsView";
import SecurityView from "@/components/dashboard/SecurityView";
import SettingsView from "@/components/dashboard/SettingsView";
import CertificatesView from "@/components/dashboard/CertificatesView";
import ChatView from "@/components/dashboard/ChatView";
import SupportView from "@/components/dashboard/SupportView";

export default function DashboardPage() {
  const { lang } = useTranslate();
  const router = useRouter();
  const { canAccessTab, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Dashboard);
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>([]);
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [logistics, setLogistics] = useState<LogisticsShipment[]>([]);
  const [security, setSecurity] = useState<SecurityRecord[]>([]);
  const [selectedAcquisition, setSelectedAcquisition] = useState<Acquisition | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('light');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const mobileTabsRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard data from API
  useEffect(() => {
    dashboardApi.getAcquisitions().then(res => { const d = res.data as Acquisition[]; setAcquisitions(d); setSelectedAcquisition(d[0] ?? null); }).catch(() => {});
    dashboardApi.getInquiries().then(res => setInquiries(res.data as Inquiry[])).catch(() => {});
    consultationsApi.getMy().then(res => setConsultations(res.data as Consultation[])).catch(() => {});
    dashboardApi.getLogistics().then(res => setLogistics(res.data as LogisticsShipment[])).catch(() => {});
    dashboardApi.getSecurity().then(res => setSecurity(res.data as SecurityRecord[])).catch(() => {});
  }, []);

  // Tab navigation with history tracking
  const navigateTab = (tab: ActiveTab) => {
    if (!canAccessTab(tab)) return;
    setTabHistory(prev => [...prev, activeTab]);
    setActiveTab(tab);
  };

  const goBack = () => {
    if (tabHistory.length === 0) return;
    const prev = tabHistory[tabHistory.length - 1];
    setTabHistory(h => h.slice(0, -1));
    setActiveTab(prev);
  };

  const canGoBack = tabHistory.length > 0;

  const allMobileTabs = [
    { id: ActiveTab.Dashboard, label: lang === "fr" ? "Vue d'ensemble" : "Overview" },
    { id: ActiveTab.Portfolio, label: lang === "fr" ? "Acquisitions" : "Acquisitions" },
    { id: ActiveTab.Certificates, label: lang === "fr" ? "Certificats" : "Certificates" },
    { id: ActiveTab.Inquiries, label: lang === "fr" ? "Demandes" : "Inquiries" },
    { id: ActiveTab.Consultations, label: lang === "fr" ? "Consultations" : "Consultations" },
    { id: ActiveTab.PrivateCatalogues, label: lang === "fr" ? "Catalogues" : "Catalogues" },
    { id: ActiveTab.AlertsAuctions, label: lang === "fr" ? "Alertes" : "Alerts" },
    { id: ActiveTab.Investment, label: lang === "fr" ? "Investissement" : "Investment" },
    { id: ActiveTab.Previews, label: lang === "fr" ? "Aperçus" : "Previews" },
    { id: ActiveTab.Logistics, label: lang === "fr" ? "Logistique" : "Logistics" },
    { id: ActiveTab.Security, label: lang === "fr" ? "Sécurité" : "Security" },
  ];
  const mobileTabs = allMobileTabs.filter(tab => canAccessTab(tab.id));

  const scrollMobileTabs = (direction: "left" | "right") => {
    if (mobileTabsRef.current) {
      const scrollAmount = 150;
      mobileTabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const defaultProfile: CollectorProfile = {
    name: user?.name || "Guest",
    tier: user?.role === "prestige" ? "Prestige Tier" : user?.role === "admin" ? "Admin Tier" : "Member Tier",
    currency: "EUR (€)",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    curatorName: "Aduna Advisory Desk",
    regionsOfInterest: ["West Africa", "Central Africa", "East Africa"],
  };
  const [profile, setProfile] = useState<CollectorProfile>(defaultProfile);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);

  // Fetch chat threads from API
  useEffect(() => {
    chatApi.getThreads().then(res => setChatThreads(res.data as ChatThread[])).catch(() => {});
  }, []);

  // Realtime SSE for new messages
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

  // Auto-translate dynamic data when language changes
  const translatedAcquisitions = useTranslatedAcquisitions(acquisitions);
  const translatedInquiries = useTranslatedInquiries(inquiries);
  const translatedConsultations = useTranslatedConsultations(consultations);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = async (threadId: string, text: string) => {
    const tempMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "collector",
      senderName: user?.name || "Julian Doe",
      senderRole: (user?.role || "collector") as "collector",
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
        senderRole: user?.role || "collector",
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

  const handleClearCache = () => {
    dashboardApi.getAcquisitions().then(res => { const d = res.data as Acquisition[]; setAcquisitions(d); setSelectedAcquisition(d[0] ?? null); }).catch(() => {});
    dashboardApi.getInquiries().then(res => setInquiries(res.data as Inquiry[])).catch(() => {});
    consultationsApi.getMy().then(res => setConsultations(res.data as Consultation[])).catch(() => {});
    dashboardApi.getLogistics().then(res => setLogistics(res.data as LogisticsShipment[])).catch(() => {});
    dashboardApi.getSecurity().then(res => setSecurity(res.data as SecurityRecord[])).catch(() => {});
    setTabHistory([]);
    setActiveTab(ActiveTab.Dashboard);
    alert(lang === "fr" ? "Les métriques d'Aduna Gallery ont été initialisées avec succès aux paramètres par défaut." : 'Aduna Gallery metrics initialized successfully to pristine defaults.');
  };

  const handleExpressInterest = async (artworkTitle: string, year: string) => {
    const existing = inquiries.find(inq => inq.artworkTitle === artworkTitle);
    if (existing) {
      setSelectedInquiryId(existing.id);
      navigateTab(ActiveTab.Inquiries);
      return;
    }
    const initText = `Expressing immediate, confidential interest regarding "${artworkTitle}" (${year}). Please provide full research reports and dispatch options to Geneva.`;
    try {
      const res = await dashboardApi.createInquiry({
        artworkTitle,
        artworkYear: year,
        imageUrl: "",
        messages: [{ sender: "collector", text: initText }],
      });
      const newInquiry = res.data as Inquiry;
      if ((res.data as Record<string, unknown>).existing) {
        setSelectedInquiryId(newInquiry.id);
        navigateTab(ActiveTab.Inquiries);
        return;
      }
      setInquiries(prev => [newInquiry, ...prev]);
      setSelectedInquiryId(newInquiry.id);
      navigateTab(ActiveTab.Inquiries);
    } catch (err) {
      console.error("Failed to create inquiry:", err);
    }
  };

  const handleAddMessage = async (inquiryId: string, text: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, messages: [...inq.messages, { sender: 'collector' as const, text, timestamp: new Date().toISOString() }] };
      }
      return inq;
    }));
    try {
      await dashboardApi.addInquiryMessage(inquiryId, { sender: "collector", text });
    } catch (err) {
      console.error("Failed to send inquiry message:", err);
    }
  };

  const handleAddAcquisition = (newAcq: Acquisition) => {
    setAcquisitions(prev => [newAcq, ...prev]);
    setSelectedAcquisition(newAcq);
    const newSecRecord: SecurityRecord = {
      id: `sec_${Date.now()}`,
      artworkTitle: newAcq.title,
      vaultLocation: 'Geneva Freeport - Chamber IV',
      fingerprintId: `FP-${newAcq.title.substring(0, 4).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      smartContractAddress: `0x${Math.floor(Math.random() * 100000000).toString(16)}...${Math.floor(Math.random() * 10000).toString(16)} (Aduna Registry V2)`,
      lastInspectionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      temperatureHumidity: '20.1°C / 47.8% RH',
      insurancePolicyNumber: `AXA-MUSEUM-${Math.floor(Math.random() * 80000 + 10000)}-M`
    };
    setSecurity(prev => [newSecRecord, ...prev]);
    if (newAcq.status === ('In Transit' as string)) {
      const newShipment: LogisticsShipment = {
        id: `ship_${Date.now()}`,
        artworkTitle: newAcq.title,
        carrier: 'Malca-Amit Premium Art Courier',
        status: 'Origin Hub',
        estimatedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        securityTier: 'Level 5 Armed Vault Transport',
        insuranceCoverage: `€${(newAcq.estimatedValueEur * 1.2).toLocaleString()} Policy`,
        updates: [{
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          status: 'Origin Hub Secured',
          location: 'Fine Art Terminal Logistics, Paris CDG',
          description: 'Item certified securely and packaged inside temperature-shielded carbon boxes. Dual accelerometers activated.'
        }]
      };
      setLogistics(prev => [newShipment, ...prev]);
    }
    alert(lang === "fr" ? `Pièce du Patrimoine Certifiée ! « ${newAcq.title} » a été enregistrée de manière sécurisée sur le serveur principal Aduna et ajoutée à votre portefeuille.` : `Heritage Piece Certified! "${newAcq.title}" has been securely logged on the Aduna mainframe and added to your portfolio.`);
  };

  const handleRemoveAcquisition = (id: string) => {
    setAcquisitions(prev => prev.filter(acq => acq.id !== id));
    setSecurity(prev => prev.filter(sec => sec.id !== id));
    setLogistics(prev => prev.filter(ship => ship.id !== id));
  };

  const handleAddConsultation = (newCons: Consultation) => {
    setConsultations(prev => [newCons, ...prev]);
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handleDownloadReportFile = () => {
    const acqRows = acquisitions.map((acq, index) => `
      <div style="margin-bottom:16px;padding:12px;border:1px solid #e5e5e5">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
          <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;display:block">ID</span><strong>${acq.id}</strong></div>
          <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;display:block">Title</span><strong>${acq.title}</strong></div>
          <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;display:block">Era</span><strong>${acq.era}</strong></div>
          <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;display:block">Culture</span><strong>${acq.culture}</strong></div>
          <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;display:block">Value</span><strong>€${acq.estimatedValueEur.toLocaleString()}</strong></div>
          <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;display:block">Status</span><strong>${acq.status}</strong></div>
        </div>
        ${acq.provenance.length > 0 ? `<div style="margin-top:8px;font-size:11px;color:#555"><strong>Provenance:</strong> ${acq.provenance.join(" → ")}</div>` : ""}
      </div>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Portfolio Report - ${profile.name}</title><style>
      body{font-family:Georgia,serif;color:#0f0f0f;max-width:800px;margin:40px auto;padding:40px;border:2px double #C5A059}
      h1{font-size:24px;text-align:center;text-transform:uppercase;letter-spacing:3px;margin-bottom:6px}
      h2{font-size:11px;text-align:center;color:#785a1a;text-transform:uppercase;letter-spacing:5px;margin-bottom:30px}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:16px 0;font-size:12px}
      .meta span{display:block;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:2px}
      .meta strong{color:#0f0f0f}
      h3{font-size:14px;margin:24px 0 12px;border-bottom:1px solid #e5e5e5;padding-bottom:6px}
      .footer{text-align:center;font-size:9px;color:#aaa;margin-top:40px;letter-spacing:2px;text-transform:uppercase}
      @media print{body{border:none;margin:0;padding:20px}}
    </style></head><body>
      <h1>Collector Portfolio Deed Report</h1>
      <h2>Aduna Gallery — Institutional Ledger Registry</h2>
      <div class="meta">
        <div><span>Collector Account</span><strong>${profile.name} (${profile.tier})</strong></div>
        <div><span>Issued</span><strong>${new Date().toLocaleDateString()}</strong></div>
        <div><span>Total Acquisitions</span><strong>${acquisitions.length} Pieces</strong></div>
        <div><span>Portfolio Value</span><strong>€${(acquisitions.reduce((sum, item) => sum + item.estimatedValueEur, 0) / 1000000).toFixed(1)} Million</strong></div>
      </div>
      <h3>Registered Cabinet Catalog</h3>
      ${acqRows}
      <div style="margin-top:24px;padding:16px;border-left:3px solid #C5A059;font-size:11px;line-height:1.6;color:#555">
        <strong>Certification:</strong> This report acts as a legal certifiable token of ownership index, verified by the Aduna Labs Advisory Board.
      </div>
      <div class="footer">Aduna Gallery — Certified Text Ledger — ${new Date().toISOString().split("T")[0]}</div>
    </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
  };

  const totalValueEur = acquisitions.reduce((acc, item) => acc + item.estimatedValueEur, 0);

  return (
    <AuthGuard permission="dashboard">
    <div className="bg-surface text-ebony-deep min-h-screen font-sans flex flex-col transition-all duration-300 overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={navigateTab} profile={profile} isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} open={sidebarOpen} setOpen={setSidebarOpen} onLogout={() => {
        if (confirm(lang === "fr" ? "Révoquer la session de placement privé ? Les paramètres et fichiers de portefeuille persisteront dans le stockage local sécurisé." : 'De-authorize private placement session? Settings and portfolio files will persist in secure local storage.')) {
          logout();
        }
      }} />

      <CollectorHeader activeTab={activeTab} onBack={goBack} canGoBack={canGoBack} onMenuToggle={() => setSidebarOpen(true)} />

      {/* Mobile Horizontal Tabs */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-surface border-b border-ebony-deep/5">
        <div className="relative flex items-center">
          <button
            onClick={() => scrollMobileTabs("left")}
            className="absolute left-0 z-10 p-2 bg-surface border-r border-on-surface/10 text-on-surface-variant hover:text-ebony-deep cursor-pointer border-0"
          >
            <ChevronLeft size={16} />
          </button>
          <div
            ref={mobileTabsRef}
            className="flex gap-0 overflow-x-auto no-scrollbar px-8 py-0"
          >
            {mobileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateTab(tab.id)}
                className={`px-3 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all cursor-pointer bg-transparent shrink-0 ${
                  activeTab === tab.id
                    ? "text-ebony-deep border-gold-leaf"
                    : "text-on-surface-variant/60 border-transparent hover:text-ebony-deep"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollMobileTabs("right")}
            className="absolute right-0 z-10 p-2 bg-surface border-l border-on-surface/10 text-on-surface-variant hover:text-ebony-deep cursor-pointer border-0"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <main className={`flex-1 bg-background min-h-screen px-6 sm:px-10 lg:px-12 py-12 lg:py-16 pt-28 lg:pt-16 w-full overflow-hidden transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {activeTab === ActiveTab.Dashboard && (
              <DashboardView acquisitions={translatedAcquisitions} onExpressInterest={handleExpressInterest} setActiveTab={navigateTab} setSelectedAcquisition={(acq) => { setSelectedAcquisition(acq); navigateTab(ActiveTab.Portfolio); }} onExportReport={handleExportReport} />
            )}
            {activeTab === ActiveTab.Portfolio && (
              <PortfolioView acquisitions={translatedAcquisitions} onAddAcquisition={handleAddAcquisition} onRemoveAcquisition={handleRemoveAcquisition} selectedAcquisition={selectedAcquisition} setSelectedAcquisition={setSelectedAcquisition} />
            )}
            {activeTab === ActiveTab.Inquiries && (
              <InquiriesView inquiries={translatedInquiries} onAddMessage={handleAddMessage} selectedInquiryId={selectedInquiryId} setSelectedInquiryId={setSelectedInquiryId} />
            )}
            {activeTab === ActiveTab.Consultations && (
              <ConsultationsView consultations={translatedConsultations} onAddConsultation={handleAddConsultation} />
            )}
            {activeTab === ActiveTab.Logistics && (
              <LogisticsView shipments={logistics} />
            )}
            {activeTab === ActiveTab.Security && (
              <SecurityView records={security} />
            )}
            {activeTab === ActiveTab.Settings && (
              <SettingsView profile={profile} setProfile={setProfile} onClearCache={handleClearCache} theme={theme} onToggleTheme={handleToggleTheme} />
            )}
            {activeTab === ActiveTab.Certificates && (
              <CertificatesView />
            )}
            {activeTab === ActiveTab.Chat && (
              <ChatView threads={chatThreads} onSendMessage={handleSendMessage} />
            )}
            {activeTab === ActiveTab.Documentation && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Documentation" : "Documentation"}</h2>
                  <p className="font-sans text-sm text-on-surface-variant mt-1">{lang === "fr" ? "Guides, protocoles et références pour les collectionneurs." : "Guides, protocols, and references for collectors."}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface-container-low border border-on-surface/5 p-6">
                    <FileText className="w-8 h-8 text-terracotta-earth mb-3" />
                    <h3 className="font-serif text-lg text-ebony-deep mb-2">{lang === "fr" ? "Aperçu du Protocole" : "Protocol Overview"}</h3>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{lang === "fr" ? "Le système de registre Aduna Gallery utilise un protocole de séquestre à signature multiple pour toutes les transactions de grande valeur." : "The Aduna Gallery ledger system uses a multi-signature escrow protocol for all high-value transactions."}</p>
                  </div>
                  <div className="bg-surface-container-low border border-on-surface/5 p-6">
                    <FileText className="w-8 h-8 text-terracotta-earth mb-3" />
                    <h3 className="font-serif text-lg text-ebony-deep mb-2">{lang === "fr" ? "Standards de Provenance" : "Provenance Standards"}</h3>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{lang === "fr" ? "Tous les enregistrements de provenance doivent être conformes à la Convention de l'UNESCO de 1970 et à la Convention d'UNIDROIT de 1995." : "All provenance records must comply with the UNESCO 1970 Convention and UNIDROIT 1995 Convention."}</p>
                  </div>
                  <div className="bg-surface-container-low border border-on-surface/5 p-6">
                    <FileText className="w-8 h-8 text-terracotta-earth mb-3" />
                    <h3 className="font-serif text-lg text-ebony-deep mb-2">{lang === "fr" ? "Séquestre Multi-Sig" : "Multi-Sig Escrow"}</h3>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{lang === "fr" ? "Les contrats de séquestre nécessitent une double authentification de l'acheteur et du vendeur avant le déblocage des fonds." : "Escrow contracts require dual authentication from both buyer and seller before fund release."}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === ActiveTab.Support && (
              <SupportView lang={lang} />
            )}
            {activeTab === ActiveTab.PrivateCatalogues && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Catalogues Privés" : "Private Catalogues"}</h2>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">{lang === "fr" ? "Accès exclusif aux œuvres inédites et confidentielles." : "Exclusive access to unpublished and confidential artworks."}</p>
                  </div>
                  <Link href="/catalogue/private" className="bg-ebony-deep text-parchment-ivory px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center gap-2">
                    {lang === "fr" ? "Parcourir les Catalogues" : "Browse Catalogues"} <ExternalLink size={12} />
                  </Link>
                </div>
                <div className="bg-surface-container-low border border-on-surface/5 p-8 text-center">
                  <BookLock className="w-12 h-12 text-gold-leaf mx-auto mb-4" />
                  <h3 className="font-serif text-lg text-ebony-deep mb-2">{lang === "fr" ? "Accès à la Coffre-fort Requis" : "Vault Access Required"}</h3>
                  <p className="font-sans text-xs text-on-surface-variant max-w-md mx-auto mb-4">
                    {lang === "fr" ? "Les catalogues privés contiennent des chefs-d'œuvre inédits disponibles exclusivement aux collectionneurs vérifiés. L'accès nécessite une vérification du niveau VIP." : "Private catalogues contain unpublished masterpieces available exclusively to vetted collectors. Access requires VIP tier verification."}
                  </p>
                  <Link href="/catalogue/private" className="inline-flex items-center gap-2 text-gold-leaf font-sans text-xs font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors">
                    {lang === "fr" ? "Entrer dans le Coffre-fort Privé" : "Enter Private Vault"} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
            {activeTab === ActiveTab.AlertsAuctions && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Alertes & Ventes aux Enchères" : "Alerts & Auctions"}</h2>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">{lang === "fr" ? "Notifications de ventes en direct, enchères en cours et pièces correspondant à vos centres d'intérêt." : "Live auction notifications, ongoing bids, and pieces matching your collection interests."}</p>
                  </div>
                  <Link href="/auctions" className="bg-ebony-deep text-parchment-ivory px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center gap-2 self-start">
                    {lang === "fr" ? "Entrer dans la Salle des Ventes" : "Enter Auction Room"} <ExternalLink size={12} />
                  </Link>
                </div>

                {/* Live Auction Hero Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative bg-ebony-deep overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_70%_50%,_#C5A059_0%,_transparent_60%)]" />
                  <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-earth opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-terracotta-earth"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-earth">{lang === "fr" ? "En Direct Maintenant" : "Live Now"}</span>
                      </div>
                      <h3 className="font-serif text-xl text-parchment-ivory mb-1">Benin Bronze Plaque — Lot #1</h3>
                      <p className="text-xs text-parchment-ivory/50">{lang === "fr" ? "14 offres · 89 observateurs · Se termine dans 2h 14m" : "14 bids · 89 watchers · Ends in 2h 14m"}</p>
                    </div>
                    <Link href="/auctions" className="bg-terracotta-earth text-parchment-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors flex items-center gap-2 shrink-0">
                      <Gavel size={14} /> {lang === "fr" ? "Enchérir" : "Place Bid"}
                    </Link>
                  </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: lang === "fr" ? "Ventes Actives" : "Live Lots", value: "3", icon: Flame, color: "text-terracotta-earth", bg: "bg-orange-50" },
                    { label: lang === "fr" ? "Ventes à Venir" : "Upcoming", value: "2", icon: Clock, color: "text-gold-leaf", bg: "bg-amber-50" },
                    { label: lang === "fr" ? "Mes Offres" : "My Bids", value: "4", icon: Gavel, color: "text-ebony-deep", bg: "bg-surface-container-low" },
                    { label: lang === "fr" ? "Pièces Suivies" : "Watching", value: "7", icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className={`${s.bg} border border-on-surface/5 p-4`}
                    >
                      <s.icon size={16} className={`${s.color} mb-2`} />
                      <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{s.label}</p>
                      <p className={`font-serif text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Active Alerts */}
                <div>
                  <h3 className="font-serif text-lg text-ebony-deep mb-4">{lang === "fr" ? "Alertes Actives" : "Active Alerts"}</h3>
                  <div className="space-y-3">
                    {[
                      { title: "West African Bronzes Collection", match: "92% match", urgency: lang === "fr" ? "3 jours restants" : "3 days left", icon: Bell },
                      { title: "Central African Sculptures", match: "87% match", urgency: lang === "fr" ? "Inscription ouverte" : "Registration open", icon: ShieldCheck },
                    ].map((alert, i) => (
                      <motion.div
                        key={alert.title}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-surface-container-low border border-on-surface/5 hover:border-gold-leaf/30 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gold-leaf/10 flex items-center justify-center shrink-0">
                          <alert.icon size={18} className="text-gold-leaf" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-ebony-deep">{alert.title}</p>
                          <p className="text-[9px] text-on-surface-variant">{alert.match} · {alert.urgency}</p>
                        </div>
                        <ArrowRight size={14} className="text-on-surface-variant/40 shrink-0" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Auctions */}
                <div>
                  <h3 className="font-serif text-lg text-ebony-deep mb-4">{lang === "fr" ? "Ventes à Venir" : "Upcoming Auctions"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Kuba Ndop Royal Portraits", date: "Jun 28, 2026", lots: 12, image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Brooklyn_Museum_61.33_Ndop_Portrait_of_King_Mishe_miShyaang_maMbul_%2810%29.jpg" },
                      { title: "Dogon & Tellem Masterworks", date: "Jul 10, 2026", lots: 8, image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Male_Figure_with_Raised_Arms_MET_DP302219.jpg" },
                    ].map((auction, i) => (
                      <motion.div
                        key={auction.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                        className="relative overflow-hidden border border-on-surface/10 group"
                      >
                        <div className="h-32 bg-ebony-deep overflow-hidden">
                          <img src={auction.image} alt={auction.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <div className="p-4 bg-surface-container-low">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gold-leaf mb-1">{auction.date}</p>
                          <p className="text-[11px] font-bold text-ebony-deep">{auction.title}</p>
                          <p className="text-[9px] text-on-surface-variant">{auction.lots} {lang === "fr" ? "lots" : "lots"}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Link href="/auctions" className="inline-flex items-center gap-2 text-gold-leaf font-sans text-xs font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors">
                  {lang === "fr" ? "Voir Toutes les Ventes" : "View All Auctions"} <ArrowRight size={12} />
                </Link>
              </div>
            )}
            {activeTab === ActiveTab.Investment && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Conseil en Investissement" : "Investment Advisory"}</h2>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">{lang === "fr" ? "Analyse de portefeuille, tendances du marché et recommandations d'experts." : "Portfolio analytics, market trends, and expert recommendations."}</p>
                  </div>
                  <Link href="/investment" className="bg-ebony-deep text-parchment-ivory px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center gap-2 self-start">
                    {lang === "fr" ? "Tableau de Bord Complet" : "Full Dashboard"} <ExternalLink size={12} />
                  </Link>
                </div>

                {/* Portfolio Performance Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative bg-ebony-deep overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_20%_50%,_#C5A059_0%,_transparent_60%)]" />
                  <div className="relative z-10 p-8 md:p-10">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={16} className="text-gold-leaf" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-leaf">{lang === "fr" ? "Performance du Portefeuille" : "Portfolio Performance"}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-parchment-ivory/40">{lang === "fr" ? "Valeur Totale" : "Total Value"}</p>
                        <p className="font-serif text-3xl font-bold text-parchment-ivory mt-1">€37.8M</p>
                        <p className="text-[10px] text-emerald-400 mt-1">+11.4% {lang === "fr" ? "CAGR" : "CAGR"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-parchment-ivory/40">{lang === "fr" ? "Rendement Trimestriel" : "Quarter Return"}</p>
                        <p className="font-serif text-3xl font-bold text-gold-leaf mt-1">+2.4%</p>
                        <p className="text-[10px] text-parchment-ivory/40 mt-1">{lang === "fr" ? "ADUNA INDEX" : "ADUNA INDEX"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-parchment-ivory/40">{lang === "fr" ? "Rang Mondial" : "Global Rank"}</p>
                        <p className="font-serif text-3xl font-bold text-parchment-ivory mt-1">#12</p>
                        <p className="text-[10px] text-parchment-ivory/40 mt-1">{lang === "fr" ? "Top 1% collectionneurs" : "Top 1% collectors"}</p>
                      </div>
                    </div>
                    {/* Mini chart line */}
                    <div className="mt-6 h-12 flex items-end gap-1">
                      {[35, 42, 38, 55, 48, 62, 58, 71, 68, 80, 75, 88].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="flex-1 bg-gold-leaf/30 hover:bg-gold-leaf/60 transition-colors rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Market Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: lang === "fr" ? "Indice du Marché" : "Market Index", value: lang === "fr" ? "Stable" : "Stable", sub: lang === "fr" ? "Bronzes: +3.2% ce mois" : "Bronzes: +3.2% this month", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: lang === "fr" ? "Statut du Conseil" : "Advisory Status", value: lang === "fr" ? "Actif" : "Active", sub: lang === "fr" ? "Prochaine revue: 28 Jun" : "Next review: Jun 28", icon: ShieldCheck, color: "text-gold-leaf", bg: "bg-amber-50" },
                    { label: lang === "fr" ? "Alertes Prix" : "Price Alerts", value: "3", sub: lang === "fr" ? "Pièces sous estimation" : "Pieces below estimate", icon: Bell, color: "text-terracotta-earth", bg: "bg-orange-50" },
                  ].map((card, i) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                      className={`${card.bg} border border-on-surface/5 p-5 hover:shadow-sm transition-shadow`}
                    >
                      <card.icon size={18} className={`${card.color} mb-3`} />
                      <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{card.label}</p>
                      <p className={`font-serif text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">{card.sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Top Holdings */}
                <div>
                  <h3 className="font-serif text-lg text-ebony-deep mb-4">{lang === "fr" ? "Principales Positions" : "Top Holdings"}</h3>
                  <div className="space-y-2">
                    {[
                      { title: "Benin Bronze Head", value: "€8.5M", change: "+14.2%", positive: true },
                      { title: "Ife Terracotta Head", value: "€9.2M", change: "+11.8%", positive: true },
                      { title: "Nok Terracotta Figure", value: "€6.5M", change: "+9.4%", positive: true },
                    ].map((holding, i) => (
                      <motion.div
                        key={holding.title}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                        className="flex items-center justify-between p-3 bg-surface-container-low border border-on-surface/5 hover:border-gold-leaf/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-ebony-deep/5 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-on-surface-variant">#{i + 1}</span>
                          </div>
                          <p className="text-[11px] font-bold text-ebony-deep">{holding.title}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-bold text-ebony-deep">{holding.value}</span>
                          <span className={`text-[10px] font-bold ${holding.positive ? "text-emerald-600" : "text-red-600"}`}>{holding.change}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Link href="/investment" className="inline-flex items-center gap-2 text-gold-leaf font-sans text-xs font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors">
                  {lang === "fr" ? "Voir le Tableau de Bord d'Investissement" : "View Investment Dashboard"} <ArrowRight size={12} />
                </Link>
              </div>
            )}
            {activeTab === ActiveTab.Previews && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Aperçus Exclusifs" : "Exclusive Previews"}</h2>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">{lang === "fr" ? "Accès prioritaire aux nouvelles acquisitions avant leur publication." : "Priority access to new acquisitions before public listing."}</p>
                  </div>
                  <Link href="/preview" className="bg-ebony-deep text-parchment-ivory px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center gap-2">
                    {lang === "fr" ? "Voir Tous les Aperçus" : "View All Previews"} <ExternalLink size={12} />
                  </Link>
                </div>
                <div className="bg-surface-container-low border border-on-surface/5 p-8 text-center">
                  <Eye className="w-12 h-12 text-gold-leaf mx-auto mb-4" />
                  <h3 className="font-serif text-lg text-ebony-deep mb-2">{lang === "fr" ? "Accès VIP aux Aperçus" : "VIP Preview Access"}</h3>
                  <p className="font-sans text-xs text-on-surface-variant max-w-md mx-auto mb-4">
                    {lang === "fr" ? "En tant que collectionneur estimé, vous avez un accès anticipé pour voir et réserver les prochaines acquisitions avant leur publication." : "As a valued collector, you have early access to view and reserve upcoming acquisitions before they are listed publicly."}
                  </p>
                  <Link href="/preview" className="inline-flex items-center gap-2 text-gold-leaf font-sans text-xs font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors">
                    {lang === "fr" ? "Entrer dans la Salle d'Aperçu" : "Enter Preview Room"} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory border border-gold-leaf max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={() => setShowExportModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer"><X className="w-6 h-6" /></button>
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-gold-leaf mx-auto mb-3" />
                <h3 className="font-serif text-xl font-medium uppercase tracking-wide text-ebony-deep">{lang === "fr" ? "Rapport de Placement d'État Prêt" : "State Placement Report Ready"}</h3>
                <p className="font-sans text-xs text-zinc-450 mt-1">{lang === "fr" ? "Dossier privé compilé sous clés de registre juridique à double signature." : "Private dossier compiled under dual-signature legal registry keys."}</p>
              </div>
              <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-6 text-xs space-y-3 font-sans">
                <div className="flex justify-between"><span className="text-zinc-400">{lang === "fr" ? "Collectionneur Cible" : "Target Collector"}</span><span className="font-medium text-ebony-deep">{profile.name} ({profile.tier})</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">{lang === "fr" ? "Total des Acquisitions" : "Total Acquisitions"}</span><span className="font-medium text-ebony-deep">{lang === "fr" ? `${acquisitions.length + 10} Artefacts` : `${acquisitions.length + 10} Artifacts`}</span></div>
                <div className="flex justify-between"><span className="text-zinc-450">{lang === "fr" ? "Valeur Estimée du Portefeuille" : "Estimated Portfolio Value"}</span><span className="font-serif font-bold text-gold-leaf text-sm">€{(totalValueEur / 1000000).toFixed(1)}M</span></div>
                <div className="flex justify-between pt-2 border-t border-ebony-deep/5 text-[11px] items-center">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">{lang === "fr" ? "✓ Lien Blockchain Vérifié et Sûr" : "✓ Vetted Safe Blockchain Link"}</span>
                  <span className="font-mono text-zinc-400 text-[9px] uppercase font-bold select-all">REG-D-49122</span>
                </div>
              </div>
              <div className="space-y-3">
                <button type="button" onClick={handleDownloadReportFile} className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-bold uppercase tracking-widest py-3.5 hover:opacity-90 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 border-0"><Download className="w-4 h-4" /> {lang === "fr" ? "Télécharger le Grand Livre Texte Certifié" : "Download Certified Text Ledger"}</button>
                <button type="button" onClick={() => setShowExportModal(false)} className="w-full bg-transparent border border-ebony-deep/15 text-zinc-500 hover:text-ebony-deep font-sans text-xs font-semibold py-3 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer">{lang === "fr" ? "Passer l'Aperçu" : "Bypass Overview"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </AuthGuard>
  );
}
