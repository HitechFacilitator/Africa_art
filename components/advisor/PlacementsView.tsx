"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { AdvisorPlacement } from "@/lib/advisorTypes";
import { Search, Plus, X, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface PlacementsViewProps {
  placements: AdvisorPlacement[];
}

export default function PlacementsView({ placements }: PlacementsViewProps) {
  const { lang } = useTranslate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = placements.filter(p => {
    if (filter !== "All" && p.status !== filter) return false;
    if (search && !p.artworkTitle.toLowerCase().includes(search.toLowerCase()) && !p.clientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = placements.find(p => p.id === selectedId);

  const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
    Proposed: { color: "bg-ebony-deep/10 text-ebony-deep/60 border-ebony-deep/10", icon: Clock },
    "Under Review": { color: "bg-terracotta-earth/10 text-terracotta-earth border-ebony-deep/20", icon: Eye },
    Accepted: { color: "bg-emerald-50 text-emerald-800 border-emerald-250/30", icon: CheckCircle },
    Declined: { color: "bg-red-50 text-red-800 border-red-250/30", icon: AlertCircle },
    Completed: { color: "bg-emerald-50 text-emerald-800 border-emerald-250/30", icon: CheckCircle },
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Placements Privés" : "Private Placements"}</h2>
            <p className="font-sans text-xs text-ebony-deep/40 mt-1">{lang === "fr" ? "Gérez vos propositions de placement pour les collectionneurs." : "Manage your placement proposals for collectors."}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0">
            <Plus className="w-3.5 h-3.5" /> {lang === "fr" ? "Nouveau Placement" : "New Placement"}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ebony-deep/30" />
          <input type="text" placeholder={lang === "fr" ? "Rechercher..." : "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-parchment-ivory border border-ebony-deep/10 text-sm font-sans text-ebony-deep placeholder:text-ebony-deep/30 focus:outline-none focus:border-terracotta-earth/30 transition-colors" />
        </div>
        <div className="flex gap-1 bg-parchment-ivory border border-ebony-deep/10 p-0.5">
          {["All", "Proposed", "Under Review", "Accepted", "Completed"].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer border-0 ${filter === t ? "bg-terracotta-earth text-parchment-ivory" : "text-ebony-deep/40 hover:text-ebony-deep bg-transparent"}`}>
              {t === "All" ? (lang === "fr" ? "Tous" : "All") : t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cards grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p, i) => {
            const sc = statusConfig[p.status] || statusConfig.Proposed;
            const Icon = sc.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                className={`bg-parchment-ivory border cursor-pointer transition-all overflow-hidden ${selectedId === p.id ? "border-terracotta-earth/40" : "border-ebony-deep/10 hover:border-ebony-deep/20"}`}
              >
                <div className="h-36 overflow-hidden relative">
                  <img src={p.imageUrl} alt={p.artworkTitle} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ebony-deep/80 to-transparent" />
                  <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider border ${sc.color}`}><Icon className="w-2.5 h-2.5" /> {p.status}</span>
                  <span className="absolute bottom-3 right-3 font-serif text-sm font-semibold text-terracotta-earth">€{p.valuation.toLocaleString()}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-serif text-sm font-medium text-ebony-deep mb-1">{p.artworkTitle}</h4>
                  <p className="text-[10px] text-ebony-deep/40 font-sans mb-2">{p.artworkCulture} • {p.artworkEra}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-ebony-deep/50 font-sans">{p.clientName}</span>
                    <span className="text-[10px] text-terracotta-earth font-sans font-bold">{lang === "fr" ? "Commission" : "Commission"}: €{p.commission.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-4">
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
                  <h3 className="font-serif text-base font-medium text-ebony-deep">{lang === "fr" ? "Détails du Placement" : "Placement Details"}</h3>
                  <button onClick={() => setSelectedId(null)} className="text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer bg-transparent border-0"><X className="w-4 h-4" /></button>
                </div>
                <div className="mb-4 overflow-hidden border border-ebony-deep/10"><img src={selected.imageUrl} alt={selected.artworkTitle} className="w-full h-40 object-cover" /></div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Œuvre" : "Artwork"}</p>
                    <p className="font-serif text-sm text-ebony-deep">{selected.artworkTitle}</p>
                    <p className="text-[10px] text-ebony-deep/40 font-sans">{selected.artworkCulture} • {selected.artworkEra}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Valorisation" : "Valuation"}</p>
                      <p className="font-serif text-sm font-semibold text-terracotta-earth">€{selected.valuation.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Commission" : "Commission"}</p>
                      <p className="font-serif text-sm font-semibold text-terracotta-earth">€{selected.commission.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Client" : "Client"}</p>
                    <p className="font-sans text-xs text-ebony-deep">{selected.clientName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/30 mb-1">{lang === "fr" ? "Notes" : "Notes"}</p>
                    <p className="font-sans text-[11px] text-ebony-deep/50 leading-relaxed">{selected.notes}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-parchment-ivory border border-ebony-deep/10 p-8 text-center">
                <Eye className="w-10 h-10 text-ebony-deep/30 mx-auto mb-3" />
                <p className="font-serif text-sm text-ebony-deep/40">{lang === "fr" ? "Sélectionnez un placement" : "Select a placement"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
