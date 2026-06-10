"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gavel,
  Lock,
  Compass,
  ArrowUp,
  FileText,
  CheckCircle,
  User,
  MapPin,
  ShieldAlert,
  Maximize2,
  Bell,
  X,
  ShieldCheck,
  Mail,
  Building,
  Landmark,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Send,
  CornerDownRight,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface BidActivity {
  bidder: string;
  timestamp: string;
  amount: number;
  isUser?: boolean;
}

interface ArtLot {
  id: string;
  title: string;
  origin: string;
  dateDisplay: string;
  provenanceType: string;
  imageUrl: string;
  description: string;
  currentBid: number;
  bidderNumber: string;
  countdownSeconds: number;
  history: BidActivity[];
  conditionReport: string;
  dimensions: string;
  medium: string;
  estimate: string;
  region: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

const INITIAL_LOTS: ArtLot[] = [
  {
    id: "lot-01",
    title: "Edo Period Ceremonial Vessel",
    origin: "Japan, c. 1650",
    dateDisplay: "c. 1650",
    provenanceType: "Museum Provenance",
    region: "East Asia",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUp2PVWG_ckH5Uz6FCYQtyLzRfz7884qq7G8LfyV5jvZ0aBjivorE9d9Qxej1NcipvK40TJB0gBhko5q2EwUEtL3SEQRRNUCN5AnhY0N-iygUvUJGx-PAZ3CuPseKnLg2OsnwjEfQI0wkQe-4fR55UG_vVCq9uIgVpzpc47tqJzRmCor02Gv81k2C3XOTuULD2_wAj4Sy27iogAqJHiOeQYXIraGNl-eOnsbsQEhP6HYzOOpMJvdFcpVgJFzyh-4l1U0UJe6edwA",
    countdownSeconds: 899,
    dimensions: "42cm x 31cm",
    medium: "Glazed stoneware with iron and copper oxides",
    estimate: "€1,200,000 - €1,800,000",
    conditionReport: "Remarkable state of preservation. Minor glaze crazing at the neck consistent with mid-17th century kiln contraction. High-density iron patina holds original deep terracotta and copper oxide luster. No modern infill or structural restorations detected under UV-excitation.",
    description: "Acquired directly from the Kyoto Imperial Archives in 1922. Held in private European collection until 1985. Exhibited at the Metropolitan Museum of Art, New York (1990) and the British Museum, London (2005).",
    currentBid: 1250000,
    bidderNumber: "Bidder #042 (Anonymous)",
    history: [
      { bidder: "Bidder #042", timestamp: "2 mins ago", amount: 1250000 },
      { bidder: "Bidder #108", timestamp: "15 mins ago", amount: 1200000 },
      { bidder: "Bidder #042", timestamp: "45 mins ago", amount: 1100000 },
      { bidder: "Bidder #097", timestamp: "1 hour ago", amount: 1000000 },
    ],
  },
  {
    id: "lot-02",
    title: "Benin Kingdom Bronze Oba Head",
    origin: "Kingdom of Benin, c. 16th Century",
    dateDisplay: "c. 1550 - 1600",
    provenanceType: "Royal Provenance",
    region: "West Africa",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLS_lGsy6L9Y6D8ONzrL0BVgB7-jIe3liVHJ1_TBw0fZptbynPxOSIgN8djBjliJ4x0puj_z11F_GN_BeR6az5TzfoGJbzOb10LBLE7O11HVs53AtF2UWf69TBZu7Vc-ZeaXcSRvVrxt6vvKYFj126WZMaZJWIxLsS-cjnh8-GF0Z1zaUQ9ZyJZyFikBW0rPvK5JrCDtWUW_9KYwHS2DTWBdFXWRlQhESZ1OkDkyd0a8-fE3Y5WmN8fyd_dfFYQ5Fg5GHHqyLqgg",
    countdownSeconds: 1545,
    dimensions: "34cm x 22cm x 24cm",
    medium: "Lost-wax cast bronze with copper inlay",
    estimate: "€2,500,000 - €3,500,000",
    conditionReport: "Exceptional lost-wax casting detail preserved. Features the iconic high beaded collar representing the Oba's supreme sovereignty. Dark mahogany bronze patina with minor green copper-carbonate blooms.",
    description: "Preserved in the Royal Palace of Benin until 1897. Acquired by Dr. Hans Meyer in Leipzig, Germany (1902). Exhibited in Berlin (Museum fur Volkerkunde, 1974) and Paris (Musee de l'Homme, 1998).",
    currentBid: 2800000,
    bidderNumber: "Bidder #014 (Sovereign Trust)",
    history: [
      { bidder: "Bidder #014", timestamp: "4 mins ago", amount: 2800000 },
      { bidder: "Bidder #088", timestamp: "12 mins ago", amount: 2700000 },
      { bidder: "Bidder #014", timestamp: "30 mins ago", amount: 2550000 },
    ],
  },
  {
    id: "lot-03",
    title: "Yoruba Beaded Royal Crown (Ade)",
    origin: "Yorubaland, Nigeria, c. 1920",
    dateDisplay: "c. 1920",
    provenanceType: "Sacred Regalia",
    region: "West Africa",
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    countdownSeconds: 3210,
    dimensions: "98cm (including veil) x 25cm",
    medium: "Glass seed beads, velvet, botanical fibers, and hide",
    estimate: "€650,000 - €900,000",
    conditionReport: "Vibrant coloration of imported and native trade beads continues to hold historic intensity. Structurally intact bead stringing with isolated minor thread friction near the crown crest.",
    description: "Commissioned by Obas of Abeokuta region during the early 1920s. Enshrined in tribal custody until 1964. Exhibited internationally in Brussels, Zurich, and Munich.",
    currentBid: 720000,
    bidderNumber: "Bidder #112 (Private Collector)",
    history: [
      { bidder: "Bidder #112", timestamp: "8 mins ago", amount: 720000 },
      { bidder: "Bidder #203", timestamp: "18 mins ago", amount: 700000 },
      { bidder: "Bidder #112", timestamp: "32 mins ago", amount: 680000 },
    ],
  },
];

export default function AuctionsPage() {
  const [lots, setLots] = useState<ArtLot[]>(INITIAL_LOTS);
  const [selectedLotId, setSelectedLotId] = useState("lot-01");
  const [biddingError, setBiddingError] = useState<string | null>(null);
  const [customBid, setCustomBid] = useState("");
  const [activeTab, setActiveTab] = useState<"auctions" | "collections" | "advisory">("auctions");
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [vipVerified, setVipVerified] = useState(false);
  const [collectorName, setCollectorName] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{ id: string; text: string }[]>([]);
  const [bidSuccessPulse, setBidSuccessPulse] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userBidderNumber] = useState(() => `Bidder #${Math.floor(100 + Math.random() * 900)}`);
  const activeLot = lots.find((l) => l.id === selectedLotId) || lots[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setLots((prev) => prev.map((lot) => (lot.countdownSeconds > 0 ? { ...lot, countdownSeconds: lot.countdownSeconds - 1 } : lot)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "CLOSED";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const addNotification = (text: string) => {
    const id = `notif-${Date.now()}`;
    setNotifications((prev) => [...prev, { id, text }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 5000);
  };

  const simulateCounterBid = (lotId: string, currentAmount: number) => {
    const opposingBidIncrement = Math.random() > 0.5 ? 50000 : 100000;
    const counterAmount = currentAmount + opposingBidIncrement;
    const oppBidderNum = `Bidder #${Math.floor(100 + Math.random() * 900)}`;
    setTimeout(() => {
      setLots((prevLots) => {
        const targetLot = prevLots.find((l) => l.id === lotId);
        if (targetLot && targetLot.currentBid === currentAmount && targetLot.countdownSeconds > 0) {
          addNotification(`Counter-offer! ${oppBidderNum} bid €${counterAmount.toLocaleString()}`);
          return prevLots.map((lot) => (lot.id === lotId ? { ...lot, currentBid: counterAmount, bidderNumber: `${oppBidderNum} (Anonymous)`, history: [{ bidder: oppBidderNum, timestamp: "1 min ago", amount: counterAmount }, ...lot.history] } : lot));
        }
        return prevLots;
      });
    }, Math.floor(Math.random() * 2000) + 3000);
  };

  const placeBid = (amount: number) => {
    setBiddingError(null);
    if (activeLot.countdownSeconds <= 0) { setBiddingError("This auction has closed."); return; }
    if (amount <= activeLot.currentBid) { setBiddingError(`Bid must exceed €${activeLot.currentBid.toLocaleString()}`); return; }
    setBidSuccessPulse(true);
    setTimeout(() => setBidSuccessPulse(false), 1000);
    const extendedTime = Math.min(activeLot.countdownSeconds + 120, 3600);
    setLots((prev) => prev.map((lot) => (lot.id === activeLot.id ? { ...lot, currentBid: amount, bidderNumber: userBidderNumber, countdownSeconds: extendedTime, history: [{ bidder: userBidderNumber, timestamp: "Just now", amount, isUser: true }, ...lot.history] } : lot)));
    setCustomBid("");
    addNotification(`Your bid of €${amount.toLocaleString()} accepted!`);
    simulateCounterBid(activeLot.id, amount);
  };

  const handleCustomBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customBid.replace(/[^0-9]/g, ""), 10);
    if (isNaN(amount)) { setBiddingError("Please input a valid amount."); return; }
    placeBid(amount);
  };

  const filteredLots = lots.filter((lot) => lot.title.toLowerCase().includes(searchQuery.toLowerCase()) || lot.origin.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Toast Notifications */}
        <div className="fixed top-20 right-4 md:right-6 md:top-24 z-40 max-w-sm space-y-3 pointer-events-none">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center gap-3 bg-ebony-deep text-gold-leaf border border-gold-leaf/40 p-4 shadow-xl">
              <Bell className="w-4 h-4 animate-bounce text-gold-leaf" />
              <span className="text-xs font-mono">{n.text}</span>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-surface-container/60 border-b border-on-surface/5 sticky top-16 z-30">
          <div className="max-w-[1440px] mx-auto px-6 md:px-20 flex gap-0 overflow-x-auto no-scrollbar">
            {([["collections", "Collections"], ["advisory", "Advisory Desk"], ["auctions", "Auctions"]] as const).map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`px-6 py-4 font-sans text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === id ? "text-ebony-deep border-gold-leaf" : "text-on-surface-variant/60 border-transparent hover:text-ebony-deep"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="bg-surface-container-low border-b border-gold-leaf/20 py-4 px-6 md:px-20 max-w-[1440px] mx-auto w-full">
            <p className="text-xs font-mono text-on-surface-variant uppercase mb-2">Matching Lots ({filteredLots.length}):</p>
            <div className="flex flex-wrap gap-2">
              {filteredLots.map((lot) => (
                <button key={lot.id} onClick={() => { setSelectedLotId(lot.id); setSearchQuery(""); setActiveTab("auctions"); }} className={`text-xs px-3 py-1.5 border transition-all ${lot.id === selectedLotId ? "bg-gold-leaf text-ebony-deep border-gold-leaf" : "bg-background border-on-surface-variant/20 hover:border-gold-leaf text-ebony-deep"}`}>
                  {lot.title} ({lot.origin})
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-12 md:py-20">
          {/* COLLECTIONS TAB */}
          {activeTab === "collections" && (
            <section className="space-y-12">
              <div className="border-b border-on-surface/10 pb-6">
                <span className="inline-block px-3 py-1 bg-surface-container-high text-ebony-deep text-[10px] font-semibold uppercase tracking-widest mb-3">Aduna Gallery Registry</span>
                <h2 className="font-serif text-4xl md:text-5xl text-ebony-deep">The Sovereign Collection</h2>
                <p className="text-sm text-on-surface-variant max-w-2xl mt-2">Explore historical masterpieces currently being cataloged. Place active bids or request condition reports.</p>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {lots.map((lot) => (
                  <motion.div key={lot.id} variants={fadeUp} className="bg-surface-container-lowest border border-on-surface-variant/10 p-6 shadow-level-2 flex flex-col justify-between">
                    <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-surface-container-high">
                      <img src={lot.imageUrl} alt={lot.title} referrerPolicy="no-referrer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-ebony-deep/75 text-gold-leaf text-[9px] font-mono tracking-widest px-2 py-0.5 uppercase">{lot.provenanceType}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-gold-leaf uppercase tracking-widest">{lot.region}</span>
                      <h3 className="font-serif text-xl text-ebony-deep font-medium mt-1 mb-2">{lot.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">{lot.description}</p>
                      <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-on-surface-variant/5 mb-6 text-xs">
                        <div><span className="text-on-surface-variant block">Active High Bid</span><strong className="text-ebony-deep block text-sm mt-0.5">€{lot.currentBid.toLocaleString()}</strong></div>
                        <div><span className="text-on-surface-variant block">Estimate Range</span><span className="text-ebony-deep block mt-0.5 font-medium">{lot.estimate.split("-")[0]}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { setSelectedLotId(lot.id); setActiveTab("auctions"); }} className="flex-1 bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory hover:text-ebony-deep py-3 text-[10px] font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"><Gavel className="w-3.5 h-3.5" /> Bid Realtime</button>
                      <button onClick={() => { setSelectedLotId(lot.id); setConditionOpen(true); }} className="p-3 border border-on-surface/20 hover:border-gold-leaf hover:text-gold-leaf text-on-surface-variant transition-colors"><FileText className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* ADVISORY TAB */}
          {activeTab === "advisory" && (
            <section className="space-y-12">
              <div className="border-b border-on-surface/10 pb-6 text-center">
                <span className="inline-block px-3 py-1 bg-gold-leaf/10 text-gold-leaf text-[10px] font-semibold uppercase tracking-widest mb-3">Secure Telecommunication Channel</span>
                <h2 className="font-serif text-4xl md:text-5xl text-ebony-deep">Art Advisory &amp; Appraisals</h2>
                <p className="text-sm text-on-surface-variant max-w-2xl mx-auto mt-2">Converse securely with our Lead Advisory Director in Zurich.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-surface-container-lowest p-6 border border-on-surface-variant/10 shadow-level-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gold-leaf/20 text-gold-leaf rounded-full flex items-center justify-center font-serif text-lg font-bold">H</div>
                      <div><h4 className="text-sm font-semibold text-ebony-deep">Dr. Hans-Dieter Meyer</h4><p className="text-[10px] text-on-surface-variant font-mono uppercase">Curation Lead / Zurich Director</p></div>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Dr. Meyer has supervised high-stakes antiquities portfolios at state repositories in Geneva, Basel, and London for over three decades.</p>
                    <ul className="text-xs space-y-2 text-on-surface-variant font-mono"><li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Zurich Authenticators Guild</li><li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Federal Art Reserve Auditor</li></ul>
                  </div>
                  <div className="bg-surface-container-lowest p-6 border border-on-surface-variant/10 shadow-level-2 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Specialist Inquiry Scope</h4>
                    <ol className="text-xs space-y-2 text-on-surface-variant list-decimal list-inside font-medium"><li>Chemical compound decay (Carbon-14)</li><li>Sub-surface structural tomography</li><li>Appreciation modeling under inflation</li><li>Taxation exemption structures</li></ol>
                  </div>
                </div>
                <div className="lg:col-span-8"><CuratorChatComponent activeLot={activeLot} /></div>
              </div>
            </section>
          )}

          {/* AUCTIONS TAB */}
          {activeTab === "auctions" && (
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-on-surface/10 pb-8">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high text-ebony-deep font-mono text-[9px] font-bold uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />VIP Room 01 - Restricted Access</span>
                  <h2 className="font-serif text-3xl md:text-5xl font-medium text-ebony-deep tracking-tight">Live Auction</h2>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-sans font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Time Remaining</p>
                  <p className="font-serif text-3xl md:text-4xl text-red-600 tracking-tight font-medium mt-1.5">{formatCountdown(activeLot.countdownSeconds)}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-4 border border-on-surface/5">
                <div className="flex items-center gap-2"><Compass className="w-4 h-4 text-gold-leaf" /><span className="text-xs font-mono font-bold uppercase tracking-widest text-on-surface-variant">Available Lots ({lots.length}):</span></div>
                <motion.div variants={stagger} initial="hidden" animate="visible" className="flex gap-2 overflow-x-auto w-full md:w-auto">
                  {lots.map((lot) => (
                    <motion.div key={lot.id} variants={fadeUp}>
                      <button onClick={() => { setSelectedLotId(lot.id); setBiddingError(null); }} className={`text-[10px] font-sans font-semibold uppercase tracking-widest px-4 py-2 border transition-all truncate ${lot.id === selectedLotId ? "bg-ebony-deep text-parchment-ivory border-ebony-deep shadow" : "bg-background text-on-surface-variant border-on-surface/10 hover:border-gold-leaf/50"}`}>
                        Lot {lot.id.substring(4)}: {lot.title.split(" ")[0]}...
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 flex flex-col gap-8">
                  <div className="relative w-full aspect-[4/5] shadow-level-2 bg-surface-container-low overflow-hidden border border-on-surface/5">
                    <img src={activeLot.imageUrl} alt={activeLot.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
                    <div className="absolute bottom-6 left-6 right-6 bg-parchment-ivory/90 backdrop-blur-sm p-6 border border-on-surface/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div><h3 className="font-serif text-xl text-ebony-deep font-semibold">{activeLot.title}</h3><p className="text-xs text-on-surface-variant mt-1">{activeLot.origin} • {activeLot.provenanceType}</p></div>
                      <button onClick={() => setConditionOpen(true)} className="bg-transparent border border-gold-leaf hover:bg-gold-leaf text-gold-leaf hover:text-ebony-deep px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-all inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> View Condition Report</button>
                    </div>
                  </div>
                  <div className="pl-6 border-l-[4px] border-terracotta-earth bg-surface-container-lowest p-6 shadow-level-2 space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-on-surface-variant uppercase block">Lot History &amp; Provenance Ledger</span>
                    <p className="text-sm font-sans text-ebony-deep leading-relaxed select-text">{activeLot.description}</p>
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-on-surface-variant/5 text-xs text-on-surface-variant font-mono">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-terracotta-earth" /> Region: {activeLot.region}</span>
                      <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-terracotta-earth" /> Dimensions: {activeLot.dimensions}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-surface-container-lowest p-6 md:p-8 border border-on-surface/5 shadow-level-2 flex flex-col justify-between space-y-8">
                    <div className="text-center bg-surface-container-low py-8 border-b border-on-surface/5">
                      <p className="font-sans font-bold text-[10px] uppercase text-on-surface-variant tracking-[0.25em]">Current High Bid</p>
                      <p className={`font-serif text-4xl md:text-5xl text-ebony-deep font-semibold mt-3 ${bidSuccessPulse ? "scale-105 text-gold-leaf transition-transform" : "transition-transform"}`}>€{activeLot.currentBid.toLocaleString()}</p>
                      <div className="flex justify-center items-center gap-1.5 mt-2.5 text-[11px] text-on-surface-variant font-mono font-medium"><User className="w-3.5 h-3.5 text-gold-leaf" /><span>{activeLot.bidderNumber}</span></div>
                    </div>
                    <div className="space-y-4">
                      <p className="font-sans font-bold text-[10px] uppercase text-ebony-deep border-b border-on-surface/10 pb-2.5 tracking-wider">Place Your Bid</p>
                      <div className="grid grid-cols-2 gap-4 select-none">
                        <button onClick={() => placeBid(activeLot.currentBid + 50000)} disabled={activeLot.countdownSeconds <= 0} className="border border-on-surface/20 hover:border-gold-leaf bg-transparent hover:bg-gold-leaf/5 text-ebony-deep hover:text-gold-leaf py-4 text-xs font-semibold uppercase tracking-widest transition-all disabled:opacity-50">+ €50,000</button>
                        <button onClick={() => placeBid(activeLot.currentBid + 100000)} disabled={activeLot.countdownSeconds <= 0} className="border border-on-surface/20 hover:border-gold-leaf bg-transparent hover:bg-gold-leaf/5 text-ebony-deep hover:text-gold-leaf py-4 text-xs font-semibold uppercase tracking-widest transition-all disabled:opacity-50">+ €100,000</button>
                      </div>
                      <form onSubmit={handleCustomBidSubmit} className="space-y-4 mt-4">
                        <div className="relative mt-2">
                          <label className="font-sans font-bold uppercase text-on-surface-variant absolute -top-2 left-0 bg-surface-container-lowest px-1 text-[9px] tracking-wider">Custom Amount (EUR)</label>
                          <input type="text" value={customBid} onChange={(e) => setCustomBid(e.target.value)} placeholder={`Greater than €${activeLot.currentBid.toLocaleString()}`} className="w-full bg-transparent border-0 border-b border-on-surface/20 focus:border-gold-leaf py-4 text-sm font-sans font-semibold text-ebony-deep placeholder:text-on-surface-variant/30 focus:outline-none transition-colors" disabled={activeLot.countdownSeconds <= 0} />
                        </div>
                        {biddingError && <p className="text-xs text-red-600 font-mono flex items-center gap-1.5 animate-pulse"><ShieldAlert className="w-3.5 h-3.5" />{biddingError}</p>}
                        <button type="submit" disabled={activeLot.countdownSeconds <= 0} className="w-full bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory hover:text-ebony-deep py-5 text-xs font-semibold uppercase tracking-widest transition-all flex justify-center items-center gap-2 disabled:opacity-50"><Gavel className="w-4 h-4" /> Submit Secure Bid</button>
                      </form>
                    </div>
                    <div className="flex-grow flex flex-col pt-4 border-t border-on-surface/5 max-h-[220px]">
                      <div className="flex justify-between items-center mb-3.5 select-none">
                        <h4 className="font-sans font-bold text-[10px] uppercase text-on-surface-variant tracking-wider">Recent Activity</h4>
                      </div>
                      <div className="space-y-3 flex-grow overflow-y-auto pr-1">
                        {activeLot.history.map((activity, index) => (
                          <div key={index} className={`flex justify-between items-center py-2.5 border-b border-on-surface/5 last:border-b-0 ${activity.isUser ? "bg-gold-leaf/5 px-2" : ""}`}>
                            <div className="flex items-center gap-2.5">
                              <ArrowUp className={`w-3.5 h-3.5 ${activity.isUser ? "text-gold-leaf" : "text-on-surface-variant"}`} />
                              <div><p className="text-xs font-semibold text-ebony-deep font-sans">{activity.bidder}</p><p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{activity.timestamp}</p></div>
                            </div>
                            <span className={`text-xs font-mono font-bold ${activity.isUser ? "text-gold-leaf" : "text-ebony-deep"}`}>€{activity.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10">
                <div className="lg:col-span-7 flex flex-col justify-center space-y-4 pr-0 lg:pr-8">
                  <span className="text-[10px] font-semibold tracking-widest text-on-surface-variant uppercase">Curatorial Assistance Panel</span>
                  <h3 className="font-serif text-3xl text-ebony-deep font-semibold">Sovereign Guidance from Fine Art Appraisers</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Every legal transaction or bid placed on Aduna is audited by Dr. Hans-Dieter Meyer and our Swiss board of compliance trustees.</p>
                  <div className="flex gap-4 pt-2">
                    <div className="bg-surface-container-low p-4 border border-on-surface/5 flex-1 font-mono text-[10px]"><span className="text-on-surface-variant block uppercase font-bold">Board-Certified ID</span><span className="text-ebony-deep block mt-1 font-semibold">CH-761.02.449-Z</span></div>
                    <div className="bg-surface-container-low p-4 border border-on-surface/5 flex-1 font-mono text-[10px]"><span className="text-on-surface-variant block uppercase font-bold">Standard Exemption</span><span className="text-ebony-deep block mt-1 font-semibold">SEC Code Paragraph 4a</span></div>
                  </div>
                </div>
                <div className="lg:col-span-5"><CuratorChatComponent activeLot={activeLot} /></div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      {/* Registration Modal */}
      <AnimatePresence>
        {registrationOpen && <RegistrationModal onClose={() => setRegistrationOpen(false)} onSubmitSuccess={(name) => { setVipVerified(true); setCollectorName(name); addNotification(`Clearance Granted! Greetings ${name}.`); }} />}
      </AnimatePresence>

      {/* Condition Report Modal */}
      <AnimatePresence>
        {conditionOpen && <ConditionReportModal onClose={() => setConditionOpen(false)} lot={activeLot} />}
      </AnimatePresence>

      {/* VIP Button */}
      <button onClick={() => setRegistrationOpen(true)} className={`fixed bottom-8 right-8 z-40 shadow-level-3 px-6 py-4 flex items-center gap-3 transition-all ${vipVerified ? "bg-gold-leaf text-ebony-deep" : "bg-ebony-deep text-parchment-ivory hover:bg-gold-leaf hover:text-ebony-deep group"}`}>
        <Lock className="w-3.5 h-3.5" />
        <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">{vipVerified ? `Cleared: ${collectorName}` : "Request Private Access"}</span>
      </button>
    </>
  );
}

function RegistrationModal({ onClose, onSubmitSuccess }: { onClose: () => void; onSubmitSuccess: (name: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [netWorth, setNetWorth] = useState("1M-5M");
  const [verificationAccepted, setVerificationAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !verificationAccepted) return;
    setSubmitted(true);
    setTimeout(() => { onSubmitSuccess(name); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-deep/80 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg bg-background border border-gold-leaf/30 p-8 md:p-10 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-gold-leaf transition-colors"><X className="w-5 h-5" /></button>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex p-3 bg-gold-leaf/10 text-gold-leaf rounded-full mb-2"><ShieldCheck className="w-6 h-6" /></span>
              <h2 className="font-serif text-3xl tracking-tight text-ebony-deep">Request Private Access</h2>
              <p className="text-sm text-on-surface-variant max-w-sm mx-auto">Apply for VVIP Sovereign clearance.</p>
            </div>
            <div className="space-y-4 pt-4">
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">Full Legal Name</label><div className="relative"><Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-leaf/60" /><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Lord Sterling Campbell" className="w-full bg-surface-container-lowest border border-on-surface-variant/20 focus:border-gold-leaf p-3 pl-10 text-sm placeholder:text-on-surface-variant/40" /></div></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">Secure Collector Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-leaf/60" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="collector@sovereign-vault.com" className="w-full bg-surface-container-lowest border border-on-surface-variant/20 focus:border-gold-leaf p-3 pl-10 text-sm placeholder:text-on-surface-variant/40" /></div></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">Institutional Affiliation</label><div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-leaf/60" /><input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Campbell Fine Art Trust (Optional)" className="w-full bg-surface-container-lowest border border-on-surface-variant/20 focus:border-gold-leaf p-3 pl-10 text-sm placeholder:text-on-surface-variant/40" /></div></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">Verified Liquidity Profile</label><div className="relative"><TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-leaf/60" /><select value={netWorth} onChange={(e) => setNetWorth(e.target.value)} className="w-full bg-surface-container-lowest border border-on-surface-variant/20 focus:border-gold-leaf p-3 pl-10 text-sm focus:outline-none"><option value="1M-5M">€1M - €5M</option><option value="5M-20M">€5M - €20M</option><option value="20M-100M">€20M - €100M</option><option value="100M+">€100M+ Premium Sovereign</option></select></div></div>
              <div className="flex items-start gap-3 pt-2"><input type="checkbox" required checked={verificationAccepted} onChange={(e) => setVerificationAccepted(e.target.checked)} className="mt-1 accent-gold-leaf cursor-pointer" /><label className="text-xs text-on-surface-variant leading-relaxed cursor-pointer select-none">I agree to Aduna Gallery&apos;s strict vetting processes and federal legal/compliance audits.</label></div>
            </div>
            <button type="submit" disabled={!verificationAccepted} className="w-full bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory hover:text-ebony-deep py-4 text-xs font-semibold uppercase tracking-widest transition-all disabled:opacity-50">Request Credentials Clearance</button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
            <span className="w-16 h-16 bg-gold-leaf/20 text-gold-leaf rounded-full flex items-center animate-bounce"><ShieldCheck className="w-8 h-8" /></span>
            <h2 className="font-serif text-3xl text-ebony-deep">Cleared for Review</h2>
            <p className="text-sm text-on-surface-variant max-w-sm">Your credentials are being processed. Dr. Meyer and his curators will contact your legal representative shortly.</p>
            <div className="w-16 h-1 bg-gold-leaf animate-pulse mt-4" />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ConditionReportModal({ onClose, lot }: { onClose: () => void; lot: ArtLot }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-deep/80 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl bg-background border border-gold-leaf/30 p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-gold-leaf transition-colors"><X className="w-5 h-5" /></button>
        <div className="space-y-6">
          <div className="border-b border-gold-leaf/20 pb-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-leaf flex items-center gap-1.5 mb-1"><FileText className="w-3.5 h-3.5" /> Conservator Dossier</span>
            <h2 className="font-serif text-3xl text-ebony-deep">{lot.title}</h2>
            <p className="text-xs text-on-surface-variant mt-1 font-mono uppercase tracking-wider">{lot.origin} • {lot.dimensions}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ebony-deep border-b border-on-surface/10 pb-1.5 mb-2">Technical Summary</h3>
              <ul className="text-xs space-y-2 text-on-surface-variant font-mono">
                <li><strong className="text-ebony-deep">Identifier:</strong> LOT-{lot.id.toUpperCase()}</li>
                <li><strong className="text-ebony-deep">Medium:</strong> {lot.medium}</li>
                <li><strong className="text-ebony-deep">Conservation Date:</strong> March 2026</li>
                <li><strong className="text-ebony-deep">Curation Level:</strong> Level 1 (Sovereign Historical)</li>
                <li><strong className="text-ebony-deep">Security:</strong> Vault 04 (Switzerland)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ebony-deep border-b border-on-surface/10 pb-1.5 mb-2">Scientific Testing</h3>
              <ul className="text-xs space-y-1.5 text-on-surface-variant">
                {["Carbon-14 / Thermoluminescence Match", "Micro-fracture X-Ray Tomography", "Pigment Mass Spectrometric Profile", "Wood/Bronze Density Resonance Match"].map((test) => (
                  <li key={test} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />{test}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-surface-container-low p-5 space-y-3 border-l-2 border-gold-leaf font-serif">
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gold-leaf" /> Lead Conservator Statement</h4>
            <p className="text-sm text-ebony-deep leading-relaxed">&quot;{lot.conditionReport}&quot;</p>
          </div>
          <div className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <h4 className="font-bold uppercase tracking-widest text-ebony-deep flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-terracotta-earth" /> Packaging &amp; Transportation Protocol</h4>
            <p>This piece is stored in a microclimatic nitrogen-purged protective acrylic capsule. Shipping requires temperature boundaries of 18°C - 21°C and relative humidity levels between 45% - 50%.</p>
          </div>
          <div className="flex gap-4 pt-4 border-t border-gold-leaf/20">
            <button onClick={onClose} className="flex-1 bg-ebony-deep hover:bg-gold-leaf text-parchment-ivory hover:text-ebony-deep py-4 text-xs font-semibold uppercase tracking-widest transition-all">Close Curation Report</button>
            <button onClick={() => alert("Verification request submitted.")} className="px-6 border border-gold-leaf text-gold-leaf hover:bg-gold-leaf/10 py-4 text-xs font-semibold uppercase tracking-widest transition-all">Request Zurich Lab PDF</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CuratorChatComponent({ activeLot }: { activeLot: ArtLot }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "welcome", role: "assistant", content: `Greetings. I am Dr. Hans-Dieter Meyer, Lead Advisory Curator for Aduna Gallery. How may I assist you regarding the ${activeLot.title}?`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const nextMsgId = useRef(0);
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    nextMsgId.current += 1;
    const userMsg: ChatMessage = { id: `msg-${nextMsgId.current}-user`, role: "user", content: textToSend, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const textLower = textToSend.toLowerCase();
      let reply = "Our Zurich archives are momentarily locked. However, based on our catalog, this masterwork represents a rare specimen valued between " + activeLot.estimate + ", featuring museum-grade provenance.";
      if (textLower.includes("provenance") || textLower.includes("history")) reply = `The ${activeLot.title} has been documented through ${activeLot.provenanceType.toLowerCase()} channels. ${activeLot.description}`;
      else if (textLower.includes("material") || textLower.includes("technique")) reply = `This piece features ${activeLot.medium}. ${activeLot.conditionReport.substring(0, 150)}...`;
      else if (textLower.includes("value") || textLower.includes("investment")) reply = `With current bids at €${activeLot.currentBid.toLocaleString()} and estimates of ${activeLot.estimate}, this piece shows strong appreciation potential for museum-grade provenance.`;
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}-assistant`, role: "assistant", content: reply, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1500);
  };

  const PRESET_QUERIES = [
    { label: "Deep Dive Provenance", text: "Walk me through the complete provenance log of this lot." },
    { label: "Analyze Material", text: "What unique technical processes or materials define this artwork?" },
    { label: "Investment Outlook", text: "What is your curatorial estimate of this antiquity's long-term value?" },
  ];

  return (
    <div className="flex flex-col bg-ebony-deep text-parchment-ivory border border-gold-leaf/40 p-6 md:p-8 h-full shadow-2xl">
      <div className="flex justify-between items-center border-b border-gold-leaf/20 pb-4 mb-4 select-none">
        <div className="flex items-center gap-2.5"><Sparkles className="w-5 h-5 text-gold-leaf animate-pulse" /><div><h3 className="font-serif text-lg tracking-wide text-gold-leaf">Aduna Advisory Desk</h3><p className="text-[9px] font-mono tracking-widest text-parchment-ivory/40 uppercase">Dr. Hans-Dieter Meyer • Curatorial Director</p></div></div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 border border-gold-leaf/30 text-gold-leaf scale-95"><ShieldCheck className="w-3 h-3" /><span className="text-[8px] font-mono font-semibold tracking-wider uppercase">VVIP Guarded</span></div>
      </div>
      <div ref={scrollRef} className="flex-grow space-y-4 overflow-y-auto pr-2 max-h-[280px] md:max-h-[380px] min-h-[220px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className="flex items-center gap-2 mb-1"><span className="text-[9px] font-mono tracking-wider text-parchment-ivory/40 uppercase">{msg.role === "user" ? "COLLECTOR" : "DR. MEYER"}</span><span className="text-[8px] text-parchment-ivory/30">{msg.timestamp}</span></div>
            <div className={`p-4 text-xs leading-relaxed max-w-[90%] ${msg.role === "user" ? "bg-neutral-800 text-parchment-ivory border-r-2 border-gold-leaf/70" : "bg-neutral-900/40 text-gold-leaf border-l-2 border-parchment-ivory/50 font-serif"}`}>{msg.content}</div>
          </div>
        ))}
        {loading && <div className="flex flex-col items-start"><span className="text-[9px] font-mono tracking-wider text-parchment-ivory/40 uppercase mb-1">DR. MEYER</span><div className="p-4 bg-neutral-900/40 border-l-2 border-gold-leaf/40 text-xs text-parchment-ivory/40 flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin text-gold-leaf" /><span className="font-serif italic text-gold-leaf/70">Consulting Zurich fine art archives...</span></div></div>}
      </div>
      <div className="space-y-1.5 mt-4 pt-4 border-t border-gold-leaf/10 select-none">
        <p className="text-[9px] font-mono uppercase tracking-widest text-parchment-ivory/40 flex items-center gap-1"><CornerDownRight className="w-3 h-3 text-gold-leaf" /> Suggested Inquiry:</p>
        <div className="flex flex-col gap-2">{PRESET_QUERIES.map((chip, n) => <button key={n} disabled={loading} onClick={() => handleSendMessage(chip.text)} className="text-left bg-neutral-900 hover:bg-gold-leaf/10 border border-parchment-ivory/20 hover:border-gold-leaf/50 text-[10px] text-parchment-ivory/40 hover:text-gold-leaf p-2 transition-all font-serif italic">&quot;{chip.label}&quot;</button>)}</div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-2 mt-4 select-none">
        <input type="text" disabled={loading} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pose inquiry regarding provenance..." className="flex-grow bg-neutral-900 border-b border-parchment-ivory/30 focus:border-gold-leaf p-3 text-xs placeholder:text-parchment-ivory/40 focus:outline-none" />
        <button type="submit" disabled={loading || !input.trim()} className="p-3 bg-gold-leaf hover:bg-parchment-ivory text-ebony-deep hover:scale-105 transition-all disabled:opacity-40"><Send className="w-3.5 h-3.5" /></button>
      </form>
    </div>
  );
}