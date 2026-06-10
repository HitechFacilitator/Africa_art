"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  ShieldCheck,
  Send,
  X,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ARTWORKS } from "@/lib/mockData";
import type { Artwork } from "@/lib/types";

export default function PriceOnRequestPage() {
  const router = useRouter();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [clientStatus, setClientStatus] = useState("Private Family Office");
  const [budgetRange, setBudgetRange] = useState("€1M – €5M");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [filterMaterial, setFilterMaterial] = useState("All");
  const [filterRegion, setFilterRegion] = useState("All");

  const porArtworks = ARTWORKS.filter((a) => a.label === "Price on Request");

  const materials = ["All", ...Array.from(new Set(porArtworks.map((a) => a.material)))];
  const regions = ["All", ...Array.from(new Set(porArtworks.map((a) => a.region)))];

  const filtered = porArtworks.filter((a) => {
    if (filterMaterial !== "All" && a.material !== filterMaterial) return false;
    if (filterRegion !== "All" && a.region !== filterRegion) return false;
    return true;
  });

  const openInquiry = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowInquiryModal(true);
    setInquiryNotes(`Requesting confidential pricing and allocation terms for ${artwork.title}.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const resetModal = () => {
    setShowInquiryModal(false);
    setSelectedArtwork(null);
    setSubmitted(false);
    setInquiryName("");
    setInquiryEmail("");
    setInquiryNotes("");
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-ebony-deep py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={12} className="text-gold-leaf" />
                  <span className="label-caps text-gold-leaf">Confidential Offering</span>
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="font-display-lg text-parchment-ivory mb-4">Price on Request</h1>
                </motion.div>
                <p className="font-sans text-sm text-parchment-ivory/60 max-w-lg leading-relaxed">
                  For our most significant masterpieces, pricing is disclosed exclusively
                  to vetted collectors. Browse the catalogue below and submit a confidential
                  inquiry to receive allocation terms, provenance dossiers, and investment analysis.
                </p>
                <div className="flex items-center gap-6 mt-8">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                    <ShieldCheck size={12} className="text-gold-leaf/70" /> End-to-end encrypted
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                    <FileText size={12} className="text-gold-leaf/70" /> Full dossier included
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-parchment-ivory/5 border border-gold-leaf/15 p-6">
                  <h3 className="font-serif text-lg text-parchment-ivory mb-3">How It Works</h3>
                  <div className="space-y-3">
                    {[
                      { step: "1", text: "Browse our curated POR collection below" },
                      { step: "2", text: "Select an artwork and submit a confidential inquiry" },
                      { step: "3", text: "Receive full pricing, provenance dossier, and terms within 24 hours" },
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-gold-leaf text-ebony-deep flex items-center justify-center text-[10px] font-bold shrink-0">{s.step}</span>
                        <p className="text-xs text-parchment-ivory/70 pt-0.5">{s.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="bg-surface-container border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Filter:</span>
              <div className="flex gap-2">
                {materials.map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMaterial(m)}
                    className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer bg-transparent ${
                      filterMaterial === m ? "border-ebony-deep bg-ebony-deep text-parchment-ivory" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-on-surface/10 hidden sm:block" />
              <div className="flex gap-2">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRegion(r)}
                    className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer bg-transparent ${
                      filterRegion === r ? "border-ebony-deep bg-ebony-deep text-parchment-ivory" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs text-on-surface-variant">
              <span className="font-bold text-ebony-deep">{filtered.length}</span> masterpieces available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((artwork, idx) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group"
              >
                <div className="relative bg-ebony-deep overflow-hidden mb-4 aspect-[4/5]">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-ebony-deep/80 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1.5 border border-gold-leaf/20">
                    <Lock size={9} className="text-gold-leaf" />
                    <span className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest">POR</span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={() => router.push(`/artwork/${artwork.id}`)}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-gold-leaf hover:text-white transition-all"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ebony-deep/90 to-transparent text-parchment-ivory">
                    <p className="text-[9px] tracking-widest text-gold-leaf uppercase font-bold">{artwork.period} · {artwork.material}</p>
                    <h3 className="font-serif text-base mt-0.5">{artwork.title}</h3>
                    <p className="text-[10px] text-parchment-ivory/50 mt-0.5">{artwork.origin}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Scarcity Index</p>
                    <p className="font-serif text-sm text-ebony-deep font-semibold">{artwork.scarcityIndex}/100</p>
                  </div>
                  <button
                    onClick={() => openInquiry(artwork)}
                    className="bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-1.5"
                  >
                    <Send size={10} /> Inquire
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-on-surface-variant">No artworks match your current filters.</p>
              <button onClick={() => { setFilterMaterial("All"); setFilterRegion("All"); }} className="mt-4 text-xs text-gold-leaf uppercase tracking-widest font-bold hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={resetModal} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><X className="w-6 h-6" /></button>
              {submitted ? (
                <div className="text-center">
                  <CheckCircle className="w-14 h-14 text-gold-leaf mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">Inquiry Received</h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    Your confidential inquiry for <strong>{selectedArtwork?.title}</strong> has been received.
                    Our curatorial team will respond within 24 hours with full provenance
                    documentation and private placement terms.
                  </p>
                  <button onClick={resetModal} className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity cursor-pointer border-0">
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <Sparkles className="w-10 h-10 text-gold-leaf mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide">Confidential Acquisition Inquiry</h3>
                    <p className="text-xs text-on-surface-variant mt-1">For: {selectedArtwork?.title}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Full Name *</label>
                      <input type="text" required value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="Julian Doe" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Email *</label>
                      <input type="email" required value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="collector@institution.com" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Client Status</label>
                      <select value={clientStatus} onChange={(e) => setClientStatus(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none">
                        <option>Private Family Office</option>
                        <option>Museum / Institution</option>
                        <option>Sovereign Wealth Fund</option>
                        <option>Private Collector</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Indicative Budget Range</label>
                      <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none">
                        <option>€1M – €5M</option>
                        <option>€5M – €10M</option>
                        <option>€10M – €25M</option>
                        <option>€25M+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Notes</label>
                      <textarea rows={3} value={inquiryNotes} onChange={(e) => setInquiryNotes(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-ebony-deep/5">
                      <button type="button" onClick={resetModal} className="border border-ebony-deep/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent">Cancel</button>
                      <button type="submit" disabled={submitting} className="bg-ebony-deep text-parchment-ivory px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0 flex items-center gap-2">
                        {submitting ? (<><Clock className="w-3.5 h-3.5 animate-spin" /> Submitting...</>) : "Submit Inquiry"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}