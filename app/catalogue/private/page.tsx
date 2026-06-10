"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Lock,
  Eye,
  Download,
  MapPin,
  Thermometer,
  Droplets,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ARTWORKS } from "@/lib/mockData";
import type { Artwork } from "@/lib/types";

interface VaultHolding {
  artwork: Artwork;
  vaultLocation: string;
  temperature: string;
  humidity: string;
  lastInspection: string;
  insuranceValue: string;
  acquisitionDate: string;
  condition: "Pristine" | "Excellent" | "Good" | "Restoration Pending";
  certStatus: "Valid" | "Renewal Due" | "Pending";
}

const VAULT_HOLDINGS: VaultHolding[] = ARTWORKS.slice(0, 4).map((art, i) => ({
  artwork: art,
  vaultLocation: ["Geneva Vault, Bay 7-A", "Zurich Freeport, Vault 12", "London Storage, Room 3-B", "Singapore Hub, Vault 5"][i],
  temperature: ["18.2°C", "17.8°C", "18.5°C", "19.1°C"][i],
  humidity: ["48%", "51%", "47%", "52%"][i],
  lastInspection: ["2026-05-14", "2026-04-28", "2026-05-20", "2026-03-15"][i],
  insuranceValue: art.investment?.estimatedValue || "€1.2M",
  acquisitionDate: ["2023-06-15", "2024-01-22", "2023-11-08", "2025-02-10"][i],
  condition: ["Pristine", "Excellent", "Excellent", "Pristine"][i] as VaultHolding["condition"],
  certStatus: ["Valid", "Valid", "Renewal Due", "Valid"][i] as VaultHolding["certStatus"],
}));

const CONDITION_COLORS = {
  Pristine: "text-emerald-600 bg-emerald-50",
  Excellent: "text-blue-600 bg-blue-50",
  Good: "text-amber-600 bg-amber-50",
  "Restoration Pending": "text-red-600 bg-red-50",
};

