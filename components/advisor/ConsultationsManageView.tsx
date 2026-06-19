"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { advisorApi, consultationsApi } from "@/lib/api";
import { useSSE } from "@/lib/useChatSSE";
import {
  CalendarCheck,
  Video,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Send,
  User,
  Mail,
  Building2,
  Globe,
  FileText,
  Ban,
  CheckSquare,
  Loader2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

interface AdvisorConsultation {
  id: string;
  expertName: string;
  expertTitle: string;
  expertAvatar: string;
  date: string;
  timeSlot: string;
  topic: string;
  status: string;
  notes: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientInstitution: string;
  clientCountry: string;
  type: string;
  rejectionReason: string;
  currentCollection: string;
  meetingFormat: string;
  followUpRequired: boolean;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-800 border-emerald-250/30",
  Pending: "bg-amber-50 text-amber-800 border-amber-300/30",
  Completed: "bg-ebony-deep/10 text-ebony-deep/60 border-ebony-deep/10",
  Cancelled: "bg-red-50 text-red-800 border-red-250/30",
  Rejected: "bg-red-50 text-red-800 border-red-250/30",
};

const TYPE_ICONS: Record<string, string> = {
  VIDEO: "Video",
  PHONE: "Phone",
  IN_PERSON: "InPerson",
  ACQUISITION_ADVICE: "Acquisition",
  INVESTMENT_ADVICE: "Investment",
  COLLECTION_REVIEW: "Collection",
};

export default function ConsultationsManageView() {
  const { lang } = useTranslate();
  const [consultations, setConsultations] = useState<AdvisorConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await advisorApi.getConsultations();
      setConsultations(res.data as unknown as AdvisorConsultation[]);
    } catch (err) {
      console.error("Failed to fetch consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  useSSE("/api/v1/events", {
    "consultation-update": (data: unknown) => {
      const { action, consultation } = data as { action: string; consultation: { id: string; status: string } };
      if (["confirmed", "completed", "cancelled", "rejected", "created"].includes(action)) {
        fetchConsultations();
      }
    },
  });

  const filtered = filter === "All" ? consultations : consultations.filter(c => c.status === filter);
  const selected = consultations.find(c => c.id === selectedId);

  const handleAction = async (id: string, action: "confirm" | "complete" | "cancel") => {
    setUpdatingId(id);
    try {
      if (action === "confirm") await consultationsApi.confirm(id);
      else if (action === "complete") await consultationsApi.complete(id);
      else if (action === "cancel") await consultationsApi.cancel(id);
      await fetchConsultations();
    } catch (err: any) {
      console.error("Failed to update consultation:", err?.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTargetId) return;
    setUpdatingId(rejectTargetId);
    try {
      await consultationsApi.reject(rejectTargetId, rejectReason || undefined);
      await fetchConsultations();
      setShowRejectModal(false);
      setRejectReason("");
      setRejectTargetId(null);
      setSelectedId(null);
    } catch (err: any) {
      console.error("Failed to reject consultation:", err?.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectTargetId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const counts = {
    All: consultations.length,
    Pending: consultations.filter(c => c.status === "Pending").length,
    Confirmed: consultations.filter(c => c.status === "Confirmed").length,
    Completed: consultations.filter(c => c.status === "Completed").length,
    Rejected: consultations.filter(c => c.status === "Rejected").length,
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">
              {lang === "fr" ? "Gestion des Consultations" : "Consultation Management"}
            </h2>
            <p className="font-sans text-xs text-ebony-deep/40 mt-1">
              {lang === "fr" ? "Planifiez et gérez vos sessions de conseil avec les collectionneurs." : "Schedule and manage your advisory sessions with collectors."}
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {Object.entries(counts).map(([key, count], i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setFilter(key)}
            className={`bg-parchment-ivory border p-4 text-left cursor-pointer transition-all ${
              filter === key ? "border-terracotta-earth/40 shadow-sm" : "border-ebony-deep/10 hover:border-ebony-deep/20"
            }`}
          >
            <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-ebony-deep/40 mb-1">
              {key === "All" ? (lang === "fr" ? "Total" : "All") : key}
            </p>
            <p className={`font-serif text-xl font-semibold ${
              key === "Pending" ? "text-amber-600" :
              key === "Confirmed" ? "text-emerald-600" :
              key === "Rejected" ? "text-red-600" :
              "text-ebony-deep"
            }`}>{count}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-5 space-y-2">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-6 h-6 text-ebony-deep/30 mx-auto animate-spin" />
              <p className="font-sans text-xs text-ebony-deep/40 mt-2">{lang === "fr" ? "Chargement..." : "Loading..."}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-12 text-center">
              <CalendarCheck className="w-10 h-10 text-ebony-deep/20 mx-auto mb-3" />
              <p className="font-serif text-sm text-ebony-deep/40">{lang === "fr" ? "Aucune consultation" : "No consultations"}</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((c, i) => {
                const isSelected = c.id === selectedId;
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedId(isSelected ? null : c.id)}
                    className={`bg-parchment-ivory border p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-terracotta-earth/50 shadow-md ring-1 ring-terracotta-earth/20"
                        : "border-ebony-deep/10 hover:border-ebony-deep/20 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider border ${STATUS_COLORS[c.status] || STATUS_COLORS.Pending}`}>
                            {c.status}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider bg-surface-container-low text-ebony-deep/60 border border-ebony-deep/10">
                            {TYPE_ICONS[c.type] || c.type}
                          </span>
                          {c.followUpRequired && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider bg-terracotta-earth/10 text-terracotta-earth border border-terracotta-earth/20">
                              <AlertCircle className="w-2.5 h-2.5" /> {lang === "fr" ? "Suivi" : "Follow-up"}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-sm font-medium text-ebony-deep truncate">{c.topic}</h4>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-on-surface-variant/40 shrink-0 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-ebony-deep/40 font-sans">
                      <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {c.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.timeSlot}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {c.clientName}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 30, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-parchment-ivory border border-ebony-deep/10 p-6 sticky top-20"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-ebony-deep/5">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-ebony-deep">
                      {lang === "fr" ? "Détails de la Consultation" : "Consultation Details"}
                    </h3>
                    <p className="font-sans text-[10px] text-ebony-deep/40 mt-1">{selected.id}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-ebony-deep/40 hover:text-terracotta-earth transition-colors cursor-pointer bg-transparent border-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status — clickable dropdown */}
                <div className="mb-6">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-2 block">
                    {lang === "fr" ? "Statut de la Consultation" : "Consultation Status"}
                  </label>
                  <select
                    value={selected.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      if (newStatus === selected.status) return;
                      if (newStatus === "Rejected") {
                        openRejectModal(selected.id);
                        return;
                      }
                      setUpdatingId(selected.id);
                      try {
                        if (newStatus === "Confirmed") await consultationsApi.confirm(selected.id);
                        else if (newStatus === "Completed") await consultationsApi.complete(selected.id);
                        else if (newStatus === "Cancelled") await consultationsApi.cancel(selected.id);
                        await fetchConsultations();
                      } catch (err: any) {
                        alert(err?.message || "Failed to update status");
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                    disabled={updatingId === selected.id || selected.status === "Completed" || selected.status === "Rejected" || selected.status === "Cancelled"}
                    className={`w-full px-4 py-3 text-[11px] font-sans font-bold uppercase tracking-wider border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-leaf/30 ${STATUS_COLORS[selected.status] || STATUS_COLORS.Pending} disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <option value="Pending">{lang === "fr" ? "En attente" : "Pending"}</option>
                    <option value="Confirmed">{lang === "fr" ? "Confirmé" : "Confirmed"}</option>
                    <option value="Completed">{lang === "fr" ? "Terminé" : "Completed"}</option>
                    <option value="Cancelled">{lang === "fr" ? "Annulé" : "Cancelled"}</option>
                    <option value="Rejected">{lang === "fr" ? "Refusé" : "Rejected"}</option>
                  </select>
                  {selected.status === "Rejected" && selected.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-100/50 border border-red-200/30">
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-600 mb-1">
                        {lang === "fr" ? "Raison du refus" : "Rejection reason"}
                      </p>
                      <p className="font-sans text-xs text-red-700">{selected.rejectionReason}</p>
                    </div>
                  )}
                  {updatingId === selected.id && (
                    <p className="text-[10px] text-gold-leaf mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> {lang === "fr" ? "Mise à jour..." : "Updating..."}
                    </p>
                  )}
                </div>

                {/* Consultation Info */}
                <div className="space-y-5">
                  {/* Topic */}
                  <div>
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">
                      {lang === "fr" ? "Sujet" : "Topic"}
                    </p>
                    <p className="font-serif text-sm text-ebony-deep">{selected.topic}</p>
                  </div>

                  {/* Schedule + Format row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-surface-container-low p-3 border border-ebony-deep/5">
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">
                        <CalendarCheck className="w-3 h-3 inline mr-1" />
                        {lang === "fr" ? "Date" : "Date"}
                      </p>
                      <p className="font-sans text-xs font-semibold text-ebony-deep">{selected.date}</p>
                    </div>
                    <div className="bg-surface-container-low p-3 border border-ebony-deep/5">
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {lang === "fr" ? "Heure" : "Time"}
                      </p>
                      <p className="font-sans text-xs font-semibold text-ebony-deep">{selected.timeSlot}</p>
                    </div>
                    {selected.meetingFormat && (
                      <div className="bg-surface-container-low p-3 border border-ebony-deep/5">
                        <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">
                          {lang === "fr" ? "Format" : "Format"}
                        </p>
                        <p className="font-sans text-xs font-semibold text-ebony-deep capitalize">{selected.meetingFormat}</p>
                      </div>
                    )}
                  </div>

                  {/* Client Info */}
                  <div>
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-3">
                      {lang === "fr" ? "Informations du Client" : "Client Information"}
                    </p>
                    <div className="bg-surface-container-low border border-ebony-deep/5 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-ebony-deep flex items-center justify-center text-parchment-ivory text-xs font-bold shrink-0">
                          {selected.clientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-sans text-sm font-semibold text-ebony-deep">{selected.clientName}</p>
                          <p className="text-[10px] text-ebony-deep/40">{selected.clientEmail}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-ebony-deep/5">
                        {selected.clientPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-ebony-deep/30" />
                            <span className="font-sans text-[11px] text-ebony-deep/60">{selected.clientPhone}</span>
                          </div>
                        )}
                        {selected.clientInstitution && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-ebony-deep/30" />
                            <span className="font-sans text-[11px] text-ebony-deep/60">{selected.clientInstitution}</span>
                          </div>
                        )}
                        {selected.clientCountry && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-ebony-deep/30" />
                            <span className="font-sans text-[11px] text-ebony-deep/60">{selected.clientCountry}</span>
                          </div>
                        )}
                      </div>
                      {selected.currentCollection && (
                        <div className="pt-2 border-t border-ebony-deep/5 mt-2">
                          <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-0.5">
                            {lang === "fr" ? "Collection Actuelle" : "Current Collection"}
                          </p>
                          <span className="font-sans text-[11px] text-ebony-deep/60">{selected.currentCollection}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Notes */}
                  {selected.notes && (
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">
                        <FileText className="w-3 h-3 inline mr-1" />
                        {lang === "fr" ? "Notes du Client" : "Client Notes"}
                      </p>
                      <div className="bg-surface-container-low border border-ebony-deep/5 p-4">
                        <p className="font-sans text-xs text-ebony-deep/60 leading-relaxed whitespace-pre-wrap">{selected.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Created date */}
                  <div className="text-[10px] text-ebony-deep/30 font-sans">
                    {lang === "fr" ? "Créé le" : "Created"}: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "—"}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-12 text-center"
              >
                <CalendarCheck className="w-10 h-10 text-ebony-deep/20 mx-auto mb-3" />
                <p className="font-serif text-sm text-ebony-deep/40">
                  {lang === "fr" ? "Sélectionnez une consultation pour voir les détails" : "Select a consultation to view details"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-parchment-ivory max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button onClick={() => setShowRejectModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                <X className="w-6 h-6" />
              </button>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Ban className="w-5 h-5 text-red-600" />
                  <h3 className="font-serif text-lg font-medium text-ebony-deep">
                    {lang === "fr" ? "Refuser la Consultation" : "Reject Consultation"}
                  </h3>
                </div>
                <p className="font-sans text-xs text-on-surface-variant">
                  {lang === "fr" ? "Veuillez fournir une raison pour le refus. Le client sera notifié." : "Please provide a reason for rejection. The client will be notified."}
                </p>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder={lang === "fr" ? "Raison du refus (optionnel)..." : "Rejection reason (optional)..."}
                className="w-full border border-ebony-deep/15 p-3 text-sm focus:border-red-400 focus:outline-none bg-surface resize-none mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="border border-ebony-deep/20 text-on-surface-variant px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:text-ebony-deep cursor-pointer bg-transparent"
                >
                  {lang === "fr" ? "Annuler" : "Cancel"}
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  disabled={updatingId === rejectTargetId}
                  className="bg-red-600 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-red-700 transition-colors cursor-pointer border-0 flex items-center gap-2 disabled:opacity-50"
                >
                  {updatingId === rejectTargetId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                  {lang === "fr" ? "Confirmer le Refus" : "Confirm Rejection"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
