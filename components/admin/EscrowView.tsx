"use client";

import { EscrowTransaction } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import {
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  FileText,
} from "lucide-react";

interface EscrowViewProps {
  transactions: EscrowTransaction[];
  onRelease: (id: string) => void;
  onDispute: (id: string) => void;
  onRefund: (id: string) => void;
}

function getStatusConfig(status: EscrowTransaction["status"], lang: string) {
  switch (status) {
    case "Held":
      return {
        icon: Lock,
        label: lang === "fr" ? "Fonds Bloqués" : "Funds Locked",
        color: "bg-gold-leaf/10 text-gold-leaf",
        iconColor: "text-gold-leaf",
      };
    case "Released":
      return {
        icon: CheckCircle2,
        label: lang === "fr" ? "Libérés" : "Released",
        color: "bg-emerald-100 text-emerald-800",
        iconColor: "text-emerald-600",
      };
    case "Disputed":
      return {
        icon: AlertTriangle,
        label: lang === "fr" ? "Litigieux" : "Disputed",
        color: "bg-red-100 text-red-800",
        iconColor: "text-red-600",
      };
    case "Refunded":
      return {
        icon: RefreshCw,
        label: lang === "fr" ? "Remboursés" : "Refunded",
        color: "bg-amber-100 text-amber-800",
        iconColor: "text-amber-600",
      };
    default:
      return {
        icon: Lock,
        label: status || (lang === "fr" ? "Inconnu" : "Unknown"),
        color: "bg-gray-100 text-gray-800",
        iconColor: "text-gray-600",
      };
  }
}

export default function EscrowView({
  transactions,
  onRelease,
  onDispute,
  onRefund,
}: EscrowViewProps) {
  const { lang } = useTranslate();
  const totalHeld = transactions
    .filter((t) => t.status === "Held")
    .reduce((sum, t) => sum + t.amount, 0);
  const activeContracts = transactions.filter(
    (t) => t.status === "Held" || t.status === "Disputed"
  ).length;
  const disputedCount = transactions.filter((t) => t.status === "Disputed").length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
          <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1">
            {lang === "fr" ? "Stockage Froid Séquestre" : "Escrow Cold Storage"}
          </p>
          <p className="font-serif text-xl font-semibold text-ebony-deep">
            €{totalHeld.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
          <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1">
            {lang === "fr" ? "Contrats Actifs" : "Active Contracts"}
          </p>
          <p className="font-serif text-xl font-semibold text-ebony-deep">{activeContracts}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
          <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1">
            {lang === "fr" ? "Litiges en Attente" : "Pending Disputes"}
          </p>
          <p className="font-serif text-xl font-semibold text-terracotta-earth">
            {disputedCount}
          </p>
        </div>
      </div>

      <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-4">
        {lang === "fr" ? "Registre de Détention Séquestre" : "Escrow Holding Ledger"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        <div className="lg:col-span-5 space-y-4">
          {transactions.map((tx) => {
            const config = getStatusConfig(tx.status, lang);
            const Icon = config.icon;
            return (
              <div
                key={tx.id}
                className="bg-surface-container-lowest border border-outline-variant/30 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-[10px] text-on-surface-variant">{tx.id}</p>
                    <p className="font-serif text-lg font-medium text-ebony-deep">
                      {tx.artworkTitle}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-sans font-bold ${config.color}`}
                  >
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-sans mb-3">
                  <div>
                    <p className="text-on-surface-variant">{lang === "fr" ? "Acheteur" : "Buyer"}</p>
                    <p className="font-medium text-ebony-deep">{tx.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">{lang === "fr" ? "Vendeur" : "Seller"}</p>
                    <p className="font-medium text-ebony-deep">{tx.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">{lang === "fr" ? "Somme Séquestre" : "Escrow Sum"}</p>
                    <p className="font-serif font-semibold text-ebony-deep">
                      €{tx.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">{lang === "fr" ? "Créé" : "Created"}</p>
                    <p className="text-ebony-deep">{tx.createdDate}</p>
                  </div>
                </div>

                {tx.notes && (
                  <div className="flex items-start gap-2 bg-surface-container-low p-3 mb-3">
                    <FileText className="w-3.5 h-3.5 text-on-surface-variant/60 mt-0.5 flex-shrink-0" />
                    <p className="font-sans text-xs text-on-surface-variant">{tx.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {tx.status === "Held" && (
                    <>
                       <button
                        onClick={() => {
                          if (confirm("Release escrow funds to seller?")) onRelease(tx.id);
                        }}
                        className="px-3 py-1.5 bg-gold-leaf text-ebony-deep text-[10px] font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        {lang === "fr" ? "Libérer et Décaisser" : "Release & Disburse"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Initiate dispute for this escrow?")) onDispute(tx.id);
                        }}
                        className="px-3 py-1.5 border border-terracotta-earth/50 text-terracotta-earth text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/5 transition-colors"
                      >
                        {lang === "fr" ? "Lancer un Litige" : "Initiate Dispute"}
                      </button>
                    </>
                  )}
                  {tx.status === "Disputed" && (
                    <>
                      <button
                        onClick={() => {
                          if (confirm("Settle and release to buyer?")) onRelease(tx.id);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        {lang === "fr" ? "Régler le Transfert" : "Settle Transfer"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Settle and refund to buyer?")) onRefund(tx.id);
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        {lang === "fr" ? "Régler le Remboursement" : "Settle Refund"}
                      </button>
                    </>
                  )}
                  {tx.status === "Released" && (
                    <span className="text-[10px] font-sans font-bold text-emerald-700 tracking-wide uppercase">
                      {lang === "fr" ? "[COMPLÉTÉ]" : "[COMPLETE]"}
                    </span>
                  )}
                  {tx.status === "Refunded" && (
                    <span className="text-[10px] font-sans font-bold text-amber-700 tracking-wide uppercase">
                      {lang === "fr" ? "[REMBOURSÉ]" : "[REFUNDED]"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-5">
            <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
              {lang === "fr" ? "Pactes de Sécurité Séquestre" : "Escrow Safe Covenants"}
            </h3>
            <div className="space-y-4">
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-3.5 h-3.5 text-gold-leaf" />
                  <p className="font-sans text-xs font-semibold text-ebony-deep">
                    {lang === "fr" ? "Gel de Garde" : "Custodial Freeze"}
                  </p>
                </div>
                <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                  All funds are locked in a multi-signature escrow vault until both parties confirm
                  delivery and authenticity verification.
                </p>
              </div>
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-leaf" />
                  <p className="font-sans text-xs font-semibold text-ebony-deep">
                    {lang === "fr" ? "Libération Automatisée" : "Automated Release"}
                  </p>
                </div>
                <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                  Upon dual-confirmed delivery, funds are automatically disbursed to the seller
                  within 48 business hours via SWIFT transfer.
                </p>
              </div>
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-gold-leaf" />
                  <p className="font-sans text-xs font-semibold text-ebony-deep">
                    {lang === "fr" ? "Arbitrage Souverain" : "Sovereign Arbitrage"}
                  </p>
                </div>
                <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                  Disputes are arbitrated by the Aduna Gallery Legal Council under Swiss
                  arbitration rules within the Geneva Freeport jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