export default function PrivateCataloguePage() {
  const router = useRouter();
  const [selectedHolding, setSelectedHolding] = useState<VaultHolding | null>(VAULT_HOLDINGS[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <Navbar />

      {/* Auth Banner */}
      <div className="bg-ebony-deep border-b border-gold-leaf/20 py-2.5 px-6 text-center">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-parchment-ivory">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-leaf animate-pulse" />
          Authenticated Session · Private Collector Portal
        </div>
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-surface-container-low py-12 md:py-16 border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">Authenticated Access</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display-lg text-ebony-deep mb-2">Private Catalogue</motion.h1>
                <p className="font-sans text-sm text-on-surface-variant max-w-lg">
                  Your exclusive collection of privately curated artworks, vault holdings,
                  and confidential acquisition records. All data is encrypted and access-logged.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{VAULT_HOLDINGS.length} Holdings</span>
                <div className="flex border border-on-surface/10">
                  <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer border-0 transition-colors ${viewMode === "grid" ? "bg-ebony-deep text-parchment-ivory" : "bg-transparent text-on-surface-variant hover:text-ebony-deep"}`}>Grid</button>
                  <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer border-0 transition-colors ${viewMode === "list" ? "bg-ebony-deep text-parchment-ivory" : "bg-transparent text-on-surface-variant hover:text-ebony-deep"}`}>List</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Holdings List */}
            <div className="lg:col-span-5">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3">
                  {VAULT_HOLDINGS.map((h, idx) => (
                    <motion.div key={h.artwork.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                    <button
                      onClick={() => setSelectedHolding(h)}
                      className={`text-left border p-3 transition-all cursor-pointer bg-transparent ${
                        selectedHolding?.artwork.id === h.artwork.id
                          ? "border-gold-leaf bg-surface-container-low shadow-sm"
                          : "border-on-surface/10 hover:border-gold-leaf/50"
                      }`}
                    >
                      <div className="aspect-square bg-ebony-deep overflow-hidden mb-2 relative">
                        <img src={h.artwork.imageUrl} alt={h.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute top-1.5 right-1.5">
                          {h.certStatus === "Renewal Due" && (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider">Renewal</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold truncate">{h.artwork.period}</p>
                      <p className="text-[11px] font-bold text-ebony-deep truncate">{h.artwork.title}</p>
                      <p className="text-[9px] text-on-surface-variant mt-0.5">{h.vaultLocation}</p>
                    </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {VAULT_HOLDINGS.map((h, idx) => (
                    <motion.div key={h.artwork.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                    <button
                      onClick={() => setSelectedHolding(h)}
                      className={`w-full text-left flex items-center gap-3 p-3 border transition-all cursor-pointer bg-transparent ${
                        selectedHolding?.artwork.id === h.artwork.id
                          ? "border-gold-leaf bg-surface-container-low"
                          : "border-on-surface/10 hover:border-gold-leaf/50"
                      }`}
                    >
                      <div className="w-12 h-12 bg-ebony-deep overflow-hidden shrink-0">
                        <img src={h.artwork.imageUrl} alt={h.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-ebony-deep truncate">{h.artwork.title}</p>
                        <p className="text-[9px] text-on-surface-variant">{h.artwork.origin} · {h.artwork.material}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider ${CONDITION_COLORS[h.condition]}`}>{h.condition}</span>
                    </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-7">
              {selectedHolding ? (
                <motion.div key={selectedHolding.artwork.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="aspect-[4/5] bg-ebony-deep overflow-hidden relative">
                      <img src={selectedHolding.artwork.imageUrl} alt={selectedHolding.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 left-3 bg-ebony-deep/80 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1.5 border border-gold-leaf/20">
                        <Lock size={9} className="text-gold-leaf" />
                        <span className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest">Private Holding</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gold-leaf mb-1">{selectedHolding.artwork.period}</p>
                        <h2 className="font-serif text-2xl text-ebony-deep">{selectedHolding.artwork.title}</h2>
                        <p className="text-xs text-on-surface-variant mt-1">{selectedHolding.artwork.origin} · {selectedHolding.artwork.material}</p>
                      </div>
                      <div className="space-y-2.5 border-t border-on-surface/5 pt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">Dimensions</span>
                          <span className="text-ebony-deep font-medium">{selectedHolding.artwork.dimensions}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">Estimated Value</span>
                          <span className="text-ebony-deep font-semibold">{selectedHolding.insuranceValue}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">Acquisition Date</span>
                          <span className="text-ebony-deep font-medium">{selectedHolding.acquisitionDate}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">Condition</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CONDITION_COLORS[selectedHolding.condition]}`}>{selectedHolding.condition}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant">Certificate Status</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${selectedHolding.certStatus === "Valid" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>{selectedHolding.certStatus}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => router.push(`/artwork/${selectedHolding.artwork.id}`)} className="flex-1 bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5">
                          <Eye size={10} /> Full Details
                        </button>
                        <button className="flex-1 border border-on-surface/20 text-on-surface-variant px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent flex items-center justify-center gap-1.5">
                          <Download size={10} /> Dossier
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Vault Status */}
                  <div className="bg-surface-container-low border border-on-surface/5 p-6">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Vault Storage Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-surface p-3 border border-on-surface/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <MapPin size={11} className="text-gold-leaf" />
                          <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">Location</span>
                        </div>
                        <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.vaultLocation}</p>
                      </div>
                      <div className="bg-surface p-3 border border-on-surface/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Thermometer size={11} className="text-gold-leaf" />
                          <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">Temperature</span>
                        </div>
                        <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.temperature}</p>
                      </div>
                      <div className="bg-surface p-3 border border-on-surface/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Droplets size={11} className="text-gold-leaf" />
                          <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">Humidity</span>
                        </div>
                        <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.humidity}</p>
                      </div>
                      <div className="bg-surface p-3 border border-on-surface/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileCheck size={11} className="text-gold-leaf" />
                          <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">Last Inspection</span>
                        </div>
                        <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.lastInspection}</p>
                      </div>
                    </div>
                    {selectedHolding.certStatus === "Renewal Due" && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-800">Certificate Renewal Required</p>
                          <p className="text-[11px] text-amber-700 mt-0.5">Your certificate of authenticity for this piece is due for renewal. Contact our curatorial team to initiate the renewal process.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 border border-dashed border-on-surface/10">
                  <p className="text-xs text-on-surface-variant/40 uppercase tracking-widest">Select a holding to view details</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}