"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  UserCheck,
  BookOpen,
  ShieldCheck,
  Coins,
  Search,
  Info,
  SearchCode,
  Lock,
  Unlock,
  Send,
  Radio,
  Download,
  Building,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslate } from "@/lib/translations";

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

interface InvestmentArtifact {
  id: string;
  title: string;
  origin: string;
  period: string;
  medium: string;
  estimatedValue: string;
  provenance: string[];
  imageUrl: string;
  description: string;
  exhibitions: string[];
  carbonDatingDetails?: string;
  accessionNo?: string;
}

interface InvestmentPackage {
  id: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  estimatedValue: string;
  allocation: string;
  appreciationRate: string;
  artifacts: InvestmentArtifact[];
}

interface ChartDataPoint {
  year: number;
  indexValue: number;
  nokTerracotta: number;
  beninBronze: number;
}

const MASTER_ARTIFACTS: InvestmentArtifact[] = [
  { id: "NOK-9401", title: "Nok Terracotta Seated Dignitary", origin: "Nok Culture (Nok Plateau, Nigeria)", period: "circa 500 BC - 200 BC", medium: "Terracotta (Earthenware)", estimatedValue: "$1,850,000", description: "A highly refined Nok sculptural work presenting a class-distinct seated figure with characteristic triangular eyes and ornate tribal coiffure.", provenance: ["2021: Acquired from the Weyler Antiquities Trust, Brussels.", "1998: Passed by bequest to Jean-Pierre Weyler.", "1974: Exported from West Africa under license No. FED-74-09.", "1968: Authenticated by Dr. R. Fagg, Jos Museum."], imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXl8RsWXaS06QuUFCcscFyYqLnRvXXbrzCmT3VH_NjE3U4A3_pDqYBTsjsZZpEdGWF0tCV50I4JZnegKAQAKRyyzynYlqBVLCwc8_0RFPEjsVxNpCdM4sGRs81tukRN7junoDVA9cSLbp2y5LEkpMEV9UfZKWeI83noDGsMcJOelpOKU1cAltNgWHcIK792wTWvV5kwFTdWxLrbLRwwVaKlWxlkcMXqs9E_DiGOcs1Ep8B9RydAjXL8-cfJ6Wc3UJfV76zPmHcEA", exhibitions: ["2018: 'Early Iron Age of the Niger Valley' - Museum of Ancient Cultures, Munich.", "1992: 'African Horizons' - Royal Tervuren Museum, Belgium."], carbonDatingDetails: "Thermoluminescence (TL) testing conducted by Oxford Radiocarbon unit in 2022 confirms firing sequence matching 2300 ± 150 years Before Present.", accessionNo: "HV-NOK-9401" },
  { id: "IFE-2102", title: "Ife Bronze Crowned Head of Ooni", origin: "Ife Kingdom (Yorubaland, Nigeria)", period: "12th - 14th Century AD", medium: "Zinc-Bronze (Lost-Wax Casting)", estimatedValue: "Price on Request", description: "An exceptional and naturalistic cast metal masterpiece displaying idealized royal proportions and vertical facial striations.", provenance: ["2019: Retained on behalf of a consortium of Swiss collectors.", "1985: Handled by Sotheby's Tribal Arts, London.", "1952: Transferred to Lord Alistair Keith, Aberdeenshire.", "1938: Excavated in the royal enclosure of Wunmonije Compound, Ife."], imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6mkCvBOxzItgOkwApExBW_UFyCp2xdV2K1XavEntR4o1gfdkwWVL5Ml1Xdv1uoHG5L2CTp44X2h6VrKGp9A_YKn8gLC_dM4kmbV0bmNM3KxKEhhxXjBDBzSBrg4yTwekY9qm6HZ1XEKNA7HyHBL_1Q_6UhgW9DspsydS2Q6U2B781unV6grt2JV2vEeJ6l9Wv1DuTcFhWis-zuXCKeFoKB2oS9BYQ-KTthaL7MRWhQUEVgTw3_QQhnXrg66r-dirF3YK_qxS_aQ", exhibitions: ["2010: 'Kingdom of Ife: Sculptures from West Africa' - British Museum.", "1964: 'Art of Yoruba' - Musée de l'Homme, Paris."], carbonDatingDetails: "Metallurgical copper alloy spectrometry confirms 92.4% copper, 4.3% zinc composition.", accessionNo: "HV-IFE-2102" },
  { id: "BEN-4021", title: "Benin Ceremonial Oba Mask", origin: "Kingdom of Benin (Edo Culture, Nigeria)", period: "Late 18th Century AD", medium: "Cast Bronze with Iron Inlays", estimatedValue: "$2,240,000", description: "A ceremonial metal pendant mask used during historical tribal purification rituals and ancestral remembrance days.", provenance: ["2015: Sourced from the estate of Antoine de Saint-Amand, Paris.", "1972: Exhibited in the Gaston-Chorier gallery, Brussels.", "1931: Acquired during the Exposition Coloniale Internationale.", "1897: Removed from Benin City via private military transfer."], imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLS_lGsy6L9Y6D8ONzrL0BVgB7-jIe3liVHJ1_TBw0fZptbynPxOSIgN8djBjliJ4x0puj_z11F_GN_BeR6az5TzfoGJbzOb10LBLE7O11HVs53AtF2UWf69TBZu7Vc-ZeaXcSRvVrxt6vvKYFj126WZMaZJWIxLsS-cjnh8-GF0Z1zaUQ9ZyJZyFikBW0rPvK5JrCDtWUW_9KYwHS2DTWBdFXWRlQhESZ1OkDkyd0a8-fE3Y5WmN8fyd_dfFYQ5Fg5GHHqyLqgg", exhibitions: ["2002: 'Bronzes of the Sacred Forest' - Metropolitan Museum of Art.", "1981: 'Edo court masterpieces' - Tribal Institute, Brussels."], carbonDatingDetails: "X-Ray fluorescence verification validates unique lost-wax process methods.", accessionNo: "HV-BEN-4021" },
  { id: "BEN-8054", title: "Benin Royal Court Guild Plaque", origin: "Kingdom of Benin (Edo Culture, Nigeria)", period: "circa 16th - 17th Century AD", medium: "Relief Bronze Plate", estimatedValue: "$1,620,000", description: "A heavy bronze plaque depicting a royal official flanked by ivory horn blowers.", provenance: ["2018: Consigned from the Dr. H. Reinhardt collection, Munich.", "1989: Sold at Galerie Fischer, Lucerne.", "1912: Cataloged in the collection of Carl von Maltzan, Berlin.", "1897: Transferred during the British Expedition to Benin."], imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLS_lGsy6L9Y6D8ONzrL0BVgB7-jIe3liVHJ1_TBw0fZptbynPxOSIgN8djBjliJ4x0puj_z11F_GN_BeR6az5TzfoGJbzOb10LBLE7O11HVs53AtF2UWf69TBZu7Vc-ZeaXcSRvVrxt6vvKYFj126WZMaZJWIxLsS-cjnh8-GF0Z1zaUQ9ZyJZyFikBW0rPvK5JrCDtWUW_9KYwHS2DTWBdFXWRlQhESZ1OkDkyd0a8-fE3Y5WmN8fyd_dfFYQ5Fg5GHHqyLqgg", exhibitions: ["2012: 'Cast in Royalty' - Ethnological Museum, Berlin.", "1995: 'West African Bronze Reliefs' - Museum of Fine Arts, Boston."], carbonDatingDetails: "Spectrographic analysis reveals authentic surface soil traces matching Edo regional earth.", accessionNo: "HV-BEN-8054" },
];

const CURATED_PACKAGES: InvestmentPackage[] = [
  { id: "package-1", title: "The Nigerian Masterpieces", tagline: "Focus on Nok and Ife cultural artifacts with impeccable provenance.", description: "An exclusive institutional arrangement grouping the earliest masterpieces of West African figurative sculpture.", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXl8RsWXaS06QuUFCcscFyYqLnRvXXbrzCmT3VH_NjE3U4A3_pDqYBTsjsZZpEdGWF0tCV50I4JZnegKAQAKRyyzynYlqBVLCwc8_0RFPEjsVxNpCdM4sGRs81tukRN7junoDVA9cSLbp2y5LEkpMEV9UfZKWeI83noDGsMcJOelpOKU1cAltNgWHcIK792wTWvV5kwFTdWxLrbLRwwVaKlWxlkcMXqs9E_DiGOcs1Ep8B9RydAjXL8-cfJ6Wc3UJfV76zPmHcEA", estimatedValue: "$5,350,000", allocation: "60% Terrakotta Masterpieces, 40% Elite Zinc-Bronze Heads", appreciationRate: "+18.4% Average Compound Annual Return", artifacts: [MASTER_ARTIFACTS[0], MASTER_ARTIFACTS[1]] },
  { id: "package-2", title: "The Benin Consortium", tagline: "A diversified holding of late 19th-century bronze castings.", description: "A robust financial instrument grouping classic, verified royal cast pieces from the Kingdom of Benin.", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLS_lGsy6L9Y6D8ONzrL0BVgB7-jIe3liVHJ1_TBw0fZptbynPxOSIgN8djBjliJ4x0puj_z11F_GN_BeR6az5TzfoGJbzOb10LBLE7O11HVs53AtF2UWf69TBZu7Vc-ZeaXcSRvVrxt6vvKYFj126WZMaZJWIxLsS-cjnh8-GF0Z1zaUQ9ZyJZyFikBW0rPvK5JrCDtWUW_9KYwHS2DTWBdFXWRlQhESZ1OkDkyd0a8-fE3Y5WmN8fyd_dfFYQ5Fg5GHHqyLqgg", estimatedValue: "$3,860,000", allocation: "50% Royal Pendant Masks, 50% Royal Court Relief Plaques", appreciationRate: "+14.8% Average Compound Annual Return", artifacts: [MASTER_ARTIFACTS[2], MASTER_ARTIFACTS[3]] },
];

const MARKET_CHART_DATA: ChartDataPoint[] = [
  { year: 2016, indexValue: 100, nokTerracotta: 100, beninBronze: 100 },
  { year: 2017, indexValue: 114, nokTerracotta: 116, beninBronze: 110 },
  { year: 2018, indexValue: 132, nokTerracotta: 125, beninBronze: 135 },
  { year: 2019, indexValue: 154, nokTerracotta: 148, beninBronze: 158 },
  { year: 2020, indexValue: 168, nokTerracotta: 170, beninBronze: 165 },
  { year: 2021, indexValue: 195, nokTerracotta: 190, beninBronze: 201 },
  { year: 2022, indexValue: 228, nokTerracotta: 215, beninBronze: 240 },
  { year: 2023, indexValue: 268, nokTerracotta: 245, beninBronze: 285 },
  { year: 2024, indexValue: 294, nokTerracotta: 280, beninBronze: 308 },
  { year: 2025, indexValue: 312, nokTerracotta: 295, beninBronze: 318 },
  { year: 2026, indexValue: 318, nokTerracotta: 308, beninBronze: 324 },
];

const SECURITY_AUDITS = [
  { title: "Double-Blind Thermoluminescence Analysis", authority: "Oxford Authentications Ltd & Daybreak Nuclear Laboratory", standard: "EN 17025 Certified Testing Procedures", description: "Physical sample extraction utilizing diamond micro-drills below 1mm depth, measuring natural radioactive decay profiles." },
  { title: "Inductively Coupled Plasma Mass Spectrometry", authority: "Metals Research Division, University of Zurich", standard: "Trace Element Fingerprinting Database", description: "Non-destructive atomic composition scan mapping specific micro-impurities to source mines." },
  { title: "Continuous Custody Registration", authority: "Heritage Ledger Taskforce / SAK Protocols", standard: "ISO 31000 Risk & Provenance Management", description: "Unique high-definition multi-spectral imagery hashed with continuous physical handover logs." },
];

export default function InvestmentPage() {
  const { lang } = useTranslate();
  const [activeTab, setActiveTab] = useState<"advisory" | "gallery" | "provenance" | "vault">("advisory");
  const [chartFocus, setChartFocus] = useState<"aggregate" | "nok" | "benin">("aggregate");
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<InvestmentArtifact | null>(null);

  // Form states
  const [inquiryType, setInquiryType] = useState("Portfolio Assessment");
  const [preferredCurator, setPreferredCurator] = useState("Dr. Elena Rostova (African Antiquities)");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [investmentTier, setInvestmentTier] = useState("$500,000 - $2,000,000");
  const [investmentHorizon, setInvestmentHorizon] = useState("3-5 Years");
  const [investmentGoals, setInvestmentGoals] = useState("Capital Appreciation");
  const [currentCollection, setCurrentCollection] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [meetingType, setMeetingType] = useState("Video Call");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  // Gallery states
  const [regionFilter, setRegionFilter] = useState("All");
  const [mediumFilter, setMediumFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGalleryArtifact, setActiveGalleryArtifact] = useState<InvestmentArtifact | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Vault states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "coordinator"; text: string; time: string }[]>([{ sender: "coordinator", text: lang === "fr" ? "Connexion sécurisée : Tunnel AES-256 établi. Bonjour, collectionneur. Nous sommes prêts à coordonner les cessions de freeports suisses ou à vérifier les enchères londoniennes en attente." : "Connection secure: AES-256 Tunnel established. Good day, collector. We stand ready to coordinate Swiss freeport handovers or verify pending London bids.", time: "21:19:15" }]);
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Provenance states
  const [selectedProvenanceId, setSelectedProvenanceId] = useState("NOK-9401");
  const [typedCode, setTypedCode] = useState("");
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const activeProvenanceArt = MASTER_ARTIFACTS.find((a) => a.id === selectedProvenanceId) || MASTER_ARTIFACTS[0];

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [activeTab]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setBookingRef(`HV-${Math.floor(1000 + Math.random() * 9000)}-CONFD`);
    setBookingSuccess(true);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim().toLowerCase() === "vault" || accessCode.trim() === "1234" || accessCode.trim().length > 2) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError(lang === "fr" ? "Échec de l'authentification de session : Hash de sécurité collecteur invalide." : "Session authentication failed: Invalid collector security hash.");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setMessages((prev) => [...prev, { sender: "user", text: typedMessage, time: timeStr }]);
    setTypedMessage("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const textLower = typedMessage.toLowerCase();
      let reply = lang === "fr" ? "Votre demande a été enregistrée. Selon nos réglementations de confidentialité souveraines suisses, j'ai mis cette demande en file d'attente pour l'évaluation hors ligne directe du Dr. Elena Rostova." : "Your request has been logged. Under our Swiss sovereign privacy regulations, I have queued this inquiry for Dr. Elena Rostova's direct offline evaluation.";
      if (textLower.includes("nok") || textLower.includes("terracotta")) reply = lang === "fr" ? "Accusé de réception. Notre Dignitaire Assis Nok est actuellement sécurisé dans la Chambre 14B de Zurich. L'inspection directe nécessite un avis de défrichage préalable de 48 heures." : "Acknowledged. Our Nok Seated Dignitary is currently secured in Zurich Chamber 14B. Direct inspection requires 48-hour prior clearing notice.";
      else if (textLower.includes("benin") || textLower.includes("bronze")) reply = lang === "fr" ? "Accusé de réception. Le Consortium Bénin comprend deux plaques en relief actuellement sous statut de séquestre à Genève." : "Acknowledged. The Benin Consortium includes two relief plaques currently on escrow holding status in Geneva.";
      else if (textLower.includes("escrow") || textLower.includes("buy")) reply = lang === "fr" ? "Selon notre protocole de séquestre, les ordres d'achat sont routés via des comptes de garde à l'aveugle profond avec le Groupe Julius Baer." : "Under our Escrow protocol, buy-orders are routed via deep-blind custody accounts with Julius Baer Group.";
      setMessages((prev) => [...prev, { sender: "coordinator", text: reply, time: timeStr }]);
    }, 1500);
  };

  const handleSearchCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCode) return;
    const match = MASTER_ARTIFACTS.find((art) => art.id.toLowerCase() === typedCode.toLowerCase().trim());
    if (match) { setSelectedProvenanceId(match.id); setAuditMessage(`Accession Record '${match.id}' Found. Title Cleared & Vetted.`); }
    else { setAuditMessage(`No active record registered with code '${typedCode}'. Verification failed.`); }
    setTimeout(() => setAuditMessage(null), 4000);
  };

  const filteredArtifacts = MASTER_ARTIFACTS.filter((art) => {
    const matchesRegion = regionFilter === "All" || art.origin.includes(regionFilter);
    const matchesMedium = mediumFilter === "All" || art.medium.includes(mediumFilter);
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || art.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesMedium && matchesSearch;
  });

  const tabs = [
    { id: "advisory" as const, label: lang === "fr" ? "Conseil" : "Advisory" },
    { id: "gallery" as const, label: lang === "fr" ? "Galerie" : "Gallery" },
    { id: "provenance" as const, label: lang === "fr" ? "Provenance" : "Provenance" },
    { id: "vault" as const, label: lang === "fr" ? "Coffre-fort" : "Vault" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Tab Navigation */}
        <div className="bg-surface-container/60 border-b border-on-surface/5 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-0 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-4 font-sans text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? "text-ebony-deep border-gold-leaf" : "text-on-surface-variant/60 border-transparent hover:text-ebony-deep"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ADVISORY TAB */}
          {activeTab === "advisory" && (
            <motion.div key="advisory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <section className="mb-24 flex flex-col items-center text-center max-w-4xl mx-auto px-4 pt-10">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold-leaf font-bold mb-6">{lang === "fr" ? "Services de Conseil Institutionnel" : "Institutional Advisory Services"}</span>
                <h1 className="font-display-xl text-ebony-deep mb-8 leading-[1.1]">{lang === "fr" ? "Portefeuilles Curés de Permanence Culturelle" : "Curated Portfolios of Cultural Permanence"}</h1>
                <p className="font-serif text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl leading-relaxed">{lang === "fr" ? "Conseil stratégique en acquisition et cession pour les collectionneurs et institutions de grande fortune." : "Strategic acquisition and divestment counsel for high-net-worth collectors and institutions."}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} className="bg-ebony-deep text-parchment-ivory font-sans text-xs uppercase tracking-widest px-8 py-5 hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Planifier une Consultation" : "Schedule Consultation"}</button>
                  <button onClick={() => setActiveTab("provenance")} className="border border-gold-leaf text-gold-leaf font-sans text-xs uppercase tracking-widest px-8 py-5 hover:bg-gold-leaf/5 transition-colors bg-transparent">{lang === "fr" ? "Vérifier les Fiches de Provenance" : "Verify Provenance Files"}</button>
                </div>
              </section>

              {/* Market Performance */}
              <section className="mb-24 max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                  <div>
                    <span className="font-sans text-xs uppercase tracking-widest text-gold-leaf font-bold">{lang === "fr" ? "Analytique de l'Index Consolidé" : "Consolidated Index Analytics"}</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-ebony-deep mt-2">{lang === "fr" ? "Performance du Marché : Antiquités Africaines" : "Market Performance: African Antiquities"}</h2>
                  </div>
                  <div className="flex gap-2 bg-surface-container/60 p-1 border border-on-surface/5 uppercase text-[10px] tracking-wider font-semibold">
                    {(["aggregate", "nok", "benin"] as const).map((f) => (
                      <button key={f} onClick={() => setChartFocus(f)} className={`px-3 py-1.5 transition-all ${chartFocus === f ? "bg-ebony-deep text-parchment-ivory" : "text-on-surface-variant/70 hover:text-ebony-deep"}`}>
                        {f === "aggregate" ? (lang === "fr" ? "Index Agrégé" : "Aggregate Index") : f === "nok" ? "Nok Terracotta" : "Benin Bronze"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-surface-container-lowest p-6 md:p-8 border border-on-surface/5 shadow-level-2">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant/60">{lang === "fr" ? "BASELINE DE VALEUR DE L'INDEX (2016 = 100)" : "INDEX VALUATION BASELINE (2016 = 100)"}</span>
                        <h3 className="font-serif text-xl md:text-2xl text-ebony-deep mt-1">{chartFocus === "aggregate" ? (lang === "fr" ? "Modèle de Croissance Historique" : "Historical Growth Pattern") : chartFocus === "nok" ? (lang === "fr" ? "Vague d'Investissement Nok Terracotta" : "Nok Terracotta Investment Wave") : (lang === "fr" ? "Référence Bronze du Royaume du Bénin" : "Kingdom of Benin Bronze Benchmark")}</h3>
                      </div>
                      <div className="text-right">
                        <span className="font-sans text-xl md:text-2xl text-terracotta-earth font-bold block">{chartFocus === "aggregate" ? "+14.2% YTD" : chartFocus === "nok" ? "+18.4% Average Compound" : "+218% Total 10-Year"}</span>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50">{lang === "fr" ? "VOLUME DE TRANSACTION SÉCURISÉ" : "SECURE TRANSACTION VOLUME"}</span>
                      </div>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MARKET_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae8e4" />
                          <XAxis dataKey="year" stroke="#747878" tick={{ fontSize: 11, fontFamily: "Inter" }} />
                          <YAxis stroke="#747878" tickFormatter={(val) => `${val}%`} tick={{ fontSize: 11, fontFamily: "Inter" }} />
                          <Tooltip contentStyle={{ backgroundColor: "#F9F6F2", border: "1px solid rgba(15,15,15,0.1)", fontFamily: "Inter", fontSize: "12px", borderRadius: "0px" }} labelFormatter={(label) => `Fiscal Year: ${label}`} />
                          {chartFocus === "aggregate" && <Line type="monotone" dataKey="indexValue" name="Antiquities Index" stroke="#B35C44" strokeWidth={3} dot={{ r: 4, strokeWidth: 1, fill: "#B35C44" }} activeDot={{ r: 7 }} />}
                          {(chartFocus === "nok" || chartFocus === "aggregate") && <Line type="monotone" dataKey="nokTerracotta" name="Nok Segment" stroke="#C5A059" strokeWidth={chartFocus === "nok" ? 3 : 1.5} strokeDasharray={chartFocus === "aggregate" ? "4 4" : undefined} dot={chartFocus === "nok" ? { r: 4 } : false} />}
                          {(chartFocus === "benin" || chartFocus === "aggregate") && <Line type="monotone" dataKey="beninBronze" name="Benin Segment" stroke="#0F0F0F" strokeWidth={chartFocus === "benin" ? 3 : 1.5} strokeDasharray={chartFocus === "aggregate" ? "2 2" : undefined} dot={chartFocus === "benin" ? { r: 4 } : false} />}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-on-surface/5 flex flex-col sm:flex-row justify-between text-[11px] text-on-surface-variant/60 font-sans gap-2">
                      <span>{lang === "fr" ? "* Données vérifiées selon les indices des maisons de ventes aux enchères suisses et londres" : "* Data verified according to Swiss and London auction house indices"}</span>
                      <span className="font-medium text-gold-leaf uppercase tracking-wider">{lang === "fr" ? "● Vue d'Évaluation Interactive Activée" : "● Interactive Valuation View Enabled"}</span>
                    </div>
                  </div>
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-surface-container-lowest p-6 border border-on-surface/5 shadow-level-2 flex-1">
                      <Coins className="w-8 h-8 stroke-[1.2] text-gold-leaf mb-4" />
                      <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 block mb-1">{lang === "fr" ? "Volume Global aux Enchères" : "Global Auction Volume"}</span>
                      <div className="font-serif text-3xl md:text-4xl text-ebony-deep font-semibold">$124.5M</div>
                      <div className="mt-4 pt-4 border-t border-on-surface/5 text-xs text-on-surface-variant/60 flex items-center justify-between"><span>{lang === "fr" ? "Année Fiscale 2023" : "2023 Fiscal Year"}</span><span className="text-[10px] uppercase font-bold text-emerald-600">+9.4% YoY</span></div>
                    </div>
                    <div className="bg-surface-container-lowest p-6 border-l-4 border-terracotta-earth shadow-level-2 flex-1">
                      <TrendingUp className="w-8 h-8 stroke-[1.2] text-terracotta-earth mb-4" />
                      <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 block mb-1">{lang === "fr" ? "Appréciation sur 10 Ans" : "10-Year Appreciation"}</span>
                      <div className="font-serif text-3xl md:text-4xl text-ebony-deep font-semibold">218%</div>
                      <div className="mt-4 pt-4 border-t border-on-surface/5 text-xs text-on-surface-variant/60 flex items-center justify-between"><span>{lang === "fr" ? "Provenance Haut de Gamme Uniquement" : "Top-Tier Provenance Only"}</span><span className="text-[10px] uppercase font-bold text-terracotta-earth">{lang === "fr" ? "Composé" : "Compounded"}</span></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Curated Packages */}
              <section className="mb-24 bg-surface-container-low/40 py-20 px-6 md:px-12 border-y border-on-surface/5">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold-leaf font-bold block mb-3">{lang === "fr" ? "Titres d'Actifs Souverains" : "Sovereign Asset Holdings"}</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-ebony-deep mb-4">{lang === "fr" ? "Packages d'Investissement Curés" : "Curated Investment Packages"}</h2>
                  </div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {CURATED_PACKAGES.map((pkg, idx) => (
                      <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className="group cursor-pointer flex flex-col bg-surface-container-lowest shadow-level-2 border border-on-surface/5 hover:border-gold-leaf/20 transition-all duration-300">
                        <div className="w-full aspect-[4/3] bg-surface-container-low relative overflow-hidden">
                          <img src={pkg.imageUrl} alt={pkg.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-ebony-deep/10 group-hover:bg-transparent transition-colors duration-500" />
                          <div className="absolute top-4 right-4 bg-ebony-deep text-parchment-ivory px-3 py-1 text-[10px] font-sans uppercase tracking-widest font-semibold">EST. VALUE {pkg.estimatedValue}</div>
                        </div>
                        <div className="p-8 text-center flex-1 flex flex-col justify-between">
                          <div>
                            <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-gold-leaf font-bold block mb-2">Package {idx === 0 ? "I" : "II"}</span>
                            <h3 className="font-serif text-2xl text-ebony-deep mb-4 group-hover:text-gold-leaf transition-colors duration-200">{pkg.title}</h3>
                            <p className="font-serif text-sm text-on-surface-variant mb-6">{pkg.tagline}</p>
                          </div>
                          <div className="pt-6 border-t border-on-surface/5 flex justify-center">
                            <button className="font-sans text-xs uppercase tracking-widest text-ebony-deep border-b border-gold-leaf pb-1 hover:text-gold-leaf transition-colors">{lang === "fr" ? "Voir la Décomposition du Portefeuille" : "View Portfolio Breakdown"}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Consultation Form */}
              <section ref={formRef} className="mb-24 max-w-7xl mx-auto px-6 md:px-12 scroll-mt-24">
                <div className="bg-surface-container-lowest border border-on-surface/5 shadow-level-2 p-5 md:p-8 lg:p-16 flex flex-col lg:flex-row gap-16 items-center">
                  <div className="w-full lg:w-1/2">
                    <span className="font-sans text-xs uppercase tracking-widest text-gold-leaf font-bold block mb-4">{lang === "fr" ? "COMMUNIQUÉ CONFIDENTIEL" : "CONFIDENTIAL COMMUNIQUE"}</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-ebony-deep mb-6">{lang === "fr" ? "Conseil Confidentiel" : "Confidential Advisory"}</h2>
                    <p className="font-serif text-base text-on-surface-variant mb-8 leading-relaxed">{lang === "fr" ? "Engagez directement avec nos conservateurs seniors, spécialistes juridiques de la provenance et analystes financiers." : "Engage directly with our senior curators, legal provenance specialists, and financial analysts."}</p>
                    <div className="border-l-4 border-terracotta-earth pl-6 mb-8 py-2 bg-surface-container-low/30 pr-4">
                      <p className="font-serif text-sm text-ebony-deep italic leading-relaxed">&quot;{lang === "fr" ? "La véritable valeur des antiquités ne découle pas uniquement de la rareté esthétique brute, mais de la clarté incontestable de sa provenance historique." : "True value in antiquities is derived not just from aesthetic raw scarcity, but from the unassailable clarity of its historical provenance."}&quot;</p>
                      <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mt-4 block font-bold">— {lang === "fr" ? "Dr. Elena Rostova, Présidente du Conseil Consultatif" : "Dr. Elena Rostova, Head of Advisory Board"}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-on-surface-variant/60 font-sans">
                      <div className="flex items-center gap-1.5 border border-on-surface/10 px-3 py-1.5 bg-surface-container-low"><ShieldCheck className="w-4 h-4 text-gold-leaf" /><span>{lang === "fr" ? "Protégé par NDA" : "NDA Protected"}</span></div>
                      <div className="flex items-center gap-1.5 border border-on-surface/10 px-3 py-1.5 bg-surface-container-low"><UserCheck className="w-4 h-4 text-gold-leaf" /><span>{lang === "fr" ? "Validation Biométrique" : "Biometric Validation"}</span></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 bg-parchment-ivory p-6 md:p-10 border border-on-surface/10 shadow-level-2">
                    <AnimatePresence mode="wait">
                      {!bookingSuccess ? (
                        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleBooking} className="flex flex-col gap-6">
                          <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Type de Demande" : "Inquiry Type"}</label><select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none cursor-pointer"><option>{lang === "fr" ? "Évaluation & Allocation de Portefeuille" : "Portfolio Assessment & Allocation"}</option><option>{lang === "fr" ? "Stratégie d'Acquisition Directe" : "Direct Acquisition Strategy"}</option><option>{lang === "fr" ? "Authentification & Vérification du Carbone" : "Authentication & Carbon Vetting"}</option><option>{lang === "fr" ? "Configuration de Stockage Sécurisé" : "Secure Escrow Storage Setup"}</option></select></div>
                          <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Nom Complet" : "Full Name"}</label><input type="text" required placeholder="Baron Robert de Rothschild" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none placeholder:text-on-surface-variant/30" /></div>
                          <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Email de Contact Chiffré" : "Encrypted Contact Email"}</label><input type="email" required placeholder="r.rothschild@sovereign-vault.ch" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none placeholder:text-on-surface-variant/30" /></div>
                           <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Conservateur Conseil Préféré" : "Preferred Advisory Curator"}</label><select value={preferredCurator} onChange={(e) => setPreferredCurator(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none cursor-pointer"><option>Dr. Elena Rostova (African Antiquities)</option><option>Marcus Vance (Financial Art Allocation)</option><option>{lang === "fr" ? "Conseil de Consensus (Comité Consultatif Complet)" : "Consensus Council (Full Advisory Board)"}</option></select></div>
                           <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Cible d'Allocation Principale" : "Primary Allocation Target"}</label><select value={investmentTier} onChange={(e) => setInvestmentTier(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none cursor-pointer"><option>$250,000 - $500,000</option><option>$500,000 - $2,000,000</option><option>$2,000,000 - $5,000,000</option><option>$5,000,000+ ({lang === "fr" ? "Mandat Institutionnel" : "Institutional Mandate"})</option></select></div>
                           <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Horizon d'Investissement" : "Investment Horizon"}</label><select value={investmentHorizon} onChange={(e) => setInvestmentHorizon(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none cursor-pointer"><option>1-2 {lang === "fr" ? "Ans" : "Years"}</option><option>3-5 {lang === "fr" ? "Ans" : "Years"}</option><option>5-10 {lang === "fr" ? "Ans" : "Years"}</option><option>10+ {lang === "fr" ? "Ans (Héritage)" : "Years (Legacy)"}</option></select></div>
                           <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Objectifs d'Investissement" : "Investment Goals"}</label><select value={investmentGoals} onChange={(e) => setInvestmentGoals(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none cursor-pointer"><option>{lang === "fr" ? "Appréciation du Capital" : "Capital Appreciation"}</option><option>{lang === "fr" ? "Diversification" : "Diversification"}</option><option>{lang === "fr" ? "Préservation Culturelle" : "Cultural Preservation"}</option><option>{lang === "fr" ? "Optimisation Fiscale" : "Tax Optimization"}</option><option>{lang === "fr" ? "Couverture de Portefeuille" : "Portfolio Hedging"}</option></select></div>
                           <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Collection Actuelle (Optionnel)" : "Current Collection (Optional)"}</label><input type="text" placeholder={lang === "fr" ? "Décrivez votre collection existante..." : "Describe your existing collection..."} value={currentCollection} onChange={(e) => setCurrentCollection(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none placeholder:text-on-surface-variant/30" /></div>
                           <div className="border-t border-on-surface/10 pt-4 mt-2">
                             <p className="font-sans text-[10px] uppercase tracking-wider text-terracotta-earth mb-3 font-bold">{lang === "fr" ? "Planifier une Réunion d'Évaluation" : "Schedule Valuation Meeting"}</p>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Date Préférée" : "Preferred Date"}</label><input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none" /></div>
                                <div className="flex flex-col"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Heure Préférée" : "Preferred Time"}</label><select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none cursor-pointer"><option>{lang === "fr" ? "Matin (9:00-12:00 CET)" : "Morning (9:00-12:00 CET)"}</option><option>{lang === "fr" ? "Après-midi (13:00-17:00 CET)" : "Afternoon (13:00-17:00 CET)"}</option><option>{lang === "fr" ? "Soirée (18:00-20:00 CET)" : "Evening (18:00-20:00 CET)"}</option></select></div>
                             </div>
                               <div className="flex flex-col mt-4"><label className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2 font-bold">{lang === "fr" ? "Format de Réunion" : "Meeting Format"}</label><select value={meetingType} onChange={(e) => setMeetingType(e.target.value)} className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-gold-leaf py-2 px-0 font-sans text-sm text-ebony-deep outline-none cursor-pointer"><option>{lang === "fr" ? "Appel Vidéo (Zoom Sécurisé)" : "Video Call (Secure Zoom)"}</option><option>{lang === "fr" ? "En Personne (Zurich)" : "In-Person (Zurich)"}</option><option>{lang === "fr" ? "En Personne (Londres)" : "In-Person (London)"}</option><option>{lang === "fr" ? "Consultation Téléphonique" : "Phone Consultation"}</option></select></div>
                           </div>
                          <button type="submit" className="mt-6 bg-ebony-deep text-parchment-ivory font-sans text-xs uppercase tracking-widest px-6 py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Demander un Rendez-vous Sécurisé" : "Request Secure Appointment"}</button>
                        </motion.form>
                      ) : (
                          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-10 flex flex-col items-center justify-center h-full">
                          <div className="w-14 h-14 rounded-full bg-gold-leaf/10 border border-gold-leaf flex items-center justify-center text-gold-leaf mb-6"><ShieldCheck className="w-7 h-7 stroke-[1.5]" /></div>
                           <h3 className="font-serif text-2xl text-ebony-deep mb-4">{lang === "fr" ? "Connexion Sécurisée Établie" : "Secure Connection Established"}</h3>
                           <p className="font-serif text-sm text-on-surface-variant mb-6 max-w-sm leading-relaxed">{lang === "fr" ? "Merci," : "Thank you,"} <strong className="text-ebony-deep">{fullName}</strong>. {lang === "fr" ? "Votre demande de conseil pour" : "Your advisory request for"} <strong className="text-ebony-deep">{inquiryType}</strong> {lang === "fr" ? "a été enregistrée." : "has been logged."}</p>
                          <div className="bg-surface-container p-4 border border-on-surface/5 mb-8 w-full text-left">
                            <div className="space-y-1.5 text-xs font-sans">
                              <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Code de Vérification :" : "Vetting Code:"}</span><span className="font-bold text-ebony-deep font-mono">{bookingRef}</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Conservateur Assigné :" : "Assigned Curator:"}</span><span className="text-ebony-deep font-medium">{preferredCurator}</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Volume Cible :" : "Target Volume:"}</span><span className="text-ebony-deep font-medium">{investmentTier}</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Horizon :" : "Horizon:"}</span><span className="text-ebony-deep font-medium">{investmentHorizon}</span></div>
                              <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Objectifs :" : "Goals:"}</span><span className="text-ebony-deep font-medium">{investmentGoals}</span></div>
                              {preferredDate && <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Réunion :" : "Meeting:"}</span><span className="text-ebony-deep font-medium">{preferredDate} · {preferredTime}</span></div>}
                              {meetingType && <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Format :" : "Format:"}</span><span className="text-ebony-deep font-medium">{meetingType}</span></div>}
                            </div>
                          </div>
                          <button onClick={() => { setBookingSuccess(false); setFullName(""); setEmail(""); setCurrentCollection(""); setPreferredDate(""); }} className="border border-on-surface/10 font-sans text-xs uppercase tracking-widest px-6 py-3 hover:bg-on-surface/5 transition-colors">{lang === "fr" ? "Autoriser une Autre Demande" : "Authorize Another Request"}</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <div className="bg-parchment-ivory min-h-screen py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="text-center mb-16">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold-leaf font-bold block mb-3">{lang === "fr" ? "COFFRE-FORT D'ACTIFS CONSECUTIFS" : "CONSECUTIVE ASSET VAULT"}</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-ebony-deep mb-4">{lang === "fr" ? "La Galerie des Antiquités Souveraines" : "The Sovereign Antiquities Gallery"}</h1>
                    <p className="font-serif text-base text-on-surface-variant max-w-xl mx-auto">{lang === "fr" ? "Explorez un catalogue raffiné de physiques vérifiés approuvés par des conseillers archéologiques." : "Explore a refined catalog of verified physical artifacts cleared by archaeological advisors."}</p>
                  </div>

                  <div className="bg-surface-container/60 p-6 border border-on-surface/5 mb-12 flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
                      <input type="text" placeholder={lang === "fr" ? "Rechercher par civilisation..." : "Search via civilization..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-parchment-ivory border border-on-surface/15 py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none focus:border-gold-leaf text-ebony-deep placeholder:text-on-surface-variant/40" />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
                      <div className="flex items-center gap-2"><span className="text-on-surface-variant/60 font-bold uppercase tracking-wider text-[10px]">{lang === "fr" ? "Culture :" : "Culture:"}</span><select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="bg-parchment-ivory border border-on-surface/15 py-2 px-3 focus:outline-none focus:border-gold-leaf text-ebony-deep font-semibold cursor-pointer"><option value="All">{lang === "fr" ? "Toutes les Cultures" : "All Cultures"}</option><option value="Nok">Nok Plateau</option><option value="Ife">Ife Kingdom</option><option value="Benin">Kingdom of Benin</option></select></div>
                      <div className="flex items-center gap-2"><span className="text-on-surface-variant/60 font-bold uppercase tracking-wider text-[10px]">{lang === "fr" ? "Matériau :" : "Medium:"}</span><select value={mediumFilter} onChange={(e) => setMediumFilter(e.target.value)} className="bg-parchment-ivory border border-on-surface/15 py-2 px-3 focus:outline-none focus:border-gold-leaf text-ebony-deep font-semibold cursor-pointer"><option value="All">{lang === "fr" ? "Tous les Matériaux" : "All Mediums"}</option><option value="Terracotta">Terracotta</option><option value="Bronze">Bronze</option></select></div>
                      {(regionFilter !== "All" || mediumFilter !== "All" || searchQuery !== "") && <button onClick={() => { setRegionFilter("All"); setMediumFilter("All"); setSearchQuery(""); }} className="text-terracotta-earth font-bold hover:underline uppercase tracking-wider text-[10px]">{lang === "fr" ? "Réinitialiser le Filtre" : "Reset Filter"}</button>}
                    </div>
                  </div>

                  {filteredArtifacts.length > 0 ? (
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                      {filteredArtifacts.map((art) => (
                        <motion.div variants={fadeUp} key={art.id} onClick={() => setActiveGalleryArtifact(art)} className="group cursor-pointer bg-surface-container-lowest border border-on-surface/5 shadow-level-2 hover:shadow-hover-lift transition-all duration-300 flex flex-col justify-between">
                          <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                            <img src={art.imageUrl} alt={art.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-ebony-deep/5 group-hover:bg-transparent transition-colors duration-300" />
                            <div className="absolute top-3 left-3 bg-parchment-ivory/90 backdrop-blur-sm border border-on-surface/10 px-2.5 py-1 text-[10px] font-sans uppercase font-bold tracking-wider">{art.id}</div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between text-center">
                            <div>
                              <span className="font-sans text-[10px] uppercase tracking-widest text-gold-leaf font-bold block mb-1">{art.origin}</span>
                              <h3 className="font-serif text-lg md:text-xl text-ebony-deep font-semibold mb-2 group-hover:text-gold-leaf transition-colors">{art.title}</h3>
                              <p className="font-serif text-xs text-on-surface-variant/90 italic mb-4">{art.period}</p>
                            </div>
                            <div className="pt-4 border-t border-on-surface/5 flex items-center justify-between text-xs font-sans">
                              <span className="text-on-surface-variant/50 font-bold uppercase tracking-[0.05em]">{art.medium}</span>
                              <span className="text-terracotta-earth font-bold text-sm tracking-tight">{art.estimatedValue}</span>
                            </div>
                          </div>
                          <div className="bg-ebony-deep text-parchment-ivory/95 text-center text-[10px] uppercase tracking-widest py-3 hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Authentifier et Voir le Dossier" : "Authenticate & View Dossier"}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-20 bg-surface-container-lowest border border-on-surface/5">
                      <Info className="w-10 h-10 text-gold-leaf mx-auto mb-4 stroke-[1.2]" />
                      <h3 className="font-serif text-xl text-ebony-deep">{lang === "fr" ? "Aucune Correspondance Enregistrée" : "No Matches Registered"}</h3>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Artifact Modal */}
              <AnimatePresence>
                {activeGalleryArtifact && (
                  <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ebony-deep/65 backdrop-blur-sm" onClick={() => { setActiveGalleryArtifact(null); setInquirySuccess(false); }} />
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-parchment-ivory border border-on-surface/10 max-w-5xl w-full p-6 md:p-10 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-start border-b border-on-surface/15 pb-4 mb-6">
                        <div><span className="font-sans text-[10px] uppercase tracking-widest text-terracotta-earth font-bold block">{lang === "fr" ? "CONSOLE D'ACCÈS COLLECTEUR" : "COLLECTOR ACCESS CONSOLE"}</span><h3 className="font-serif text-2xl md:text-3xl text-ebony-deep font-semibold mt-1">{activeGalleryArtifact.title}</h3></div>
                        <button onClick={() => { setActiveGalleryArtifact(null); setInquirySuccess(false); }} className="font-sans text-lg hover:text-gold-leaf font-semibold border border-on-surface/15 px-3 py-1 bg-surface-container">✕</button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7 space-y-6">
                          <div className="relative aspect-video max-h-96 w-full bg-surface-container-low overflow-hidden border border-on-surface/5">
                            <img src={activeGalleryArtifact.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 bg-ebony-deep text-parchment-ivory text-[10px] font-sans pb-1 pt-1.5 px-3 uppercase tracking-widest font-semibold">{lang === "fr" ? "VALEUR ESTIMÉE :" : "ESTIMATED VALUE:"} {activeGalleryArtifact.estimatedValue}</div>
                          </div>
                           <div><h4 className="font-sans text-xs uppercase tracking-widest text-gold-leaf font-bold mb-2">{lang === "fr" ? "Rapport d'Authentification Scientifique" : "Scientific Authentication Report"}</h4><p className="font-serif text-sm text-on-surface-variant/80 bg-surface-container p-3 border-l-2 border-terracotta-earth leading-relaxed">{activeGalleryArtifact.carbonDatingDetails || (lang === "fr" ? "Les tests de thermoluminescence valident l'époque de création." : "Thermoluminescence testing validates creation epoch.")}</p></div>
                           <div><h4 className="font-sans text-xs uppercase tracking-widest text-terracotta-earth font-bold mb-3">{lang === "fr" ? "Grand Livre de Provenance" : "Provenance Ledger"}</h4><div className="space-y-2 font-sans text-xs">{activeGalleryArtifact.provenance.map((prov, i) => <div key={i} className="py-2 border-b border-on-surface/5 text-on-surface-variant/80 pl-3 border-l-2 border-gold-leaf bg-surface-container-low/40">{prov}</div>)}</div></div>
                           <div><h4 className="font-sans text-xs uppercase tracking-widest text-terracotta-earth font-bold mb-2">{lang === "fr" ? "Registre des Expositions" : "Exhibition Registry"}</h4><ul className="space-y-1 text-xs text-on-surface-variant/80">{activeGalleryArtifact.exhibitions.map((ex, i) => <li key={i} className="flex gap-2 items-center"><span className="w-1.5 h-1.5 bg-gold-leaf rounded-full shrink-0" /><span>{ex}</span></li>)}</ul></div>
                        </div>
                        <div className="lg:col-span-5 space-y-6">
                           <div><h4 className="font-sans text-xs uppercase tracking-widest text-ebony-deep font-bold mb-2 border-b border-on-surface/10 pb-2">{lang === "fr" ? "Déclaration du Conservateur" : "Curatorial Statement"}</h4><p className="font-serif text-sm text-on-surface-variant leading-relaxed">{activeGalleryArtifact.description}</p></div>
                           <div className="bg-surface-container p-4 border border-on-surface/5 font-sans space-y-2.5 text-xs">
                             <div className="flex justify-between border-b border-on-surface/10 pb-1.5"><span className="text-on-surface-variant/50">{lang === "fr" ? "Code d'Accession" : "Accession Code"}</span><span className="font-bold text-ebony-deep font-mono">{activeGalleryArtifact.accessionNo}</span></div>
                             <div className="flex justify-between border-b border-on-surface/10 pb-1.5"><span className="text-on-surface-variant/50">{lang === "fr" ? "Culture" : "Culture"}</span><span className="font-semibold text-ebony-deep">{activeGalleryArtifact.origin}</span></div>
                             <div className="flex justify-between"><span className="text-on-surface-variant/50">{lang === "fr" ? "Matériau" : "Medium"}</span><span className="font-semibold text-ebony-deep">{activeGalleryArtifact.medium}</span></div>
                          </div>
                          <div className="bg-surface-container p-6 border border-gold-leaf/25 relative overflow-hidden">
                             <div className="absolute top-0 right-0 bg-gold-leaf/10 border-l border-b border-gold-leaf/30 text-gold-leaf px-2.5 py-0.5 text-[8.5px] uppercase tracking-widest font-extrabold">{lang === "fr" ? "CONFIDENTIEL" : "CONFIDENTIAL"}</div>
                            <AnimatePresence mode="wait">
                              {!inquirySuccess ? (
                                <motion.form key="inq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={(e) => { e.preventDefault(); setInquirySuccess(true); }} className="space-y-4">
                                   <h4 className="font-serif text-base text-ebony-deep font-semibold">{lang === "fr" ? "Lancer une Demande d'Acquisition" : "Initiate Acquisition Inquiry"}</h4>
                                   <div className="space-y-3 font-sans text-xs">
                                     <div><label className="text-[10px] uppercase font-bold text-on-surface-variant/50 block mb-1">{lang === "fr" ? "Nom Complet" : "Full Name"}</label><input type="text" required placeholder="Baron Robert de Rothschild" value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} className="w-full bg-parchment-ivory border-b border-on-surface/20 focus:border-gold-leaf focus:outline-none py-1.5 text-ebony-deep font-medium" /></div>
                                     <div><label className="text-[10px] uppercase font-bold text-on-surface-variant/50 block mb-1">{lang === "fr" ? "Email" : "Email"}</label><input type="email" required placeholder="advisors@rothschild-coalition.com" value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} className="w-full bg-parchment-ivory border-b border-on-surface/20 focus:border-gold-leaf focus:outline-none py-1.5 text-ebony-deep font-medium" /></div>
                                   </div>
                                   <button type="submit" className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs uppercase tracking-widest py-3.5 hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Demander le Dossier d'Actif" : "Inquire Asset Dossier"}</button>
                                </motion.form>
                              ) : (
                                <motion.div key="inq-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                  <div className="w-10 h-10 rounded-full bg-gold-leaf/10 border border-gold-leaf flex items-center justify-center text-gold-leaf mx-auto mb-3"><ShieldCheck className="w-5 h-5" /></div>
                                   <h4 className="font-serif text-sm text-ebony-deep font-bold mb-1">{lang === "fr" ? "Identifiés Déposés avec Succès" : "Credentials Lodged Successfully"}</h4>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* PROVENANCE TAB */}
          {activeTab === "provenance" && (
            <motion.div key="provenance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <div className="bg-parchment-ivory min-h-screen py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold-leaf font-bold block mb-3">{lang === "fr" ? "ENREGISTREMENTS DE GARDE CONTINUE" : "continuous custody records"}</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-ebony-deep mb-4">{lang === "fr" ? "Registre de Provenance Incontestable" : "Unassailable Provenance Registry"}</h1>
                    <p className="font-serif text-base text-on-surface-variant">{lang === "fr" ? "Chaque transaction, datation au carbone et entrée d'archive historique est consignée." : "Every transaction, carbon-dating, and historical archive entry logged."}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start mb-20">
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-surface-container/60 p-6 border border-on-surface/5 shadow-level-2">
                        <h3 className="font-sans text-xs uppercase tracking-widest text-terracotta-earth font-bold mb-4">{lang === "fr" ? "Audit de la Clé d'Accession" : "Accession Key Audit"}</h3>
                        <form onSubmit={handleSearchCode} className="space-y-4">
                          <div className="relative"><SearchCode className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" /><input type="text" placeholder={lang === "fr" ? "Entrez l'Accession : NOK-9401..." : "Enter Accession: NOK-9401..."} value={typedCode} onChange={(e) => setTypedCode(e.target.value)} className="w-full bg-parchment-ivory border border-on-surface/15 py-3 pl-10 pr-3 font-sans text-xs focus:outline-none focus:border-gold-leaf uppercase" /></div>
                          <button type="submit" className="w-full bg-ebony-deep text-parchment-ivory font-sans text-xs uppercase tracking-widest py-3 hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Interroger le Grand Livre de Garde" : "Query Custody Ledger"}</button>
                        </form>
                        <AnimatePresence>{auditMessage && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mt-4 p-3 text-[11.5px] font-sans border text-center ${auditMessage.includes("Found") ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-rose-50 border-rose-300 text-rose-800"}`}>{auditMessage}</motion.div>}</AnimatePresence>
                      </div>
                      <div className="bg-surface-container/60 p-6 border border-on-surface/5 shadow-level-2">
                        <h3 className="font-sans text-xs uppercase tracking-widest text-ebony-deep font-bold mb-4">{lang === "fr" ? "Articles du Coffre-Fort Principal" : "Master Vault Items"}</h3>
                        <div className="space-y-3">
                          {MASTER_ARTIFACTS.map((art) => (
                            <div key={art.id} onClick={() => setSelectedProvenanceId(art.id)} className={`flex items-center gap-3 p-3 cursor-pointer border transition-colors ${art.id === selectedProvenanceId ? "bg-parchment-ivory border-gold-leaf" : "bg-surface-container-lowest/80 border-on-surface/5 hover:border-gold-leaf/30"}`}>
                              <img src={art.imageUrl} referrerPolicy="no-referrer" className="w-10 h-10 object-cover" alt="" />
                              <div className="flex-1 text-[11px] font-sans text-left"><span className="font-bold text-ebony-deep block truncate">{art.title}</span><span className="text-on-surface-variant/50">{art.accessionNo}</span></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-8 bg-surface-container-lowest p-6 md:p-10 border border-on-surface/5 shadow-level-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-on-surface/10 pb-6 mb-8 gap-4">
                         <div><span className="font-sans text-[10px] uppercase tracking-widest text-gold-leaf font-bold block">{lang === "fr" ? "Chronologie de Garde Vérifiée" : "Vetted custody timeline"}</span><h2 className="font-serif text-2xl md:text-3xl text-ebony-deep font-semibold mt-1">{activeProvenanceArt.title}</h2><span className="font-sans text-xs text-on-surface-variant/50">{lang === "fr" ? "Origine :" : "Origin:"} {activeProvenanceArt.origin}</span></div>
                         <div className="bg-surface-container px-4 py-2 text-right"><span className="font-serif text-terracotta-earth text-lg font-bold block">{activeProvenanceArt.estimatedValue}</span><span className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/50">{lang === "fr" ? "Évaluation Estimée" : "Appraised Valuation"}</span></div>
                      </div>
                      <div className="relative border-l border-on-surface/10 pl-6 md:pl-10 ml-4 space-y-10 py-2">
                        {activeProvenanceArt.provenance.map((prov, idx) => {
                          const parts = prov.split(": ");
                          return (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-[11px] h-[11px] bg-gold-leaf border border-parchment-ivory outline-[4px] outline-parchment-ivory" />
                              <div>
                                <span className="font-sans text-xs uppercase tracking-widest text-parchment-ivory bg-terracotta-earth px-2.5 py-0.5 font-bold mb-2 inline-block">{parts[0]}</span>
                                <p className="font-serif text-sm text-on-surface mt-2 leading-relaxed max-w-2xl">{parts[1]}</p>
                                <div className="mt-2 flex gap-4 text-[10px] font-sans text-on-surface-variant/40"><span>● {lang === "fr" ? "Cession Signée et Hachée" : "Handover Signed & Hashed"}</span><span>● {lang === "fr" ? "Licence d'Exportation Claire" : "Export License Clear"}</span></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-12 pt-8 border-t border-on-surface/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div><span className="font-sans text-[10px] uppercase tracking-wider text-gold-leaf font-bold block mb-2">{lang === "fr" ? "PRÉCISION DE LA THERMOLUMINESCENCE" : "THERMOLUMINESCENCE ACCURACY"}</span><p className="font-serif text-xs text-on-surface-variant/80 leading-relaxed bg-surface-container p-4 border-l-2 border-gold-leaf">{activeProvenanceArt.carbonDatingDetails || (lang === "fr" ? "Les tests physiques vérifient la décroissance de la thermoluminescence correspondant à l'époque de création certifiée." : "Physical testing verifies thermoluminescence decay matching the certified creation epoch.")}</p></div>
                        <div><span className="font-sans text-[10px] uppercase tracking-wider text-gold-leaf font-bold block mb-2">{lang === "fr" ? "RECONNAISSANCE DE LA RÉGLEMENTATION DE GARDE" : "CUSTODY REGULATION ACCLAIM"}</span><p className="font-serif text-xs text-on-surface-variant/80 leading-relaxed bg-surface-container p-4 border-l-2 border-terracotta-earth">{lang === "fr" ? "Cet enregistrement est conforme à l'article 2(a) de la Convention de l'UNESCO de 1970 sur le transit du patrimoine national." : "This record complies with article 2(a) of the UNESCO 1970 Convention on transit of native heritage."}</p></div>
                      </div>
                    </div>
                  </div>

                  <section className="border-t border-on-surface/10 pt-16">
                    <div className="text-center mb-12"><span className="font-sans text-xs uppercase tracking-[0.2em] text-terracotta-earth font-bold block mb-2">{lang === "fr" ? "Authentifications Institutionnelles" : "Institutional Authentications"}</span><h2 className="font-serif text-2xl md:text-3xl text-ebony-deep">{lang === "fr" ? "Directives d'Authentification Double-Aveugle" : "Double-Blind Authentication Guidelines"}</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {SECURITY_AUDITS.map((item, idx) => (
                        <div key={idx} className="bg-surface-container p-6 border-t border-gold-leaf/30 space-y-3">
                           <span className="text-[10px] uppercase font-bold text-on-surface-variant/40">{lang === "fr" ? "Phase d'Audit 0" : "Audit Phase 0"}{idx + 1}</span>
                           <h4 className="font-serif text-base text-ebony-deep font-semibold">{item.title}</h4>
                           <div className="text-xs"><span className="font-bold text-terracotta-earth block">{lang === "fr" ? "Autorité :" : "Authority:"}</span><span className="text-on-surface-variant/70">{item.authority}</span></div>
                           <div className="text-xs"><span className="font-bold text-terracotta-earth block">{lang === "fr" ? "Norme :" : "Standard:"}</span><span className="text-on-surface-variant/70 font-mono text-[11px]">{item.standard}</span></div>
                          <p className="text-xs text-on-surface-variant/60 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {/* VAULT TAB */}
          {activeTab === "vault" && (
            <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <div className="bg-parchment-ivory min-h-screen py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <AnimatePresence mode="wait">
                    {!isAuthenticated ? (
                      <motion.div key="gateway" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-md mx-auto text-center">
                        <div className="bg-ebony-deep text-gold-leaf p-10 border border-gold-leaf/20 shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-parchment-ivory p-3 border border-on-surface/10 text-ebony-deep"><Lock className="w-8 h-8" /></div>
                           <h2 className="font-serif text-2xl mb-2 mt-4 text-center text-gold-leaf">{lang === "fr" ? "Terminal du Coffre-Fort Chiffré" : "Encrypted Vault Terminal"}</h2>
                           <p className="text-[11px] uppercase tracking-widest text-terracotta-earth font-bold mb-6 text-center">{lang === "fr" ? "Accès au Grand Livre du Freeport Suisse" : "Swiss Freeport Ledger Access"}</p>
                           <p className="text-parchment-ivory/60 text-xs text-center leading-relaxed mb-6 font-serif">{lang === "fr" ? "Entrez votre Clé de Collecteur sécurisée pour interroger les audits physiques actuels et communiquer derrière notre pare-feu chiffré." : "Enter your secure Collector Key to query current physical audits and communicate behind our encrypted firewall."}</p>
                          <form onSubmit={handleAuth} className="space-y-4">
                            <input type="password" required placeholder="ENTER PIN OR TYPE 'VAULT'" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 text-center text-sm font-mono tracking-[0.3em] py-3 text-gold-leaf placeholder-neutral-600 focus:outline-none focus:border-gold-leaf" />
                            <button type="submit" className="w-full bg-gold-leaf text-ebony-deep font-sans text-xs uppercase tracking-widest font-extrabold py-3.5 hover:bg-gold-leaf/80 transition-colors">{lang === "fr" ? "Authentifier la Session du Grand Livre" : "Authenticate Ledger Session"}</button>
                          </form>
                          {authError && <div className="mt-4 text-[11px] text-rose-500 font-bold tracking-tight">{authError}</div>}
                           <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 font-sans"><Radio className="w-3.5 h-3.5 text-terracotta-earth animate-pulse" /><span>{lang === "fr" ? "CONNEXION HSM SÉCURISÉE ACTIVE" : "SECURE HSM CONNECTION ACTIVE"}</span></div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                        <div className="bg-surface-container/60 p-6 border border-on-surface/5 shadow-level-2 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300"><Unlock className="w-5 h-5" /></div>
                             <div><span className="font-sans text-[10px] uppercase tracking-widest text-terracotta-earth font-bold block">{lang === "fr" ? "GRAND LIVRE COLLECTEUR EN VIGUEUR" : "COLLECTOR LEDGER IN FORCE"}</span><h2 className="font-serif text-lg md:text-xl text-ebony-deep font-semibold">{lang === "fr" ? "Session Active : Fiducie Roche-Gaston Consolidée" : "Active Session: Roche-Gaston Consolidated Trust"}</h2></div>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3 py-1.5 font-sans"><span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse inline-block" />{lang === "fr" ? "Session Chiffrée Connectée" : "Encrypted Session Connected"}</span>
                             <button onClick={() => { setIsAuthenticated(false); setAccessCode(""); }} className="border border-on-surface/15 text-xs text-on-surface hover:text-gold-leaf px-4 py-2 font-sans uppercase font-semibold bg-parchment-ivory">{lang === "fr" ? "Verrouiller le Coffre" : "Lock Vault"}</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="bg-surface-container-lowest p-6 border border-on-surface/5 shadow-level-2"><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 font-sans block mb-1">{lang === "fr" ? "VOLUME TOTAL ACQUIS" : "TOTAL ACQUIRED VOLUME"}</span><div className="font-serif text-3xl font-bold text-ebony-deep">$10,850,000</div><p className="text-[11px] text-on-surface-variant/50 mt-1.5 font-sans">{lang === "fr" ? "Pour 4 Antiquités Approuvées" : "Across 4 Cleared Antiquities"}</p></div>
                           <div className="bg-surface-container-lowest p-6 border border-on-surface/5 shadow-level-2"><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 font-sans block mb-1">{lang === "fr" ? "APPRÉCIATION COMPOSÉE" : "COMPOUND APPRECIATION"}</span><div className="font-serif text-3xl font-bold text-terracotta-earth">+16.4% YoY</div><p className="text-[11px] text-on-surface-variant/50 mt-1.5 font-sans">{lang === "fr" ? "Rendement annuel moyen de l'index" : "Average annual index return"}</p></div>
                           <div className="bg-surface-container-lowest p-6 border border-on-surface/5 shadow-level-2"><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 font-sans block mb-1">{lang === "fr" ? "CELLULE DE SÉCURITÉ FREEPORT" : "FREEPORT SECURITY CELL"}</span><div className="font-serif text-3xl font-bold text-ebony-deep">Zurich, C14B</div><p className="text-[11px] text-terracotta-earth font-bold mt-1.5 font-sans">{lang === "fr" ? "Garde Biométrique Continue" : "Continuous Biometric Custody"}</p></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
                          <div className="lg:col-span-4 bg-surface-container-lowest p-6 border border-on-surface/5 shadow-level-2 space-y-6">
                            <h3 className="font-sans text-xs uppercase tracking-widest text-terracotta-earth font-bold mb-2 pb-2 border-b border-on-surface/10">{lang === "fr" ? "Bibliothèque de Documents du Coffre Souverain" : "Sovereign Vault Document Library"}</h3>
                            <div className="space-y-4">
                              {[lang === "fr" ? "Certificats d'Authenticité" : "Certificates of Authenticity", lang === "fr" ? "Police d'Assurance Transit Lloyd's" : "Lloyd's Transit Insurance Policy", lang === "fr" ? "Protocoles de Séquestre Souverains" : "Sovereign Escrow Protocols"].map((doc, i) => (
                                <div key={i} className="flex justify-between items-center bg-surface-container/40 p-3.5 border-l-2 border-gold-leaf font-sans text-xs">
                                  <div><span className="font-bold text-ebony-deep block">{doc}</span><span className="text-on-surface-variant/50 text-[10px]">PDF {lang === "fr" ? "(Signé)" : "(Signed)"}</span></div>
                                  <button className="p-2 bg-ebony-deep hover:bg-gold-leaf hover:text-ebony-deep text-parchment-ivory transition-colors"><Download className="w-3.5 h-3.5" /></button>
                                </div>
                              ))}
                            </div>
                            <div className="p-4 bg-surface-container-low border border-on-surface/10 text-xs font-sans space-y-2">
                              <span className="font-bold uppercase tracking-wider block text-[10px] text-ebony-deep flex items-center gap-1"><Building className="w-3.5 h-3.5 text-gold-leaf" /> {lang === "fr" ? "Fiduciaire du Freeport Suisse" : "Swiss Freeport Trustee"}</span>
                              <p className="text-on-surface-variant/60 leading-relaxed text-[11px]">{lang === "fr" ? "Vos actifs sont sécurisés dans les Freeports de Genève hautement réglementés sous gestion fiduciaire." : "Your assets are secured inside the highly regulated Geneva Freeports under fiduciary care."}</p>
                            </div>
                          </div>

                          <div className="lg:col-span-8 bg-ebony-deep text-parchment-ivory p-6 md:p-8 border border-gold-leaf/25 shadow-2xl">
                            <div className="flex justify-between items-center border-b border-parchment-ivory/10 pb-4 mb-6">
                               <div><span className="font-sans text-[10px] uppercase tracking-widest text-terracotta-earth font-bold block">{lang === "fr" ? "Pare-feu : actif" : "Firewall: active"}</span><h3 className="font-serif text-xl text-gold-leaf mt-0.5">{lang === "fr" ? "Canal Curatorial Chiffré" : "Encrypted Curatorial Channel"}</h3></div>
                               <div className="text-right flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block" /><span className="font-mono text-[10px] uppercase text-parchment-ivory/40">AES-256 {lang === "fr" ? "Activé" : "Enabled"}</span></div>
                            </div>
                            <div className="h-80 overflow-y-auto mb-6 space-y-4 font-sans pr-2">
                              {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col max-w-[85%] ${msg.sender === "coordinator" ? "self-start text-left" : "ml-auto text-right"}`}>
                                  <div className={`p-4 font-sans text-xs ${msg.sender === "coordinator" ? "bg-neutral-900 border-l-2 border-gold-leaf text-parchment-ivory" : "bg-neutral-800 border-r-2 border-terracotta-earth text-parchment-ivory"}`}><p className="leading-relaxed">{msg.text}</p></div>
                                  <span className="text-[9px] text-parchment-ivory/30 uppercase font-mono mt-1 block">{msg.sender === "coordinator" ? "COORDINATOR" : "ACCESS"} • {msg.time}</span>
                                </div>
                              ))}
                               {isTyping && <div className="text-xs text-parchment-ivory/40 italic font-mono flex items-center gap-2"><span className="w-2 h-2 bg-gold-leaf rounded-full animate-bounce" />{lang === "fr" ? "Le conservateur interroge les coffres physiques..." : "Curator is querying physical vaults..."}</div>}
                            </div>
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                               <input type="text" placeholder={lang === "fr" ? "Demander au Coordinateur..." : "Ask Coordinator..."} value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-800 text-sm py-3 px-4 font-sans text-parchment-ivory placeholder-neutral-500 focus:outline-none focus:border-gold-leaf" />
                              <button type="submit" className="bg-gold-leaf hover:bg-gold-leaf/80 text-ebony-deep p-3 aspect-square flex items-center justify-center transition-colors"><Send className="w-4 h-4 stroke-[2]" /></button>
                            </form>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />

      {/* Package Detail Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ebony-deep/50 backdrop-blur-sm" onClick={() => setSelectedPackage(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 15 }} className="bg-parchment-ivory border border-on-surface/10 max-w-4xl w-full p-6 md:p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start border-b border-on-surface/15 pb-4 mb-6">
                 <div><span className="font-sans text-[10px] uppercase tracking-widest text-gold-leaf font-bold">{lang === "fr" ? "RAPPORT D'INTÉGRITÉ CONSEIL" : "ADVISORY INTEGRITY REPORT"}</span><h3 className="font-serif text-2xl md:text-3xl text-ebony-deep mt-1">{selectedPackage.title}</h3></div>
                <button onClick={() => setSelectedPackage(null)} className="font-sans text-lg hover:text-gold-leaf font-semibold border border-on-surface/10 px-3 py-1 bg-surface-container">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
                <div className="md:col-span-7 space-y-6">
                  <p className="font-serif text-base text-on-surface-variant leading-relaxed">{selectedPackage.description}</p>
                   <div><h4 className="font-sans text-xs uppercase tracking-widest text-gold-leaf font-bold mb-3">{lang === "fr" ? "Indicateurs Clés du Portefeuille" : "Portfolio Key Metrics"}</h4><div className="grid grid-cols-2 gap-4"><div className="bg-surface-container p-4"><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 font-sans block">{lang === "fr" ? "ACQUISITION TOTALE" : "TOTAL ACQUISITION"}</span><span className="font-serif text-xl font-bold text-ebony-deep">{selectedPackage.estimatedValue}</span></div><div className="bg-surface-container p-4"><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 font-sans block">{lang === "fr" ? "RENDEMENT COMPOSÉ" : "COMPOUND RETURN"}</span><span className="font-serif text-xl font-bold text-terracotta-earth">{selectedPackage.appreciationRate}</span></div></div></div>
                   <div><h4 className="font-sans text-xs uppercase tracking-widest text-gold-leaf font-bold mb-3">{lang === "fr" ? "Allocations Cibles" : "Target Allocations"}</h4><span className="font-serif text-on-surface block py-2 border-l-2 border-gold-leaf pl-4 bg-surface-container/30">{selectedPackage.allocation}</span></div>
                   <div><h4 className="font-sans text-xs uppercase tracking-widest text-gold-leaf font-bold mb-3">{lang === "fr" ? "Artefacts Inclus" : "Included Artifacts"}</h4><div className="space-y-3">{selectedPackage.artifacts.map((art) => <div key={art.id} onClick={() => setSelectedArtifact(art)} className="flex items-center gap-4 bg-surface-container hover:bg-surface-container-low p-3 transition-colors cursor-pointer border-l-4 border-terracotta-earth"><img src={art.imageUrl} referrerPolicy="no-referrer" className="w-12 h-12 object-cover" alt="" /><div className="flex-1"><span className="font-serif text-sm font-bold text-ebony-deep block">{art.title}</span><span className="text-[11px] text-on-surface-variant/50 font-sans">{art.period}</span></div><ChevronRight className="w-4 h-4 text-on-surface-variant/60" /></div>)}</div></div>
                </div>
                <div className="md:col-span-5 space-y-6">
                  <div className="bg-surface-container p-5 border border-on-surface/5">
                     <h4 className="font-sans text-[11px] uppercase tracking-wider text-ebony-deep font-bold mb-3 border-b border-on-surface/10 pb-2">{lang === "fr" ? "STOCKAGE FIDUCIAIRE SUISSE" : "SWISS TRUSTEE STORAGE"}</h4>
                     <p className="text-xs text-on-surface-variant/80 leading-relaxed mb-4">{lang === "fr" ? "Ce package est éligible à un stockage sécurisé continu selon la législation des freeports suisses." : "This package qualifies for continuous secure storage under Swiss freeport legislation."}</p>
                     <button onClick={() => { setSelectedPackage(null); formRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="bg-ebony-deep w-full py-3.5 text-parchment-ivory font-sans text-xs uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Demander une Consultation Portefeuille" : "Hold Portfolio Consultation"}</button>
                  </div>
                   <div className="bg-surface-container p-5 border border-on-surface/5"><h4 className="font-sans text-[11px] uppercase tracking-wider text-ebony-deep font-bold border-b border-on-surface/10 pb-2">{lang === "fr" ? "DIVULGATION RÉGLEMENTAIRE" : "REGULATORY DISCLOSURE"}</h4><p className="text-[11.5px] text-on-surface-variant/70 leading-relaxed">{lang === "fr" ? "Tous les artefacts sont examinés conformément à la Convention de l'UNESCO de 1970 sur les biens culturels." : "All artifacts are reviewed against the UNESCO 1970 Convention on cultural property."}</p></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Artifact Dossier Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-sm" onClick={() => setSelectedArtifact(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-parchment-ivory border border-on-surface/15 max-w-3xl w-full p-6 md:p-8 relative z-10 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-on-surface/10 pb-4 mb-6">
                 <div><span className="font-sans text-[10px] uppercase tracking-widest text-terracotta-earth font-bold">{lang === "fr" ? "DOSSIER DE GRADE MUSÉE" : "MUSEUM-GRADE DOSSIER"}</span><h3 className="font-serif text-2xl text-ebony-deep mt-1">{selectedArtifact.title}</h3></div>
                <button onClick={() => setSelectedArtifact(null)} className="font-sans text-lg hover:text-gold-leaf font-semibold border border-on-surface/10 px-3 py-1 bg-surface-container">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                 <div className="md:col-span-5"><img src={selectedArtifact.imageUrl} referrerPolicy="no-referrer" className="w-full aspect-square object-cover" alt="" /><div className="mt-3 text-xs text-on-surface-variant/50 font-sans flex justify-between font-bold"><span>{lang === "fr" ? "ACCESSION :" : "ACCESSION:"} {selectedArtifact.accessionNo}</span><span>EST: {selectedArtifact.estimatedValue}</span></div></div>
                 <div className="md:col-span-7 space-y-4 text-xs font-sans">
                   <div><span className="text-on-surface-variant/50 block uppercase font-bold text-[10px]">{lang === "fr" ? "Culture" : "Culture"}</span><span className="text-ebony-deep font-serif text-sm font-semibold">{selectedArtifact.origin}</span></div>
                   <div><span className="text-on-surface-variant/50 block uppercase font-bold text-[10px]">{lang === "fr" ? "Période" : "Period"}</span><span className="text-ebony-deep font-serif text-sm font-semibold">{selectedArtifact.period}</span></div>
                   <div><span className="text-on-surface-variant/50 block uppercase font-bold text-[10px]">{lang === "fr" ? "Matériau" : "Medium"}</span><span className="text-ebony-deep font-serif text-sm font-semibold">{selectedArtifact.medium}</span></div>
                   <div><span className="text-on-surface-variant/50 block uppercase font-bold text-[10px]">{lang === "fr" ? "Datation au Carbone" : "Carbon Dating"}</span><p className="text-on-surface-variant/80 leading-relaxed font-serif text-[12.5px] mt-1 bg-surface-container/40 p-2 border-l border-gold-leaf">{selectedArtifact.carbonDatingDetails}</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <div><h4 className="font-sans text-xs uppercase tracking-widest text-terracotta-earth font-bold mb-2">{lang === "fr" ? "Pedigree de Provenance" : "Provenance Pedigree"}</h4><div className="space-y-1.5 font-sans text-xs">{selectedArtifact.provenance.map((prov, i) => <div key={i} className="py-1 border-b border-on-surface/5 text-on-surface-variant/80 pl-3 border-l-2 border-gold-leaf bg-surface-container/20">{prov}</div>)}</div></div>
                <div><h4 className="font-sans text-xs uppercase tracking-widest text-terracotta-earth font-bold mb-2">{lang === "fr" ? "Archives d'Exposition" : "Exhibition Archive"}</h4><div className="space-y-1 text-xs text-on-surface-variant/70">{selectedArtifact.exhibitions.map((ex, i) => <div key={i} className="flex gap-2 items-center"><BookOpen className="w-3.5 h-3.5 text-gold-leaf" /><span>{ex}</span></div>)}</div></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}