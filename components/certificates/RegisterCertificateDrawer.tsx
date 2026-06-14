"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, Sparkles, FolderKanban, Plus, Check, Eye } from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface NewCertificate {
  title: string;
  period: string;
  region: string;
  certifyingBody: string;
  valuationEstimate: string;
  medium: string;
  dimensions: string;
  imageUrl: string;
}

interface RegisterCertificateDrawerProps {
  onClose: () => void;
  onRegister: (cert: NewCertificate) => void;
}

const PRESET_IMAGES = [
  {
    name: "Royal Ivory Vessel",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrH4ZfobnFGYghmICkBPVAdvFO1TfJO5bDrbRm2Xw09wWwX4ANPwZSmp8U5ofOhJPS-Q1FWurwy-pJMM9_iFpWwBsmvZgK7RZHkzO0pifgsLGLip2BzD96ZZYGSls3QXVKaxjqJiii2BCTeDRfaGtC6_IhzFwEnFrtMqwotlmLZJJIWEDBOniqv4ioGhLu20MfCE1MAyvaUmD48DlZ3zKhltoGPvIxu0_XaQD6STlM5xLbHLglP5DZ5b0gUY8gLOJDvm11lllb8Q",
  },
  {
    name: "Terracotta Sentry",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7slTtCBh58BVd4al3GJN7EzkMFsVfbdOIdgWKb7AgF0oZfMaNd0uTeCjM7C5jI7NpCLJtGD6iuLOHHJaME7stABWJqD9VWwOq6h6bY6J0Wj82jq4WyJ2T3mFAiZ8jW0_lYm9iLDyLyOlXodpnbTcY7tEtAxcTkpzSD97bx2fCHDn-Kl8bICq-sedH3Ju4u2cAocAbkE02QCDq7FA5omONj1fR3t78FlozI0U3IYS0iP4NRDARcp3shyeiRTg3ZgvCttA68j-FgA",
  },
  {
    name: "Impasto Cohesion",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL97TrPM9qEB-ohvc4n3apEkeTT_PFIq-2E3Ya5IOXYbwh7okKiKgyB_Ter0oXXj0opwuaagw0bqGKQXJtT1__ZCMbGwHYDq2bjH5dECtIPb1Xjk5Gxo6AUXn1nLMrc3MrOEE-7S1aF-W6aucl1M_SItRYGv57N-rrNlOVLH6fpx4BkHCCIeFiir5693SHI9cH1KrFs8ooSrxYQouVNIOkInJjEl_qHZTKUJBi5Q6HQw9tenKJRry7MgpDIXh0qWdM5uFkb0-caA",
  },
];

