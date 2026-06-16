"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Lock,
  Clock,
  Send,
  X,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import CollectorHeader from "@/components/dashboard/CollectorHeader";
import AuthGuard from "@/components/AuthGuard";
import { useTranslate } from "@/lib/translations";
import { ActiveTab, CollectorProfile } from "@/lib/dashboardTypes";
import { useAuth } from "@/lib/auth";
import { artworksApi, ArtworkData } from "@/lib/api";

interface PreviewArtwork {
  id: string;
  title: string;
  origin: string;
  region: string;
  tribe: string;
  material: string;
  period: string;
  dimensions: string;
  imageUrl: string;
  estimatedValue: string;
  scarcityIndex: number;
  description: string;
  isPublished: boolean;
}

export default function PreviewPage() {
  const { lang, tAsync } = useTranslate();
  const router = useRouter();
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
  const [previewArtworks, setPreviewArtworks] = useState<PreviewArtwork[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const abortRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const runId = ++abortRef.current;

    async function fetchPreview() {
      setIsLoadingPreview(true);
      try {
        const res = await artworksApi.getAll({ limit: 50 });
        const artworks: ArtworkData[] = res.data || [];
        const previews: PreviewArtwork[] = artworks.slice(0, 6).map((art, i) => ({
          id: art.id || `preview-${i}`,
          title: art.title,
          origin: art.origin || art.region,
          region: art.region,
          tribe: art.tribe,
          material: art.material,
          period: art.period,
          dimensions: art.dimensions,
          imageUrl: art.imageUrl,
          estimatedValue: art.investment?.estimatedValue
            ? `€${(art.investment.estimatedValue / 1000).toFixed(0)}K`
            : "Price on Request",
          scarcityIndex: art.scarcityIndex || 80,
          description: art.historicalStory || "",
          isPublished: false,
        }));
        if (!cancelled && runId === abortRef.current) setPreviewArtworks(previews);
      } catch {
        if (!cancelled && runId === abortRef.current) setPreviewArtworks([]);
      } finally {
        if (!cancelled && runId === abortRef.current) setIsLoadingPreview(false);
      }
    }
    fetchPreview();
    return () => { cancelled = true; };
  }, []);
  const [selectedArtwork, setSelectedArtwork] = useState<PreviewArtwork | null>(null);
  const [showPORModal, setShowPORModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [porFirstName, setPorFirstName] = useState("");
  const [porLastName, setPorLastName] = useState("");
  const [porEmail, setPorEmail] = useState("");
  const [porPhone, setPorPhone] = useState("");
  const [porBudget, setPorBudget] = useState("€100K – €500K");
  const [porMessage, setPorMessage] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [porSubmitted, setPorSubmitted] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveConfirmed, setReserveConfirmed] = useState(false);

  const resetPOR = () => {
    setShowPORModal(false);
    setPorSubmitted(false);
    setPorFirstName("");
    setPorLastName("");
    setPorEmail("");
    setPorPhone("");
    setPorBudget("€100K – €500K");
    setPorMessage("");
    setGdprConsent(false);
  };

  const resetReserve = () => {
    setShowReserveModal(false);
    setReserveConfirmed(false);
  };

  return (
    <AuthGuard permission="previews">
    <div className="bg-surface text-ebony-deep min-h-screen font-sans flex flex-col transition-all duration-300 overflow-x-hidden">
      <Sidebar
        activeTab={ActiveTab.Previews}
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
        activeTab={ActiveTab.Previews}
        onBack={() => router.push("/dashboard")}
        canGoBack={true}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <main className={`flex-1 bg-background min-h-screen overflow-hidden transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
        {/* Hero */}
        <section className="bg-ebony-deep py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">{lang === "fr" ? "Exclusif VIP" : "VIP Exclusive"}</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display-lg text-parchment-ivory mb-4">{lang === "fr" ? "Aperçus Exclusifs" : "Exclusive Previews"}</h1>
            </motion.div>
            <p className="font-sans text-sm text-parchment-ivory/60 max-w-xl">
              {lang === "fr" ? "Accès prioritaire aux acquisitions à venir avant la publication. Exprimez votre intérêt ou réservez des œuvres directement depuis cette salle d'aperçu exclusive." : "Priority access to upcoming acquisitions before public listing. Express interest or reserve artworks directly from this exclusive preview room."}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <Lock size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Accès Pré-Publication" : "Pre-Publication Access"}
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <ShieldCheck size={12} className="text-gold-leaf/70" /> {lang === "fr" ? "Membres VIP Uniquement" : "VIP Members Only"}
              </div>
            </div>
          </div>
        </section>

        {/* Artwork Grid */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs text-on-surface-variant">
              <span className="font-bold text-ebony-deep">{previewArtworks.length}</span> {lang === "fr" ? "acquisitions à venir" : "upcoming acquisitions"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingPreview ? (
              <div className="col-span-full text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-gold-leaf border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-sans text-sm text-on-surface-variant">{lang === "fr" ? "Chargement des aperçus..." : "Loading previews..."}</p>
              </div>
            ) : previewArtworks.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-surface-container-low border border-on-surface/5">
                <Eye className="mx-auto mb-4 text-on-surface-variant/30" size={48} />
                <p className="font-serif text-xl text-ebony-deep mb-2">{lang === "fr" ? "Aucun aperçu disponible" : "No Previews Available"}</p>
                <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">{lang === "fr" ? "Aucune œuvre à venir n'a été trouvée. Veuillez vous assurer que le serveur backend est en cours d'exécution." : "No upcoming artworks found. Please ensure the backend server is running and artworks have been created."}</p>
              </div>
            ) : previewArtworks.map((artwork, idx) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative bg-ebony-deep overflow-hidden mb-4 aspect-[4/5]">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Confidential Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-parchment-ivory/10 font-serif text-6xl font-bold uppercase rotate-[-30deg] tracking-widest select-none">
                      {lang === "fr" ? "CONFIDENTIEL" : "CONFIDENTIAL"}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 bg-ebony-deep/80 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1.5 border border-gold-leaf/20">
                    <Lock size={9} className="text-gold-leaf" />
                    <span className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest">{lang === "fr" ? "Aperçu" : "Preview"}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ebony-deep/90 to-transparent text-parchment-ivory">
                    <p className="text-[9px] tracking-widest text-gold-leaf uppercase font-bold">{artwork.period} · {artwork.material}</p>
                    <h3 className="font-serif text-base mt-0.5">{artwork.title}</h3>
                    <p className="text-[10px] text-parchment-ivory/50 mt-0.5">{artwork.origin}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{lang === "fr" ? "Valeur Estimée" : "Estimated Value"}</p>
                      <p className="font-serif text-sm text-ebony-deep font-semibold">{artwork.estimatedValue}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{lang === "fr" ? "Rareté" : "Scarcity"}</p>
                      <p className="font-serif text-sm text-gold-leaf font-semibold">{artwork.scarcityIndex}/100</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedArtwork(artwork); setShowPORModal(true); }}
                      className="flex-1 bg-ebony-deep text-parchment-ivory px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send size={10} /> {lang === "fr" ? "Demande Prioritaire" : "Priority Inquiry"}
                    </button>
                    <button
                      onClick={() => { setSelectedArtwork(artwork); setShowReserveModal(true); }}
                      className="flex-1 border border-gold-leaf text-gold-leaf px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-leaf/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock size={10} /> {lang === "fr" ? "Réserver 48h" : "Reserve 48h"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
