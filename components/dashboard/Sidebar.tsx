"use client";

import { useEffect } from "react";
import { ActiveTab, CollectorProfile } from "@/lib/dashboardTypes";
import Image from "next/image";
import {
  LayoutDashboard,
  Landmark,
  Award,
  ScrollText,
  Gavel,
  BookLock,
  Bell,
  TrendingUp,
  Eye,
  Truck,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: CollectorProfile;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onLogout: () => void;
  unreadCounts?: Partial<Record<ActiveTab, number>>;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile,
  isOpenMobile,
  setIsOpenMobile,
  open,
  setOpen,
  onLogout,
  unreadCounts
}: SidebarProps) {
  const { lang, setLang } = useTranslate();
  const { canAccessTab, user } = useAuth();

  useEffect(() => {
    const handler = () => setOpen(!open);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, [open, setOpen]);

  const allNavItems = [
    { id: ActiveTab.Dashboard, label: lang === "fr" ? "Tableau de Bord" : "Dashboard", icon: LayoutDashboard },
    { id: ActiveTab.Portfolio, label: lang === "fr" ? "Mes Acquisitions" : "My Acquisitions", icon: Landmark },
    { id: ActiveTab.Certificates, label: lang === "fr" ? "Certificats" : "Certificates", icon: Award },
    { id: ActiveTab.Inquiries, label: lang === "fr" ? "Demandes" : "Inquiries", icon: ScrollText },
    { id: ActiveTab.Consultations, label: lang === "fr" ? "Consultations" : "Consultations", icon: Gavel },
    { id: ActiveTab.PrivateCatalogues, label: lang === "fr" ? "Catalogues Privés" : "Private Catalogues", icon: BookLock },
    { id: ActiveTab.AlertsAuctions, label: lang === "fr" ? "Alertes et Enchères" : "Alerts & Auctions", icon: Bell },
    { id: ActiveTab.Investment, label: lang === "fr" ? "Investissement" : "Investment", icon: TrendingUp },
    { id: ActiveTab.Previews, label: lang === "fr" ? "Aperçus Exclusifs" : "Exclusive Previews", icon: Eye },
    { id: ActiveTab.Logistics, label: lang === "fr" ? "Logistique" : "Logistics", icon: Truck },
    { id: ActiveTab.Security, label: lang === "fr" ? "Sécurité" : "Security", icon: ShieldCheck },
    { id: ActiveTab.Chat, label: lang === "fr" ? "Messages" : "Messages", icon: MessageSquare },
    { id: ActiveTab.Documentation, label: lang === "fr" ? "Documentation" : "Documentation", icon: FileText },
    { id: ActiveTab.Support, label: lang === "fr" ? "Support" : "Support", icon: HelpCircle },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => canAccessTab(item.id));

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setOpen(false);
    setIsOpenMobile(false);
  };

  const menuContent = (
    <div className="flex flex-col h-full bg-surface border-r border-ebony-deep/5 shadow-sm py-6 text-on-surface">
      {/* Header */}
      <div className="px-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 overflow-hidden relative shrink-0">
            <Image src="/logo.png" alt="Aduna Gallery" width={32} height={32} className="object-contain" />
          </div>
          <h1 className="font-serif text-2xl font-medium tracking-tight text-ebony-deep">
            {lang === "fr" ? "Aduna Gallery" : "Aduna Gallery"}
          </h1>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 text-on-surface-variant/50 hover:text-ebony-deep transition-colors cursor-pointer"
          title={lang === "fr" ? "Fermer" : "Close"}
        >
          <X size={18} />
        </button>
      </div>

      {/* Profile card */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-3 bg-parchment-ivory p-3 border border-ebony-deep/5 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-ebony-deep text-gold-leaf flex items-center justify-center font-serif text-lg font-semibold shrink-0">
            {user?.avatar || profile.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-sans font-medium text-xs text-ebony-deep truncate">{user?.name || profile.name}</p>
            <p className="font-sans text-[10px] font-semibold tracking-wider uppercase text-gold-leaf">{profile.tier}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          const count = unreadCounts?.[item.id] ?? 0;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              title={item.label}
              className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 transition-all text-sm font-sans rounded-none ${
                isActive
                  ? 'text-ebony-deep font-semibold border-l-[3px] border-terracotta-earth bg-surface-container-low'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ebony-deep border-l-[3px] border-transparent'
              }`}
            >
              <IconComponent className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-terracotta-earth' : 'text-on-surface-variant/60'}`} />
              <span className="tracking-wide text-[13px] flex-1">{item.label}</span>
              {count > 0 && !isActive && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Language Selector */}
      <div className="px-3 mb-2">
        <div className="flex items-center bg-surface-container-low/80 rounded-full p-0.5">
          <button
            onClick={() => setLang("en")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
              lang === "en"
                ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                : "text-on-surface-variant/60 hover:text-ebony-deep"
            }`}
          >
            <span className="text-xs leading-none">🇬🇧</span>
            <span>EN</span>
          </button>
          <button
            onClick={() => setLang("fr")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
              lang === "fr"
                ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                : "text-on-surface-variant/60 hover:text-ebony-deep"
            }`}
          >
            <span className="text-xs leading-none">🇫🇷</span>
            <span>FR</span>
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-3 mt-auto pt-4 border-t border-ebony-deep/5">
        <button
          onClick={() => handleTabClick(ActiveTab.Settings)}
          className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 transition-all text-sm font-sans ${
            activeTab === ActiveTab.Settings
              ? 'text-ebony-deep font-semibold border-l-[3px] border-terracotta-earth bg-surface-container-low'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ebony-deep border-l-[3px] border-transparent'
          }`}
        >
          <Settings className="w-[18px] h-[18px]" />
          <span className="tracking-wide text-[13px]">{lang === "fr" ? "Paramètres" : "Settings"}</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full text-left px-3.5 py-2.5 flex items-center gap-3 text-on-surface-variant hover:text-terracotta-earth hover:bg-surface-container-low transition-all text-sm font-sans border-l-[3px] border-transparent"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="tracking-wide text-[13px]">{lang === "fr" ? "Déconnexion" : "Log Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop: Trigger button (always visible) ─── */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex fixed left-5 top-5 z-30 p-2.5 bg-surface border border-ebony-deep/10 text-on-surface-variant/70 hover:text-ebony-deep hover:bg-surface-container-low transition-all shadow-sm cursor-pointer"
        title={lang === "fr" ? "Ouvrir le menu" : "Open menu"}
      >
        <Menu size={18} />
      </button>

      {/* ─── Desktop: Overlay sidebar ─── */}
      <div className={`hidden lg:flex fixed inset-0 z-50 transition-all duration-300 ${open ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-ebony-deep/20 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* Sidebar panel */}
        <div
          className={`relative w-64 h-full z-10 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {menuContent}
        </div>
      </div>

      {/* ─── Mobile: top bar ─── */}
      <div className="lg:hidden w-full h-16 bg-surface border-b border-ebony-deep/5 fixed top-0 left-0 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Aduna Gallery" width={28} height={28} className="h-7 w-auto" />
          <h1 className="font-serif text-xl font-medium tracking-tight text-ebony-deep">{lang === "fr" ? "Aduna Gallery" : "Aduna Gallery"}</h1>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 border border-ebony-deep/10 text-ebony-deep"
        >
          {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ─── Mobile: drawer overlay ─── */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-ebony-deep/40 backdrop-blur-xs" onClick={() => setIsOpenMobile(false)} />
          <div className="relative w-64 max-w-xs h-full bg-surface">
            {menuContent}
          </div>
        </div>
      )}
    </>
  );
}
