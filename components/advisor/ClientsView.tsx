"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { AdvisorClient } from "@/lib/advisorTypes";
import { Search, Star, Globe, Mail, X, TrendingUp } from "lucide-react";

interface ClientsViewProps {
  clients: AdvisorClient[];
}

export default function ClientsView({ clients }: ClientsViewProps) {
  const { lang } = useTranslate();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = search
    ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
    : clients;

  const selected = clients.find(c => c.id === selectedId);

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Gestion des Clients" : "Client Management"}</h2>
        <p className="font-sans text-xs text-ebony-deep/40 mt-1">{lang === "fr" ? "Gérez votre portefeuille de clients et suivez leurs interactions." : "Manage your client portfolio and track their interactions."}</p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ebony-deep/30" />
        <input
          type="text"
          placeholder={lang === "fr" ? "Rechercher un client..." : "Search clients..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-parchment-ivory border border-ebony-deep/10 text-sm font-sans text-ebony-deep placeholder:text-ebony-deep/30 focus:outline-none focus:border-terracotta-earth/30 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Client cards */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedId(c.id === selectedId ? null : c.id)}
              className={`bg-parchment-ivory border p-5 cursor-pointer transition-all ${selectedId === c.id ? "border-terracotta-earth/40" : "border-ebony-deep/10 hover:border-ebony-deep/20"}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: c.avatarColor }}>{c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-serif text-sm font-medium text-ebony-deep">{c.name}</h4>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase ${c.tier === "VIP" ? "bg-terracotta-earth/10 text-terracotta-earth" : c.tier === "Prestige" ? "bg-terracotta-earth/10 text-terracotta-earth" : "bg-ebony-deep/5 text-ebony-deep/40"}`}>{c.tier}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-ebony-deep/40 font-sans">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {c.country}</span>
                    <span>{c.acquisitionsCount} {lang === "fr" ? "acquisitions" : "acquisitions"}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-terracotta-earth" /> {c.satisfactionScore}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-sm font-semibold text-terracotta-earth">€{c.totalSpent.toLocaleString()}</p>
                  <p className="text-[9px] text-ebony-deep/30 font-sans">{lang === "fr" ? "Dernier contact" : "Last contact"}: {c.lastContact}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-parchment-ivory border border-ebony-deep/10 p-6 sticky top-20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-medium text-ebony-deep">{lang === "fr" ? "Profil Client" : "Client Profile"}</h3>
                  <button onClick={() => setSelectedId(null)} className="text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer bg-transparent border-0"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-ebony-deep/10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: selected.avatarColor }}>{selected.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-serif text-base font-medium text-ebony-deep">{selected.name}</h4>
                    <p className="text-[10px] text-ebony-deep/40 font-sans flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-surface-container-low p-3 border border-ebony-deep/5">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Dépensé Total" : "Total Spent"}</p>
                    <p className="font-serif text-lg font-semibold text-terracotta-earth">€{selected.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-surface-container-low p-3 border border-ebony-deep/5">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Acquisitions" : "Acquisitions"}</p>
                    <p className="font-serif text-lg font-semibold text-ebony-deep">{selected.acquisitionsCount}</p>
                  </div>
                  <div className="bg-surface-container-low p-3 border border-ebony-deep/5">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Satisfaction" : "Satisfaction"}</p>
                    <p className="font-serif text-lg font-semibold text-emerald-600">{selected.satisfactionScore}%</p>
                  </div>
                  <div className="bg-surface-container-low p-3 border border-ebony-deep/5">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Pays" : "Country"}</p>
                    <p className="font-sans text-xs text-ebony-deep">{selected.country}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-2">{lang === "fr" ? "Intérêts" : "Interests"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.interests.map(int => (
                      <span key={int} className="px-2 py-1 text-[9px] font-sans bg-terracotta-earth/10 text-terracotta-earth border border-ebony-deep/10">{int}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-parchment-ivory border border-ebony-deep/10 p-8 text-center"
              >
                <TrendingUp className="w-10 h-10 text-ebony-deep/30 mx-auto mb-3" />
                <p className="font-serif text-sm text-ebony-deep/40">{lang === "fr" ? "Sélectionnez un client pour voir le profil" : "Select a client to view profile"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
