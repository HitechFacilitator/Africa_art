"use client";

import { LogisticsShipment } from "@/lib/dashboardTypes";
import {
  Truck,
  ShieldCheck,
  Clock,
  FileCheck2,
  PackageCheck
} from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface LogisticsViewProps {
  shipments: LogisticsShipment[];
}

export default function LogisticsView({ shipments }: LogisticsViewProps) {
  const { lang } = useTranslate();
  return (
    <div className="animate-fade-in text-on-surface">
      <header className="mb-10 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Logistique et Fret Sécurisés et Armés" : "Secure Armed Logistics & Freight"}</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">Monitor your heritage treasures in real-time transit. Couriers utilize temperature-shielded armored chambers, satellite telematics, and armed customs escorts.</p>
      </header>

      {shipments.length === 0 ? (
        <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-16 text-center select-none">
          <Truck className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
          <p className="font-serif text-lg text-ebony-deep">{lang === "fr" ? "Aucun Expédition Active" : "No Shipments Active"}</p>
          <p className="font-sans text-xs text-zinc-400 mt-2 max-w-sm mx-auto">All your acquisitions are currently stationary inside Swiss Freeport safes or authorized private display galleries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <h3 className="font-serif text-lg font-medium text-ebony-deep">{lang === "fr" ? "Flux de Cargaison de Coursier Actifs" : "Active Courier Cargo Streams"} ({shipments.length})</h3>
            {shipments.map((ship) => {
              const statusPercentage = ship.status === 'Origin Hub' ? 20 : ship.status === 'Customs Clearance' ? 50 : ship.status === 'International Transit' ? 75 : ship.status === 'Local Delivery' ? 90 : 100;
              return (
                <div key={ship.id} className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1 relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 border-b border-ebony-deep/5 pb-4">
                    <div>
                      <span className="font-sans text-[9px] font-bold tracking-widest text-terracotta-earth uppercase bg-terracotta-earth/5 px-2.5 py-1">High-Security Air Cargo</span>
                      <h4 className="font-serif text-xl font-medium mt-2 text-ebony-deep">{ship.artworkTitle}</h4>
                      <p className="font-sans text-xs text-zinc-400">Carrier: {ship.carrier} • Tracking Reference: <span className="font-mono">{ship.id.toUpperCase()}</span></p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-sans text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">{lang === "fr" ? "LIVESTIMATION DU CONSEILLER" : "ADVISOR ESTIMATE DELIVERY"}</p>
                      <p className="font-serif text-base text-gold-leaf font-semibold flex items-center gap-1.5 justify-start sm:justify-end"><Clock className="w-4.5 h-4.5" /> {ship.estimatedDeliveryDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 bg-surface-container-low p-4 border border-ebony-deep/5 select-none text-xs">
                    <div>
                      <p className="text-zinc-450 uppercase font-bold text-[9px] tracking-wider mb-0.5">Atmospheric Shield</p>
                      <p className="font-sans font-medium text-ebony-deep">Stabilized Air Cabin (20.5°C / 46%)</p>
                    </div>
                    <div>
                      <p className="text-zinc-450 uppercase font-bold text-[9px] tracking-wider mb-0.5">Physical Security Tier</p>
                      <p className="font-sans font-medium text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {ship.securityTier}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-zinc-450 uppercase font-bold text-[9px] tracking-wider mb-0.5">Risk Indemnity Policy</p>
                      <p className="font-sans font-medium text-ebony-deep">AXA Underwritten • {ship.insuranceCoverage}</p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">
                      <span>{lang === "fr" ? "Parti" : "Departed"}</span>
                      <span className="text-gold-leaf">{ship.status} ({statusPercentage}%)</span>
                      <span>{lang === "fr" ? "Livraison" : "Delivery"}</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1 relative">
                      <div className="bg-gold-leaf h-1 transition-all duration-1000" style={{ width: `${statusPercentage}%` }} />
                      <div className="absolute w-3 h-3 bg-gold-leaf rounded-full top-[-4px] border-2 border-parchment-ivory ring-4 ring-gold-leaf/20 animate-pulse" style={{ left: `calc(${statusPercentage}% - 6px)` }} />
                    </div>
                  </div>

                  <div>
                    <h5 className="font-serif text-sm font-semibold text-ebony-deep mb-4 flex items-center gap-2"><FileCheck2 className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Registre de Chaîne de Garde Sécurisée" : "Secure Chain of Custody Registry"}</h5>
                    <div className="relative pl-6 border-l border-ebony-deep/10 flex flex-col gap-6">
                      {ship.updates.map((update, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute left-[-29px] top-[4px] w-4 h-4 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600" /></div>
                          <div>
                            <p className="font-sans text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-2"><span>{update.date}</span><span className="text-emerald-700 bg-emerald-50 px-1">{update.status}</span></p>
                            <h6 className="font-serif text-sm text-ebony-deep mt-1 font-medium">{update.location}</h6>
                            <p className="font-sans text-xs text-zinc-500 mt-1.5 leading-relaxed italic max-w-xl">&quot;{update.description}&quot;</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1 space-y-6">
              <h3 className="font-serif text-lg font-medium text-ebony-deep border-b border-gold-leaf/20 pb-4 flex items-center gap-2"><PackageCheck className="w-4.5 h-4.5 text-gold-leaf" /> {lang === "fr" ? "Installation Blanche-Gant" : "White-Glove Installation"}</h3>
              <div className="space-y-4 font-sans text-xs text-zinc-500 leading-relaxed">
                <p>Upon final customs clearance, Aduna Gallery coordinates directly with physical engineering specialists to handle delicate, white-glove site installation.</p>
                <p className="font-bold text-ebony-deep uppercase tracking-wider text-[10px]">Protocol Regulations Include:</p>
                <ul className="list-disc pl-4 space-y-2 text-[11px]">
                  <li>Museum-Grade microchamber humidity adjustment</li>
                  <li>Lux radiation audits to prevent early pigmentation aging</li>
                  <li>Invis-Mount structural steel fastening for seismological protection</li>
                  <li>Local physical guard placement and motion laser telemetry calibration</li>
                </ul>
                <p className="text-[11px] mt-4 italic">To customize direct courier guidelines or edit final drop-off vaults, contact Helena Sterling via secure messaging.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}