"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { ChatThread } from "@/lib/chatTypes";
import { chatApi } from "@/lib/api";
import { Send, MessageSquare, User, Clock, ArrowLeft, Plus, Paperclip, FileText, Phone, Video, Mic, MicOff } from "lucide-react";
import ChatCallView from "../ChatCallView";

function FileAttachment({ text }: { text: string }) {
  const BACKEND = "http://localhost:5000";
  
  // Parse file message format: [TYPE:filename] URL
  const match = text.match(/^\[(IMAGE|VIDEO|AUDIO|FILE):([^\]]+)\]\s+(.*)$/);
  if (!match) return null;
  
  const [, type, filename, rawUrl] = match;
  // Backend URLs start with /api/v1/ — prepend backend origin
  const fileUrl = rawUrl.startsWith("/") ? `${BACKEND}${rawUrl}` : rawUrl;
  
  const isImage = type === "IMAGE";
  const isVideo = type === "VIDEO";
  const isAudio = type === "AUDIO";
  
  if (isImage && fileUrl) {
    return (
      <div className="mt-1">
        <img src={fileUrl} alt={filename} className="max-w-[240px] max-h-[180px] rounded-lg object-cover cursor-pointer hover:opacity-90" onClick={() => window.open(fileUrl, "_blank")} />
        <div className="text-[10px] text-parchment-ivory/50 mt-1">{filename}</div>
      </div>
    );
  }
  
  if (isVideo && fileUrl) {
    return (
      <div className="mt-1">
        <video 
          src={fileUrl} 
          controls 
          preload="metadata"
          className="max-w-[280px] max-h-[200px] rounded-lg bg-black"
          onError={(e) => {
            // Fallback to download link if video can't play
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const link = document.createElement('a');
              link.href = fileUrl;
              link.download = filename;
              link.className = 'flex items-center gap-2 bg-parchment-ivory/5 rounded-lg px-3 py-2 hover:bg-parchment-ivory/10 transition-colors';
              link.innerHTML = `<svg class="w-4 h-4 text-gold-leaf" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg><div><div class="text-xs text-parchment-ivory/80">${filename}</div><div class="text-[10px] text-parchment-ivory/40">Click to download</div></div>`;
              parent.appendChild(link);
            }
          }}
        />
        <div className="text-[10px] text-parchment-ivory/50 mt-1">{filename}</div>
      </div>
    );
  }
  
  if (isAudio && fileUrl) {
    return (
      <div className="mt-1">
        <div className="flex items-center gap-2 bg-parchment-ivory/5 rounded-lg px-3 py-2">
          <Mic className="w-4 h-4 text-gold-leaf flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <audio src={fileUrl} controls preload="metadata" className="w-full max-w-[240px] h-8" />
            <div className="text-[10px] text-parchment-ivory/50 mt-1">{filename}</div>
          </div>
        </div>
      </div>
    );
  }
  
  // Generic file download
  return (
    <a href={fileUrl} download={filename} className="mt-1 flex items-center gap-2 bg-parchment-ivory/5 rounded-lg px-3 py-2 hover:bg-parchment-ivory/10 transition-colors">
      <FileText className="w-4 h-4 text-gold-leaf flex-shrink-0" />
      <div className="min-w-0">
        <div className="text-xs text-parchment-ivory/80 truncate">{filename}</div>
        <div className="text-[10px] text-parchment-ivory/40">Click to download</div>
      </div>
    </a>
  );
}

interface ChatViewProps {
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onMarkRead: (threadId: string) => void;
  selectedThreadId?: string | null;
  onSelectThread?: (threadId: string | null) => void;
  onCreateThread?: (subject: string) => void;
  onSendFile?: (threadId: string, file: File) => void;
  agoraAppId?: string;
  canCreateThread?: boolean;
}

