"use client";

import { useState, useEffect, useRef } from "react";
import { porApi } from "@/lib/api";
import { AdminPORRequest } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import { useSSE } from "@/lib/useChatSSE";
import { Lock, CheckCircle, XCircle, Send, User, Loader2, MessageSquare, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function mapBackendStatus(status: string): AdminPORRequest["status"] {
  if (status === "IN_DISCUSSION") return "IN_DISCUSSION";
  if (status === "CLOSED") return "CLOSED";
  return "PENDING";
}

export default function PORView() {
  const { lang } = useTranslate();
  const [requests, setRequests] = useState<AdminPORRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [changingStatus, setChangingStatus] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchAll = () => {
    porApi
      .getAll()
      .then((res) => {
        setRequests(
          (res.data || []).map((r: any) => ({
            ...r,
            status: mapBackendStatus(r.status),
            messages: r.messages || [],
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  useSSE("/api/v1/events", {
    "por-update": () => { fetchAll(); },
    "por-message": (eventData: unknown) => {
      const { porId, message } = eventData as { porId: string; message?: { id: number; sender: string; text: string; timestamp: string } };
      if (message) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === String(porId)
              ? { ...r, messages: [...r.messages, message] }
              : r
          )
        );
      }
    },
  });

  const detail = requests.find((r) => r.id === detailId);

  const handleSend = async () => {
    if (!detail || !messageText.trim() || sending) return;
    setSending(true);
    try {
      const res = await porApi.addMessage(Number(detail.id), messageText.trim());
      if (res.data) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === detail.id
              ? {
                  ...r,
                  messages: [
                    ...r.messages,
                    {
                      id: res.data.id,
                      sender: res.data.sender,
                      senderId: res.data.senderId,
                      text: res.data.text,
                      timestamp: res.data.timestamp,
                    },
                  ],
                }
              : r
          )
        );
      }
      setMessageText("");
    } catch {
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setChangingStatus(id);
    try {
      await porApi.changeStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === String(id) ? { ...r, status: mapBackendStatus(newStatus) } : r
        )
      );
    } catch {} finally {
      setChangingStatus(null);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "IN_DISCUSSION":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "CLOSED":
        return "bg-zinc-100 text-zinc-500 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-500 border-zinc-200";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return lang === "fr" ? "En attente" : "Pending";
      case "IN_DISCUSSION": return lang === "fr" ? "En discussion" : "In Discussion";
      case "CLOSED": return lang === "fr" ? "Clôturé" : "Closed";
      default: return status;
    }
  };

  useEffect(() => {
    if (detail) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [detail?.messages.length]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-6 h-6 text-gold-leaf animate-spin mx-auto" />
        <p className="font-sans text-xs text-on-surface-variant mt-3">
          {lang === "fr" ? "Chargement..." : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep">
          {lang === "fr" ? "Demandes Prix sur Demande" : "Price on Request Demands"}
        </h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">
          {lang === "fr"
            ? "Gérez les demandes confidentielles de tarification des collectionneurs."
            : "Manage confidential collector pricing inquiries."}
        </p>
      </header>

      <AnimatePresence mode="wait">
        {detail ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="bg-parchment-ivory border border-ebony-deep/5 shadow-level-1"
          >
            <div className="p-6 border-b border-ebony-deep/5 flex items-center justify-between">
              <div>
                <button
                  onClick={() => setDetailId(null)}
                  className="text-[10px] font-bold uppercase tracking-widest text-gold-leaf hover:text-gold-leaf/80 transition-colors mb-2 cursor-pointer bg-transparent border-0 p-0"
                >
                  ← {lang === "fr" ? "Retour" : "Back"}
                </button>
                <h3 className="font-serif text-lg font-semibold text-ebony-deep">
                  {detail.artwork?.title || `Artwork #${detail.artworkId}`}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${statusColor(detail.status)}`}
                >
                  {statusLabel(detail.status)}
                </span>
              </div>
            </div>

            {detail.user && (
              <div className="px-6 py-3 bg-surface-container-low border-b border-ebony-deep/5">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="font-sans text-xs text-ebony-deep font-medium">
                    {detail.user.name}
                  </span>
                  <span className="font-sans text-[10px] text-on-surface-variant">
                    ({detail.user.email})
                  </span>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-b border-ebony-deep/5">
              <p className="font-sans text-[10px] uppercase font-bold text-on-surface-variant mb-3">
                {lang === "fr" ? "Changer le statut" : "Change Status"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(Number(detail.id), "PENDING")}
                  disabled={detail.status === "PENDING" || changingStatus === Number(detail.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    detail.status === "PENDING"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "border-ebony-deep/15 text-on-surface-variant hover:bg-amber-50 bg-transparent"
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  {lang === "fr" ? "En attente" : "Pending"}
                </button>
                <button
                  onClick={() => handleStatusChange(Number(detail.id), "IN_DISCUSSION")}
                  disabled={detail.status === "IN_DISCUSSION" || changingStatus === Number(detail.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    detail.status === "IN_DISCUSSION"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : "border-ebony-deep/15 text-on-surface-variant hover:bg-blue-50 bg-transparent"
                  }`}
                >
                  <MessageSquare className="w-3 h-3 inline mr-1" />
                  {lang === "fr" ? "En discussion" : "In Discussion"}
                </button>
                <button
                  onClick={() => handleStatusChange(Number(detail.id), "CLOSED")}
                  disabled={detail.status === "CLOSED" || changingStatus === Number(detail.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    detail.status === "CLOSED"
                      ? "bg-zinc-100 text-zinc-500 border-zinc-200"
                      : "border-ebony-deep/15 text-on-surface-variant hover:bg-zinc-100 bg-transparent"
                  }`}
                >
                  <XCircle className="w-3 h-3 inline mr-1" />
                  {lang === "fr" ? "Clôturer" : "Close"}
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
              {detail.messages.length === 0 && detail.message && (
                <div className="p-3 bg-surface-container-low border-l-2 border-gold-leaf">
                  <p className="font-sans text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                    {lang === "fr" ? "Message Initial" : "Initial Message"}
                  </p>
                  <p className="font-sans text-xs text-ebony-deep whitespace-pre-wrap">
                    {detail.message}
                  </p>
                </div>
              )}
              {detail.messages.map((msg) => {
                const isAdmin = msg.sender === "ADMIN" || msg.sender === "admin";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 text-xs font-sans ${
                      isAdmin
                        ? "bg-ebony-deep text-parchment-ivory ml-8"
                        : "bg-surface-container-low text-ebony-deep border border-outline-variant/30 mr-8"
                    }`}
                  >
                    <p
                      className={`text-[9px] uppercase font-bold mb-1 ${
                        isAdmin ? "text-parchment-ivory/60" : "text-on-surface-variant"
                      }`}
                    >
                      {isAdmin ? "Admin" : detail.user?.name || "User"}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p
                      className={`text-[9px] mt-1 ${
                        isAdmin ? "text-parchment-ivory/40" : "text-on-surface-variant"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {detail.status === "CLOSED" ? (
              <div className="p-6 border-t border-ebony-deep/5 text-center">
                <Lock className="w-5 h-5 text-on-surface-variant mx-auto mb-2" />
                <p className="font-sans text-xs text-on-surface-variant">
                  {lang === "fr"
                    ? "Cette demande est clôturée. Aucun message ne peut être envoyé."
                    : "This request is closed. No messages can be sent."}
                </p>
              </div>
            ) : (
              <div className="p-6 border-t border-ebony-deep/5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={
                      lang === "fr"
                        ? "Tapez votre message..."
                        : "Type your message..."
                    }
                    className="flex-1 border border-ebony-deep/15 px-3 py-2 text-xs focus:border-gold-leaf focus:outline-none"
                    disabled={sending}
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !messageText.trim()}
                    className="bg-gold-leaf text-ebony-deep px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer border-0 disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    {lang === "fr" ? "Envoyer" : "Send"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : requests.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-12 text-center"
          >
            <Lock className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
            <p className="font-serif text-lg text-ebony-deep">
              {lang === "fr" ? "Aucune Demande POR" : "No POR Requests"}
            </p>
            <p className="font-sans text-xs text-on-surface-variant mt-1">
              {lang === "fr"
                ? "Les demandes de prix sur demande des apparaîtront ici."
                : "Price-on-request inquiries will appear here."}
            </p>
          </motion.div>
        ) : (
          <motion.div key="list" className="space-y-4">
            {requests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setDetailId(req.id)}
                className="bg-parchment-ivory border border-ebony-deep/5 p-6 shadow-level-1 hover:shadow-level-2 transition-shadow cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${statusColor(req.status)}`}
                      >
                        {statusLabel(req.status)}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      {req.messages.length > 0 && (
                        <span className="text-[10px] text-on-surface-variant">
                          · {req.messages.length}{" "}
                          {lang === "fr" ? "message(s)" : "message(s)"}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-base font-semibold text-ebony-deep">
                      {req.artwork?.title || `Artwork #${req.artworkId}`}
                    </h4>
                    {req.user && (
                      <p className="font-sans text-xs text-on-surface-variant mt-1">
                        {lang === "fr" ? "De" : "From"}: {req.user.name} (
                        {req.user.email})
                      </p>
                    )}
                    {req.message && (
                      <p className="font-sans text-[11px] text-on-surface-variant mt-2 line-clamp-2">
                        {req.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
