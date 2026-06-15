"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { AdvisorConsultation } from "@/lib/advisorTypes";
import { CalendarCheck, Video, Phone, MapPin, Clock, CheckCircle, AlertCircle, Plus, X } from "lucide-react";

interface ConsultationsManageViewProps {
  consultations: AdvisorConsultation[];
}

export default function ConsultationsManageView({ consultations }: ConsultationsManageViewProps) {
  const { lang } = useTranslate();
  const [filter, setFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = filter === "All" ? consultations : consultations.filter(c => c.status === filter);
  const selected = consultations.find(c => c.id === selectedId);

  const statusColors: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-800 border-emerald-250/30",
    Pending: "bg-amber-50 text-amber-800 border-amber-300/30",
    Completed: "bg-ebony-deep/10 text-ebony-deep/60 border-ebony-deep/10",
    Cancelled: "bg-red-50 text-red-800 border-red-250/30",
  };

  const typeIcons: Record<string, typeof Video> = { Video, InPerson: MapPin, Phone };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Gestion des Consultations" : "Consultation Management"}</h2>
            <p className="font-sans text-xs text-ebony-deep/40 mt-1">{lang === "fr" ? "Planifiez et gérez vos sessions de conseil avec les collectionneurs." : "Schedule and manage your advisory sessions with collectors."}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0">
            <Plus className="w-3.5 h-3.5" /> {lang === "fr" ? "Nouvelle Consultation" : "New Consultation"}
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: lang === "fr" ? "Total" : "Total", count: consultations.length, color: "text-ebony-deep" },
          { label: lang === "fr" ? "Confirmées" : "Confirmed", count: consultations.filter(c => c.status === "Confirmed").length, color: "text-emerald-600" },
          { label: lang === "fr" ? "En Attente" : "Pending", count: consultations.filter(c => c.status === "Pending").length, color: "text-amber-600" },
          { label: lang === "fr" ? "Terminées" : "Completed", count: consultations.filter(c => c.status === "Completed").length, color: "text-ebony-deep/40" },
        ].map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setFilter(s.label === "Total" ? "All" : s.label === (lang === "fr" ? "Confirmées" : "Confirmed") ? "Confirmed" : s.label === (lang === "fr" ? "En Attente" : "Pending") ? "Pending" : "Completed")}
            className={`bg-parchment-ivory border p-4 text-left cursor-pointer transition-all ${filter === (s.label === "Total" ? "All" : s.label === (lang === "fr" ? "Confirmées" : "Confirmed") ? "Confirmed" : s.label === (lang === "fr" ? "En Attente" : "Pending") ? "Pending" : "Completed") ? "border-terracotta-earth/40" : "border-ebony-deep/10 hover:border-ebony-deep/20"}`}
          >
            <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-ebony-deep/40 mb-1">{s.label}</p>
            <p className={`font-serif text-xl font-semibold ${s.color}`}>{s.count}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-7 space-y-3">
          <AnimatePresence>
            {filtered.map((c, i) => {
              const TypeIcon = typeIcons[c.type] || Video;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedId(c.id === selectedId ? null : c.id)}
                  className={`bg-parchment-ivory border p-5 cursor-pointer transition-all ${selectedId === c.id ? "border-terracotta-earth/40" : "border-ebony-deep/10 hover:border-ebony-deep/20"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider border ${statusColors[c.status]}`}>{c.status}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider bg-surface-container-low text-ebony-deep/60 border border-ebony-deep/10"><TypeIcon className="w-2.5 h-2.5" /> {c.type}</span>
                        {c.followUpRequired && <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider bg-terracotta-earth/10 text-terracotta-earth border border-terracotta-earth/20"><AlertCircle className="w-2.5 h-2.5" /> {lang === "fr" ? "Suivi Requis" : "Follow-up"}</span>}
                      </div>
                      <h4 className="font-serif text-sm font-medium text-ebony-deep mt-2">{c.topic}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-ebony-deep/40 font-sans">
                    <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {c.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.timeSlot}</span>
                    <span>{c.clientName}</span>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase ${c.clientTier === "VIP" ? "bg-terracotta-earth/10 text-terracotta-earth" : c.clientTier === "Prestige" ? "bg-terracotta-earth/10 text-terracotta-earth" : "bg-ebony-deep/5 text-ebony-deep/40"}`}>{c.clientTier}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
                  <h3 className="font-serif text-lg font-medium text-ebony-deep">{lang === "fr" ? "Détails de la Consultation" : "Consultation Details"}</h3>
                  <button onClick={() => setSelectedId(null)} className="text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer bg-transparent border-0"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">{lang === "fr" ? "Sujet" : "Topic"}</p>
                    <p className="font-serif text-sm text-ebony-deep">{selected.topic}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">{lang === "fr" ? "Client" : "Client"}</p>
                      <p className="font-sans text-xs text-ebony-deep">{selected.clientName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">{lang === "fr" ? "Date" : "Date"}</p>
                      <p className="font-sans text-xs text-ebony-deep">{selected.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">{lang === "fr" ? "Créneau" : "Time Slot"}</p>
                      <p className="font-sans text-xs text-ebony-deep">{selected.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">{lang === "fr" ? "Type" : "Type"}</p>
                      <p className="font-sans text-xs text-ebony-deep">{selected.type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">{lang === "fr" ? "Notes" : "Notes"}</p>
                    <p className="font-sans text-xs text-ebony-deep/60 leading-relaxed">{selected.notes}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {selected.status === "Confirmed" && (
                      <button className="flex-1 px-4 py-2.5 bg-terracotta-earth text-parchment-ivory text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0">
                        <Video className="w-3.5 h-3.5 inline mr-1.5" /> {lang === "fr" ? "Lancer la Session" : "Launch Session"}
                      </button>
                    )}
                    {selected.status === "Pending" && (
                      <button className="flex-1 px-4 py-2.5 bg-emerald-600 text-white text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors cursor-pointer border-0">
                        <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> {lang === "fr" ? "Confirmer" : "Confirm"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-parchment-ivory border border-ebony-deep/10 p-8 text-center"
              >
                <CalendarCheck className="w-10 h-10 text-ebony-deep/30 mx-auto mb-3" />
                <p className="font-serif text-sm text-ebony-deep/40">{lang === "fr" ? "Sélectionnez une consultation pour voir les détails" : "Select a consultation to view details"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
