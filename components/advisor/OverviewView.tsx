"use client";

import { motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { AdvisorConsultation, AdvisorClient, AdvisorPlacement, AdvisorActivity, AdvisorView } from "@/lib/advisorTypes";
import { CalendarCheck, Users, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";

interface OverviewViewProps {
  consultations: AdvisorConsultation[];
  clients: AdvisorClient[];
  placements: AdvisorPlacement[];
  activities: AdvisorActivity[];
  setActiveView: (view: AdvisorView) => void;
}

export default function OverviewView({ consultations, clients, placements, activities, setActiveView }: OverviewViewProps) {
  const { lang } = useTranslate();

  const confirmedConsultations = consultations.filter(c => c.status === "Confirmed").length;
  const pendingPlacements = placements.filter(p => p.status === "Proposed" || p.status === "Under Review").length;
  const totalCommission = placements.filter(p => p.status === "Completed").reduce((s, p) => s + p.commission, 0);

  const stats = [
    { label: lang === "fr" ? "Consultations Confirmées" : "Confirmed Consultations", value: confirmedConsultations, icon: CalendarCheck, color: "text-terracotta-earth", bg: "bg-terracotta-earth/10" },
    { label: lang === "fr" ? "Clients Actifs" : "Active Clients", value: clients.length, icon: Users, color: "text-terracotta-earth", bg: "bg-terracotta-earth/10" },
    { label: lang === "fr" ? "Placements en Cours" : "Pending Placements", value: pendingPlacements, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: lang === "fr" ? "Commissions Réalisées" : "Commission Earned", value: `€${totalCommission.toLocaleString()}`, icon: TrendingUp, color: "text-terracotta-earth", bg: "bg-terracotta-earth/10" },
  ];

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Vue d'Ensemble du Conseiller" : "Advisor Overview"}</h2>
        <p className="font-sans text-xs text-ebony-deep/40 mt-1">{lang === "fr" ? "Votre tableau de bord advisor — consultations, clients, placements et activité récente." : "Your advisor dashboard — consultations, clients, placements, and recent activity."}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-parchment-ivory border border-ebony-deep/5 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-ebony-deep/40">{stat.label}</p>
            </div>
            <p className="font-serif text-2xl font-semibold text-ebony-deep">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming consultations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-parchment-ivory border border-ebony-deep/5 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-medium text-ebony-deep">{lang === "fr" ? "Prochaines Consultations" : "Upcoming Consultations"}</h3>
            <button onClick={() => setActiveView(AdvisorView.Consultations)} className="text-[10px] font-sans font-bold uppercase tracking-widest text-terracotta-earth hover:text-ebony-deep transition-colors cursor-pointer bg-transparent border-0">{lang === "fr" ? "Voir Tout" : "View All"}</button>
          </div>
          <div className="space-y-3">
            {consultations.filter(c => c.status === "Confirmed" || c.status === "Pending").slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-surface-container-low border border-ebony-deep/5">
                <div className={`w-2 h-2 rounded-full ${c.status === "Confirmed" ? "bg-emerald-600" : "bg-amber-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-medium text-ebony-deep truncate">{c.topic}</p>
                  <p className="font-sans text-[10px] text-ebony-deep/40">{c.clientName} • {c.date} • {c.timeSlot}</p>
                </div>
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 ${c.type === "Video" ? "bg-terracotta-earth/10 text-terracotta-earth" : c.type === "In-Person" ? "bg-terracotta-earth/10 text-terracotta-earth" : "bg-ebony-deep/10 text-ebony-deep/60"}`}>{c.type}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-parchment-ivory border border-ebony-deep/5 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-medium text-ebony-deep">{lang === "fr" ? "Activité Récente" : "Recent Activity"}</h3>
            <button onClick={() => setActiveView(AdvisorView.Activity)} className="text-[10px] font-sans font-bold uppercase tracking-widest text-terracotta-earth hover:text-ebony-deep transition-colors cursor-pointer bg-transparent border-0">{lang === "fr" ? "Voir Tout" : "View All"}</button>
          </div>
          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.type === "consultation" ? "bg-terracotta-earth/10" : act.type === "placement" ? "bg-emerald-50" : act.type === "client" ? "bg-terracotta-earth/10" : "bg-ebony-deep/10"}`}>
                  <span className="text-xs">{act.icon === "video" ? "📹" : act.icon === "check" ? "✅" : act.icon === "user" ? "👤" : act.icon === "alert" ? "⚠️" : act.icon === "calendar" ? "📅" : act.icon === "send" ? "📤" : act.icon === "file" ? "📄" : "💰"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-medium text-ebony-deep">{act.title}</p>
                  <p className="font-sans text-[10px] text-ebony-deep/40 line-clamp-1">{act.description}</p>
                  <p className="font-mono text-[9px] text-ebony-deep/25 mt-0.5">{act.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-parchment-ivory border border-ebony-deep/5 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-medium text-ebony-deep">{lang === "fr" ? "Meilleurs Clients" : "Top Clients"}</h3>
            <button onClick={() => setActiveView(AdvisorView.Clients)} className="text-[10px] font-sans font-bold uppercase tracking-widest text-terracotta-earth hover:text-ebony-deep transition-colors cursor-pointer bg-transparent border-0">{lang === "fr" ? "Voir Tout" : "View All"}</button>
          </div>
          <div className="space-y-3">
            {clients.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-surface-container-low border border-ebony-deep/5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: c.avatarColor }}>{c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-medium text-ebony-deep">{c.name}</p>
                  <p className="font-sans text-[10px] text-ebony-deep/40">{c.country} • {c.acquisitionsCount} {lang === "fr" ? "acquisitions" : "acquisitions"}</p>
                </div>
                <span className="font-serif text-xs font-semibold text-terracotta-earth">€{c.totalSpent.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active placements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-parchment-ivory border border-ebony-deep/5 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-medium text-ebony-deep">{lang === "fr" ? "Placements Actifs" : "Active Placements"}</h3>
            <button onClick={() => setActiveView(AdvisorView.Placements)} className="text-[10px] font-sans font-bold uppercase tracking-widest text-terracotta-earth hover:text-ebony-deep transition-colors cursor-pointer bg-transparent border-0">{lang === "fr" ? "Voir Tout" : "View All"}</button>
          </div>
          <div className="space-y-3">
            {placements.filter(p => p.status !== "Completed").slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-surface-container-low border border-ebony-deep/5">
                <div className="w-10 h-10 overflow-hidden shrink-0 border border-ebony-deep/10"><img src={p.imageUrl} alt={p.artworkTitle} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-medium text-ebony-deep truncate">{p.artworkTitle}</p>
                  <p className="font-sans text-[10px] text-ebony-deep/40">{p.clientName} • €{p.valuation.toLocaleString()}</p>
                </div>
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 ${p.status === "Accepted" ? "bg-emerald-50 text-emerald-600" : p.status === "Under Review" ? "bg-terracotta-earth/10 text-terracotta-earth" : "bg-ebony-deep/10 text-ebony-deep/60"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
