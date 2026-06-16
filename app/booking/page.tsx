"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Send,
  CheckCircle,
  ShieldCheck,
  Video,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useArtworks } from "@/lib/hooks";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtworks } from "@/lib/useTranslatedArtwork";
import type { Artwork } from "@/lib/types";
import AuthGuard from "@/components/AuthGuard";

interface Specialist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialties: string[];
  languages: string[];
  available: boolean;
  nextSlot: string;
}

const SPECIALISTS: Specialist[] = [
  {
    id: "dr-amen",
    name: "Dr. Kofi Amen",
    title: "Senior Curator & Provenance Specialist",
    avatar: "KA",
    specialties: ["West African Antiquities", "Provenance Research", "Bronze Authentication"],
    languages: ["English", "French", "Twi"],
    available: true,
    nextSlot: "Tomorrow, 10:00 CET",
  },
  {
    id: "elise-moreau",
    name: "Élise Moreau",
    title: "Investment Advisory Director",
    avatar: "EM",
    specialties: ["Art-as-Asset Strategy", "Portfolio Diversification", "Institutional Acquisition"],
    languages: ["English", "French", "German"],
    available: true,
    nextSlot: "Tomorrow, 14:00 CET",
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    title: "Head of Conservation & Scientific Analysis",
    avatar: "JO",
    specialties: ["Thermoluminescence Dating", "XRF Analysis", "Conservation Protocols"],
    languages: ["English", "Igbo"],
    available: true,
    nextSlot: "Day after tomorrow, 09:00 CET",
  },
  {
    id: "sophia-nguyen",
    name: "Sophia Nguyen",
    title: "Private Client Relations & Logistics",
    avatar: "SN",
    specialties: ["Secure Transport", "Insurance Underwriting", "Customs & Import"],
    languages: ["English", "Vietnamese", "Mandarin"],
    available: false,
    nextSlot: "Next Monday, 11:00 CET",
  },
];

const TOPICS = [
  "Provenance Inquiry",
  "Investment Advisory",
  "Authentication & Scientific Analysis",
  "Acquisition Strategy",
  "Conservation Assessment",
  "Private Vault Viewing",
  "Insurance & Logistics",
  "General Consultation",
];

const TIME_SLOTS = [
  "09:00 CET",
  "10:00 CET",
  "11:00 CET",
  "13:00 CET",
  "14:00 CET",
  "15:00 CET",
  "16:00 CET",
];

