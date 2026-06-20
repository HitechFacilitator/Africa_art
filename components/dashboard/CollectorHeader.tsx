"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { ArrowLeft, Menu, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActiveTab } from "@/lib/dashboardTypes";
import { useTranslate } from "@/lib/translations";
import { useAuth, ROLE_INFO } from "@/lib/auth";
import NotificationBell from "@/components/layout/NotificationBell";

interface CollectorHeaderProps {
  activeTab: ActiveTab;
  onBack: () => void;
  canGoBack: boolean;
  onMenuToggle: () => void;
}

const TAB_LABELS: Record<string, { en: string; fr: string; icon: string }> = {
  [ActiveTab.Dashboard]: { en: "Overview", fr: "Vue d'ensemble", icon: "📊" },
  [ActiveTab.Portfolio]: { en: "My Acquisitions", fr: "Mes Acquisitions", icon: "🏛" },
  [ActiveTab.Certificates]: { en: "Certificates", fr: "Certificats", icon: "📜" },
  [ActiveTab.Inquiries]: { en: "Inquiries", fr: "Demandes", icon: "💬" },
  [ActiveTab.Consultations]: { en: "Consultations", fr: "Consultations", icon: "🤝" },
  [ActiveTab.PrivateCatalogues]: { en: "Private Catalogues", fr: "Catalogues Privés", icon: "🔒" },
  [ActiveTab.AlertsAuctions]: { en: "Alerts & Auctions", fr: "Alertes & Enchères", icon: "🔔" },
  [ActiveTab.Investment]: { en: "Investment", fr: "Investissement", icon: "📈" },
  [ActiveTab.Previews]: { en: "Exclusive Previews", fr: "Aperçus Exclusifs", icon: "👁" },
  [ActiveTab.Logistics]: { en: "Logistics", fr: "Logistique", icon: "🚚" },
  [ActiveTab.Security]: { en: "Security", fr: "Sécurité", icon: "🛡" },
  [ActiveTab.Settings]: { en: "Settings", fr: "Paramètres", icon: "⚙" },
};

const LiveClock = memo(function LiveClock({ lang }: { lang: string }) {
  const [time, setTime] = useState<string>("");
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
    <div className="hidden lg:flex items-center gap-1.5 text-parchment-ivory/40">
      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
      <span className="text-[10px] font-mono tracking-wider tabular-nums">{time}</span>
    </div>
  );
});

export default memo(function CollectorHeader({ activeTab, onBack, canGoBack, onMenuToggle }: CollectorHeaderProps) {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const tabInfo = TAB_LABELS[activeTab] || { en: "Dashboard", fr: "Tableau de Bord", icon: "📊" };
  const roleInfo = user ? ROLE_INFO[user.role] : null;

  return (
    <header className="sticky top-0 z-40 bg-ebony-deep border-b border-gold-leaf/15 shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-10 h-14">
        {/* Left: Menu + Back + Branding + Active Tab */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Menu toggle */}
          <button
            onClick={onMenuToggle}
            className="flex items-center justify-center w-8 h-8 text-parchment-ivory/60 hover:text-gold-leaf transition-colors cursor-pointer border-0 bg-transparent shrink-0 group"
            title={lang === "fr" ? "Ouvrir le menu" : "Open menu"}
          >
            <Menu size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Back button */}
          <AnimatePresence>
            {canGoBack && (
              <motion.button
                initial={{ opacity: 0, x: -8, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -8, width: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onBack}
                className="flex items-center gap-1.5 text-parchment-ivory/50 hover:text-gold-leaf transition-colors cursor-pointer border-0 bg-transparent text-[10px] uppercase tracking-widest font-bold shrink-0 overflow-hidden"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline whitespace-nowrap">{lang === "fr" ? "Retour" : "Back"}</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="w-px h-5 bg-parchment-ivory/15 shrink-0" />

          {/* Branding */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 overflow-hidden relative"
            >
              <Image src="/logo.png" alt="Aduna Gallery" width={32} height={32} className="object-contain" />
            </motion.div>
            <span className="font-serif text-sm text-parchment-ivory tracking-wide hidden md:inline">Aduna Gallery</span>
          </div>

          <div className="w-px h-5 bg-parchment-ivory/15 shrink-0 hidden md:block" />

          {/* Active Tab Name */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="hidden md:flex items-center gap-2 min-w-0"
            >
              <span className="text-sm">{tabInfo.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold-leaf truncate">
                {lang === "fr" ? tabInfo.fr : tabInfo.en}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Time + Notifications + Badge */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Live clock */}
          <LiveClock lang={lang} />

          <div className="w-px h-5 bg-parchment-ivory/15 hidden lg:block" />

          {/* Search */}
          <button className="flex items-center justify-center w-8 h-8 text-parchment-ivory/40 hover:text-gold-leaf transition-colors cursor-pointer border-0 bg-transparent">
            <Search size={15} />
          </button>

          {/* Notifications */}
          <NotificationBell basePath="/dashboard" lightMode />

          <div className="w-px h-5 bg-parchment-ivory/15" />

          {/* Collector badge */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-leaf">{roleInfo?.tier || "Prestige"}</span>
              <span className="text-[9px] text-parchment-ivory/40">{user?.name || (lang === "fr" ? "Collectionneur Privé" : "Private Collector")}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-full bg-gold-leaf/15 flex items-center justify-center border border-gold-leaf/25"
            >
              <span className="font-serif text-xs font-bold text-gold-leaf">{user?.avatar || "JD"}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
});
