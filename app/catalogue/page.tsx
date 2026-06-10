"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronDown,
  MessageSquare,
  ShieldCheck,
  Compass,
  Lock,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ARTWORKS } from "@/lib/mockData";
import type { Artwork, AdvisorMessage } from "@/lib/types";

const SUGGESTED_PROMPTS = [
  { label: "Provenance standards?", text: "What are Aduna Gallery's Provenance standards?" },
  { label: "Tell me about Ife head", text: "Explain the historical background of the Ife Terracotta Head." },
  { label: "Why invest in Benin Bronze?", text: "Why is the Benin Bronze Relief Plaque considered a pristine, high-performing investment grade antiquity?" },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function CataloguePage() {
  const [artifacts] = useState<Artwork[]>(ARTWORKS);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedTribe, setSelectedTribe] = useState("All Tribes");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Historical Significance");
  const [visibleCount] = useState(5);
  const [selectedArtifact, setSelectedArtifact] = useState<Artwork | null>(null);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<AdvisorMessage[]>([
    {
      id: "welcome",
      sender: "advisor",
      text: "Greetings. I am your Aduna Art Advisor. How may I direct your investment today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextMsgId = useRef(0);

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

    return result;
  }, [selectedRegion, selectedTribe, selectedMaterial, searchQuery, artifacts]);

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
              <h1 className="font-display-lg text-ebony-deep mb-4">The Collection</h1>
              <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
                A curated selection of museum-grade artifacts, representing the pinnacle of African heritage and investment-grade antiquities.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto relative border-b border-on-surface/20 pb-2 group focus-within:border-gold-leaf transition-colors">
              <span className="font-sans text-xs uppercase tracking-widest font-semibold text-on-surface-variant/60">Sort by:</span>
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border-none font-sans text-xs font-semibold text-ebony-deep focus:ring-0 cursor-pointer pr-6 outline-none"
                >
                  <option value="Historical Significance">Historical Significance</option>
                  <option value="Recently Acquired">Recently Acquired</option>
                  <option value="Investment Value">Investment Value (Scarcity Index)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-0 pointer-events-none text-on-surface-variant" />
              </div>
            </div>
          </motion.header>

          <section className="mb-14 pb-6 border-b border-on-surface/5 overflow-x-auto no-scrollbar">
            <div className="flex gap-12 min-w-max">
              <div className="flex flex-col gap-2.5">
                <span className="label-caps text-on-surface-variant/60">Region</span>
                <div className="flex gap-4">
                  {["All Regions", "West Africa", "Central Africa"].map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`font-sans text-xs font-semibold pb-1 border-b transition-all ${
                        selectedRegion === reg ? "text-ebony-deep border-gold-leaf font-bold" : "text-on-surface-variant border-transparent hover:text-gold-leaf"
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="label-caps text-on-surface-variant/60">Tribe</span>
                <div className="flex gap-4">
                  {["All Tribes", "Yoruba", "Fang", "Benin"].map((trb) => (
                    <button
                      key={trb}
                      onClick={() => {
                        setSelectedTribe(trb);
                        if (trb === "Fang") setSelectedRegion("Central Africa");
                        if (trb === "Yoruba" || trb === "Benin") setSelectedRegion("West Africa");
                      }}
                      className={`font-sans text-xs font-semibold pb-1 border-b transition-all ${
                        selectedTribe === trb ? "text-ebony-deep border-gold-leaf font-bold" : "text-on-surface-variant border-transparent hover:text-gold-leaf"
                      }`}
                    >
                      {trb}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="label-caps text-on-surface-variant/60">Material</span>
                <div className="flex gap-4">
                  {["All", "Bronze", "Wood", "Terracotta"].map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`font-sans text-xs font-semibold pb-1 border-b transition-all ${
                        selectedMaterial === mat ? "text-ebony-deep border-gold-leaf font-bold" : "text-on-surface-variant border-transparent hover:text-gold-leaf"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {filteredArtifacts.length === 0 && (
            <div className="py-24 text-center border border-dashed border-on-surface/20 bg-surface-container-lowest">
              <Compass className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-4 stroke-[1.25]" />
              <h3 className="font-serif text-xl text-ebony-deep font-medium mb-1">No Artifact Matches</h3>
              <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto mb-6">
                Our curatorial logs do not list pieces matching your specific filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedRegion("All Regions");
                  setSelectedTribe("All Tribes");
                  setSelectedMaterial("All");
                  setSearchQuery("");
                }}
                className="font-sans text-xs uppercase tracking-wider font-semibold text-ebony-deep border-b border-gold-leaf pb-0.5 hover:text-gold-leaf transition-colors"
              >
                Reset Curatorial Filters
              </button>
            </div>
          )}

          {filteredArtifacts.length > 0 && (
            <motion.section
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {filteredArtifacts[0] && (
                <article onClick={() => setSelectedArtifact(filteredArtifacts[0])} className="md:col-span-8 group cursor-pointer">
                  <div className="w-full aspect-[4/3] bg-surface-container-lowest shadow-level-2 hover-lift relative overflow-hidden mb-5">
                    <img
                      src={filteredArtifacts[0].imageUrl}
                      alt={filteredArtifacts[0].title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-parchment-ivory/90 backdrop-blur-sm px-3.5 py-1.5 font-sans text-[10px] tracking-wider uppercase font-semibold text-ebony-deep border border-on-surface/10">
                      {filteredArtifacts[0].label}
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="font-serif text-2xl text-ebony-deep font-medium mb-1 group-hover:text-gold-leaf transition-colors">
                      {filteredArtifacts[0].title}
                    </h2>
                    <p className="font-sans text-sm text-on-surface-variant mb-1">
                      {filteredArtifacts[0].origin}, {filteredArtifacts[0].region}
                    </p>
                    <p className="label-caps text-gold-leaf">{filteredArtifacts[0].period}</p>
                  </div>
                </article>
              )}

              {filteredArtifacts[1] && (
                <article onClick={() => setSelectedArtifact(filteredArtifacts[1])} className="md:col-span-4 group cursor-pointer">
                  <div className="w-full aspect-[3/4] bg-surface-container-lowest shadow-level-2 hover-lift relative overflow-hidden mb-5">
                    <img
                      src={filteredArtifacts[1].imageUrl}
                      alt={filteredArtifacts[1].title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-parchment-ivory/90 backdrop-blur-sm px-3.5 py-1.5 font-sans text-[10px] tracking-wider uppercase font-semibold text-ebony-deep border border-on-surface/10">
                      {filteredArtifacts[1].label}
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="font-serif text-2xl text-ebony-deep font-medium mb-1 group-hover:text-gold-leaf transition-colors">
                      {filteredArtifacts[1].title}
                    </h2>
                    <p className="font-sans text-sm text-on-surface-variant mb-1">
                      {filteredArtifacts[1].origin}, {filteredArtifacts[1].region}
                    </p>
                    <p className="label-caps text-gold-leaf">{filteredArtifacts[1].period}</p>
                  </div>
                </article>
              )}

              {filteredArtifacts.slice(2, visibleCount).map((item) => (
                <article key={item.id} onClick={() => setSelectedArtifact(item)} className="md:col-span-4 group cursor-pointer md:mt-10">
                  <div className="w-full aspect-square bg-surface-container-lowest shadow-level-2 hover-lift relative overflow-hidden mb-5">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-parchment-ivory/90 backdrop-blur-sm px-3.5 py-1.5 font-sans text-[10px] tracking-wider uppercase font-semibold text-ebony-deep border border-on-surface/10">
                      {item.label}
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
                </article>
              ))}
            </motion.section>
          )}
        </div>
      </main>
      <Footer />

      {/* Artifact Detail Drawer */}
      <AnimatePresence>
        {selectedArtifact && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArtifact(null)}
              className="absolute inset-0 bg-ebony-deep/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative w-full max-w-4xl bg-background h-screen flex flex-col shadow-2xl overflow-y-auto no-scrollbar z-10"
            >
              <button
                onClick={() => setSelectedArtifact(null)}
                className="absolute top-6 left-6 p-2 bg-ebony-deep text-parchment-ivory hover:bg-gold-leaf hover:text-ebony-deep transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
                <div className="lg:col-span-5 h-80 lg:h-full relative bg-surface-container">
                  <img
                    src={selectedArtifact.imageUrl}
                    alt={selectedArtifact.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ebony-deep/70 via-transparent to-transparent lg:hidden" />
                  <div className="absolute bottom-6 left-6 right-6 text-parchment-ivory z-10 lg:hidden">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-gold-leaf">Masterpiece</span>
                    <h2 className="font-serif text-2xl font-medium mt-1 leading-tight">{selectedArtifact.title}</h2>
                  </div>
                </div>

                <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-parchment-ivory">
                  <div>
                    <div className="hidden lg:block mb-8">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Lock className="w-3.5 h-3.5 text-gold-leaf" />
                        <span className="label-caps text-gold-leaf">Investable Masterwork</span>
                      </div>
                      <h1 className="font-display-lg text-ebony-deep tracking-tight mb-2 leading-tight">
                        {selectedArtifact.title}
                      </h1>
                      <div className="h-0.5 w-16 bg-gold-leaf mt-3 mb-4" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-on-surface/10 pb-6 mb-6 text-xs">
                      <div>
                        <span className="text-on-surface-variant/60 uppercase block font-semibold tracking-wider font-sans mb-0.5">Region</span>
                        <span className="text-ebony-deep font-bold font-sans">{selectedArtifact.region} ({selectedArtifact.origin})</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant/60 uppercase block font-semibold tracking-wider font-sans mb-0.5">Tribe</span>
                        <span className="text-ebony-deep font-bold font-sans">{selectedArtifact.tribe}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant/60 uppercase block font-semibold tracking-wider font-sans mb-0.5">Period</span>
                        <span className="text-ebony-deep font-bold font-sans">{selectedArtifact.period}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant/60 uppercase block font-semibold tracking-wider font-sans mb-0.5">Dimensions</span>
                        <span className="text-ebony-deep font-bold font-sans">{selectedArtifact.dimensions}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif text-lg text-ebony-deep font-medium">Historical Statement</h3>
                      <p className="font-sans text-sm text-on-surface-variant leading-relaxed italic border-l-2 border-gold-leaf pl-4 bg-surface-container-low py-2">
                        &ldquo;{selectedArtifact.historicalStory}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-on-surface/10">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="label-caps text-on-surface-variant/60">Acquisition Status</span>
                        <div className="font-serif text-xl text-ebony-deep font-semibold mt-0.5">{selectedArtifact.label}</div>
                      </div>
                      <div className="text-right">
                        <span className="label-caps text-on-surface-variant/60">Society Code</span>
                        <div className="font-mono text-sm text-gold-leaf font-bold mt-0.5">ADUNA-{selectedArtifact.id.slice(0, 4).toUpperCase()}</div>
                      </div>
                    </div>

                    <div className="bg-surface-container-low p-6 border border-on-surface/10">
                      <h3 className="font-serif text-base text-ebony-deep font-medium mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-gold-leaf" />
                        Initiate Confidential Inquiry
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Your Full Name"
                            className="bg-parchment-ivory border-b border-on-surface/20 py-2 px-3 text-xs focus:border-gold-leaf outline-none"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Your Secure Email"
                            className="bg-parchment-ivory border-b border-on-surface/20 py-2 px-3 text-xs focus:border-gold-leaf outline-none"
                          />
                        </div>
                        <button className="w-full bg-ebony-deep text-parchment-ivory font-semibold text-xs uppercase tracking-widest py-3 hover:bg-gold-leaf hover:text-ebony-deep transition-all">
                          Submit Pipeline Inquiry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advisor Chat Widget */}
      <AnimatePresence>
        {isAdvisorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-20 right-4 md:bottom-28 md:right-8 z-40 w-full max-w-md bg-background border border-gold-leaf/30 shadow-level-3 h-[420px] md:h-[520px] flex flex-col overflow-hidden"
          >
            <div className="bg-ebony-deep p-4 flex justify-between items-center text-parchment-ivory border-b border-gold-leaf/20">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4.5 h-4.5 text-gold-leaf animate-pulse" />
                <div>
                  <h3 className="font-serif text-[15px] font-medium tracking-tight text-white leading-none">Aduna Intelligence</h3>
                  <span className="label-caps text-on-surface-variant/60">Classical antiquities Advisor</span>
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
                    <span className="font-sans text-xs text-on-surface-variant italic">Curating historical data...</span>
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
                placeholder="Consult the Advisory AI..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-grow bg-surface-container-low py-2 px-3 text-xs outline-none focus:bg-parchment-ivory border-b border-transparent focus:border-gold-leaf transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-ebony-deep text-parchment-ivory hover:bg-gold-leaf hover:text-ebony-deep transition-all px-4 flex items-center justify-center font-bold text-xs"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Advisor Toggle */}
      <button
        aria-label="Talk to an Advisor"
        onClick={() => setIsAdvisorOpen(!isAdvisorOpen)}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 bg-ebony-deep text-parchment-ivory shadow-level-3 px-5 py-3 md:px-6 md:py-4 flex items-center gap-3 transition-all hover:bg-gold-leaf hover:text-ebony-deep group"
      >
        <MessageSquare className="w-4 h-4 text-gold-leaf group-hover:text-ebony-deep transition-colors" />
        <span className="font-sans text-xs uppercase tracking-widest font-bold">Talk to an Advisor</span>
      </button>
    </>
  );
}