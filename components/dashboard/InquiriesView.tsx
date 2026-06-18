"use client";

import { useState, useEffect } from "react";
import { Inquiry } from "@/lib/dashboardTypes";
import { porApi, dashboardApi } from "@/lib/api";
import {
  Send,
  MessageSquare,
  ShieldAlert,
  Clock,
  Sparkles,
  UserCheck2,
  Filter,
  Lock,
  Palette,
  TrendingUp,
  HelpCircle,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useTranslate } from "@/lib/translations";
import { useSSE } from "@/lib/useChatSSE";

interface PORDemand {
  id: string;
  artworkId: number;
  message?: string;
  status: string;
  response?: string;
  artwork?: { id: number; title: string; images?: Array<{ url: string }> };
  messages: Array<{ id: number; sender: string; senderId?: number; text: string; timestamp: string }>;
  createdAt: string;
}

interface InquiriesViewProps {
  inquiries: Inquiry[];
  onAddMessage: (inquiryId: string, text: string) => void;
  selectedInquiryId: string | null;
  setSelectedInquiryId: (id: string | null) => void;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof Palette; color: string; bg: string }> = {
  General: { label: "General", icon: HelpCircle, color: "text-ebony-deep", bg: "bg-surface-container-low" },
  Acquisition: { label: "Acquisition", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  Investment: { label: "Investment", icon: TrendingUp, color: "text-gold-leaf", bg: "bg-amber-50" },
  Provenance: { label: "Provenance", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  POR: { label: "Price on Request", icon: Lock, color: "text-purple-600", bg: "bg-purple-50" },
  Artwork: { label: "Artwork Interest", icon: Palette, color: "text-terracotta-earth", bg: "bg-orange-50" },
};

const POR_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200/30",
  IN_DISCUSSION: "bg-blue-50 text-blue-800 border-blue-200/30",
  CLOSED: "bg-gray-50 text-gray-600 border-gray-200/30",
  RESPONDED: "bg-emerald-50 text-emerald-800 border-emerald-200/30",
};

function porStatusLabel(status: string, lang: string) {
  switch (status) {
    case "PENDING": return lang === "fr" ? "En attente" : "Pending";
    case "IN_DISCUSSION": return lang === "fr" ? "En discussion" : "In Discussion";
    case "CLOSED": return lang === "fr" ? "Clôturé" : "Closed";
    case "RESPONDED": return lang === "fr" ? "Répondu" : "Responded";
    default: return status;
  }
}

export default function InquiriesView({
  inquiries,
  onAddMessage,
  selectedInquiryId,
  setSelectedInquiryId,
}: InquiriesViewProps) {
  const { lang } = useTranslate();
  const [activeId, setActiveId] = useState<string>(selectedInquiryId || inquiries[0]?.id || "");
  const [typedMessage, setTypedMessage] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"inquiries" | "por">("inquiries");
  const [porDemands, setPorDemands] = useState<PORDemand[]>([]);
  const [loadingPOR, setLoadingPOR] = useState(true);
  const [selectedPorId, setSelectedPorId] = useState<string | null>(null);
  const [porMessage, setPorMessage] = useState("");
  const [sendingPorMessage, setSendingPorMessage] = useState(false);

  useEffect(() => {
    setLoadingPOR(true);
    porApi.getMy().then((res) => {
      setPorDemands(res.data || []);
    }).catch(() => {}).finally(() => setLoadingPOR(false));
  }, []);

  useSSE("/api/v1/events", {
    "por-update": () => {
      porApi.getMy().then((res) => setPorDemands(res.data || [])).catch(() => {});
    },
    "por-message": (data: unknown) => {
      const { porId, message } = data as { porId: number; message: { id: number; sender: string; senderId: number; text: string; timestamp: string } };
      setPorDemands(prev => prev.map(p => {
        const numId = parseInt(p.id.replace("por-", ""), 10);
        if (numId !== porId) return p;
        const alreadyExists = p.messages.some(m => m.id === message.id);
        if (alreadyExists) return p;
        return { ...p, messages: [...p.messages, message] };
      }));
    },
  });

  const activeInquiry = inquiries.find(i => i.id === activeId);
  const selectedPor = porDemands.find(p => p.id === selectedPorId);

  const categories = ["All", ...Array.from(new Set(inquiries.map(i => i.category || "General")))];
  const filteredInquiries = categoryFilter === "All" ? inquiries : inquiries.filter(i => (i.category || "General") === categoryFilter);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeId) return;
    onAddMessage(activeId, typedMessage.trim());
    setTypedMessage("");
  };

  const handleSendPorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!porMessage.trim() || !selectedPor) return;
    setSendingPorMessage(true);
    try {
      const numId = parseInt(selectedPor.id.replace("por-", ""), 10);
      const res = await porApi.addMessage(numId, porMessage.trim());
      setPorDemands(prev => prev.map(p => {
        if (p.id !== selectedPor.id) return p;
        return { ...p, messages: [...p.messages, res.data] };
      }));
      setPorMessage("");
    } catch (err) {
      console.error("Failed to send POR message:", err);
    } finally {
      setSendingPorMessage(false);
    }
  };

  const selectInquiry = (id: string) => {
    setActiveId(id);
    setSelectedInquiryId(id);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-6 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">
          {lang === "fr" ? "Mes Demandes" : "My Inquiries"}
        </h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">
          {lang === "fr" ? "Gérez toutes vos demandes, consultations et demandes de prix en un seul endroit." : "Manage all your inquiries, consultations, and price requests in one place."}
        </p>
      </header>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 bg-surface-container-low p-1 w-fit">
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-widest transition-all cursor-pointer border-0 ${
            activeTab === "inquiries" ? "bg-ebony-deep text-parchment-ivory" : "bg-transparent text-on-surface-variant hover:text-ebony-deep"
          }`}
        >
          <FileText className="w-3 h-3 inline mr-1.5" />
          {lang === "fr" ? "Demandes" : "Inquiries"} ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("por")}
          className={`px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-widest transition-all cursor-pointer border-0 ${
            activeTab === "por" ? "bg-ebony-deep text-parchment-ivory" : "bg-transparent text-on-surface-variant hover:text-ebony-deep"
          }`}
        >
          <Lock className="w-3 h-3 inline mr-1.5" />
          {lang === "fr" ? "POR" : "POR Demands"} ({porDemands.length})
        </button>
      </div>

      {/* Inquiries Tab */}
      {activeTab === "inquiries" && (
        <>
          {/* Category filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-4">
            <Filter size={14} className="text-on-surface-variant mr-1 shrink-0" />
            {categories.map((cat) => {
              const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.General;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-[10px] font-sans font-medium uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border-0 ${
                    categoryFilter === cat
                      ? "bg-ebony-deep text-parchment-ivory"
                      : "bg-transparent text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {cat === "All" ? (lang === "fr" ? "Toutes" : "All") : cat}
                </button>
              );
            })}
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-16 text-center select-none">
              <MessageSquare className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
              <p className="font-serif text-lg text-ebony-deep">{lang === "fr" ? "Aucune Demande Active" : "No Active Inquiries"}</p>
              <p className="font-sans text-xs text-zinc-400 max-w-sm mx-auto mt-2">
                {lang === "fr" ? "Initiez une demande depuis le catalogue ou la page d'investissement." : "Start an inquiry from the catalogue or investment page."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch lg:h-[calc(100vh-340px)] min-h-[400px]">
              <div className="lg:col-span-4 bg-parchment-ivory w-full border border-ebony-deep/5 flex flex-col overflow-y-auto">
                <div className="p-4 bg-ebony-deep text-gold-leaf font-sans text-[10px] uppercase font-bold tracking-widest border-b border-gold-leaf/25">
                  {lang === "fr" ? "Demandes Actives" : "Active Inquiries"} ({filteredInquiries.length})
                </div>
                <div className="divide-y divide-ebony-deep/5 select-none">
                  {filteredInquiries.map((inq) => {
                    const isActive = inq.id === activeId;
                    const lastMsg = inq.messages[inq.messages.length - 1];
                    const catConfig = CATEGORY_CONFIG[inq.category || "General"] || CATEGORY_CONFIG.General;
                    const CatIcon = catConfig.icon;
                    return (
                      <button key={inq.id} onClick={() => selectInquiry(inq.id)} className={`w-full text-left p-4 transition-colors flex gap-3 cursor-pointer relative ${isActive ? "bg-surface-container-low" : "hover:bg-surface-container-low/40"}`}>
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-terracotta-earth" />}
                        <div className={`w-10 h-10 ${catConfig.bg} shrink-0 flex items-center justify-center`}>
                          <CatIcon className={`w-4 h-4 ${catConfig.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="font-serif text-sm font-semibold text-ebony-deep truncate leading-none">{inq.artworkTitle}</h4>
                            <span className="text-[9px] font-sans font-medium text-zinc-400 shrink-0">{inq.date.split(",")[0]}</span>
                          </div>
                          <p className="font-sans text-[11px] text-zinc-500 line-clamp-1 mb-1.5">{lastMsg ? lastMsg.text : (lang === "fr" ? "Pas encore de messages..." : "No messages yet...")}</p>
                          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold">
                            <span className={`px-2 py-0.5 border ${inq.status === "Offer Presented" ? "bg-amber-100 text-amber-800 border-amber-300/40" : "bg-emerald-50 text-emerald-800 border-emerald-350/30"}`}>{inq.status}</span>
                            <span className="text-zinc-400 text-[8px]">{catConfig.label}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-8 bg-parchment-ivory border border-ebony-deep/5 flex flex-col justify-between overflow-hidden">
                {activeInquiry ? (
                  <>
                    <div className="p-6 border-b border-ebony-deep/5 flex items-center justify-between bg-surface-container-low">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-gold-leaf/20 select-none">
                          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150" alt="Helena Sterling" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-semibold text-ebony-deep flex items-center gap-1.5 leading-none mb-1">
                            Helena Sterling <UserCheck2 className="w-4 h-4 text-emerald-600" />
                          </h4>
                          <p className="font-sans text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{lang === "fr" ? "Conseil Socioculturel" : "Socio-Cultural Advisory"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-0.5"><Clock className="w-3.5 h-3.5 text-zinc-400" /><span>{lang === "fr" ? "Canal Privé" : "Private Channel"}</span></div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{activeInquiry.id}</span>
                      </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest/40 flex flex-col gap-4">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-amber-50/50 border border-gold-leaf/30 text-center px-4 py-2.5 max-w-md shadow-sm">
                          <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-gold-leaf mb-0.5 flex items-center justify-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> {lang === "fr" ? "Canal Crypté Actif" : "Encrypted Channel Active"}</p>
                        </div>
                      </div>
                      {activeInquiry.messages.map((msg, idx) => {
                        const isCollector = msg.sender === "collector";
                        return (
                          <div key={idx} className={`flex flex-col max-w-[80%] ${isCollector ? "self-end items-end" : "self-start items-start"}`}>
                            <p className="font-sans text-[9px] uppercase tracking-wider font-bold text-zinc-400 mb-1">{isCollector ? (lang === "fr" ? "Vous" : "You") : (lang === "fr" ? "Helena Sterling" : "Helena Sterling")}</p>
                            <div className={`p-4 font-sans text-xs leading-relaxed ${isCollector ? "bg-ebony-deep text-parchment-ivory" : "bg-parchment-ivory border border-ebony-deep/10 text-ebony-deep"}`}>{msg.text}</div>
                            <span className="font-mono text-[9px] text-zinc-400 mt-1">{msg.timestamp}</span>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-ebony-deep/5 bg-white flex items-stretch gap-3">
                      <input type="text" required value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} placeholder={lang === "fr" ? "Écrire un message..." : "Type a message..."} className="flex-1 bg-parchment-ivory border border-ebony-deep/10 focus:border-gold-leaf px-4 py-3 text-xs font-sans tracking-wide text-ebony-deep focus:outline-none" />
                      <button type="submit" className="bg-ebony-deep text-parchment-ivory hover:opacity-90 active:scale-95 px-6 py-3 transition-all cursor-pointer flex items-center justify-center shrink-0 border-0"><Send className="w-4.5 h-4.5" /></button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                    <ShieldAlert className="w-10 h-10 text-gold-leaf mb-3 animate-pulse" />
                    <p className="font-serif italic text-sm mb-1">{lang === "fr" ? "Canal Non Sélectionné" : "Channel Unselected"}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* POR Tab */}
      {activeTab === "por" && (
        <>
          {loadingPOR ? (
            <div className="text-center py-12">
              <Loader2 className="w-6 h-6 text-ebony-deep/30 mx-auto animate-spin" />
            </div>
          ) : porDemands.length === 0 ? (
            <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-16 text-center select-none">
              <Lock className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
              <p className="font-serif text-lg text-ebony-deep">{lang === "fr" ? "Aucune Demande POR" : "No POR Demands"}</p>
              <p className="font-sans text-xs text-zinc-400 max-w-sm mx-auto mt-2">
                {lang === "fr" ? "Soumettez une demande de prix depuis la page POR." : "Submit a price request from the POR page."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch lg:h-[calc(100vh-340px)] min-h-[400px]">
              {/* POR List */}
              <div className="lg:col-span-4 bg-parchment-ivory w-full border border-ebony-deep/5 flex flex-col overflow-y-auto">
                <div className="p-4 bg-ebony-deep text-gold-leaf font-sans text-[10px] uppercase font-bold tracking-widest border-b border-gold-leaf/25 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  {lang === "fr" ? "Demandes POR" : "POR Demands"} ({porDemands.length})
                </div>
                <div className="divide-y divide-ebony-deep/5 select-none">
                  {porDemands.map((por) => {
                    const isActive = por.id === selectedPorId;
                    const lastMsg = por.messages[por.messages.length - 1];
                    return (
                      <button key={por.id} onClick={() => setSelectedPorId(isActive ? null : por.id)} className={`w-full text-left p-4 transition-colors flex gap-3 cursor-pointer relative ${isActive ? "bg-surface-container-low" : "hover:bg-surface-container-low/40"}`}>
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-600" />}
                        <div className="w-10 h-10 bg-purple-50 shrink-0 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="font-serif text-sm font-semibold text-ebony-deep truncate leading-none">{por.artwork?.title || `Artwork #${por.artworkId}`}</h4>
                            <span className="text-[9px] font-sans font-medium text-zinc-400 shrink-0">{new Date(por.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="font-sans text-[11px] text-zinc-500 line-clamp-1 mb-1.5">{lastMsg ? lastMsg.text : (por.message ? por.message.substring(0, 60) + "..." : "...")}</p>
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider border ${POR_STATUS_COLORS[por.status] || POR_STATUS_COLORS.PENDING}`}>{porStatusLabel(por.status, lang)}</span>
                            {por.messages.length > 0 && (
                              <span className="text-[9px] text-zinc-400 flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" /> {por.messages.length}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* POR Detail */}
              <div className="lg:col-span-8 bg-parchment-ivory border border-ebony-deep/5 flex flex-col justify-between overflow-hidden">
                {selectedPor ? (
                  <>
                    <div className="p-6 border-b border-ebony-deep/5 bg-surface-container-low">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif text-base font-semibold text-ebony-deep">{selectedPor.artwork?.title || `Artwork #${selectedPor.artworkId}`}</h4>
                          <p className="font-sans text-[10px] text-zinc-400 mt-0.5">{selectedPor.id} · {lang === "fr" ? "Créé" : "Created"}: {new Date(selectedPor.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider border ${POR_STATUS_COLORS[selectedPor.status] || POR_STATUS_COLORS.PENDING}`}>{porStatusLabel(selectedPor.status, lang)}</span>
                      </div>
                      {selectedPor.response && (
                        <div className="mt-3 p-3 bg-emerald-50/50 border border-emerald-200/30">
                          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-600 mb-1">{lang === "fr" ? "Réponse de l'Admin" : "Admin Response"}</p>
                          <p className="font-sans text-xs text-emerald-700">{selectedPor.response}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest/40 flex flex-col gap-4">
                      {selectedPor.message && (
                        <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-2">
                          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1">{lang === "fr" ? "Message Initial" : "Initial Message"}</p>
                          <p className="font-sans text-xs text-ebony-deep/60 leading-relaxed whitespace-pre-wrap">{selectedPor.message}</p>
                        </div>
                      )}
                      {selectedPor.messages.map((msg, idx) => {
                        const isAdmin = msg.sender === "admin";
                        return (
                          <div key={idx} className={`flex flex-col max-w-[80%] ${!isAdmin ? "self-end items-end" : "self-start items-start"}`}>
                            <p className="font-sans text-[9px] uppercase tracking-wider font-bold text-zinc-400 mb-1">{!isAdmin ? (lang === "fr" ? "Vous" : "You") : "Admin"}</p>
                            <div className={`p-4 font-sans text-xs leading-relaxed ${!isAdmin ? "bg-ebony-deep text-parchment-ivory" : "bg-parchment-ivory border border-ebony-deep/10 text-ebony-deep"}`}>{msg.text}</div>
                            <span className="font-mono text-[9px] text-zinc-400 mt-1">{msg.timestamp}</span>
                          </div>
                        );
                      })}
                    </div>

                    {selectedPor.status === "CLOSED" ? (
                      <div className="p-4 border-t border-ebony-deep/5 bg-white text-center">
                        <Lock className="w-5 h-5 text-on-surface-variant mx-auto mb-2" />
                        <p className="font-sans text-xs text-on-surface-variant">
                          {lang === "fr"
                            ? "Cette demande est clôturée. Aucun message ne peut être envoyé."
                            : "This request is closed. No messages can be sent."}
                        </p>
                      </div>
                    ) : (
                    <form onSubmit={handleSendPorMessage} className="p-4 border-t border-ebony-deep/5 bg-white flex items-stretch gap-3">
                      <input type="text" required value={porMessage} onChange={(e) => setPorMessage(e.target.value)} placeholder={lang === "fr" ? "Écrire un message..." : "Type a message..."} className="flex-1 bg-parchment-ivory border border-ebony-deep/10 focus:border-gold-leaf px-4 py-3 text-xs font-sans tracking-wide text-ebony-deep focus:outline-none" />
                      <button type="submit" disabled={sendingPorMessage} className="bg-ebony-deep text-parchment-ivory hover:opacity-90 active:scale-95 px-6 py-3 transition-all cursor-pointer flex items-center justify-center shrink-0 border-0 disabled:opacity-50">
                        {sendingPorMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
                      </button>
                    </form>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                    <Lock className="w-10 h-10 text-gold-leaf mb-3 animate-pulse" />
                    <p className="font-serif italic text-sm mb-1">{lang === "fr" ? "Sélectionnez une demande POR" : "Select a POR demand"}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
