"use client";

import { useState, useMemo } from "react";
import { AuditLogEntry } from "@/lib/adminTypes";
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
    const content = filtered
      .map(
        (log) =>
          `[${log.timestamp}] ${log.user} — ${log.action}\n  TX: ${log.txHash} | Signed: ${log.signed ? "YES" : "NO"}`
      )
      .join("\n\n");
    const blob = new Blob(
      [`ADUNA GALLERY — AUDIT LEDGER EXPORT\n=====================================\n\n${content}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Aduna_Audit_Ledger_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep">Audit Log</h2>
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
            {verifyingAll ? "Verifying..." : "Verify All"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 border border-outline-variant/50 text-on-surface-variant text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
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
              <th className="text-left px-4 py-3 whitespace-nowrap">Timestamp</th>
              <th className="text-left px-4 py-3">Operator</th>
              <th className="text-left px-4 py-3">Action Details</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">TX Hash</th>
              <th className="text-center px-4 py-3">Integrity</th>
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
                      <CheckCircle className="w-3 h-3" /> Signed Pass
                    </span>
                  ) : (
                    <button
                      onClick={() => onVerify(log.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-sans font-bold text-gold-leaf border border-gold-leaf/30 hover:bg-gold-leaf/5 transition-colors"
                    >
                      <Clock className="w-3 h-3" /> Block Sign
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
