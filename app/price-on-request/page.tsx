"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useTranslate } from "@/lib/translations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useArtworks } from "@/lib/hooks";
import { useTranslatedArtworks } from "@/lib/useTranslatedArtwork";
import { porApi } from "@/lib/api";
import type { Artwork } from "@/lib/types";

export default function PriceOnRequestPage() {
  const router = useRouter();
  const { lang } = useTranslate();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryFirstName, setInquiryFirstName] = useState("");
  const [inquiryLastName, setInquiryLastName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [clientProfile, setClientProfile] = useState("Private Collector");
  const [budgetRange, setBudgetRange] = useState("€1M – €5M");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [filterMaterial, setFilterMaterial] = useState("All");
  const [filterRegion, setFilterRegion] = useState("All");
  const [submittedArtworkIds, setSubmittedArtworkIds] = useState<Set<string>>(new Set());
  const [formError, setFormError] = useState<string | null>(null);

  const { artworks: apiArtworks } = useArtworks();
  const porArtworks = (apiArtworks as unknown as Artwork[]).filter((a) => a.label === "Price on Request");
  const displayPorArtworks = useTranslatedArtworks(porArtworks);

  useEffect(() => {
    porApi.getMy().then((res) => {
      const data = res.data || [];
      const ids = new Set<string>();
      data.forEach((req: { artworkId: number }) => ids.add(`art-${req.artworkId}`));
      setSubmittedArtworkIds(ids);
    }).catch(() => {});
  }, []);

  const materials = ["All", ...Array.from(new Set(displayPorArtworks.map((a) => a.material)))];
  const regions = ["All", ...Array.from(new Set(displayPorArtworks.map((a) => a.region)))];

  const filtered = displayPorArtworks.filter((a) => {
    if (filterMaterial !== "All" && a.material !== filterMaterial) return false;
    if (filterRegion !== "All" && a.region !== filterRegion) return false;
    return true;
  });

  const openInquiry = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowInquiryModal(true);
    setInquiryNotes(`Requesting confidential pricing and allocation terms for ${artwork.title}.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryFirstName || !inquiryLastName || !inquiryEmail || !gdprConsent) return;
    if (!selectedArtwork) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const artworkNumId = Number(String(selectedArtwork.id).replace("art-", ""));
      const message = `Price request for "${selectedArtwork.title}".\n\nName: ${inquiryFirstName} ${inquiryLastName}\nEmail: ${inquiryEmail}\nPhone: ${inquiryPhone || "Not provided"}\nProfile: ${clientProfile}\nBudget: ${budgetRange}\n\n${inquiryNotes || ""}`;
      await porApi.create(artworkNumId, message);
      setSubmittedArtworkIds((prev) => new Set(prev).add(selectedArtwork.id));
      setSubmitted(true);
    } catch (err: any) {
      const msg = err?.message || "Failed to submit inquiry";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setShowInquiryModal(false);
    setSelectedArtwork(null);
    setSubmitted(false);
    setInquiryFirstName("");
    setInquiryLastName("");
    setInquiryEmail("");
    setInquiryPhone("");
    setClientProfile("Private Collector");
    setBudgetRange("€1M – €5M");
    setInquiryNotes("");
    setGdprConsent(false);
    setFormError(null);
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
                  <span className="label-caps text-gold-leaf">{lang === "fr" ? "Offre Confidentielle" : "Confidential Offering"}</span>
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="font-display-lg text-parchment-ivory mb-4">{lang === "fr" ? "Prix sur Demande" : "Price on Request"}</h1>
                </motion.div>
                <p className="font-sans text-sm text-parchment-ivory/60 max-w-lg leading-relaxed">
                  {lang === "fr" ? "Pour nos œuvres maîtresses les plus significatives, les prix sont divulgués exclusivement aux collectionneurs vérifiés. Parcourez le catalogue ci-dessous et soumettez une demande confidentielle pour recevoir les conditions d'allocation, les dossiers de provenance et l'analyse d'investissement." : "For our most significant masterpieces, pricing is disclosed exclusively to vetted collectors. Browse the catalogue below and submit a confidential inquiry to receive allocation terms, provenance dossiers, and investment analysis."}
                </p>
                <div className="flex items-center gap-6 mt-8">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                    <ShieldCheck size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Chiffrement de bout en bout" : "End-to-end encrypted"}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                    <FileText size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Dossier complet inclus" : "Full dossier included"}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-parchment-ivory/5 border border-gold-leaf/15 p-6">
                  <h3 className="font-serif text-lg text-parchment-ivory mb-3">{lang === "fr" ? "Comment ça marche" : "How It Works"}</h3>
                  <div className="space-y-3">
                    {[
                      { step: "1", text: lang === "fr" ? "Parcourez notre collection POR ci-dessous" : "Browse our curated POR collection below" },
                      { step: "2", text: lang === "fr" ? "Sélectionnez une œuvre et soumettez une demande confidentielle" : "Select an artwork and submit a confidential inquiry" },
                      { step: "3", text: lang === "fr" ? "Recevez les prix complets, le dossier de provenance et les conditions sous 24 heures" : "Receive full pricing, provenance dossier, and terms within 24 hours" },
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
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Filtrer :" : "Filter:"}</span>
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
              <span className="font-bold text-ebony-deep">{filtered.length}</span> {lang === "fr" ? "œuvres disponibles" : "masterpieces available"}
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
                  {submittedArtworkIds.has(artwork.id) && (
                    <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1.5">
                      <CheckCircle size={9} className="text-white" />
                      <span className="text-[9px] text-white font-bold uppercase tracking-widest">{lang === "fr" ? "Demandé" : "Inquired"}</span>
                    </div>
                  )}
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
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{lang === "fr" ? "Indice de Rareté" : "Scarcity Index"}</p>
                    <p className="font-serif text-sm text-ebony-deep font-semibold">{artwork.scarcityIndex}/100</p>
                  </div>
                  {submittedArtworkIds.has(artwork.id) ? (
                    <Link href="/dashboard" className="bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-1.5">
                      <MessageSquare size={10} /> {lang === "fr" ? "Suivre" : "Track in Dashboard"}
                    </Link>
                  ) : (
                    <button
                      onClick={() => openInquiry(artwork)}
                      className="bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-1.5"
                    >
                      <Send size={10} /> {lang === "fr" ? "Demander" : "Inquire"}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-on-surface-variant">{lang === "fr" ? "Aucune œuvre ne correspond à vos filtres actuels." : "No artworks match your current filters."}</p>
              <button onClick={() => { setFilterMaterial("All"); setFilterRegion("All"); }} className="mt-4 text-xs text-gold-leaf uppercase tracking-widest font-bold hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent">
                {lang === "fr" ? "Effacer les Filtres" : "Clear Filters"}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={resetModal} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><X className="w-6 h-6" /></button>
              {submitted ? (
                <div className="text-center">
                  <CheckCircle className="w-14 h-14 text-gold-leaf mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">{lang === "fr" ? "Demande Reçue" : "Inquiry Received"}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {lang === "fr" ? <>Votre demande confidentielle pour <strong>{selectedArtwork?.title}</strong> a été reçue. Notre équipe de curateurs répondra dans les 24 heures avec la documentation complète de provenance et les conditions de placement privé.</> : <>Your confidential inquiry for <strong>{selectedArtwork?.title}</strong> has been received. Our curatorial team will respond within 24 hours with full provenance documentation and private placement terms.</>}
                  </p>
                  <button onClick={resetModal} className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity cursor-pointer border-0">
                    {lang === "fr" ? "Fermer" : "Close"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <Sparkles className="w-10 h-10 text-gold-leaf mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide">{lang === "fr" ? "Demande d'Acquisition Confidentielle" : "Confidential Acquisition Inquiry"}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Pour :" : "For:"} {selectedArtwork?.title}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Prénom *" : "First Name *"}</label>
                        <input type="text" required value={inquiryFirstName} onChange={(e) => setInquiryFirstName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="Julian" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Nom *" : "Last Name *"}</label>
                        <input type="text" required value={inquiryLastName} onChange={(e) => setInquiryLastName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Email Professionnel *" : "Professional Email *"}</label>
                      <input type="email" required value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="collector@institution.com" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Téléphone International" : "International Phone"}</label>
                      <div className="flex">
                        <select className="border border-ebony-deep/15 border-r-0 p-3 text-xs focus:border-gold-leaf focus:outline-none bg-surface-container-low w-24 shrink-0">
                          <option>+44</option>
                          <option>+1</option>
                          <option>+33</option>
                          <option>+49</option>
                          <option>+41</option>
                          <option>+234</option>
                          <option>+27</option>
                          <option>+254</option>
                        </select>
                        <input type="tel" value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="7700 900000" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Profil *" : "Profile *"}</label>
                      <select value={clientProfile} onChange={(e) => setClientProfile(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none">
                        <option>{lang === "fr" ? "Collectionneur Privé" : "Private Collector"}</option>
                        <option>{lang === "fr" ? "Institution / Musée" : "Institution / Museum"}</option>
                        <option>{lang === "fr" ? "Maison de Ventes" : "Auction House"}</option>
                        <option>{lang === "fr" ? "Investisseur" : "Investor"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Budget Indicatif" : "Indicative Budget"}</label>
                      <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none">
                        <option>€100K – €500K</option>
                        <option>€500K – €1M</option>
                        <option>€1M – €5M</option>
                        <option>€5M – €10M</option>
                        <option>€10M – €25M</option>
                        <option>€25M+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Message" : "Message"}</label>
                      <textarea rows={3} value={inquiryNotes} onChange={(e) => setInquiryNotes(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none resize-none" placeholder="Interest, timeline, special conditions..." />
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="gdpr-consent"
                        required
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="mt-1 accent-gold-leaf"
                      />
                      <label htmlFor="gdpr-consent" className="text-[10px] text-on-surface-variant leading-relaxed">
                        {lang === "fr" ? "Je consens au traitement de mes données personnelles conformément à la Politique de Confidentialité et aux réglementations RGPD. Je comprends que mes données seront utilisées pour répondre à cette demande. *" : "I consent to the processing of my personal data in accordance with the Privacy Policy and GDPR regulations. I understand my data will be used to respond to this inquiry. *"}
                      </label>
                    </div>
                    {formError && (
                      <div className="bg-red-50 border border-red-200/60 p-3 text-xs text-red-700 font-sans flex items-start gap-2">
                        <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}
                    <div className="flex justify-end gap-3 pt-4 border-t border-ebony-deep/5">
                      <button type="button" onClick={resetModal} className="border border-ebony-deep/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent">{lang === "fr" ? "Annuler" : "Cancel"}</button>
                      <button type="submit" disabled={submitting || !gdprConsent} className="bg-ebony-deep text-parchment-ivory px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0 flex items-center gap-2">
                        {submitting ? (<><Clock className="w-3.5 h-3.5 animate-spin" /> {lang === "fr" ? "Envoi..." : "Submitting..."}</>) : (lang === "fr" ? "Soumettre la Demande" : "Submit Inquiry")}
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