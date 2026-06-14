"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Landmark,
  Upload,
  FileCheck,
  AlertCircle,
  Award,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
  Landmark as LandmarkIcon,
  Shield,
  CreditCard,
  ShieldAlert,
  Loader2,
  KeyRound,
  BadgeCheck,
  Download,
  Truck,
  Calendar,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Lock,
  X,
  Clock,
  CheckCircle,
  FileText,
  Phone,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ARTWORKS } from "@/lib/mockData";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtwork } from "@/lib/useTranslatedArtwork";
import type { Artwork } from "@/lib/types";
import ProvenanceStage from "@/components/acquisition/ProvenanceStage";

type CheckoutStep = "Summary" | "Provenance" | "Billing" | "Payment" | "Confirmation";
type PaymentMethod = "swift" | "escrow" | "card";

interface BillingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber: string;
  invoiceNotes: string;
}

interface CardData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholderName: string;
}

function AcquisitionContent() {
  const { lang } = useTranslate();
  const searchParams = useSearchParams();
  const artworkId = searchParams.get("artwork") || ARTWORKS[0]?.id || "";
  const rawArtwork = ARTWORKS.find((a) => a.id === artworkId) || ARTWORKS[0];
  const artwork = useTranslatedArtwork(rawArtwork);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("Summary");
  const [billing, setBilling] = useState<BillingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    vatNumber: "",
    invoiceNotes: "",
  });
  const [billingError, setBillingError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("escrow");
  const [card, setCard] = useState<CardData>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardholderName: "",
  });
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "submitting" | "verifying" | "error">("idle");
  const [stepMsg, setStepMsg] = useState("");
  const [paymentErrorMsg, setPaymentErrorMsg] = useState("");
  const [copiedSwift, setCopiedSwift] = useState(false);

  const stepOrder: CheckoutStep[] = ["Summary", "Provenance", "Billing", "Payment", "Confirmation"];
  const currentIndex = stepOrder.indexOf(currentStep);

  const parsePrice = (priceStr: string): number => {
    const match = priceStr.replace(/\s/g, "").match(/[\d,.]+/);
    if (!match) return 0;
    const numStr = match[0].replace(",", ".");
    return parseFloat(numStr) || 0;
  };

  const artworkPrice = parsePrice(artwork?.investment?.estimatedValue || "0");
  const vatRate = 0.19;
  const vatAmount = artworkPrice * vatRate;
  const totalWithVAT = artworkPrice + vatAmount;

  const handleBillingChange = (data: Partial<BillingData>) => {
    setBilling((prev) => ({ ...prev, ...data }));
    setBillingError(null);
  };

  const validateBilling = () => {
    if (!billing.firstName.trim() || !billing.lastName.trim()) {
      setBillingError(lang === "fr" ? "Le prénom et le nom de famille sont requis." : "First and Last Name are required.");
      return false;
    }
    if (!billing.email.trim() || !billing.email.includes("@")) {
      setBillingError(lang === "fr" ? "Veuillez fournir une adresse e-mail valide." : "Please provide a valid email address.");
      return false;
    }
    if (!billing.address.trim()) {
      setBillingError(lang === "fr" ? "L'adresse de facturation est requise." : "Billing address is required.");
      return false;
    }
    if (!billing.city.trim()) {
      setBillingError(lang === "fr" ? "La ville est requise." : "City is required.");
      return false;
    }
    if (!billing.country.trim()) {
      setBillingError(lang === "fr" ? "Le pays est requis." : "Country is required.");
      return false;
    }
    setBillingError(null);
    return true;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCard((prev) => ({ ...prev, cardNumber: formatted }));
    setCardError(null);
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setCard((prev) => ({ ...prev, expiry: value }));
    setCardError(null);
  };
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCard((prev) => ({ ...prev, cvc: value }));
    setCardError(null);
  };

  const triggerEscrowPayment = () => {
    setPaymentStatus("submitting");
    setPaymentErrorMsg("");
    const steps = [
      lang === "fr" ? "Établissement du tunnel TLS avec l'API Escrow.com..." : "Establishing TLS tunnel with Escrow.com API...",
      lang === "fr" ? `Transmission des données de facturation vérifiées pour ${billing.firstName} ${billing.lastName}...` : `Transmitting verified billing data for ${billing.firstName} ${billing.lastName}...`,
      lang === "fr" ? `Identification de l'actif : ${artwork?.id}...` : `Mapping custody asset ID: ${artwork?.id}...`,
      lang === "fr" ? "En attente de la facture du coffre-fort numérique Escrow..." : "Awaiting Escrow digital vault settlement invoice...",
      lang === "fr" ? "Canal d'escrow souverain établi avec succès !" : "Sovereign escrow channel established successfully!",
    ];
    let current = 0;
    setStepMsg(steps[current]);
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setStepMsg(steps[current]);
      } else {
        clearInterval(interval);
        setPaymentStatus("verifying");
        setTimeout(() => setCurrentStep("Confirmation"), 1500);
      }
    }, 1200);
  };

  const processCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (card.cardNumber.replace(/\s/g, "").length < 16) {
      setCardError(lang === "fr" ? "Numéro de carte invalide. Doit comporter 16 chiffres." : "Invalid card number. Must be 16 digits.");
      return;
    }
    if (card.expiry.length < 5) {
      setCardError(lang === "fr" ? "La date d'expiration doit être au format MM/AA." : "Expiry must be in MM/YY format.");
      return;
    }
    if (card.cvc.length < 3) {
      setCardError(lang === "fr" ? "Code CVC invalide." : "Invalid CVC code.");
      return;
    }
    if (!card.cardholderName.trim()) {
      setCardError(lang === "fr" ? "Le nom du titulaire de la carte est requis." : "Cardholder name is required.");
      return;
    }
    setCardError(null);
    setPaymentStatus("submitting");
    setPaymentErrorMsg("");
    const cardSteps = [
      lang === "fr" ? "Tokenisation des identifiants de la carte..." : "Tokenizing card credentials...",
      lang === "fr" ? "Chiffrement via PCI-DSS Niveau 1 (AES-256)..." : "Encrypting via PCI-DSS Level 1 (AES-256)...",
      lang === "fr" ? "Contact de l'émetteur de la carte pour autorisation..." : "Contacting card issuer for authorization...",
      lang === "fr" ? "Vérification des limites de transaction..." : "Verifying transaction limits...",
      lang === "fr" ? "Autorisation de paiement accordée !" : "Charge authorization granted!",
    ];
    let current = 0;
    setStepMsg(cardSteps[current]);
    const interval = setInterval(() => {
      current++;
      if (current < cardSteps.length) {
        setStepMsg(cardSteps[current]);
      } else {
        clearInterval(interval);
        setPaymentStatus("verifying");
        setTimeout(() => setCurrentStep("Confirmation"), 1550);
      }
    }, 1100);
  };

  const retryPayment = () => {
    setPaymentStatus("idle");
    setPaymentErrorMsg("");
    setStepMsg("");
  };

  const copySwiftDetails = () => {
    setCopiedSwift(true);
    setTimeout(() => setCopiedSwift(false), 2000);
  };

  const txnRef = `HV-TXN-${artwork?.id?.substring(0, 6).toUpperCase() || "000000"}-${billing.lastName.substring(0, 8).replace(/\s+/g, "-").toUpperCase()}`;

  if (!artwork) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant">{lang === "fr" ? "Aucune œuvre sélectionnée. Veuillez d'abord sélectionner une œuvre." : "No artwork selected. Please select an artwork first."}</p>
        <a href="/catalogue" className="text-gold-leaf underline text-sm mt-4 inline-block">{lang === "fr" ? "Parcourir le catalogue" : "Browse Catalogue"}</a>
      </div>
    );
  }

  return (
    <>
      {/* Payment Processing Overlay */}
      <AnimatePresence>
        {paymentStatus !== "idle" && paymentStatus !== "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ebony-deep/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-center text-parchment-ivory"
          >
            <div className="max-w-md flex flex-col items-center gap-6">
              {paymentStatus === "submitting" ? (
                <Loader2 className="w-12 h-12 text-gold-leaf animate-spin" />
              ) : (
                <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6 animate-pulse" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-2xl text-parchment-ivory font-semibold tracking-wide">
                  {paymentStatus === "submitting" ? (lang === "fr" ? "Sécurisation du canal de transaction" : "Securing Transaction Channel") : (lang === "fr" ? "Paiement vérifié" : "Payment Verified")}
                </h3>
                <p className="font-sans text-xs uppercase tracking-[0.15em] text-gold-leaf font-bold">
                  {lang === "fr" ? "Chiffrement de niveau institutionnel activé" : "Institutional-Grade Encryption Engaged"}
                </p>
              </div>
              <div className="min-h-[45px] transition-all duration-300">
                <p className="font-mono text-xs text-parchment-ivory/70 bg-parchment-ivory/5 px-4 py-2 border border-parchment-ivory/10">
                  {stepMsg}
                </p>
              </div>
              <p className="font-sans text-[10px] text-parchment-ivory/40">
                {lang === "fr" ? "Ne fermez pas cette passerelle. Votre session est protégée par un chiffrement de bout en bout." : "Do not close this gateway. Your session is protected by end-to-end encryption."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-ebony-deep py-10 md:py-14 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_30%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1000px] mx-auto px-6 md:px-16 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">{lang === "fr" ? "Paiement sécurisé" : "Secure Checkout"}</span>
            </div>
            <h1 className="font-display-lg text-parchment-ivory mb-3">{lang === "fr" ? "Processus d'Acquisition Sécurisé" : "Secure Acquisition"}</h1>
            <p className="font-sans text-sm text-parchment-ivory/60 max-w-lg">
              {lang === "fr" ? "Complétez votre acquisition via notre caisse de niveau institutionnel — récapitulatif de commande, facturation avec TVA et paiement sécurisé." : "Complete your acquisition through our institutional-grade checkout — order summary, billing with VAT, and secure payment."}
            </p>
          </div>
        </section>

        {/* Main Container */}
        <div className="max-w-[1000px] mx-auto px-6 md:px-16 py-10 md:py-16">
          {/* Progress Indication */}
          <div className="flex items-center justify-between border-b border-on-surface/10 pb-4 mb-10 text-xs font-semibold uppercase tracking-wider font-sans">
            {stepOrder.map((step, idx) => {
              const isActive = step === currentStep;
              const isCompleted = stepOrder.indexOf(step) < currentIndex;
              return (
                <div key={step} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/30 hidden sm:block" />}
                  <div
                    className={`pb-1 transition-colors duration-200 ${
                      isActive
                        ? "text-ebony-deep border-b border-ebony-deep font-bold"
                        : isCompleted
                        ? "text-on-surface/60 cursor-pointer hover:text-ebony-deep"
                        : "text-on-surface-variant/45 select-none"
                    }`}
                    onClick={() => {
                      if (isCompleted) setCurrentStep(step);
                    }}
                  >
                    {idx + 1}.                     {lang === "fr" ? (step === "Summary" ? "Récapitulatif" : step === "Provenance" ? "Provenance" : step === "Billing" ? "Facturation" : step === "Payment" ? "Paiement" : "Confirmation") : step}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stage Rendering */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* ─── STEP 1: SUMMARY ─── */}
              {currentStep === "Summary" && (
                <motion.div key="summary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Order Summary */}
                    <div className="lg:col-span-8 flex flex-col gap-6 bg-surface-container-lowest p-8 md:p-10 border border-on-surface/5">
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-ebony-deep mb-3">{lang === "fr" ? "Récapitulatif de la commande" : "Order Summary"}</h2>
                        <p className="font-sans text-sm text-on-surface-variant max-w-xl">
                          {lang === "fr" ? "Vérifiez les détails de votre acquisition avant de passer à la facturation." : "Review your acquisition details before proceeding to billing."}
                        </p>
                      </div>

                      {/* Artwork Details */}
                      <div className="flex flex-col sm:flex-row gap-6 border-b border-on-surface/10 pb-6">
                        <div className="w-full sm:w-40 h-48 bg-ebony-deep/5 overflow-hidden border border-on-surface/5 shrink-0">
                          <img src={artwork.imageUrl} alt={artwork.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <h3 className="font-serif text-lg text-ebony-deep">{artwork.title}</h3>
                          <p className="font-sans text-xs text-on-surface-variant">{artwork.origin} · {artwork.period}</p>
                          <p className="font-sans text-xs text-on-surface-variant">{artwork.material}</p>
                          <div className="mt-2">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{lang === "fr" ? "Valeur estimée" : "Estimated Value"}</span>
                            <p className="font-serif text-xl text-ebony-deep font-semibold">{artwork.investment?.estimatedValue || "Price on Request"}</p>
                          </div>
                        </div>
                      </div>

                      {/* VAT Breakdown */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant">{lang === "fr" ? "Ventilation des prix (TVA incluse, 19%)" : "Price Breakdown (incl. 19% VAT)"}</h4>
                        <div className="space-y-2 text-xs font-sans">
                          <div className="flex justify-between py-1">
                            <span className="text-on-surface-variant">{lang === "fr" ? "Prix de l'œuvre (net)" : "Artwork Price (Net)"}</span>
                            <span className="font-medium text-ebony-deep">{artworkPrice.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-on-surface-variant">{lang === "fr" ? "TVA (19%)" : "VAT (19%)"}</span>
                            <span className="font-medium text-ebony-deep">{vatAmount.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                          </div>
                          <div className="flex justify-between py-2 border-t border-on-surface/10 font-bold">
                            <span className="text-ebony-deep">{lang === "fr" ? "Total (TVA incluse)" : "Total (incl. VAT)"}</span>
                            <span className="text-ebony-deep font-serif text-base">{totalWithVAT.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="bg-surface-container-high/40 p-4 border-l border-gold-leaf text-xs text-on-surface-variant">
                        <strong>{lang === "fr" ? "Important :" : "Important:"}</strong> {lang === "fr" ? "La TVA sera calculée en fonction de votre pays de facturation. Les clients de l'UE paient le tarif standard ; les clients hors de l'UE peuvent être éligibles à une exonération de TVA à l'exportation." : "VAT will be calculated based on your billing country. EU customers pay standard rate; non-EU may qualify for VAT exemption on export."}
                      </div>

                      <div className="pt-4 border-t border-on-surface/5">
                        <button
                          onClick={() => setCurrentStep("Provenance")}
                          className="w-full bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {lang === "fr" ? "Passer à la provenance" : "Proceed to Provenance"} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      <div className="bg-surface-container-low border border-on-surface/5 p-6 flex flex-col gap-5 sticky top-24">
                        <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-leaf">{lang === "fr" ? "Paiement sécurisé" : "Secure Checkout"}</div>
                        <div className="aspect-square bg-ebony-deep/5 overflow-hidden border border-on-surface/5 relative">
                          <img src={artwork.imageUrl} alt={artwork.title} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale opacity-95 hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute top-3 right-3 bg-ebony-deep text-parchment-ivory font-mono text-[10px] px-2.5 py-1 tracking-wider uppercase">{artwork.id}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-serif text-xl text-ebony-deep leading-tight">{artwork.title}</h3>
                          <p className="font-sans text-xs text-on-surface-variant tracking-wide">{artwork.origin}</p>
                        </div>
                        <div className="border-t border-on-surface/10 pt-4 flex flex-col gap-1">
                          <span className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">{lang === "fr" ? "Total avec TVA" : "Total with VAT"}</span>
                          <span className="font-serif text-2xl font-bold text-ebony-deep">{totalWithVAT.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                        </div>
                        <div className="bg-surface-container-high/40 p-4 border-l border-gold-leaf text-xs text-on-surface-variant flex flex-col gap-2">
                          <strong>{lang === "fr" ? "Protection de l'acheteur :" : "Buyer Protection:"}</strong>
                          <p className="leading-relaxed">{lang === "fr" ? "L'escrow conserve votre paiement en toute sécurité jusqu'à ce que l'authentification physique soit vérifiée à la livraison." : "Escrow holds your payment safely until physical authentication is verified upon delivery."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 2: PROVENANCE ─── */}
              {currentStep === "Provenance" && (
                <motion.div key="provenance" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <ProvenanceStage
                    artwork={artwork}
                    onBack={() => setCurrentStep("Summary")}
                    onNext={() => setCurrentStep("Billing")}
                  />
                </motion.div>
              )}

              {/* ─── STEP 3: BILLING ─── */}
              {currentStep === "Billing" && (
                <motion.div key="billing" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Billing Form */}
                    <div className="lg:col-span-8 flex flex-col gap-6 bg-surface-container-lowest p-8 md:p-10 border border-on-surface/5">
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-ebony-deep mb-3">{lang === "fr" ? "Informations de facturation" : "Billing Information"}</h2>
                        <p className="font-sans text-sm text-on-surface-variant max-w-xl">
                          {lang === "fr" ? "Fournissez vos coordonnées de facturation pour la facturation et la TVA." : "Provide your billing details for invoicing and VAT purposes."}
                        </p>
                      </div>

                      {billingError && (
                        <div className="bg-red-50 border-l-2 border-terracotta-earth p-4 flex gap-3 text-sm text-red-800 items-start">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-terracotta-earth" />
                          <span>{billingError}</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                              <span>{lang === "fr" ? "Prénom" : "First Name"}</span>
                              <span className="text-terracotta-earth">*</span>
                            </label>
                            <input type="text" value={billing.firstName} onChange={(e) => handleBillingChange({ firstName: e.target.value })} placeholder="Julian" className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                              <span>{lang === "fr" ? "Nom de famille" : "Last Name"}</span>
                              <span className="text-terracotta-earth">*</span>
                            </label>
                            <input type="text" value={billing.lastName} onChange={(e) => handleBillingChange({ lastName: e.target.value })} placeholder="Doe" className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                              <span>{lang === "fr" ? "E-mail" : "Email"}</span>
                              <span className="text-terracotta-earth">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                              <input type="email" value={billing.email} onChange={(e) => handleBillingChange({ email: e.target.value })} placeholder="collector@example.com" className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{lang === "fr" ? "Téléphone" : "Phone"}</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                              <input type="tel" value={billing.phone} onChange={(e) => handleBillingChange({ phone: e.target.value })} placeholder="+44 7700 900000" className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{lang === "fr" ? "Société / Institution (facultatif)" : "Company / Institution (Optional)"}</label>
                          <div className="relative">
                            <Landmark className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                            <input type="text" value={billing.company} onChange={(e) => handleBillingChange({ company: e.target.value })} placeholder="Institutional Gallery LLC" className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                              <span>{lang === "fr" ? "Adresse" : "Street Address"}</span>
                            <span className="text-terracotta-earth">*</span>
                          </label>
                          <input type="text" value={billing.address} onChange={(e) => handleBillingChange({ address: e.target.value })} placeholder="123 Gallery Lane" className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                          <div className="col-span-2 sm:col-span-1 flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                              <span>{lang === "fr" ? "Ville" : "City"}</span>
                              <span className="text-terracotta-earth">*</span>
                            </label>
                            <input type="text" value={billing.city} onChange={(e) => handleBillingChange({ city: e.target.value })} placeholder="London" className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                          <div className="col-span-2 sm:col-span-1 flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{lang === "fr" ? "Code postal" : "Postal Code"}</label>
                            <input type="text" value={billing.postalCode} onChange={(e) => handleBillingChange({ postalCode: e.target.value })} placeholder="SW1A 1AA" className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                          <div className="col-span-2 flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                              <span>{lang === "fr" ? "Pays" : "Country"}</span>
                              <span className="text-terracotta-earth">*</span>
                            </label>
                            <select value={billing.country} onChange={(e) => handleBillingChange({ country: e.target.value })} className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans">
                              <option value="">{lang === "fr" ? "Sélectionner" : "Select"}</option>
                              <option value="DE">{lang === "fr" ? "Allemagne" : "Germany"}</option>
                              <option value="CH">{lang === "fr" ? "Suisse" : "Switzerland"}</option>
                              <option value="AT">{lang === "fr" ? "Autriche" : "Austria"}</option>
                              <option value="FR">{lang === "fr" ? "France" : "France"}</option>
                              <option value="GB">{lang === "fr" ? "Royaume-Uni" : "United Kingdom"}</option>
                              <option value="US">{lang === "fr" ? "États-Unis" : "United States"}</option>
                              <option value="OTHER">{lang === "fr" ? "Autre" : "Other"}</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                            <span>{lang === "fr" ? "Numéro de TVA (facultatif)" : "VAT Number (Optional)"}</span>
                            <span className="text-[9px] text-on-surface-variant/60 normal-case tracking-normal">{lang === "fr" ? "Pour le régime de reverse-charge de l'UE ou l'exonération fiscale" : "For EU reverse-charge or tax exemption"}</span>
                          </label>
                          <input type="text" value={billing.vatNumber} onChange={(e) => handleBillingChange({ vatNumber: e.target.value })} placeholder="DE123456789" className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40 font-mono" />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{lang === "fr" ? "Notes de facture (facultatif)" : "Invoice Notes (Optional)"}</label>
                          <textarea rows={3} value={billing.invoiceNotes} onChange={(e) => handleBillingChange({ invoiceNotes: e.target.value })} placeholder="Purchase order number, special instructions..." className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40 resize-none" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-on-surface/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button onClick={() => setCurrentStep("Provenance")} className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-2 cursor-pointer border-0 bg-transparent">
                          <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour à la provenance" : "Back to Provenance"}
                        </button>
                        <button
                          onClick={() => {
                            if (validateBilling()) setCurrentStep("Payment");
                          }}
                          className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {lang === "fr" ? "Passer au paiement" : "Proceed to Payment"} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      <div className="bg-surface-container-low border border-on-surface/5 p-6 flex flex-col gap-5 sticky top-24">
                        <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-leaf">{lang === "fr" ? "Récapitulatif de la commande" : "Order Summary"}</div>
                        <div className="aspect-square bg-ebony-deep/5 overflow-hidden border border-on-surface/5 relative">
                          <img src={artwork.imageUrl} alt={artwork.title} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale opacity-95 hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-serif text-xl text-ebony-deep leading-tight">{artwork.title}</h3>
                          <p className="font-sans text-xs text-on-surface-variant tracking-wide">{artwork.origin}</p>
                        </div>
                        <div className="border-t border-on-surface/10 pt-4 flex flex-col gap-1">
                          <span className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">{lang === "fr" ? "Total avec TVA" : "Total with VAT"}</span>
                          <span className="font-serif text-2xl font-bold text-ebony-deep">{totalWithVAT.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 4: PAYMENT ─── */}
              {currentStep === "Payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="flex flex-col gap-12">
                    <div className="text-center flex flex-col gap-3">
                      <h1 className="font-serif text-3xl md:text-4xl text-ebony-deep font-medium">{lang === "fr" ? "Sélection du paiement" : "Payment Selection"}</h1>
                      <p className="font-sans text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                        {lang === "fr" ? "Sélectionnez un moyen sécurisé pour finaliser l'acquisition. Toutes les transactions sont protégées par un chiffrement de niveau institutionnel." : "Select a secure method to finalize the acquisition. All transactions are protected by institutional-grade encryption."}
                      </p>
                    </div>

                    {/* Payment Error State */}
                    {paymentStatus === "error" && (
                      <div className="bg-red-50 border-l-2 border-terracotta-earth p-6 flex gap-4 items-start">
                        <ShieldAlert className="w-6 h-6 text-terracotta-earth shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-sans text-sm font-bold text-red-800 mb-2">{lang === "fr" ? "Échec du paiement" : "Payment Failed"}</h4>
                          <p className="font-sans text-xs text-red-700 mb-4">
                            {paymentErrorMsg || (lang === "fr" ? "Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer ou contacter le support." : "An error occurred while processing your payment. Please try again or contact support.")}
                          </p>
                          <div className="flex gap-3">
                            <button onClick={retryPayment} className="bg-ebony-deep text-parchment-ivory px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center gap-1.5 cursor-pointer border-0">
                              <RefreshCw size={10} /> {lang === "fr" ? "Réessayer le paiement" : "Retry Payment"}
                            </button>
                            <a href="mailto:support@adunagallery.com?subject=Payment%20Failed%20-%20{txnRef}" className="border border-gold-leaf text-gold-leaf px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf/10 transition-colors flex items-center gap-1.5">
                              <HelpCircle size={10} /> {lang === "fr" ? "Contacter le support" : "Contact Support"}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-6">
                      {/* SWIFT */}
                      <div onClick={() => setPaymentMethod("swift")} className={`group relative cursor-pointer border p-8 flex items-start gap-6 transition-all duration-300 ${paymentMethod === "swift" ? "border-gold-leaf bg-surface-container-lowest shadow-[0_20px_40px_rgba(15,15,15,0.03)]" : "border-on-surface/10 hover:shadow-[0_20px_40px_rgba(15,15,15,0.03)] hover:-translate-y-0.5 bg-surface-container-lowest"}`}>
                        <div className="mt-1">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${paymentMethod === "swift" ? "border-gold-leaf bg-gold-leaf/10" : "border-on-surface/30"}`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-gold-leaf transition-opacity duration-300 ${paymentMethod === "swift" ? "opacity-100" : "opacity-0"}`} />
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="font-sans text-[13px] font-semibold tracking-wider text-ebony-deep mb-1 uppercase flex items-center gap-2">
                                <LandmarkIcon className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Virement bancaire international (SWIFT)" : "International Bank Transfer (SWIFT)"}
                              </h3>
                              <p className="font-sans text-xs text-on-surface-variant max-w-lg leading-relaxed">{lang === "fr" ? "Virement direct vers nos comptes institutionnels sécurisés. Idéal pour les acquisitions de grande valeur." : "Direct wire transfer to our secure institutional accounts. Ideal for high-value acquisitions."}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="font-sans text-[10px] font-medium text-on-surface-variant block uppercase tracking-wider">{lang === "fr" ? "Délai de traitement" : "Processing Time"}</span>
                              <span className="font-sans text-xs text-ebony-deep font-bold">{lang === "fr" ? "1-3 jours ouvrables" : "1-3 Business Days"}</span>
                            </div>
                          </div>
                          {paymentMethod === "swift" && (
                            <div className="mt-4 border-t border-on-surface/10 pt-5 flex flex-col gap-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                              <div className="bg-parchment-ivory p-5 border border-on-surface/10 font-mono text-xs text-ebony-deep flex flex-col gap-3">
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">{lang === "fr" ? "Banque bénéficiaire" : "Beneficiary Bank"}</span><span className="font-bold">CREDIT SUISSE AG (ZURICH LUXURY RESERVE)</span></div>
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">{lang === "fr" ? "Nom du compte" : "Account Name"}</span><span className="font-bold">ADUNA GALLERY LLC</span></div>
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">{lang === "fr" ? "Code IBAN" : "IBAN Code"}</span><span className="font-bold">CH93 0070 0000 8821 9920 A</span></div>
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">SWIFT/BIC</span><span className="font-bold">CSZHCH22XXXX</span></div>
                                <div className="flex justify-between items-center pb-1"><span className="text-[10px] text-on-surface-variant/70 uppercase">{lang === "fr" ? "Référence" : "Reference"}</span><span className="font-bold text-terracotta-earth font-mono">{txnRef}</span></div>
                              </div>
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button onClick={copySwiftDetails} type="button" className="w-full sm:w-auto border border-ebony-deep/10 hover:border-gold-leaf text-ebony-deep font-sans text-[11px] font-semibold uppercase tracking-wider px-6 py-3 transition-all cursor-pointer bg-transparent">{copiedSwift ? (lang === "fr" ? "IBAN SWIFT copié ✓" : "Swift IBAN Copied ✓") : (lang === "fr" ? "Copier les coordonnées IBAN" : "Copy IBAN Details")}</button>
                                <button onClick={() => setCurrentStep("Confirmation")} type="button" className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-[11px] font-semibold uppercase tracking-wider px-8 py-3.5 cursor-pointer transition-colors">{lang === "fr" ? "Confirmer la commande et obtenir la facture SWIFT" : "Confirm Order & Get SWIFT Bill"}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Escrow */}
                      <div onClick={() => setPaymentMethod("escrow")} className={`group relative cursor-pointer border p-8 flex items-start gap-6 transition-all duration-300 ${paymentMethod === "escrow" ? "border-gold-leaf bg-surface-container-lowest shadow-[0_20px_40px_rgba(15,15,15,0.03)]" : "border-on-surface/10 hover:shadow-[0_20px_40px_rgba(15,15,15,0.03)] hover:-translate-y-0.5 bg-surface-container-lowest"}`}>
                        <div className="mt-1">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${paymentMethod === "escrow" ? "border-gold-leaf bg-gold-leaf/10" : "border-on-surface/30"}`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-gold-leaf transition-opacity duration-300 ${paymentMethod === "escrow" ? "opacity-100" : "opacity-0"}`} />
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-sans text-[13px] font-semibold tracking-wider text-ebony-deep uppercase flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Service d'escrow" : "Escrow Service"}
                                </h3>
                                <span className="bg-surface-container-high px-2 py-0.5 font-sans text-[9px] tracking-widest text-charcoal-text font-bold uppercase">{lang === "fr" ? "Recommandé" : "Recommended"}</span>
                              </div>
                              <p className="font-sans text-xs text-on-surface-variant max-w-lg leading-relaxed">{lang === "fr" ? "Les fonds sont conservés en toute sécurité jusqu'à ce que la provenance et l'état physique soient vérifiés à la livraison. Protection complète de l'acheteur." : "Funds are held securely until provenance and physical condition are verified upon delivery. Complete buyer protection."}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="font-sans text-[10px] font-medium text-on-surface-variant block uppercase tracking-wider">{lang === "fr" ? "Délai de traitement" : "Processing Time"}</span>
                              <span className="font-sans text-xs text-ebony-deep font-bold">{lang === "fr" ? "Dépôt instantané" : "Instant Deposit"}</span>
                            </div>
                          </div>
                          {paymentMethod === "escrow" && (
                            <div className="mt-4 border-t border-on-surface/10 pt-5 flex flex-col gap-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                              <p className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Vous serez redirigé en toute sécurité vers Escrow.com pour finaliser le dépôt. Une fois les fonds sécurisés, le bureau curatorial est immédiatement notifié." : "You will be securely redirected to Escrow.com to complete the deposit. Once funds are secured, the curatorial office is notified instantly."}</p>
                              <button onClick={triggerEscrowPayment} type="button" className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer">{lang === "fr" ? "Passer à l'escrow" : "Proceed to Escrow"}</button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card */}
                      <div onClick={() => setPaymentMethod("card")} className={`group relative cursor-pointer border p-8 flex items-start gap-6 transition-all duration-300 ${paymentMethod === "card" ? "border-gold-leaf bg-surface-container-lowest shadow-[0_20px_40px_rgba(15,15,15,0.03)]" : "border-on-surface/10 hover:shadow-[0_20px_40px_rgba(15,15,15,0.03)] hover:-translate-y-0.5 bg-surface-container-lowest"}`}>
                        <div className="mt-1">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${paymentMethod === "card" ? "border-gold-leaf bg-gold-leaf/10" : "border-on-surface/30"}`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-gold-leaf transition-opacity duration-300 ${paymentMethod === "card" ? "opacity-100" : "opacity-0"}`} />
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="font-sans text-[13px] font-semibold tracking-wider text-ebony-deep mb-1 uppercase flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Carte premium" : "Premium Card"}
                              </h3>
                              <p className="font-sans text-xs text-on-surface-variant max-w-lg leading-relaxed">{lang === "fr" ? "Traitement sécurisé via Stripe pour les principales cartes de crédit. Sous réserve des restrictions de limite d'acquisition par carte premium." : "Secure processing via Stripe for major credit cards. Subject to premium card acquisition limit restrictions."}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="font-sans text-[10px] font-medium text-on-surface-variant block uppercase tracking-wider">{lang === "fr" ? "Délai de traitement" : "Processing Time"}</span>
                              <span className="font-sans text-xs text-ebony-deep font-bold">{lang === "fr" ? "Instantané" : "Instant"}</span>
                            </div>
                          </div>
                          {paymentMethod === "card" && (
                            <form onSubmit={processCardPayment} className="mt-4 border-t border-on-surface/10 pt-5 flex flex-col gap-5 cursor-default" onClick={(e) => e.stopPropagation()}>
                              {cardError && (
                                <div className="bg-red-50 border-l-2 border-terracotta-earth p-4 flex gap-2 text-xs text-red-800">
                                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                  <span>{cardError}</span>
                                </div>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{lang === "fr" ? "Nom complet du titulaire" : "Cardholder Full Name"}</label>
                                  <input type="text" required value={card.cardholderName} onChange={(e) => setCard((prev) => ({ ...prev, cardholderName: e.target.value }))} placeholder="e.g. Julian Doe" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{lang === "fr" ? "Numéro de carte" : "Card Number"}</label>
                                  <div className="relative">
                                    <input type="text" required value={card.cardNumber} onChange={handleCardNumberChange} placeholder="4111 2222 3333 4444" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-mono" />
                                    <CreditCard className="absolute right-3 top-2.5 w-4 h-4 text-on-surface-variant/40" />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{lang === "fr" ? "Date d'expiration" : "Expiration Date"}</label>
                                  <input type="text" required value={card.expiry} onChange={handleExpiryChange} placeholder="MM/YY" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-mono" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                                    <span>{lang === "fr" ? "Code de sécurité (CVC)" : "Security Code (CVC)"}</span>
                                    <KeyRound className="w-3.5 h-3.5 text-on-surface-variant/40" />
                                  </label>
                                  <input type="password" required value={card.cvc} onChange={handleCvcChange} placeholder="•••" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-mono" />
                                </div>
                              </div>
                              <div>
                                <button type="submit" className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer">{lang === "fr" ? "Vérifier la carte et finaliser l'acquisition" : "Verify Card & Settle Acquisition"}</button>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security Guarantee */}
                    <div className="border-l-4 border-terracotta-earth bg-surface-container-lowest p-8 flex flex-col md:flex-row gap-6">
                      <ShieldCheck className="w-8 h-8 text-terracotta-earth shrink-0" />
                      <div className="flex flex-col gap-3">
                        <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-ebony-deep leading-none">{lang === "fr" ? "Garantie de sécurité institutionnelle" : "Institutional Security Guarantee"}</h4>
                        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{lang === "fr" ? "Aduna Gallery utilise des protocoles de sécurité numérique de niveau muséal pour garantir la confidentialité et la sécurité absolues de votre transaction." : "Aduna Gallery employs museum-grade digital security protocols to ensure the absolute confidentiality and safety of your transaction."}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-2 font-sans text-xs font-medium text-on-surface-variant">
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-leaf shrink-0" /> {lang === "fr" ? "Chiffrement AES-256 de bout en bout" : "End-to-End AES-256 Encryption"}</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-leaf shrink-0" /> {lang === "fr" ? "Tokenisation conforme PCI DSS Niveau 1" : "PCI DSS Level 1 Compliant Tokenization"}</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-leaf shrink-0" /> {lang === "fr" ? "Preuve à divulgation nulle pour les données de facturation" : "Zero-Knowledge Proof for billing data"}</li>
                        </ul>
                      </div>
                    </div>

                    {/* Support Link */}
                    <div className="flex justify-center">
                      <a href="mailto:support@adunagallery.com?subject=Payment%20Assistance%20-%20{txnRef}" className="text-gold-leaf text-xs font-semibold uppercase tracking-widest hover:underline flex items-center gap-2">
                        <HelpCircle size={12} /> {lang === "fr" ? "Besoin d'aide pour le paiement ? Contacter le support" : "Need help with payment? Contact Support"}
                      </a>
                    </div>

                    <div className="flex justify-between items-center border-t border-on-surface/10 pt-8">
                      <button onClick={() => setCurrentStep("Billing")} className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-2 cursor-pointer border-0 bg-transparent">
                        <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour à la facturation" : "Return to Billing"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 5: CONFIRMATION ─── */}
              {currentStep === "Confirmation" && (
                <motion.div key="confirmation" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="flex flex-col gap-10">
                    <div className="text-center flex flex-col items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gold-leaf/10 flex items-center justify-center text-gold-leaf">
                        <BadgeCheck className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold-leaf font-bold">{lang === "fr" ? "Titre de propriété sécurisé" : "Ownership Title Secured"}</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-ebony-deep font-medium tracking-tight">{lang === "fr" ? "Acquisition confirmée" : "Acquisition Confirmed"}</h2>
                      </div>
                      <p className="font-sans text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                        {lang === "fr" ? "Le paiement pour" : "The payment for"} <strong className="text-ebony-deep">{artwork.title}</strong> {lang === "fr" ? "a été traité. L'actif physique a été mis en attente de transit, et le registre de propriété numérique est terminé." : "has been processed. The physical asset has been locked in transit-hold, and digital title registry is complete."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                      <div className="lg:col-span-7 bg-parchment-ivory border-2 border-double border-gold-leaf/30 p-8 flex flex-col gap-8 justify-between relative shadow-sm">
                        <div className="absolute top-0 right-0 p-4 font-serif text-[9px] text-gold-leaf/25 uppercase font-bold tracking-widest border-b border-l border-gold-leaf/10">{lang === "fr" ? "Entrée officielle du registre" : "Official Ledger Entry"}</div>
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-sans text-[9px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">{lang === "fr" ? "Titre du registre souverain" : "Sovereign Registry Title"}</span>
                            <h3 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Certificat de provenance absolue" : "Certificate of Absolute Provenance"}</h3>
                          </div>
                          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                            {lang === "fr" ? "Le présent document garantit que" : "This record hereby guarantees that"} <strong className="text-ebony-deep">{billing.firstName} {billing.lastName}</strong> {lang === "fr" ? "est le propriétaire enregistré authentifié de" : "is the authenticated registered owner of"} <strong className="text-ebony-deep">{artwork.title}</strong>, {lang === "fr" ? "daté de" : "dated"} {artwork.period}. {lang === "fr" ? "Tous les droits, titres légaux, rapports forensic et actes de garde sont transférés à perpétuité." : "All rights, legal titles, forensics reports, and custody deeds are transferred henceforth in perpetuity."}
                          </p>
                          <div className="border-t border-b border-on-surface/10 py-4 grid grid-cols-2 gap-4 text-xs font-sans">
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">{lang === "fr" ? "ID du registre d'acquisition" : "Acquisition Registry ID"}</span><span className="font-mono font-bold text-ebony-deep block mt-1">{artwork.id}</span></div>
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">{lang === "fr" ? "Réf. de règlement de la transaction" : "Transaction Settlement Ref"}</span><span className="font-mono font-bold text-ebony-deep block mt-1">{txnRef}</span></div>
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">{lang === "fr" ? "Adresse de facturation" : "Billing Address"}</span><span className="font-bold text-ebony-deep block mt-1">{billing.address}, {billing.city}, {billing.country}</span></div>
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">{lang === "fr" ? "Vérification de la datation" : "Dating Verification"}</span><span className="font-bold text-ebony-deep block mt-1">{artwork.period}</span></div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-on-surface/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="font-sans text-[9px] text-on-surface-variant uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-gold-leaf" /> {lang === "fr" ? "Signature cryptographique vérifiablement sécurisée" : "Verifiably secure cryptographic signature"}
                          </div>
                          <button onClick={() => alert("Certificate downloaded (simulated)")} className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-6 py-3 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                            <Download className="w-4 h-4" /> {lang === "fr" ? "Télécharger l'acte légal" : "Download Legal Deed"}
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-surface-container-low border border-on-surface/5 p-8 flex flex-col gap-6 font-sans">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-on-surface/10 pb-3">{lang === "fr" ? "Logistique d'acquisition et prochaines étapes" : "Acquisition Logistics & Next Steps"}</h3>
                        <div className="flex flex-col gap-6 text-sm text-on-surface-variant">
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-gold-leaf/10 text-gold-leaf flex items-center justify-center shrink-0"><Truck className="w-4 h-4" /></div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-ebony-deep text-xs uppercase tracking-wider">{lang === "fr" ? "Transit global blindé (G4S Fine Art)" : "Armored Global Transit (G4S Fine Art)"}</h4>
                              <p className="text-xs text-on-surface-variant leading-relaxed">{lang === "fr" ? "Votre artifact physique est programmé pour la libération du coffre-fort de la Zone franche de Genève. La protection thermique de qualité transit et l'escorte armée le transporteront vers votre coffre-fort désigné." : "Your physical artifact is scheduled for release from the Geneva Freeport vault. Transit-grade thermal protection and armed escort will transport it to your designated vault."}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-gold-leaf/10 text-gold-leaf flex items-center justify-center shrink-0"><LandmarkIcon className="w-4 h-4" /></div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-ebony-deep text-xs uppercase tracking-wider">{lang === "fr" ? "Documentation de transfert légal" : "Legal Handover Documentation"}</h4>
                              <p className="text-xs text-on-surface-variant leading-relaxed">{lang === "fr" ? "Le timbre physique officiel signé et le dossier d'acte de garde légal vous seront remis en main propre à votre destination de remise." : "The official physically signed stamp and legal custody deed dossier will be hand-delivered to you at your handover destination."}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-gold-leaf/10 text-gold-leaf flex items-center justify-center shrink-0"><Calendar className="w-4 h-4" /></div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-ebony-deep text-xs uppercase tracking-wider">{lang === "fr" ? "Contact du responsable de la curation" : "Curation Liaison Contact"}</h4>
                              <p className="text-xs text-on-surface-variant leading-relaxed">{lang === "fr" ? "Notre Directeur de la Garde coordinate avec vous à" : "Our Director of Custody will coordinate with you at"} <strong className="text-ebony-deep">{billing.email}</strong> {lang === "fr" ? "pour finaliser les procédures de dédouanement." : "to finalize port clearance customs procedures."}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center border-t border-on-surface/10 pt-8 mt-4">
                      <a href="/dashboard" className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-2 px-5 py-3 border border-on-surface/20 hover:border-gold-leaf bg-surface-container-lowest">
                        <CheckCircle className="w-3.5 h-3.5" /> {lang === "fr" ? "Accéder au tableau de bord" : "Go to Dashboard"}
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AcquisitionPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-gold-leaf animate-spin" /></div>}>
        <AcquisitionContent />
      </Suspense>
    </>
  );
}
