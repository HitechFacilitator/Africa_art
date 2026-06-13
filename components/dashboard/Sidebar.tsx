"use client";

import { ActiveTab, CollectorProfile } from "@/lib/dashboardTypes";
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
  X
} from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: CollectorProfile;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile,
  isOpenMobile,
  setIsOpenMobile,
  onLogout
}: SidebarProps) {
  const { lang } = useTranslate();
  const navItems = [
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
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsOpenMobile(false);
  };

  const menuContent = (
    <div className="flex flex-col h-full bg-surface border-r border-ebony-deep/5 shadow-sm py-8 text-on-surface">
      <div className="px-6 mb-10">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ebony-deep mb-6">
          {lang === "fr" ? "Aduna Gallery" : "Aduna Gallery"}
        </h1>
        <div className="flex items-center gap-4 bg-parchment-ivory p-4 border border-ebony-deep/5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-ebony-deep text-gold-leaf flex items-center justify-center font-serif text-xl font-semibold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="font-sans font-medium text-sm text-ebony-deep">{profile.name}</p>
            <p className="font-sans text-[11px] font-semibold tracking-wider uppercase text-gold-leaf">{profile.tier}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 px-3">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3.5 transition-all text-sm font-sans ${
                isActive
                  ? 'text-ebony-deep font-semibold border-l-4 border-terracotta-earth bg-surface-container-low'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ebony-deep border-l-4 border-transparent'
              }`}
            >
              <IconComponent className={`w-4.5 h-4.5 ${isActive ? 'text-terracotta-earth' : 'text-on-surface-variant/70'}`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="px-3 mt-auto pt-6 border-t border-ebony-deep/5">
        <button
          onClick={() => handleTabClick(ActiveTab.Settings)}
          className={`w-full text-left px-4 py-3 flex items-center gap-3.5 transition-all text-sm font-sans ${
            activeTab === ActiveTab.Settings
              ? 'text-ebony-deep font-semibold border-l-4 border-terracotta-earth bg-surface-container-low'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ebony-deep border-l-4 border-transparent'
          }`}
        >
          <Settings className="w-4.5 h-4.5" />
          <span className="tracking-wide">{lang === "fr" ? "Paramètres" : "Settings"}</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 flex items-center gap-3.5 text-on-surface-variant hover:text-terracotta-earth hover:bg-surface-container-low transition-all text-sm font-sans border-l-4 border-transparent"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className="tracking-wide">{lang === "fr" ? "Déconnexion" : "Log Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40">
        {menuContent}
      </aside>

      <div className="lg:hidden w-full h-16 bg-surface border-b border-ebony-deep/5 fixed top-0 left-0 px-6 flex items-center justify-between z-30">
        <h1 className="font-serif text-xl font-medium tracking-tight text-ebony-deep">{lang === "fr" ? "Aduna Gallery" : "Aduna Gallery"}</h1>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 border border-ebony-deep/10 text-ebony-deep"
        >
          {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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