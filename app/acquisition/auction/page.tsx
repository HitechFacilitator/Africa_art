"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gavel,
  CreditCard,
  CheckCircle,
  Clock,
  Lock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  User,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface AuctionWinner {
  lotId: string;
  title: string;
  origin: string;
  period: string;
  material: string;
  imageUrl: string;
  winningBid: number;
  auctionDate: string;
  auctionHouse: string;
  buyerPremium: number;
  totalDue: number;
}

const MOCK_WINNER: AuctionWinner = {
  lotId: "ADUNA-AUC-2026-047",
  title: "Benin Bronze Relief Plaque",
  origin: "Kingdom of Benin, Nigeria",
  period: "16th Century",
  material: "Bronze",
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxXscArJs7jm8fkVlA0HIef3hG7nB9zqwOK7BCT6Qu4klQbMUWYQgZqPNbqpJRq-MwcmGhf4mmYLiUVINuSkXR8rBU8F1ZHRF8wchLVhgPk5iAS5xT3kjYy85IbKAaxp70n1aUl_n6zBrAIntKg2Sp49BQ_UhCYts4FHBnX2N1rN3ZdNIZQ5CPx1Y-T76d-vIAr0xDMJeZ_ubf0t8oewNFH_fr-mVjel_xdJ3NupPP1Ijd0IfN5O_AXdbDAUX428Enhm26KLL0Ew",
  winningBid: 2400000,
  auctionDate: "2026-06-08",
  auctionHouse: "Aduna Gallery",
  buyerPremium: 264000,
  totalDue: 2664000,
};

