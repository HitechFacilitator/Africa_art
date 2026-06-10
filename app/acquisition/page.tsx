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
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ARTWORKS } from "@/lib/mockData";
import type { Artwork } from "@/lib/types";

type CheckoutStep = "Identity" | "Provenance" | "Payment" | "Confirmation";
type PaymentMethod = "swift" | "escrow" | "card";

interface IdentityData {
  fullName: string;
  email: string;
  collectorId: string;
  address: string;
  kycFileName: string | null;
}

interface CardData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholderName: string;
}

function AcquisitionContent() {
  const searchParams = useSearchParams();
  const artworkId = searchParams.get("artwork") || ARTWORKS[0]?.id || "";
  const artwork = ARTWORKS.find((a) => a.id === artworkId) || ARTWORKS[0];

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("Identity");
  const [identity, setIdentity] = useState<IdentityData>({
    fullName: "",
    email: "",
    collectorId: "",
    address: "",
    kycFileName: null,
  });
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("escrow");
  const [card, setCard] = useState<CardData>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardholderName: "",
  });
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "submitting" | "verifying">("idle");
  const [stepMsg, setStepMsg] = useState("");
  const [copiedSwift, setCopiedSwift] = useState(false);

  const stepOrder: CheckoutStep[] = ["Identity", "Provenance", "Payment", "Confirmation"];
  const currentIndex = stepOrder.indexOf(currentStep);

  const getStepIndex = (s: CheckoutStep) => stepOrder.indexOf(s);

  const handleIdentityChange = (data: Partial<IdentityData>) => {
    setIdentity((prev) => ({ ...prev, ...data }));
    setIdentityError(null);
  };

  const validateIdentity = () => {
    if (!identity.fullName.trim()) {
      setIdentityError("Full Legal Name or Organization is required.");
      return false;
    }
    if (!identity.email.trim() || !identity.email.includes("@")) {
      setIdentityError("Please provide a valid professional collector email.");
      return false;
    }
    if (!identity.address.trim()) {
      setIdentityError("Physical Gallery or Vault Registry Address is required.");
      return false;
    }
    if (!identity.kycFileName) {
      setIdentityError("Please upload a valid Proof of Identity / KYC documentation.");
      return false;
    }
    setIdentityError(null);
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const ft = file.type;
      if (ft.includes("pdf") || ft.includes("jpeg") || ft.includes("png")) {
        handleIdentityChange({ kycFileName: file.name });
      } else {
        setIdentityError("Unsupported file type. Please upload a PDF, PNG, or JPEG file.");
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIdentityChange({ kycFileName: e.target.files[0].name });
    }
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
    const steps = [
      "Establishing TLS tunnel with Escrow.com API...",
      `Transmitting verified KYC token for ${identity.fullName}...`,
      `Mapping custody asset ID: ${artwork?.id}...`,
      "Awaiting Escrow digital vault settlement invoice...",
      "Sovereign escrow channel established successfully!",
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
      setCardError("Invalid Premium Card Number. Must be a 16-digit card.");
      return;
    }
    if (card.expiry.length < 5) {
      setCardError("Expiry must be in MM/YY format.");
      return;
    }
    if (card.cvc.length < 3) {
      setCardError("Invalid CVC code.");
      return;
    }
    if (!card.cardholderName.trim()) {
      setCardError("Cardholder Name is required.");
      return;
    }
    setCardError(null);
    setPaymentStatus("submitting");
    const cardSteps = [
      "Tokenizing premium card credentials...",
      "Encrypting card parameters via PCI-DSS Level 1 (AES-256)...",
      "Contacting bank card authorized issuer...",
      "Authenticating sovereign limits check for premium acquisition...",
      "Sovereign charge authorization granted!",
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

  const copySwiftDetails = () => {
    setCopiedSwift(true);
    setTimeout(() => setCopiedSwift(false), 2000);
  };

  const txnRef = `HV-TXN-${artwork?.id?.substring(0, 6).toUpperCase() || "000000"}-${identity.fullName.substring(0, 8).replace(/\s+/g, "-").toUpperCase()}`;

  if (!artwork) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant">No artwork selected. Please select an artwork first.</p>
        <a href="/catalogue" className="text-gold-leaf underline text-sm mt-4 inline-block">Browse Catalogue</a>
      </div>
    );
  }

  return (
    <>
      {/* Payment Processing Overlay */}
      <AnimatePresence>
        {paymentStatus !== "idle" && (
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
                  {paymentStatus === "submitting" ? "Securing Transaction Channel" : "Acquisition Certified"}
                </h3>
                <p className="font-sans text-xs uppercase tracking-[0.15em] text-gold-leaf font-bold">
                  Institutional-Grade Encryption Engaged
                </p>
              </div>
              <div className="min-h-[45px] transition-all duration-300">
                <p className="font-mono text-xs text-parchment-ivory/70 bg-parchment-ivory/5 px-4 py-2 border border-parchment-ivory/10">
                  {stepMsg}
                </p>
              </div>
              <p className="font-sans text-[10px] text-parchment-ivory/40">
                Do not close this gateway. Your session is protected by cryptographic end-to-end routing.
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
              <span className="label-caps text-gold-leaf">Secure Checkout</span>
            </div>
            <h1 className="font-display-lg text-parchment-ivory mb-3">Secure Acquisition</h1>
            <p className="font-sans text-sm text-parchment-ivory/60 max-w-lg">
              Complete your acquisition through our institutional-grade checkout —
              identity verification, provenance review, and secure payment.
            </p>
          </div>
        </section>

        {/* Main Container */}
        <div className="max-w-[1000px] mx-auto px-6 md:px-16 py-10 md:py-16">
          {/* Progress Indication */}
          <div className="flex items-center justify-between border-b border-on-surface/10 pb-4 mb-10 text-xs font-semibold uppercase tracking-wider font-sans">
            {stepOrder.map((step, idx) => {
              const isActive = step === currentStep;
              const isCompleted = getStepIndex(step) < currentIndex;
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
                    {idx + 1}. {step}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stage Rendering */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* ─── STEP 1: IDENTITY ─── */}
              {currentStep === "Identity" && (
                <motion.div key="identity" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Form Area */}
                    <div className="lg:col-span-8 flex flex-col gap-8 bg-surface-container-lowest p-8 md:p-10 border border-on-surface/5">
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-ebony-deep mb-3">Collector Authentication</h2>
                        <p className="font-sans text-sm text-on-surface-variant max-w-xl">
                          In compliance with sovereign heritage preservation agreements and international AML standards, please provide accredited collector credentials before accessing custody provenance logs.
                        </p>
                      </div>

                      {identityError && (
                        <div className="bg-red-50 border-l-2 border-terracotta-earth p-4 flex gap-3 text-sm text-red-800 items-start">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-terracotta-earth" />
                          <span>{identityError}</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                            <span>Full Legal Name / Organization</span>
                            <span className="text-terracotta-earth">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                            <input type="text" value={identity.fullName} onChange={(e) => handleIdentityChange({ fullName: e.target.value })} placeholder="e.g. Baron Maximilian von Hapsburg" className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                            <span>Professional Email</span>
                            <span className="text-terracotta-earth">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                            <input type="email" value={identity.email} onChange={(e) => handleIdentityChange({ email: e.target.value })} placeholder="e.g. collector@heritage-vault.com" className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Collector Membership ID (Optional)</label>
                            <div className="relative">
                              <Landmark className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                              <input type="text" value={identity.collectorId} onChange={(e) => handleIdentityChange({ collectorId: e.target.value })} placeholder="e.g. HV-9921-XPR" className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40 uppercase" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                              <span>Vault Registry Address</span>
                              <span className="text-terracotta-earth">*</span>
                            </label>
                            <input type="text" value={identity.address} onChange={(e) => handleIdentityChange({ address: e.target.value })} placeholder="e.g. Port of Geneva Freeports, Vault B12" className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                            <span>Proof of Identity / Corporate Registry (KYC)</span>
                            <span className="text-terracotta-earth">*</span>
                          </label>
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                              isDragging
                                ? "border-gold-leaf bg-gold-leaf/5"
                                : identity.kycFileName
                                ? "border-gold-leaf/50 bg-parchment-ivory"
                                : "border-on-surface/15 hover:border-gold-leaf/50 hover:bg-parchment-ivory/50 bg-parchment-ivory/30"
                            }`}
                          >
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,image/png,image/jpeg" className="hidden" />
                            {identity.kycFileName ? (
                              <>
                                <div className="w-10 h-10 rounded-full bg-gold-leaf/10 flex items-center justify-center text-gold-leaf">
                                  <FileCheck className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-sans text-sm font-medium text-emerald-800">Successfully Authenticated File</p>
                                  <p className="font-mono text-xs text-on-surface-variant/80 mt-1">{identity.kycFileName}</p>
                                </div>
                                <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60">Click or drag new document to replace</p>
                              </>
                            ) : (
                              <>
                                <div className="w-10 h-10 rounded-full bg-on-surface-variant/5 flex items-center justify-center text-on-surface-variant/40">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-sans text-sm font-medium text-ebony-deep">Drag & Drop Identity Document</p>
                                  <p className="font-sans text-xs text-on-surface-variant mt-1">Passport photocopy, Corporate Registry Decree (PDF, JPG, PNG)</p>
                                </div>
                                <span className="bg-surface-container-high px-3 py-1 font-sans text-[10px] tracking-wider text-charcoal-text uppercase font-semibold">Select File Manually</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-on-surface/5">
                        <button
                          onClick={() => {
                            if (validateIdentity()) setCurrentStep("Provenance");
                          }}
                          className="w-full bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                        >
                          Authenticate & Proceed to Provenance <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Artwork Spotlight Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      <div className="bg-surface-container-low border border-on-surface/5 p-6 flex flex-col gap-5 sticky top-24">
                        <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-leaf">Active Acquisition</div>
                        <div className="aspect-square bg-ebony-deep/5 overflow-hidden border border-on-surface/5 relative">
                          <img src={artwork.imageUrl} alt={artwork.title} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale opacity-95 hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute top-3 right-3 bg-ebony-deep text-parchment-ivory font-mono text-[10px] px-2.5 py-1 tracking-wider uppercase">{artwork.id}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-serif text-xl text-ebony-deep leading-tight">{artwork.title}</h3>
                          <p className="font-sans text-xs text-on-surface-variant tracking-wide">{artwork.origin}</p>
                        </div>
                        <div className="border-t border-on-surface/10 pt-4 flex flex-col gap-1">
                          <span className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Acquisition Assessment</span>
                          <span className="font-serif text-2xl font-bold text-ebony-deep">{artwork.investment?.estimatedValue || "Price on Request"}</span>
                        </div>
                        <div className="bg-surface-container-high/40 p-4 border-l border-gold-leaf text-xs text-on-surface-variant flex flex-col gap-2">
                          <strong>Acquirer Safety:</strong>
                          <p className="leading-relaxed">This acquisition features an institutional deposit safeguard. Escrow holds your settlement safely until physical authentication is counter-verified.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 2: PROVENANCE ─── */}
              {currentStep === "Provenance" && (
                <motion.div key="provenance" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold-leaf font-bold">Verified Forensics & Chain of Custody</span>
                      <h2 className="font-serif text-3xl md:text-4xl text-ebony-deep font-medium tracking-tight">Sovereign Provenance Assessment</h2>
                      <p className="font-sans text-base text-on-surface-variant max-w-3xl leading-relaxed">
                        The legal legitimacy and chronological ownership chain of this heritage asset have been validated under standard forensic art academic audit.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      <div className="md:col-span-5 flex flex-col gap-4">
                        <div className="bg-ebony-deep p-4 border border-on-surface/5 relative">
                          <img src={artwork.imageUrl} alt={artwork.title} referrerPolicy="no-referrer" className="w-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute top-6 left-6 bg-gold-leaf text-ebony-deep font-sans text-[10px] font-bold px-3 py-1 tracking-widest uppercase">Curation Standard</div>
                        </div>
                        <div className="bg-surface-container-low border border-on-surface/5 p-5 flex flex-col gap-3 font-sans">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Technical Specifications</h4>
                          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-on-surface-variant border-t border-on-surface/10 pt-3">
                            <div><span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">Origin</span><span className="font-medium text-ebony-deep mt-0.5 block">{artwork.origin}</span></div>
                            <div><span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">Period</span><span className="font-medium text-ebony-deep mt-0.5 block">{artwork.period}</span></div>
                            <div><span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">Medium</span><span className="font-medium text-ebony-deep mt-0.5 block">{artwork.material}</span></div>
                            <div><span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">Dimensions</span><span className="font-medium text-ebony-deep mt-0.5 block font-mono">{artwork.dimensions}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                          <h3 className="font-serif text-2xl text-ebony-deep">Curation Note</h3>
                          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{artwork.historicalStory}</p>
                        </div>

                        <div className="border-l-4 border-terracotta-earth bg-parchment-ivory p-6 md:p-8 flex flex-col gap-6">
                          <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-terracotta-earth shrink-0" />
                            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-ebony-deep">Chronological Chain of Custody</h4>
                          </div>
                          <div className="flex flex-col gap-6 relative pl-3 border-l border-ebony-deep/5">
                            {artwork.provenance.map((provLine, i) => (
                              <div key={i} className="relative group flex flex-col gap-1.5">
                                <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-terracotta-earth border border-parchment-ivory shadow-sm transition-transform group-hover:scale-125" />
                                <span className="font-sans text-sm font-bold text-ebony-deep">{provLine}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-ebony-deep flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-gold-leaf" />
                            Accompanying Legal Deeds (Included in escrow handover)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-on-surface-variant">
                            {["Thermoluminescence Core Dating Report (Oxford Physics Labs)", "Global Art Loss Register Clean Record Registry Certificate", "UNESCO Convention Compliance Certificate of Title Verification", "Heritage Vault Signed Physical Custody Deed"].map((cert, idx) => (
                              <div key={idx} className="bg-surface-container-lowest border border-on-surface/10 p-3 flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-gold-leaf mt-0.5 shrink-0" />
                                <span className="leading-snug">{cert}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center border-t border-on-surface/10 pt-8 gap-4">
                      <button onClick={() => setCurrentStep("Identity")} className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-2 cursor-pointer border-0 bg-transparent">
                        <ArrowLeft className="w-4 h-4" /> Return to Identity
                      </button>
                      <button onClick={() => setCurrentStep("Payment")} className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
                        Approve Provenance & Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 3: PAYMENT ─── */}
              {currentStep === "Payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="flex flex-col gap-12">
                    <div className="text-center flex flex-col gap-3">
                      <h1 className="font-serif text-3xl md:text-4xl text-ebony-deep font-medium">Payment Selection</h1>
                      <p className="font-sans text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                        Select a secure method to finalize the acquisition. All transactions are protected by institutional-grade encryption.
                      </p>
                    </div>

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
                                <LandmarkIcon className="w-4 h-4 text-gold-leaf" /> International Bank Transfer (SWIFT)
                              </h3>
                              <p className="font-sans text-xs text-on-surface-variant max-w-lg leading-relaxed">Direct wire transfer to our secure institutional accounts. Ideal for high-value acquisitions above $500,000.</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="font-sans text-[10px] font-medium text-on-surface-variant block uppercase tracking-wider">Processing Time</span>
                              <span className="font-sans text-xs text-ebony-deep font-bold">1-3 Business Days</span>
                            </div>
                          </div>
                          {paymentMethod === "swift" && (
                            <div className="mt-4 border-t border-on-surface/10 pt-5 flex flex-col gap-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                              <div className="bg-parchment-ivory p-5 border border-on-surface/10 font-mono text-xs text-ebony-deep flex flex-col gap-3">
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">Beneficiary Bank</span><span className="font-bold">CREDIT SUISSE AG (ZURICH LUXURY RESERVE)</span></div>
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">Account Name</span><span className="font-bold">ADUNA GALLERY LLC</span></div>
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">IBAN Code</span><span className="font-bold">CH93 0070 0000 8821 9920 A</span></div>
                                <div className="flex justify-between items-center border-b border-ebony-deep/5 pb-2"><span className="text-[10px] text-on-surface-variant/70 uppercase">SWIFT/BIC</span><span className="font-bold">CSZHCH22XXXX</span></div>
                                <div className="flex justify-between items-center pb-1"><span className="text-[10px] text-on-surface-variant/70 uppercase">Reference</span><span className="font-bold text-terracotta-earth font-mono">{txnRef}</span></div>
                              </div>
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button onClick={copySwiftDetails} type="button" className="w-full sm:w-auto border border-ebony-deep/10 hover:border-gold-leaf text-ebony-deep font-sans text-[11px] font-semibold uppercase tracking-wider px-6 py-3 transition-all cursor-pointer bg-transparent">{copiedSwift ? "Swift IBAN Copied ✓" : "Copy IBAN Details"}</button>
                                <button onClick={() => setCurrentStep("Confirmation")} type="button" className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-[11px] font-semibold uppercase tracking-wider px-8 py-3.5 cursor-pointer transition-colors">Confirm Order & Get SWIFT Bill</button>
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
                                  <Shield className="w-4 h-4 text-gold-leaf" /> Escrow Service
                                </h3>
                                <span className="bg-surface-container-high px-2 py-0.5 font-sans text-[9px] tracking-widest text-charcoal-text font-bold uppercase">Recommended</span>
                              </div>
                              <p className="font-sans text-xs text-on-surface-variant max-w-lg leading-relaxed">Funds are held securely until provenance and physical condition are verified upon delivery. Complete premium buyer protection.</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="font-sans text-[10px] font-medium text-on-surface-variant block uppercase tracking-wider">Processing Time</span>
                              <span className="font-sans text-xs text-ebony-deep font-bold">Instant Deposit</span>
                            </div>
                          </div>
                          {paymentMethod === "escrow" && (
                            <div className="mt-4 border-t border-on-surface/10 pt-5 flex flex-col gap-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                              <p className="font-sans text-xs text-on-surface-variant">You will be securely redirected to Escrow.com to complete the deposit. Once Escrow secures the funds, the curatorial office is notified instantly.</p>
                              <button onClick={triggerEscrowPayment} type="button" className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer">Proceed to Escrow</button>
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
                                <CreditCard className="w-4 h-4 text-gold-leaf" /> Premium Card
                              </h3>
                              <p className="font-sans text-xs text-on-surface-variant max-w-lg leading-relaxed">Secure processing via Stripe for major credit cards. Subject to premium card acquisition limit restrictions.</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="font-sans text-[10px] font-medium text-on-surface-variant block uppercase tracking-wider">Processing Time</span>
                              <span className="font-sans text-xs text-ebony-deep font-bold">Instant</span>
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
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Cardholder Full Name</label>
                                  <input type="text" required value={card.cardholderName} onChange={(e) => setCard((prev) => ({ ...prev, cardholderName: e.target.value }))} placeholder="e.g. Maximilian von Hapsburg" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Premium Card Number</label>
                                  <div className="relative">
                                    <input type="text" required value={card.cardNumber} onChange={handleCardNumberChange} placeholder="4111 2222 3333 4444" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-mono" />
                                    <CreditCard className="absolute right-3 top-2.5 w-4 h-4 text-on-surface-variant/40" />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Expiration Date</label>
                                  <input type="text" required value={card.expiry} onChange={handleExpiryChange} placeholder="MM/YY" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-mono" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                                    <span>Security Code (CVC)</span>
                                    <KeyRound className="w-3.5 h-3.5 text-on-surface-variant/40" />
                                  </label>
                                  <input type="password" required value={card.cvc} onChange={handleCvcChange} placeholder="•••" className="w-full bg-parchment-ivory px-3 py-2.5 text-xs outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-mono" />
                                </div>
                              </div>
                              <div>
                                <button type="submit" className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer">Verify Card & Settle Acquisition</button>
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
                        <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-ebony-deep leading-none">Institutional Security Guarantee</h4>
                        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">Aduna Gallery employs museum-grade digital security protocols to ensure the absolute confidentiality and safety of your transaction.</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-2 font-sans text-xs font-medium text-on-surface-variant">
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-leaf shrink-0" /> End-to-End AES-256 Encryption</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-leaf shrink-0" /> PCI DSS Level 1 Compliant Tokenization</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-leaf shrink-0" /> Zero-Knowledge Proof for KYC data</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-on-surface/10 pt-8">
                      <button onClick={() => setCurrentStep("Provenance")} className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-2 cursor-pointer border-0 bg-transparent">
                        <ArrowLeft className="w-4 h-4" /> Return to Provenance
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 4: CONFIRMATION ─── */}
              {currentStep === "Confirmation" && (
                <motion.div key="confirmation" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="flex flex-col gap-10">
                    <div className="text-center flex flex-col items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gold-leaf/10 flex items-center justify-center text-gold-leaf">
                        <BadgeCheck className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold-leaf font-bold">Ownership Title Secured</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-ebony-deep font-medium tracking-tight">Acquisition Confirmed</h2>
                      </div>
                      <p className="font-sans text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                        The escrow transaction for <strong className="text-ebony-deep">{artwork.title}</strong> has been cleared. The physical asset has been locked in transit-hold, and digital title registry is complete.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                      <div className="lg:col-span-7 bg-parchment-ivory border-2 border-double border-gold-leaf/30 p-8 flex flex-col gap-8 justify-between relative shadow-sm">
                        <div className="absolute top-0 right-0 p-4 font-serif text-[9px] text-gold-leaf/25 uppercase font-bold tracking-widest border-b border-l border-gold-leaf/10">Official Ledger Entry</div>
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-sans text-[9px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">Sovereign Registry Title</span>
                            <h3 className="font-serif text-2xl text-ebony-deep">Certificate of Absolute Provenance</h3>
                          </div>
                          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                            This record hereby guarantees that <strong className="text-ebony-deep">{identity.fullName}</strong> is the authenticated registered owner of <strong className="text-ebony-deep">{artwork.title}</strong>, dated {artwork.period}. All rights, legal titles, forensics reports, and custody deeds are transferred henceforth in perpetuity.
                          </p>
                          <div className="border-t border-b border-on-surface/10 py-4 grid grid-cols-2 gap-4 text-xs font-sans">
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Acquisition Registry ID</span><span className="font-mono font-bold text-ebony-deep block mt-1">{artwork.id}</span></div>
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Transaction Settlement Ref</span><span className="font-mono font-bold text-ebony-deep block mt-1">{txnRef}</span></div>
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Registry Address</span><span className="font-bold text-ebony-deep block mt-1">{identity.address}</span></div>
                            <div><span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Dating Verification</span><span className="font-bold text-ebony-deep block mt-1">{artwork.period}</span></div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-on-surface/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="font-sans text-[9px] text-on-surface-variant uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-gold-leaf" /> Verifiably secure cryptographic signature
                          </div>
                          <button onClick={() => alert("Certificate downloaded (simulated)")} className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-6 py-3 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                            <Download className="w-4 h-4" /> Download Legal Deed
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-surface-container-low border border-on-surface/5 p-8 flex flex-col gap-6 font-sans">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-on-surface/10 pb-3">Acquisition Logistics & Next Steps</h3>
                        <div className="flex flex-col gap-6 text-sm text-on-surface-variant">
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-gold-leaf/10 text-gold-leaf flex items-center justify-center shrink-0"><Truck className="w-4 h-4" /></div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-ebony-deep text-xs uppercase tracking-wider">Armored Global Transit (G4S Fine Art)</h4>
                              <p className="text-xs text-on-surface-variant leading-relaxed">Your physical artifact is scheduled for release from the Geneva Freeport vault. Transit-grade thermal protection and armed G4S escort will transport it to your designated vault.</p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-gold-leaf/10 text-gold-leaf flex items-center justify-center shrink-0"><LandmarkIcon className="w-4 h-4" /></div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-ebony-deep text-xs uppercase tracking-wider">Legal Handover Documentation</h4>
                              <p className="text-xs text-on-surface-variant leading-relaxed">The official physically signed stamp and legal custody deed dossier will be hand-delivered to you at your handover destination.</p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-gold-leaf/10 text-gold-leaf flex items-center justify-center shrink-0"><Calendar className="w-4 h-4" /></div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-ebony-deep text-xs uppercase tracking-wider">Curation Liaison Contact</h4>
                              <p className="text-xs text-on-surface-variant leading-relaxed">Our Director of Custody will coordinate with you at <strong className="text-ebony-deep">{identity.email}</strong> to finalize port clearance customs procedures.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center border-t border-on-surface/10 pt-8 mt-4">
                      <a href="/dashboard" className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-2 px-5 py-3 border border-on-surface/20 hover:border-gold-leaf bg-surface-container-lowest">
                        <CheckCircle className="w-3.5 h-3.5" /> Go to Dashboard
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
