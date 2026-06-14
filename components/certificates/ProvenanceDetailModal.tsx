"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, ShieldCheck, UserCheck, Award, Printer } from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface ProvenanceMilestone {
  id: string;
  year: string;
  location: string;
  event: string;
  custodian: string;
}

interface ProvenanceCertificate {
  id: string;
  title: string;
  period: string;
  region: string;
  status: string;
  certifyingBody: string;
  referenceId: string;
  imageUrl: string;
  provenance: ProvenanceMilestone[];
  valuationEstimate?: string;
  medium?: string;
  dimensions?: string;
}

interface ProvenanceDetailModalProps {
  certificate: ProvenanceCertificate | null;
  onClose: () => void;
  onRequestRenewal: (cert: ProvenanceCertificate) => void;
  onPrintCertificate: (cert: ProvenanceCertificate) => void;
}

export default function ProvenanceDetailModal({
  certificate,
  onClose,
  onRequestRenewal,
  onPrintCertificate,
}: ProvenanceDetailModalProps) {
  const { lang } = useTranslate();
  if (!certificate) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VALID":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "RENEWAL DUE":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "EXPIRED":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    if (lang === "fr") {
      switch (status) {
        case "VALID": return "Valide";
        case "RENEWAL DUE": return "Renouvellement dû";
        case "EXPIRED": return "Expiré";
        case "PENDING": return "En attente";
        default: return status;
      }
    }
    return status;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-deep/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-ebony-deep/10 shadow-2xl relative"
        >
          <div className="sticky top-0 bg-parchment-ivory/95 backdrop-blur border-b border-ebony-deep/10 px-6 py-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 text-[10px] tracking-widest font-semibold uppercase border ${getStatusBadge(certificate.status)}`}>
                {getStatusLabel(certificate.status)}
              </span>
              <span className="font-mono text-xs text-on-surface-variant font-medium">
                {certificate.referenceId}
              </span>
            </div>
            <button onClick={onClose} className="p-1 text-ebony-deep hover:text-gold-leaf transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="border border-ebony-deep/10 bg-parchment-ivory p-4 shadow-sm relative overflow-hidden">
                <img
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  className="w-full h-auto object-cover max-h-[350px] grayscale-[10%]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-ebony-deep/80 text-parchment-ivory text-[9px] tracking-widest uppercase px-2 py-0.5 font-mono">
                  ARCHIVAL SNAPSHOT
                </div>
              </div>

              <div className="bg-surface-container-low border border-ebony-deep/5 p-5">
                <h4 className="font-serif text-lg border-b border-ebony-deep/10 pb-2 mb-4 tracking-tight flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-leaf" />
                  {lang === "fr" ? "Analyse Technique" : "Technical Analysis"}
                </h4>
                <div className="flex flex-col gap-3 font-sans text-xs">
                  <div>
                    <span className="text-on-surface-variant uppercase tracking-widest text-[10px] block mb-0.5">
                      {lang === "fr" ? "Support / Matériau" : "Medium / Material"}
                    </span>
                    <span className="font-medium text-ebony-deep">{certificate.medium || "Wood & pigments"}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant uppercase tracking-widest text-[10px] block mb-0.5">
                      {lang === "fr" ? "Dimensions" : "Dimensions"}
                    </span>
                    <span className="font-medium text-ebony-deep">{certificate.dimensions || "Archival recorded proportions"}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant uppercase tracking-widest text-[10px] block mb-0.5">
                      {lang === "fr" ? "Évaluation Estimée" : "Assessed Valuation"}
                    </span>
                    <span className="font-semibold text-gold-leaf">{certificate.valuationEstimate || "Private Placement Value"}</span>
                  </div>
                </div>
              </div>

              {certificate.status === "EXPIRED" ? (
                <button
                  onClick={() => onRequestRenewal(certificate)}
                  className="w-full bg-ebony-deep text-parchment-ivory py-3 text-xs tracking-wider uppercase font-semibold hover:bg-gold-leaf hover:text-ebony-deep transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  {lang === "fr" ? "Demander le Renouvellement" : "Request Certificate Renewal"}
                </button>
              ) : (
                <button
                  onClick={() => onPrintCertificate(certificate)}
                  className="w-full border border-ebony-deep text-ebony-deep py-3 text-xs tracking-wider uppercase font-semibold hover:bg-ebony-deep hover:text-parchment-ivory transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                >
                  <Printer className="w-4 h-4" />
                  {lang === "fr" ? "Imprimer le Certificat Officiel" : "Print Official Certificate"}
                </button>
              )}
            </div>

            <div className="md:col-span-7 flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs uppercase text-gold-leaf tracking-widest font-semibold mb-1 block">
                  {lang === "fr" ? "Chaîne Chronologique" : "Chronological Portfolio Chain"}
                </span>
                <h2 className="font-serif text-3xl text-ebony-deep tracking-tight mb-2">{certificate.title}</h2>
                <p className="font-sans text-sm text-on-surface-variant italic">
                  {lang === "fr" ? "Région d'origine" : "Origin Region"}: {certificate.region} &bull; {lang === "fr" ? "Période estimée" : "Estimated Period"}: {certificate.period}
                </p>
              </div>

              <div className="border-l-4 border-terracotta-earth bg-parchment-ivory p-4 px-5">
                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-terracotta-earth block mb-1">
                  {lang === "fr" ? "Protocole du Registre Certifiant" : "Certifying Registry Protocol"}
                </span>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {lang === "fr"
                    ? `Les enregistrements d'authentification institutionnels ont été enregistrés sur le registre de préservation numérique sous la garde de ${certificate.certifyingBody}. L'intégrité des métriques de lignée physique sert de conformité haut de gamme et de valeur collatérale.`
                    : `Institutional authentication records have been hardcoded onto the digital preservation ledger under custody of ${certificate.certifyingBody}. The integrity of physical lineage metrics serves as high-end compliance and collateral value.`}
                </p>
              </div>

              <div className="relative border-l border-ebony-deep/10 pl-6 ml-2 py-2 flex flex-col gap-6">
                {certificate.provenance.map((milestone) => (
                  <div key={milestone.id} className="relative group">
                    <span className="absolute left-[-30px] top-1 bg-background border-2 border-gold-leaf w-[9px] h-[9px] rounded-full group-hover:scale-125 transition-transform" />
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs tracking-widest font-bold text-gold-leaf bg-gold-leaf/10 px-2 py-0.5">
                        {milestone.year}
                      </span>
                      <span className="font-sans text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-terracotta-earth" />
                        {milestone.location}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-ebony-deep leading-relaxed mb-1">{milestone.event}</p>
                    <span className="font-sans text-[10px] uppercase text-on-surface-variant flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-muted-gold" />
                      {lang === "fr" ? "Gardien" : "Custodian"}: <strong className="text-charcoal-text font-medium">{milestone.custodian}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
