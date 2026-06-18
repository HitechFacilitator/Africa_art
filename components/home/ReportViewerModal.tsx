"use client";

import { motion } from "motion/react";
import { X, Download, ShieldAlert, Award } from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface ReportViewerModalProps {
  onClose: () => void;
}

export default function ReportViewerModal({ onClose }: ReportViewerModalProps) {
  const { lang } = useTranslate();
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
                  {lang === "fr" ? "Rapport de Renseignement Institutionnel" : "Institutional Intelligence Report"}
                </span>
                <h3 className="font-serif text-3xl tracking-tight mt-2 leading-tight">
                  {lang === "fr" ? "Actifs Patrimoniaux : La Nouvelle Réserve Souveraine" : "Heritage Assets: The New Sovereign Reserve"}
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
                  <span className="font-sans text-[9px] uppercase tracking-widest text-gold-leaf font-bold">{lang === "fr" ? "Résumé Exécutif" : "Executive Summary"}</span>
                  <h4 className="font-serif text-[22px] tracking-tight text-ebony-deep mt-1 mb-2">{lang === "fr" ? "Indice Stratégique des Antiquités (ISA)" : "Strategic Antiquities Index (SAI)"}</h4>
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
                  onClick={() => {
                    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Heritage Assets Report - Aduna Gallery</title><style>
                      body{font-family:Georgia,serif;color:#0f0f0f;max-width:800px;margin:40px auto;padding:40px;border:2px double #C5A059}
                      h1{font-size:26px;text-align:center;text-transform:uppercase;letter-spacing:3px;margin-bottom:4px}
                      h2{font-size:12px;text-align:center;color:#785a1a;text-transform:uppercase;letter-spacing:5px;margin-bottom:30px}
                      h3{font-size:18px;margin-top:24px;border-bottom:1px solid #e5e5e5;padding-bottom:6px}
                      .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0;font-size:12px}
                      .meta span{display:block;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:2px}
                      .meta strong{color:#0f0f0f}
                      .bar{margin:8px 0}.bar-label{display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px}
                      .bar-track{height:14px;background:#f0f0f0;width:100%}.bar-fill{height:14px;background:#C5A059}
                      .disclaimer{margin-top:24px;padding:16px;border-left:3px solid #C5A059;font-size:11px;line-height:1.6;color:#555}
                      .footer{text-align:center;font-size:9px;color:#aaa;margin-top:40px;letter-spacing:2px;text-transform:uppercase}
                      @media print{body{border:none;margin:0;padding:20px}}
                    </style></head><body>
                      <img src="/logo.png" style="width:60px;height:60px;display:block;margin:0 auto 8px" alt="Aduna Gallery" />
                      <h1>Heritage Assets Report</h1>
                      <h2>The New Sovereign Reserve — Institutional Intelligence Report</h2>
                      <div class="meta">
                        <div><span>Report Code</span><strong>ADUN-REPORT-2026</strong></div>
                        <div><span>Version</span><strong>v4.12 SECURE</strong></div>
                        <div><span>Issued</span><strong>${new Date().toLocaleDateString()}</strong></div>
                        <div><span>Classification</span><strong>Institutional — Confidential</strong></div>
                      </div>
                      <h3>Executive Summary — Strategic Antiquities Index (SAI)</h3>
                      <p style="font-size:13px;line-height:1.7">Over the last decade, authentic, carbon-provenanced African masterworks have demonstrated independent market liquidity with a historic <strong>11.4% CAGR</strong>, displaying high counter-cyclical resistance.</p>
                      <h3>Annual Compound Yield Comparison (2015–2025)</h3>
                      <div class="bar"><div class="bar-label"><span style="font-weight:600">Aduna Strategic African Art Index</span><span style="color:#C5A059;font-weight:700">+11.4% CAGR</span></div><div class="bar-track"><div class="bar-fill" style="width:95%"></div></div></div>
                      <div class="bar"><div class="bar-label"><span>Global Equities (S&P 500)</span><span>+8.2% CAGR</span></div><div class="bar-track"><div class="bar-fill" style="width:68%;background:#999"></div></div></div>
                      <div class="bar"><div class="bar-label"><span>Sovereign Bullion (Gold Spot)</span><span>+5.4% CAGR</span></div><div class="bar-track"><div class="bar-fill" style="width:45%;background:#bbb"></div></div></div>
                      <div class="disclaimer"><strong>Compliance Notice:</strong> All heritage trading with Aduna Gallery processes complies with UNESCO 1970 convention standards, including carbon-verified registration. This report acts as an institutional intelligence dossier for qualified collectors and family offices.</div>
                      <div class="footer">Aduna Gallery — Institutional Ledger Registry — ${new Date().toISOString().split("T")[0]}</div>
                    </body></html>`;
                    const w = window.open("", "_blank");
                    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
                  }}
                  className="bg-ebony-deep hover:bg-gold-leaf hover:text-ebony-deep text-parchment-ivory font-sans text-xs uppercase tracking-widest py-3 px-6 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  <span>{lang === "fr" ? "Télécharger le Dossier PDF" : "Download PDF Dossier"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}