export default function BookingPage() {
  const { lang } = useTranslate();
  const { artworks: apiArtworks } = useArtworks();
  const displayArtworks = useTranslatedArtworks(apiArtworks as unknown as Artwork[]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [artworkInterest, setArtworkInterest] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consultationMode, setConsultationMode] = useState<"video" | "phone" | "in-person">("video");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef] = useState(() => `ADUNA-BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  const canProceed = () => {
    if (step === 1) return selectedSpecialist !== null;
    if (step === 2) return selectedDate && selectedTime && selectedTopic;
    return name && email;
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const generateDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <AuthGuard permission="consultations">
      <>
        <Navbar />
        <main className="flex-1">
        {/* Hero */}
        <section className="bg-ebony-deep py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_30%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <p className="label-caps text-gold-leaf mb-3">{lang === "fr" ? "Services Conseil" : "Advisory Services"}</p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="font-display-lg text-parchment-ivory mb-4">{lang === "fr" ? "Réservation de Consultation Privée" : "Private Consultation Booking"}</h1>
            </motion.div>
            <p className="font-sans text-sm text-parchment-ivory/60 max-w-xl">
              {lang === "fr" ? "Planifiez une consultation confidentielle avec nos conseillers en art, conservateurs ou spécialistes en investissement. Disponible pour les collectionneurs enregistrés sur rendez-vous." : "Schedule a confidential consultation with our art advisors, curators, or investment specialists. Available to registered collectors by appointment."}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <ShieldCheck size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Chiffrement de bout en bout" : "End-to-end encrypted"}
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <Clock size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Réponse dans les 24 heures" : "Response within 24 hours"}
              </div>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <div className="bg-surface-container border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-4">
            <div className="flex items-center justify-center gap-0">
              {[
                { num: 1, label: lang === "fr" ? "Choisir le Spécialiste" : "Select Specialist" },
                { num: 2, label: lang === "fr" ? "Date & Sujet" : "Date & Topic" },
                { num: 3, label: lang === "fr" ? "Confirmer les Détails" : "Confirm Details" },
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <button
                    onClick={() => s.num <= step && setStep(s.num as 1 | 2 | 3)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-0 bg-transparent ${
                      step === s.num
                        ? "text-gold-leaf"
                        : step > s.num
                        ? "text-ebony-deep"
                        : "text-on-surface-variant/40"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step === s.num
                          ? "bg-gold-leaf text-ebony-deep"
                          : step > s.num
                          ? "bg-ebony-deep text-parchment-ivory"
                          : "bg-surface-container-high text-on-surface-variant/40"
                      }`}
                    >
                      {step > s.num ? "✓" : s.num}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {idx < 2 && <div className={`w-12 h-[1.5px] mx-2 ${step > s.num ? "bg-ebony-deep" : "bg-surface-container-high"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12 md:py-16">
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center py-16">
              <CheckCircle className="w-16 h-16 text-gold-leaf mx-auto mb-6" />
              <h2 className="font-serif text-2xl text-ebony-deep mb-3">{lang === "fr" ? "Consultation Confirmée" : "Consultation Confirmed"}</h2>
              <p className="font-sans text-sm text-on-surface-variant mb-2">
                {lang === "fr" ? "Votre consultation privée avec" : "Your private consultation with"} <strong>{selectedSpecialist?.name}</strong> {lang === "fr" ? "a été planifiée." : "has been scheduled."}
              </p>
              <p className="font-sans text-xs text-on-surface-variant/60 mb-8">
                {formatDate(selectedDate)} {lang === "fr" ? "à" : "at"} {selectedTime} · {consultationMode === "video" ? (lang === "fr" ? "Visioconférence" : "Video Conference") : consultationMode === "phone" ? (lang === "fr" ? "Appel Téléphonique" : "Phone Call") : (lang === "fr" ? "En Personne" : "In-Person")}
              </p>
              <div className="bg-surface-container-low border border-on-surface/5 p-6 mb-8 text-left">
                <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">{lang === "fr" ? "Référence de Réservation" : "Booking Reference"}</p>
                <p className="font-mono text-sm text-ebony-deep">{bookingRef}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <a href="/dashboard" className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors inline-block">
                  {lang === "fr" ? "Aller au Tableau de Bord" : "Go to Dashboard"}
                </a>
                <a href="/catalogue" className="border border-ebony-deep/20 text-ebony-deep px-6 py-3 text-xs uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors inline-block">
                  {lang === "fr" ? "Parcourir la Collection" : "Browse Collection"}
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left: Selection */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-xl text-ebony-deep mb-6">{lang === "fr" ? "Choisissez Votre Spécialiste" : "Select Your Specialist"}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SPECIALISTS.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSpecialist(s)}
                            className={`text-left p-5 border transition-all cursor-pointer bg-transparent ${
                              selectedSpecialist?.id === s.id
                                ? "border-gold-leaf bg-surface-container-low shadow-sm"
                                : "border-on-surface/10 hover:border-gold-leaf/50"
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-ebony-deep flex items-center justify-center text-parchment-ivory text-xs font-bold shrink-0">
                                {s.avatar}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-serif text-sm font-bold text-ebony-deep">{s.name}</h3>
                                <p className="text-[10px] text-on-surface-variant truncate">{s.title}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {s.specialties.map((sp) => (
                                <span key={sp} className="text-[9px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 uppercase tracking-wider font-medium">{sp}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-semibold uppercase tracking-widest ${s.available ? "text-emerald-600" : "text-on-surface-variant/40"}`}>
                                {s.available ? `${lang === "fr" ? "Disponible" : "Available"} · ${s.nextSlot}` : (lang === "fr" ? "Actuellement Indisponible" : "Currently Unavailable")}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-xl text-ebony-deep mb-6">{lang === "fr" ? "Sélectionnez la Date, l'Heure & le Sujet" : "Select Date, Time & Topic"}</h2>

                      {/* Consultation Mode */}
                      <div className="mb-8">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-3">{lang === "fr" ? "Mode de Consultation" : "Consultation Mode"}</label>
                        <div className="flex gap-3">
                          {[
                            { mode: "video" as const, label: lang === "fr" ? "Appel Vidéo" : "Video Call", icon: Video },
                            { mode: "phone" as const, label: lang === "fr" ? "Téléphone" : "Phone", icon: Phone },
                            { mode: "in-person" as const, label: lang === "fr" ? "En Personne" : "In-Person", icon: MapPin },
                          ].map(({ mode, label, icon: Icon }) => (
                            <button
                              key={mode}
                              onClick={() => setConsultationMode(mode)}
                              className={`flex items-center gap-2 px-4 py-3 border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer bg-transparent ${
                                consultationMode === mode ? "border-gold-leaf bg-surface-container-low text-ebony-deep" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                              }`}
                            >
                              <Icon size={14} /> {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date Selection */}
                      <div className="mb-8">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-3">{lang === "fr" ? "Date Préférée" : "Preferred Date"}</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                          {generateDates().map((d) => (
                            <button
                              key={d}
                              onClick={() => setSelectedDate(d)}
                              className={`p-3 text-center border text-xs transition-all cursor-pointer bg-transparent ${
                                selectedDate === d ? "border-gold-leaf bg-gold-leaf/10 text-ebony-deep font-bold" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                              }`}
                            >
                              {formatDate(d)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div className="mb-8">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-3">{lang === "fr" ? "Heure Préférée" : "Preferred Time"}</label>
                        <div className="flex flex-wrap gap-2">
                          {TIME_SLOTS.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`px-4 py-2.5 border text-xs font-medium transition-all cursor-pointer bg-transparent ${
                                selectedTime === t ? "border-gold-leaf bg-gold-leaf/10 text-ebony-deep font-bold" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Topic Selection */}
                      <div className="mb-8">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-3">{lang === "fr" ? "Sujet de Consultation" : "Consultation Topic"}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {TOPICS.map((topic) => (
                            <button
                              key={topic}
                              onClick={() => setSelectedTopic(topic)}
                              className={`p-3 border text-xs text-left transition-all cursor-pointer bg-transparent ${
                                selectedTopic === topic ? "border-gold-leaf bg-gold-leaf/10 text-ebony-deep font-bold" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                              }`}
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Artwork Interest */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-2">{lang === "fr" ? "Œuvre d'Intérêt (Optionnel)" : "Artwork of Interest (Optional)"}</label>
                        <select
                          value={artworkInterest}
                          onChange={(e) => setArtworkInterest(e.target.value)}
                          className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface"
                        >
                          <option value="">{lang === "fr" ? "Aucune œuvre spécifique" : "No specific artwork"}</option>
                          {displayArtworks.map((a) => (
                            <option key={a.id} value={a.id}>{a.title} — {a.origin}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-xl text-ebony-deep mb-6">{lang === "fr" ? "Confirmez Vos Détails" : "Confirm Your Details"}</h2>

                      <div className="space-y-5">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">{lang === "fr" ? "Nom Complet *" : "Full Name *"}</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface"
                            placeholder="Julian Doe"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">{lang === "fr" ? "Email *" : "Email *"}</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface"
                            placeholder="collector@institution.com"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">{lang === "fr" ? "Notes (Optionnel)" : "Notes (Optional)"}</label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface resize-none"
                            placeholder="Specific questions, budget range, exhibition plans..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-on-surface/5">
                  <button
                    onClick={() => setStep(Math.max(1, step - 1) as 1 | 2 | 3)}
                    disabled={step === 1}
                    className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                  >
                    ← {lang === "fr" ? "Précédent" : "Previous"}
                  </button>
                  {step < 3 ? (
                    <button
                      onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                      disabled={!canProceed()}
                      className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 flex items-center gap-2"
                    >
                      {lang === "fr" ? "Continuer" : "Continue"} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canProceed() || submitting}
                      className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 flex items-center gap-2"
                    >
                      {submitting ? (
                        <><Clock className="w-3.5 h-3.5 animate-spin" /> {lang === "fr" ? "Planification en cours..." : "Scheduling..."}</>
                      ) : (
                        <><Send className="w-3.5 h-3.5" /> {lang === "fr" ? "Réserver la Consultation" : "Book Consultation"}</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-surface-container-low border border-on-surface/5 p-6 sticky top-24">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">{lang === "fr" ? "Résumé de la Réservation" : "Booking Summary"}</h3>
                  {selectedSpecialist ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b border-on-surface/5">
                        <div className="w-10 h-10 rounded-full bg-ebony-deep flex items-center justify-center text-parchment-ivory text-xs font-bold shrink-0">
                          {selectedSpecialist.avatar}
                        </div>
                        <div>
                          <p className="font-serif text-sm font-bold text-ebony-deep">{selectedSpecialist.name}</p>
                          <p className="text-[10px] text-on-surface-variant">{selectedSpecialist.title}</p>
                        </div>
                      </div>
                      {selectedDate && (
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">{lang === "fr" ? "Date" : "Date"}</span>
                          <span className="text-ebony-deep font-semibold">{formatDate(selectedDate)}</span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">{lang === "fr" ? "Heure" : "Time"}</span>
                          <span className="text-ebony-deep font-semibold">{selectedTime}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">{lang === "fr" ? "Mode" : "Mode"}</span>
                        <span className="text-ebony-deep font-semibold capitalize">{consultationMode}</span>
                      </div>
                      {selectedTopic && (
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">{lang === "fr" ? "Sujet" : "Topic"}</span>
                          <span className="text-ebony-deep font-semibold text-right">{selectedTopic}</span>
                        </div>
                      )}
                      {artworkInterest && (
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">{lang === "fr" ? "Œuvre" : "Artwork"}</span>
                          <span className="text-ebony-deep font-semibold text-right">{displayArtworks.find(a => a.id === artworkInterest)?.title}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant/60">{lang === "fr" ? "Sélectionnez un spécialiste pour commencer." : "Select a specialist to begin."}</p>
                  )}
                  <div className="mt-6 pt-4 border-t border-on-surface/5">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-semibold text-on-surface-variant/40">
                      <ShieldCheck size={10} className="text-gold-leaf" /> {lang === "fr" ? "Confidentiel · Chiffré" : "Confidential · Encrypted"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
        <Footer />
      </>
    </AuthGuard>
  );
}