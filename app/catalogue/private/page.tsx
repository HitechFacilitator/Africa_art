"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Eye,
  Download,
  MapPin,
  Thermometer,
  Droplets,
  FileCheck,
  AlertTriangle,
  Send,
  X,
  CheckCircle,
  ShieldCheck,
  Shield,
  AlertCircle,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import CollectorHeader from "@/components/dashboard/CollectorHeader";
import AuthGuard from "@/components/AuthGuard";
import { useArtworks } from "@/lib/hooks";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtworks } from "@/lib/useTranslatedArtwork";
import { ActiveTab, CollectorProfile } from "@/lib/dashboardTypes";
import { useAuth } from "@/lib/auth";
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
  isPublic: boolean;
}

const vaultHoldingsData: VaultHolding[] = [];

const CONDITION_COLORS = {
  Pristine: "text-emerald-600 bg-emerald-50",
  Excellent: "text-blue-600 bg-blue-50",
  Good: "text-amber-600 bg-amber-50",
  "Restoration Pending": "text-red-600 bg-red-50",
};

const PRIVATE_CATALOGUES = [
  { id: "cat-1", name: "West African Masterworks", count: 3, lastUpdated: "2026-05-10", accessLevel: "Confidential" },
  { id: "cat-2", name: "East African Sculptural", count: 5, lastUpdated: "2026-04-22", accessLevel: "Confidential" },
  { id: "cat-3", name: "Central African Power Objects", count: 2, lastUpdated: "2026-03-15", accessLevel: "Top Secret" },
];