export default function ChatView({ threads, onSendMessage, onMarkRead, selectedThreadId, onSelectThread, onCreateThread, onSendFile, agoraAppId, canCreateThread }: ChatViewProps) {
  const { lang } = useTranslate();
  const [selectedId, setSelectedId] = useState<string | null>(threads[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadSubject, setNewThreadSubject] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [callGroupId, setCallGroupId] = useState("");
  const [callIsVideo, setCallIsVideo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selected = threads.find(t => t.id === selectedId);

  useEffect(() => {
    if (selectedThreadId && threads.some(t => t.id === selectedThreadId)) {
      setSelectedId(selectedThreadId);
    }
  }, [selectedThreadId, threads]);

  const handleSelectThread = (id: string | null) => {
    setSelectedId(id);
    onSelectThread?.(id);
  };

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

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        setRecordingDuration(0);
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
        if (selectedId && onSendFile) {
          onSendFile(selectedId, audioFile);
        }
        setAudioChunks([]);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      setAudioChunks(chunks);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, [selectedId, onSendFile]);

  const stopRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setMediaRecorder(null);
  }, [mediaRecorder]);

  return (
    <div className="animate-fade-in">
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Messages" : "Messages"}</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Communiquez directement avec votre conseiller assigné." : "Communicate directly with your assigned advisor."}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[calc(100vh-270px)] min-h-[400px]">
        {/* Thread list */}
        <div className="lg:col-span-4 bg-parchment-ivory border border-ebony-deep/5 flex flex-col overflow-y-auto">
          <div className="p-4 bg-ebony-deep text-gold-leaf font-sans text-[10px] uppercase font-bold tracking-widest border-b border-gold-leaf/25 flex items-center justify-between">
            <span>{lang === "fr" ? "Conversations Actives" : "Active Conversations"} ({threads.length})</span>
            {canCreateThread && onCreateThread && (
              <button onClick={() => setShowNewThread(true)} className="text-gold-leaf hover:text-parchment-ivory transition-colors cursor-pointer" title={lang === "fr" ? "Nouvelle Conversation" : "New Conversation"}>
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="divide-y divide-ebony-deep/5 select-none">
            {threads.map((thread) => {
              const isActive = thread.id === selectedId;
              return (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
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
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 ${selected.status === "active" ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-500"}`}>{selected.status === "active" ? (lang === "fr" ? "Actif" : "Active") : (lang === "fr" ? "Archivé" : "Archived")}</span>
                  {selected && agoraAppId && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setCallGroupId(`agora-${selectedId}`); setCallIsVideo(false); setCallActive(true); }}
                        className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors cursor-pointer" title="Voice Call">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button onClick={() => { setCallGroupId(`agora-${selectedId}`); setCallIsVideo(true); setCallActive(true); }}
                        className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer" title="Video Call">
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest/40 flex flex-col gap-4">
                {selected.messages.map((msg) => {
                  const isCollector = msg.senderRole === "collector" || msg.senderRole === "visitor";
                  const isFileMsg = msg.text?.startsWith("[FILE:") || msg.text?.startsWith("[IMAGE:") || msg.text?.startsWith("[AUDIO:") || msg.text?.startsWith("[VIDEO:");

                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${isCollector ? "self-end items-end" : "self-start items-start"}`}>
                      <p className="font-sans text-[9px] uppercase tracking-wider font-bold text-zinc-400 mb-1">{msg.senderName}</p>
                      <div className={`p-4 font-sans text-xs leading-relaxed ${isCollector ? "bg-ebony-deep text-parchment-ivory" : "bg-parchment-ivory border border-ebony-deep/10 text-ebony-deep"}`}>
                        {isFileMsg ? (
                          <FileAttachment text={msg.text} />
                        ) : (
                          <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                        )}
                      </div>
                      <span className="font-mono text-[9px] text-zinc-400 mt-1">{msg.timestamp}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={handleSend} className="p-4 border-t border-ebony-deep/5 bg-white">
                <div className="flex items-stretch gap-3">
                  {onSendFile && (
                    <label className="bg-parchment-ivory border border-ebony-deep/10 hover:border-gold-leaf px-3 py-3 cursor-pointer flex items-center justify-center shrink-0 transition-colors">
                      <Paperclip className="w-4 h-4 text-on-surface-variant" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && selectedId && onSendFile) {
                            onSendFile(selectedId, file);
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={isRecording ? stopRecording : startRecording}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${isRecording ? "bg-red-500 text-white animate-pulse ring-2 ring-red-300" : "bg-ebony-deep/5 hover:bg-ebony-deep/10 text-ebony-deep/50 hover:text-ebony-deep/80"}`}
                      title={isRecording ? "Stop recording" : "Record voice message"}>
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    {isRecording && (
                      <span className="text-xs text-red-500 font-mono animate-pulse">● {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, "0")}</span>
                    )}
                  </div>
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
                </div>
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

      {/* New Thread Modal */}
      {showNewThread && (
        <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-parchment-ivory border border-gold-leaf max-w-md w-full p-6">
            <h3 className="font-serif text-lg text-ebony-deep mb-4">{lang === "fr" ? "Nouvelle Conversation" : "New Conversation"}</h3>
            <input
              type="text"
              value={newThreadSubject}
              onChange={(e) => setNewThreadSubject(e.target.value)}
              placeholder={lang === "fr" ? "Sujet de la conversation..." : "Conversation subject..."}
              className="w-full bg-white border border-ebony-deep/10 focus:border-gold-leaf px-4 py-3 text-xs font-sans mb-4 text-ebony-deep focus:outline-none"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowNewThread(false); setNewThreadSubject(""); }} className="px-4 py-2 text-xs font-sans text-on-surface-variant hover:text-ebony-deep cursor-pointer">
                {lang === "fr" ? "Annuler" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  if (newThreadSubject.trim()) {
                    onCreateThread?.(newThreadSubject.trim());
                    setShowNewThread(false);
                    setNewThreadSubject("");
                  }
                }}
                disabled={!newThreadSubject.trim()}
                className="bg-ebony-deep text-parchment-ivory px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider hover:opacity-90 cursor-pointer disabled:opacity-40"
              >
                {lang === "fr" ? "Créer" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {callActive && agoraAppId && (
        <ChatCallView appId={agoraAppId} groupId={callGroupId} isVideo={callIsVideo} onClose={() => setCallActive(false)} />
      )}
    </div>
  );
}
