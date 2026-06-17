"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { dashboardApi, adminApi } from "@/lib/api";
import { useTranslate } from "@/lib/translations";
import {
  Send,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Plus,
  Filter,
  CircleDot,
  XCircle,
} from "lucide-react";

interface Ticket {
  id: string;
  clientName: string;
  clientRole: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
  responses: Array<{ author: string; text: string; timestamp: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
  Resolved: "bg-sky-100 text-sky-800 border-sky-200",
  Closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-emerald-100 text-emerald-800",
};

interface SupportViewProps {
  lang: string;
}

export default function SupportView({ lang }: SupportViewProps) {
  const { user } = useAuth();
  const isSupportOrAdmin = user?.role === "support" || user?.role === "admin";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // New ticket form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("General");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reply
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getMyTickets();
      setTickets(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async () => {
    if (!newSubject.trim() || !newDescription.trim()) return;
    setSubmitting(true);
    try {
      const res = await dashboardApi.createSupportTicket({
        subject: newSubject.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        category: newCategory,
      });
      setTickets((prev) => [res.data, ...prev]);
      setNewSubject("");
      setNewDescription("");
      setNewPriority("Medium");
      setNewCategory("General");
      setShowNewForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Failed to create ticket:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await adminApi.updateSupportTicketStatus(ticketId, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    try {
      const authorName = isSupportOrAdmin
        ? user?.name || "Support"
        : user?.name || "User";
      await adminApi.addSupportTicketResponse(ticketId, replyText.trim());
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                responses: [
                  ...t.responses,
                  {
                    author: authorName,
                    text: replyText.trim(),
                    timestamp: new Date()
                      .toISOString()
                      .replace("T", " ")
                      .slice(0, 19),
                  },
                ],
              }
            : t
        )
      );
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Failed to reply:", err);
    }
  };

  const filteredTickets =
    filterStatus === "all"
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  const statusCounts = {
    all: tickets.length,
    Open: tickets.filter((t) => t.status === "Open").length,
    "In Progress": tickets.filter((t) => t.status === "In Progress").length,
    Resolved: tickets.filter((t) => t.status === "Resolved").length,
    Closed: tickets.filter((t) => t.status === "Closed").length,
  };

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-ebony-deep">
            {isSupportOrAdmin ? t("Gestion des Tickets", "Ticket Management") : t("Mes Tickets Support", "My Support Tickets")}
          </h2>
          <p className="font-sans text-sm text-on-surface-variant mt-1">
            {isSupportOrAdmin
              ? t(
                  "Gérez les demandes de support de tous les utilisateurs.",
                  "Manage support requests from all users."
                )
              : t(
                  "Soumettez et suivez vos demandes de support.",
                  "Submit and track your support requests."
                )}
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-opacity cursor-pointer border-0 shrink-0"
        >
          <Plus size={14} />
          {t("Nouveau Ticket", "New Ticket")}
        </button>
      </div>

      {/* Success banner */}
      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-800 font-sans text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          {t("Ticket créé avec succès.", "Ticket created successfully.")}
        </div>
      )}

      {/* New ticket form */}
      {showNewForm && (
        <div className="bg-surface-container-low border border-on-surface/5 p-6 space-y-4">
          <h3 className="font-serif text-lg text-ebony-deep">
            {t("Nouveau Ticket de Support", "New Support Ticket")}
          </h3>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder={t("Sujet du ticket...", "Ticket subject...")}
            className="w-full px-3 py-2.5 bg-parchment-ivory border border-on-surface/10 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-terracotta-earth/30"
          />
          <div className="flex gap-3">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="px-3 py-2.5 bg-parchment-ivory border border-on-surface/10 text-sm font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30"
            >
              <option value="Low">{t("Priorité: Basse", "Priority: Low")}</option>
              <option value="Medium">{t("Priorité: Moyenne", "Priority: Medium")}</option>
              <option value="High">{t("Priorité: Haute", "Priority: High")}</option>
            </select>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2.5 bg-parchment-ivory border border-on-surface/10 text-sm font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30"
            >
              <option value="General">{t("Général", "General")}</option>
              <option value="Technical">{t("Technique", "Technical")}</option>
              <option value="Billing">{t("Facturation", "Billing")}</option>
              <option value="Account">{t("Compte", "Account")}</option>
              <option value="Other">{t("Autre", "Other")}</option>
            </select>
          </div>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={5}
            placeholder={t(
              "Décrivez votre problème ou demande en détail...",
              "Describe your issue or request in detail..."
            )}
            className="w-full px-3 py-2.5 bg-parchment-ivory border border-on-surface/10 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-terracotta-earth/30 resize-none"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateTicket}
              disabled={submitting || !newSubject.trim() || !newDescription.trim()}
              className="px-4 py-2.5 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-opacity cursor-pointer border-0 disabled:opacity-50"
            >
              {submitting ? "..." : t("Soumettre", "Submit")}
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2.5 border border-on-surface/10 text-on-surface-variant text-xs font-sans font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors cursor-pointer bg-transparent"
            >
              {t("Annuler", "Cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        <Filter size={14} className="text-on-surface-variant mr-1 shrink-0" />
        {(["all", "Open", "In Progress", "Resolved", "Closed"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-sans font-medium uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border-0 ${
                filterStatus === s
                  ? "bg-ebony-deep text-parchment-ivory"
                  : "bg-transparent text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {s === "all" ? t("Tous", "All") : s}
              <span className="ml-1.5 text-[10px] opacity-60">
                {statusCounts[s]}
              </span>
            </button>
          )
        )}
      </div>

      {/* Tickets list */}
      {loading ? (
        <div className="text-center py-12 font-sans text-sm text-on-surface-variant">
          {t("Chargement...", "Loading...")}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-low border border-on-surface/5">
          <MessageSquare className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
          <p className="font-sans text-sm text-on-surface-variant">
            {tickets.length === 0
              ? t(
                  "Aucun ticket. Créez-en un pour commencer.",
                  "No tickets yet. Create one to get started."
                )
              : t(
                  "Aucun ticket ne correspond au filtre.",
                  "No tickets match the current filter."
                )}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedId === ticket.id;
            return (
              <div
                key={ticket.id}
                className="bg-surface-container-low border border-on-surface/5"
              >
                {/* Ticket header row */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : ticket.id)
                  }
                  className="w-full flex items-center gap-4 p-4 text-left cursor-pointer bg-transparent border-0 hover:bg-surface-container-low/80 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown
                      size={16}
                      className="text-on-surface-variant shrink-0"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-on-surface-variant shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans text-sm font-medium text-ebony-deep truncate">
                        {ticket.subject}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-sans font-medium border ${
                          STATUS_COLORS[ticket.status] || STATUS_COLORS.Open
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-sans font-medium ${
                          PRIORITY_COLORS[ticket.priority] ||
                          PRIORITY_COLORS.Medium
                        }`}
                      >
                        {ticket.priority}
                      </span>
                      {ticket.category && (
                        <span className="px-2 py-0.5 text-[10px] font-sans font-medium bg-parchment-ivory text-on-surface-variant border border-on-surface/10">
                          {ticket.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] font-sans text-on-surface-variant">
                        {ticket.createdDate}
                      </span>
                      {ticket.responses.length > 0 && (
                        <span className="text-[11px] font-sans text-on-surface-variant flex items-center gap-1">
                          <MessageSquare size={10} />
                          {ticket.responses.length}
                        </span>
                      )}
                      {isSupportOrAdmin && ticket.clientName && (
                        <span className="text-[11px] font-sans text-on-surface-variant">
                          {ticket.clientName}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-on-surface/5 pt-4">
                    {/* Ticket details */}
                    <div className="mb-4">
                      <p className="font-sans text-sm text-ebony-deep whitespace-pre-wrap">
                        {ticket.description}
                      </p>
                    </div>

                    {/* Status management (support/admin only) */}
                    {isSupportOrAdmin && (
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-on-surface/5">
                        <span className="font-sans text-xs text-on-surface-variant font-medium">
                          {t("Statut:", "Status:")}
                        </span>
                        {["Open", "In Progress", "Resolved", "Closed"].map(
                          (s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(ticket.id, s)}
                              className={`px-2 py-1 text-[10px] font-sans font-medium cursor-pointer border transition-colors ${
                                ticket.status === s
                                  ? "bg-ebony-deep text-parchment-ivory border-ebony-deep"
                                  : "bg-transparent text-on-surface-variant border-on-surface/10 hover:border-ebony-deep/30"
                              }`}
                            >
                              {s}
                            </button>
                          )
                        )}
                      </div>
                    )}

                    {/* Responses thread */}
                    {ticket.responses.length > 0 && (
                      <div className="space-y-3 mb-4">
                        <h4 className="font-sans text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                          {t("Réponses", "Responses")}
                        </h4>
                        {ticket.responses.map((r, i) => (
                          <div
                            key={i}
                            className="bg-parchment-ivory border border-on-surface/5 p-3"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-sans text-xs font-medium text-ebony-deep">
                                {r.author}
                              </span>
                              <span className="font-sans text-[10px] text-on-surface-variant">
                                {r.timestamp}
                              </span>
                            </div>
                            <p className="font-sans text-sm text-ebony-deep whitespace-pre-wrap">
                              {r.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply form */}
                    {ticket.status !== "Closed" && (
                      <div className="flex items-start gap-3">
                        <textarea
                          value={replyingTo === ticket.id ? replyText : ""}
                          onChange={(e) => {
                            setReplyingTo(ticket.id);
                            setReplyText(e.target.value);
                          }}
                          onFocus={() => setReplyingTo(ticket.id)}
                          rows={2}
                          placeholder={t(
                            "Écrire une réponse...",
                            "Write a reply..."
                          )}
                          className="flex-1 px-3 py-2 bg-parchment-ivory border border-on-surface/10 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-terracotta-earth/30 resize-none"
                        />
                        <button
                          onClick={() => handleReply(ticket.id)}
                          disabled={
                            replyingTo !== ticket.id || !replyText.trim()
                          }
                          className="px-3 py-2 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-opacity cursor-pointer border-0 disabled:opacity-50 shrink-0"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    )}

                    {ticket.status === "Closed" && (
                      <p className="font-sans text-xs text-on-surface-variant italic">
                        {t(
                          "Ce ticket est fermé. Créez un nouveau ticket si nécessaire.",
                          "This ticket is closed. Create a new ticket if needed."
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