export default function RegisterCertificateDrawer({ onClose, onRegister }: RegisterCertificateDrawerProps) {
  const { lang } = useTranslate();
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [region, setRegion] = useState("");
  const [certifyingBody, setCertifyingBody] = useState("");
  const [valuation, setValuation] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!title.trim() || !period.trim() || !region.trim() || !certifyingBody.trim()) {
      setValidationError(lang === "fr" ? "Tous les champs principaux du certificat doivent être remplis." : "All core certificate fields must be completed.");
      return;
    }

    const finalImage = useCustomUrl ? customUrl.trim() : imageUrl;

    onRegister({
      title: title.trim(),
      period: period.trim(),
      region: region.trim(),
      certifyingBody: certifyingBody.trim(),
      valuationEstimate: valuation.trim() || "Private Advisory Placement",
      medium: medium.trim() || "Organic handworked material",
      dimensions: dimensions.trim() || "Proportions archived",
      imageUrl: finalImage,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="text-center md:text-left mb-10 border-b border-ebony-deep/10 pb-6">
        <span className="font-mono text-xs text-gold-leaf tracking-[0.2em] uppercase font-bold block mb-2">
          {lang === "fr" ? "Expansion de Portefeuille" : "Portfolio Expansion"}
        </span>
        <h2 className="font-serif text-4xl text-ebony-deep mb-3 tracking-tight">
          {lang === "fr" ? "Enregistrer un Certificat" : "Register Metadata Certificate"}
        </h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          {lang === "fr"
            ? "Enregistrez les paramètres métadonnées historiques et les nœuds de provenance initiaux pour les acquisitions vérifiées."
            : "Log pristine historical metadata parameters and initial provenance nodes for verified acquisitions. Each registration generates an encrypted portfolio token."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-parchment-ivory border border-ebony-deep/10 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-serif text-xl text-ebony-deep tracking-tight border-b border-ebony-deep/15 pb-2 mb-2 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-terracotta-earth" />
              {lang === "fr" ? "1. Informations Curatoriales" : "1. Curatorial Information"}
            </h3>

            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3">{validationError}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                  {lang === "fr" ? "Titre de l'Œuvre / Masque" : "Artwork / Mask Title"}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === "fr" ? "ex. Plaque Oba Royale" : "e.g. Royal Oba Cast Plaque"}
                  className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1.5 text-sm font-sans tracking-wide transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                  {lang === "fr" ? "Période Estimée" : "Estimated Period / Age"}
                </label>
                <input
                  type="text"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder={lang === "fr" ? "ex. c. XVIe siècle" : "e.g. c. 16th Century"}
                  className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1.5 text-sm font-sans tracking-wide transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                  {lang === "fr" ? "Région d'Origine Tribale" : "Region of Tribal Origin"}
                </label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder={lang === "fr" ? "ex. Bénin, Nigeria" : "e.g. Benin, Nigeria"}
                  className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1.5 text-sm font-sans tracking-wide transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                  {lang === "fr" ? "Organisme Certifiant" : "Certifying Board Organization"}
                </label>
                <input
                  type="text"
                  required
                  value={certifyingBody}
                  onChange={(e) => setCertifyingBody(e.target.value)}
                  placeholder={lang === "fr" ? "ex. Conseil des Antiquités d'Afrique de l'Ouest" : "e.g. West African Antiquities Council"}
                  className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1.5 text-sm font-sans tracking-wide transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-ebony-deep/5 pt-4">
              <div>
                <label className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                  {lang === "fr" ? "Estimation de Valeur" : "Valuation Estimate"}
                </label>
                <input
                  type="text"
                  value={valuation}
                  onChange={(e) => setValuation(e.target.value)}
                  placeholder="e.g. €620,000"
                  className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1 text-sm font-sans tracking-wide transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                  {lang === "fr" ? "Matériaux" : "Media / Materials"}
                </label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder={lang === "fr" ? "ex. Alliage de bronze" : "e.g. Bronze Alloy cast"}
                  className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1 text-sm font-sans tracking-wide transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                  {lang === "fr" ? "Dimensions Physiques" : "Physical Dimensions"}
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 42 cm x 30 cm"
                  className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1 text-sm font-sans tracking-wide transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-parchment-ivory border border-ebony-deep/10 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-serif text-xl text-ebony-deep tracking-tight border-b border-ebony-deep/15 pb-2 mb-2">
              {lang === "fr" ? "2. Image d'Authentification Visuelle" : "2. Visual Authentication Image"}
            </h3>

            <div className="flex flex-col gap-3">
              <span className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block">
                {lang === "fr" ? "Choisir une image prédéfinie" : "Choose Museum preset representation"}
              </span>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setUseCustomUrl(false);
                    }}
                    className={`p-1.5 border transition-all flex flex-col gap-1 items-center bg-surface cursor-pointer ${
                      !useCustomUrl && imageUrl === preset.url ? "border-gold-leaf bg-gold-leaf/5" : "border-ebony-deep/10 hover:border-gold-leaf"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-16 object-cover grayscale-[15%] group-hover:grayscale-[0%] transition-all"
                    />
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-ebony-deep block text-center truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-ebony-deep/10 pt-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={useCustomUrl}
                  onChange={(e) => setUseCustomUrl(e.target.checked)}
                  className="accent-gold-leaf"
                />
                <span className="font-sans text-[10px] font-bold tracking-[0.05em] uppercase text-ebony-deep">
                  {lang === "fr" ? "Utiliser une URL d'image personnalisée" : "Use Custom Image URL Link"}
                </span>
              </label>
              {useCustomUrl && (
                <div className="relative">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-transparent border-b border-ebony-deep/20 focus:border-gold-leaf outline-none py-1.5 text-sm font-sans tracking-wide transition-colors"
                  />
                  <span className="text-[9px] text-on-surface-variant block mt-1">
                    {lang === "fr" ? "Fournissez un lien URL pour l'affichage." : "Provide a hotlink URL to display inside your digital cabinet."}
                  </span>
                </div>
              )}
            </div>

            <div className="border border-ebony-deep/5 bg-surface p-3 mt-2">
              <span className="font-mono text-[9px] tracking-widest text-on-surface-variant uppercase block mb-2">
                {lang === "fr" ? "Aperçu du Cabinet" : "Live Cabinet Preview"}
              </span>
              <div className="h-44 w-full bg-[#111] overflow-hidden flex items-center justify-center relative">
                <img
                  src={useCustomUrl ? customUrl || "https://images.unsplash.com/photo-1547891301-15809092ea1c" : imageUrl}
                  alt="Live preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[10%]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1547891301-15809092ea1c";
                  }}
                />
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] tracking-widest font-semibold uppercase px-2 py-0.5">
                  PRE-APPROVED
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-ebony-deep text-parchment-ivory py-3.5 text-xs tracking-widest font-semibold uppercase hover:bg-gold-leaf hover:text-ebony-deep transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0"
          >
            <Sparkles className="w-4 h-4 text-gold-leaf" />
            {lang === "fr" ? "Certifier et Ajouter au Coffre-fort" : "Certify & Add to Vault Portfolio"}
          </button>
        </div>
      </form>
    </div>
  );
}
