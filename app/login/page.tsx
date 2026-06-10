"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Fingerprint, ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserSession {
  email: string;
  role: "Private Collector" | "Institutional Member";
  token: string;
  institution?: string;
  securityClearance: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "mfa">("login");
  const [email, setEmail] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [remember, setRemember] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleQuickLogin = (role: "Private Collector" | "Institutional Member") => {
    const session: UserSession = {
      email: role === "Private Collector" ? "collector@heritagevault.com" : "trustee@louvre.fr",
      role,
      token: "HV-SESSION-JWT-99238",
      institution: role === "Institutional Member" ? "Musaic National Trust" : undefined,
      securityClearance: "Level-IV (High Sovereign Asset)",
    };
    localStorage.setItem("aduna_session", JSON.stringify(session));
    router.push("/dashboard");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErrorMsg("Please specify a valid institutional credential."); return; }
    if (!passphrase || passphrase.length < 4) { setErrorMsg("The secret passphrase must be at least 4 characters."); return; }
    setErrorMsg(null);
    setStep("mfa");
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

  const handleConfirmAccess = () => {
    const code = otp.join("");
    if (code.length < 6) { setErrorMsg("Please enter the complete 6-digit cryptographic key."); return; }
    const session: UserSession = {
      email: email || "collector@heritagevault.com",
      role: email.includes("museum") || email.includes("institute") ? "Institutional Member" : "Private Collector",
      token: "HV-AUTHTOKEN-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      institution: email.includes("museum") ? "Metropolitan Gallery Trust" : undefined,
      securityClearance: "Clearance level Alpha-V",
    };
    localStorage.setItem("aduna_session", JSON.stringify(session));
    router.push("/dashboard");
  };

  useEffect(() => { if (step === "mfa") otpRefs.current[0]?.focus(); }, [step]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ebony-deep px-4 sm:px-6 lg:px-8 py-20">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img alt="Secure vault interior" className="w-full h-full object-cover" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC85mj-jAvMmX2GMq9niv7jdwZ6Wx737xyGzsjVQfBCbsSb5S5yBrBFAI16j-6gAFplqtdOyuGNRWg9nQakvCIvxVcTJolp0njmfw3YMjb0e-NDVgqWwxaFFahPdc1Sh8ZXxbRJAUfwwitSFa8PmwCYb5hlEDOJa07H6zyXYSPPblbdEFFsbel3YEbxZxg4p3hEK3X-jM232RsL5iGby2ZjeIITGL4oNTnYjibAIWfp66_fKEe55tne5XfeDVHtCCXr7DH21dWOjg" />
        <div className="absolute inset-0 bg-gradient-to-br from-ebony-deep/90 via-ebony-deep/70 to-ebony-deep/95" />
      </div>

      {/* Decorative Aura */}
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-leaf/5 blur-3xl pointer-events-none" animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-terracotta-earth/5 blur-3xl pointer-events-none" animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
        {/* Left: Brand */}
        <div className="flex-1 w-full text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-display-xl text-parchment-ivory mb-6">Institutional<br className="hidden md:block" /> Access Protocol</h1>
            <p className="font-sans text-lg font-light text-parchment-ivory/60 max-w-md mx-auto md:mx-0 leading-relaxed">Secure authentication for private collectors and institutional members. Aduna Gallery employs military-grade encryption to protect your digital provenance and asset portfolio.</p>
            <div className="mt-12 flex items-center justify-center md:justify-start gap-3.5 text-gold-leaf">
              <ShieldCheck className="w-5 h-5 text-gold-leaf animate-pulse" />
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-gold-leaf/90">End-to-End Encrypted Connection</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Auth Panel */}
        <div className="flex-1 w-full max-w-md mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-gold-leaf/25 to-transparent blur-[6px] opacity-60 group-hover:opacity-85 transition duration-1000" />
          <div className="relative bg-parchment-ivory p-8 sm:p-12 shadow-2xl border border-gold-leaf/15 min-h-[520px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === "login" ? (
                <motion.div key="login" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.35 }} className="w-full flex flex-col justify-between h-full">
                  <div>
                    <div className="text-center mb-10">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-ebony-deep/5 mb-4"><Lock className="w-7 h-7 text-ebony-deep" strokeWidth={1.5} /></div>
                      <h2 className="font-display-lg text-ebony-deep">Collector Login</h2>
                    </div>
                    <form className="space-y-8" onSubmit={handleLoginSubmit}>
                      <div><label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em] block">Identity / Email</label><input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }} className="w-full bg-transparent border-0 border-b border-ebony-deep/15 text-ebony-deep font-sans text-sm md:text-base py-2.5 focus:ring-0 focus:border-gold-leaf transition-colors placeholder:text-on-surface-variant/35 outline-none" placeholder="institutional@address.com" /></div>
                      <div><label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em] block">Passphrase</label><input type="password" required value={passphrase} onChange={(e) => { setPassphrase(e.target.value); setErrorMsg(null); }} className="w-full bg-transparent border-0 border-b border-ebony-deep/15 text-ebony-deep font-sans text-sm md:text-base py-2.5 focus:ring-0 focus:border-gold-leaf transition-colors placeholder:text-on-surface-variant/35 outline-none" placeholder="••••••••••••••••" /></div>
                      {errorMsg && <div className="text-xs text-red-700 bg-red-100/60 p-3 border-l-2 border-red-700">{errorMsg}</div>}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="bg-transparent border-ebony-deep/30 text-ebony-deep focus:ring-gold-leaf rounded-none w-4 h-4" /><span className="font-sans text-xs text-on-surface-variant">Remember Device</span></label>
                        <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg("Please contact institutional security at desk@aduna.com"); }} className="font-sans text-xs text-on-surface-variant hover:text-gold-leaf transition-colors underline underline-offset-4">Forgot Passphrase?</a>
                      </div>
                      <button type="submit" className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.15em] py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors duration-300">Authenticate</button>
                    </form>
                  </div>
                  <div className="mt-10 text-center border-t border-ebony-deep/5 pt-6">
                    <p className="font-sans text-xs text-on-surface-variant">Prospective Member? <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg("Applications are closed for the Q2 sovereign window."); }} className="text-ebony-deep font-medium hover:text-gold-leaf underline transition-colors">Apply for Access</a></p>
                  </div>
                  <div className="mt-6 flex flex-col items-center justify-center gap-1.5 border-t border-dashed border-ebony-deep/5 pt-4">
                    <span className="text-[9px] uppercase tracking-[0.1em] text-on-surface-variant/40">Sovereign Sandbox Clearance Bypass</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleQuickLogin("Private Collector")} className="text-[9px] font-sans px-2.5 py-1 bg-gold-leaf/10 text-ebony-deep hover:bg-gold-leaf/20 transition-colors border border-gold-leaf/25">Collector Sandbox</button>
                      <button onClick={() => handleQuickLogin("Institutional Member")} className="text-[9px] font-sans px-2.5 py-1 bg-ebony-deep/10 text-ebony-deep hover:bg-ebony-deep/20 transition-colors border border-ebony-deep/25">Museum Trustee Sandbox</button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="mfa" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.35 }} className="w-full flex flex-col justify-between h-full">
                  <button onClick={() => { setStep("login"); setErrorMsg(null); }} className="absolute top-0 left-0 text-on-surface-variant hover:text-ebony-deep transition-colors inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-medium"><ArrowLeft className="w-4 h-4" /><span>Back</span></button>
                  <div className="mt-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gold-leaf/5 mb-4"><Fingerprint className="w-7 h-7 text-gold-leaf" strokeWidth={1.5} /></div>
                      <h2 className="font-display-lg text-ebony-deep mb-2">Verify Identity</h2>
                      <p className="font-sans text-xs text-on-surface-variant px-4">Enter the 6-digit credential from your hardware protection unit.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="flex gap-2 justify-center mb-8 w-full max-w-[280px] mx-auto">
                        {otp.map((digit, i) => (
                          <div key={i} className="flex items-center">
                            <input ref={(el) => { otpRefs.current[i] = el; }} type="text" maxLength={1} pattern="[0-9]*" inputMode="numeric" value={digit} onChange={(e) => handleOtpChange(e.target.value, i)} onKeyDown={(e) => handleOtpKeyDown(e, i)} className="w-10 h-12 text-center text-xl font-serif font-medium border-0 border-b-2 border-ebony-deep/20 bg-transparent focus:border-gold-leaf focus:ring-0 text-ebony-deep outline-none placeholder:text-on-surface-variant/20 transition-all" placeholder="0" />
                            {i === 2 && <span className="text-ebony-deep/20 mx-1 flex items-center">-</span>}
                          </div>
                        ))}
                      </div>
                      {errorMsg && <div className="text-xs text-red-700 bg-red-100/60 p-3 border-l-2 border-red-700">{errorMsg}</div>}
                      <button type="button" onClick={handleConfirmAccess} className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.15em] py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors duration-300">Confirm Access</button>
                      <div className="text-center">
                        <button onClick={() => { setOtp(["9", "9", "2", "3", "8", "0"]); setErrorMsg(null); }} className="font-sans text-xs text-on-surface-variant hover:text-gold-leaf underline transition-colors underline-offset-4">Use Backup SMS Authentication Code</button>
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
    </div>
  );
}