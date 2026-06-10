"use client";

import { motion } from "motion/react";
import { X, Download, ShieldAlert, Award } from "lucide-react";

interface ReportViewerModalProps {
  onClose: () => void;
}

export default function ReportViewerModal({ onClose }: ReportViewerModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ebony-deep/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-parchment-ivory border border-on-surface/10 shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-ebony-deep text-parchment-ivory hover:bg-gold-leaf hover:text-ebony-deep transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-5/12 bg-ebony-deep text-parchment-ivory p-8 flex flex-col justify-between h-[500px]">
              <div>
                <Award className="text-gold-leaf mb-6" size={32} />
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold-leaf font-bold">
                  Institutional Intelligence Report
                </span>
                <h3 className="font-serif text-3xl tracking-tight mt-2 leading-tight">
                  Heritage Assets:<br />
                  The New Sovereign Reserve
                </h3>
                <p className="font-sans text-xs text-parchment-ivory/65 mt-4 max-w-xs leading-relaxed">
                  An institutional guide to Africa&apos;s highest compound-yield antiquities, detailing preservation-compliance standards and family office custody strategies.
                </p>
              </div>
              <div className="border-t border-parchment-ivory/15 pt-4 text-[10px] font-mono text-parchment-ivory/50">
                <div>CODE: ADUN-REPORT-2026</div>
                <div>VERSION: v4.12 SECURE</div>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="font-sans text-[9px] uppercase tracking-widest text-gold-leaf font-bold">Executive Summary</span>
                  <h4 className="font-serif text-[22px] tracking-tight text-ebony-deep mt-1 mb-2">Strategic Antiquities Index (SAI)</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Over the last decade, authentic, carbon-provenanced African masterworks have demonstrated independent market liquidity with a historic <strong>11.4% CAGR</strong>, displaying high counter-cyclical resistance.
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-sans text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50">
                    Annual Compound Yield Comparison (2015-2025)
                  </h5>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between font-sans text-[11px] mb-1">
                        <span className="text-ebony-deep font-semibold">Aduna Strategic African Art Index</span>
                        <span className="text-terracotta-earth font-semibold">+11.4% CAGR</span>
                      </div>
                      <div className="w-full bg-surface-container h-2">
                        <div className="bg-gold-leaf h-2" style={{ width: "95%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-sans text-[11px] mb-1">
                        <span className="text-on-surface-variant/70">Global Equities (S&P 500)</span>
                        <span className="text-on-surface-variant/70">+8.2% CAGR</span>
                      </div>
                      <div className="w-full bg-surface-container h-2">
                        <div className="bg-on-surface-variant/60 h-2" style={{ width: "68%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-sans text-[11px] mb-1">
                        <span className="text-on-surface-variant/70">Sovereign Bullion (Gold Spot)</span>
                        <span className="text-on-surface-variant/70">+5.4% CAGR</span>
                      </div>
                      <div className="w-full bg-surface-container h-2">
                        <div className="bg-on-surface-variant/40 h-2" style={{ width: "45%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low border-l-2 border-terracotta-earth flex items-start gap-3 text-xs leading-relaxed">
                  <ShieldAlert className="text-terracotta-earth flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="font-bold text-ebony-deep">Strict compliance standards:</span>
                    <p className="text-on-surface-variant mt-0.5">
                      All heritage trading with Aduna processes complies with UNESCO 1970 convention standards, including carbon-verified registration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-on-surface/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="font-sans text-[10px] text-on-surface-variant/50">
                  Includes digital asset audit charts & legal certificates.
                </div>
                <button
                  onClick={() => alert("Report PDF generation initiated. Download will start shortly.")}
                  className="bg-ebony-deep hover:bg-gold-leaf hover:text-ebony-deep text-parchment-ivory font-sans text-xs uppercase tracking-widest py-3 px-6 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  <span>Download PDF Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}