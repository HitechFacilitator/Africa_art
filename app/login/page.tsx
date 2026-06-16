"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Fingerprint, ArrowLeft, ShieldCheck, Clock, AlertCircle, User, Crown, Briefcase, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslate } from "@/lib/translations";
import { useAuth, type Role } from "@/lib/auth";
import LoadingModal from "@/components/ui/LoadingModal";

const MAX_ATTEMPTS = 3;
const OTP_EXPIRY_SECONDS = 60;

export default function LoginPage() {
  const router = useRouter();
  const { lang } = useTranslate();
  const { login, loginAs, verifyOTP } = useAuth();
  const [step, setStep] = useState<"login" | "mfa">("login");
  const [email, setEmail] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [remember, setRemember] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [otpTimer, setOtpTimer] = useState(OTP_EXPIRY_SECONDS);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Lockout countdown
  useEffect(() => {
    if (!lockedOut || lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          setLockedOut(false);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedOut, lockoutTimer]);

  // OTP expiry countdown
  useEffect(() => {
    if (step !== "mfa" || otpTimer <= 0 || otpExpired) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, otpTimer, otpExpired]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleQuickLogin = async (role: Role) => {
    await loginAs(role);
    if (role === "admin") router.push("/admin");
    else if (role === "advisor") router.push("/advisor");
    else router.push("/dashboard");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedOut) {
      setErrorMsg(`${lang === "fr" ? "Compte temporairement verrouillé. Veuillez réessayer dans" : "Account temporarily locked. Try again in"} ${formatTimer(lockoutTimer)}.`);
      return;
    }
    if (!email) { setErrorMsg(lang === "fr" ? "Veuillez entrer une adresse email valide." : "Please specify a valid email address."); return; }
    if (!passphrase || passphrase.length < 4) { setErrorMsg(lang === "fr" ? "Le mot de passe doit contenir au moins 4 caractères." : "The password must be at least 4 characters."); return; }
    setErrorMsg(null);
    setLoginLoading(true);

    const result = await login(email, passphrase);
    setLoginLoading(false);
    if (!result.success) {
      setErrorMsg(result.error || "Invalid credentials.");
      return;
    }
    if (result.requiresOTP) {
      setStep("mfa");
      setOtpTimer(OTP_EXPIRY_SECONDS);
      setOtpExpired(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/[^0-9]/gi.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) { const newOtp = [...otp]; newOtp[index - 1] = ""; setOtp(newOtp); otpRefs.current[index - 1]?.focus(); }
      else { const newOtp = [...otp]; newOtp[index] = ""; setOtp(newOtp); }
    }
  };

  const handleConfirmAccess = async () => {
    const code = otp.join("");
    if (code.length < 6) { setErrorMsg(lang === "fr" ? "Veuillez entrer le code complet à 6 chiffres." : "Please enter the complete 6-digit code."); return; }
    if (otpExpired) { setErrorMsg(lang === "fr" ? "Le code OTP a expiré. Veuillez demander un nouveau code." : "OTP code has expired. Please request a new code."); return; }

    const newAttempts = failedAttempts + 1;
    if (newAttempts >= MAX_ATTEMPTS) {
      setLockedOut(true);
      setLockoutTimer(300);
      setErrorMsg(`${lang === "fr" ? "Tentatives échouées trop nombreuses. Compte verrouillé pour 5 minutes." : "Too many failed attempts. Account locked for 5 minutes."}`);
      setStep("login");
      return;
    }

    setLoginLoading(true);
    const result = await verifyOTP(code);
    setLoginLoading(false);
    if (result.success && result.user) {
      if (result.user.role === "admin") router.push("/admin");
      else if (result.user.role === "advisor") router.push("/advisor");
      else router.push("/dashboard");
    } else {
      setFailedAttempts(newAttempts);
      setErrorMsg(lang === "fr" ? "Code invalide. Veuillez réessayer." : "Invalid code. Please try again.");
    }
  };

  const handleResendOtp = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setOtpTimer(OTP_EXPIRY_SECONDS);
      setOtpExpired(false);
      setOtp(["", "", "", "", "", ""]);
      setErrorMsg(null);
    }, 1500);
  };

  useEffect(() => { if (step === "mfa") otpRefs.current[0]?.focus(); }, [step]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ebony-deep px-4 sm:px-6 lg:px-8 py-6">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img alt="Secure vault interior" className="w-full h-full object-cover" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC85mj-jAvMmX2GMq9niv7jdwZ6Wx737xyGzsjVQfBCbsSb5S5yBrBFAI16j-6gAFplqtdOyuGNRWg9nQakvCIvxVcTJolp0njmfw3YMjb0e-NDVgqWwxaFFahPdc1Sh8ZXxbRJAUfwwitSFa8PmwCYb5hlEDOJa07H6zyXYSPPblbdEFFsbel3YEbxZxg4p3hEK3X-jM232RsL5iGby2ZjeIITGL4oNTnYjibAIWfp66_fKEe55tne5XfeDVHtCCXr7DH21dWOjg" />
        <div className="absolute inset-0 bg-gradient-to-br from-ebony-deep/90 via-ebony-deep/70 to-ebony-deep/95" />
      </div>

      {/* Decorative Aura */}
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-leaf/5 blur-3xl pointer-events-none" animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-terracotta-earth/5 blur-3xl pointer-events-none" animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Left: Brand */}
        <div className="flex-1 w-full text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-display-xl text-parchment-ivory mb-6">Institutional<br className="hidden md:block" /> Access Protocol</h1>
            <p className="font-sans text-lg font-light text-parchment-ivory/60 max-w-md mx-auto md:mx-0 leading-relaxed">Secure authentication for private collectors and institutional members. Aduna Gallery employs military-grade encryption to protect your digital provenance and asset portfolio.</p>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-3.5 text-gold-leaf">
              <ShieldCheck className="w-5 h-5 text-gold-leaf animate-pulse" />
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-gold-leaf/90">End-to-End Encrypted Connection</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Auth Panel */}
        <div className="flex-1 w-full max-w-md mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-gold-leaf/25 to-transparent blur-[6px] opacity-60 group-hover:opacity-85 transition duration-1000" />
          <div className="relative bg-parchment-ivory p-6 sm:p-8 shadow-2xl border border-gold-leaf/15 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === "login" ? (
                <motion.div key="login" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.35 }} className="w-full flex flex-col justify-between h-full">
                  <div>
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-ebony-deep/5 mb-3"><Lock className="w-6 h-6 text-ebony-deep" strokeWidth={1.5} /></div>
                      <h2 className="font-display-lg text-ebony-deep">Collector Login</h2>
                    </div>

                    {lockedOut && (
                      <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-700 flex items-start gap-3">
                        <AlertCircle size={16} className="text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-red-700">{lang === "fr" ? "Verrouillage du Compte" : "Account Lockout"}</p>
                          <p className="text-[10px] text-red-700/80 mt-1">{lang === "fr" ? "Tentatives échouées trop nombreuses. Veuillez réessayer dans " : "Too many failed attempts. Please try again in "}{formatTimer(lockoutTimer)}.</p>
                        </div>
                      </div>
                    )}

                    <form className="space-y-5" onSubmit={handleLoginSubmit}>
                      <div><label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em] block">{lang === "fr" ? "Adresse Email" : "Email Address"}</label><input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }} className="w-full bg-transparent border-0 border-b border-ebony-deep/15 text-ebony-deep font-sans text-sm md:text-base py-2.5 focus:ring-0 focus:border-gold-leaf transition-colors placeholder:text-on-surface-variant/35 outline-none" placeholder="institutional@address.com" disabled={lockedOut} /></div>
                      <div><label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em] block">{lang === "fr" ? "Mot de Passe" : "Password"}</label><input type="password" required value={passphrase} onChange={(e) => { setPassphrase(e.target.value); setErrorMsg(null); }} className="w-full bg-transparent border-0 border-b border-ebony-deep/15 text-ebony-deep font-sans text-sm md:text-base py-2.5 focus:ring-0 focus:border-gold-leaf transition-colors placeholder:text-on-surface-variant/35 outline-none" placeholder="••••••••••••••••" disabled={lockedOut} /></div>
                      {errorMsg && <div className="text-xs text-red-700 bg-red-100/60 p-3 border-l-2 border-red-700">{errorMsg}</div>}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="bg-transparent border-ebony-deep/30 text-ebony-deep focus:ring-gold-leaf rounded-none w-4 h-4" /><span className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Se souvenir de moi" : "Remember me"}</span></label>
                        <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg("Please contact institutional security at desk@aduna.com"); }} className="font-sans text-xs text-on-surface-variant hover:text-gold-leaf transition-colors underline underline-offset-4">{lang === "fr" ? "Mot de Passe Oublié ?" : "Forgot Password?"}</a>
                      </div>
                      <button type="submit" disabled={lockedOut} className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.15em] py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{lang === "fr" ? "Se Connecter" : "Sign In"}</button>
                    </form>
                  </div>
                  <div className="mt-6 text-center border-t border-ebony-deep/5 pt-4">
                    <p className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Vous n'avez pas de compte ?" : "Don't have an account?"} <Link href="/register" className="text-ebony-deep font-medium hover:text-gold-leaf underline transition-colors">{lang === "fr" ? "S'inscrire" : "Register"}</Link></p>
                  </div>
                  <div className="mt-4 flex flex-col items-center justify-center gap-1.5 border-t border-dashed border-ebony-deep/5 pt-3">
                    <span className="text-[9px] uppercase tracking-[0.1em] text-on-surface-variant/40">{lang === "fr" ? "Accès Rapide aux Rôles" : "Quick Role Access"}</span>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      <button onClick={() => handleQuickLogin("collector")} className="text-[9px] font-sans px-2 py-1 bg-gold-leaf/10 text-ebony-deep hover:bg-gold-leaf/20 transition-colors border border-gold-leaf/25 flex items-center gap-1">
                        <User size={10} /> Collector
                      </button>
                      <button onClick={() => handleQuickLogin("prestige")} className="text-[9px] font-sans px-2 py-1 bg-gold-leaf/15 text-ebony-deep hover:bg-gold-leaf/25 transition-colors border border-gold-leaf/30 flex items-center gap-1">
                        <Crown size={10} /> Prestige
                      </button>
                      <button onClick={() => handleQuickLogin("advisor")} className="text-[9px] font-sans px-2 py-1 bg-terracotta-earth/10 text-ebony-deep hover:bg-terracotta-earth/20 transition-colors border border-terracotta-earth/25 flex items-center gap-1">
                        <Briefcase size={10} /> Advisor
                      </button>
                      <button onClick={() => handleQuickLogin("admin")} className="text-[9px] font-sans px-2 py-1 bg-ebony-deep/10 text-ebony-deep hover:bg-ebony-deep/20 transition-colors border border-ebony-deep/25 flex items-center gap-1">
                        <Shield size={10} /> Admin
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="mfa" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.35 }} className="w-full flex flex-col justify-between h-full">
                  <button onClick={() => { setStep("login"); setErrorMsg(null); }} className="absolute top-0 left-0 text-on-surface-variant hover:text-ebony-deep transition-colors inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-medium"><ArrowLeft className="w-4 h-4" /><span>Back</span></button>
                  <div className="mt-4">
                    <div className="text-center mb-5">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-leaf/5 mb-3"><Fingerprint className="w-6 h-6 text-gold-leaf" strokeWidth={1.5} /></div>
                      <h2 className="font-display-lg text-ebony-deep mb-2">Verify Identity</h2>
                      <p className="font-sans text-xs text-on-surface-variant px-4">Enter the 6-digit code sent to your registered email address.</p>
                    </div>

                    {/* OTP Timer */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Clock size={12} className={otpExpired ? "text-red-600" : "text-gold-leaf"} />
                      <span className={`font-mono text-sm font-bold ${otpExpired ? "text-red-600" : "text-ebony-deep"}`}>
                        {formatTimer(otpTimer)}
                      </span>
                      {otpExpired && (
                        <span className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Expired</span>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div className="flex gap-2 justify-center mb-5 w-full max-w-[280px] mx-auto">
                        {otp.map((digit, i) => (
                          <div key={i} className="flex items-center">
                            <input ref={(el) => { otpRefs.current[i] = el; }} type="text" maxLength={1} pattern="[0-9]*" inputMode="numeric" value={digit} onChange={(e) => handleOtpChange(e.target.value, i)} onKeyDown={(e) => handleOtpKeyDown(e, i)} className="w-10 h-12 text-center text-xl font-serif font-medium border-0 border-b-2 border-ebony-deep/20 bg-transparent focus:border-gold-leaf focus:ring-0 text-ebony-deep outline-none placeholder:text-on-surface-variant/20 transition-all" placeholder="0" />
                            {i === 2 && <span className="text-ebony-deep/20 mx-1 flex items-center">-</span>}
                          </div>
                        ))}
                      </div>
                      {errorMsg && <div className="text-xs text-red-700 bg-red-100/60 p-3 border-l-2 border-red-700">{errorMsg}</div>}
                      <button type="button" onClick={handleConfirmAccess} disabled={otpExpired} className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.15em] py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Confirm Access</button>
                      <div className="text-center">
                        <button onClick={handleResendOtp} disabled={resending || (!otpExpired && otpTimer > 0)} className="font-sans text-xs text-on-surface-variant hover:text-gold-leaf transition-colors underline underline-offset-4 disabled:opacity-40 disabled:cursor-not-allowed">
                          {resending ? "Sending new code..." : otpExpired ? "Resend Code" : "Use Backup SMS Authentication Code"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 z-10 text-center">
        <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-parchment-ivory/30">Aduna Gallery Trust Custody Group &copy; 2026. All Rights Reserved.</p>
      </footer>

      <LoadingModal
        isOpen={loginLoading}
        message={lang === "fr" ? "Authentification en cours..." : "Authenticating..."}
        submessage={lang === "fr" ? "Vérification des identifiants de placement privé." : "Verifying private placement credentials."}
      />
    </div>
  );
}
