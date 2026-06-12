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
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ARTWORKS } from "@/lib/mockData";
import type { Artwork } from "@/lib/types";

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

const CERTIFICATES: Certificate[] = ARTWORKS.map((art, i) => ({
  id: `cert-${i}`,
  artwork: art,
  certificateNumber: `ADUNA-COA-${String(2023 + Math.floor(i / 2))}-${art.id.substring(0, 6).toUpperCase()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  issueDate: CERTIFICATE_ISSUE_DATES[i] || "2024-06-01",
  expiryDate: CERTIFICATE_ISSUE_DATES[i]
    ? `${Number(CERTIFICATE_ISSUE_DATES[i].substring(0, 4)) + 5}${CERTIFICATE_ISSUE_DATES[i].substring(4)}`
    : "2029-06-01",
  status: CERTIFICATE_STATUSES[i] || "VALID",
  issuer: "Aduna Gallery Authentication Division",
  authenticationLevel: CERTIFICATE_LEVELS[i] || "Level IV — Full Scientific",
  lastVerified: CERTIFICATE_VERIFIED[i] || "2026-06-01",
  blockchainHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
}));

const STATUS_STYLES = {
  VALID: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle, label: "Valid" },
  "RENEWAL DUE": { color: "text-amber-600 bg-amber-50 border-amber-200", icon: AlertTriangle, label: "Renewal Due" },
  EXPIRED: { color: "text-red-600 bg-red-50 border-red-200", icon: Clock, label: "Expired" },
  PENDING: { color: "text-blue-600 bg-blue-50 border-blue-200", icon: Clock, label: "Pending" },
};

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(CERTIFICATES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<"valid" | "invalid" | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalArtwork, setRenewalArtwork] = useState<string>("");
  const [renewalConfirmed, setRenewalConfirmed] = useState(false);
  const [renewalLoading, setRenewalLoading] = useState(false);

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
    <>
      <Navbar />

      {/* Demo Banner */}
      <div className="bg-ebony-deep border-b border-gold-leaf/20 py-2.5 px-6 text-center">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-parchment-ivory">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-leaf animate-pulse" />
          Demo mode — Viewing as Mock Collector
        </div>
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-surface-container-low py-12 md:py-16 border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="label-caps text-gold-leaf mb-3">Digital Ownership</p>
                <h1 className="font-display-lg text-ebony-deep mb-2">Certificates &amp; Status</h1>
                <p className="font-sans text-sm text-on-surface-variant max-w-lg">
                  Track the validity, renewal status, and provenance lineage of your
                  certificates of authenticity. Access the verification portal and
                  register new heirlooms.
                </p>
              </div>
              <button
                onClick={() => setShowVerifyModal(true)}
                className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-2 self-start"
              >
                <Search size={14} /> Verify Certificate
              </button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <div className="border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-on-surface-variant">Valid:</span>
                <span className="font-bold text-ebony-deep">{validCount}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-on-surface-variant">Renewal Due:</span>
                <span className="font-bold text-ebony-deep">{renewalCount}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-gold-leaf" />
                <span className="text-on-surface-variant">Total:</span>
                <span className="font-bold text-ebony-deep">{CERTIFICATES.length}</span>
              </div>
              <div className="flex-1" />
              <div className="flex gap-2">
                {["All", "VALID", "RENEWAL DUE"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer bg-transparent ${
                      filterStatus === s ? "border-ebony-deep bg-ebony-deep text-parchment-ivory" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                    }`}
                  >
                    {s === "All" ? "All" : s === "VALID" ? "Valid" : "Renewal"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Certificate List */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="lg:col-span-5">
              <div className="mb-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, certificate #, or origin..."
                    className="w-full border border-on-surface/15 pl-9 pr-3 py-2.5 text-xs focus:border-gold-leaf focus:outline-none bg-surface"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filtered.map((cert) => {
                  return (
                    <button
                      key={cert.id}
                      onClick={() => setSelectedCert(cert)}
                      className={`w-full text-left p-4 border transition-all cursor-pointer bg-transparent ${
                        selectedCert?.id === cert.id
                          ? "border-gold-leaf bg-surface-container-low shadow-sm"
                          : "border-on-surface/10 hover:border-gold-leaf/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-ebony-deep overflow-hidden shrink-0">
                          <img src={cert.artwork.imageUrl} alt={cert.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-bold text-ebony-deep truncate">{cert.artwork.title}</p>
                            <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${STATUS_STYLES[cert.status].color}`}>
                              {STATUS_STYLES[cert.status].label}
                            </span>
                          </div>
                          <p className="text-[9px] text-on-surface-variant font-mono mt-0.5">{cert.certificateNumber}</p>
                          <p className="text-[9px] text-on-surface-variant">{cert.artwork.origin} · {cert.artwork.material}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xs text-on-surface-variant">No certificates match your search.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Certificate Detail */}
            <div className="lg:col-span-7">
              {selectedCert ? (
                <motion.div key={selectedCert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Certificate Card */}
                  <div className="bg-surface-container-low border border-on-surface/5 p-6 md:p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gold-leaf mb-1">Certificate of Authenticity</p>
                        <p className="font-mono text-sm text-ebony-deep font-semibold">{selectedCert.certificateNumber}</p>
                      </div>
                      <div className={`px-3 py-1.5 border ${STATUS_STYLES[selectedCert.status].color} flex items-center gap-1.5`}>
                        {(() => { const I = STATUS_STYLES[selectedCert.status].icon; return <I size={12} />; })()}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{STATUS_STYLES[selectedCert.status].label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="aspect-[4/5] bg-ebony-deep overflow-hidden">
                        <img src={selectedCert.artwork.imageUrl} alt={selectedCert.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Artwork</p>
                          <p className="text-sm font-bold text-ebony-deep">{selectedCert.artwork.title}</p>
                          <p className="text-[10px] text-on-surface-variant">{selectedCert.artwork.origin} · {selectedCert.artwork.material}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Period</p>
                          <p className="text-xs text-ebony-deep">{selectedCert.artwork.period}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Dimensions</p>
                          <p className="text-xs text-ebony-deep">{selectedCert.artwork.dimensions}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Authentication Level</p>
                          <p className="text-xs text-ebony-deep font-semibold">{selectedCert.authenticationLevel}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-on-surface/5 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Issue Date</p>
                        <p className="text-xs text-ebony-deep">{selectedCert.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Expiry Date</p>
                        <p className="text-xs text-ebony-deep">{selectedCert.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Last Verified</p>
                        <p className="text-xs text-ebony-deep">{selectedCert.lastVerified}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5">Issuer</p>
                        <p className="text-xs text-ebony-deep">Aduna Gallery</p>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Hash */}
                  <div className="bg-surface-container border border-on-surface/5 p-5 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={14} className="text-gold-leaf" />
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Blockchain Verification</p>
                    </div>
                    <p className="font-mono text-[10px] text-on-surface-variant break-all leading-relaxed bg-surface p-3 border border-on-surface/5">{selectedCert.blockchainHash}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-ebony-deep text-parchment-ivory px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center gap-1.5">
                      <Download size={12} /> Download COA (PDF)
                    </button>
                    <button className="border border-on-surface/20 text-on-surface-variant px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
                      <QrCode size={12} /> Generate QR Code
                    </button>
                    <button className="border border-on-surface/20 text-on-surface-variant px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
                      <ExternalLink size={12} /> View on Explorer
                    </button>
                    {selectedCert.status === "RENEWAL DUE" && (
                      <button
                        onClick={() => {
                          setRenewalArtwork(selectedCert.artwork.title);
                          setShowRenewalModal(true);
                          setRenewalConfirmed(false);
                        }}
                        className="border border-amber-300 text-amber-700 px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-50 transition-colors cursor-pointer bg-transparent flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} /> Renew Certificate
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 border border-dashed border-on-surface/10">
                  <p className="text-xs text-on-surface-variant/40 uppercase tracking-widest">Select a certificate to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Verify Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={() => { setShowVerifyModal(false); setVerifyResult(null); setVerifyInput(""); }} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="text-center mb-6">
                <ShieldCheck className="w-12 h-12 text-gold-leaf mx-auto mb-3" />
                <h3 className="font-serif text-xl font-medium uppercase tracking-wide">Verify Certificate</h3>
                <p className="text-xs text-on-surface-variant mt-1">Enter a certificate number or blockchain hash to verify authenticity.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={verifyInput}
                  onChange={(e) => { setVerifyInput(e.target.value); setVerifyResult(null); }}
                  placeholder="e.g. ADUNA-COA-2024-FANG-1234 or 0x..."
                  className="w-full border border-ebony-deep/15 p-3 text-xs font-mono focus:border-gold-leaf focus:outline-none"
                />
                <button
                  onClick={handleVerify}
                  disabled={!verifyInput.trim()}
                  className="w-full bg-ebony-deep text-parchment-ivory py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer border-0 flex items-center justify-center gap-2"
                >
                  <Search size={14} /> Verify Authenticity
                </button>
              </div>

              {verifyResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  {verifyResult === "valid" ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 text-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-emerald-800">Certificate Verified</p>
                      <p className="text-xs text-emerald-700 mt-1">This certificate is authentic and currently valid in the Aduna Registry.</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 text-center">
                      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-red-800">Certificate Not Found</p>
                      <p className="text-xs text-red-700 mt-1">No matching certificate was found in the Aduna Registry. Please check the number and try again.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Renewal Confirmation Modal */}
      <AnimatePresence>
        {showRenewalModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory max-w-lg w-full p-8 text-ebony-deep shadow-2xl relative">
              <button onClick={() => { setShowRenewalModal(false); setRenewalLoading(false); }} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              {renewalConfirmed ? (
                <div className="text-center">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">Certificate Renewal Submitted</h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    Your renewal request for <strong>{renewalArtwork}</strong> has been submitted.
                    Our authentication team will process the renewal within 2-3 business days and issue a new certificate.
                  </p>
                  <button onClick={() => { setShowRenewalModal(false); setRenewalLoading(false); }} className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity cursor-pointer border-0">Close</button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <RefreshCw className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide">Renew Certificate</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Confirm renewal for: <strong>{renewalArtwork}</strong></p>
                  </div>
                  <div className="bg-surface-container-low border border-on-surface/5 p-4 mb-6 text-xs space-y-2">
                    <div className="flex justify-between"><span className="text-on-surface-variant">Renewal Fee</span><span className="font-medium">€450.00</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Processing Time</span><span className="font-medium">2-3 Business Days</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">New Certificate Validity</span><span className="font-medium">5 Years</span></div>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    By confirming, you authorize the renewal of this certificate of authenticity. A new certificate with updated verification data and blockchain record will be issued.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowRenewalModal(false); setRenewalLoading(false); }} className="flex-1 border border-ebony-deep/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent">Cancel</button>
                    <button
                      onClick={() => {
                        setRenewalLoading(true);
                        setTimeout(() => {
                          setRenewalLoading(false);
                          setRenewalConfirmed(true);
                        }, 1500);
                      }}
                      disabled={renewalLoading}
                      className="flex-1 bg-amber-500 text-parchment-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer border-0 flex items-center justify-center gap-2"
                    >
                      {renewalLoading ? "Processing..." : "Confirm Renewal"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}