"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { ChatThread } from "@/lib/chatTypes";
import { chatApi } from "@/lib/api";
import { Send, MessageSquare, User, Clock, Search, Archive, Eye } from "lucide-react";

interface AdvisorChatViewProps {
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onMarkRead: (threadId: string) => void;
}

export default function AdvisorChatView({ threads, onSendMessage, onMarkRead }: AdvisorChatViewProps) {
  const { lang } = useTranslate();
  const [selectedId, setSelectedId] = useState<string | null>(threads[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "active" | "archived">("All");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filtered = threads.filter(t => {
    if (filter !== "All" && t.status !== filter) return false;
    if (search && !t.clientName.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = threads.find(t => t.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  const lastMarkedRef = useRef<string | null>(null);
  const onMarkReadRef = useRef(onMarkRead);
  onMarkReadRef.current = onMarkRead;

  useEffect(() => {
    if (selectedId && selectedId !== lastMarkedRef.current) {
      lastMarkedRef.current = selectedId;
      chatApi.markThreadRead(selectedId).then(() => onMarkReadRef.current(selectedId)).catch(() => {});
    }
  }, [selectedId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedId) return;
    onSendMessage(selectedId, newMessage.trim());
    setNewMessage("");
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Gestion des Messages" : "Message Management"}</h2>
            <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Gérez les conversations avec vos clients assignés." : "Manage conversations with your assigned clients."}</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input type="text" placeholder={lang === "fr" ? "Rechercher..." : "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf transition-colors" />
        </div>
        <div className="flex gap-1 bg-surface-container-low border border-outline-variant/50 p-0.5">
          {(["All", "active", "archived"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer border-0 ${filter === f ? "bg-ebony-deep text-parchment-ivory" : "text-on-surface-variant hover:text-ebony-deep bg-transparent"}`}>
              {f === "All" ? (lang === "fr" ? "Tous" : "All") : f === "active" ? (lang === "fr" ? "Actif" : "Active") : (lang === "fr" ? "Archivé" : "Archived")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[calc(100vh-310px)] min-h-[400px]">
        {/* Thread list */}
        <div className="lg:col-span-4 bg-parchment-ivory border border-ebony-deep/5 flex flex-col overflow-y-auto">
          <div className="p-4 bg-ebony-deep text-gold-leaf font-sans text-[10px] uppercase font-bold tracking-widest border-b border-gold-leaf/25">
            {lang === "fr" ? "Conversations" : "Conversations"} ({filtered.length})
          </div>
          <div className="divide-y divide-ebony-deep/5 select-none">
            {filtered.map((thread) => {
              const isActive = thread.id === selectedId;
              return (
                <button key={thread.id} onClick={() => setSelectedId(thread.id)} className={`w-full text-left p-5 transition-colors flex gap-4 cursor-pointer relative ${isActive ? "bg-surface-container-low" : "hover:bg-surface-container-low/40"}`}>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-terracotta-earth" />}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-ebony-deep/10" style={{ backgroundColor: thread.clientRole === "collector" ? "#C5A059" : "#6B8E23" }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-serif text-sm font-semibold text-ebony-deep truncate">{thread.clientName}</h4>
                      {thread.unreadCount > 0 && <span className="w-5 h-5 bg-terracotta-earth text-parchment-ivory text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">{thread.unreadCount}</span>}
                    </div>
                    <p className="font-sans text-[10px] text-on-surface-variant truncate mb-1">{thread.subject}</p>
                    <p className="font-sans text-[11px] text-zinc-500 line-clamp-1">{thread.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${thread.status === "active" ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-500"}`}>{thread.status}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${thread.clientRole === "collector" ? "bg-gold-leaf/10 text-gold-leaf" : "bg-surface-container-high text-on-surface-variant"}`}>{thread.clientRole}</span>
                      <span className="font-mono text-[9px] text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {thread.lastMessageTime.split(" ").slice(1).join(" ")}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-8 bg-parchment-ivory border border-ebony-deep/5 flex flex-col justify-between overflow-hidden">
          {selected ? (
            <>
              <div className="p-4 border-b border-ebony-deep/5 flex items-center justify-between bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center border border-ebony-deep/10" style={{ backgroundColor: selected.clientRole === "collector" ? "#C5A059" : "#6B8E23" }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-ebony-deep">{selected.clientName}</h4>
                    <p className="font-sans text-[10px] text-on-surface-variant">{selected.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 ${selected.status === "active" ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-500"}`}>{selected.status === "active" ? (lang === "fr" ? "Actif" : "Active") : (lang === "fr" ? "Archivé" : "Archived")}</span>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest/40 flex flex-col gap-4">
                {selected.messages.map((msg) => {
                  const isClient = msg.senderRole === "collector" || msg.senderRole === "visitor";
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${isClient ? "self-start items-start" : "self-end items-end"}`}>
                      <p className="font-sans text-[9px] uppercase tracking-wider font-bold text-zinc-400 mb-1">{msg.senderName} <span className="text-zinc-300">• {msg.senderRole}</span></p>
                      <div className={`p-4 font-sans text-xs leading-relaxed ${isClient ? "bg-parchment-ivory border border-ebony-deep/10 text-ebony-deep" : "bg-ebony-deep text-parchment-ivory"}`}>{msg.text}</div>
                      <span className="font-mono text-[9px] text-zinc-400 mt-1">{msg.timestamp}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-ebony-deep/5 bg-white flex items-stretch gap-3">
                <input type="text" required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={lang === "fr" ? "Tapez votre réponse..." : "Type your reply..."} className="flex-1 bg-parchment-ivory border border-ebony-deep/10 focus:border-gold-leaf px-4 py-3 text-xs font-sans tracking-wide text-ebony-deep focus:outline-none" />
                <button type="submit" className="bg-ebony-deep text-parchment-ivory hover:opacity-90 active:scale-95 px-6 py-3 transition-all cursor-pointer flex items-center justify-center shrink-0 border-0"><Send className="w-4 h-4" /></button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <MessageSquare className="w-10 h-10 text-gold-leaf mb-3 animate-pulse" />
              <p className="font-serif italic text-sm mb-1">{lang === "fr" ? "Sélectionnez une conversation" : "Select a conversation"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
