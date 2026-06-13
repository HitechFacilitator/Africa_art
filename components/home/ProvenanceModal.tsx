"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, ShieldCheck, TrendingUp, MapPin, Clock, Coins } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { useTranslate } from "@/lib/translations";

interface ProvenanceModalProps {
  artwork: Artwork;
  onClose: () => void;
  onApplyForClub: () => void;
}

export default function ProvenanceModal({ artwork, onClose, onApplyForClub }: ProvenanceModalProps) {
  const [activeTab, setActiveTab] = useState<"provenance" | "investment" | "specs">("provenance");
  const [inquiryText, setInquiryText] = useState("");
  const [inquiryList, setInquiryList] = useState<{ sender: string; text: string; date: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { lang } = useTranslate();

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;

    const userMsg = {
      sender: "Investor (You)",
      text: inquiryText,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setInquiryList((prev) => [...prev, userMsg]);
    setInquiryText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const curatorMsg = {
        sender: "Aduna Chief Curator",
        text: `Thank you for your inquiry regarding the ${artwork.title}. Because of the exquisite nature and high demand for ${artwork.era} artifacts, we handle authentication logs and custom pricing offers through vetted private channels.`,
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setInquiryList((prev) => [...prev, curatorMsg]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ebony-deep/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-parchment-ivory border border-on-surface/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-ebony-deep text-parchment-ivory hover:bg-gold-leaf hover:text-ebony-deep transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="w-full md:w-5/12 bg-ebony-deep p-6 sm:p-8 flex flex-col justify-between text-parchment-ivory">
            <div>
              <div className="flex items-center gap-2 text-gold-leaf mb-4">
                <ShieldCheck size={16} />
                <span className="font-sans text-[10px] tracking-widest uppercase font-semibold">
                  {lang === "fr" ? "Actif Patrimonia Vérifié" : "Vetted Heritage Asset"}
                </span>
              </div>
              <div className="aspect-[4/5] w-full bg-parchment-ivory/5 border border-parchment-ivory/10 overflow-hidden mb-6 relative">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ebony-deep/40 to-transparent" />
              </div>
              <h2 className="font-serif text-3xl text-parchment-ivory tracking-tight mb-2">
                {artwork.title}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-sans text-[11px] tracking-wider uppercase px-2.5 py-1 border border-parchment-ivory/20 bg-parchment-ivory/5">
                  {artwork.era}
                </span>
                <span className="font-sans text-[11px] tracking-wider uppercase px-2.5 py-1 border border-parchment-ivory/20 bg-parchment-ivory/5">
                  {artwork.material}
                </span>
              </div>
            </div>
            <div className="border-t border-parchment-ivory/15 pt-6 mt-6">
              <div className="flex items-center gap-2 text-gold-leaf mb-2">
                <MapPin size={14} />
                <span className="font-sans text-xs uppercase font-medium tracking-wider">Geographic Source</span>
              </div>
              <p className="font-sans text-xs text-parchment-ivory/70 leading-relaxed">{artwork.origin}</p>
              <div className="mt-4 p-3 bg-parchment-ivory/5 border border-parchment-ivory/10 text-[11px] font-sans text-gold-leaf flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Digitally Authenticated Proof of Preservation</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex border-b border-on-surface/10 mb-6">
                {(["provenance", "investment", "specs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-4 font-sans text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
                      activeTab === tab
                        ? "border-gold-leaf text-ebony-deep"
                        : "border-transparent text-on-surface-variant/50 hover:text-ebony-deep"
                    }`}
                  >
                    {tab === "provenance" ? (lang === "fr" ? "Provenance et Garde" : "Provenance & Custody") : tab === "investment" ? (lang === "fr" ? "Actif et Finance" : "Asset & Finance") : (lang === "fr" ? "Spécifications Techniques" : "Technical Specs")}
                  </button>
                ))}
              </div>

              {activeTab === "provenance" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg text-ebony-deep mb-2">{lang === "fr" ? "Déclaration Historique" : "Historical Statement"}</h4>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed italic border-l-2 border-gold-leaf pl-4 bg-surface-container-low py-2">
                      &ldquo;{artwork.historicalStory}&rdquo;
                    </p>
                  </div>
                  <div>
                    <h4 className="font-sans text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant/50 mb-3 flex items-center gap-2">
                      <Clock size={12} />
                      <span>{lang === "fr" ? "Journal de Propriété Vérifié" : "Verified Ownership Log"}</span>
                    </h4>
                    <div className="relative border-l border-on-surface/15 pl-4 ml-2 space-y-4 pt-1">
                      {artwork.provenance.map((entry, index) => (
                        <div key={index} className="relative">
                          <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-gold-leaf ring-4 ring-parchment-ivory" />
                          <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">{entry}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "investment" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface-container-low border border-on-surface/10">
                      <span className="font-sans text-[10px] text-on-surface-variant/50 uppercase block mb-1">{lang === "fr" ? "Prix d'Évaluation" : "Appraisal Price"}</span>
                      <span className="font-serif text-base font-semibold text-ebony-deep">{artwork.investment?.estimatedValue}</span>
                    </div>
                    <div className="p-3 bg-surface-container-low border border-on-surface/10">
                      <span className="font-sans text-[10px] text-on-surface-variant/50 uppercase block mb-1">{lang === "fr" ? "TRI Historique" : "Historical CAGR"}</span>
                      <span className="font-serif text-base font-semibold text-terracotta-earth flex items-center">
                        <TrendingUp size={14} className="mr-1" />+{artwork.investment?.historicalCagr}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-container-low border border-on-surface/5">
                    <span className="font-sans text-[10px] text-on-surface-variant/50 block mb-2 uppercase font-semibold">{lang === "fr" ? "Dimensions" : "Dimensions"}</span>
                    <p className="font-mono text-xs text-ebony-deep font-semibold">{artwork.dimensions}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-on-surface/10 pt-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="p-4 bg-ebony-deep text-parchment-ivory flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 text-gold-leaf mb-1">
                      <Coins size={14} />
                      <span className="font-sans text-[10px] tracking-widest uppercase font-semibold">{lang === "fr" ? "Acquisition" : "Acquisition"}</span>
                    </div>
                    <p className="font-sans text-[10px] text-parchment-ivory/60">
                      {lang === "fr" ? "Contactez notre équipe de conseil..." : "Contact our advisory team for private acquisition details."}
                    </p>
                  </div>
                  <button
                    onClick={onApplyForClub}
                    className="mt-4 w-full bg-gold-leaf hover:bg-parchment-ivory hover:text-ebony-deep text-ebony-deep font-sans text-xs font-semibold py-2 transition-all uppercase tracking-widest"
                  >
                    {lang === "fr" ? "Demander un Conseil d'Acquisition" : "Request Acquisition Advisory"}
                  </button>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] text-on-surface-variant/50 uppercase font-semibold mb-2">{lang === "fr" ? "Ligne Directe de Conservation" : "Direct Curation Hotline"}</span>
                  <form onSubmit={handleInquirySubmit} className="flex">
                    <input
                      type="text"
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      placeholder={lang === "fr" ? "Posez des questions sur les origines, les tests..." : "Ask about origins, testing..."}
                      className="flex-grow border-b border-on-surface/30 bg-transparent text-xs font-sans py-2 focus:outline-none focus:border-gold-leaf text-ebony-deep"
                    />
                    <button
                      type="submit"
                      className="ml-2 bg-gold-leaf hover:bg-ebony-deep hover:text-parchment-ivory text-ebony-deep font-sans text-xs uppercase tracking-wider px-3 py-2 transition-all"
                    >
                      {lang === "fr" ? "Demander" : "Ask"}
                    </button>
                  </form>
                  {inquiryList.length > 0 && (
                    <div className="mt-3 bg-surface-container-low p-2 text-[10px] font-sans space-y-2 max-h-[100px] overflow-y-auto">
                      {inquiryList.map((msg, i) => (
                        <div key={i} className="border-b border-on-surface/5 pb-1">
                          <span className="font-bold text-gold-leaf mr-1">{msg.sender}:</span>
                          <span className="text-on-surface-variant">{msg.text}</span>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="text-gold-leaf italic animate-pulse">{lang === "fr" ? "L'archiviste en chef d'Aduna tape..." : "Aduna chief archivist typing..."}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}