export default function PrivateCataloguePage() {
  const router = useRouter();
  const { lang } = useTranslate();
  const { artworks: apiArtworks } = useArtworks({ artworkStatus: "Draft" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const { user } = useAuth();
  const profile: CollectorProfile = {
    name: user?.name || "Guest",
    tier: user?.role === "prestige" ? "Prestige Tier" : "Member Tier",
    currency: "EUR (€)",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    curatorName: "Aduna Advisory Desk",
    regionsOfInterest: ["West Africa", "Central Africa", "East Africa"],
  };
  const translatedArtworks = useTranslatedArtworks((apiArtworks as unknown as Artwork[]).slice(0, 4));
  const vaultHoldings: VaultHolding[] = translatedArtworks.map((art, i) => ({
    artwork: art,
    vaultLocation: ["Geneva Vault, Bay 7-A", "Zurich Freeport, Vault 12", "London Storage, Room 3-B", "Singapore Hub, Vault 5"][i],
    temperature: ["18.2°C", "17.8°C", "18.5°C", "19.1°C"][i],
    humidity: ["48%", "51%", "47%", "52%"][i],
    lastInspection: ["2026-05-14", "2026-04-28", "2026-05-20", "2026-03-15"][i],
    insuranceValue: art.investment?.estimatedValue ? `€${art.investment.estimatedValue.toLocaleString()}` : "€1.2M",
    acquisitionDate: ["2023-06-15", "2024-01-22", "2023-11-08", "2025-02-10"][i],
    condition: ["Pristine", "Excellent", "Excellent", "Pristine"][i] as VaultHolding["condition"],
    certStatus: ["Valid", "Valid", "Renewal Due", "Valid"][i] as VaultHolding["certStatus"],
    isPublic: i < 2,
  }));
  const [selectedHolding, setSelectedHolding] = useState<VaultHolding | null>(vaultHoldings[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<"holdings" | "catalogues">("holdings");
  const [showPORExpress, setShowPORExpress] = useState(false);
  const [porArtwork, setPorArtwork] = useState<string>("");
  const [porMessage, setPorMessage] = useState("");
  const [porSubmitted, setPorSubmitted] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [deniedArtwork, setDeniedArtwork] = useState<string>("");

  const handleExpressInterest = (artworkTitle: string) => {
    setPorArtwork(artworkTitle);
    setShowPORExpress(true);
    setPorSubmitted(false);
    setPorMessage("");
  };

  const resetPORExpress = () => {
    setShowPORExpress(false);
    setPorSubmitted(false);
    setPorMessage("");
  };

  const handleAccessDenied = (artworkTitle: string) => {
    setDeniedArtwork(artworkTitle);
    setShowAccessDenied(true);
  };

  const confidentialHoldings = vaultHoldings.filter(h => !h.isPublic);
  const publicHoldings = vaultHoldings.filter(h => h.isPublic);

  return (
    <AuthGuard permission="private_catalogues">
    <div className="bg-surface text-ebony-deep min-h-screen font-sans flex flex-col transition-all duration-300 overflow-x-hidden">
      <Sidebar
        activeTab={ActiveTab.PrivateCatalogues}
        setActiveTab={(tab) => router.push("/dashboard")}
        profile={profile}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={() => {
          if (confirm(lang === "fr" ? "Révoquer la session ?" : 'De-authorize session?')) {
            alert(lang === "fr" ? "Session fermée." : 'Session closed.');
          }
        }}
      />

      <CollectorHeader
        activeTab={ActiveTab.PrivateCatalogues}
        onBack={() => router.push("/dashboard")}
        canGoBack={true}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <main className={`flex-1 bg-background min-h-screen overflow-hidden transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
        {/* Hero */}
        <section className="bg-surface-container-low py-12 md:py-16 border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">{lang === "fr" ? "Accès Authentifié" : "Authenticated Access"}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display-lg text-ebony-deep mb-2">{lang === "fr" ? "Catalogue Privé" : "Private Catalogue"}</motion.h1>
                <p className="font-sans text-sm text-on-surface-variant max-w-lg">
                  {lang === "fr" ? "Votre collection exclusive d'œuvres d'art sélectionnées en privé, de détentions en coffre-fort et d'enregistrements d'acquisition confidentiels. Toutes les données sont chiffrées et les accès sont enregistrés." : "Your exclusive collection of privately curated artworks, vault holdings, and confidential acquisition records. All data is encrypted and access-logged."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{vaultHoldings.length} {lang === "fr" ? "Détentions" : "Holdings"}</span>
                <div className="flex border border-on-surface/10">
                  <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer border-0 transition-colors ${viewMode === "grid" ? "bg-ebony-deep text-parchment-ivory" : "bg-transparent text-on-surface-variant hover:text-ebony-deep"}`}>Grid</button>
                  <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer border-0 transition-colors ${viewMode === "list" ? "bg-ebony-deep text-parchment-ivory" : "bg-transparent text-on-surface-variant hover:text-ebony-deep"}`}>List</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("holdings")}
                className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer bg-transparent ${
                  activeTab === "holdings"
                    ? "text-ebony-deep border-gold-leaf"
                    : "text-on-surface-variant border-transparent hover:text-ebony-deep"
                }`}
              >
                {lang === "fr" ? "Actions en Coffre-fort" : "Vault Holdings"}
              </button>
              <button
                onClick={() => setActiveTab("catalogues")}
                className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer bg-transparent ${
                  activeTab === "catalogues"
                    ? "text-ebony-deep border-gold-leaf"
                    : "text-on-surface-variant border-transparent hover:text-ebony-deep"
                }`}
              >
                {lang === "fr" ? "Catalogues Privés" : "Private Catalogues"}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12">
          {activeTab === "holdings" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Holdings List */}
              <div className="lg:col-span-5">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {vaultHoldings.map((h, idx) => (
                      <motion.div key={h.artwork.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                      <button
                        onClick={() => {
                          if (h.isPublic) {
                            setSelectedHolding(h);
                          } else {
                            handleAccessDenied(h.artwork.title);
                          }
                        }}
                        className={`text-left border p-3 transition-all cursor-pointer bg-transparent ${
                          selectedHolding?.artwork.id === h.artwork.id
                            ? "border-gold-leaf bg-surface-container-low shadow-sm"
                            : "border-on-surface/10 hover:border-gold-leaf/50"
                        }`}
                      >
                        <div className="aspect-square bg-ebony-deep overflow-hidden mb-2 relative">
                          <img src={h.artwork.imageUrl} alt={h.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {!h.isPublic && (
                            <div className="absolute inset-0 flex items-center justify-center bg-ebony-deep/60">
                              <Lock size={20} className="text-gold-leaf" />
                            </div>
                          )}
                          <div className="absolute top-1.5 right-1.5">
                            {h.certStatus === "Renewal Due" && (
                              <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider">{lang === "fr" ? "Renouvellement" : "Renewal"}</span>
                            )}
                          </div>
                          {!h.isPublic && (
                            <div className="absolute bottom-1.5 left-1.5">
                              <span className="px-1.5 py-0.5 bg-terracotta-earth text-white text-[8px] font-bold uppercase tracking-wider">{lang === "fr" ? "Confidentiel" : "Confidential"}</span>
                            </div>
                          )}
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
                    {vaultHoldings.map((h, idx) => (
                      <motion.div key={h.artwork.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                      <button
                        onClick={() => {
                          if (h.isPublic) {
                            setSelectedHolding(h);
                          } else {
                            handleAccessDenied(h.artwork.title);
                          }
                        }}
                        className={`w-full text-left flex items-center gap-3 p-3 border transition-all cursor-pointer bg-transparent ${
                          selectedHolding?.artwork.id === h.artwork.id
                            ? "border-gold-leaf bg-surface-container-low"
                            : "border-on-surface/10 hover:border-gold-leaf/50"
                        }`}
                      >
                        <div className="w-12 h-12 bg-ebony-deep overflow-hidden shrink-0 relative">
                          <img src={h.artwork.imageUrl} alt={h.artwork.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {!h.isPublic && (
                            <div className="absolute inset-0 flex items-center justify-center bg-ebony-deep/60">
                              <Lock size={12} className="text-gold-leaf" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] font-bold text-ebony-deep truncate">{h.artwork.title}</p>
                            {!h.isPublic && (
                              <span className="px-1 py-0.5 bg-terracotta-earth text-white text-[7px] font-bold uppercase tracking-wider shrink-0">{lang === "fr" ? "Confidentiel" : "Confidential"}</span>
                            )}
                          </div>
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
                          <span className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest">{lang === "fr" ? "Détention Privée" : "Private Holding"}</span>
                        </div>
                        {!selectedHolding.isPublic && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-parchment-ivory/10 font-serif text-5xl font-bold uppercase rotate-[-30deg] tracking-widest select-none">
                              {lang === "fr" ? "CONFIDENTIEL" : "CONFIDENTIAL"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gold-leaf mb-1">{selectedHolding.artwork.period}</p>
                          <h2 className="font-serif text-2xl text-ebony-deep">{selectedHolding.artwork.title}</h2>
                          <p className="text-xs text-on-surface-variant mt-1">{selectedHolding.artwork.origin} · {selectedHolding.artwork.material}</p>
                        </div>
                        <div className="space-y-2.5 border-t border-on-surface/5 pt-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">{lang === "fr" ? "Dimensions" : "Dimensions"}</span>
                            <span className="text-ebony-deep font-medium">{selectedHolding.artwork.dimensions}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">{lang === "fr" ? "Valeur Estimée" : "Estimated Value"}</span>
                            <span className="text-ebony-deep font-semibold">{selectedHolding.insuranceValue}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">{lang === "fr" ? "Date d'Acquisition" : "Acquisition Date"}</span>
                            <span className="text-ebony-deep font-medium">{selectedHolding.acquisitionDate}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">{lang === "fr" ? "État" : "Condition"}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CONDITION_COLORS[selectedHolding.condition]}`}>{selectedHolding.condition}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-on-surface-variant">{lang === "fr" ? "Statut du Certificat" : "Certificate Status"}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${selectedHolding.certStatus === "Valid" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>{selectedHolding.certStatus}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => router.push(`/artwork/${selectedHolding.artwork.id}`)} className="flex-1 bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5">
                            <Eye size={10} /> {lang === "fr" ? "Détails Complets" : "Full Details"}
                          </button>
                          <button
                            onClick={() => handleExpressInterest(selectedHolding.artwork.title)}
                            className="flex-1 border border-gold-leaf text-gold-leaf px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf/10 transition-colors cursor-pointer bg-transparent flex items-center justify-center gap-1.5"
                          >
                            <Send size={10} /> {lang === "fr" ? "Exprimer l'Intérêt" : "Express Interest"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Vault Status */}
                    <div className="bg-surface-container-low border border-on-surface/5 p-6">
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">{lang === "fr" ? "État du Stockage en Coffre-fort" : "Vault Storage Status"}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-surface p-3 border border-on-surface/5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MapPin size={11} className="text-gold-leaf" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Emplacement" : "Location"}</span>
                          </div>
                          <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.vaultLocation}</p>
                        </div>
                        <div className="bg-surface p-3 border border-on-surface/5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Thermometer size={11} className="text-gold-leaf" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Température" : "Temperature"}</span>
                          </div>
                          <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.temperature}</p>
                        </div>
                        <div className="bg-surface p-3 border border-on-surface/5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Droplets size={11} className="text-gold-leaf" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Humidité" : "Humidity"}</span>
                          </div>
                          <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.humidity}</p>
                        </div>
                        <div className="bg-surface p-3 border border-on-surface/5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <FileCheck size={11} className="text-gold-leaf" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Dernière Inspection" : "Last Inspection"}</span>
                          </div>
                          <p className="text-xs text-ebony-deep font-semibold">{selectedHolding.lastInspection}</p>
                        </div>
                      </div>
                      {selectedHolding.certStatus === "Renewal Due" && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-amber-800">{lang === "fr" ? "Renouvellement de Certificat Requis" : "Certificate Renewal Required"}</p>
                            <p className="text-[11px] text-amber-700 mt-0.5">{lang === "fr" ? "Votre certificat d'authenticité pour cette pièce est à renouveler. Contactez notre équipe de conservateurs pour initier le processus de renouvellement." : "Your certificate of authenticity for this piece is due for renewal. Contact our curatorial team to initiate the renewal process."}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-64 border border-dashed border-on-surface/10">
                    <p className="text-xs text-on-surface-variant/40 uppercase tracking-widest">{lang === "fr" ? "Sélectionnez une détention pour voir les détails" : "Select a holding to view details"}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Private Catalogues Tab */
            <div className="max-w-3xl">
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-ebony-deep mb-2">{lang === "fr" ? "Catalogues Privés" : "Private Catalogues"}</h2>
                <p className="font-sans text-sm text-on-surface-variant">
                  {lang === "fr" ? "Accédez à vos catalogues exclusifs sélectionnés. Chaque catalogue contient des œuvres d'art détenues en privé avec un accès réservé aux membres VIP authentifiés." : "Access your exclusive curated catalogues. Each catalogue contains privately held artworks with access restricted to authenticated VIP members."}
                </p>
              </div>
              <div className="space-y-4">
                {PRIVATE_CATALOGUES.map((cat, idx) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border border-on-surface/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold-leaf/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-ebony-deep flex items-center justify-center shrink-0">
                        <Lock size={16} className="text-gold-leaf" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-ebony-deep">{cat.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{cat.count} {lang === "fr" ? "Œuvres" : "Artworks"}</span>
                          <span className="text-[9px] text-on-surface-variant/40">·</span>
                          <span className="text-[9px] text-on-surface-variant">{lang === "fr" ? "Mis à jour " : "Updated "}{cat.lastUpdated}</span>
                          <span className="text-[9px] text-on-surface-variant/40">·</span>
                          <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${cat.accessLevel === "Top Secret" ? "bg-terracotta-earth text-white" : "bg-ebony-deep text-parchment-ivory"}`}>{cat.accessLevel}</span>
                        </div>
                      </div>
                    </div>
                    <button className="border border-gold-leaf text-gold-leaf px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf/10 transition-colors cursor-pointer bg-transparent flex items-center gap-1.5">
                      <Eye size={10} /> {lang === "fr" ? "Voir le Catalogue" : "View Catalogue"}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
    </AuthGuard>
  );
}
