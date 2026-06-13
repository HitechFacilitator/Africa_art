"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Lock,
  Clock,
  Send,
  X,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslate } from "@/lib/translations";

interface PreviewArtwork {
  id: string;
  title: string;
  origin: string;
  region: string;
  tribe: string;
  material: string;
  period: string;
  dimensions: string;
  imageUrl: string;
  estimatedValue: string;
  scarcityIndex: number;
  description: string;
  isPublished: boolean;
}

const UPCOMING_ARTWORKS: PreviewArtwork[] = [
  {
    id: "preview-1",
    title: "Makonde Ujamaa Tree of Life",
    origin: "Mozambique",
    region: "East Africa",
    tribe: "Makonde",
    material: "Black Hardwood",
    period: "Mid 20th Century",
    dimensions: "120 cm × 45 cm × 45 cm",
    imageUrl: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&q=80",
    estimatedValue: "€320K – €450K",
    scarcityIndex: 91,
    description: "A monumental Makonde Ujamaa sculpture depicting intertwined figures in communal unity. Exceptional craftsmanship with deep patina from decades of ritual use.",
    isPublished: false,
  },
  {
    id: "preview-2",
    title: "Ashanti Gold Fertility Weight",
    origin: "Ghana",
    region: "West Africa",
    tribe: "Ashanti",
    material: "Gold Alloy",
    period: "18th Century",
    dimensions: "12 cm × 8 cm × 6 cm",
    imageUrl: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?auto=format&fit=crop&q=80",
    estimatedValue: "€180K – €260K",
    scarcityIndex: 87,
    description: "Exquisitely cast gold fertility weight with intricate Adinkra symbolism. Provenance traced through three private European collections since 1892.",
    isPublished: false,
  },
  {
    id: "preview-3",
    title: "Songye Kifwebe Mask",
    origin: "DR Congo",
    region: "Central Africa",
    tribe: "Songye",
    material: "Wood, Pigment, Raffia",
    period: "Late 19th Century",
    dimensions: "38 cm × 22 cm × 15 cm",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80",
    estimatedValue: "€280K – €400K",
    scarcityIndex: 93,
    description: "Rare large-scale Songye Kifwebe power mask with dramatic striated polychrome surface. Museum-deaccessioned with full institutional provenance.",
    isPublished: false,
  },
];

