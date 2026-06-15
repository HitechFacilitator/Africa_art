"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  QrCode,
  ExternalLink,
  Printer,
  Eye,
  Plus,
} from "lucide-react";
import { ARTWORKS } from "@/lib/mockData";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtworks } from "@/lib/useTranslatedArtwork";
import type { Artwork } from "@/lib/types";
import PrintCertificateModal from "@/components/certificates/PrintCertificateModal";
import RegisterCertificateDrawer from "@/components/certificates/RegisterCertificateDrawer";
import ProvenanceDetailModal from "@/components/certificates/ProvenanceDetailModal";

interface Certificate {
  id: string;
  artwork: Artwork;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: "VALID" | "RENEWAL DUE" | "EXPIRED" | "PENDING";
  issuer: string;
  authenticationLevel: string;
  lastVerified: string;
  blockchainHash: string;
}

const CERTIFICATE_STATUSES: Certificate["status"][] = ["VALID", "VALID", "RENEWAL DUE", "VALID", "VALID", "VALID", "RENEWAL DUE", "VALID", "VALID", "VALID"];
const CERTIFICATE_ISSUE_DATES = ["2024-03-15", "2023-11-22", "2024-06-08", "2025-01-10", "2023-09-05", "2024-04-12", "2024-01-20", "2023-07-18", "2024-08-30", "2025-02-14"];
const CERTIFICATE_LEVELS = ["Level IV — Full Scientific", "Level IV — Full Scientific", "Level III — Provenance Verified", "Level IV — Full Scientific", "Level III — Provenance Verified", "Level IV — Full Scientific", "Level III — Provenance Verified", "Level IV — Full Scientific", "Level IV — Full Scientific", "Level III — Provenance Verified"];
const CERTIFICATE_VERIFIED = ["2026-05-20", "2026-04-15", "2026-03-10", "2026-06-01", "2026-05-05", "2026-04-28", "2026-06-08", "2026-05-12", "2026-06-10", "2026-06-02"];

const STATUS_STYLES: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  VALID: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle, label: "Valid" },
  "RENEWAL DUE": { color: "text-amber-600 bg-amber-50 border-amber-200", icon: AlertTriangle, label: "Renewal Due" },
  EXPIRED: { color: "text-red-600 bg-red-50 border-red-200", icon: Clock, label: "Expired" },
  PENDING: { color: "text-blue-600 bg-blue-50 border-blue-200", icon: Clock, label: "Pending" },
};

