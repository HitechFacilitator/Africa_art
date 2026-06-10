"use client";

import { useState } from "react";
import { AdminArtwork, ComplianceScanResult } from "@/lib/adminTypes";
import { ShieldCheck, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ComplianceViewProps {
  artworks: AdminArtwork[];
  prefilledArtwork: AdminArtwork | null;
  onScan: (artwork: AdminArtwork) => void;
}

export default function ComplianceView({
  artworks,
  prefilledArtwork,
  onScan,
}: ComplianceViewProps) {
  const [selectedId, setSelectedId] = useState(prefilledArtwork?.id || "");
  const [annotation, setAnnotation] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ComplianceScanResult | null>(null);

  const selectedArtwork = artworks.find((a) => a.id === selectedId) || null;

  const handleScan = () => {
    if (!selectedArtwork) return;
    setScanning(true);
    setResult(null);
    onScan(selectedArtwork);

    setTimeout(() => {
      const riskLevels: ComplianceScanResult["riskLevel"][] = ["Low", "Medium", "Low"];
      const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      setResult({
        riskLevel: risk,
        verdict:
          risk === "Low"
            ? "Provenance chain verified. No red flags detected across 4 documented transfers. UNESCO 1970 compliance confirmed."
            : risk === "Medium"
            ? "Minor gaps in provenance documentation during the 1960-1980 period. Additional verification recommended before clearance."
            : "Significant provenance gaps detected. Multiple undocumented transfers. Recommend full forensic audit before any transaction.",
        culturalSafeguard:
          "This artifact falls under the UNESCO 1970 Convention on cultural property. Export permits and national heritage commission clearance required.",
        treaties: [
          "UNESCO 1970 Convention",
          "UNIDROIT 1995 Convention",
          "FATF Recommendation 16",
        ],
        guidelines: [
          "Verify source country export license",
          "Confirm no outstanding restitution claims",
          "Cross-reference INTERPOL stolen art database",
          "Document chain of custody with signed affidavits",
        ],
      });
      setScanning(false);
    }, 2500);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-2">
        Compliance Audits Node
      </h2>
      <p className="font-sans text-xs text-on-surface-variant mb-6">
        Institutional compliance standards — UNESCO, UNIDROIT, FATF
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6">
          <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
            Provenance Sealing Vault
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
                Select Artwork
              </label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setResult(null);
                }}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer"
              >
                <option value="">— Select Artwork —</option>
                {artworks.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} — {a.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedArtwork && (
              <>
                <div className="bg-surface-container-low p-4 space-y-2">
                  <p className="font-sans text-xs">
                    <span className="text-on-surface-variant">Culture: </span>
                    <span className="font-medium text-ebony-deep">{selectedArtwork.culture}</span>
                  </p>
                  <p className="font-sans text-xs">
                    <span className="text-on-surface-variant">Era: </span>
                    <span className="font-medium text-ebony-deep">{selectedArtwork.era}</span>
                  </p>
                  <p className="font-sans text-xs">
                    <span className="text-on-surface-variant">Provenance Hash: </span>
                    <span className="font-mono text-[10px] text-on-surface-variant">
                      {selectedArtwork.provenanceHash}
                    </span>
                  </p>
                  <div>
                    <p className="font-sans text-xs text-on-surface-variant mb-1">Ownership Trail:</p>
                    <div className="space-y-1">
                      {selectedArtwork.provenance.map((p, i) => (
                        <p key={i} className="font-sans text-[11px] text-ebony-deep pl-3 border-l-2 border-gold-leaf/30">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
                    Annotation (Optional)
                  </label>
                  <textarea
                    value={annotation}
                    onChange={(e) => setAnnotation(e.target.value)}
                    rows={3}
                    placeholder="Add compliance notes..."
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf resize-none"
                  />
                </div>

                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-ebony-deep text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {scanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-parchment-ivory/30 border-t-parchment-ivory rounded-full animate-spin" />
                      Scanning Provenance...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Seal Cryptographic Provenance
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6">
          <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
            Verification Checklist
          </h3>

          {scanning && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold-leaf/30 border-t-gold-leaf rounded-full animate-spin mb-4" />
              <p className="font-sans text-sm text-on-surface-variant animate-pulse">
                Running provenance analysis...
              </p>
            </div>
          )}

          {!scanning && !result && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldCheck className="w-10 h-10 text-outline-variant/40 mb-3" />
              <p className="font-sans text-sm text-on-surface-variant">
                Select an artwork and run a scan to view compliance results.
              </p>
            </div>
          )}

          {!scanning && result && (
            <div className="space-y-4 animate-fade-in">
              {/* Risk banner */}
              <div
                className={`flex items-center gap-3 p-4 ${
                  result.riskLevel === "Low"
                    ? "bg-emerald-50 border border-emerald-200"
                    : result.riskLevel === "Medium"
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {result.riskLevel === "Low" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : result.riskLevel === "Medium" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-wide">
                    Risk Level: {result.riskLevel}
                  </p>
                  <p className="font-sans text-[11px] mt-1">{result.verdict}</p>
                </div>
              </div>

              {/* Cultural safeguard */}
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3.5 h-3.5 text-gold-leaf" />
                  <p className="font-sans text-xs font-semibold text-ebony-deep">
                    Cultural Safeguard
                  </p>
                </div>
                <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                  {result.culturalSafeguard}
                </p>
              </div>

              {/* Treaties */}
              <div>
                <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-2">
                  Triggered Treaties
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.treaties.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-surface-container-high text-[10px] font-sans font-semibold text-ebony-deep"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guidelines */}
              <div>
                <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-2">
                  Administrative Guidelines
                </p>
                <ul className="space-y-1.5">
                  {result.guidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-[11px] text-on-surface-variant">
                      <CheckCircle className="w-3 h-3 text-gold-leaf mt-0.5 flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
