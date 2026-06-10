"use client";

import { useState } from "react";
import { ActiveTab, Acquisition, Inquiry, Consultation, LogisticsShipment, SecurityRecord, CollectorProfile } from "@/lib/dashboardTypes";
import { INITIAL_ACQUISITIONS, INITIAL_INQUIRIES, INITIAL_CONSULTATIONS, INITIAL_LOGISTICS, INITIAL_SECURITY, INITIAL_PROFILE } from "@/lib/dashboardData";
import { FileText, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardView from "@/components/dashboard/DashboardView";
import PortfolioView from "@/components/dashboard/PortfolioView";
import InquiriesView from "@/components/dashboard/InquiriesView";
import ConsultationsView from "@/components/dashboard/ConsultationsView";
import LogisticsView from "@/components/dashboard/LogisticsView";
import SecurityView from "@/components/dashboard/SecurityView";
import SettingsView from "@/components/dashboard/SettingsView";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Dashboard);
  const [selectedAcquisition, setSelectedAcquisition] = useState<Acquisition | null>(INITIAL_ACQUISITIONS[0] ?? null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('light');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const [acquisitions, setAcquisitions] = useState<Acquisition[]>(INITIAL_ACQUISITIONS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [consultations, setConsultations] = useState<Consultation[]>(INITIAL_CONSULTATIONS);
  const [logistics, setLogistics] = useState<LogisticsShipment[]>(INITIAL_LOGISTICS);
  const [security, setSecurity] = useState<SecurityRecord[]>(INITIAL_SECURITY);
  const [profile, setProfile] = useState<CollectorProfile>(INITIAL_PROFILE);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleClearCache = () => {
    setAcquisitions(INITIAL_ACQUISITIONS);
    setInquiries(INITIAL_INQUIRIES);
    setConsultations(INITIAL_CONSULTATIONS);
    setLogistics(INITIAL_LOGISTICS);
    setSecurity(INITIAL_SECURITY);
    setProfile(INITIAL_PROFILE);
    setSelectedAcquisition(INITIAL_ACQUISITIONS[0]);
    setActiveTab(ActiveTab.Dashboard);
    alert('Aduna Gallery metrics initialized successfully to pristine defaults.');
  };

  const handleExpressInterest = (artworkTitle: string, year: string) => {
    const existing = inquiries.find(inq => inq.artworkTitle === artworkTitle);
    if (existing) {
      setSelectedInquiryId(existing.id);
      setActiveTab(ActiveTab.Inquiries);
      return;
    }
    const newInquiryId = `inq_${Date.now()}`;
    const newInquiry: Inquiry = {
      id: newInquiryId,
      artworkTitle: artworkTitle,
      artworkYear: year,
      imageUrl: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
      status: 'Received',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          sender: 'collector',
          text: `Expressing immediate, confidential interest regarding "${artworkTitle}" (${year}). Please provide full research reports and dispatch options to Geneva.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setInquiries(prev => [newInquiry, ...prev]);
    setSelectedInquiryId(newInquiryId);
    setActiveTab(ActiveTab.Inquiries);

    setTimeout(() => {
      setInquiries(prev => prev.map(inq => {
        if (inq.id === newInquiryId) {
          return {
            ...inq,
            status: 'In Discussion' as const,
            messages: [
              ...inq.messages,
              {
                sender: 'curator' as const,
                text: `Greetings Julian. The private placement file for "${artworkTitle}" is now checked. We have logged your priority interest on the Aduna Ledger. Dynamic shipping quotas are ready. Let's arrange a conference.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return inq;
      }));
    }, 1500);
  };

  const handleAddMessage = (inquiryId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, messages: [...inq.messages, { sender: 'collector' as const, text, timestamp }] };
      }
      return inq;
    }));

    setTimeout(() => {
      setInquiries(prev => prev.map(inq => {
        if (inq.id === inquiryId) {
          const responds = [
            `Excellent point, Julian. I am forwarding your parameter guidelines directly to our Zurich legal council for prompt vetting.`,
            `Checked, Julian. We can guarantee premium transit with Malca-Amit. Dual-authentication contracts have been prepared and logged under safe signature.`,
            `Excellent. Let's review logistics options with Dr. Amara Diop on our next scheduled video advisory.`,
            `I have compiled the required radiometric carbon testing data for this piece. It confirms pristine structural integrity.`
          ];
          const randomText = responds[Math.floor(Math.random() * responds.length)];
          return { ...inq, messages: [...inq.messages, { sender: 'curator' as const, text: randomText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] };
        }
        return inq;
      }));
    }, 1800);
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
    alert(`Heritage Piece Certified! "${newAcq.title}" has been securely logged on the Aduna mainframe and added to your portfolio.`);
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
    const reportText = `
ADUNA GALLERY - COLLECTOR PORTFOLIO DEED REPORT
===================================================
Issued: ${new Date().toLocaleDateString()}
Collector Account: ${profile.name} (${profile.tier})
Mainframe Sign-Off: Approved under Ledger Key V2
Currency basis: EUR (€)

PORTFOLIO METRICS SUMMARY
-------------------------
Total Certified Acquisitions: ${acquisitions.length + 10} Pieces
Total Local Cabinet: ${acquisitions.length} Pieces
Estimated Value Portfolio: €${(acquisitions.reduce((sum, item) => sum + item.estimatedValueEur, 0) / 1000000).toFixed(1)} Million
Operations In Progress: ${consultations.length} Consultation, ${logistics.length} Shipment

REGISTERED CABINET CATALOG
-------------------------
${acquisitions.map((acq, index) => `${index + 1}. [${acq.id.toUpperCase()}] ${acq.title}
   - Chronology: ${acq.era} • culture: ${acq.culture}
   - Registered Value: €${acq.estimatedValueEur.toLocaleString()}
   - State Status: ${acq.status}
   - Provenance checklist:
${acq.provenance.map(p => `     * ${p}`).join('\n')}`).join('\n\n')}

===================================================
VERIFIED AUTHENTIC SEAL BY ADUNA LABS ADVISORY BOARD
---------------------------------------------------
This report acts as a legal certifiable token of ownership index.
`;
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Aduna_Collector_Report_${profile.name.replace(" ", "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert('Cryptographic report download complete.');
  };

  const totalValueEur = acquisitions.reduce((acc, item) => acc + item.estimatedValueEur, 0);

  return (
    <div className="bg-surface text-ebony-deep min-h-screen font-sans flex flex-col transition-all duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} onLogout={() => {
        if (confirm('De-authorize private placement session? Settings and portfolio files will persist in secure local storage.')) {
          alert('Session closed safely. Authenticated collector credentials detached.');
        }
      }} />

      <main className="flex-1 lg:ml-64 bg-background min-h-screen px-6 sm:px-12 py-12 lg:py-16 pt-24 lg:pt-16 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {activeTab === ActiveTab.Dashboard && (
              <DashboardView acquisitions={acquisitions} onExpressInterest={handleExpressInterest} setActiveTab={setActiveTab} setSelectedAcquisition={(acq) => { setSelectedAcquisition(acq); setActiveTab(ActiveTab.Portfolio); }} onExportReport={handleExportReport} />
            )}
            {activeTab === ActiveTab.Portfolio && (
              <PortfolioView acquisitions={acquisitions} onAddAcquisition={handleAddAcquisition} onRemoveAcquisition={handleRemoveAcquisition} selectedAcquisition={selectedAcquisition} setSelectedAcquisition={setSelectedAcquisition} />
            )}
            {activeTab === ActiveTab.Inquiries && (
              <InquiriesView inquiries={inquiries} onAddMessage={handleAddMessage} selectedInquiryId={selectedInquiryId} setSelectedInquiryId={setSelectedInquiryId} />
            )}
            {activeTab === ActiveTab.Consultations && (
              <ConsultationsView consultations={consultations} onAddConsultation={handleAddConsultation} />
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
                <h3 className="font-serif text-xl font-medium uppercase tracking-wide text-ebony-deep">State Placement Report Ready</h3>
                <p className="font-sans text-xs text-zinc-450 mt-1">Private dossier compiled under dual-signature legal registry keys.</p>
              </div>
              <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-6 text-xs space-y-3 font-sans">
                <div className="flex justify-between"><span className="text-zinc-400">Target Collector</span><span className="font-medium text-ebony-deep">{profile.name} ({profile.tier})</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Total Acquisitions</span><span className="font-medium text-ebony-deep">{acquisitions.length + 10} Artifacts</span></div>
                <div className="flex justify-between"><span className="text-zinc-450">Estimated Portfolio Value</span><span className="font-serif font-bold text-gold-leaf text-sm">€{(totalValueEur / 1000000).toFixed(1)}M</span></div>
                <div className="flex justify-between pt-2 border-t border-ebony-deep/5 text-[11px] items-center">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">✓ Vetted Safe Blockchain Link</span>
                  <span className="font-mono text-zinc-400 text-[9px] uppercase font-bold select-all">REG-D-49122</span>
                </div>
              </div>
              <div className="space-y-3">
                <button type="button" onClick={handleDownloadReportFile} className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-bold uppercase tracking-widest py-3.5 hover:opacity-90 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 border-0"><Download className="w-4 h-4" /> Download Certified Text Ledger</button>
                <button type="button" onClick={() => setShowExportModal(false)} className="w-full bg-transparent border border-ebony-deep/15 text-zinc-500 hover:text-ebony-deep font-sans text-xs font-semibold py-3 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer">Bypass Overview</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}