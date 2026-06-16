"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Gavel,
  Clock,
  TrendingUp,
  Eye,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  X,
  CheckCircle,
  AlertTriangle,
  Send,
  Trophy,
  Bell,
  Heart,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import CollectorHeader from "@/components/dashboard/CollectorHeader";
import AuthGuard from "@/components/AuthGuard";
import { useTranslate } from "@/lib/translations";
import { ActiveTab, CollectorProfile } from "@/lib/dashboardTypes";
import { useAuth } from "@/lib/auth";

interface Bid {
  id: string;
  bidder: string;
  avatar: string;
  amount: number;
  time: string;
  isYou?: boolean;
}

interface AuctionLot {
  id: string;
  title: string;
  origin: string;
  period: string;
  material: string;
  imageUrl: string;
  currentBid: number;
  estimateLow: number;
  estimateHigh: number;
  bids: Bid[];
  watchers: number;
  timeLeft: string;
  status: "live" | "upcoming" | "ended";
  featured?: boolean;
}

const INITIAL_LOTS: AuctionLot[] = [
  {
    id: "lot-1",
    title: "Benin Bronze commemorative plaque",
    origin: "Kingdom of Benin, Nigeria",
    period: "16th–17th Century",
    material: "Copper alloy, iron",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ92I1jZERzyaqiKc3FH4C9WCoalLYXn4QtDJIh9ZxMxNszZAyIVEgqplLCo7hV6V2HH7-BoQadYiRfZZ2rRVU2KyFezQYJuPejkEXFZmCocL68oD0FhhmK9qjLDUo_dGaLRJjMVDik4XNPGjB6Oc9qTanNVOjjccILVz6KJ9t75nNkB6_MXRhluItt8QhY_hJT0f1IjvtTbYQtOVAAFWxowRUhcdAARMvXHJ_EcwLFlZ4EPwj2Hy7iJOq7_ZanC7qnp6Kfj7IvA",
    currentBid: 4200000,
    estimateLow: 3500000,
    estimateHigh: 5000000,
    bids: [
      { id: "b1", bidder: "Collector A.", avatar: "CA", amount: 4200000, time: "2m ago" },
      { id: "b2", bidder: "Museum Zürich", avatar: "MZ", amount: 4000000, time: "8m ago" },
      { id: "b3", bidder: "Private Fund", avatar: "PF", amount: 3800000, time: "15m ago" },
      { id: "b4", bidder: "Collector B.", avatar: "CB", amount: 3500000, time: "22m ago" },
      { id: "b5", bidder: "Gallery Royale", avatar: "GR", amount: 3200000, time: "31m ago" },
    ],
    watchers: 89,
    timeLeft: "2h 14m",
    status: "live",
    featured: true,
  },
  {
    id: "lot-2",
    title: "Yoruba Ade beaded crown",
    origin: "Oyo Empire, Nigeria",
    period: "19th Century",
    material: "Glass beads, cloth, basketry",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Beaded_crown_%28ade%29_of_Onijagbo_Obasoro_Alowolodu%2C_Ogoga_of_Ikere%2C_reigned_1890-1928%2C_Yoruba%2C_Ikere%2C_Osun_state%2C_Nigeria%2C_late_19th_century%2C_basketry%2C_beads%2C_cloth_-_Brooklyn_Museum_-_Brooklyn%2C_NY_-_DSC08538.JPG",
    currentBid: 1800000,
    estimateLow: 1200000,
    estimateHigh: 2000000,
    bids: [
      { id: "b6", bidder: "Art Capital", avatar: "AC", amount: 1800000, time: "5m ago" },
      { id: "b7", bidder: "Collector C.", avatar: "CC", amount: 1600000, time: "12m ago" },
      { id: "b8", bidder: "Heritage Trust", avatar: "HT", amount: 1400000, time: "19m ago" },
    ],
    watchers: 56,
    timeLeft: "5h 42m",
    status: "live",
  },
  {
    id: "lot-3",
    title: "Kuba Ndop royal portrait board",
    origin: "Kuba Kingdom, DR Congo",
    period: "18th Century",
    material: "Wood",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Brooklyn_Museum_61.33_Ndop_Portrait_of_King_Mishe_miShyaang_maMbul_%2810%29.jpg",
    currentBid: 890000,
    estimateLow: 600000,
    estimateHigh: 1000000,
    bids: [
      { id: "b9", bidder: "Collector D.", avatar: "CD", amount: 890000, time: "1h ago" },
      { id: "b10", bidder: "Museum Berlin", avatar: "MB", amount: 750000, time: "2h ago" },
    ],
    watchers: 41,
    timeLeft: "1d 3h",
    status: "upcoming",
  },
  {
    id: "lot-4",
    title: "Dogon Tellem ancestor figure",
    origin: "Bandiagara Cliffs, Mali",
    period: "16th–17th Century",
    material: "Wood, organic materials",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Male_Figure_with_Raised_Arms_MET_DP302219.jpg",
    currentBid: 0,
    estimateLow: 280000,
    estimateHigh: 420000,
    bids: [],
    watchers: 33,
    timeLeft: "3d 8h",
    status: "upcoming",
  },
  {
    id: "lot-5",
    title: "Akan gold weight set (12 pieces)",
    origin: "Asante Kingdom, Ghana",
    period: "18th–19th Century",
    material: "Brass, gold alloy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Akan_Goldweights.jpg",
    currentBid: 340000,
    estimateLow: 200000,
    estimateHigh: 400000,
    bids: [
      { id: "b11", bidder: "Collector E.", avatar: "CE", amount: 340000, time: "3m ago" },
      { id: "b12", bidder: "West Art Ltd.", avatar: "WA", amount: 310000, time: "7m ago" },
      { id: "b13", bidder: "Collector F.", avatar: "CF", amount: 280000, time: "11m ago" },
      { id: "b14", bidder: "Gold Coast Mus.", avatar: "GC", amount: 250000, time: "18m ago" },
    ],
    watchers: 67,
    timeLeft: "45m",
    status: "live",
  },
];