export default function AuctionAcquisitionPage() {
  const [winner] = useState<AuctionWinner>(MOCK_WINNER);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingOrg, setBillingOrg] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wire");
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeBuyerPremium, setAgreeBuyerPremium] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(72 * 60 * 60);
  const [paymentRef] = useState(() => `ADUNA-PAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  useEffect(() => {
    const interval = setInterval(() => {
      setPaymentTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("de-CH", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(amount);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCompleted(true);
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header with Timer */}
        <section className="bg-ebony-deep py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gavel size={12} className="text-gold-leaf" />
                  <span className="label-caps text-gold-leaf">Auction Winner</span>
                </div>
                <h1 className="font-display-lg text-parchment-ivory mb-2">Complete Your Acquisition</h1>
                <p className="font-sans text-sm text-parchment-ivory/60 max-w-lg">
                  Congratulations on winning lot {winner.lotId}. Complete your payment
                  and shipping details to finalize ownership transfer.
                </p>
              </div>
              <div className="bg-parchment-ivory/5 border border-gold-leaf/15 p-5 text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gold-leaf/70 mb-1">Payment Window</p>
                <p className={`font-mono text-2xl text-parchment-ivory font-bold tracking-wider ${paymentTimer < 3600 ? "animate-pulse" : ""}`}>{formatTimer(paymentTimer)}</p>
                <p className="text-[9px] text-parchment-ivory/40 mt-1">Remaining to complete payment</p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <div className="bg-surface-container border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-4">
            <div className="flex items-center justify-center">
              {[
                { num: 1, label: "Billing Details", icon: User },
                { num: 2, label: "Payment Method", icon: CreditCard },
                { num: 3, label: "Confirm & Pay", icon: CheckCircle },
              ].map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={s.num} className="flex items-center">
                    <button
                      onClick={() => s.num <= step && setStep(s.num as 1 | 2 | 3)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-0 bg-transparent ${
                        step === s.num ? "text-gold-leaf" : step > s.num ? "text-ebony-deep" : "text-on-surface-variant/40"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step === s.num ? "bg-gold-leaf text-ebony-deep" : step > s.num ? "bg-ebony-deep text-parchment-ivory" : "bg-surface-container-high text-on-surface-variant/40"
                      }`}>
                        {step > s.num ? <CheckCircle size={14} /> : <Icon size={14} />}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                    {idx < 2 && <div className={`w-12 h-[1.5px] mx-2 ${step > s.num ? "bg-ebony-deep" : "bg-surface-container-high"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12 md:py-16">
          {completed ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center py-16">
              <CheckCircle className="w-16 h-16 text-gold-leaf mx-auto mb-6" />
              <h2 className="font-serif text-2xl text-ebony-deep mb-3">Payment Confirmed</h2>
              <p className="font-sans text-sm text-on-surface-variant mb-6">
                Your acquisition of <strong>{winner.title}</strong> has been finalized.
                Ownership transfer is being processed and you will receive confirmation within 24 hours.
              </p>
              <div className="bg-surface-container-low border border-on-surface/5 p-6 mb-8 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Transaction ID</span>
                  <span className="font-mono text-ebony-deep font-semibold">{paymentRef}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Total Paid</span>
                  <span className="text-ebony-deep font-semibold">{formatCurrency(winner.totalDue)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Lot</span>
                  <span className="text-ebony-deep font-semibold">{winner.lotId}</span>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <a href="/dashboard" className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors inline-block">
                  Go to Dashboard
                </a>
                <button className="border border-on-surface/20 text-on-surface-variant px-6 py-3 text-xs uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors bg-transparent cursor-pointer flex items-center gap-1.5">
                  <Download size={12} /> Download Receipt
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Billing */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-xl text-ebony-deep mb-6">Billing Information</h2>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">Full Legal Name *</label>
                            <input type="text" required value={billingName} onChange={(e) => setBillingName(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface" placeholder="Julian Doe" />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">Email *</label>
                            <input type="email" required value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface" placeholder="collector@institution.com" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">Organization / Institution</label>
                          <input type="text" value={billingOrg} onChange={(e) => setBillingOrg(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface" placeholder="Family Office or Museum" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">Billing Address *</label>
                          <textarea rows={2} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface resize-none" placeholder="Full billing address..." />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">Country *</label>
                          <input type="text" value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface" placeholder="Switzerland" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-xl text-ebony-deep mb-2">Payment Method</h2>
                      <p className="text-xs text-on-surface-variant mb-6">Select your preferred payment method. All transactions are processed through institutional escrow.</p>

                      <div className="mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: "wire", label: "Wire Transfer", sub: "Institutional Escrow" },
                            { id: "crypto", label: "Crypto (BTC/ETH)", sub: "Coinbase Commerce" },
                            { id: "escrow", label: "Third-Party Escrow", sub: "Escrow.com" },
                          ].map((pm) => (
                            <button
                              key={pm.id}
                              onClick={() => setPaymentMethod(pm.id)}
                              className={`p-4 border text-left transition-all cursor-pointer bg-transparent ${
                                paymentMethod === pm.id ? "border-gold-leaf bg-surface-container-low" : "border-on-surface/10 hover:border-gold-leaf/50"
                              }`}
                            >
                              <p className="text-xs font-bold text-ebony-deep">{pm.label}</p>
                              <p className="text-[10px] text-on-surface-variant mt-0.5">{pm.sub}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {paymentMethod === "wire" && (
                        <div className="space-y-4">
                          <div className="bg-surface-container-low border border-on-surface/5 p-6">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">Wire Transfer Instructions</p>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between"><span className="text-on-surface-variant">Bank</span><span className="text-ebony-deep font-semibold">UBS AG, Geneva</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant">Account Name</span><span className="text-ebony-deep font-semibold">Aduna Gallery Escrow S.A.</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant">IBAN</span><span className="font-mono text-ebony-deep font-semibold">CH93 0024 3243 7689 1200 1</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant">SWIFT/BIC</span><span className="font-mono text-ebony-deep font-semibold">UBSWCHZH80A</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant">Reference</span><span className="font-mono text-ebony-deep font-semibold">{winner.lotId}</span></div>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">Bank Name</label>
                            <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface" placeholder="Your bank name" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">SWIFT Code</label>
                              <input type="text" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface font-mono" placeholder="UBSWCHZH" />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1.5">Account Number</label>
                              <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full border border-on-surface/15 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface" placeholder="Your account number" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Confirm */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="font-serif text-xl text-ebony-deep mb-2">Confirm &amp; Finalize</h2>
                      <p className="text-xs text-on-surface-variant mb-6">Review your order and confirm payment to complete the acquisition.</p>

                      <div className="bg-surface-container-low border border-on-surface/5 p-6 mb-6">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Order Summary</h3>
                        <div className="flex items-center gap-4 pb-4 border-b border-on-surface/5">
                          <div className="w-16 h-16 bg-ebony-deep overflow-hidden shrink-0">
                            <img src={winner.imageUrl} alt={winner.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ebony-deep">{winner.title}</p>
                            <p className="text-[10px] text-on-surface-variant">{winner.origin} · {winner.material}</p>
                            <p className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest mt-0.5">Lot {winner.lotId}</p>
                          </div>
                        </div>
                        <div className="space-y-2 pt-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">Winning Bid</span>
                            <span className="text-ebony-deep font-medium">{formatCurrency(winner.winningBid)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">Buyer&apos;s Premium (11%)</span>
                            <span className="text-ebony-deep font-medium">{formatCurrency(winner.buyerPremium)}</span>
                          </div>
                          <div className="flex justify-between text-xs pt-2 border-t border-on-surface/5">
                            <span className="text-ebony-deep font-bold">Total Due</span>
                            <span className="text-ebony-deep font-bold text-base">{formatCurrency(winner.totalDue)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 accent-[#C5A059]" />
                          <span className="text-xs text-on-surface-variant leading-relaxed">
                            I agree to the <span className="text-gold-leaf font-semibold">Terms of Sale</span>,{' '}
                            <span className="text-gold-leaf font-semibold">Buyer&apos;s Agreement</span>, and{' '}
                            <span className="text-gold-leaf font-semibold">Privacy Policy</span>.
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={agreeBuyerPremium} onChange={(e) => setAgreeBuyerPremium(e.target.checked)} className="mt-0.5 accent-[#C5A059]" />
                          <span className="text-xs text-on-surface-variant leading-relaxed">
                            I acknowledge the {formatCurrency(winner.buyerPremium)} buyer&apos;s premium and the total
                            payment of {formatCurrency(winner.totalDue)} due within 72 hours of auction close.
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-10 pt-6 border-t border-on-surface/5">
                  <button
                    onClick={() => setStep(Math.max(1, step - 1) as 1 | 2 | 3)}
                    disabled={step === 1}
                    className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 bg-transparent flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  {step < 3 ? (
                    <button
                      onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                      className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-2"
                    >
                      Continue <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!agreeTerms || !agreeBuyerPremium || submitting}
                      className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 flex items-center gap-2"
                    >
                      {submitting ? (
                        <><Clock className="w-3.5 h-3.5 animate-spin" /> Processing Payment...</>
                      ) : (
                        <><Lock className="w-3.5 h-3.5" /> Confirm &amp; Pay {formatCurrency(winner.totalDue)}</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-surface-container-low border border-on-surface/5 p-6 sticky top-24">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Lot Details</h3>
                  <div className="space-y-3">
                    <div className="aspect-[4/5] bg-ebony-deep overflow-hidden relative">
                      <img src={winner.imageUrl} alt={winner.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 left-2 bg-ebony-deep/80 backdrop-blur-sm px-2 py-1 border border-gold-leaf/20">
                        <span className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest">SOLD</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{winner.period}</p>
                      <p className="text-sm font-bold text-ebony-deep">{winner.title}</p>
                      <p className="text-[10px] text-on-surface-variant">{winner.origin}</p>
                    </div>
                    <div className="border-t border-on-surface/5 pt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Hammer Price</span>
                        <span className="text-ebony-deep font-semibold">{formatCurrency(winner.winningBid)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Premium (11%)</span>
                        <span className="text-ebony-deep font-medium">{formatCurrency(winner.buyerPremium)}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-on-surface/5">
                        <span className="text-ebony-deep font-bold">Total Due</span>
                        <span className="text-ebony-deep font-bold">{formatCurrency(winner.totalDue)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800">Payment must be completed within 72 hours of auction close to avoid lot reassignment.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}