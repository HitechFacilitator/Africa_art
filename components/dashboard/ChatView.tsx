"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { ChatThread, ChatMessage } from "@/lib/chatTypes";
import { chatApi } from "@/lib/api";
import { Send, MessageSquare, User, Clock, ArrowLeft } from "lucide-react";

interface ChatViewProps {
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onMarkRead: (threadId: string) => void;
}

export default function ChatView({ threads, onSendMessage, onMarkRead }: ChatViewProps) {
  const { lang } = useTranslate();
  const [selectedId, setSelectedId] = useState<string | null>(threads[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <div className="animate-fade-in">
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Messages" : "Messages"}</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Communiquez directement avec votre conseiller assigné." : "Communicate directly with your assigned advisor."}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[calc(100vh-270px)] min-h-[400px]">
        {/* Thread list */}
        <div className="lg:col-span-4 bg-parchment-ivory border border-ebony-deep/5 flex flex-col overflow-y-auto">
          <div className="p-4 bg-ebony-deep text-gold-leaf font-sans text-[10px] uppercase font-bold tracking-widest border-b border-gold-leaf/25">
            {lang === "fr" ? "Conversations Actives" : "Active Conversations"} ({threads.length})
          </div>
          <div className="divide-y divide-ebony-deep/5 select-none">
            {threads.map((thread) => {
              const isActive = thread.id === selectedId;
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedId(thread.id)}
                  className={`w-full text-left p-5 transition-colors flex gap-4 cursor-pointer relative ${isActive ? "bg-surface-container-low" : "hover:bg-surface-container-low/40"}`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-terracotta-earth" />}
                  <div className="w-10 h-10 rounded-full bg-terracotta-earth/10 flex items-center justify-center shrink-0 border border-terracotta-earth/20">
                    <User className="w-4 h-4 text-terracotta-earth" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-serif text-sm font-semibold text-ebony-deep truncate">{thread.advisorName}</h4>
                      {thread.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-terracotta-earth text-parchment-ivory text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">{thread.unreadCount}</span>
                      )}
                    </div>
                    <p className="font-sans text-[10px] text-on-surface-variant truncate mb-1">{thread.subject}</p>
                    <p className="font-sans text-[11px] text-zinc-500 line-clamp-1">{thread.lastMessage}</p>
                    <p className="font-mono text-[9px] text-zinc-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {thread.lastMessageTime}</p>
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
              {/* Chat header */}
              <div className="p-4 border-b border-ebony-deep/5 flex items-center justify-between bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-terracotta-earth/10 flex items-center justify-center border border-terracotta-earth/20">
                    <User className="w-4 h-4 text-terracotta-earth" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-ebony-deep">{selected.advisorName}</h4>
                    <p className="font-sans text-[10px] text-on-surface-variant">{selected.subject}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 ${selected.status === "active" ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-500"}`}>{selected.status === "active" ? (lang === "fr" ? "Actif" : "Active") : (lang === "fr" ? "Archivé" : "Archived")}</span>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest/40 flex flex-col gap-4">
                {selected.messages.map((msg) => {
                  const isCollector = msg.senderRole === "collector" || msg.senderRole === "visitor";
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${isCollector ? "self-end items-end" : "self-start items-start"}`}>
                      <p className="font-sans text-[9px] uppercase tracking-wider font-bold text-zinc-400 mb-1">{msg.senderName}</p>
                      <div className={`p-4 font-sans text-xs leading-relaxed ${isCollector ? "bg-ebony-deep text-parchment-ivory" : "bg-parchment-ivory border border-ebony-deep/10 text-ebony-deep"}`}>{msg.text}</div>
                      <span className="font-mono text-[9px] text-zinc-400 mt-1">{msg.timestamp}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={handleSend} className="p-4 border-t border-ebony-deep/5 bg-white flex items-stretch gap-3">
                <input
                  type="text"
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={lang === "fr" ? "Tapez votre message..." : "Type your message..."}
                  className="flex-1 bg-parchment-ivory border border-ebony-deep/10 focus:border-gold-leaf px-4 py-3 text-xs font-sans tracking-wide text-ebony-deep focus:outline-none"
                />
                <button type="submit" className="bg-ebony-deep text-parchment-ivory hover:opacity-90 active:scale-95 px-6 py-3 transition-all cursor-pointer flex items-center justify-center shrink-0 border-0">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <MessageSquare className="w-10 h-10 text-gold-leaf mb-3 animate-pulse" />
              <p className="font-serif italic text-sm mb-1">{lang === "fr" ? "Aucune conversation sélectionnée" : "No conversation selected"}</p>
              <p className="font-sans text-xs">{lang === "fr" ? "Sélectionnez une conversation pour voir les messages" : "Select a conversation to view messages"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
