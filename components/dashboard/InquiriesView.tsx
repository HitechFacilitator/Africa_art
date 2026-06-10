"use client";

import { useState } from "react";
import { Inquiry } from "@/lib/dashboardTypes";
import {
  Send,
  MessageSquare,
  ShieldAlert,
  Clock,
  Sparkles,
  UserCheck2
} from "lucide-react";

interface InquiriesViewProps {
  inquiries: Inquiry[];
  onAddMessage: (inquiryId: string, text: string) => void;
  selectedInquiryId: string | null;
  setSelectedInquiryId: (id: string | null) => void;
}

export default function InquiriesView({
  inquiries,
  onAddMessage,
  selectedInquiryId,
  setSelectedInquiryId
}: InquiriesViewProps) {
  const [activeId, setActiveId] = useState<string>(selectedInquiryId || inquiries[0]?.id || '');
  const [typedMessage, setTypedMessage] = useState('');

  const activeInquiry = inquiries.find(i => i.id === activeId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeId) return;
    onAddMessage(activeId, typedMessage.trim());
    setTypedMessage('');
  };

  const selectInquiry = (id: string) => {
    setActiveId(id);
    setSelectedInquiryId(id);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-10 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">Advisory & Private Placements</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">Maintain encrypted, direct dialogues with your assigned personal art liaison, Helena Sterling. Coordinates private commissions and bid representation.</p>
      </header>

      {inquiries.length === 0 ? (
        <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-16 text-center select-none">
          <MessageSquare className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
          <p className="font-serif text-lg text-ebony-deep">No Active Inquiries</p>
          <p className="font-sans text-xs text-zinc-400 max-w-sm mx-auto mt-2">Initiate a confidential inquiry regarding our exclusive curator previews from the main dashboard to establish an active placement ledger.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch lg:h-[calc(100vh-270px)] min-h-[400px]">
          <div className="lg:col-span-4 bg-parchment-ivory w-full border border-ebony-deep/5 flex flex-col overflow-y-auto">
            <div className="p-4 bg-ebony-deep text-gold-leaf font-sans text-[10px] uppercase font-bold tracking-widest border-b border-gold-leaf/25">
              Active Placement Requests ({inquiries.length})
            </div>
            <div className="divide-y divide-ebony-deep/5 select-none">
              {inquiries.map((inq) => {
                const isActive = inq.id === activeId;
                const lastMsg = inq.messages[inq.messages.length - 1];
                return (
                  <button key={inq.id} onClick={() => selectInquiry(inq.id)} className={`w-full text-left p-5 transition-colors flex gap-4 cursor-pointer relative ${isActive ? 'bg-surface-container-low' : 'hover:bg-surface-container-low/40'}`}>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-terracotta-earth" />}
                    <div className="w-12 h-12 bg-zinc-200 shrink-0 border border-ebony-deep/5 overflow-hidden"><img src={inq.imageUrl} alt={inq.artworkTitle} className="w-full h-full object-cover object-center" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h4 className="font-serif text-sm font-semibold text-ebony-deep truncate leading-none">{inq.artworkTitle}</h4>
                        <span className="text-[9px] font-sans font-medium text-zinc-400 shrink-0">{inq.date.split(',')[0]}</span>
                      </div>
                      <p className="font-sans text-[11px] text-zinc-500 line-clamp-1 mb-2">{lastMsg ? lastMsg.text : 'No messages yet...'}</p>
                      <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold">
                        <span className={`px-2 py-0.5 border ${inq.status === 'Offer Presented' ? 'bg-amber-100 text-amber-800 border-amber-300/40' : 'bg-emerald-50 text-emerald-800 border-emerald-350/30'}`}>{inq.status}</span>
                        <span className="text-zinc-400 italic">Curator: Sterling</span>
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
                      <p className="font-sans text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Socio-Cultural Advisory • Designated Curator</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-0.5"><Clock className="w-3.5 h-3.5 text-zinc-400" /><span>Private Ledger Channel</span></div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{activeInquiry.id}</span>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest/40 flex flex-col gap-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-amber-50/50 border border-gold-leaf/30 text-center px-4 py-2.5 max-w-md shadow-sm">
                      <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-gold-leaf mb-0.5 flex items-center justify-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> End-to-End Cryptic Channel Active</p>
                      <p className="font-sans text-[10px] text-zinc-400">This discussion acts as a binding provenance register and private placement record.</p>
                    </div>
                  </div>
                  {activeInquiry.messages.map((msg, idx) => {
                    const isCollector = msg.sender === 'collector';
                    return (
                      <div key={idx} className={`flex flex-col max-w-[80%] ${isCollector ? 'self-end items-end' : 'self-start items-start'}`}>
                        <p className="font-sans text-[9px] uppercase tracking-wider font-bold text-zinc-400 mb-1">{isCollector ? 'Julian Doe' : 'Helena Sterling • Advisor'}</p>
                        <div className={`p-4 font-sans text-xs leading-relaxed ${isCollector ? 'bg-ebony-deep text-parchment-ivory' : 'bg-parchment-ivory border border-ebony-deep/10 text-ebony-deep'}`}>{msg.text}</div>
                        <span className="font-mono text-[9px] text-zinc-400 mt-1">{msg.timestamp}</span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-ebony-deep/5 bg-white flex items-stretch gap-3">
                  <input type="text" required value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} placeholder="Inquire securely about provenance, private pricing, premium transportation logistics..." className="flex-1 bg-parchment-ivory border border-ebony-deep/10 focus:border-gold-leaf px-4 py-3 text-xs font-sans tracking-wide text-ebony-deep focus:outline-none" />
                  <button type="submit" className="bg-ebony-deep text-parchment-ivory hover:opacity-90 active:scale-95 px-6 py-3 transition-all cursor-pointer flex items-center justify-center shrink-0 border-0"><Send className="w-4.5 h-4.5" /></button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                <ShieldAlert className="w-10 h-10 text-gold-leaf mb-3 animate-pulse" />
                <p className="font-serif italic text-sm mb-1">Channel Unselected</p>
                <p className="font-sans text-xs">Select any private positioning card on your left cabinet stream to initialize peer advisory lines.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}