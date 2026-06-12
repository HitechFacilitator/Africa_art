"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 12, label: "At least 12 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[a-z]/.test(p), label: "One lowercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "One special character" },
];

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "France",
  "Germany",
  "Switzerland",
  "Nigeria",
  "South Africa",
  "Kenya",
  "Ghana",
  "Senegal",
  "Canada",
  "Australia",
  "Japan",
  "UAE",
  "Other",
];

function RegistrationForm() {
  const searchParams = useSearchParams();
  const invitationCode = searchParams.get("code") || "";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code, setCode] = useState(invitationCode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+44");
  const [country, setCountry] = useState("United Kingdom");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptGdpr, setAcceptGdpr] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [resending, setResending] = useState(false);

  const passwordValid = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmitStep1 = code.trim().length > 0;
  const canSubmitStep2 = firstName && lastName && email && phone && country;
  const canSubmitStep3 = passwordValid && passwordsMatch && acceptTerms && acceptGdpr;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitStep3) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setRegistered(true);
    }, 2000);
  };

  const handleResendEmail = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-ebony-deep py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">Private Access</span>
            </div>
            <h1 className="font-display-lg text-parchment-ivory mb-2">
              {emailConfirmed ? "Account Activated" : registered ? "Check Your Email" : "Create Your Account"}
            </h1>
            <p className="font-sans text-sm text-parchment-ivory/60">
              {emailConfirmed
                ? "Your account has been activated. You may now access the private collector space."
                : registered
                ? "A validation email has been sent to your inbox. Please confirm to activate your account."
                : "Register with your personalised invitation code to access the Aduna Gallery private collector space."}
            </p>
          </div>
        </section>

        <div className="max-w-xl mx-auto px-6 py-12 md:py-16">
          <AnimatePresence mode="wait">
            {emailConfirmed ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-gold-leaf mx-auto mb-6" />
                <h2 className="font-serif text-2xl text-ebony-deep mb-3">Welcome to Aduna Gallery</h2>
                <p className="font-sans text-sm text-on-surface-variant mb-8">
                  Your account is now active. You have full access to the private collector dashboard, certificates, and acquisition tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/dashboard"
                    className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors inline-block"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/catalogue"
                    className="border border-ebony-deep/20 text-ebony-deep font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:border-gold-leaf hover:text-gold-leaf transition-colors inline-block"
                  >
                    Browse Collection
                  </Link>
                </div>
              </motion.div>
            ) : registered ? (
              <motion.div
                key="registered"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Clock className="w-16 h-16 text-gold-leaf mx-auto mb-6" />
                <h2 className="font-serif text-2xl text-ebony-deep mb-3">Email Validation Required</h2>
                <p className="font-sans text-sm text-on-surface-variant mb-2">
                  We have sent a validation link to <strong>{email}</strong>.
                </p>
                <p className="font-sans text-xs text-on-surface-variant/60 mb-8">
                  Please check your inbox and click the validation link to activate your account. The link will expire in 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend Validation Email"}
                  </button>
                  <button
                    onClick={() => setEmailConfirmed(true)}
                    className="border border-gold-leaf text-gold-leaf font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-gold-leaf/10 transition-colors"
                  >
                    I Have Confirmed My Email
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-0 mb-10">
                  {[1, 2, 3].map((s, idx) => (
                    <div key={s} className="flex items-center">
                      <button
                        onClick={() => s <= step && setStep(s as 1 | 2 | 3)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-0 bg-transparent ${
                          step === s ? "text-gold-leaf" : step > s ? "text-ebony-deep" : "text-on-surface-variant/40"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            step === s ? "bg-gold-leaf text-ebony-deep" : step > s ? "bg-ebony-deep text-parchment-ivory" : "bg-surface-container-high text-on-surface-variant/40"
                          }`}
                        >
                          {step > s ? "✓" : s}
                        </span>
                        <span className="hidden sm:inline">{s === 1 ? "Invitation" : s === 2 ? "Details" : "Security"}</span>
                      </button>
                      {idx < 2 && <div className={`w-8 h-[1.5px] mx-1 ${step > s ? "bg-ebony-deep" : "bg-surface-container-high"}`} />}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Step 1: Invitation Code */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">Invitation Code *</label>
                        <input
                          type="text"
                          required
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full border border-ebony-deep/15 p-3.5 text-sm focus:border-gold-leaf focus:outline-none font-mono"
                          placeholder="e.g. ADUNA-INV-2024-XXXX"
                        />
                        <p className="text-[10px] text-on-surface-variant/60 mt-1.5">
                          Enter the personalised code received in your invitation email.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Details */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">First Name *</label>
                          <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-sm focus:border-gold-leaf focus:outline-none" placeholder="Julian" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">Last Name *</label>
                          <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-sm focus:border-gold-leaf focus:outline-none" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">Email *</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-sm focus:border-gold-leaf focus:outline-none" placeholder="collector@institution.com" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">Phone *</label>
                        <div className="flex">
                          <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} className="border border-ebony-deep/15 border-r-0 p-3 text-sm focus:border-gold-leaf focus:outline-none bg-surface-container-low w-24 shrink-0">
                            <option>+44</option><option>+1</option><option>+33</option><option>+49</option><option>+41</option><option>+234</option><option>+27</option><option>+254</option>
                          </select>
                          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-sm focus:border-gold-leaf focus:outline-none" placeholder="7700 900000" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">Country *</label>
                        <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border border-ebony-deep/15 p-3 text-sm focus:border-gold-leaf focus:outline-none">
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Password + Consent */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">Password *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-ebony-deep/15 p-3 pr-10 text-sm focus:border-gold-leaf focus:outline-none"
                            placeholder="Min. 12 characters"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-ebony-deep">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <div className="mt-2 space-y-1">
                          {PASSWORD_RULES.map((rule) => (
                            <div key={rule.label} className="flex items-center gap-1.5">
                              <CheckCircle2 size={10} className={rule.test(password) ? "text-emerald-600" : "text-on-surface-variant/30"} />
                              <span className={`text-[10px] ${rule.test(password) ? "text-emerald-600" : "text-on-surface-variant/50"}`}>{rule.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1.5">Confirm Password *</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full border p-3 pr-10 text-sm focus:outline-none ${passwordsMatch ? "border-emerald-600" : "border-ebony-deep/15 focus:border-gold-leaf"}`}
                            placeholder="Re-enter password"
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-ebony-deep">
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {confirmPassword.length > 0 && !passwordsMatch && (
                          <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={10} /> Passwords do not match</p>
                        )}
                      </div>
                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-0.5 accent-gold-leaf" />
                          <span className="text-[11px] text-on-surface-variant leading-relaxed">
                            I accept the <span className="text-gold-leaf font-semibold">Terms &amp; Conditions</span> and <span className="text-gold-leaf font-semibold">Privacy Policy</span> of Aduna Gallery. *
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={acceptGdpr} onChange={(e) => setAcceptGdpr(e.target.checked)} className="mt-0.5 accent-gold-leaf" />
                          <span className="text-[11px] text-on-surface-variant leading-relaxed">
                            I consent to the processing of my personal data in accordance with <span className="text-gold-leaf font-semibold">GDPR regulations</span>. I understand my data will be used for account management and transaction processing. *
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t border-on-surface/5">
                    <button
                      type="button"
                      onClick={() => setStep(Math.max(1, step - 1) as 1 | 2 | 3)}
                      disabled={step === 1}
                      className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                    >
                      ← Back
                    </button>
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                        disabled={step === 1 ? !canSubmitStep1 : !canSubmitStep2}
                        className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 flex items-center gap-2"
                      >
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!canSubmitStep3 || submitting}
                        className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors disabled:opacity-30 cursor-pointer border-0 flex items-center gap-2"
                      >
                        {submitting ? "Creating Account..." : "Create Account"}
                      </button>
                    )}
                  </div>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="font-sans text-xs text-on-surface-variant">
                    Already have an account?{" "}
                    <Link href="/login" className="text-gold-leaf font-semibold hover:text-ebony-deep transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="flex-1">
            <section className="bg-ebony-deep py-12 md:py-16">
              <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
                <div className="animate-pulse">
                  <div className="h-4 w-32 bg-parchment-ivory/20 mb-3" />
                  <div className="h-10 w-64 bg-parchment-ivory/20" />
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      }
    >
      <RegistrationForm />
    </Suspense>
  );
}
