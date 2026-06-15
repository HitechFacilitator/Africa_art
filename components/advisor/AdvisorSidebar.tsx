"use client";

import { AdvisorView } from "@/lib/advisorTypes";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import {
  BarChart3,
  CalendarCheck,
  Users,
  Package,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdvisorSidebarProps {
  activeView: AdvisorView;
  setActiveView: (view: AdvisorView) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdvisorSidebar({ activeView, setActiveView, open, setOpen }: AdvisorSidebarProps) {
  const { lang } = useTranslate();
  const { user, logout } = useAuth();

  const navItems = [
    { id: AdvisorView.Overview, label: lang === "fr" ? "Vue d'Ensemble" : "Overview", icon: BarChart3 },
    { id: AdvisorView.Consultations, label: lang === "fr" ? "Consultations" : "Consultations", icon: CalendarCheck },
    { id: AdvisorView.Clients, label: lang === "fr" ? "Clients" : "Clients", icon: Users },
    { id: AdvisorView.Placements, label: lang === "fr" ? "Placements" : "Placements", icon: Package },
    { id: AdvisorView.Activity, label: lang === "fr" ? "Activité" : "Activity", icon: Activity },
    { id: AdvisorView.Chat, label: lang === "fr" ? "Messages" : "Messages", icon: MessageSquare },
    { id: AdvisorView.Settings, label: lang === "fr" ? "Paramètres" : "Settings", icon: Settings },
  ];

  const handleNav = (view: AdvisorView) => {
    setActiveView(view);
    setOpen(false);
  };

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40">
        <div className="flex flex-col h-full bg-parchment-ivory border-r border-ebony-deep/10 py-8 text-ebony-deep">
          <div className="px-6 mb-10">
            <h1 className="font-serif text-2xl font-medium tracking-tight text-terracotta-earth">
              Aduna Gallery
            </h1>
            <p className="text-[10px] font-sans font-bold tracking-[0.12em] uppercase text-ebony-deep/40 mt-1">
              {lang === "fr" ? "Espace Conseiller" : "Advisor Portal"}
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
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all text-sm font-sans cursor-pointer border-0 ${
                    isActive
                      ? "text-terracotta-earth font-semibold border-l-4 border-terracotta-earth bg-terracotta-earth/10"
                      : "text-ebony-deep/50 hover:bg-terracotta-earth/5 hover:text-ebony-deep border-l-4 border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-terracotta-earth" : "text-ebony-deep/40"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 mt-auto pt-6 border-t border-ebony-deep/10">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 flex items-center gap-3 text-ebony-deep/40 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === "fr" ? "Déconnexion" : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile popup overlay */}
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
              <div className="flex items-center justify-between px-6 py-5 border-b border-ebony-deep/10">
                <div>
                  <h1 className="font-serif text-xl font-medium text-terracotta-earth">Aduna Gallery</h1>
                  <p className="text-[9px] font-sans font-bold tracking-[0.1em] uppercase text-ebony-deep/40">{lang === "fr" ? "Espace Conseiller" : "Advisor Portal"}</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer bg-transparent border-0">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all text-sm font-sans cursor-pointer border-0 ${
                        isActive
                          ? "text-terracotta-earth font-semibold border-l-4 border-terracotta-earth bg-terracotta-earth/10"
                          : "text-ebony-deep/50 hover:bg-terracotta-earth/5 hover:text-ebony-deep border-l-4 border-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-terracotta-earth" : "text-ebony-deep/40"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="px-3 py-4 border-t border-ebony-deep/10">
                <button onClick={logout} className="w-full text-left px-4 py-3 flex items-center gap-3 text-ebony-deep/40 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent">
                  <LogOut className="w-4 h-4" />
                  <span>{lang === "fr" ? "Déconnexion" : "Logout"}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
