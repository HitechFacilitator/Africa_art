"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Menu, Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdvisorView } from "@/lib/advisorTypes";
import { useTranslate } from "@/lib/translations";
import { useAuth, ROLE_INFO } from "@/lib/auth";

interface AdvisorHeaderProps {
  activeView: AdvisorView;
  onMenuToggle: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

const TAB_LABELS: Record<AdvisorView, { en: string; fr: string; icon: string }> = {
  [AdvisorView.Overview]: { en: "Overview", fr: "Vue d'Ensemble", icon: "📊" },
  [AdvisorView.Consultations]: { en: "Consultations", fr: "Consultations", icon: "📅" },
  [AdvisorView.Clients]: { en: "Clients", fr: "Clients", icon: "👥" },
  [AdvisorView.Placements]: { en: "Placements", fr: "Placements", icon: "📦" },
  [AdvisorView.Activity]: { en: "Activity", fr: "Activité", icon: "⚡" },
  [AdvisorView.Chat]: { en: "Messages", fr: "Messages", icon: "💬" },
  [AdvisorView.Settings]: { en: "Settings", fr: "Paramètres", icon: "⚙️" },
};

export default function AdvisorHeader({ activeView, onMenuToggle, onBack, canGoBack }: AdvisorHeaderProps) {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const [time, setTime] = useState<string>("");
  const tabInfo = TAB_LABELS[activeView] || { en: "Dashboard", fr: "Tableau de Bord", icon: "📊" };
  const roleInfo = user ? ROLE_INFO[user.role] : null;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(lang === "fr" ? "fr-FR" : "en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <header className="sticky top-0 z-40 bg-parchment-ivory border-b border-ebony-deep/10 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-10 h-14">
        {/* Left: Menu + Back + Branding + Active Tab */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="flex items-center justify-center w-8 h-8 text-terracotta-earth hover:bg-terracotta-earth/10 rounded-sm transition-all cursor-pointer border-0 bg-transparent group lg:hidden"
          >
            <Menu size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <AnimatePresence>
            {canGoBack && (
              <motion.button
                initial={{ opacity: 0, x: -8, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -8, width: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onBack}
                className="flex items-center gap-1.5 text-ebony-deep/50 hover:text-terracotta-earth transition-colors cursor-pointer border-0 bg-transparent text-[10px] uppercase tracking-widest font-bold shrink-0 overflow-hidden"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline whitespace-nowrap">{lang === "fr" ? "Retour" : "Back"}</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="w-px h-5 bg-ebony-deep/10 hidden sm:block" />

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-6 h-6 rounded bg-terracotta-earth/15 flex items-center justify-center border border-ebony-deep/10">
              <span className="text-[10px]">🏛️</span>
            </div>
            <span className="hidden sm:inline font-serif text-sm font-medium text-terracotta-earth">{lang === "fr" ? "Aduna Gallery" : "Aduna Gallery"}</span>
            <span className="hidden md:inline text-[8px] text-ebony-deep/30 font-mono uppercase tracking-widest">{lang === "fr" ? "Espace Conseiller" : "Advisor Portal"}</span>
          </div>

          <div className="w-px h-5 bg-ebony-deep/10 hidden sm:block" />

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm">{tabInfo.icon}</span>
            <span className="font-sans text-xs font-semibold text-ebony-deep/80 truncate">{tabInfo[lang === "fr" ? "fr" : "en"]}</span>
          </div>
        </div>

        {/* Right: Time + Search + Notifications + Badge */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-ebony-deep/40">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider tabular-nums">{time}</span>
          </div>

          <div className="w-px h-5 bg-ebony-deep/10 hidden lg:block" />

          <button className="flex items-center justify-center w-8 h-8 text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer border-0 bg-transparent">
            <Search size={15} />
          </button>

          <button className="relative flex items-center justify-center w-8 h-8 text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer border-0 bg-transparent">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-terracotta-earth rounded-full" />
          </button>

          <div className="w-px h-5 bg-ebony-deep/10" />

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-earth">{roleInfo?.tierFr || "Conseiller"}</span>
              <span className="text-[9px] text-ebony-deep/40">{user?.name || (lang === "fr" ? "Dr. Fatima Benali" : "Dr. Fatima Benali")}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-full bg-terracotta-earth/10 flex items-center justify-center border border-ebony-deep/10"
            >
              <span className="font-serif text-xs font-bold text-terracotta-earth">{user?.avatar || "FB"}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
