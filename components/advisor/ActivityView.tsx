"use client";

import { motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { AdvisorActivity } from "@/lib/advisorTypes";
import { Activity } from "lucide-react";

interface ActivityViewProps {
  activities: AdvisorActivity[];
}

export default function ActivityView({ activities }: ActivityViewProps) {
  const { lang } = useTranslate();

  const typeColors: Record<string, string> = {
    consultation: "bg-terracotta-earth/10 border-terracotta-earth/20",
    placement: "bg-emerald-50 border-emerald-250/20",
    client: "bg-terracotta-earth/10 border-terracotta-earth/20",
    system: "bg-ebony-deep/5 border-ebony-deep/10",
  };

  const typeLabels: Record<string, { en: string; fr: string }> = {
    consultation: { en: "Consultation", fr: "Consultation" },
    placement: { en: "Placement", fr: "Placement" },
    client: { en: "Client", fr: "Client" },
    system: { en: "System", fr: "Système" },
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Journal d'Activité" : "Activity Log"}</h2>
        <p className="font-sans text-xs text-ebony-deep/40 mt-1">{lang === "fr" ? "Suivez toutes vos activités récentes et interactions." : "Track all your recent activities and interactions."}</p>
      </header>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-ebony-deep/10" />

        <div className="space-y-4">
          {activities.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex items-start gap-4 pl-2"
            >
              <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${typeColors[act.type]}`}>
                <span className="text-sm">{act.icon === "video" ? "📹" : act.icon === "check" ? "✅" : act.icon === "user" ? "👤" : act.icon === "alert" ? "⚠️" : act.icon === "calendar" ? "📅" : act.icon === "send" ? "📤" : act.icon === "file" ? "📄" : "💰"}</span>
              </div>
              <div className="flex-1 bg-parchment-ivory border border-ebony-deep/10 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 ${typeColors[act.type]}`}>{typeLabels[act.type]?.[lang === "fr" ? "fr" : "en"]}</span>
                  <span className="font-mono text-[9px] text-ebony-deep/25">{act.timestamp}</span>
                </div>
                <h4 className="font-serif text-sm font-medium text-ebony-deep mb-1">{act.title}</h4>
                <p className="font-sans text-[11px] text-ebony-deep/50 leading-relaxed">{act.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
