"use client";

import { Award, ArrowLeft, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useTranslate } from "@/lib/translations";
import type { Artwork } from "@/lib/types";

interface ProvenanceStageProps {
  artwork: Artwork;
  onBack: () => void;
  onNext: () => void;
}

export default function ProvenanceStage({ artwork, onBack, onNext }: ProvenanceStageProps) {
  const { lang } = useTranslate();

  const provenanceLogs = artwork.provenance || [];
  const certificates = [
    lang === "fr" ? "Certificat d'Authenticité Numérique (COA)" : "Digital Certificate of Authenticity (COA)",
    lang === "fr" ? "Rapport d'Analyse Chimique" : "Chemical Analysis Report",
    lang === "fr" ? "Certificat de Provenance Vérifié" : "Verified Provenance Certificate",
    lang === "fr" ? "Rapport d'Inspection Physique" : "Physical Inspection Report",
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold-leaf font-bold">
          {lang === "fr" ? "Forensique Vérifiée et Chaîne de Garde" : "Verified Forensics & Chain of Custody"}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-ebony-deep font-medium tracking-tight">
          {lang === "fr" ? "Évaluation de Provenance Souveraine" : "Sovereign Provenance Assessment"}
        </h2>
        <p className="font-sans text-base text-on-surface-variant max-w-3xl leading-relaxed">
          {lang === "fr"
            ? "La légitimité juridique et la chaîne de propriété chronologique de cet actif patrimonial ont été validées selon un audit universitaire forensic artistique standard."
            : "The legal legitimacy and chronological ownership chain of this heritage asset have been validated under standard forensic art academic audit. View cataloging details below."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-ebony-deep p-4 border border-on-surface/10 relative">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              referrerPolicy="no-referrer"
              className="w-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-6 left-6 block bg-gold-leaf text-ebony-deep font-sans text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
              {lang === "fr" ? "Standard de Curatelle" : "Curation Standard"}
            </div>
          </div>

          <div className="bg-surface-container-low border border-on-surface/5 p-5 flex flex-col gap-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {lang === "fr" ? "Spécifications Techniques" : "Technical Specifications"}
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-on-surface-variant border-t border-on-surface/10 pt-3">
              <div>
                <span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">{lang === "fr" ? "Origine" : "Origin"}</span>
                <span className="font-medium text-ebony-deep mt-0.5 block">{artwork.origin}</span>
              </div>
              <div>
                <span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">{lang === "fr" ? "Période" : "Period"}</span>
                <span className="font-medium text-ebony-deep mt-0.5 block">{artwork.period}</span>
              </div>
              <div>
                <span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">{lang === "fr" ? "Support" : "Medium"}</span>
                <span className="font-medium text-ebony-deep mt-0.5 block">{artwork.material}</span>
              </div>
              <div>
                <span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">{lang === "fr" ? "Dimensions" : "Dimensions"}</span>
                <span className="font-medium text-ebony-deep mt-0.5 block font-mono">{artwork.dimensions}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Note de Curatelle" : "Curation Note"}</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{artwork.historicalStory}</p>
          </div>

          {provenanceLogs.length > 0 && (
            <div className="border-l-4 border-terracotta-earth bg-parchment-ivory p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-terracotta-earth shrink-0" />
                <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-ebony-deep">
                  {lang === "fr" ? "Chaîne Chronologique de Garde" : "Chronological Chain of Custody"}
                </h4>
              </div>
              <div className="flex flex-col gap-6 relative pl-3 border-l border-ebony-deep/5">
                {provenanceLogs.map((log, idx) => (
                  <div key={idx} className="relative group flex flex-col gap-1.5">
                    <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-terracotta-earth border border-parchment-ivory shadow-sm transition-transform group-hover:scale-125" />
                    <p className="font-sans text-xs text-ebony-deep leading-relaxed">{log}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-ebony-deep flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-leaf" />
              {lang === "fr" ? "Actes Légaux Accompagnants (Inclus dans la remise escrow)" : "Accompanying Legal Deeds (Included in escrow handover)"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-on-surface-variant">
              {certificates.map((cert, idx) => (
                <div key={idx} className="bg-surface-container-lowest border border-on-surface/10 p-3 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-gold-leaf mt-0.5 shrink-0" />
                  <span className="leading-snug">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t border-on-surface/10 pt-8 gap-4">
        <button
          onClick={onBack}
          className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-2 cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "fr" ? "Retour à l'Identité" : "Return to Identity"}
        </button>
        <button
          onClick={onNext}
          className="w-full sm:w-auto bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory font-semibold text-xs uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer border-0 flex items-center justify-center gap-2"
        >
          {lang === "fr" ? "Approuver la Provenance et Continuer" : "Approve Provenance & Continue"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
