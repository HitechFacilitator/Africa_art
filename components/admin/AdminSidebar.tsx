"use client";

import { AdminView } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import {
  Palette,
  Users,
  Shield,
  History,
  BadgeCheck,
  Settings,
  FileText,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export default function AdminSidebar({
  activeView,
  setActiveView,
  isOpenMobile,
  setIsOpenMobile,
}: AdminSidebarProps) {
  const { lang } = useTranslate();
  const navItems = [
    { id: AdminView.Artworks, label: lang === "fr" ? "Œuvres" : "Artworks", icon: Palette },
    { id: AdminView.Collectors, label: lang === "fr" ? "Collectionneurs" : "Collectors", icon: Users },
    { id: AdminView.Escrow, label: lang === "fr" ? "Séquestre" : "Escrow", icon: Shield },
    { id: AdminView.AuditLog, label: lang === "fr" ? "Journal d'Audit" : "Audit Log", icon: History },
    { id: AdminView.Compliance, label: lang === "fr" ? "Conformité" : "Compliance", icon: BadgeCheck },
    { id: AdminView.Settings, label: lang === "fr" ? "Paramètres" : "Settings", icon: Settings },
  ];

  const bottomItems = [
    { id: AdminView.Docs, label: lang === "fr" ? "Documentation" : "Documentation", icon: FileText },
    { id: AdminView.Support, label: "Support", icon: HelpCircle },
  ];

  const handleNav = (view: AdminView) => {
    setActiveView(view);
    setIsOpenMobile(false);
  };

  const menuContent = (
    <div className="flex flex-col h-full bg-surface-container-low border-r border-outline-variant/50 py-8 text-on-surface">
      <div className="px-6 mb-10">
        <h1 className="font-serif text-2xl font-medium tracking-tight text-ebony-deep">
          Aduna Gallery
        </h1>
        <p className="text-[10px] font-sans font-bold tracking-[0.12em] uppercase text-gold-leaf mt-1">
          {lang === "fr" ? "Centre de Contrôle Admin" : "Admin Control Hub"}
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all text-sm font-sans ${
                isActive
                  ? "text-ebony-deep font-semibold border-l-4 border-terracotta-earth bg-surface-container"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-ebony-deep border-l-4 border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-terracotta-earth" : "text-on-surface-variant/60"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 mt-auto pt-6 border-t border-outline-variant/30">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all text-sm font-sans ${
                isActive
                  ? "text-ebony-deep font-semibold border-l-4 border-terracotta-earth bg-surface-container"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-ebony-deep border-l-4 border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 text-on-surface-variant/60" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40">
        {menuContent}
      </aside>

      <div className="lg:hidden w-full h-14 bg-surface border-b border-ebony-deep/5 fixed top-0 left-0 px-4 flex items-center justify-between z-30">
        <div>
          <h1 className="font-serif text-lg font-medium tracking-tight text-ebony-deep">
            Aduna Gallery
          </h1>
          <p className="text-[9px] font-sans font-bold tracking-[0.1em] uppercase text-gold-leaf">
            Admin
          </p>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 border border-ebony-deep/10 text-ebony-deep"
        >
          {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-ebony-deep/40 backdrop-blur-sm"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative w-64 max-w-xs h-full bg-surface-container-low">
            {menuContent}
          </div>
        </div>
      )}
    </>
  );
}
