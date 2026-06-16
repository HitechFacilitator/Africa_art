"use client";

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
  Globe,
  FileCheck,
  UserCog,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdminSidebar({ activeView, setActiveView, open, setOpen }: AdminSidebarProps) {
  const { lang, setLang } = useTranslate();
  const { user, logout } = useAuth();

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");

  const navItems = [
    { id: AdminView.Artworks, label: lang === "fr" ? "Œuvres" : "Artworks", icon: Palette },
    { id: AdminView.Users, label: lang === "fr" ? "Utilisateurs" : "Users", icon: UserCog },
    { id: AdminView.Collectors, label: lang === "fr" ? "Collectionneurs" : "Collectors", icon: Users },
    { id: AdminView.Certificates, label: lang === "fr" ? "Certificats" : "Certificates", icon: FileCheck },
    { id: AdminView.Escrow, label: lang === "fr" ? "Séquestre" : "Escrow", icon: Shield },
    { id: AdminView.AuditLog, label: lang === "fr" ? "Journal d'Audit" : "Audit Log", icon: History },
    { id: AdminView.Compliance, label: lang === "fr" ? "Conformité" : "Compliance", icon: BadgeCheck },
    { id: AdminView.Settings, label: lang === "fr" ? "Paramètres" : "Settings", icon: Settings },
  ];

  const bottomItems = [
    { id: AdminView.SupportManagement, label: lang === "fr" ? "Support" : "Support", icon: HelpCircle },
  ];

  const handleNav = (view: AdminView) => {
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
            {bottomItems.map((item) => {
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
                  <Icon className="w-4 h-4 text-ebony-deep/40" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={toggleLang}
              className="w-full text-left px-4 py-3 flex items-center gap-3 text-ebony-deep/50 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent mt-1"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "fr" ? "English" : "Français"}</span>
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 flex items-center gap-3 text-ebony-deep/40 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent mt-2"
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
                  <p className="text-[9px] font-sans font-bold tracking-[0.1em] uppercase text-ebony-deep/40">{lang === "fr" ? "Centre de Contrôle" : "Admin Control Hub"}</p>
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
                {bottomItems.map((item) => {
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
                      <Icon className="w-4 h-4 text-ebony-deep/40" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={toggleLang}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 text-ebony-deep/50 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent mt-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang === "fr" ? "English" : "Français"}</span>
                </button>
                <button onClick={logout} className="w-full text-left px-4 py-3 flex items-center gap-3 text-ebony-deep/40 hover:text-terracotta-earth transition-colors text-sm font-sans cursor-pointer border-0 bg-transparent mt-2">
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
