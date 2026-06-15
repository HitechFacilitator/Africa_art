"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { SupportTicket } from "@/lib/chatTypes";
import { Search, AlertCircle, Clock, CheckCircle, XCircle, MessageSquare, Send, User } from "lucide-react";

interface SupportManagementViewProps {
  tickets: SupportTicket[];
  onUpdateStatus: (id: string, status: SupportTicket["status"]) => void;
  onAddResponse: (id: string, text: string) => void;
}

export default function SupportManagementView({ tickets, onUpdateStatus, onAddResponse }: SupportManagementViewProps) {
  const { lang } = useTranslate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = tickets.filter(t => {
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (search && !t.clientName.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = tickets.find(t => t.id === selectedId);

  const openCount = tickets.filter(t => t.status === "Open").length;
  const inProgressCount = tickets.filter(t => t.status === "In Progress").length;
  const resolvedCount = tickets.filter(t => t.status === "Resolved").length;
  const closedCount = tickets.filter(t => t.status === "Closed").length;

  const handleReply = () => {
    if (!replyText.trim() || !selectedId) return;
    onAddResponse(selectedId, replyText.trim());
    setReplyText("");
  };

  const priorityColors: Record<string, string> = {
    Low: "bg-blue-50 text-blue-800",
    Medium: "bg-amber-50 text-amber-800",
    High: "bg-orange-50 text-orange-800",
    Urgent: "bg-red-50 text-red-800",
  };

  const statusColors: Record<string, string> = {
    Open: "bg-emerald-50 text-emerald-800",
    "In Progress": "bg-amber-50 text-amber-800",
    Resolved: "bg-blue-50 text-blue-800",
    Closed: "bg-zinc-100 text-zinc-500",
  };

  const statusIcons: Record<string, typeof AlertCircle> = {
    Open: AlertCircle,
    "In Progress": Clock,
    Resolved: CheckCircle,
    Closed: XCircle,
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-1">{lang === "fr" ? "Gestion du Support" : "Support Management"}</h2>
        <p className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Gérez les demandes de support de tous les utilisateurs." : "Manage support requests from all users."}</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: lang === "fr" ? "Ouverts" : "Open", count: openCount, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: lang === "fr" ? "En Cours" : "In Progress", count: inProgressCount, color: "text-amber-700", bg: "bg-amber-50" },
          { label: lang === "fr" ? "Résolus" : "Resolved", count: resolvedCount, color: "text-blue-700", bg: "bg-blue-50" },
          { label: lang === "fr" ? "Fermés" : "Closed", count: closedCount, color: "text-zinc-500", bg: "bg-zinc-100" },
        ].map((s, i) => (
          <motion.button key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setStatusFilter(s.label === (lang === "fr" ? "Ouverts" : "Open") ? "Open" : s.label === (lang === "fr" ? "En Cours" : "In Progress") ? "In Progress" : s.label === (lang === "fr" ? "Résolus" : "Resolved") ? "Resolved" : "Closed")} className={`${s.bg} border border-outline-variant/30 p-4 text-left cursor-pointer transition-all`}>
            <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1">{s.label}</p>
            <p className={`font-serif text-xl font-semibold ${s.color}`}>{s.count}</p>
          </motion.button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input type="text" placeholder={lang === "fr" ? "Rechercher par client, sujet, ID..." : "Search by client, subject, ID..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf transition-colors" />
        </div>
        <div className="flex gap-1 bg-surface-container-low border border-outline-variant/50 p-0.5">
          {["All", "Open", "In Progress", "Resolved", "Closed"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer border-0 ${statusFilter === f ? "bg-ebony-deep text-parchment-ivory" : "text-on-surface-variant hover:text-ebony-deep bg-transparent"}`}>
              {f === "All" ? (lang === "fr" ? "Tous" : "All") : f === "In Progress" ? (lang === "fr" ? "En Cours" : "In Progress") : f === "Open" ? (lang === "fr" ? "Ouverts" : "Open") : f === "Resolved" ? (lang === "fr" ? "Résolus" : "Resolved") : (lang === "fr" ? "Fermés" : "Closed")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket list */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map((ticket, i) => {
            const SIcon = statusIcons[ticket.status] || AlertCircle;
            return (
              <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => setSelectedId(ticket.id === selectedId ? null : ticket.id)} className={`bg-surface-container-lowest border border-outline-variant/30 p-5 cursor-pointer transition-all ${selectedId === ticket.id ? "border-gold-leaf" : "hover:border-outline-variant/60"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-on-surface-variant">{ticket.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider ${statusColors[ticket.status]}`}><SIcon className="w-3 h-3" /> {ticket.status}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  </div>
                  <span className="text-[9px] text-on-surface-variant font-sans">{ticket.createdDate}</span>
                </div>
                <h4 className="font-serif text-sm font-medium text-ebony-deep mb-1">{ticket.subject}</h4>
                <p className="font-sans text-[11px] text-on-surface-variant line-clamp-1 mb-2">{ticket.description}</p>
                <div className="flex items-center gap-3 text-[9px] text-on-surface-variant font-sans">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ticket.clientName}</span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase ${ticket.clientRole === "collector" ? "bg-gold-leaf/10 text-gold-leaf" : ticket.clientRole === "advisor" ? "bg-terracotta-earth/10 text-terracotta-earth" : "bg-surface-container-high text-on-surface-variant"}`}>{ticket.clientRole}</span>
                  <span>{lang === "fr" ? "Assigné à" : "Assigned to"}: {ticket.assignedTo}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {ticket.responses.length}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-surface-container-lowest border border-outline-variant/30 p-6 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-mono text-[10px] text-on-surface-variant">{selected.id}</span>
                    <h3 className="font-serif text-base font-medium text-ebony-deep">{selected.subject}</h3>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-sans font-bold ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-sans">
                  <div><p className="text-on-surface-variant">{lang === "fr" ? "Client" : "Client"}</p><p className="font-medium text-ebony-deep">{selected.clientName} <span className="text-on-surface-variant">({selected.clientRole})</span></p></div>
                  <div><p className="text-on-surface-variant">{lang === "fr" ? "Priorité" : "Priority"}</p><span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${priorityColors[selected.priority]}`}>{selected.priority}</span></div>
                  <div><p className="text-on-surface-variant">{lang === "fr" ? "Créé" : "Created"}</p><p className="text-ebony-deep">{selected.createdDate}</p></div>
                  <div><p className="text-on-surface-variant">{lang === "fr" ? "Dernière MAJ" : "Last Update"}</p><p className="text-ebony-deep">{selected.lastUpdate}</p></div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">{lang === "fr" ? "Description" : "Description"}</p>
                  <p className="font-sans text-xs text-ebony-deep leading-relaxed bg-surface-container-low p-3 border-l-2 border-l-gold-leaf">{selected.description}</p>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">{lang === "fr" ? "Réponses" : "Responses"} ({selected.responses.length})</p>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selected.responses.map((r, i) => (
                      <div key={i} className={`p-3 text-xs font-sans ${r.author === "Support" ? "bg-ebony-deep text-parchment-ivory ml-4" : "bg-surface-container-low text-ebony-deep border border-outline-variant/30 mr-4"}`}>
                        <p className="font-bold mb-1">{r.author}</p>
                        <p className="leading-relaxed">{r.text}</p>
                        <p className="font-mono text-[9px] mt-1 opacity-50">{r.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply input */}
                <div className="flex gap-2 mb-4">
                  <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={lang === "fr" ? "Tapez votre réponse..." : "Type your reply..."} className="flex-1 px-3 py-2 bg-surface-container-low border border-outline-variant/50 text-xs font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf" />
                  <button onClick={handleReply} disabled={!replyText.trim()} className="px-3 py-2 bg-ebony-deep text-parchment-ivory text-[10px] font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0"><Send className="w-3.5 h-3.5" /></button>
                </div>

                {/* Status change */}
                <div>
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">{lang === "fr" ? "Changer le Statut" : "Change Status"}</p>
                  <div className="flex flex-wrap gap-2">
                    {(["Open", "In Progress", "Resolved", "Closed"] as const).map(s => (
                      <button key={s} onClick={() => onUpdateStatus(selected.id, s)} className={`px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest border transition-all cursor-pointer ${selected.status === s ? "bg-ebony-deep text-parchment-ivory border-ebony-deep" : "bg-transparent text-on-surface-variant border-outline-variant/50 hover:border-ebony-deep"}`}>
                        {s === "In Progress" ? (lang === "fr" ? "En Cours" : "In Progress") : s === "Open" ? (lang === "fr" ? "Ouvert" : "Open") : s === "Resolved" ? (lang === "fr" ? "Résolu" : "Resolved") : (lang === "fr" ? "Fermé" : "Closed")}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-container-lowest border border-outline-variant/30 p-8 text-center">
                <MessageSquare className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
                <p className="font-serif text-sm text-on-surface-variant">{lang === "fr" ? "Sélectionnez un ticket" : "Select a ticket"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
