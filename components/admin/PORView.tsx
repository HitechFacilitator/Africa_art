"use client";

import { useState, useEffect } from "react";
import { porApi } from "@/lib/api";
import { AdminPORRequest } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import { Lock, CheckCircle, XCircle, Clock, Send, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export default function PORView() {
  const { lang } = useTranslate();
  const [requests, setRequests] = useState<AdminPORRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    porApi.getAll().then((res) => {
      setRequests((res.data || []).map((r: any) => ({ ...r, status: r.status as AdminPORRequest["status"] })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRespond = async (id: number) => {
    if (!responseText.trim()) return;
    try {
      await porApi.respond(id, responseText);
      setRequests((prev) => prev.map((r) => r.id === String(id) ? { ...r, status: "RESPONDED", response: responseText } : r));
      setRespondingId(null);
      setResponseText("");
    } catch {}
  };

  const handleClose = async (id: number) => {
    try {
      await porApi.close(id);
      setRequests((prev) => prev.map((r) => r.id === String(id) ? { ...r, status: "CLOSED" } : r));
    } catch {}
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-800 border-amber-200";
      case "RESPONDED": return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "CLOSED": return "bg-zinc-100 text-zinc-500 border-zinc-200";
      default: return "bg-zinc-100 text-zinc-500 border-zinc-200";
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-on-surface-variant">{lang === "fr" ? "Chargement..." : "Loading..."}</div>;
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep">{lang === "fr" ? "Demandes Prix sur Demande" : "Price on Request Demands"}</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Gérez les demandes confidentielles de tarification des collectionneurs." : "Manage confidential collector pricing inquiries."}</p>
      </header>

      {requests.length === 0 ? (
        <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-12 text-center">
          <Lock className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
          <p className="font-serif text-lg text-ebony-deep">{lang === "fr" ? "Aucune Demande POR" : "No POR Requests"}</p>
          <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Les demandes de prix sur demande des apparaîtront ici." : "Price-on-request inquiries will appear here."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-parchment-ivory border border-ebony-deep/5 p-6 shadow-level-1">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${statusColor(req.status)}`}>{req.status}</span>
                    <span className="text-[10px] text-on-surface-variant">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-ebony-deep">{req.artwork?.title || `Artwork #${req.artworkId}`}</h4>
                  {req.user && (
                    <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "De" : "From"}: {req.user.name} ({req.user.email})</p>
                  )}
                  {req.message && (
                    <div className="mt-3 p-3 bg-surface-container-low border-l-2 border-gold-leaf">
                      <p className="font-sans text-[10px] uppercase font-bold text-on-surface-variant mb-1">{lang === "fr" ? "Message" : "Message"}</p>
                      <p className="font-sans text-xs text-ebony-deep whitespace-pre-wrap">{req.message}</p>
                    </div>
                  )}
                  {req.response && (
                    <div className="mt-3 p-3 bg-emerald-50 border-l-2 border-emerald-500">
                      <p className="font-sans text-[10px] uppercase font-bold text-emerald-700 mb-1">{lang === "fr" ? "Réponse" : "Response"}</p>
                      <p className="font-sans text-xs text-emerald-800">{req.response}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === "PENDING" && (
                    <>
                      <button onClick={() => setRespondingId(Number(req.id))} className="bg-ebony-deep text-parchment-ivory px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer border-0">
                        <Send className="w-3 h-3" /> {lang === "fr" ? "Répondre" : "Respond"}
                      </button>
                      <button onClick={() => handleClose(Number(req.id))} className="border border-ebony-deep/20 text-on-surface-variant px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent">
                        <XCircle className="w-3 h-3" /> {lang === "fr" ? "Fermer" : "Close"}
                      </button>
                    </>
                  )}
                  {req.status === "RESPONDED" && (
                    <button onClick={() => handleClose(Number(req.id))} className="border border-ebony-deep/20 text-on-surface-variant px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent">
                      <XCircle className="w-3 h-3" /> {lang === "fr" ? "Clôturer" : "Close"}
                    </button>
                  )}
                </div>
              </div>

              {respondingId === Number(req.id) && (
                <div className="mt-4 pt-4 border-t border-ebony-deep/5">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={3}
                    placeholder={lang === "fr" ? "Entrez votre réponse confidentielle..." : "Enter your confidential response..."}
                    className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(Number(req.id))} className="bg-gold-leaf text-ebony-deep px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer border-0">
                      {lang === "fr" ? "Envoyer la Réponse" : "Send Response"}
                    </button>
                    <button onClick={() => { setRespondingId(null); setResponseText(""); }} className="border border-ebony-deep/20 text-on-surface-variant px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors cursor-pointer bg-transparent">
                      {lang === "fr" ? "Annuler" : "Cancel"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
