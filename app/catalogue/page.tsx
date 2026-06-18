"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  X,
  ChevronDown,
  MessageSquare,
  Compass,
  Loader2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useArtworks } from "@/lib/hooks";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtworks } from "@/lib/useTranslatedArtwork";
import type { Artwork, AdvisorMessage } from "@/lib/types";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function CataloguePage() {
  const { artworks: apiArtworks, loading } = useArtworks({ artworkStatus: "Live" });
  const artifacts = apiArtworks as unknown as Artwork[];
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedTribe, setSelectedTribe] = useState("All Tribes");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Historical Significance");
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const { lang, t } = useTranslate();
  const SUGGESTED_PROMPTS = [
    { label: lang === "fr" ? "Standards de provenance ?" : "Provenance standards?", text: lang === "fr" ? "Quels sont les standards de provenance d'Aduna Gallery ?" : "What are Aduna Gallery's Provenance standards?" },
    { label: lang === "fr" ? "Parlez-moi de la tête d'Ife" : "Tell me about Ife head", text: lang === "fr" ? "Expliquez l'historique de la Tête en Terre Cuite d'Ife." : "Explain the historical background of the Ife Terracotta Head." },
    { label: lang === "fr" ? "Pourquoi investir dans le Bronze du Bénin ?" : "Why invest in Benin Bronze?", text: lang === "fr" ? "Pourquoi la Plaque en Relief du Bronze du Bénin est-elle considérée comme une antiquité de grade investissement performante ?" : "Why is the Benin Bronze Relief Plaque considered a pristine, high-performing investment grade antiquity?" },
  ];
  const [chatMessages, setChatMessages] = useState<AdvisorMessage[]>([
    {
      id: "welcome",
      sender: "advisor",
      text: lang === "fr" ? "Bonjour. Je suis votre conseiller en art Aduna. Comment puis-je orienter votre investissement aujourd'hui ?" : "Greetings. I am your Aduna Art Advisor. How may I direct your investment today?",
      timestamp: "",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextMsgId = useRef(0);

  useEffect(() => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === "welcome" && !msg.timestamp
          ? { ...msg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : msg
      )
    );
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiLoading]);

  const filteredArtifacts = useMemo(() => {
    let result = [...artifacts];

    if (selectedRegion !== "All Regions") {
      result = result.filter((item) => item.region.includes(selectedRegion.replace(" Regions", "")));
    }
    if (selectedTribe !== "All Tribes") {
      result = result.filter((item) => item.tribe.toLowerCase() === selectedTribe.toLowerCase());
    }
    if (selectedMaterial !== "All") {
      result = result.filter((item) => item.material.toLowerCase() === selectedMaterial.toLowerCase());
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.tribe.toLowerCase().includes(query) ||
          item.origin.toLowerCase().includes(query)
      );
    }

    if (sortBy === "Investment Value") {
      result.sort((a, b) => (b.scarcityIndex || 0) - (a.scarcityIndex || 0));
    }

    return result;
  }, [selectedRegion, selectedTribe, selectedMaterial, searchQuery, artifacts, sortBy]);

  const displayArtifacts = useTranslatedArtworks(filteredArtifacts);

  const hasActiveFilters = selectedRegion !== "All Regions" || selectedTribe !== "All Tribes" || selectedMaterial !== "All" || searchQuery;

  const clearFilters = () => {
    setSelectedRegion("All Regions");
    setSelectedTribe("All Tribes");
    setSelectedMaterial("All");
    setSearchQuery("");
  };

  const handleSendMessage = (customPrompt?: string) => {
    const textToSubmit = customPrompt || userInput;
    if (!textToSubmit.trim() || isAiLoading) return;

    nextMsgId.current += 1;
    const userMsg: AdvisorMessage = {
      id: `msg-${nextMsgId.current}-user`,
      sender: "user",
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);
    if (!customPrompt) setUserInput("");

    setTimeout(() => {
      setIsAiLoading(false);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "advisor",
          text: "Thank you for your inquiry. Our curatorial team will provide detailed analysis through our secure advisory channels. For immediate assistance, please schedule a private consultation.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 2000);
  };

  const getFormatPrice = (label: Artwork["label"]) => {
    if (typeof label === "number") return `€${label.toLocaleString()}`;
    return String(label);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-10 md:py-16">
          <motion.header
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl">
              <h1 className="font-display-lg text-ebony-deep mb-4">{lang === "fr" ? "La Collection" : "The Collection"}</h1>
              <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
                {lang === "fr"
                  ? "Une sélection curatée d' artefacts de qualité musée, représentant l'apogée du patrimoine africain et des antiquités de grade investissement."
                  : "A curated selection of museum-grade artifacts, representing the pinnacle of African heritage and investment-grade antiquities."}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto relative border-b border-on-surface/20 pb-2 group focus-within:border-gold-leaf transition-colors">
              <span className="font-sans text-xs uppercase tracking-widest font-semibold text-on-surface-variant/60">{lang === "fr" ? "Trier par :" : "Sort by:"}</span>
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border-none font-sans text-xs font-semibold text-ebony-deep focus:ring-0 cursor-pointer pr-6 outline-none"
                >
                  <option value="Historical Significance">{lang === "fr" ? "Importance Historique" : "Historical Significance"}</option>
                  <option value="Recently Acquired">{lang === "fr" ? "Récemment Acquis" : "Recently Acquired"}</option>
                  <option value="Investment Value">{lang === "fr" ? "Valeur d'Investissement (Indice de Rareté)" : "Investment Value (Scarcity Index)"}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-0 pointer-events-none text-on-surface-variant" />
              </div>
            </div>
          </motion.header>

          {/* Filters — Compact Dropdowns */}
          <section className="mb-10 pb-6 border-b border-on-surface/5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="relative">
                <label className="label-caps text-on-surface-variant/60 mb-1.5 block">{lang === "fr" ? "Région" : "Region"}</label>
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none bg-surface-container-low border border-on-surface/10 pl-3 pr-8 py-2 font-sans text-xs font-semibold text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer"
                  >
                    <option>All Regions</option>
                    <option>West Africa</option>
                    <option>Central Africa</option>
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                </div>
              </div>

              <div className="relative">
                <label className="label-caps text-on-surface-variant/60 mb-1.5 block">{lang === "fr" ? "Tribu" : "Tribe"}</label>
                <div className="relative">
                  <select
                    value={selectedTribe}
                    onChange={(e) => setSelectedTribe(e.target.value)}
                    className="appearance-none bg-surface-container-low border border-on-surface/10 pl-3 pr-8 py-2 font-sans text-xs font-semibold text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer min-w-[120px]"
                  >
                    <option>All Tribes</option>
                    <option>Yoruba</option>
                    <option>Fang</option>
                    <option>Benin</option>
                    <option>Nok</option>
                    <option>Akan</option>
                    <option>Kuba</option>
                    <option>Dogon</option>
                    <option>Luba</option>
                    <option>Chokwe</option>
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                </div>
              </div>

              <div className="relative">
                <label className="label-caps text-on-surface-variant/60 mb-1.5 block">{lang === "fr" ? "Matériau" : "Material"}</label>
                <div className="relative">
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="appearance-none bg-surface-container-low border border-on-surface/10 pl-3 pr-8 py-2 font-sans text-xs font-semibold text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer"
                  >
                    <option>All</option>
                    <option>Bronze</option>
                    <option>Wood</option>
                    <option>Terracotta</option>
                    <option>Gold</option>
                    <option>Glass</option>
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="font-sans text-[10px] uppercase tracking-wider font-semibold text-terracotta-earth hover:text-ebony-deep transition-colors border-b border-terracotta-earth/30 hover:border-ebony-deep/30 pb-0.5 ml-2"
                >
                  {lang === "fr" ? "Tout Effacer" : "Clear All"}
                </button>
              )}
            </div>
          </section>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-xs text-on-surface-variant">
              <span className="font-bold text-ebony-deep">{filteredArtifacts.length}</span> {lang === "fr" ? (filteredArtifacts.length === 1 ? "artefact trouvé" : "artefacts trouvés") : (filteredArtifacts.length === 1 ? "artifact" : "artifacts")} {lang === "fr" ? "trouvé" : "found"}
            </p>
          </div>

          {/* Empty State */}
          {filteredArtifacts.length === 0 && (
            <div className="py-24 text-center border border-dashed border-on-surface/20 bg-surface-container-lowest">
              <Compass className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-4 stroke-[1.25]" />
              <h3 className="font-serif text-xl text-ebony-deep font-medium mb-1">{lang === "fr" ? "Aucun Artefact Correspondant" : "No Artifact Matches"}</h3>
              <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto mb-6">
                {lang === "fr"
                  ? "Nos registres curatoriaux ne répertorient pas de pièces correspondant à vos critères de filtrage spécifiques."
                  : "Our curatorial logs do not list pieces matching your specific filter criteria."}
              </p>
              <button
                onClick={clearFilters}
                className="font-sans text-xs uppercase tracking-wider font-semibold text-ebony-deep border-b border-gold-leaf pb-0.5 hover:text-gold-leaf transition-colors"
              >
                {lang === "fr" ? "Réinitialiser les Filtres" : "Reset Curatorial Filters"}
              </button>
            </div>
          )}

          {/* Artwork Grid */}
          {displayArtifacts.length > 0 && (
            <motion.section
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {displayArtifacts.map((item, idx) => (
                <motion.article key={item.id} variants={fadeUp}>
                  <Link href={`/artwork/${item.id}`} className="group block">
                    <div className={`relative overflow-hidden mb-5 bg-surface-container-lowest shadow-level-2 hover-lift ${
                      idx === 0 ? "aspect-[4/3] md:col-span-2 lg:col-span-1" : "aspect-[3/4]"
                    }`}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-parchment-ivory/90 backdrop-blur-sm px-3.5 py-1.5 font-sans text-[10px] tracking-wider uppercase font-semibold text-ebony-deep border border-on-surface/10">
                        {getFormatPrice(item.label)}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-ebony-deep/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[10px] text-parchment-ivory uppercase tracking-widest font-bold">{lang === "fr" ? "Voir les Détails" : "View Details"}</span>
                        <ArrowRight className="w-4 h-4 text-gold-leaf" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h2 className="font-serif text-xl text-ebony-deep font-medium mb-1 group-hover:text-gold-leaf transition-colors">
                        {item.title}
                      </h2>
                      <p className="font-sans text-sm text-on-surface-variant mb-1">
                        {item.origin}, {item.region}
                      </p>
                      <p className="label-caps text-gold-leaf">{item.period}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.section>
          )}
        </div>
      </main>

      {/* Consultation CTA Banner */}
      <section className="bg-ebony-deep py-10 md:py-14 border-t border-gold-leaf/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Calendar size={24} className="text-gold-leaf shrink-0" />
            <div>
              <h3 className="font-serif text-lg text-parchment-ivory">{lang === "fr" ? "Besoin d'Aide pour Trouver la Pièce Idéale ?" : "Need Help Finding the Right Piece?"}</h3>
              <p className="font-sans text-xs text-parchment-ivory/60 mt-1">{lang === "fr" ? "Nos spécialistes peuvent vous aider pour les acquisitions, les évaluations et les recherches sur mesure." : "Our specialists can assist with acquisitions, valuations, and bespoke searches."}</p>
            </div>
          </div>
          <a
            href="/booking"
            className="bg-gold-leaf text-ebony-deep font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-parchment-ivory transition-colors whitespace-nowrap"
          >
            {lang === "fr" ? "Réserver une Consultation" : "Book a Consultation"}
          </a>
        </div>
      </section>

      <Footer />

      {/* Advisor Chat Widget */}
      <motion.div
        initial={false}
        animate={isAdvisorOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
        className={`fixed bottom-20 right-4 md:bottom-28 md:right-8 z-40 w-full max-w-md bg-background border border-gold-leaf/30 shadow-level-3 h-[420px] md:h-[520px] flex flex-col overflow-hidden ${
          isAdvisorOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="bg-ebony-deep p-4 flex justify-between items-center text-parchment-ivory border-b border-gold-leaf/20">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4.5 h-4.5 text-gold-leaf animate-pulse" />
            <div>
              <h3 className="font-serif text-[15px] font-medium tracking-tight text-white leading-none">Aduna Intelligence</h3>
              <span className="label-caps text-on-surface-variant/60">{lang === "fr" ? "Conseiller en Antiquités Classiques" : "Classical antiquities Advisor"}</span>
            </div>
          </div>
          <button onClick={() => setIsAdvisorOpen(false)} className="text-white opacity-80 hover:opacity-100 hover:text-gold-leaf p-1">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-parchment-ivory/40 no-scrollbar text-xs">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 max-w-[85%] leading-relaxed ${
                msg.sender === "user" ? "bg-ebony-deep text-parchment-ivory" : "bg-surface-container border border-on-surface/10 text-ebony-deep"
              }`}>
                {msg.text}
                <div className="text-[9px] mt-1 pr-1 text-right block text-on-surface-variant/60">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="p-3 bg-surface-container border border-on-surface/10 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-gold-leaf animate-spin" />
                <span className="font-sans text-xs text-on-surface-variant italic">{lang === "fr" ? "Curation des données historiques..." : "Curating historical data..."}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-4 py-2 bg-surface-container/30 border-t border-on-surface/10 flex gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt.text)}
              className="font-sans text-[10px] text-ebony-deep whitespace-nowrap bg-parchment-ivory border border-on-surface/20 py-1 px-2.5 hover:border-gold-leaf hover:bg-surface-container-low transition-all"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        <div className="p-3 bg-parchment-ivory border-t border-on-surface/10 flex gap-2">
          <input
            type="text"
            placeholder={lang === "fr" ? "Consultez l'IA Conseillère..." : "Consult the Advisory AI..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-grow bg-surface-container-low py-2 px-3 text-xs outline-none focus:bg-parchment-ivory border-b border-transparent focus:border-gold-leaf transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-ebony-deep text-parchment-ivory hover:bg-gold-leaf hover:text-ebony-deep transition-all px-4 flex items-center justify-center font-bold text-xs"
          >
            {lang === "fr" ? "Envoyer" : "Send"}
          </button>
        </div>
      </motion.div>

      {/* Floating Advisor Toggle */}
      <button
        aria-label="Talk to an Advisor"
        onClick={() => setIsAdvisorOpen(!isAdvisorOpen)}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 bg-ebony-deep text-parchment-ivory shadow-level-3 px-5 py-3 md:px-6 md:py-4 flex items-center gap-3 transition-all hover:bg-gold-leaf hover:text-ebony-deep group"
      >
        <MessageSquare className="w-4 h-4 text-gold-leaf group-hover:text-ebony-deep transition-colors" />
        <span className="font-sans text-xs uppercase tracking-widest font-bold">{lang === "fr" ? "Parler à un Conseiller" : "Talk to an Advisor"}</span>
      </button>
    </>
  );
}