export default function PreviewPage() {
  const { lang, tAsync } = useTranslate();
  const [previewArtworks, setPreviewArtworks] = useState<PreviewArtwork[]>(UPCOMING_ARTWORKS);
  const abortRef = useRef(0);

  useEffect(() => {
    if (lang === "en") {
      setPreviewArtworks(previewArtworks);
      return;
    }
    let cancelled = false;
    const runId = ++abortRef.current;
    async function translate() {
      const results = await Promise.all(
        previewArtworks.map(async (art) => ({
          ...art,
          title: await tAsync(art.title),
          origin: await tAsync(art.origin),
          region: await tAsync(art.region),
          tribe: await tAsync(art.tribe),
          material: await tAsync(art.material),
          period: await tAsync(art.period),
          dimensions: await tAsync(art.dimensions),
          description: await tAsync(art.description),
          estimatedValue: await tAsync(art.estimatedValue),
        }))
      );
      if (!cancelled && runId === abortRef.current) setPreviewArtworks(results);
    }
    translate();
    return () => { cancelled = true; };
  }, [lang, tAsync]);
  const [selectedArtwork, setSelectedArtwork] = useState<PreviewArtwork | null>(null);
  const [showPORModal, setShowPORModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [porFirstName, setPorFirstName] = useState("");
  const [porLastName, setPorLastName] = useState("");
  const [porEmail, setPorEmail] = useState("");
  const [porPhone, setPorPhone] = useState("");
  const [porBudget, setPorBudget] = useState("€100K – €500K");
  const [porMessage, setPorMessage] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [porSubmitted, setPorSubmitted] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveConfirmed, setReserveConfirmed] = useState(false);

  const resetPOR = () => {
    setShowPORModal(false);
    setPorSubmitted(false);
    setPorFirstName("");
    setPorLastName("");
    setPorEmail("");
    setPorPhone("");
    setPorBudget("€100K – €500K");
    setPorMessage("");
    setGdprConsent(false);
  };

  const resetReserve = () => {
    setShowReserveModal(false);
    setReserveConfirmed(false);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-ebony-deep py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">{lang === "fr" ? "Exclusif VIP" : "VIP Exclusive"}</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display-lg text-parchment-ivory mb-4">{lang === "fr" ? "Aperçus Exclusifs" : "Exclusive Previews"}</h1>
            </motion.div>
            <p className="font-sans text-sm text-parchment-ivory/60 max-w-xl">
              {lang === "fr" ? "Accès prioritaire aux acquisitions à venir avant la publication. Exprimez votre intérêt ou réservez des œuvres directement depuis cette salle d'aperçu exclusive." : "Priority access to upcoming acquisitions before public listing. Express interest or reserve artworks directly from this exclusive preview room."}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <Lock size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Accès Pré-Publication" : "Pre-Publication Access"}
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <ShieldCheck size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Membres VIP Uniquement" : "VIP Members Only"}
              </div>
            </div>
          </div>
        </section>

        {/* Artwork Grid */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs text-on-surface-variant">
              <span className="font-bold text-ebony-deep">{previewArtworks.length}</span> {lang === "fr" ? "acquisitions à venir" : "upcoming acquisitions"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewArtworks.map((artwork, idx) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative bg-ebony-deep overflow-hidden mb-4 aspect-[4/5]">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Confidential Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-parchment-ivory/10 font-serif text-6xl font-bold uppercase rotate-[-30deg] tracking-widest select-none">
                      {lang === "fr" ? "CONFIDENTIEL" : "CONFIDENTIAL"}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 bg-ebony-deep/80 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1.5 border border-gold-leaf/20">
                    <Lock size={9} className="text-gold-leaf" />
                    <span className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest">{lang === "fr" ? "Aperçu" : "Preview"}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ebony-deep/90 to-transparent text-parchment-ivory">
                    <p className="text-[9px] tracking-widest text-gold-leaf uppercase font-bold">{artwork.period} · {artwork.material}</p>
                    <h3 className="font-serif text-base mt-0.5">{artwork.title}</h3>
                    <p className="text-[10px] text-parchment-ivory/50 mt-0.5">{artwork.origin}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{lang === "fr" ? "Valeur Estimée" : "Estimated Value"}</p>
                      <p className="font-serif text-sm text-ebony-deep font-semibold">{artwork.estimatedValue}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{lang === "fr" ? "Rareté" : "Scarcity"}</p>
                      <p className="font-serif text-sm text-gold-leaf font-semibold">{artwork.scarcityIndex}/100</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedArtwork(artwork); setShowPORModal(true); }}
                      className="flex-1 bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send size={10} /> {lang === "fr" ? "Demande Prioritaire" : "Priority Inquiry"}
                    </button>
                    <button
                      onClick={() => { setSelectedArtwork(artwork); setShowReserveModal(true); }}
                      className="flex-1 border border-gold-leaf text-gold-leaf px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock size={10} /> {lang === "fr" ? "Réserver 48h" : "Reserve 48h"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {/* Priority POR Modal */}
      <AnimatePresence>
        {showPORModal && selectedArtwork && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={resetPOR} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><X className="w-6 h-6" /></button>
              {porSubmitted ? (
                <div className="text-center">
                  <CheckCircle className="w-14 h-14 text-gold-leaf mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">{lang === "fr" ? "Demande Prioritaire Reçue" : "Priority Inquiry Received"}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {lang === "fr" ? "Votre demande prioritaire VIP pour " : "Your VIP priority inquiry for "}<strong>{selectedArtwork.title}</strong>{lang === "fr" ? " a été reçue. En tant que membre prioritaire, notre équipe de conservateurs vous répondra dans les 12 heures avec la tarification complète et la documentation de provenance." : " has been received. As a priority member, our curatorial team will respond within 12 hours with full pricing and provenance documentation."}
                  </p>
                  <button onClick={resetPOR} className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity cursor-pointer border-0">{lang === "fr" ? "Fermer" : "Close"}</button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <Sparkles className="w-10 h-10 text-gold-leaf mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide">{lang === "fr" ? "Demande Prioritaire VIP" : "VIP Priority Inquiry"}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Pour :" : "For:"} {selectedArtwork.title}</p>
                    <p className="text-[10px] text-gold-leaf mt-1 font-semibold">{lang === "fr" ? "Réponse Prioritaire sous 12 Heures" : "Priority Response within 12 Hours"}</p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); if (!porFirstName || !porLastName || !porEmail || !gdprConsent) return; setPorSubmitted(true); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Prénom *" : "First Name *"}</label>
                        <input type="text" required value={porFirstName} onChange={(e) => setPorFirstName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="Julian" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Nom de Famille *" : "Last Name *"}</label>
                        <input type="text" required value={porLastName} onChange={(e) => setPorLastName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Courriel *" : "Email *"}</label>
                      <input type="email" required value={porEmail} onChange={(e) => setPorEmail(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="collector@institution.com" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Téléphone" : "Phone"}</label>
                      <input type="tel" value={porPhone} onChange={(e) => setPorPhone(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="+44 7700 900000" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Budget Indicatif" : "Indicative Budget"}</label>
                      <select value={porBudget} onChange={(e) => setPorBudget(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none">
                        <option>€100K – €500K</option>
                        <option>€500K – €1M</option>
                        <option>€1M – €5M</option>
                        <option>€5M+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Message" : "Message"}</label>
                      <textarea rows={3} value={porMessage} onChange={(e) => setPorMessage(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none resize-none" placeholder="Interest, timeline, conditions..." />
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="gdpr-preview" required checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-1 accent-gold-leaf" />
                      <label htmlFor="gdpr-preview" className="text-[10px] text-on-surface-variant leading-relaxed">
{lang === "fr" ? "Je consens au traitement de mes données personnelles conformément aux " : "I consent to the processing of my personal data in accordance with "}<span className="text-gold-leaf font-semibold">{lang === "fr" ? "règlement RGPD" : "GDPR regulations"}</span>{lang === "fr" ? ". *" : ". *"}
                      </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-ebony-deep/5">
                      <button type="button" onClick={resetPOR} className="border border-ebony-deep/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent">{lang === "fr" ? "Annuler" : "Cancel"}</button>
                      <button type="submit" disabled={!porFirstName || !porLastName || !porEmail || !gdprConsent} className="bg-ebony-deep text-parchment-ivory px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0">
                        {lang === "fr" ? "Soumettre la Demande Prioritaire" : "Submit Priority Inquiry"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 48h Reservation Modal */}
      <AnimatePresence>
        {showReserveModal && selectedArtwork && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={resetReserve} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><X className="w-6 h-6" /></button>
              {reserveConfirmed ? (
                <div className="text-center">
                  <Clock className="w-14 h-14 text-gold-leaf mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">{lang === "fr" ? "Réservation de 48 Heures Active" : "48-Hour Reservation Active"}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    <strong>{selectedArtwork.title}</strong> {lang === "fr" ? "a été réservé à votre nom pour 48 heures. Un courriel de confirmation a été envoyé avec les détails de votre réservation." : "has been reserved in your name for 48 hours. A confirmation email has been sent with your reservation details."}
                  </p>
                  <div className="bg-surface-container-low border border-ebony-deep/5 p-6 mb-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">{lang === "fr" ? "Minuterie de Réservation" : "Reservation Timer"}</p>
                    <div className="font-mono text-2xl text-ebony-deep font-bold tracking-wider">48:00:00</div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <a href="/dashboard" className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors inline-block">{lang === "fr" ? "Tableau de Bord" : "Dashboard"}</a>
                    <a href="/acquisition" className="border border-gold-leaf text-gold-leaf px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf/10 transition-colors inline-block">{lang === "fr" ? "Acheter" : "Purchase"}</a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <Clock className="w-12 h-12 text-gold-leaf mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide">{lang === "fr" ? "Réserver pour 48 Heures" : "Reserve for 48 Hours"}</h3>
                    <p className="text-xs text-gold-leaf font-semibold mt-1">{lang === "fr" ? "Réservation VIP Immédiate" : "VIP Immediate Reservation"}</p>
                  </div>
                  <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-6 text-xs space-y-2">
                    <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Œuvre" : "Artwork"}</span><span className="font-medium">{selectedArtwork.title}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Origine" : "Origin"}</span><span className="font-medium">{selectedArtwork.origin}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Réservation" : "Reservation"}</span><span className="font-medium text-gold-leaf font-semibold">{lang === "fr" ? "48 Heures" : "48 Hours"}</span></div>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {lang === "fr" ? "En tant que membre VIP, vous avez une priorité de réservation immédiate de 48 heures. L'œuvre sera bloquée de la vente publique pendant cette période." : "As a VIP member, you have immediate 48-hour reservation priority. The artwork will be locked from public sale during this period."}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={resetReserve} className="flex-1 border border-ebony-deep/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent">{lang === "fr" ? "Annuler" : "Cancel"}</button>
                    <button
                      onClick={() => { setReserveLoading(true); setTimeout(() => { setReserveLoading(false); setReserveConfirmed(true); }, 1500); }}
                      disabled={reserveLoading}
                      className="flex-1 bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0 flex items-center justify-center gap-2"
                    >
                      {reserveLoading ? (lang === "fr" ? "Réservation en cours..." : "Reserving...") : (lang === "fr" ? "Confirmer la Réservation" : "Confirm Reservation")}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
