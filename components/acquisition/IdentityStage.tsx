"use client";

import { useState, useRef } from "react";
import { User, Mail, Landmark, Upload, FileCheck, AlertCircle } from "lucide-react";
import { useTranslate } from "@/lib/translations";
import type { Artwork } from "@/lib/types";

interface IdentityData {
  fullName: string;
  email: string;
  collectorId: string;
  address: string;
  kycFileName: string | null;
}

interface IdentityStageProps {
  identityData: IdentityData;
  onChange: (data: Partial<IdentityData>) => void;
  onNext: () => void;
  artwork: Artwork;
}

export default function IdentityStage({ identityData, onChange, onNext, artwork }: IdentityStageProps) {
  const { lang } = useTranslate();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityData.fullName.trim()) {
      setError(lang === "fr" ? "Le nom légal complet ou l'organisation est requis." : "Full Legal Name or Organization is required.");
      return;
    }
    if (!identityData.email.trim() || !identityData.email.includes("@")) {
      setError(lang === "fr" ? "Veuillez fournir une adresse e-mail professionnelle valide." : "Please provide a valid professional collector email.");
      return;
    }
    if (!identityData.address.trim()) {
      setError(lang === "fr" ? "L'adresse du coffre-fort ou de la galerie physique est requise." : "Physical Gallery or Vault Registry Address is required.");
      return;
    }
    if (!identityData.kycFileName) {
      setError(lang === "fr" ? "Veuillez télécharger une pièce d'identité ou une documentation KYC valide." : "Please upload a valid Proof of Identity / KYC documentation.");
      return;
    }
    setError(null);
    onNext();
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
      const fileType = file.type;
      if (fileType.includes("pdf") || fileType.includes("jpeg") || fileType.includes("png")) {
        onChange({ kycFileName: file.name });
        setError(null);
      } else {
        setError(lang === "fr" ? "Type de fichier non supporté. Veuillez télécharger un fichier PDF, PNG ou JPEG." : "Unsupported file type. Please upload a PDF, PNG, or JPEG file.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onChange({ kycFileName: file.name });
      setError(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-8 bg-surface-container-lowest p-8 md:p-10 border border-on-surface/5">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-ebony-deep mb-3">
            {lang === "fr" ? "Authentification du Collectionneur" : "Collector Authentication"}
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-xl">
            {lang === "fr"
              ? "Conformément aux accords de préservation du patrimoine souverain et aux normes internationales de lutte contre le blanchiment d'argent, veuillez fournir les identifiants accrédités du collectionneur."
              : "In compliance with sovereign heritage preservation agreements and international AML standards, please provide accredited collector credentials before accessing custody provenance logs."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-2 border-terracotta-earth p-4 flex gap-3 text-sm text-red-800 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-terracotta-earth" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
              <span>{lang === "fr" ? "Nom Légal Complet / Organisation" : "Full Legal Name / Organization"}</span>
              <span className="text-terracotta-earth">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="text"
                value={identityData.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                placeholder={lang === "fr" ? "ex. Baron Maximilian von Hapsburg / Sotheby's Paris" : "e.g. Baron Maximilian von Hapsburg / Sotheby's Paris"}
                className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
              <span>{lang === "fr" ? "E-mail Professionnel" : "Professional Email"}</span>
              <span className="text-terracotta-earth">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="email"
                value={identityData.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder={lang === "fr" ? "ex. collectionneur@heritage-vault.com" : "e.g. collector@heritage-vault.com"}
                className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {lang === "fr" ? "ID de Membre (facultatif)" : "Collector Membership ID (Optional)"}
              </label>
              <div className="relative">
                <Landmark className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="text"
                  value={identityData.collectorId}
                  onChange={(e) => onChange({ collectorId: e.target.value })}
                  placeholder="e.g. HV-9921-XPR"
                  className="w-full bg-parchment-ivory pl-10 pr-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40 uppercase"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
                <span>{lang === "fr" ? "Adresse du Coffre-fort" : "Vault Registry Address"}</span>
                <span className="text-terracotta-earth">*</span>
              </label>
              <input
                type="text"
                value={identityData.address}
                onChange={(e) => onChange({ address: e.target.value })}
                placeholder={lang === "fr" ? "ex. Port Franc de Genève, Coffre B12, Suisse" : "e.g. Port of Geneva Freeports, Vault B12, Switzerland"}
                className="w-full bg-parchment-ivory px-4 py-3 text-sm outline-none border-b border-on-surface/10 focus:border-gold-leaf transition-colors font-sans placeholder-on-surface-variant/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between">
              <span>{lang === "fr" ? "Preuve d'Identité / Registre (KYC)" : "Proof of Identity / Corporate Registry (KYC)"}</span>
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
                  : identityData.kycFileName
                  ? "border-gold-leaf/50 bg-parchment-ivory"
                  : "border-on-surface/20 hover:border-gold-leaf/50 hover:bg-parchment-ivory/50 bg-parchment-ivory/30"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,image/png,image/jpeg"
                className="hidden"
              />
              {identityData.kycFileName ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gold-leaf/10 flex items-center justify-center text-gold-leaf">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-emerald-800">
                      {lang === "fr" ? "Fichier Authentifié avec Succès" : "Successfully Authenticated File"}
                    </p>
                    <p className="font-mono text-xs text-on-surface-variant/80 mt-1">{identityData.kycFileName}</p>
                  </div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60">
                    {lang === "fr" ? "Cliquez ou glissez un nouveau document pour remplacer" : "Click or drag new document to replace"}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-on-surface-variant/5 flex items-center justify-center text-on-surface-variant">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-ebony-deep">
                      {lang === "fr" ? "Glissez-Déposez un Document d'Identité" : "Drag & Drop Identity Document"}
                    </p>
                    <p className="font-sans text-xs text-on-surface-variant mt-1">
                      {lang === "fr" ? "Copie de passeport, Registre (PDF, JPG, PNG)" : "Passport photocopy, Corporate Registry Decree (PDF, JPG, PNG)"}
                    </p>
                  </div>
                  <span className="bg-surface-container-high px-3 py-1 font-sans text-[10px] tracking-wider text-charcoal-text uppercase font-semibold">
                    {lang === "fr" ? "Sélectionner un Fichier" : "Select File Manually"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-on-surface/5">
          <button
            type="submit"
            className="w-full bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-semibold text-xs uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer border-0 flex items-center justify-center gap-2"
          >
            {lang === "fr" ? "S'Authentifier et Continuer vers la Provenance" : "Authenticate & Proceed to Provenance"}
          </button>
        </div>
      </form>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-low border border-on-surface/5 p-6 flex flex-col gap-5 sticky top-28">
          <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-leaf">
            {lang === "fr" ? "Acquisition Active" : "Active Acquisition"}
          </div>
          <div className="aspect-square bg-ebony-deep/5 overflow-hidden border border-on-surface/5 relative">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale opacity-95 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-3 right-3 bg-ebony-deep text-parchment-ivory font-mono text-[10px] px-2.5 py-1 tracking-wider uppercase">
              {artwork.id}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-xl text-ebony-deep leading-tight">{artwork.title}</h3>
            <p className="font-sans text-xs text-on-surface-variant tracking-wide">{artwork.origin}</p>
          </div>
          <div className="border-t border-on-surface/10 pt-4 flex flex-col gap-1">
            <span className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
              {lang === "fr" ? "Évaluation d'Acquisition" : "Acquisition Assessment"}
            </span>
            <span className="font-serif text-2xl font-bold text-ebony-deep">{artwork.investment?.estimatedValue || "Price on Request"}</span>
          </div>
          <div className="bg-surface-container-high/40 p-4 border-l border-gold-leaf text-xs text-on-surface-variant flex flex-col gap-2">
            <strong>{lang === "fr" ? "Protection de l'Acquéreur :" : "Acquirer Safety:"}</strong>
            <p className="leading-relaxed">
              {lang === "fr"
                ? "Cette acquisition comprend une garantie de dépôt institutionnelle. L'escrow conserve votre règlement en toute sécurité jusqu'à ce que l'authentification physique soit vérifiée."
                : "This acquisition features an institutional deposit safeguard. Escrow holds your settlement safely until physical authentication is counter-verified."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
