"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  BookOpen,
  Award,
  SlidersHorizontal,
  HelpCircle,
  Send,
  CornerDownRight,
  ArrowRight,
  X,
  Sparkles,
  Clock,
  Briefcase,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useArtworks } from "@/lib/hooks";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtwork, useTranslatedArtworks } from "@/lib/useTranslatedArtwork";
import { useAuth } from "@/lib/auth";
import type { Artwork } from "@/lib/types";

interface ChatMessage {
  sender: "user" | "curator";
  text: string;
}

export default function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { artworks: apiArtworks, loading } = useArtworks();
  const artworksList = apiArtworks as unknown as Artwork[];
  const rawArtwork = artworksList.find((a) => a.id === id) || artworksList[0];
  const artwork = useTranslatedArtwork(rawArtwork || artworksList[0]);
  const allArtworks = useTranslatedArtworks(artworksList);
  const { lang, t } = useTranslate();

  const [showExhibitionRooms, setShowExhibitionRooms] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveConfirmed, setReserveConfirmed] = useState(false);
  const [inquiryFirstName, setInquiryFirstName] = useState("");
  const [inquiryLastName, setInquiryLastName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [clientStatus, setClientStatus] = useState("Private Collector");
  const [budgetRange, setBudgetRange] = useState("€1M – €5M");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<string | null>(null);
  const [curatorQuestion, setCuratorQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [curatorLoading, setCuratorLoading] = useState(false);

  if (loading || !rawArtwork) {
    return (
      <div className="min-h-screen bg-parchment-ivory">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-32">
            <div className="inline-block w-10 h-10 border-2 border-gold-leaf border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-sans text-sm text-on-surface-variant">Loading artwork...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPor = typeof artwork.label === "string";

  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

  const handleAcquisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryFirstName || !inquiryLastName || !inquiryEmail || !gdprConsent) {
      alert("Please fill in all required fields and accept the privacy policy.");
      return;
    }
    setSubmittingInquiry(true);
    setTimeout(() => {
      setInquiryResult(`Dear ${inquiryFirstName} ${inquiryLastName},\n\nYour application regarding the potential allocation of "${artwork.title}" has been securely logged with our advisory council in London.\n\nOur representatives will verify your credentials and dispatch the hardcopy Authentication Dossier to the primary advisor email: ${inquiryEmail}.\n\nWarm regards,\nPrivate Placement Desk, Aduna Gallery`);
      setSubmittingInquiry(false);
    }, 1500);
  };

  const askCurator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!curatorQuestion.trim()) return;
    const userMsg = curatorQuestion;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setCuratorQuestion("");
    setCuratorLoading(true);

    setTimeout(() => {
      const responses = [
        `The ${artwork.title} represents a pinnacle of ${artwork.tribe} artistic mastery. Scientific trace analysis, including X-ray fluorescence testing, confirms the alloy composition aligns perfectly with the material fingerprints of the known ${artwork.period} corpus.`,
        `Based on extensive archival research, this piece demonstrates the characteristic stylistic elements of ${artwork.tribe} craftsmanship from ${artwork.origin}. The provenance chain has been verified through multiple independent authentication channels.`,
        `The ${artwork.material.toLowerCase()} composition shows expected environmental patination consistent with ${artwork.period} dating. Thermoluminescence testing confirms the firing/creation period within acceptable variance margins.`,
        `Historical documentation places this work within the royal artistic tradition of ${artwork.origin}. The ${artwork.material.toLowerCase()} medium and dimensional proportions (${artwork.dimensions}) are consistent with ceremonial objects of high status.`,
      ];
      const randomText = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory((prev) => [...prev, { sender: "curator", text: randomText }]);
      setCuratorLoading(false);
    }, 1800);
  };

  const handleQuickQuestion = (qn: string) => {
    setCuratorQuestion(qn);
  };

  const accentColors: Record<string, string> = {
    "fang-guardian": "border-l-4 border-[#B35C44]",
    "ife-terracotta": "border-l-4 border-[#79301b]",
    "benin-plaque": "border-l-4 border-[#C5A059]",
    "ade-crown": "border-l-4 border-[#2A2A2A]",
  };

  const formatPrice = (label: Artwork["label"]) => {
    if (typeof label === "number") return `€${label.toLocaleString()}`;
    return String(label);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-16 py-10 md:py-16">
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-on-surface-variant hover:text-ebony-deep transition-colors mb-8 text-xs font-semibold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour à la Collection" : "Back to Collection"}
        </button>

        {/* Exhibition Rooms — Collapsible Rollup */}
        <div className="mb-12 border-b border-ebony-deep/10 pb-6">
          <button
            onClick={() => setShowExhibitionRooms(!showExhibitionRooms)}
            className="flex items-center justify-between w-full text-left group"
          >
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-leaf font-sans">{lang === "fr" ? "Salles d'Exposition Actuelles" : "Current Exhibition Rooms"}</h3>
              <p className="text-sm font-sans text-on-surface-variant mt-0.5">{lang === "fr" ? "Parcourez d'autres artefacts de la collection" : "Browse other artifacts in the collection"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-sans text-on-surface-variant uppercase tracking-wider">
                {showExhibitionRooms ? (lang === "fr" ? "Masquer" : "Hide") : (lang === "fr" ? "Voir" : "View")} {lang === "fr" ? "la Collection" : "Collection"}
              </span>
              <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${showExhibitionRooms ? "rotate-180" : ""}`} />
            </div>
          </button>

          <AnimatePresence>
            {showExhibitionRooms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                  {allArtworks.map((m) => {
                    const isActive = m.id === artwork.id;
                    return (
                      <Link
                        key={m.id}
                        href={`/artwork/${m.id}`}
                        className={`group uppercase text-left border p-2.5 flex items-start space-x-2.5 transition-all duration-300 ${
                          isActive ? "bg-ebony-deep border-ebony-deep text-parchment-ivory" : "bg-surface-container-low border-ebony-deep/5 text-ebony-deep hover:bg-surface-container-high"
                        }`}
                      >
                        <div className="w-10 h-10 bg-gray-200 overflow-hidden shrink-0 border border-ebony-deep/5 relative">
                          {m.imageUrl ? <img src={m.imageUrl} alt={m.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full bg-surface-container-high" />}
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <p className={`text-[9px] tracking-widest font-bold ${isActive ? "text-gold-leaf" : "text-on-surface-variant"}`}>{m.period}</p>
                          <h4 className="text-[10px] font-bold line-clamp-2 leading-tight tracking-tight pt-0.5 font-sans">{m.title}</h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ARTWORK DETAIL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-stretch">
          {/* Media Block (Left) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="relative w-full aspect-[4/5] sm:aspect-square bg-surface-container-high overflow-hidden border border-ebony-deep/5 group">
                {artwork.imageUrl ? <img src={artwork.imageUrl} alt={artwork.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" /> : <div className="w-full h-full bg-surface-container-high" />}
                <div className="absolute top-4 left-4 bg-ebony-deep/80 backdrop-blur-md px-3 py-1 border border-gold-leaf/20">
                  <p className="text-[10px] text-gold-leaf tracking-widest uppercase font-semibold">{lang === "fr" ? "ACTIF SÉCURISÉ AUTHENTIFIÉ" : "AUTHENTICATED SECURED ASSET"}</p>
                </div>
                <div className="absolute bottom-6 right-6 flex space-x-3.5">
                  <button onClick={() => alert("Initializing immersive 360-degree holographic digital scan... [Connected]")} className="w-11 h-11 bg-white/95 backdrop-blur flex items-center justify-center hover:bg-gold-leaf hover:text-white transition-all shadow-md" title="Interact 360°">
                    <span className="text-[12px] font-bold tracking-tighter uppercase font-mono">360°</span>
                  </button>
                  <button onClick={() => alert("Opening augmented reality (AR) canvas...")} className="w-11 h-11 bg-white/95 backdrop-blur flex items-center justify-center hover:bg-gold-leaf hover:text-white transition-all shadow-md" title="View in AR">
                    <span className="text-[12px] font-bold tracking-tighter uppercase font-mono">AR</span>
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-on-surface-variant px-1">
                <span className="flex items-center space-x-1"><ShieldCheck className="w-3.5 h-3.5 text-gold-leaf" /><span>TL age-dating and alloy fingerpointed</span></span>
                <span>Dossier Class A-17 Protection</span>
              </div>
            </div>

            {/* Provenance Section */}
            <div className={`mt-8 bg-surface p-6 lg:p-8 border-t-2 border-gold-leaf ${accentColors[artwork.id] || "border-l-4 border-[#B35C44]"}`}>
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-terracotta-earth" />
                <h3 className="font-serif text-[20px] font-bold text-ebony-deep">{lang === "fr" ? "Traçabilité de Provenance et d'Authenticité" : "Provenance & Authenticity Trace"}</h3>
              </div>
              <div className="space-y-3 font-sans text-xs text-charcoal-text leading-relaxed">
                {(artwork.provenance ?? []).map((provLine, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CornerDownRight className="w-3.5 h-3.5 text-terracotta-earth shrink-0 mt-0.5" />
                    <span>{provLine}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-ebony-deep/10 flex flex-wrap justify-between items-center gap-3">
                <button onClick={() => setShowDossierModal(true)} className="group inline-flex items-center font-sans text-xs font-semibold text-ebony-deep uppercase tracking-wider hover:text-gold-leaf transition-colors">
                  <span className="border-b border-gold-leaf pb-0.5">{lang === "fr" ? "Demander le Dossier de Provenance" : "Request Provenance Dossier"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[10px] uppercase tracking-wider font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5">COA REG: #AD-OB-{artwork.id.substring(0, 4).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Curatorial and Technical Specs (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-4 lg:pt-0">
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-surface-container-high text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-sans">{artwork.material}</span>
                <span className="text-gold-leaf">•</span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-gold-leaf">{lang === "fr" ? "Grade Investissement" : "Investment Grade"}</span>
              </div>

              <h1 className="font-serif text-[32px] md:text-[38px] lg:text-[44px] text-ebony-deep leading-tight font-medium tracking-tight">{artwork.title}</h1>

              <div className="border-y border-ebony-deep/10 py-5 my-5 space-y-3.5 font-sans text-[13px] text-charcoal-text">
                <div className="flex justify-between border-b border-ebony-deep/5 pb-1.5 font-medium">
                  <span className="text-on-surface-variant font-normal">{lang === "fr" ? "Origine / Culture" : "Origin / Culture"}</span>
                  <span className="text-right">{artwork.origin} ({artwork.tribe})</span>
                </div>
                <div className="flex justify-between border-b border-ebony-deep/5 pb-1.5 font-medium">
                  <span className="text-on-surface-variant font-normal">{lang === "fr" ? "Période Estimée" : "Estimated Period"}</span>
                  <span className="text-right">{artwork.period}</span>
                </div>
                <div className="flex justify-between border-b border-ebony-deep/5 pb-1.5 font-medium">
                  <span className="text-on-surface-variant font-normal">{lang === "fr" ? "Support Artistique" : "Artistic Medium"}</span>
                  <span className="text-right">{artwork.material}</span>
                </div>
                <div className="flex justify-between pb-0.5 font-medium">
                  <span className="text-on-surface-variant font-normal">{lang === "fr" ? "Dimensions d'Exposition" : "Exhibition Dimensions"}</span>
                  <span className="text-right">{artwork.dimensions}</span>
                </div>
              </div>

              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{artwork.historicalStory}</p>

              {/* Pricing / Action Block */}
              {isPor ? (
                /* POR Section */
                <div className="bg-surface-container-high p-5 border border-ebony-deep/5 mt-6">
                  <p className="text-[10px] uppercase font-bold text-gold-leaf tracking-widest mb-1">{lang === "fr" ? "Offre Institutionnelle" : "Institutional Offering"}</p>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs text-on-surface-variant">{lang === "fr" ? "Classification des Prix" : "Pricing Classification"}</span>
                    <span className="font-serif text-lg font-bold text-ebony-deep">{lang === "fr" ? "Prix sur Demande" : "Price on Request"}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <button onClick={() => { setShowInquiryModal(true); setInquiryNotes(`Requesting acquisition terms and transport insurance parameters for ${artwork.title}.`); }} className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold py-4 px-6 uppercase tracking-wider hover:bg-gold-leaf transition-colors">
                      {lang === "fr" ? "Demander en Confiance" : "Inquire Confidentially"}
                    </button>
                    <a href={`/acquisition?artwork=${artwork.id}`} className="w-full border border-gold-leaf text-gold-leaf bg-transparent font-sans text-xs font-semibold py-4 px-6 uppercase tracking-wider hover:bg-gold-leaf/10 transition-colors text-center">
                      {lang === "fr" ? "Acquérir Maintenant" : "Acquire Now"}
                    </a>
                  </div>
                  <button onClick={() => setShowReserveModal(true)} className="w-full mt-3 border border-ebony-deep/20 text-ebony-deep bg-transparent font-sans text-xs font-semibold py-3 px-6 uppercase tracking-wider hover:border-gold-leaf hover:text-gold-leaf transition-colors">
                    {lang === "fr" ? "Réserver pour 48 Heures" : "Reserve for 48 Hours"}
                  </button>
                </div>
              ) : (
                /* Fixed Price Section */
                <div className="bg-surface-container-high p-5 border border-ebony-deep/5 mt-6">
                  <p className="text-[10px] uppercase font-bold text-gold-leaf tracking-widest mb-1">{lang === "fr" ? "Disponible pour Acquisition" : "Available for Acquisition"}</p>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs text-on-surface-variant">{lang === "fr" ? "Prix Demandé" : "Asking Price"}</span>
                    <span className="font-serif text-lg font-bold text-ebony-deep">{formatPrice(artwork.label)}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <Link
                      href={`/acquisition?artwork=${artwork.id}`}
                      className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold py-4 px-6 uppercase tracking-wider hover:bg-gold-leaf transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {lang === "fr" ? "Acheter Maintenant" : "Purchase Now"}
                    </Link>
                    <Link
                      href={isAuthenticated ? "#" : "/login"}
                      onClick={isAuthenticated ? (e) => { e.preventDefault(); setShowReserveModal(true); } : undefined}
                      className="w-full border border-gold-leaf text-gold-leaf bg-transparent font-sans text-xs font-semibold py-4 px-6 uppercase tracking-wider hover:bg-gold-leaf/10 transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3 h-3" />
                      {isAuthenticated
                        ? (lang === "fr" ? "Réserver pour 48 Heures" : "Reserve for 48 Hours")
                        : (lang === "fr" ? "Connexion pour Réserver" : "Login to Reserve")}
                    </Link>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/60 mt-3 font-sans">
                    {lang === "fr" ? "Réservation de 48 heures disponible pour les membres inscrits." : "48-hour reservation available for registered members."} <Link href="/register" className="text-gold-leaf hover:underline">{lang === "fr" ? "Créez un compte" : "Create an account"}</Link> {lang === "fr" ? "pour accéder aux fonctionnalités exclusives de réservation et d'acquisition." : "to access exclusive reservation and acquisition features."}
                  </p>
                </div>
              )}

              {/* Curator AI Chat */}
              <div className="mt-8 border border-ebony-deep/15 bg-surface p-[18px]">
                <div className="flex items-center space-x-2 text-ebony-deep border-b border-ebony-deep/10 pb-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gold-leaf flex items-center justify-center text-white text-xs font-serif font-bold">CV</div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-ebony-deep">{lang === "fr" ? "Consultez le Conservateur Vance (Support IA)" : "Consult Curator Vance (AI Support)"}</h4>
                    <p className="text-[10px] text-on-surface-variant font-sans">{lang === "fr" ? "Réponses en direct sur le contexte historique et scientifique" : "Grounding live answers on historical context & science"}</p>
                  </div>
                </div>
                <div className="space-y-3 h-48 overflow-y-auto mb-4 border border-ebony-deep/5 bg-surface-container-low/50 p-2.5">
                  {chatHistory.length === 0 ? (
                    <div className="text-center h-full flex flex-col items-center justify-center text-xs text-on-surface-variant p-4 font-sans">
                      <HelpCircle className="w-6 h-6 text-gold-leaf mb-1.5" />
                      <p className="font-bold">{lang === "fr" ? "Posez une question sur le symbolisme culturel ou la science" : "Ask about cultural symbolism or science"}</p>
                      <p className="text-[10px] mt-0.5">{lang === "fr" ? "Le conservateur répondra en utilisant les archives profondes." : "Curator will respond using deep archive records."}</p>
                    </div>
                  ) : (
                    chatHistory.map((m, i) => (
                      <div key={i} className={`flex flex-col text-xs leading-relaxed max-w-[90%] ${m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
                        <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mb-0.5">{m.sender === "user" ? (lang === "fr" ? "Client Conseiller" : "Advisor Client") : (lang === "fr" ? "Conservateur Principal Vance" : "Lead Curator Vance")}</span>
                        <div className={`p-2.5 ${m.sender === "user" ? "bg-ebony-deep text-parchment-ivory" : "bg-surface-container-high text-ebony-deep"}`}>
                          <p className="whitespace-pre-line">{m.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {curatorLoading && (
                    <div className="flex items-center space-x-1.5 text-xs text-on-surface-variant p-1.5 font-sans">
                      <div className="w-1.5 h-1.5 bg-gold-leaf animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gold-leaf animate-bounce [animation-delay:75ms]" />
                      <div className="w-1.5 h-1.5 bg-gold-leaf animate-bounce [animation-delay:150ms]" />
                      <span className="text-[10px] italic">{lang === "fr" ? "Consultation des archives..." : "Reviewing archive logs..."}</span>
                    </div>
                  )}
                </div>
                <div className="mb-3.5 flex flex-wrap gap-1.5">
                  <button onClick={() => handleQuickQuestion("What is the historical meaning and use of the markings?")} className="text-[10px] bg-surface-container-high hover:bg-surface-container-high/80 text-ebony-deep px-3 py-2 uppercase tracking-wide font-medium">{lang === "fr" ? "Signification des marques ?" : "Meaning of markings?"}</button>
                  <button onClick={() => handleQuickQuestion("How is the age of this piece scientifically verified?")} className="text-[10px] bg-surface-container-high hover:bg-surface-container-high/80 text-ebony-deep px-3 py-2 uppercase tracking-wide font-medium">{lang === "fr" ? "Détails scientifiques ?" : "Scientific age details?"}</button>
                  <button onClick={() => handleQuickQuestion("Can you detail the lost-wax casting technique?")} className="text-[10px] bg-surface-container-high hover:bg-surface-container-high/80 text-ebony-deep px-3 py-2 uppercase tracking-wide font-medium">{lang === "fr" ? "Technique de cire perdue ?" : "Lost-wax casting process?"}</button>
                </div>
                <form onSubmit={askCurator} className="flex space-x-2">
                  <input type="text" value={curatorQuestion} onChange={(e) => setCuratorQuestion(e.target.value)} placeholder={lang === "fr" ? "Demandez à Vance au sujet de cette œuvre..." : "Inquire Vance regarding this workpiece..."} className="flex-grow bg-surface-container-high text-xs px-3 py-2.5 border-b border-ebony-deep/20 focus:border-gold-leaf focus:outline-none placeholder-on-surface-variant font-sans" />
                  <button type="submit" disabled={curatorLoading || !curatorQuestion.trim()} className="bg-ebony-deep text-white p-3 hover:bg-gold-leaf transition-colors disabled:bg-surface-container-high"><Send className="w-4 h-4" /></button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Curatorial Insights Section */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] tracking-[0.25em] font-bold text-gold-leaf uppercase block mb-2 font-sans">{lang === "fr" ? "Ancrage Académique Approfondi" : "Deep Academic Grounding"}</span>
            <h2 className="font-serif text-[30px] md:text-[34px] lg:text-[38px] text-ebony-deep font-medium leading-tight">{lang === "fr" ? "Aperçus Curatoriaux et Dossier Scientifique" : "Curatorial Insights & Scientific Dossier"}</h2>
            <div className="w-12 h-[2px] bg-gold-leaf mx-auto mt-4" />
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.article variants={fadeUp} className="bg-surface-container-low p-5 md:p-8 h-full flex flex-col justify-between border-t border-ebony-deep/5">
              <div>
                <div className="w-12 h-12 bg-parchment-ivory flex items-center justify-center mb-6 border border-ebony-deep/5"><BookOpen className="w-5 h-5 text-gold-leaf" /></div>
                <h3 className="font-serif text-[22px] font-bold text-ebony-deep mb-4">{lang === "fr" ? "Récit Historique" : "Historical Narrative"}</h3>
                <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed">{artwork.historicalStory}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-ebony-deep/10"><span className="text-[10px] uppercase font-bold tracking-widest text-gold-leaf">MUSEUM COORDINATE ARCHIVE</span></div>
            </motion.article>
            <motion.article variants={fadeUp} className="bg-surface-container-low p-5 md:p-8 h-full flex flex-col justify-between border-t border-ebony-deep/5">
              <div>
                <div className="w-12 h-12 bg-parchment-ivory flex items-center justify-center mb-6 border border-ebony-deep/5"><SlidersHorizontal className="w-5 h-5 text-gold-leaf" /></div>
                <h3 className="font-serif text-[22px] font-bold text-ebony-deep mb-4">{lang === "fr" ? "La Main de l'Artiste" : "The Artist's Hand"}</h3>
                <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed">{artwork.investmentThesis}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-ebony-deep/10"><span className="text-[10px] uppercase font-bold tracking-widest text-gold-leaf">METALLURGICAL CRAFT MASTERPOINT</span></div>
            </motion.article>
            <motion.article variants={fadeUp} className="bg-surface-container-low p-5 md:p-8 h-full flex flex-col justify-between border-t border-ebony-deep/5">
              <div>
                <div className="w-12 h-12 bg-parchment-ivory flex items-center justify-center mb-6 border border-ebony-deep/5"><Award className="w-5 h-5 text-gold-leaf" /></div>
                <h3 className="font-serif text-[22px] font-bold text-ebony-deep mb-4">{lang === "fr" ? "Analyse Scientifique" : "Scientific Analysis"}</h3>
                <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed">Recent X-ray fluorescence (XRF) testing confirms the alloy composition aligns perfectly with the material fingerprints of the known {artwork.period} corpus. The patina analysis shows expected gradual environmental interaction over centuries, authenticating its age, stability, and integrity.</p>
              </div>
              <div className="mt-8 pt-4 border-t border-ebony-deep/10"><span className="text-[10px] uppercase font-bold tracking-widest text-gold-leaf">TL DATING &amp; XRF COPPER INDEXED</span></div>
            </motion.article>
          </motion.div>
        </section>
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-ebony-deep text-parchment-ivory py-3 px-6 z-40 border-t border-gold-leaf/20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <Lock className="w-4 h-4 text-gold-leaf" />
            <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">{artwork.title}</span>
            <span className="text-gold-leaf">•</span>
            <span className="font-sans text-xs text-parchment-ivory/60">{isPor ? (lang === "fr" ? "Prix sur Demande" : "Price on Request") : formatPrice(artwork.label)}</span>
          </div>
          {isPor ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setShowInquiryModal(true); setInquiryNotes(`Requesting acquisition terms for ${artwork.title}.`); }} className="bg-gold-leaf text-ebony-deep font-sans text-[10px] font-bold uppercase tracking-widest px-6 py-2 hover:opacity-90 transition-opacity hidden sm:block">
                {lang === "fr" ? "Demander" : "Inquire Now"}
              </button>
              <a href={`/acquisition?artwork=${artwork.id}`} className="bg-ebony-deep text-parchment-ivory font-sans text-[10px] font-bold uppercase tracking-widest px-6 py-2 hover:bg-gold-leaf hover:text-ebony-deep transition-colors border border-gold-leaf">
                {lang === "fr" ? "Acquérir" : "Acquire"}
              </a>
            </div>
          ) : (
            <Link href="/login" className="bg-gold-leaf text-ebony-deep font-sans text-[10px] font-bold uppercase tracking-widest px-6 py-2 hover:opacity-90 transition-opacity flex items-center gap-2">
              <Lock className="w-3 h-3" /> {lang === "fr" ? "Connexion pour Acheter" : "Login to Purchase"}
            </Link>
          )}
        </div>
      </div>

      {/* Inquiry Modal (POR only) */}
      {isPor && (
        <AnimatePresence>
          {showInquiryModal && (
            <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory border border-gold-leaf max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
                <button onClick={() => { setShowInquiryModal(false); setInquiryResult(null); }} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep"><X className="w-6 h-6" /></button>
                {inquiryResult ? (
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 text-gold-leaf mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide text-ebony-deep mb-3">{lang === "fr" ? "Demande Soumise avec Succès" : "Inquiry Submitted Successfully"}</h3>
                    <pre className="text-xs text-on-surface-variant whitespace-pre-wrap text-left bg-surface-container-low p-4 border border-ebony-deep/5 mb-6">{inquiryResult}</pre>
                    <button onClick={() => { setShowInquiryModal(false); setInquiryResult(null); }} className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3 hover:opacity-90 transition-opacity">{lang === "fr" ? "Fermer" : "Close"}</button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <Sparkles className="w-10 h-10 text-gold-leaf mx-auto mb-3" />
                      <h3 className="font-serif text-xl font-medium uppercase tracking-wide text-ebony-deep">{lang === "fr" ? "Demande d'Acquisition Confidentielle" : "Confidential Acquisition Inquiry"}</h3>
                      <p className="text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Pour :" : "For:"} {artwork.title}</p>
                    </div>
                    <form onSubmit={handleAcquisitionSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Prénom" : "First Name"} *</label>
                          <input type="text" required value={inquiryFirstName} onChange={(e) => setInquiryFirstName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="Julian" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Nom" : "Last Name"} *</label>
                          <input type="text" required value={inquiryLastName} onChange={(e) => setInquiryLastName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Email Professionnel" : "Professional Email"} *</label>
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
                          <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">{lang === "fr" ? "Profil" : "Profile"} *</label>
                          <select value={clientStatus} onChange={(e) => setClientStatus(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none">
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
                          <textarea rows={3} value={inquiryNotes} onChange={(e) => setInquiryNotes(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-xs focus:border-gold-leaf focus:outline-none" placeholder={lang === "fr" ? "Intérêt, calendrier, conditions particulières..." : "Interest, timeline, special conditions..."} />
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="gdpr-consent-detail" required checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-1 accent-gold-leaf" />
                        <label htmlFor="gdpr-consent-detail" className="text-[10px] text-on-surface-variant leading-relaxed">
                          {lang === "fr" ? "Je consens au traitement de mes données personnelles conformément à la" : "I consent to the processing of my personal data in accordance with the"} <span className="text-gold-leaf font-semibold">{lang === "fr" ? "Politique de Confidentialité" : "Privacy Policy"}</span> {lang === "fr" ? "et aux" : "and"} <span className="text-gold-leaf font-semibold">{lang === "fr" ? "règlements RGPD" : "GDPR regulations"}</span>. *
                        </label>
                      </div>
                      <div className="flex justify-end gap-4 pt-4 border-t border-ebony-deep/5">
                        <button type="button" onClick={() => { setShowInquiryModal(false); setInquiryResult(null); }} className="border border-ebony-deep/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep">{lang === "fr" ? "Annuler" : "Cancel"}</button>
                        <button type="submit" disabled={submittingInquiry || !gdprConsent} className="bg-ebony-deep text-parchment-ivory px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                          {submittingInquiry ? (<><Clock className="w-3.5 h-3.5 animate-spin" /> {lang === "fr" ? "Envoi en cours..." : "Submitting..."}</>) : (lang === "fr" ? "Soumettre la Demande" : "Submit Inquiry")}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}

      {/* Dossier Modal */}
      <AnimatePresence>
        {showDossierModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory border border-gold-leaf max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={() => setShowDossierModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep"><X className="w-6 h-6" /></button>
              <div className="text-center mb-6">
                <Briefcase className="w-12 h-12 text-gold-leaf mx-auto mb-3" />
                <h3 className="font-serif text-xl font-medium uppercase tracking-wide text-ebony-deep">{lang === "fr" ? "Demande de Dossier de Provenance" : "Provenance Dossier Request"}</h3>
              </div>
                <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-6 text-xs space-y-2">
                <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Œuvre" : "Artwork"}</span><span className="font-medium">{artwork.title}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Origine" : "Origin"}</span><span className="font-medium">{artwork.origin}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Période" : "Period"}</span><span className="font-medium">{artwork.period}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Support" : "Medium"}</span><span className="font-medium">{artwork.material}</span></div>
                <div className="flex justify-between pt-2 border-t border-ebony-deep/5"><span className="text-on-surface-variant">{lang === "fr" ? "État du Dossier" : "Dossier Status"}</span><span className="text-gold-leaf font-semibold">{lang === "fr" ? "Disponible sur Demande" : "Available Upon Request"}</span></div>
              </div>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">{lang === "fr" ? "Le dossier de provenance complet, comprenant la documentation historique, les certificats d'authentification et les rapports d'analyse scientifique, sera préparé par notre équipe curatoriale et envoyé à l'adresse email de votre conseiller enregistré dans les 48 heures." : "The complete provenance dossier including historical documentation, authentication certificates, and scientific analysis reports will be prepared by our curatorial team and dispatched to your registered advisor email within 48 hours."}</p>
              <button onClick={() => { alert("Provenance dossier request logged. Our team will prepare and dispatch the complete documentation within 48 hours."); setShowDossierModal(false); }} className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-bold uppercase tracking-widest py-3.5 hover:opacity-90 transition-opacity">{lang === "fr" ? "Demander la Préparation du Dossier" : "Request Dossier Preparation"}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 48h Reservation Modal */}
      <AnimatePresence>
        {showReserveModal && (
            <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory border border-gold-leaf max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
                <button onClick={() => { setShowReserveModal(false); setReserveConfirmed(false); }} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep"><X className="w-6 h-6" /></button>
                {reserveConfirmed ? (
                  <div className="text-center">
                    <Clock className="w-14 h-14 text-gold-leaf mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">{lang === "fr" ? "Réservation de 48 Heures Active" : "48-Hour Reservation Active"}</h3>
                    <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                      <strong>{artwork.title}</strong> {lang === "fr" ? "a été réservé à votre nom pour les prochaines 48 heures." : "has been reserved in your name for the next 48 hours."}
                      {lang === "fr" ? "Un email de confirmation a été envoyé avec les détails de votre réservation et les informations du minuteur." : "A confirmation email has been sent with your reservation details and timer information."}
                    </p>
                    <div className="bg-surface-container-low border border-ebony-deep/5 p-6 mb-6">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">{lang === "fr" ? "Minuteur de Réservation" : "Reservation Timer"}</p>
                      <div className="font-mono text-2xl text-ebony-deep font-bold tracking-wider">48:00:00</div>
                      <p className="text-[10px] text-on-surface-variant/60 mt-2">{lang === "fr" ? "Expire automatiquement. Vous recevrez des emails de rappel à 24h et 1h avant l'expiration." : "Expires automatically. You will receive reminder emails at 24h and 1h before expiry."}</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <a href="/dashboard" className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors inline-block">
                        {lang === "fr" ? "Aller au Tableau de Bord" : "Go to Dashboard"}
                      </a>
                      <a href={`/acquisition?artwork=${artwork.id}`} className="border border-gold-leaf text-gold-leaf px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf/10 transition-colors inline-block">
                        {lang === "fr" ? "Procéder à l'Achat" : "Proceed to Purchase"}
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <Clock className="w-12 h-12 text-gold-leaf mx-auto mb-3" />
                      <h3 className="font-serif text-xl font-medium uppercase tracking-wide text-ebony-deep">{lang === "fr" ? "Réserver pour 48 Heures" : "Reserve for 48 Hours"}</h3>
                      <p className="text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Réservez cette œuvre avant sa vente" : "Hold this artwork before it sells"}</p>
                    </div>
                    <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-6 text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Œuvre" : "Artwork"}</span><span className="font-medium">{artwork.title}</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Origine" : "Origin"}</span><span className="font-medium">{artwork.origin}</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Période" : "Period"}</span><span className="font-medium">{artwork.period}</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Période de Réservation" : "Reservation Period"}</span><span className="font-medium text-gold-leaf font-semibold">48 {lang === "fr" ? "Heures" : "Hours"}</span></div>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                      {lang === "fr" ? "En confirmant, vous acceptez de réserver cette œuvre exclusivement pendant 48 heures. Pendant cette période, l'œuvre sera verrouillée de la vente publique. Vous recevrez des notifications par email à 24 heures et 1 heure avant l'expiration." : "By confirming, you agree to hold this artwork exclusively for 48 hours. During this period, the artwork will be locked from public sale. You will receive email notifications at 24 hours and 1 hour before expiry."}
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => { setShowReserveModal(false); }} className="flex-1 border border-ebony-deep/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent">
                        {lang === "fr" ? "Annuler" : "Cancel"}
                      </button>
                      <button
                        onClick={() => {
                          setReserveLoading(true);
                          setTimeout(() => {
                            setReserveLoading(false);
                            setReserveConfirmed(true);
                          }, 1500);
                        }}
                        disabled={reserveLoading}
                        className="flex-1 bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0 flex items-center justify-center gap-2"
                      >
                        {reserveLoading ? (<><Clock className="w-3.5 h-3.5 animate-spin" /> {lang === "fr" ? "Réservation en cours..." : "Reserving..."}</>) : (lang === "fr" ? "Confirmer la Réservation" : "Confirm Reservation")}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      <div className="pb-16" />
      <Footer />
    </>
  );
}
