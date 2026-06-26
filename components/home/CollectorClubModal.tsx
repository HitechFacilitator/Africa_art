"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, Shield, UserCheck, KeyRound } from "lucide-react";
import type { MemberApplication } from "@/lib/types";
import { useTranslate } from "@/lib/translations";
import { dashboardApi } from "@/lib/api";

interface CollectorClubModalProps {
  onClose: () => void;
  onSuccess: (application: MemberApplication) => void;
}

export default function CollectorClubModal({ onClose, onSuccess }: CollectorClubModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [collectorType, setCollectorType] = useState("Private Collector");
  const [investmentLimit, setInvestmentLimit] = useState("€100,000 - €500,000");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [createdPass, setCreatedPass] = useState<MemberApplication | null>(null);
  const [secureId] = useState(() => Math.floor(Math.random() * 89999 + 10000));
  const [submitting, setSubmitting] = useState(false);
  const { lang } = useTranslate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !agreeToTerms) return;
    setSubmitting(true);
    try {
      await dashboardApi.createInquiry({
        artworkTitle: "Collector Club Application",
        category: "General",
        messages: [{ 
          sender: "collector", 
          text: `Collector Club application from ${fullName} (${email}). Classification: ${collectorType}. Budget: ${investmentLimit}.` 
        }],
      });
    } catch (err) {
      console.error("Collector club application failed:", err);
    } finally {
      setSubmitting(false);
      const application: MemberApplication = {
        fullName,
        email,
        collectorProfile: collectorType,
        status: "Pending Review",
      };
      setCreatedPass(application);
      setStep(2);
    }
  };

  const handleCompleteSuccess = () => {
    if (createdPass) {
      onSuccess(createdPass);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ebony-deep/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-parchment-ivory border border-on-surface/10 shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-ebony-deep text-parchment-ivory hover:bg-gold-leaf hover:text-ebony-deep transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="text-center pb-2 border-b border-on-surface/5">
                <div className="flex justify-center mb-2">
                  <Shield size={28} className="text-gold-leaf" />
                </div>
                <h3 className="font-serif text-2xl text-ebony-deep tracking-tight">{lang === "fr" ? "Demander l'Accès Privé" : "Inquire Private Access"}</h3>
                <p className="font-sans text-[11px] uppercase tracking-widest text-gold-leaf mt-1 font-semibold">
                  {lang === "fr" ? "Portail d'Adhésion" : "Membership Onboarding Portal"}
                </p>
                <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 max-w-sm mx-auto">
                  Access to physical safehouse vaults and fractional heritage stakes is restricted to verified family offices and high-net-worth curators.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant/50 mb-1.5">
                    {lang === "fr" ? "Nom Légal Complet" : "Full Legal Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Lord Anatole Kengne"
                    className="w-full border-b border-on-surface/25 bg-transparent font-sans text-xs focus:outline-none focus:border-gold-leaf pb-1.5 text-ebony-deep font-semibold placeholder:text-on-surface-variant/30"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant/50 mb-1.5">
                    {lang === "fr" ? "Email Confidentiel" : "Confidential Email"}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. anatole@private.com"
                    className="w-full border-b border-on-surface/25 bg-transparent font-sans text-xs focus:outline-none focus:border-gold-leaf pb-1.5 text-ebony-deep placeholder:text-on-surface-variant/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant/50 mb-1.5">
                      {lang === "fr" ? "Classification" : "Classification"}
                    </label>
                    <select
                      value={collectorType}
                      onChange={(e) => setCollectorType(e.target.value)}
                      className="w-full border-b border-on-surface/25 bg-transparent font-sans text-xs focus:outline-none focus:border-gold-leaf pb-1.5 text-ebony-deep appearance-none font-semibold"
                    >
                      <option value="Private Collector">Private Collector</option>
                      <option value="Institutional Fund">Institutional Fund</option>
                      <option value="Family Office">Family Office</option>
                      <option value="Museum Trustee">Museum Trustee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant/50 mb-1.5">
                      {lang === "fr" ? "Limite de Budget (EUR)" : "Budget Limit (EUR)"}
                    </label>
                    <select
                      value={investmentLimit}
                      onChange={(e) => setInvestmentLimit(e.target.value)}
                      className="w-full border-b border-on-surface/25 bg-transparent font-sans text-xs focus:outline-none focus:border-gold-leaf pb-1.5 text-ebony-deep appearance-none font-semibold"
                    >
                      <option value="€50,000 - €250,000">€50,000 - €250,000</option>
                      <option value="€250,000 - €1,000,000">€250,000 - €1,000,000</option>
                      <option value="€1,000,000 - €5,000,000">€1,000,000 - €5,000,000</option>
                      <option value="€5,000,000+">€5,000,000+ (Exclusive)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    required
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-0.5 border-on-surface/30 text-gold-leaf focus:ring-gold-leaf w-4 h-4"
                  />
                  <label htmlFor="agree" className="font-sans text-[11px] text-on-surface-variant leading-tight select-none">
                    {lang === "fr" ? "J'atteste que mes informations financières..." : "I attest that my financial information is authentic and that I agree to protect the spatial integrity and carbon verification protocols of the Aduna Private Vault."}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!agreeToTerms || submitting}
                className="w-full bg-ebony-deep hover:bg-gold-leaf hover:text-ebony-deep text-parchment-ivory py-4 font-sans text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (lang === "fr" ? "Soumission..." : "Submitting...") : (lang === "fr" ? "Lancer l'Examen Institutionnel" : "Initiate Institutional Review")}
              </button>
            </form>
          ) : (
            <div className="p-6 sm:p-8 text-center space-y-6">
              <div className="flex justify-center flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3">
                  <UserCheck className="text-emerald-600" size={24} />
                </div>
                <h3 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Identité Sécurisée" : "Identity Secured"}</h3>
                <p className="font-sans text-[11px] text-gold-leaf uppercase font-semibold tracking-widest mt-1">
                  {lang === "fr" ? "Pass d'Accès VVIP Généré" : "VVIP Access Pass Generated"}
                </p>
              </div>

              <div className="bg-ebony-deep text-parchment-ivory p-6 relative shadow-xl border border-gold-leaf/30 flex flex-col justify-between text-left h-72">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold-leaf font-bold">{lang === "fr" ? "Pass Patrimoine Institutionnel" : "Institutional Heritage Pass"}</span>
                    <h4 className="font-serif text-xl tracking-tight mt-1 text-parchment-ivory">{lang === "fr" ? "SIGNEATURE COFFRE-FORT ADUNA" : "ADUNA VAULT SIGNATURE"}</h4>
                  </div>
                  <KeyRound size={24} className="text-gold-leaf" />
                </div>
                <div className="z-10 bg-parchment-ivory/5 p-4 border border-parchment-ivory/10">
                  <div className="font-mono text-xs tracking-wide text-parchment-ivory font-semibold">
                    HOLDER: {fullName.toUpperCase()}
                  </div>
                  <div className="font-mono text-[10px] text-gold-leaf uppercase mt-1">
                    STATUS: {createdPass?.status.toUpperCase()}
                  </div>
                </div>
                <div className="flex justify-between items-end z-10 border-t border-parchment-ivory/10 pt-3">
                  <div className="font-mono text-[9px] text-parchment-ivory/50">
                    <div>SECURE ID: ADUN-{secureId}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-sans text-[9px] text-emerald-400 font-bold uppercase tracking-wider">{lang === "fr" ? "Accès Vérifié Actif" : "Vetted Access Active"}</span>
                  </div>
                </div>
              </div>

              <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                An Aduna executive associate from our Switzerland secure facility is reviewing your assets budget tier.
              </p>

              <button
                onClick={handleCompleteSuccess}
                className="w-full bg-gold-leaf text-ebony-deep hover:bg-ebony-deep hover:text-parchment-ivory py-3.5 font-sans text-xs uppercase tracking-widest font-semibold transition-all"
              >
                {lang === "fr" ? "Accéder au Catalogue Coffre-Fort VVIP" : "Access VVIP Vault Catalog"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}