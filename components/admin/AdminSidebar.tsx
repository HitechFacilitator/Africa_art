"use client";

import { useEffect } from "react";
import { AdminView } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import {
  Palette,
  Users,
  Shield,
  History,
  BadgeCheck,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileCheck,
  UserCog,
  Lock,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  unreadCounts?: Partial<Record<AdminView, number>>;
}

export default function AdminSidebar({ activeView, setActiveView, open, setOpen, unreadCounts }: AdminSidebarProps) {
  const { lang, setLang } = useTranslate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = () => setOpen(!open);
    window.addEventListener("toggle-admin-sidebar", handler);
    return () => window.removeEventListener("toggle-admin-sidebar", handler);
  }, [open, setOpen]);

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");

  const navItems = [
    { id: AdminView.Artworks, label: lang === "fr" ? "Œuvres" : "Artworks", icon: Palette },
    { id: AdminView.Users, label: lang === "fr" ? "Utilisateurs" : "Users", icon: UserCog },
    { id: AdminView.Collectors, label: lang === "fr" ? "Collectionneurs" : "Collectors", icon: Users },
    { id: AdminView.Certificates, label: lang === "fr" ? "Certificats" : "Certificates", icon: FileCheck },
    { id: AdminView.Escrow, label: lang === "fr" ? "Séquestre" : "Escrow", icon: Shield },
    { id: AdminView.AuditLog, label: lang === "fr" ? "Journal d'Audit" : "Audit Log", icon: History },
    { id: AdminView.Compliance, label: lang === "fr" ? "Conformité" : "Compliance", icon: BadgeCheck },
    { id: AdminView.POR, label: lang === "fr" ? "Prix sur Demande" : "Price on Request", icon: Lock },
    { id: AdminView.Chat, label: lang === "fr" ? "Messages" : "Messages", icon: MessageSquare },
    { id: AdminView.Settings, label: lang === "fr" ? "Paramètres" : "Settings", icon: Settings },
  ];

  const bottomItems = [
    { id: AdminView.SupportManagement, label: lang === "fr" ? "Support" : "Support", icon: HelpCircle },
  ];

  const handleNav = (view: AdminView) => {
    setActiveView(view);
    setOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-parchment-ivory border-r border-ebony-deep/10 py-6 text-ebony-deep">
      <div className="px-5 mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-medium tracking-tight text-terracotta-earth">
            Aduna Gallery
          </h1>
          <p className="text-[9px] font-sans font-bold tracking-[0.12em] uppercase text-ebony-deep/40 mt-0.5">
            {lang === "fr" ? "Centre de Contrôle Admin" : "Admin Control Hub"}
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer border-0 bg-transparent lg:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const count = unreadCounts?.[item.id] ?? 0;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all text-sm font-sans cursor-pointer border-0 ${
                isActive
                  ? "text-terracotta-earth font-semibold border-l-4 border-terracotta-earth bg-terracotta-earth/10"
                  : "text-ebony-deep/50 hover:bg-terracotta-earth/5 hover:text-ebony-deep border-l-4 border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-terracotta-earth" : "text-ebony-deep/40"}`} />
              <span className="truncate flex-1">{item.label}</span>
              {count > 0 && !isActive && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-ebony-deep/10 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all text-sm font-sans cursor-pointer border-0 ${
                isActive
                  ? "text-terracotta-earth font-semibold border-l-4 border-terracotta-earth bg-terracotta-earth/10"
                  : "text-ebony-deep/50 hover:bg-terracotta-earth/5 hover:text-ebony-deep border-l-4 border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-ebony-deep/40" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={toggleLang}
          className="w-full text-left px-3 py-2.5 flex items-center gap-3 text-ebony-deep/50 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent"
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span className="truncate">{lang === "fr" ? "English" : "Français"}</span>
        </button>

        <button
          onClick={logout}
          className="w-full text-left px-3 py-2.5 flex items-center gap-3 text-ebony-deep/40 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="truncate">{lang === "fr" ? "Déconnexion" : "Logout"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Blur backdrop — visible when sidebar is open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ebony-deep/20 backdrop-blur-md z-40"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — slides in from left */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 w-64 h-full z-50 flex flex-col shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
