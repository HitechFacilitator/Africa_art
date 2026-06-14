"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Award, ShieldCheck, Printer, Landmark } from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface PrintCertificateData {
  title: string;
  period: string;
  region: string;
  referenceId: string;
  certifyingBody: string;
  valuationEstimate: string;
  imageUrl: string;
}

interface PrintCertificateModalProps {
  certificate: PrintCertificateData | null;
  onClose: () => void;
}

export default function PrintCertificateModal({ certificate, onClose }: PrintCertificateModalProps) {
  const { lang } = useTranslate();
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const mockSHA256 = "SHA256://" + Array.from({ length: 24 }, () =>
    "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
  ).join("") + "-CUSTODY";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-deep/85 backdrop-blur-md print:bg-white print:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#faf7f2] w-full max-w-3xl border-8 border-double border-gold-leaf/40 p-8 shadow-2xl relative text-ebony-deep print:border-8 print:shadow-none print:w-full print:max-w-none print:h-full print:absolute print:inset-0"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-gold-leaf transition-colors cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="border border-gold-leaf/25 p-6 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-1/4 flex justify-center text-gold-leaf/3 select-none pointer-events-none">
              <Landmark className="w-96 h-96 transform rotate-12" />
            </div>

            <div className="flex flex-col items-center gap-2 mb-6">
              <Award className="w-10 h-10 text-gold-leaf" />
              <span className="font-sans text-[11px] font-bold tracking-[0.25em] uppercase text-gold-leaf">
                {lang === "fr" ? "Mandat Institutionnel d'Antiquité" : "Institutional Mandate of Antiquity"}
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-ebony-deep tracking-tight mb-2">
              {lang === "fr" ? "Certificat d'Authenticité" : "Certificate of Authenticity"}
            </h1>

            <p className="font-sans text-xs italic text-on-surface-variant max-w-lg leading-relaxed mb-6">
              {lang === "fr"
                ? "Ce document certifie solennellement que l'artefact enregistré décrit ci-dessous a subi une analyse carbone rigoureuse, un examen physique inspectoral et des vérifications chronologiques du registre."
                : "This document solemnly certifies that the registered artifact described below has undergone rigorous carbon analysis, physical inspectoral examination, and chronological ledger checks."}
            </p>

            <div className="w-full max-w-lg border-t border-b border-gold-leaf/20 py-5 my-4 grid grid-cols-2 gap-y-4 gap-x-6 text-left relative z-10">
              <div>
                <span className="text-on-surface-variant uppercase tracking-widest text-[9px] block mb-0.5">
                  {lang === "fr" ? "Titre d'Enregistrement" : "Asset Registration Title"}
                </span>
                <span className="font-serif text-lg text-ebony-deep font-semibold">{certificate.title}</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase tracking-widest text-[9px] block mb-0.5">
                  {lang === "fr" ? "Époque Chronologique" : "Chronological Epoch / Age"}
                </span>
                <span className="font-sans text-sm font-semibold text-ebony-deep">{certificate.period}</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase tracking-widest text-[9px] block mb-0.5">
                  {lang === "fr" ? "Coordonnées Culturelles d'Origine" : "Origin Cultural Coordinates"}
                </span>
                <span className="font-sans text-sm font-semibold text-ebony-deep">{certificate.region}</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase tracking-widest text-[9px] block mb-0.5">
                  {lang === "fr" ? "Référence du Registre Sécurisé" : "Secure Ledger Reference ID"}
                </span>
                <span className="font-mono text-xs font-semibold text-gold-leaf tracking-wider uppercase">{certificate.referenceId}</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase tracking-widest text-[9px] block mb-0.5">
                  {lang === "fr" ? "Organisme Certifiant" : "Authorizing Certifying Body"}
                </span>
                <span className="font-sans text-xs font-semibold text-ebony-deep">{certificate.certifyingBody}</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase tracking-widest text-[9px] block mb-0.5">
                  {lang === "fr" ? "Évaluation de la Galerie" : "Assessed Gallery Valuation"}
                </span>
                <span className="font-sans text-xs font-semibold text-terracotta-earth">{certificate.valuationEstimate || "€450,000"}</span>
              </div>
            </div>

            <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-6 relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-double border-gold-leaf/50 flex flex-col items-center justify-center p-1 bg-gold-leaf/5 mb-1.5">
                  <ShieldCheck className="w-8 h-8 text-gold-leaf" />
                </div>
                <span className="font-sans text-[8px] font-bold tracking-widest uppercase text-gold-leaf text-center">
                  {lang === "fr" ? "SCEAU D'OR DE RÉTROSPECTIVE" : "GOLD FOIL SEAL OF RETROSPECTIVE"}
                </span>
              </div>

              <div className="flex flex-col items-center border-t border-ebony-deep/15 pt-2">
                <span className="font-serif text-sm italic text-zinc-600 block mb-1 font-medium select-none">
                  A. Kengne G.
                </span>
                <span className="font-sans text-[8px] tracking-widest uppercase text-on-surface-variant">
                  {lang === "fr" ? "Conservateur en Chef du Conseil" : "Chief Curator of Board"}
                </span>
              </div>

              <div className="flex flex-col items-center border-t border-ebony-deep/15 pt-2">
                <span className="font-serif text-sm italic text-zinc-600 block mb-1 font-medium select-none">
                  M. Lambert Trust
                </span>
                <span className="font-sans text-[8px] tracking-widest uppercase text-on-surface-variant">
                  {lang === "fr" ? "Administrateur du Fiduciaire" : "Treasury Trustee"}
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-gold-leaf/10 pt-4 w-full">
              <span className="font-mono text-[9px] text-zinc-400 block tracking-wide">
                LEDGER AUTHENTICITY BLOCK HASH HELD UNDER PUBLIC KEY EXPOSURE INDICES
              </span>
              <span className="font-mono text-[9px] text-gold-leaf/90 select-all block font-semibold mt-1">
                {mockSHA256}
              </span>
            </div>
          </div>

          <div className="absolute bottom-[-60px] left-0 right-0 flex justify-center gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-gold-leaf text-ebony-deep text-xs font-semibold tracking-widest uppercase hover:bg-ebony-deep hover:text-parchment-ivory transition-all duration-300 shadow-lg flex items-center gap-2 cursor-pointer border-0"
            >
              <Printer className="w-4 h-4" />
              {lang === "fr" ? "Imprimer le Certificat" : "Print Certificate"}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-800 text-parchment-ivory text-xs font-semibold tracking-widest uppercase hover:bg-zinc-700 transition-all cursor-pointer border-0"
            >
              {lang === "fr" ? "Retour" : "Return"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
