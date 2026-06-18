"use client";

import { useState } from "react";
import { Acquisition, ActiveTab, AcquisitionStatus, Consultation } from "@/lib/dashboardTypes";
import { useAuth } from "@/lib/auth";
import {
  Download,
  CheckCircle,
  Calendar,
  MapPin,
  Sparkles,
  Lock,
  ChevronRight,
  Eye,
  Award,
  PackageCheck,
  FileCheck,
  BookOpen,
  History,
  TrendingUp,
  Gavel,
  Search,
  Video,
  BookmarkCheck
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import Link from "next/link";

interface DashboardViewProps {
  acquisitions: Acquisition[];
  consultations: Consultation[];
  onExpressInterest: (artworkTitle: string, year: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedAcquisition: (acq: Acquisition | null) => void;
  onExportReport: () => void;
}

export default function DashboardView({
  acquisitions,
  consultations,
  onExpressInterest,
  setActiveTab,
  setSelectedAcquisition,
  onExportReport
}: DashboardViewProps) {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Collector";
  const [isAttendanceConfirmed, setIsAttendanceConfirmed] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const totalValueEur = acquisitions.reduce((acc, item) => acc + item.estimatedValueEur, 0);
  const formattedValue = (totalValueEur / 1000000).toFixed(1);
  const activeShipmentsCount = acquisitions.filter(i => i.status === AcquisitionStatus.InTransit).length;
  const pendingVettingsCount = acquisitions.filter(i => i.status === AcquisitionStatus.Pending).length;

  const handleConfirmAttendance = () => {
    setAttendanceLoading(true);
    setTimeout(() => {
      setIsAttendanceConfirmed(true);
      setAttendanceLoading(false);
    }, 800);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-12 border-b border-ebony-deep/10 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="font-serif text-[48px] italic font-medium text-ebony-deep leading-tight mb-2">
            {lang === "fr" ? `Bonjour, ${firstName}.` : `Hello, ${firstName}.`}
          </h2>
          <p className="font-sans text-sm text-on-surface-variant" suppressHydrationWarning>
            {lang === "fr" ? "Dernière mise à jour :" : "Last updated:"} Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {lang === "fr" ? "Compte Prestige Actif" : "Prestige Account Active"}
          </p>
        </div>
        <button
          onClick={onExportReport}
          className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-wider px-6 py-3.5 hover:opacity-90 active:scale-98 transition-all flex items-center gap-2 cursor-pointer border-0"
        >
          <Download className="w-4 h-4" />
          {lang === "fr" ? "Exporter le Rapport de Portefeuille" : "Export Portfolio Report"}
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-parchment-ivory p-8 border border-ebony-deep/5 shadow-level-1 flex flex-col justify-between">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-6">{lang === "fr" ? "Total des Acquisitions" : "Total Acquisitions"}</p>
          <div>
            <p className="font-serif text-3xl text-ebony-deep">{acquisitions.length + 10} Pieces</p>
            <p className="font-sans text-[11px] text-zinc-500 mt-2">{acquisitions.length} secure vaults • 10 legacy trust artifacts</p>
          </div>
        </div>
        <div className="bg-parchment-ivory p-8 border border-ebony-deep/5 shadow-level-1 border-l-4 border-l-terracotta-earth flex flex-col justify-between">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-6">{lang === "fr" ? "Valeur Est. du Portefeuille" : "Est. Portfolio Value"}</p>
          <div>
            <p className="font-serif text-3xl text-ebony-deep font-medium">€{formattedValue}M</p>
            <p className="font-sans text-xs text-terracotta-earth font-medium mt-2 flex items-center gap-1">
              <span>+2.4% this quarter</span>
              <span className="text-[10px] bg-terracotta-earth/10 px-1.5 py-0.5 font-semibold">ADUNA INDEX</span>
            </p>
          </div>
        </div>
        <div className="bg-parchment-ivory p-8 border border-ebony-deep/5 shadow-level-1 flex flex-col justify-between">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-6">{lang === "fr" ? "Opérations Actives" : "Active Operations"}</p>
          <div>
            <p className="font-serif text-3xl text-ebony-deep">{activeShipmentsCount + pendingVettingsCount} in progress</p>
            <p className="font-sans text-[11px] text-zinc-500 mt-2">{activeShipmentsCount} courier cargo transit • {pendingVettingsCount} curation vetting</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-amber-50/40 border border-gold-leaf/30 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
          <div className="absolute right-[-40px] bottom-[-40px] text-gold-leaf/5 pointer-events-none transform -rotate-12 select-none font-serif text-[240px]">ADUNA</div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-earth opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta-earth"></span>
              </span>
              <p className="font-sans text-xs font-bold tracking-widest uppercase text-terracotta-earth">{lang === "fr" ? "Enchère Limitée à Venir" : "Upcoming Limited Auction"}</p>
            </div>
            <h3 className="font-serif text-2xl text-ebony-deep mb-2">Royal Benin & Oba Dynasty Auction</h3>
            <p className="font-sans text-sm text-on-surface-variant flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gold-leaf" /> November 24, 2026</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gold-leaf" /> London Headquarters & Virtual Vault</span>
            </p>
          </div>
          <div className="relative z-10 shrink-0 select-none">
            {isAttendanceConfirmed ? (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gold-leaf text-ebony-deep font-sans text-xs font-bold uppercase tracking-widest px-6 py-3.5 flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5" /> ✓ {lang === "fr" ? "Présence VIP Confirmée" : "VIP Attendance Confirmed"}
              </motion.div>
            ) : (
              <button onClick={handleConfirmAttendance} disabled={attendanceLoading} className="bg-transparent border border-gold-leaf text-gold-leaf font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-gold-leaf hover:text-ebony-deep transition-all duration-300 disabled:opacity-50 cursor-pointer">
                {attendanceLoading ? (lang === "fr" ? "Enregistrement..." : 'Registering...') : (lang === "fr" ? "Confirmer la Présence Premium" : 'Confirm Premium Attendance')}
              </button>
            )}
          </div>
        </div>
      </section>

      {consultations.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6 border-b border-ebony-deep/10 pb-4">
            <h3 className="font-serif text-xl font-medium text-ebony-deep">{lang === "fr" ? "Consultations à Venir" : "Upcoming Consultations"}</h3>
            <button onClick={() => setActiveTab(ActiveTab.Consultations)} className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-leaf hover:text-terracotta-earth underline transition-colors cursor-pointer border-0 bg-transparent">
              {lang === "fr" ? "Voir Tout" : "View All"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultations.slice(0, 2).map((c) => (
              <div key={c.id} className="bg-surface-container-low border border-on-surface/5 p-5 flex items-center gap-4 group hover:border-gold-leaf/30 transition-colors">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-highest flex items-center justify-center">
                  {c.expertAvatar ? (
                    <img src={c.expertAvatar} alt={c.expertName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-serif text-ebony-deep">{c.expertName?.charAt(0) || '?'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <BookmarkCheck className="w-3.5 h-3.5 text-gold-leaf shrink-0" />
                    <p className="font-serif text-sm text-ebony-deep font-medium truncate">{c.topic || (lang === "fr" ? "Consultation" : "Consultation")}</p>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant truncate">{c.expertName} • {c.expertTitle}</p>
                  <p className="font-sans text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {c.date} • {c.timeSlot || (lang === "fr" ? "À confirmer" : "TBC")}
                  </p>
                </div>
                <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border shrink-0 ${
                  c.status === 'Confirmed' ? 'bg-emerald-50/40 text-emerald-800 border-emerald-200/40'
                    : c.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200/50'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="flex justify-between items-end mb-8 border-b border-ebony-deep/10 pb-4">
            <h3 className="font-serif text-xl font-medium text-ebony-deep">{lang === "fr" ? "Acquisitions Récentes" : "Recent Acquisitions"}</h3>
            <button onClick={() => setActiveTab(ActiveTab.Portfolio)} className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-leaf hover:text-terracotta-earth underline transition-colors cursor-pointer border-0 bg-transparent">
              {lang === "fr" ? "Voir le Cabinet Complet" : "View Full Cabinet"}
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {acquisitions.slice(0, 3).map((item) => (
              <div key={item.id} onClick={() => setSelectedAcquisition(item)} className="flex items-center gap-6 group cursor-pointer">
                <div className="w-24 h-24 bg-surface-container-highest shrink-0 relative overflow-hidden shadow-level-1 border border-ebony-deep/5 transition-all">
                  <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-ebony-deep/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-5 h-5 text-parchment-ivory" />
                  </div>
                </div>
                <div className="flex-1 border-b border-ebony-deep/5 pb-4 group-hover:border-ebony-deep/20 transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h4 className="font-serif text-base text-ebony-deep group-hover:text-gold-leaf transition-colors leading-tight">{item.title}</h4>
                    <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 flex items-center gap-1.5 border ${
                      item.status === 'Certified' ? 'bg-emerald-50/40 text-emerald-800 border-emerald-200/40'
                        : item.status === 'In Transit' ? 'bg-amber-50 text-amber-800 border-amber-200/50'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}>
                      {item.status === 'Certified' && <Award className="w-3 h-3 text-emerald-600" />}
                      {item.status === 'In Transit' && <PackageCheck className="w-3 h-3 text-amber-600" />}
                      {item.status === 'Pending' && <FileCheck className="w-3 h-3 text-zinc-500" />}
                      {item.status}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant mb-2">{item.era} • {item.culture}</p>
                  <div className="flex justify-between items-center text-[11px] text-zinc-400">
                    <p className="font-medium text-ebony-deep">Acquired {item.acquisitionDate}</p>
                    <p className="font-mono text-zinc-500 group-hover:text-gold-leaf transition-colors flex items-center gap-0.5">
                      Provenance File <ChevronRight className="w-3.5 h-3.5" />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-parchment-ivory p-8 border border-ebony-deep/5 shadow-level-1 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gold-leaf/20">
                <Sparkles className="w-4.5 h-4.5 text-gold-leaf" />
                <h3 className="font-serif text-lg font-medium text-ebony-deep">{lang === "fr" ? "Aperçu Conservateur Exclusif" : "Exclusive Curator Preview"}</h3>
              </div>
              <div className="group cursor-pointer">
                <div className="relative w-full aspect-[4/3] mb-5 overflow-hidden border border-ebony-deep/5">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/Akan_Goldweights.jpg" alt="Contemporary Weave" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute top-4 left-4 bg-ebony-deep/90 text-gold-leaf font-sans text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-md">Curator&apos;s Premium Choice</div>
                </div>
                <h4 className="font-serif text-[20px] text-ebony-deep text-center mb-1 group-hover:text-gold-leaf transition-colors duration-300">Contemporary Weave</h4>
                <p className="font-sans text-xs text-on-surface-variant text-center mb-2">El Anatsui Inspired Studio • 2023</p>
                <p className="font-sans text-[11px] text-zinc-400 italic text-center max-w-sm mx-auto mb-6">Intricately hand-woven copper alloys and aluminum seals celebrating ancient West African textile histories.</p>
              </div>
            </div>
            <div>
              <button onClick={() => onExpressInterest('Contemporary Weave', '2023')} className="w-full bg-transparent border border-ebony-deep text-ebony-deep font-sans text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-ebony-deep hover:text-parchment-ivory transition-all duration-300 cursor-pointer">
                {lang === "fr" ? "Exprimer l'Intérêt d'Investissement" : "Express Investment Interest"}
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-zinc-400 text-[10px] select-none uppercase tracking-widest">
                <Lock className="w-3 h-3 text-gold-leaf" /> {lang === "fr" ? "Conseil de Placement Privé" : "Private Placement Advisory"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access — Visitor Pages */}
      <section className="mt-12">
        <div className="border-b border-ebony-deep/10 pb-4 mb-6">
          <h3 className="font-serif text-lg font-medium text-ebony-deep">{lang === "fr" ? "Accès Rapide — Pages du Site" : "Quick Access — Site Pages"}</h3>
          <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Naviguez vers les sections publiques de la galerie." : "Navigate to the public gallery sections."}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: "/catalogue", icon: BookOpen, labelEn: "Catalogue", labelFr: "Catalogue" },
            { href: "/provenance", icon: History, labelEn: "Provenance", labelFr: "Provenance" },
            { href: "/investment", icon: TrendingUp, labelEn: "Advisory", labelFr: "Conseil" },
            { href: "/auctions", icon: Gavel, labelEn: "Auctions", labelFr: "Enchères" },
            { href: "/search", icon: Search, labelEn: "Search", labelFr: "Recherche" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 bg-parchment-ivory border border-ebony-deep/5 p-4 hover:border-gold-leaf/40 hover:shadow-sm transition-all"
            >
              <link.icon className="w-4 h-4 text-gold-leaf shrink-0" />
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-ebony-deep group-hover:text-gold-leaf transition-colors">
                {lang === "fr" ? link.labelFr : link.labelEn}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}