function useTranslatedAuctionLots(lots: AuctionLot[]) {
  const { lang, tAsync } = useTranslate();
  const [translated, setTranslated] = useState<AuctionLot[]>(lots);
  const abortRef = useRef(0);

  useEffect(() => {
    if (lang === "en") { setTranslated(lots); return; }
    let cancelled = false;
    const runId = ++abortRef.current;
    async function translate() {
      const results = await Promise.all(
        lots.map(async (lot) => ({
          ...lot,
          title: await tAsync(lot.title),
          origin: await tAsync(lot.origin),
          period: await tAsync(lot.period),
          material: await tAsync(lot.material),
        }))
      );
      if (!cancelled && runId === abortRef.current) setTranslated(results);
    }
    translate();
    return () => { cancelled = true; };
  }, [lang, tAsync, lots]);

  return translated;
}

function CountdownTimer({ timeLeft, lang }: { timeLeft: string; lang: string }) {
  const [display, setDisplay] = useState(timeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay((prev) => {
        const match = prev.match(/(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m)?/);
        if (!match) return prev;
        let days = parseInt(match[1] || "0");
        let hours = parseInt(match[2] || "0");
        let minutes = parseInt(match[3] || "0");
        minutes -= 1;
        if (minutes < 0) { minutes = 59; hours -= 1; }
        if (hours < 0) { hours = 23; days -= 1; }
        if (days < 0) return lang === "fr" ? "Terminé" : "Ended";
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0 || days > 0) parts.push(`${hours}h`);
        parts.push(`${minutes}m`);
        return parts.join(" ");
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [lang]);

  return <span>{display}</span>;
}

type BidModalState = "idle" | "placing" | "confirming" | "won" | "outbid";

export default function AuctionsPage() {
  const { lang } = useTranslate();
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

  const [lots, setLots] = useState<AuctionLot[]>([]);
  const translatedLots = useTranslatedAuctionLots(lots);
  const [selectedLot, setSelectedLot] = useState<AuctionLot | null>(null);
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");
  const [watchedLots, setWatchedLots] = useState<Set<string>>(new Set());
  const [isLoadingAuctions, setIsLoadingAuctions] = useState(true);

  // Bid modal state
  const [bidModalState, setBidModalState] = useState<BidModalState>("idle");
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidError, setBidError] = useState<string>("");
  const [showBidModal, setShowBidModal] = useState(false);

  // Keep selectedLot in sync with translated lots
  useEffect(() => {
    if (selectedLot) {
      const updated = translatedLots.find(l => l.id === selectedLot.id);
      if (updated) setSelectedLot(updated);
    } else if (translatedLots.length > 0) {
      setSelectedLot(translatedLots[0]);
    }
  }, [translatedLots]);

  // Fetch auction lots from API (falls back to empty if no endpoint)
  useEffect(() => {
    let cancelled = false;
    async function fetchLots() {
      setIsLoadingAuctions(true);
      try {
        const token = localStorage.getItem("aduna_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auctions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.data) setLots(data.data);
        }
      } catch {
        // No auction endpoint available - show empty state
      } finally {
        if (!cancelled) setIsLoadingAuctions(false);
      }
    }
    fetchLots();
    return () => { cancelled = true; };
  }, []);

  const filtered = translatedLots.filter((l) => filter === "all" || l.status === filter);
  const liveCount = translatedLots.filter((l) => l.status === "live").length;

  const toggleWatch = useCallback((lotId: string) => {
    setWatchedLots(prev => {
      const next = new Set(prev);
      if (next.has(lotId)) next.delete(lotId);
      else next.add(lotId);
      return next;
    });
  }, []);

  const openBidModal = (lot: AuctionLot) => {
    setSelectedLot(lot);
    setBidAmount("");
    setBidError("");
    setBidModalState("idle");
    setShowBidModal(true);
  };

  const placeBid = () => {
    if (!selectedLot) return;
    const amount = parseInt(bidAmount.replace(/\D/g, ""), 10);
    if (!amount || amount <= selectedLot.currentBid) {
      setBidError(lang === "fr"
        ? `L'offre doit être supérieure à €${(selectedLot.currentBid / 1000000).toFixed(1)}M`
        : `Bid must be higher than €${(selectedLot.currentBid / 1000000).toFixed(1)}M`);
      return;
    }
    setBidError("");
    setBidModalState("confirming");

    // Simulate bid placement
    setTimeout(() => {
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        bidder: "You",
        avatar: "JD",
        amount,
        time: "just now",
        isYou: true,
      };

      setLots(prev => prev.map(l => {
        if (l.id === selectedLot.id) {
          return { ...l, currentBid: amount, bids: [newBid, ...l.bids] };
        }
        return l;
      }));

      // Simulate being outbid after a delay
      setTimeout(() => {
        setBidModalState("outbid");
      }, 8000);

      setBidModalState("won");
    }, 1500);
  };

  const quickBids = selectedLot ? [
    selectedLot.currentBid + 100000,
    selectedLot.currentBid + 250000,
    selectedLot.currentBid + 500000,
    selectedLot.currentBid + 1000000,
  ] : [];

  return (
    <AuthGuard permission="auctions">
    <div className="bg-surface text-ebony-deep min-h-screen font-sans flex flex-col transition-all duration-300 overflow-x-hidden">
      <Sidebar
        activeTab={ActiveTab.AlertsAuctions}
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
        activeTab={ActiveTab.AlertsAuctions}
        onBack={() => router.push("/dashboard")}
        canGoBack={true}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <main className={`flex-1 bg-background min-h-screen overflow-hidden transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
        {/* Hero */}
        <section className="bg-ebony-deep py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_30%_50%,_#C5A059_0%,_transparent_60%)]" />
          <div className="absolute top-10 right-10 opacity-5">
            <Gavel size={200} className="text-gold-leaf" />
          </div>
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-terracotta-earth animate-pulse" />
              <span className="label-caps text-terracotta-earth">{lang === "fr" ? "Ventes en Direct" : "Live Auctions"}</span>
            </div>
            <h1 className="font-display-lg text-parchment-ivory mb-3">{lang === "fr" ? "Salle des Ventes" : "Auction Room"}</h1>
            <p className="font-sans text-sm text-parchment-ivory/50 max-w-lg">
              {lang === "fr" ? "Participez à des ventes aux enchères exclusives de chefs-d'œuvre artistiques africains certifiés. Chaque pièce est vérifiée par le Comité d'Authentification Aduna." : "Bid on exclusive certified African art masterpieces. Every piece is vetted by the Aduna Authentication Committee."}
            </p>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-parchment-ivory/40 text-xs">
                <Flame size={14} className="text-terracotta-earth" />
                <span><strong className="text-parchment-ivory">{liveCount}</strong> {lang === "fr" ? "ventes actives" : "live lots"}</span>
              </div>
              <div className="flex items-center gap-2 text-parchment-ivory/40 text-xs">
                <Users size={14} className="text-gold-leaf" />
                <span><strong className="text-parchment-ivory">247</strong> {lang === "fr" ? "collectionneurs en ligne" : "collectors online"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="border-b border-on-surface/5">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-3 flex gap-2">
            {(["all", "live", "upcoming"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer bg-transparent ${
                  filter === f ? "border-ebony-deep bg-ebony-deep text-parchment-ivory" : "border-on-surface/10 text-on-surface-variant hover:border-gold-leaf/50"
                }`}
              >
                {f === "all" ? (lang === "fr" ? "Toutes" : "All Lots") : f === "live" ? (lang === "fr" ? "En Direct" : "Live Now") : (lang === "fr" ? "À Venir" : "Upcoming")}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Lot List */}
            <div className="lg:col-span-5 space-y-3">
              {isLoadingAuctions ? (
                <div className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-2 border-gold-leaf border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-sans text-sm text-on-surface-variant">{lang === "fr" ? "Chargement des enchères..." : "Loading auction lots..."}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-surface-container-low border border-on-surface/5">
                  <Gavel className="mx-auto mb-4 text-on-surface-variant/30" size={48} />
                  <p className="font-serif text-xl text-ebony-deep mb-2">{lang === "fr" ? "Aucune enchère disponible" : "No Auction Lots Available"}</p>
                  <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">{lang === "fr" ? "Aucune enchère n'est actuellement en cours. Veuillez vous assurer que le serveur backend est en cours d'exécution." : "No auction lots are currently active. Please ensure the backend server is running."}</p>
                </div>
              ) : (
              filtered.map((lot) => (
                <button
                  key={lot.id}
                  onClick={() => setSelectedLot(lot)}
                  className={`w-full text-left border transition-all cursor-pointer bg-transparent ${
                    selectedLot?.id === lot.id
                      ? "border-gold-leaf bg-surface-container-low shadow-sm"
                      : "border-on-surface/10 hover:border-gold-leaf/50"
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 bg-ebony-deep overflow-hidden shrink-0">
                      <img src={lot.imageUrl} alt={lot.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {lot.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-terracotta-earth animate-pulse" />}
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${lot.status === "live" ? "text-terracotta-earth" : "text-on-surface-variant"}`}>
                          {lot.status === "live" ? (lang === "fr" ? "En Direct" : "Live") : (lang === "fr" ? "À Venir" : "Upcoming")}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-ebony-deep truncate">{lot.title}</p>
                      <p className="text-[9px] text-on-surface-variant">{lot.origin} · {lot.period}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {lot.currentBid > 0 && (
                          <span className="text-[10px] font-bold text-gold-leaf">€{(lot.currentBid / 1000000).toFixed(1)}M</span>
                        )}
                        <span className="text-[9px] text-on-surface-variant">{lot.bids.length} {lang === "fr" ? "offres" : "bids"}</span>
                        <span className="text-[9px] text-on-surface-variant flex items-center gap-1"><Eye size={10} />{lot.watchers}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )))}
            </div>

            {/* Lot Detail */}
            <div className="lg:col-span-7">
              {selectedLot ? (
                <motion.div key={selectedLot.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  {/* Image */}
                  <div className="relative w-full aspect-[16/10] bg-ebony-deep overflow-hidden mb-6">
                    <img src={selectedLot.imageUrl} alt={selectedLot.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    <div className="absolute top-4 left-4">
                      {selectedLot.status === "live" ? (
                        <div className="bg-terracotta-earth/90 text-parchment-ivory px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-parchment-ivory animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{lang === "fr" ? "En Direct" : "Live Now"}</span>
                        </div>
                      ) : (
                        <div className="bg-ebony-deep/80 text-parchment-ivory px-3 py-1.5 backdrop-blur-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest">{lang === "fr" ? "À Venir" : "Upcoming"}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 bg-ebony-deep/80 text-parchment-ivory px-3 py-1.5 backdrop-blur-sm flex items-center gap-1.5">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold"><CountdownTimer timeLeft={selectedLot.timeLeft} lang={lang} /></span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mb-6">
                    <p className="label-caps text-gold-leaf mb-2">{lang === "fr" ? `Lot ${selectedLot.id.replace("lot-", "")}` : `Lot ${selectedLot.id.replace("lot-", "")}`}</p>
                    <h2 className="font-serif text-2xl text-ebony-deep mb-2">{selectedLot.title}</h2>
                    <p className="text-sm text-on-surface-variant">{selectedLot.origin} · {selectedLot.period} · {selectedLot.material}</p>
                  </div>

                  {/* Bid Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-container-low border border-on-surface/5 p-5">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Offre Actuelle" : "Current Bid"}</p>
                      <p className="font-serif text-2xl font-bold text-gold-leaf mt-1">
                        {selectedLot.currentBid > 0 ? `€${(selectedLot.currentBid / 1000000).toFixed(1)}M` : "—"}
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-1">{selectedLot.bids.length} {lang === "fr" ? "offres" : "bids"}</p>
                    </div>
                    <div className="bg-surface-container-low border border-on-surface/5 p-5">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Estimation" : "Estimate"}</p>
                      <p className="font-serif text-2xl font-bold text-ebony-deep mt-1">
                        €{(selectedLot.estimateLow / 1000000).toFixed(1)}–{(selectedLot.estimateHigh / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-1">{selectedLot.watchers} {lang === "fr" ? "observateurs" : "watchers"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {selectedLot.status === "live" ? (
                      <button
                        onClick={() => openBidModal(selectedLot)}
                        className="flex-1 bg-terracotta-earth text-parchment-ivory py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                      >
                        <Gavel size={14} /> {lang === "fr" ? "Placer une Offre" : "Place Bid"}
                      </button>
                    ) : (
                      <button className="flex-1 bg-ebony-deep text-parchment-ivory py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0 flex items-center justify-center gap-2">
                        <Eye size={14} /> {lang === "fr" ? "Suivre cette Vente" : "Watch This Lot"}
                      </button>
                    )}
                    <button
                      onClick={() => toggleWatch(selectedLot.id)}
                      className={`border px-5 py-3.5 text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer bg-transparent flex items-center gap-1.5 ${
                        watchedLots.has(selectedLot.id)
                          ? "border-terracotta-earth text-terracotta-earth bg-terracotta-earth/5"
                          : "border-on-surface/20 text-on-surface-variant hover:border-gold-leaf hover:text-gold-leaf"
                      }`}
                    >
                      <Heart size={12} fill={watchedLots.has(selectedLot.id) ? "currentColor" : "none"} /> {lang === "fr" ? "Suivre" : "Watch"}
                    </button>
                  </div>

                  {/* Recent Bids */}
                  {selectedLot.bids.length > 0 && (
                    <div className="mt-6 bg-surface-container-low border border-on-surface/5 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">{lang === "fr" ? "Offres Récentes" : "Recent Bids"}</p>
                        <span className="text-[9px] text-on-surface-variant">{selectedLot.bids.length} {lang === "fr" ? "offres" : "bids"}</span>
                      </div>
                      <div className="space-y-2">
                        {selectedLot.bids.slice(0, 5).map((bid, i) => (
                          <div key={bid.id} className={`flex items-center justify-between py-2 ${i < selectedLot.bids.length - 1 ? "border-b border-on-surface/5" : ""}`}>
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold ${bid.isYou ? "bg-gold-leaf text-ebony-deep" : "bg-ebony-deep/5 text-on-surface-variant"}`}>
                                {bid.avatar}
                              </div>
                              <div>
                                <p className={`text-[11px] font-bold ${bid.isYou ? "text-gold-leaf" : "text-ebony-deep"}`}>
                                  {bid.isYou ? (lang === "fr" ? "Vous" : "You") : bid.bidder}
                                </p>
                                <p className="text-[9px] text-on-surface-variant">{bid.time}</p>
                              </div>
                            </div>
                            <span className={`text-[11px] font-bold ${bid.isYou ? "text-gold-leaf" : "text-ebony-deep"}`}>
                              €{(bid.amount / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provenance */}
                  <div className="mt-6 bg-surface-container-low border border-on-surface/5 p-5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">{lang === "fr" ? "Provenance Certifiée" : "Certified Provenance"}</p>
                    <div className="space-y-2">
                      <div className="flex gap-3 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-leaf mt-1.5 shrink-0" />
                        <p className="text-on-surface-variant">{selectedLot.origin} — {selectedLot.period}</p>
                      </div>
                      <div className="flex gap-3 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-leaf mt-1.5 shrink-0" />
                        <p className="text-on-surface-variant">{lang === "fr" ? "Vérifié par le Comité d'Authentification Aduna" : "Vetted by the Aduna Authentication Committee"}</p>
                      </div>
                      <div className="flex gap-3 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-leaf mt-1.5 shrink-0" />
                        <p className="text-on-surface-variant">{lang === "fr" ? "Certificat d'Authenticité Level IV inclus" : "Level IV Certificate of Authenticity included"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 border border-dashed border-on-surface/10">
                  <p className="text-xs text-on-surface-variant/40">{lang === "fr" ? "Sélectionnez un lot" : "Select a lot"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BID PLACEMENT MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showBidModal && selectedLot && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-parchment-ivory max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowBidModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent z-10">
                <X className="w-6 h-6" />
              </button>

              {/* Won State */}
              {bidModalState === "won" && (
                <div className="p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                    <Trophy className="w-16 h-16 text-gold-leaf mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">
                    {lang === "fr" ? "Offre Placée !" : "Bid Placed!"}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    {lang === "fr" ? "Votre offre de " : "Your bid of "}<strong className="text-gold-leaf">€{(parseInt(bidAmount.replace(/\D/g, ""), 10) / 1000000).toFixed(1)}M</strong>{lang === "fr" ? " pour " : " for "}<strong>{selectedLot.title}</strong>{lang === "fr" ? " a été enregistrée. Vous êtes actuellement le meilleur offreur." : " has been recorded. You are currently the highest bidder."}
                  </p>
                  <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 text-gold-leaf">
                      <div className="w-2 h-2 bg-gold-leaf rounded-full animate-pulse" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">{lang === "fr" ? "Vous êtes le meilleur offreur" : "You are the highest bidder"}</span>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3 mb-6 flex items-start gap-2 text-left">
                    <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700">
                      {lang === "fr" ? "Vous serez notifié par courriel et dans le tableau de bord si vous êtes surenchéri." : "You will be notified by email and in the dashboard if you are outbid."}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBidModal(false)}
                    className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0"
                  >
                    {lang === "fr" ? "Fermer" : "Close"}
                  </button>
                </div>
              )}

              {/* Outbid State */}
              {bidModalState === "outbid" && (
                <div className="p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                    <AlertTriangle className="w-16 h-16 text-terracotta-earth mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">
                    {lang === "fr" ? "Vous êtes Surenchéri" : "You've Been Outbid"}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {lang === "fr" ? "Un autre collectionneur a surenchéri sur " : "Another collector has outbid you on "}<strong>{selectedLot.title}</strong>. {lang === "fr" ? "La nouvelle offre actuelle est de " : "The current bid is now "}<strong className="text-gold-leaf">€{((selectedLot.currentBid + 250000) / 1000000).toFixed(1)}M</strong>.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => { setBidModalState("idle"); setBidAmount(""); }}
                      className="bg-terracotta-earth text-parchment-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0 flex items-center gap-2"
                    >
                      <Gavel size={12} /> {lang === "fr" ? "Surenchérir" : "Bid Again"}
                    </button>
                    <button
                      onClick={() => setShowBidModal(false)}
                      className="border border-ebony-deep/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent"
                    >
                      {lang === "fr" ? "Fermer" : "Close"}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirming State */}
              {bidModalState === "confirming" && (
                <div className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-gold-leaf/20 border-t-gold-leaf rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-serif text-xl font-medium uppercase tracking-wide mb-3">
                    {lang === "fr" ? "Placement de l'Offre..." : "Placing Your Bid..."}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {lang === "fr" ? "Vérification de l'authentification et validation de l'offre..." : "Verifying authentication and validating bid..."}
                  </p>
                </div>
              )}

              {/* Idle State — Place Bid Form */}
              {bidModalState === "idle" && (
                <div className="p-8">
                  <div className="text-center mb-6">
                    <Gavel className="w-10 h-10 text-gold-leaf mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-medium uppercase tracking-wide">
                      {lang === "fr" ? "Placer une Offre" : "Place a Bid"}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">{selectedLot.title}</p>
                  </div>

                  {/* Current bid info */}
                  <div className="bg-surface-container-low border border-ebony-deep/5 p-4 mb-6">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-on-surface-variant">{lang === "fr" ? "Offre Actuelle" : "Current Bid"}</span>
                      <span className="font-bold text-gold-leaf">€{(selectedLot.currentBid / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-on-surface-variant">{lang === "fr" ? "Estimation" : "Estimate"}</span>
                      <span className="font-medium">€{(selectedLot.estimateLow / 1000000).toFixed(1)}–{(selectedLot.estimateHigh / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-on-surface-variant">{lang === "fr" ? "Offres" : "Bids"}</span>
                      <span className="font-medium">{selectedLot.bids.length}</span>
                    </div>
                  </div>

                  {/* Other bids */}
                  {selectedLot.bids.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">
                        {lang === "fr" ? "Autres Offres" : "Other Bids"}
                      </p>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {selectedLot.bids.slice(0, 4).map((bid) => (
                          <div key={bid.id} className="flex items-center justify-between py-1.5 border-b border-on-surface/5 last:border-0">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-ebony-deep/5 flex items-center justify-center text-[7px] font-bold text-on-surface-variant">
                                {bid.avatar}
                              </div>
                              <span className="text-[10px] text-on-surface-variant">{bid.bidder}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-ebony-deep">€{(bid.amount / 1000000).toFixed(1)}M</span>
                              <span className="text-[8px] text-on-surface-variant/60">{bid.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bid amount input */}
                  <div className="mb-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">
                      {lang === "fr" ? "Votre Offre (EUR)" : "Your Bid (EUR)"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">€</span>
                      <input
                        type="text"
                        value={bidAmount}
                        onChange={(e) => { setBidAmount(e.target.value); setBidError(""); }}
                        className="w-full border border-ebony-deep/15 p-3 pl-8 text-sm focus:border-gold-leaf focus:outline-none font-bold"
                        placeholder={selectedLot.currentBid > 0 ? `${(selectedLot.currentBid + 100000).toLocaleString()}` : "0"}
                      />
                    </div>
                    {bidError && (
                      <p className="text-[10px] text-terracotta-earth mt-1">{bidError}</p>
                    )}
                  </div>

                  {/* Quick bid buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {quickBids.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBidAmount(amount.toString())}
                        className="border border-on-surface/10 py-2 text-[9px] font-bold text-on-surface-variant hover:border-gold-leaf hover:text-gold-leaf transition-colors cursor-pointer bg-transparent"
                      >
                        +€{(amount / 1000000).toFixed(1)}M
                      </button>
                    ))}
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBidModal(false)}
                      className="flex-1 border border-ebony-deep/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep cursor-pointer bg-transparent"
                    >
                      {lang === "fr" ? "Annuler" : "Cancel"}
                    </button>
                    <button
                      onClick={placeBid}
                      disabled={!bidAmount}
                      className="flex-1 bg-terracotta-earth text-parchment-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors disabled:opacity-50 cursor-pointer border-0 flex items-center justify-center gap-2"
                    >
                      <Gavel size={12} /> {lang === "fr" ? "Confirmer l'Offre" : "Confirm Bid"}
                    </button>
                  </div>

                  <p className="text-[9px] text-on-surface-variant/60 text-center mt-4">
                    {lang === "fr" ? "En plaçant une offre, vous acceptez les conditions de vente d'Aduna Gallery." : "By placing a bid you agree to Aduna Gallery's terms of sale."}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </AuthGuard>
  );
}
