"use client";

import { useState, useMemo } from "react";
import { AuditLogEntry } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import {
  Download,
  ShieldCheck,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onVerify: (id: string) => void;
  onVerifyAll: () => void;
}

export default function AuditLogView({ logs, onVerify, onVerifyAll }: AuditLogViewProps) {
  const { lang } = useTranslate();
  const [userFilter, setUserFilter] = useState("All");
  const [verifyingAll, setVerifyingAll] = useState(false);

  const users = useMemo(() => ["All", ...Array.from(new Set(logs.map((l) => l.user)))], [logs]);

  const filtered = useMemo(() => {
    if (userFilter === "All") return logs;
    return logs.filter((l) => l.user === userFilter);
  }, [logs, userFilter]);

  const handleVerifyAll = () => {
    setVerifyingAll(true);
    onVerifyAll();
    setTimeout(() => setVerifyingAll(false), 1200);
  };

  const handleDownload = () => {
    const rows = filtered.map((log) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:12px">${log.timestamp}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:12px">${log.user}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:12px">${log.action}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:11px;font-family:monospace;word-break:break-all">${log.txHash}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:12px;text-align:center">${log.signed ? "✓ YES" : "— NO"}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Audit Ledger - Aduna Gallery</title><style>
      body{font-family:Georgia,serif;color:#0f0f0f;max-width:900px;margin:40px auto;padding:40px;border:2px double #C5A059}
      h1{font-size:24px;text-align:center;text-transform:uppercase;letter-spacing:3px;margin-bottom:6px}
      h2{font-size:11px;text-align:center;color:#785a1a;text-transform:uppercase;letter-spacing:5px;margin-bottom:30px}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{text-align:left;padding:8px;border-bottom:2px solid #0f0f0f;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888}
      .footer{text-align:center;font-size:9px;color:#aaa;margin-top:40px;letter-spacing:2px;text-transform:uppercase}
      @media print{body{border:none;margin:0;padding:20px}}
    </style></head><body>
      <img src="/logo.png" style="width:60px;height:60px;display:block;margin:0 auto 8px" alt="Aduna Gallery" />
      <h1>Audit Ledger Export</h1>
      <h2>Aduna Gallery — Immutable Registry Record</h2>
      <p style="font-size:12px;text-align:center;color:#888;margin-bottom:24px">Exported on ${new Date().toLocaleString()} — ${filtered.length} records</p>
      <table>
        <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Transaction Hash</th><th style="text-align:center">Signed</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">Aduna Gallery — Audit Ledger Export — ${new Date().toISOString().split("T")[0]}</div>
    </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep">{lang === "fr" ? "Journal d'Audit" : "Audit Log"}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleVerifyAll}
            disabled={verifyingAll}
            className="flex items-center gap-2 px-3 py-2 bg-ebony-deep text-parchment-ivory text-[10px] font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {verifyingAll ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            {verifyingAll ? (lang === "fr" ? "Vérification..." : "Verifying...") : (lang === "fr" ? "Tout Vérifier" : "Verify All")}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 border border-outline-variant/50 text-on-surface-variant text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> {lang === "fr" ? "Exporter" : "Export"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 mb-6 bg-surface-container-low border border-outline-variant/50 p-0.5 w-fit">
        {users.map((u) => (
          <button
            key={u}
            onClick={() => setUserFilter(u)}
            className={`px-3 py-1.5 text-xs font-sans font-semibold transition-all ${
              userFilter === u
                ? "bg-ebony-deep text-parchment-ivory"
                : "text-on-surface-variant hover:text-ebony-deep"
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/30 text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant">
              <th className="text-left px-4 py-3 whitespace-nowrap">{lang === "fr" ? "Horodatage" : "Timestamp"}</th>
              <th className="text-left px-4 py-3">{lang === "fr" ? "Opérateur" : "Operator"}</th>
              <th className="text-left px-4 py-3">{lang === "fr" ? "Détails de l'Action" : "Action Details"}</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">{lang === "fr" ? "Hash TX" : "TX Hash"}</th>
              <th className="text-center px-4 py-3">{lang === "fr" ? "Intégrité" : "Integrity"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr
                key={log.id}
                className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    {log.timestamp}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        log.user === "Admin System"
                          ? "bg-blue-500"
                          : log.user === "Julien D."
                          ? "bg-gold-leaf"
                          : "bg-terracotta-earth"
                      }`}
                    />
                    <span className="font-sans text-xs text-ebony-deep">{log.user}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-xs text-ebony-deep">{log.action}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="font-mono text-[10px] text-on-surface-variant select-all">
                    {log.txHash}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {log.signed ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-emerald-700">
                      <CheckCircle className="w-3 h-3" /> {lang === "fr" ? "Passe Signé" : "Signed Pass"}
                    </span>
                  ) : (
                    <button
                      onClick={() => onVerify(log.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-sans font-bold text-gold-leaf border border-gold-leaf/30 hover:bg-gold-leaf/5 transition-colors"
                    >
                      <Clock className="w-3 h-3" /> {lang === "fr" ? "Signature de Bloc" : "Block Sign"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