export default function CertificatesView() {
  const { lang } = useTranslate();
  const translatedArtworks = useTranslatedArtworks(ARTWORKS);
  const CERTIFICATES: Certificate[] = translatedArtworks.map((art, i) => {
    const numSuffix = ((i * 7 + 3) * 1337 % 9000 + 1000).toString();
    const hashChars = Array.from({ length: 64 }, (_, j) => ((i * 31 + j * 17) % 16).toString(16)).join("");
    return {
      id: `cert-${i}`,
      artwork: art,
      certificateNumber: `ADUNA-COA-${String(2023 + Math.floor(i / 2))}-${art.id.substring(0, 6).toUpperCase()}-${numSuffix}`,
      issueDate: CERTIFICATE_ISSUE_DATES[i] || "2024-06-01",
      expiryDate: CERTIFICATE_ISSUE_DATES[i]
        ? `${Number(CERTIFICATE_ISSUE_DATES[i].substring(0, 4)) + 5}${CERTIFICATE_ISSUE_DATES[i].substring(4)}`
        : "2029-06-01",
      status: CERTIFICATE_STATUSES[i] || "VALID",
      issuer: "Aduna Gallery Authentication Division",
      authenticationLevel: CERTIFICATE_LEVELS[i] || "Level IV — Full Scientific",
      lastVerified: CERTIFICATE_VERIFIED[i] || "2026-06-01",
      blockchainHash: `0x${hashChars}`,
    };
  });
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(CERTIFICATES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<"valid" | "invalid" | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalArtwork, setRenewalArtwork] = useState("");
  const [renewalConfirmed, setRenewalConfirmed] = useState(false);
  const [renewalLoading, setRenewalLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showRegisterDrawer, setShowRegisterDrawer] = useState(false);
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);

  const filtered = CERTIFICATES.filter((c) => {
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.artwork.title.toLowerCase().includes(q) ||
        c.certificateNumber.toLowerCase().includes(q) ||
        c.artwork.origin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleVerify = () => {
    if (!verifyInput.trim()) return;
    const found = CERTIFICATES.find(
      (c) =>
        c.certificateNumber.toLowerCase() === verifyInput.toLowerCase() ||
        c.blockchainHash.toLowerCase() === verifyInput.toLowerCase()
    );
    setVerifyResult(found ? "valid" : "invalid");
  };

  const validCount = CERTIFICATES.filter((c) => c.status === "VALID").length;
  const renewalCount = CERTIFICATES.filter((c) => c.status === "RENEWAL DUE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Certificats d'Authenticité" : "Certificates of Authenticity"}</h2>
          <p className="font-sans text-sm text-on-surface-variant mt-1">
            {lang === "fr" ? "Suivez la validité, le statut de renouvellement et la lignée de provenance de vos certificats." : "Track validity, renewal status, and provenance lineage of your certificates."}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <button onClick={() => setShowRegisterDrawer(true)} className="border border-gold-leaf text-gold-leaf px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
            <Plus size={12} /> {lang === "fr" ? "Enregistrer" : "Register"}
          </button>
          <button onClick={() => setShowVerifyModal(true)} className="bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-1.5">
            <Search size={12} /> {lang === "fr" ? "Vérifier" : "Verify"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: lang === "fr" ? "Valide" : "Valid", count: validCount, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: lang === "fr" ? "Renouvellement" : "Renewal Due", count: renewalCount, color: "text-amber-600", bg: "bg-amber-50" },
          { label: lang === "fr" ? "Total" : "Total", count: CERTIFICATES.length, color: "text-ebony-deep", bg: "bg-surface-container-low" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-on-surface/5 p-4`}>
            <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{s.label}</p>
            <p className={`font-serif text-2xl font-bold mt-1 ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "fr" ? "Rechercher par titre, n° ou origine..." : "Search by title, cert #, or origin..."}
            className="w-full border border-on-surface/15 pl-9 pr-3 py-2.5 text-xs focus:border-gold-leaf focus:outline-none bg-surface"
          />
        </div>
        <div className="flex gap-2">
          {["All", "VALID", "RENEWAL DUE"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer bg-transparent ${
                filterStatus === s ? "border-ebony-deep bg-ebony-deep text-parchment-ivory" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
              }`}
            >
              {s === "All" ? (lang === "fr" ? "Tous" : "All") : s === "VALID" ? (lang === "fr" ? "Valide" : "Valid") : (lang === "fr" ? "Renouvellement" : "Renewal")}
            </button>
          ))}
        </div>
      </div>

      {/* Content: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Certificate List */}
        <div className="lg:col-span-5 space-y-2">
          {filtered.map((cert) => (
            <button
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`w-full text-left p-3 border transition-all cursor-pointer bg-transparent ${
                selectedCert?.id === cert.id
                  ? "border-gold-leaf bg-surface-container-low shadow-sm"
                  : "border-on-surface/10 hover:border-gold-leaf/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 bg-ebony-deep overflow-hidden shrink-0">
                  <img src={cert.artwork.imageUrl} alt={cert.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold text-ebony-deep truncate">{cert.artwork.title}</p>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border shrink-0 ${STATUS_STYLES[cert.status].color}`}>
                      {STATUS_STYLES[cert.status].label}
                    </span>
                  </div>
                  <p className="text-[9px] text-on-surface-variant font-mono mt-0.5">{cert.certificateNumber}</p>
                  <p className="text-[9px] text-on-surface-variant">{cert.artwork.origin} · {cert.artwork.material}</p>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 border border-dashed border-on-surface/10">
              <p className="text-xs text-on-surface-variant/50">{lang === "fr" ? "Aucun certificat trouvé." : "No certificates found."}</p>
            </div>
          )}
        </div>

        {/* Certificate Detail */}
        <div className="lg:col-span-7">
          {selectedCert ? (
            <motion.div key={selectedCert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Certificate Preview Card */}
              <div className="relative bg-ebony-deep p-1 mb-5">
                <div className="bg-parchment-ivory p-5 md:p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold-leaf/60" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold-leaf/60" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold-leaf/60" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold-leaf/60" />

                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gold-leaf/10 mb-2">
                      <ShieldCheck className="w-5 h-5 text-gold-leaf" />
                    </div>
                    <h3 className="font-serif text-sm text-ebony-deep uppercase tracking-wider">{lang === "fr" ? "Certificat d'Authenticité" : "Certificate of Authenticity"}</h3>
                    <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">{selectedCert.certificateNumber}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-full sm:w-28 aspect-[4/5] sm:aspect-auto bg-ebony-deep overflow-hidden shrink-0">
                      <img src={selectedCert.artwork.imageUrl} alt={selectedCert.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest font-bold text-gold-leaf">{lang === "fr" ? "Œuvre" : "Artwork"}</p>
                        <p className="text-xs font-bold text-ebony-deep">{selectedCert.artwork.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Origine" : "Origin"}</p>
                          <p className="text-[10px] text-ebony-deep">{selectedCert.artwork.origin}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Matériau" : "Material"}</p>
                          <p className="text-[10px] text-ebony-deep">{selectedCert.artwork.material}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Période" : "Period"}</p>
                          <p className="text-[10px] text-ebony-deep">{selectedCert.artwork.period}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Dimensions" : "Dimensions"}</p>
                          <p className="text-[10px] text-ebony-deep">{selectedCert.artwork.dimensions}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Niveau" : "Level"}</p>
                        <p className="text-[10px] text-ebony-deep font-semibold">{selectedCert.authenticationLevel}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gold-leaf/20 pt-3">
                    <div className={`px-2 py-1 border ${STATUS_STYLES[selectedCert.status].color} flex items-center gap-1`}>
                      {(() => { const I = STATUS_STYLES[selectedCert.status].icon; return <I size={10} />; })()}
                      <span className="text-[9px] font-bold uppercase tracking-wider">{STATUS_STYLES[selectedCert.status].label}</span>
                    </div>
                    <div className="flex gap-3 text-[9px] text-on-surface-variant">
                      <span>{lang === "fr" ? "Émis" : "Issued"}: <strong className="text-ebony-deep">{selectedCert.issueDate}</strong></span>
                      <span>{lang === "fr" ? "Expire" : "Expires"}: <strong className="text-ebony-deep">{selectedCert.expiryDate}</strong></span>
                      <span>{lang === "fr" ? "Vérifié" : "Verified"}: <strong className="text-ebony-deep">{selectedCert.lastVerified}</strong></span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 opacity-[0.04] pointer-events-none select-none">
                    <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1"/>
                      <text x="40" y="42" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="serif" fontWeight="bold">ADUNA</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Blockchain */}
              <div className="bg-surface-container border border-on-surface/5 p-4 mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck size={12} className="text-gold-leaf" />
                  <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Vérification Blockchain" : "Blockchain Verification"}</p>
                </div>
                <p className="font-mono text-[9px] text-on-surface-variant break-all leading-relaxed bg-surface p-2 border border-on-surface/5">{selectedCert.blockchainHash}</p>
              </div>

              {/* Issuer */}
              <div className="bg-surface-container-low border border-on-surface/5 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-ebony-deep text-gold-leaf flex items-center justify-center font-serif text-sm font-semibold shrink-0">A</div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Émetteur" : "Issuing Authority"}</p>
                    <p className="text-[11px] font-bold text-ebony-deep">{selectedCert.issuer}</p>
                    <p className="text-[9px] text-on-surface-variant">{lang === "fr" ? "Galerie Aduna, Douala, Cameroun" : "Aduna Gallery, Douala, Cameroon"}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowPrintModal(true)} className="bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-1.5">
                  <Printer size={11} /> {lang === "fr" ? "Imprimer" : "Print"}
                </button>
                <button className="border border-on-surface/20 text-on-surface-variant px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
                  <Download size={11} /> {lang === "fr" ? "Télécharger PDF" : "Download PDF"}
                </button>
                <button onClick={() => setShowProvenanceModal(true)} className="border border-on-surface/20 text-on-surface-variant px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
                  <Eye size={11} /> {lang === "fr" ? "Provenance" : "Provenance"}
                </button>
                <button className="border border-on-surface/20 text-on-surface-variant px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
                  <QrCode size={11} /> QR
                </button>
                <button className="border border-on-surface/20 text-on-surface-variant px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
                  <ExternalLink size={11} /> {lang === "fr" ? "Explorateur" : "Explorer"}
                </button>
                {selectedCert.status === "RENEWAL DUE" && (
                  <button
                    onClick={() => { setRenewalArtwork(selectedCert.artwork.title); setShowRenewalModal(true); setRenewalConfirmed(false); }}
                    className="border border-amber-300 text-amber-700 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-50 transition-colors cursor-pointer bg-transparent flex items-center gap-1.5"
                  >
                    <RefreshCw size={11} /> {lang === "fr" ? "Renouveler" : "Renew"}
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-48 border border-dashed border-on-surface/10">
              <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest">{lang === "fr" ? "Sélectionnez un certificat" : "Select a certificate"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Verify Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={() => { setShowVerifyModal(false); setVerifyResult(null); setVerifyInput(""); }} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              <div className="text-center mb-6">
                <ShieldCheck className="w-12 h-12 text-gold-leaf mx-auto mb-3" />
                <h3 className="font-serif text-xl font-medium uppercase tracking-wide">{lang === "fr" ? "Vérifier le Certificat" : "Verify Certificate"}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Entrez un numéro de certificat ou un hash blockchain." : "Enter a certificate number or blockchain hash."}</p>
              </div>
              <div className="space-y-4">
                <input type="text" value={verifyInput} onChange={(e) => { setVerifyInput(e.target.value); setVerifyResult(null); }} placeholder="ADUNA-COA-2024-FANG-1234 or 0x..." className="w-full border border-ebony-deep/15 p-3 text-xs font-mono focus:border-gold-leaf focus:outline-none" />
                <button onClick={handleVerify} disabled={!verifyInput.trim()} className="w-full bg-ebony-deep text-parchment-ivory py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer border-0 flex items-center justify-center gap-2">
                  <Search size={14} /> {lang === "fr" ? "Vérifier" : "Verify"}
                </button>
              </div>
              {verifyResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  {verifyResult === "valid" ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 text-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-emerald-800">{lang === "fr" ? "Certificat Vérifié" : "Certificate Verified"}</p>
                      <p className="text-xs text-emerald-700 mt-1">{lang === "fr" ? "Ce certificat est authentique et actuellement valide." : "This certificate is authentic and currently valid."}</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 text-center">
                      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-red-800">{lang === "fr" ? "Certificat Non Trouvé" : "Certificate Not Found"}</p>
                      <p className="text-xs text-red-700 mt-1">{lang === "fr" ? "Aucun certificat correspondant trouvé." : "No matching certificate found."}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Renewal Modal */}
      <AnimatePresence>
        {showRenewalModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={() => { setShowRenewalModal(false); setRenewalLoading(false); }} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              {renewalConfirmed ? (
                <div className="text-center">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">{lang === "fr" ? "Renouvellement Soumis" : "Renewal Submitted"}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">{lang === "fr" ? "Votre demande de renouvellement pour" : "Your renewal request for"} <strong>{renewalArtwork}</strong> {lang === "fr" ? "a été soumise." : "has been submitted."}</p>
                  <button onClick={() => { setShowRenewalModal(false); setRenewalLoading(false); }} className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity cursor-pointer border-0">{lang === "fr" ? "Fermer" : "Close"}</button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <RefreshCw className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide">{lang === "fr" ? "Renouvellement" : "Renew Certificate"}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Confirmer pour :" : "Confirm renewal for:"} <strong>{renewalArtwork}</strong></p>
                  </div>
                  <div className="bg-surface-container-low border border-on-surface/5 p-4 mb-6 text-xs space-y-2">
                    <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Frais" : "Fee"}</span><span className="font-medium">€450.00</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Délai" : "Processing"}</span><span className="font-medium">{lang === "fr" ? "2-3 Jours" : "2-3 Days"}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">{lang === "fr" ? "Validité" : "Validity"}</span><span className="font-medium">{lang === "fr" ? "5 Ans" : "5 Years"}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowRenewalModal(false); setRenewalLoading(false); }} className="flex-1 border border-ebony-deep/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent">{lang === "fr" ? "Annuler" : "Cancel"}</button>
                    <button onClick={() => { setRenewalLoading(true); setTimeout(() => { setRenewalLoading(false); setRenewalConfirmed(true); }, 1500); }} disabled={renewalLoading} className="flex-1 bg-amber-500 text-parchment-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer border-0 flex items-center justify-center gap-2">
                      {renewalLoading ? (lang === "fr" ? "Traitement..." : "Processing...") : (lang === "fr" ? "Confirmer" : "Confirm")}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Modal */}
      {showPrintModal && selectedCert && (
        <PrintCertificateModal
          certificate={{ title: selectedCert.artwork.title, period: selectedCert.artwork.period, region: selectedCert.artwork.origin, referenceId: selectedCert.certificateNumber, certifyingBody: selectedCert.issuer, valuationEstimate: selectedCert.authenticationLevel, imageUrl: selectedCert.artwork.imageUrl }}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Register Drawer */}
      {showRegisterDrawer && (
        <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-parchment-ivory max-w-5xl w-full shadow-2xl relative mb-20">
            <button onClick={() => setShowRegisterDrawer(false)} className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div className="p-6 md:p-8">
              <RegisterCertificateDrawer onClose={() => setShowRegisterDrawer(false)} onRegister={(cert) => { setShowRegisterDrawer(false); alert(lang === "fr" ? `Certificat « ${cert.title} » enregistré.` : `Certificate "${cert.title}" registered.`); }} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Provenance Modal */}
      {showProvenanceModal && selectedCert && (
        <ProvenanceDetailModal
          certificate={{
            id: selectedCert.id, title: selectedCert.artwork.title, period: selectedCert.artwork.period, region: selectedCert.artwork.origin, status: selectedCert.status, certifyingBody: selectedCert.issuer, referenceId: selectedCert.certificateNumber, imageUrl: selectedCert.artwork.imageUrl, valuationEstimate: selectedCert.authenticationLevel, medium: selectedCert.artwork.material,
            provenance: [
              { id: "p1", year: selectedCert.artwork.period, location: selectedCert.artwork.origin, event: lang === "fr" ? `Pièce certifiée par ${selectedCert.issuer}. Niveau : ${selectedCert.authenticationLevel}.` : `Piece certified by ${selectedCert.issuer}. Level: ${selectedCert.authenticationLevel}.`, custodian: lang === "fr" ? "Galerie Aduna" : "Aduna Gallery" },
              { id: "p2", year: selectedCert.issueDate, location: lang === "fr" ? "Douala, Cameroun" : "Douala, Cameroon", event: lang === "fr" ? `Certificat émis. Référence : ${selectedCert.certificateNumber}.` : `Certificate issued. Reference: ${selectedCert.certificateNumber}.`, custodian: lang === "fr" ? "Division d'Authentification" : "Authentication Division" },
            ],
          }}
          onClose={() => setShowProvenanceModal(false)}
          onRequestRenewal={() => { setShowProvenanceModal(false); setRenewalArtwork(selectedCert.artwork.title); setShowRenewalModal(true); setRenewalConfirmed(false); }}
          onPrintCertificate={() => { setShowProvenanceModal(false); setShowPrintModal(true); }}
        />
      )}
    </div>
  );
}
