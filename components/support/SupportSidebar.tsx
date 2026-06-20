"use client";

import { SupportTab } from "@/lib/supportTypes";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import {
  Ticket,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SupportSidebarProps {
  activeTab: SupportTab;
  setActiveTab: (tab: SupportTab) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  unreadCounts?: Partial<Record<SupportTab, number>>;
}

export default function SupportSidebar({ activeTab, setActiveTab, open, setOpen, unreadCounts }: SupportSidebarProps) {
  const { lang } = useTranslate();
  const { logout } = useAuth();

  const navItems = [
    { id: SupportTab.Tickets, label: lang === "fr" ? "Gestion des Tickets" : "Ticket Management", icon: Ticket },
    { id: SupportTab.Chat, label: lang === "fr" ? "Messages" : "Messages", icon: MessageSquare },
    { id: SupportTab.Settings, label: lang === "fr" ? "Paramètres" : "Settings", icon: Settings },
  ];

  const handleNav = (tab: SupportTab) => {
    setActiveTab(tab);
    setOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-parchment-ivory border-r border-ebony-deep/10 py-6 text-ebony-deep">
      <div className="px-5 mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-medium tracking-tight text-terracotta-earth">
            Aduna Gallery
          </h1>
          <p className="text-[9px] font-sans font-bold tracking-[0.12em] uppercase text-ebony-deep/40 mt-0.5">
            {lang === "fr" ? "Espace Support" : "Support Portal"}
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
          const isActive = activeTab === item.id;
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

      <div className="px-3 pt-4 border-t border-ebony-deep/10">
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
      {/* Desktop: Overlay sidebar */}
      <div className={`hidden lg:flex fixed inset-0 z-50 transition-all duration-300 ${open ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-ebony-deep/20 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`relative w-64 h-full z-10 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Mobile: Overlay sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-ebony-deep/20 backdrop-blur-md z-50"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 w-72 h-full z-50 flex flex-col bg-parchment-ivory shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
