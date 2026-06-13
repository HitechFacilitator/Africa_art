"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Microscope,
  Users,
  Cpu,
  Play,
  ShieldCheck,
  X,
  Gavel,
  CheckCircle2,
  Terminal,
  AlertTriangle,
  ArrowRight,
  Landmark,
  Network,
  Send,
  Award,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslate } from "@/lib/translations";

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

interface TimelineEvent {
  year: string;
  location: string;
  title: string;
  description: string;
  evidenceType: "Archive" | "Auction" | "Exhibition" | "C14-Dating" | "Custody";
  verifierName: string;
  verifierCredentials: string;
  scientificData?: {
    testMethod?: string;
    resultValue?: string;
    marginOfError?: string;
    labFacility?: string;
    signatureHash?: string;
  };
}

interface ProvenanceArtifact {
  id: string;
  name: string;
  origin: string;
  medium: string;
  dimensions: string;
  imageUrl: string;
  description: string;
  culture: string;
  approximateAge: string;
  caseStudyTitle: string;
  timeline: TimelineEvent[];
  blockHash: string;
  mintDate: string;
}

interface LedgerBlock {
  blockHeight: number;
  timestamp: string;
  transactionHash: string;
  prevHash: string;
  artifactName: string;
  action: string;
}

const MASTERPIECES: ProvenanceArtifact[] = [
  {
    id: "ADUNA-OWO-1897",
    name: "The Owo Ivory Mask",
    origin: "Owo Region, Forest Kingdom of Benin",
    medium: "Sustainably Altered Ancient Ivory with Inlaid Brass",
    dimensions: "24.5 x 12.8 x 6.2 cm",
    culture: "Yoruba/Benin Cursive School",
    approximateAge: "Circa 1897 / late 19th Century",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxXjJxrO3g4Bz52wXjwD-Su6ejlw-pC_QrYV5ev4CPbLps0j1ZpLHOhGQFmB32GLnW6HTeaW9riVbK48vPBMr5aueayZohQblL3FehtnP-WWr59Mr3NLmrVSXFhvfjx-WGwTxjmhPq97z8peSF2lDKC0p_T-2vK3rUXGsVeffQsQkrYp_mvjKAT--jAbFLUHBvsp4TmVnKFiUoR7KEk9dFX_T_WQ17yD13WoQf-uzb3VS8u5Fk1RBVy9ZiY8HwdnsPxJJb10J9fg",
    description: "An incredibly rare sovereign ivory mask carved with delicate stylistic registers, representing royal lineage and royal custody.",
    caseStudyTitle: "CASE STUDY: THE OWO IVORY MASK",
    blockHash: "0x8fae3199cb14c478a02bd9ec21fae32230fae3b080b4b2fb39da369e12bf39d1",
    mintDate: "2024-04-12 UTC",
    timeline: [
      { year: "CIRCA 1897", location: "Kingdom of Benin", title: "Royal Commissioning", description: "Original commissioning and ceremonial use under royal decree. Documented directly in the Owo ancestral palace archives.", evidenceType: "Archive", verifierName: "Dr. Adebayo Olamina", verifierCredentials: "Chief Historian, Benin Royal Heritage Society", scientificData: { testMethod: "Aqueous Acid Solvent Spot Analysis & UV Fluorescent Imaging", resultValue: "Palace storage chemical footprint matching original 1890s organic compounds.", labFacility: "Lagos Cultural Chemistry Laboratory", signatureHash: "0xa21d...93ef" } },
      { year: "1932", location: "Private Collection, London", title: "Sir John Harrington Acquisition", description: "Acquired by noted British diplomat Sir John Harrington. Auction lists verified via Sotheby's heritage database.", evidenceType: "Auction", verifierName: "Lady Beatrice Fox", verifierCredentials: "Senior Provenance Director, Sotheby's Archives London", scientificData: { testMethod: "Catalog Deep Paper Forensic Ink Matrix Matching", resultValue: "Confirmed printed catalogue registry entry No. 2931-A dated September 1932.", labFacility: "Sotheby's Paper Conservation Department", signatureHash: "0x78fe...32db" } },
      { year: "1985 - 2020", location: "Musée d'Ethnographie, Geneva", title: "Long-Term Exhibition & Academic Review", description: "Exhibited on long-term loan to the Geneva Museum. Extensive material testing conducted.", evidenceType: "Exhibition", verifierName: "Prof. Jean-Marc Dupris", verifierCredentials: "Department Head of Non-Western Antiquities, Université de Genève", scientificData: { testMethod: "Accelerator Mass Spectrometry (AMS) Radiocarbon Dating", resultValue: "Dating of organic matter yields a 95.4% probability range of 1885 - 1902 AD.", labFacility: "Zurich Physics Chronology Institute", signatureHash: "0x3bc1...e584" } },
      { year: "PRESENT", location: "Aduna Vault, Geneva", title: "Secured for Private Acquisition", description: "Full digital ledger validation protocol conducted and immutable certificate minted.", evidenceType: "Custody", verifierName: "Amara Ndiaye", verifierCredentials: "Chief Curator & Co-Founder, Aduna Gallery", scientificData: { testMethod: "Frictionless Optical Laser Mapping & Micro-structure Fingerprinting", resultValue: "Full 3D physical coordinate blueprint registered on blockchain ledger registry.", labFacility: "Aduna Technical Vault facility, Geneva", signatureHash: "0x4ca2...001a" } },
    ],
  },
  {
    id: "ADUNA-SEN-1920",
    name: "The Senufo Rhythm Pounder",
    origin: "Korhogo Region, northern Côte d'Ivoire",
    medium: "Hand-Carved Sacred Hardwood with Kaolin Pigments",
    dimensions: "104.0 x 22.0 x 18.5 cm",
    culture: "Senufo Traditional Guilds",
    approximateAge: "Circa 1920",
    imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800",
    description: "A monumental rhythm pounder used during Senufo agricultural and funeral rites.",
    caseStudyTitle: "CASE STUDY: THE SENUFO RHYTHM POUNDER",
    blockHash: "0x4fe193ab6cd19920efbc09ab93ee7242baedd81f2be88dd39f88a911e2cd33a2",
    mintDate: "2024-05-18 UTC",
    timeline: [
      { year: "CIRCA 1920", location: "Korhogo Village Council", title: "Sacred Ceremonial Use", description: "Carved by celebrated Senufo artisan Kolo Silué for village initiations.", evidenceType: "Archive", verifierName: "Kassoum Coulibaly", verifierCredentials: "Director, Korhogo Cultural Elder Council", scientificData: { testMethod: "Phytochem-Dendrologist Micro-invasive Analysis", resultValue: "Organic cell sap matches indigenous slow-growth hardwood native only to Northern Côte d'Ivoire.", labFacility: "Abidjan Science Institute of Forestry", signatureHash: "0x12b4...34df" } },
      { year: "1954", location: "Galerie Carrefour, Paris", title: "European Acquisition Program", description: "Acquired by French modernists collector Paul Guillaume-Vignes on an expedition.", evidenceType: "Auction", verifierName: "Dr. Maurice Clémente", verifierCredentials: "Lead Scholar of African Relics, Paris Historical Syndicate", scientificData: { testMethod: "Acid-free Adhesive Catalyst Dating & Ledger Verification", resultValue: "Exhibited in 'Art Negre' exposition Catalogue, Docket No. 49, February 1954.", labFacility: "Paris Conservation Registry", signatureHash: "0x89fd...ee23" } },
      { year: "2001", location: "The Met Museum, New York", title: "New York Met Exhibition", description: "Featured on special selection for the Modernism and Tribal Roots Exhibition.", evidenceType: "Exhibition", verifierName: "Dr. Helen Rostova", verifierCredentials: "Guest Curator for African Arts, Metropolitan Museology Group", scientificData: { testMethod: "X-Ray Computed Tomography (CT) Scanning", resultValue: "Scan demonstrates completely continuous internal wood ring density.", labFacility: "Met Advanced Radiography Core", signatureHash: "0xdef1...99bc" } },
      { year: "PRESENT", location: "Aduna Vault, Geneva", title: "Encapsulated Token Minting", description: "Digital ownership certificate minted on energy-efficient ledger.", evidenceType: "Custody", verifierName: "Amara Ndiaye", verifierCredentials: "Chief Curator, Aduna Gallery", scientificData: { testMethod: "High-Frequency Acoustic Micro-spectrometry", resultValue: "Unique solid micro-cavity audio resonance fingerprint recorded as immutable verification key.", labFacility: "Aduna Acoustic Testing Site", signatureHash: "0x3e42...09fd" } },
    ],
  },
  {
    id: "ADUNA-CHO-1945",
    name: "The Chokwe Pwo Mask",
    origin: "Moxico Province, Eastern Angola",
    medium: "Inlaid Redwood with Woven Raffia Coiffure & Glass Beads",
    dimensions: "32.0 x 20.0 x 14.5 cm",
    culture: "Chokwe Sovereignty School",
    approximateAge: "Circa 1945",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    description: "An elegant female ancestor mask symbolizing critical fertility, lineage wisdom, and refined grace.",
    caseStudyTitle: "CASE STUDY: THE CHOKWE PWO MASK",
    blockHash: "0xbc1a7248baedd81f2be88dd39f88a911e2cd33a2fe8899a112df312bf39d10e",
    mintDate: "2024-03-30 UTC",
    timeline: [
      { year: "CIRCA 1945", location: "Saurimo Region, Angola", title: "Creation and Initiatory Dancing", description: "Crafted by master carver Muata Mwene for transitional youth maturity pageants.", evidenceType: "Archive", verifierName: "Elder Joao Tchinde", verifierCredentials: "Director, Angola Regional History Repository", scientificData: { testMethod: "Raffia Fiber Carbon-14 Decay Reading", resultValue: "Organic plant fiber shows decay profile aligning with harvesting year 1941 - 1948 AD.", labFacility: "Luanda Nuclear Physics Lab", signatureHash: "0x98ab...12fe" } },
      { year: "1972", location: "Lisbon Private Salon", title: "Colonial Portuguese Registry", description: "Exported under diplomatic registration during Angola's transitional era.", evidenceType: "Auction", verifierName: "Prof. Manuel de Sousa", verifierCredentials: "Department Chair of Iberian Heritage Antiquities", scientificData: { testMethod: "Spectrophotometric Paint Pigment Matrix Scan", resultValue: "Redwood oil pigment contains standard mid-century kaolin organic binder compounds.", labFacility: "Lisbon Materials Laboratory", signatureHash: "0x56cd...78ab" } },
      { year: "PRESENT", location: "Aduna Vault, Geneva", title: "Consigned to Aduna Gallery", description: "Secured from a private European estate. Tokenized and sealed in Aduna Vault.", evidenceType: "Custody", verifierName: "Amara Ndiaye", verifierCredentials: "Chief Curator, Aduna Gallery", scientificData: { testMethod: "Opti-Scanned Laser Core Alignment", resultValue: "Fitted with encrypted near-field ledger identity parameters.", labFacility: "Aduna Technical Vault facility, Geneva", signatureHash: "0x78ef...1a2c" } },
    ],
  },
];

const GENERAL_LEDGER_HISTORY: LedgerBlock[] = [
  { blockHeight: 89412, timestamp: "2026-06-08 22:15:30 UTC", transactionHash: "0x8fae3199cb14c478a02bd9ec21fae32230fae3b080b4b2fb39da369e12bf39d1", prevHash: "0x7fd28a6fde90cce183a2bd9ec44fae32230ffe3e080b4b2fb39da369e12128aa", artifactName: "The Owo Ivory Mask", action: "OWNERSHIP_ANCHORED_IN_LEDGER" },
  { blockHeight: 89395, timestamp: "2026-06-08 19:42:11 UTC", transactionHash: "0x4fe193ab6cd19920efbc09ab93ee7242baedd81f2be88dd39f88a911e2cd33a2", prevHash: "0x5ea1914eb1362e49c12b9ea89ae322caefbd8ccbc2e48cd39df8ecaa12fedff4", artifactName: "The Senufo Rhythm Pounder", action: "C14_DATING_EVIDENCE_MAPPED" },
  { blockHeight: 89281, timestamp: "2026-06-08 08:30:45 UTC", transactionHash: "0xbc1a7248baedd81f2be88dd39f88a911e2cd33a2fe8899a112df312bf39d10e", prevHash: "0x12ab00c3cd543bf0fe73bc93ee7242baedd81f2be88dd39f88a911e2cd3344ef", artifactName: "The Chokwe Pwo Mask", action: "CUSTODY_INITIALIZED_Aduna_GENEVA" },
];

export default function ProvenancePage() {
  // Protocol Grid state
  const [activeSimulation, setActiveSimulation] = useState<"scientific" | "peer" | "ai" | null>(null);
  const [c14Age, setC14Age] = useState(130);
  const [activeReviewer, setActiveReviewer] = useState(0);
  const [matchingProgress, setMatchingProgress] = useState<number | null>(null);

  // Provenance Tracking state
  const [selectedArtifactId, setSelectedArtifactId] = useState("ADUNA-OWO-1897");
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

  // Compliance state
  const [ledgerInputValue, setLedgerInputValue] = useState("");
  const [verifyingBlock, setVerifyingBlock] = useState<LedgerBlock | null>(null);
  const [verificationError, setVerificationError] = useState("");
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);

  const { lang } = useTranslate();

  // Certificate modal state
  const [showCertificate, setShowCertificate] = useState(false);

  // Inquiry modal state
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ fullName: "", email: "", organization: "", collectorLevel: "Novice", interestReason: "", artifactSelection: "ADUNA-OWO-1897" });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [generatedPassHash, setGeneratedPassHash] = useState("");

  const currentArtifact = MASTERPIECES.find((a) => a.id === selectedArtifactId) || MASTERPIECES[0];

  const startAiMatching = () => {
    setMatchingProgress(0);
    const interval = setInterval(() => {
      setMatchingProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 10;
      });
    }, 150);
  };

  const handleVerifyLedger = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    setVerifyingBlock(null);
    setIsLoadingLedger(true);
    const matchKey = ledgerInputValue.trim().toUpperCase();
    setTimeout(() => {
      setIsLoadingLedger(false);
      if (matchKey.includes("OWO") || matchKey.includes("ADUNA-OWO")) {
        setVerifyingBlock(GENERAL_LEDGER_HISTORY[0]);
      } else if (matchKey.includes("SEN") || matchKey.includes("ADUNA-SEN")) {
        setVerifyingBlock(GENERAL_LEDGER_HISTORY[1]);
      } else if (matchKey.includes("CHO") || matchKey.includes("ADUNA-CHO")) {
        setVerifyingBlock(GENERAL_LEDGER_HISTORY[2]);
      } else {
        const hashMatch = GENERAL_LEDGER_HISTORY.find(b => b.transactionHash.toUpperCase().includes(matchKey) || b.prevHash.toUpperCase().includes(matchKey));
        if (hashMatch) { setVerifyingBlock(hashMatch); } else { setVerificationError(`Hash or identifier "${ledgerInputValue}" not found. Use 'ADUNA-OWO', 'ADUNA-SEN', or 'ADUNA-CHO'.`); }
      }
    }, 800);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    setTimeout(() => {
      const hexChars = "0123456789abcdef";
      let mockHash = "0x";
      for (let i = 0; i < 40; i++) { mockHash += hexChars[Math.floor(Math.random() * 16)]; }
      setGeneratedPassHash(mockHash);
      setIsSubmittingInquiry(false);
      setInquirySuccess(true);
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-12 md:py-24">
          {/* Hero Header */}
          <header className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
            <h1 className="font-display-xl text-ebony-deep mb-6">{lang === "fr" ? "Provenance &amp; Authentification" : "Provenance &amp; Authenticity"}</h1>
            <p className="font-sans text-lg leading-relaxed text-on-surface-variant max-w-2xl mx-auto">
              {lang === "fr" ? "Établir la confiance institutionnelle grâce à une vérification rigoureuse, à la conformité juridique et à un engagement inébranlable envers la préservation éthique du patrimoine africain." : "Establishing institutional trust through rigorous verification, legal compliance, and an unwavering commitment to the ethical preservation of African heritage."}
            </p>
          </header>

          {/* 1. Authenticity Protocol */}
          <section className="mb-24">
            <div className="flex items-center space-x-4 mb-10">
              <span className="w-12 h-[1px] bg-on-surface/20" />
              <h2 className="font-serif text-3xl text-ebony-deep font-light">{lang === "fr" ? "Notre Protocole d'Authenticité" : "Our Authenticity Protocol"}</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Microscope, title: lang === "fr" ? "I. Analyse Scientifique" : "I. Scientific Analysis", desc: lang === "fr" ? "Utilisation d'essais non destructifs des matériaux, y compris le datation au carbone-14 et la thermoluminescence, pour établir l'âge empirique et l'origine." : "Utilizing non-destructive material testing, including Carbon-14 dating and thermoluminescence, to establish empirical baseline age and origin.", action: lang === "fr" ? "Simuler le Laboratoire de Radiocarbone" : "Simulate Radiocarbon Lab", sim: "scientific" as const },
                { icon: Users, title: lang === "fr" ? "II. Évaluation par les Pairs" : "II. Peer Review", desc: lang === "fr" ? "Chaque pièce est évaluée par notre réseau de conservateurs indépendants, d'ethnographes et d'universitaires institutionnels." : "Each piece is subject to evaluation by our network of independent curators, ethnographers, and institutional academics.", action: lang === "fr" ? "Convoquer le Conseil" : "Convene Board", sim: "peer" as const },
                { icon: Cpu, title: lang === "fr" ? "III. Appariement Algorithmique" : "III. Algorithmic Matching", desc: lang === "fr" ? "Notre IA propriétaire croise les techniques de sculpture, les motifs de patine et les marqueurs stylistiques avec des bases de données institutionnelles mondiales." : "Proprietary AI cross-references carving techniques, patina patterns, and stylistic markers against global institutional databases.", action: lang === "fr" ? "Lancer la Recherche du Réseau Neural" : "Run Neural Registry Search", sim: "ai" as const },
              ].map((card) => (
                <motion.div key={card.sim} variants={fadeUp} onClick={() => setActiveSimulation(card.sim)} className="group bg-parchment-ivory p-8 border border-on-surface/5 flex flex-col h-full cursor-pointer shadow-level-2 hover:shadow-hover-lift hover:border-gold-leaf/20 transition-all duration-300">
                  <div className="mb-6 text-gold-leaf group-hover:scale-105 transition-transform duration-300"><card.icon size={32} strokeWidth={1.5} /></div>
                  <h3 className="font-serif text-2xl text-ebony-deep mb-4 font-normal">{card.title}</h3>
                  <p className="font-sans text-[15px] leading-relaxed text-on-surface-variant flex-grow">{card.desc}</p>
                  <div className="mt-8 pt-4 border-t border-on-surface/5 flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-gold-leaf group-hover:text-ebony-deep transition-colors">
                    <span>{card.action}</span>
                    <span className="font-serif text-lg leading-none">&rarr;</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Simulation Overlays */}
            <AnimatePresence>
              {activeSimulation !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-deep/60 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="bg-background border-t-4 border-gold-leaf p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                    <button onClick={() => { setActiveSimulation(null); setMatchingProgress(null); }} className="absolute top-4 right-4 text-on-surface hover:text-gold-leaf transition-colors"><X size={20} /></button>

                    {activeSimulation === "scientific" && (
                      <div className="space-y-6 text-left">
                        <div className="flex items-center space-x-3 mb-2"><Microscope className="text-gold-leaf" size={24} /><h4 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Simulateur Scientifique Carbone-14 et TL" : "Scientific Carbon-14 and TL Simulator"}</h4></div>
                        <p className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Simulez la décomposition directe de la demi-vie organique. Ajustez l'âge hypothétique ci-dessous." : "Simulate direct organic half-life decomposition decay. Adjust hypothetical age below."}</p>
                        <div className="bg-surface-container-low p-5 space-y-4 border border-on-surface/5">
                          <div className="flex justify-between items-center text-xs font-semibold tracking-wider uppercase text-on-surface-variant">
                            <span>{lang === "fr" ? "Âge Hypothétique Cible" : "Target Hypothesis Age"}</span>
                            <span className="font-mono text-ebony-deep text-sm">{c14Age} {lang === "fr" ? "Ans" : "Years Old"}</span>
                          </div>
                          <input type="range" min="10" max="600" value={c14Age} onChange={(e) => setC14Age(Number(e.target.value))} className="w-full accent-gold-leaf h-1.5 bg-surface-dim appearance-none cursor-pointer" />
                          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-on-surface/10">
                            <div><span className="block text-[10px] uppercase text-on-surface-variant tracking-wider">Remaining C-14 Isotope</span><span className="block font-mono text-lg font-bold text-ebony-deep">{(Math.exp(-c14Age * 0.00012097) * 100).toFixed(2)} %</span></div>
                            <div><span className="block text-[10px] uppercase text-on-surface-variant tracking-wider">TL Radiation Luminescence</span><span className="block font-mono text-lg font-bold text-ebony-deep">{(c14Age * 14.2).toFixed(1)} mRad Peak</span></div>
                          </div>
                        </div>
                        <div className="text-xs text-on-surface-variant bg-parchment-ivory p-4 border-l border-terracotta-earth font-mono">
                          <span className="block font-sans font-semibold text-ebony-deep uppercase mb-1">Dating Assessment Signature</span>
                          [ZURICH PHYS-CORE] Decays perfectly align. Estimated fabrication epoch is circa {2026 - c14Age} AD. Confidence range: 97.2%.
                        </div>
                      </div>
                    )}

                    {activeSimulation === "peer" && (
                      <div className="space-y-6 text-left">
                        <div className="flex items-center space-x-3 mb-2"><Users className="text-gold-leaf" size={24} /><h4 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Chambre Conseil d'Évaluation par les Pairs" : "Peer Review Advisory Chamber"}</h4></div>
                        <p className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Examinez les listes d'évaluation soumises par des spécialistes régionaux éminents." : "Review evaluation rosters submitted by preeminent regional specialists."}</p>
                        <div className="flex border-b border-on-surface/10 font-sans text-xs">
                          {[{ name: "Dr. Olamina", role: "Histology" }, { name: "Prof. Dupris", role: "Ethnology" }, { name: "Amara Ndiaye", role: "Conservation" }].map((curator, idx) => (
                            <button key={idx} onClick={() => setActiveReviewer(idx)} className={`px-4 py-2 border-b-2 font-medium tracking-wide ${activeReviewer === idx ? "border-gold-leaf text-ebony-deep" : "border-transparent text-on-surface-variant/70 hover:text-ebony-deep"}`}>{curator.name} ({curator.role})</button>
                          ))}
                        </div>
                        {activeReviewer === 0 && <div className="p-4 bg-parchment-ivory border border-on-surface/5 space-y-3"><h5 className="font-serif text-lg text-ebony-deep">Dr. Adebayo Olamina</h5><span className="inline-block text-[10px] uppercase tracking-wider bg-gold-leaf/10 text-[#785a1a] px-2 py-0.5 font-bold">Benin Royal Heritage Society</span><p className="font-sans text-sm text-on-surface-variant leading-relaxed">&quot;Chemical pigment matches show standard high-purity natural organic resins utilized by late-nineteenth-century master carvers. I seal my digital consensus.&quot;</p></div>}
                        {activeReviewer === 1 && <div className="p-4 bg-parchment-ivory border border-on-surface/5 space-y-3"><h5 className="font-serif text-lg text-ebony-deep">Prof. Jean-Marc Dupris</h5><span className="inline-block text-[10px] uppercase tracking-wider bg-gold-leaf/10 text-[#785a1a] px-2 py-0.5 font-bold">Université de Genève</span><p className="font-sans text-sm text-on-surface-variant leading-relaxed">&quot;Having inspected cataloged entries from the 1932 Harrington bequest, the micro-carvings confirm genuine pre-expatriation origin.&quot;</p></div>}
                        {activeReviewer === 2 && <div className="p-4 bg-parchment-ivory border border-on-surface/5 space-y-3"><h5 className="font-serif text-lg text-ebony-deep">Amara Ndiaye</h5><span className="inline-block text-[10px] uppercase tracking-wider bg-gold-leaf/10 text-[#785a1a] px-2 py-0.5 font-bold">Aduna Gallery Lead</span><p className="font-sans text-sm text-on-surface-variant leading-relaxed">&quot;We have cross-referenced and resolved all physical checkpoints. This piece has passed ALM clearance indices.&quot;</p></div>}
                        <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold uppercase"><ShieldCheck size={16} /><span>3/3 CURATOR CONSENSUS SEALED</span></div>
                      </div>
                    )}

                    {activeSimulation === "ai" && (
                      <div className="space-y-6 text-left">
                        <div className="flex items-center space-x-3 mb-2"><Cpu className="text-gold-leaf" size={24} /><h4 className="font-serif text-2xl text-ebony-deep">{lang === "fr" ? "Compareur d'Empreintes Digitales IA" : "AI Custom Fingerprint Matcher"}</h4></div>
                        <p className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Lancez notre analyse convolutionnelle propriétaire sur les rainures de sculpture régionales et les coordonnées structurelles volumétriques." : "Launch our proprietary convolutional analysis on regional carving grooves and volumetric structure coordinates."}</p>
                        <div className="bg-ebony-deep text-parchment-ivory p-5 font-mono text-xs min-h-[160px] flex flex-col justify-between">
                          <div>
                            {matchingProgress === null && <div className="text-parchment-ivory/60">&gt; Systems Idle. Ready to scan global institutional databases.</div>}
                            {matchingProgress !== null && matchingProgress < 100 && <div className="space-y-2"><div className="text-gold-leaf animate-pulse">&gt; ANALYZING LINEAGE BLUEPRINTS...</div><div>&gt; Mapping 3D coordinate mesh: {matchingProgress}%</div><div className="h-1 bg-parchment-ivory/10 w-full"><div className="h-full bg-gold-leaf transition-all duration-150" style={{ width: `${matchingProgress}%` }} /></div></div>}
                            {matchingProgress === 100 && <div className="space-y-2"><div className="text-emerald-400 font-bold">&gt; LINEAGE RECONSTRUCTION COMPLETE.</div><div className="text-parchment-ivory/80">&gt; Match found: Yoruba/Owo Royal Guild Master Carver</div><div className="text-parchment-ivory/70">&gt; Volumetric consistency match: 99.4%</div></div>}
                          </div>
                          {matchingProgress === null && <button onClick={startAiMatching} className="self-start mt-4 flex items-center space-x-2 bg-gold-leaf text-ebony-deep font-sans font-bold uppercase tracking-wider text-[10px] px-4 py-2 hover:bg-gold-leaf/90 transition-colors"><Play size={10} fill="currentColor" /><span>Run Network Analysis</span></button>}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 pt-4 border-t border-on-surface/10 flex justify-end">
                      <button onClick={() => { setActiveSimulation(null); setMatchingProgress(null); }} className="bg-ebony-deep text-parchment-ivory px-5 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Fermer le Laboratoire" : "Close Laboratory"}</button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </section>

          {/* 2. Provenance Tracking */}
          <section className="mb-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-on-surface/10 pb-6 mb-12 gap-4">
              <div>
                <h2 className="font-serif text-3xl text-ebony-deep font-light mb-1">{lang === "fr" ? "Traçabilité de la Provenance" : "Provenance Tracking"}</h2>
                <p className="font-sans text-xs text-on-surface-variant">{lang === "fr" ? "Explorez les dossiers vérifiés. Sélectionnez une œuvre ci-dessous pour reconstituer son historique." : "Explore verified dossiers. Select a masterwork below to reconstruct its historic timeline."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {MASTERPIECES.map((art) => (
                  <button key={art.id} onClick={() => { setSelectedArtifactId(art.id); setSelectedEventIndex(null); }} className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition-all ${selectedArtifactId === art.id ? "bg-ebony-deep text-parchment-ivory border-ebony-deep" : "bg-transparent text-on-surface-variant/80 border-on-surface/10 hover:border-gold-leaf/40 hover:text-ebony-deep"}`}>
                    {art.name.replace("The ", "")}
                  </button>
                ))}
              </div>
            </div>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-6 space-y-8">
                <p className="font-sans text-lg leading-relaxed text-on-surface-variant">{lang === "fr" ? "Une chaîne de garde documentée est primordiale. Nous reconstituons le parcours historique de chaque artifact." : "A documented chain of custody is paramount. We reconstruct the historical journey of every artifact."}</p>
                <div className="bg-parchment-ivory p-6 md:p-8 border-l-4 border-terracotta-earth shadow-level-2">
                  <h4 className="font-sans text-[12px] font-semibold text-ebony-deep tracking-[0.1em] uppercase mb-8">{currentArtifact.caseStudyTitle}</h4>
                  <div className="relative pl-2">
                    <div className="absolute left-[13px] top-[14px] bottom-[14px] w-[1px] bg-ebony-deep/10" />
                    <div className="space-y-8">
                      {currentArtifact.timeline.map((event, idx) => {
                        const isLast = idx === currentArtifact.timeline.length - 1;
                        const isFirst = idx === 0;
                        const isSelected = selectedEventIndex === idx;
                        return (
                          <div key={idx} onClick={() => setSelectedEventIndex(isSelected ? null : idx)} className="group relative pl-8 cursor-pointer select-none">
                            <div className={`absolute left-[-2px] top-1.5 w-6 h-6 rounded-full border-2 bg-parchment-ivory flex items-center justify-center z-10 transition-all ${isFirst ? "border-ebony-deep text-ebony-deep" : isLast ? "border-gold-leaf text-gold-leaf" : "border-on-surface/20 group-hover:border-gold-leaf"}`}>
                              {isFirst || isLast ? <div className={`w-2.5 h-2.5 rounded-full ${isFirst ? "bg-ebony-deep" : "bg-gold-leaf"}`} /> : <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/40 group-hover:bg-gold-leaf transition-colors" />}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className={`font-sans text-[11px] font-bold tracking-[0.1em] uppercase ${isLast || isFirst ? "text-gold-leaf" : "text-on-surface-variant/70"}`}>{event.year}</span>
                                <span className="text-[10px] uppercase font-mono tracking-wider text-on-surface-variant/30 group-hover:text-gold-leaf transition-colors">{isSelected ? (lang === "fr" ? "[Réduire Doc]" : "[Collapse Doc]") : (lang === "fr" ? "[Voir Vérification]" : "[View Verification]")}</span>
                              </div>
                              <h5 className="font-sans text-md font-semibold text-ebony-deep group-hover:text-gold-leaf transition-colors">{event.location}</h5>
                              <p className="font-sans text-sm text-on-surface-variant/90 leading-relaxed max-w-md">{event.description}</p>
                            </div>
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden mt-3" onClick={(e) => e.stopPropagation()}>
                                  <div className="bg-background/60 p-4 border border-on-surface/5 font-mono text-xs text-on-surface-variant space-y-3 mt-1 leading-relaxed">
                                    <div className="flex items-center space-x-2 text-ebony-deep border-b border-on-surface/10 pb-2"><GraduationCap size={14} className="text-gold-leaf" /><span className="font-sans font-bold uppercase tracking-wider text-[10px]">{lang === "fr" ? "Sceau du Certificat de Registre" : "Registry Certificate Seal"}</span></div>
                                    <div><span className="block font-sans font-semibold text-ebony-deep text-[11px]">{lang === "fr" ? "EXPERT VÉRIFICATEUR" : "VERIFYING EXPERT"}</span><span className="text-ebony-deep">{event.verifierName}</span><span className="block italic text-[11px] text-on-surface-variant/70">{event.verifierCredentials}</span></div>
                                    {event.scientificData && (
                                      <div className="pt-2 border-t border-on-surface/5 space-y-1">
                                        <div className="flex items-center space-x-1 font-sans font-semibold text-ebony-deep text-[10px] uppercase"><Microscope size={12} className="text-gold-leaf" /><span>{lang === "fr" ? "DONNÉES DU PROTOCOLE FORENSIQUE" : "FORENSIC PROTOCOL LAB DATA"}</span></div>
                                        <div><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 block">Laboratory Facility:</span><span>{event.scientificData.labFacility}</span></div>
                                        <div><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 block">Analytical Testing:</span><span>{event.scientificData.testMethod}</span></div>
                                        <div><span className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 block">Result:</span><span className="text-ebony-deep leading-snug block mt-0.5">{event.scientificData.resultValue}</span></div>
                                        <div className="flex justify-between items-center text-[10px] pt-1.5 text-emerald-700"><span className="flex items-center space-x-1"><ShieldCheck size={12} /><span>{lang === "fr" ? "ID DE CONSENSUS COGNITIF VALIDE" : "VALID COGNITIVE CONSENSUS ID"}</span></span><span className="font-mono">{event.scientificData.signatureHash}</span></div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div className="bg-parchment-ivory border border-on-surface/5 shadow-level-2 overflow-hidden select-none">
                  <div className="aspect-[4/5] w-full relative">
                    <img src={currentArtifact.imageUrl} alt={currentArtifact.name} referrerPolicy="no-referrer" className="object-cover w-full h-full grayscale-[15%] sepia-[5%] transition-all duration-700 hover:scale-[1.02] hover:grayscale-0" />
                    <div className="absolute top-4 left-4 bg-ebony-deep/95 text-parchment-ivory px-4 py-2 font-mono text-[10px] tracking-widest uppercase">{currentArtifact.approximateAge}</div>
                  </div>
                  <div className="p-8 border-t border-on-surface/5 space-y-4">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-serif text-2xl text-ebony-deep font-semibold leading-tight">{currentArtifact.name}</h3>
                      <span className="font-mono text-xs text-gold-leaf tracking-wider shrink-0">{currentArtifact.id}</span>
                    </div>
                    <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{currentArtifact.description}</p>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs border-t border-on-surface/10 pt-4 font-sans">
                      <div><span className="block text-[10px] uppercase text-on-surface-variant/60 tracking-wider">Origin</span><span className="font-semibold text-ebony-deep">{currentArtifact.origin}</span></div>
                      <div><span className="block text-[10px] uppercase text-on-surface-variant/60 tracking-wider">Culture Guild</span><span className="font-semibold text-ebony-deep">{currentArtifact.culture}</span></div>
                      <div><span className="block text-[10px] uppercase text-on-surface-variant/60 tracking-wider">Medium</span><span className="font-semibold text-ebony-deep">{currentArtifact.medium}</span></div>
                      <div><span className="block text-[10px] uppercase text-on-surface-variant/60 tracking-wider">Dimensions</span><span className="font-semibold text-ebony-deep">{currentArtifact.dimensions}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* 3. Legal Compliance & Digital Ownership */}
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-ebony-deep text-parchment-ivory p-8 md:p-12 flex flex-col justify-between shadow-level-2">
              <div>
                <div className="text-gold-leaf mb-6"><Gavel size={40} strokeWidth={1.5} /></div>
                <h2 className="font-serif text-3xl font-light text-parchment-ivory mb-6">{lang === "fr" ? "Conformité Juridique" : "Legal Compliance"}</h2>
                <p className="font-sans text-sm md:text-base text-parchment-ivory/80 leading-relaxed mb-8">{lang === "fr" ? "La Galerie Aduna opère en stricte conformité avec les lois internationales sur le patrimoine culturel. Nous appliquons une politique de tolérance zéro pour les antiquités négociées illicitement." : "Aduna Gallery operates in strict accordance with international cultural heritage laws. We enforce a zero-tolerance policy for illicitly traded antiquities."}</p>
                <ul className="space-y-6 font-sans text-sm text-parchment-ivory/80">
                  <li className="flex items-start"><CheckCircle2 size={18} className="text-gold-leaf shrink-0 mr-4 mt-1" /><span>{lang === "fr" ? "Pleine conformité avec la " : "Full compliance with the "}<strong className="text-parchment-ivory font-semibold">{lang === "fr" ? "Convention de l'UNESCO de 1970" : "UNESCO 1970 Convention"}</strong>{lang === "fr" ? " sur les moyens d'interdire et de prévenir l'importation, l'exportation et le transfert illicites de biens culturels." : " on the Means of Prohibiting and Preventing the Illicit Import, Export and Transfer of Ownership of Cultural Property."}</span></li>
                  <li className="flex items-start"><CheckCircle2 size={18} className="text-gold-leaf shrink-0 mr-4 mt-1" /><span>{lang === "fr" ? "Respect de la " : "Adherence to the "}<strong className="text-parchment-ivory font-semibold">{lang === "fr" ? "Convention d'UNIDROIT" : "UNIDROIT Convention"}</strong>{lang === "fr" ? " sur les objets culturels volés ou exportés illégalement." : " on Stolen or Illegally Exported Cultural Objects."}</span></li>
                  <li className="flex items-start"><CheckCircle2 size={18} className="text-gold-leaf shrink-0 mr-4 mt-1" /><span>{lang === "fr" ? "Contrôles ALM (Anti-Blanchiment d'Argent) rigoureux sur toutes les transactions de grande valeur effectuées de manière transparente." : "Rigorous ALM (Anti-Money Laundering) checks on all high-value transactions conducted transparently."}</span></li>
                </ul>
              </div>
              <div className="mt-12 pt-6 border-t border-parchment-ivory/10 flex flex-wrap gap-4 items-center justify-between font-mono text-[10px] text-parchment-ivory/40">
                <span>COMPLIANCE INDEX: METRIC-99.8% PASS</span>
                <span>CH-GENEVA EXPORT OFFICE TRUSTEE #29910</span>
              </div>
            </div>

            <div className="border border-on-surface/10 p-8 md:p-12 bg-parchment-ivory flex flex-col justify-between relative overflow-hidden shadow-level-2">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10 space-y-6">
                <div className="text-ebony-deep"><Cpu size={40} strokeWidth={1.5} /></div>
                <div>
                  <h2 className="font-serif text-3xl font-light text-ebony-deep mb-4">{lang === "fr" ? "Certificat de Propriété Numérique" : "Certificate of Digital Ownership"}</h2>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{lang === "fr" ? "Chaque acquisition physique est associée à un jeton cryptographique frappé sur une chaîne de blocs écologique." : "Every physical acquisition is paired with a cryptographic token minted on an eco-friendly blockchain."}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-b border-on-surface/10 py-5 font-sans">
                  <div className="text-center border-r border-on-surface/10 px-2"><span className="block font-serif text-lg font-bold text-ebony-deep leading-none">SHA-256</span><span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/75 mt-1 block">{lang === "fr" ? "Chiffrement" : "Encryption"}</span></div>
                  <div className="text-center border-r border-on-surface/10 px-2"><span className="block font-serif text-lg font-bold text-ebony-deep leading-none">{lang === "fr" ? "Inaltérable" : "Immutable"}</span><span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/75 mt-1 block">{lang === "fr" ? "Registre de la Chaîne" : "Ledger Record"}</span></div>
                  <div className="text-center px-2"><span className="block font-serif text-lg font-bold text-ebony-deep leading-none">{lang === "fr" ? "Instantané" : "Instant"}</span><span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/75 mt-1 block">{lang === "fr" ? "Transfert" : "Transfer"}</span></div>
                </div>
                <div className="bg-background/80 border border-on-surface/5 p-4 space-y-3">
                  <span className="flex items-center space-x-1.5 text-[11px] font-semibold uppercase tracking-wider text-ebony-deep"><Terminal size={12} className="text-gold-leaf" /><span>{lang === "fr" ? "Terminal Vérificateur SCANNER" : "Verifier Terminal SCANNER"}</span></span>
                  <form onSubmit={handleVerifyLedger} className="flex gap-2">
                    <input type="text" placeholder="Search artifact key e.g. ADUNA-OWO" value={ledgerInputValue} onChange={(e) => setLedgerInputValue(e.target.value)} className="bg-surface-container-lowest border border-on-surface/10 text-xs px-3 py-2 text-ebony-deep font-mono focus:outline-none focus:border-gold-leaf w-full placeholder:text-on-surface-variant/30" />
                    <button type="submit" disabled={isLoadingLedger} className="bg-ebony-deep text-parchment-ivory px-3 text-xs font-semibold uppercase tracking-wide hover:bg-gold-leaf hover:text-ebony-deep transition-all disabled:opacity-50">{isLoadingLedger ? (lang === "fr" ? "Patientez..." : "Wait...") : (lang === "fr" ? "Scanner" : "Scan")}</button>
                  </form>
                  {isLoadingLedger && <div className="text-[11px] font-mono font-semibold tracking-wider text-gold-leaf animate-pulse">&gt; CONNECTING SECURE GENEVA LEDGER NODE...</div>}
                  {verifyingBlock && !isLoadingLedger && (
                    <div className="p-3 bg-ebony-deep text-parchment-ivory text-[10px] font-mono leading-relaxed space-y-1">
                      <div className="text-emerald-400 font-bold">&gt; SECURE PROTOCOL ANCHOR VALIDATED</div>
                      <div>Block Height: <span className="text-parchment-ivory/80">{verifyingBlock.blockHeight}</span></div>
                      <div>Masterwork: <span className="text-gold-leaf">{verifyingBlock.artifactName}</span></div>
                      <div>Action: <span className="text-parchment-ivory/70">{verifyingBlock.action}</span></div>
                      <div className="truncate text-gold-leaf font-bold">Consensus Signature: {verifyingBlock.transactionHash}</div>
                    </div>
                  )}
                  {verificationError && !isLoadingLedger && <div className="flex items-start space-x-1.5 p-2 bg-rose-50 text-rose-800 text-[10px] font-mono leading-relaxed"><AlertTriangle size={12} className="shrink-0 mt-0.5" /><span>{verificationError}</span></div>}
                </div>
              </div>
              <div className="pt-8 relative z-10 text-left">
                <button type="button" onClick={() => setShowCertificate(true)} className="text-ebony-deep font-sans text-xs font-semibold uppercase tracking-[0.1em] border-b border-gold-leaf pb-1 hover:text-gold-leaf transition-colors inline-flex items-center">{lang === "fr" ? "Voir un Certificat Exemple" : "View Sample Certificate"} <ArrowRight size={14} className="ml-2" /></button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-deep/75 backdrop-blur-sm overflow-y-auto select-none">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-parchment-ivory p-6 md:p-12 max-w-3xl w-full border border-on-surface/10 shadow-2xl relative my-8">
              <button onClick={() => setShowCertificate(false)} className="absolute top-4 right-4 text-on-surface hover:text-gold-leaf transition-colors p-2"><X size={24} /></button>
              <div className="border border-gold-leaf/40 p-4 md:p-8 relative">
                <div className="absolute inset-0 border border-ebony-deep/5 m-1 pointer-events-none" />
                <div className="space-y-8 text-center">
                  <div className="space-y-2">
                    <span className="block font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gold-leaf">Institutional Ledger Registry Compliance</span>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-ebony-deep tracking-tight uppercase">{lang === "fr" ? "Certificat d'Authenticité" : "Certificate of Authenticity"}</h3>
                    <div className="font-sans text-[10px] tracking-widest text-on-surface-variant/50 uppercase">Consign Signature Secure Node ID: ADUNA-{currentArtifact.id.split("-").pop()}</div>
                  </div>
                  <div className="flex items-center justify-center space-x-4"><span className="h-[1px] w-20 bg-ebony-deep/10" /><Landmark size={16} className="text-gold-leaf" /><span className="h-[1px] w-20 bg-ebony-deep/10" /></div>
                  <div className="space-y-2">
                    <span className="block font-sans text-[10px] uppercase tracking-widest text-terracotta-earth font-bold">CLASSICAL HERITAGE SPECIMEN REGISTRATION</span>
                    <h4 className="font-serif text-2xl md:text-3xl text-ebony-deep font-semibold">{currentArtifact.name}</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-5 bg-white/70 border border-on-surface/5 text-left font-sans text-xs">
                    <div><span className="block text-[9px] uppercase tracking-wider text-on-surface-variant/60">Origin</span><span className="font-semibold text-ebony-deep leading-snug">{currentArtifact.origin}</span></div>
                    <div><span className="block text-[9px] uppercase tracking-wider text-on-surface-variant/60">Culture</span><span className="font-semibold text-ebony-deep leading-snug">{currentArtifact.culture}</span></div>
                    <div><span className="block text-[9px] uppercase tracking-wider text-on-surface-variant/60">Medium</span><span className="font-semibold text-ebony-deep leading-snug">{currentArtifact.medium}</span></div>
                    <div><span className="block text-[9px] uppercase tracking-wider text-on-surface-variant/60">Age</span><span className="font-semibold text-ebony-deep leading-snug">{currentArtifact.approximateAge}</span></div>
                  </div>
                  <div className="text-left font-mono text-[10px] text-on-surface-variant/80 border-t border-b border-ebony-deep/10 py-5 space-y-2 max-w-xl mx-auto leading-relaxed">
                    <div className="flex justify-between items-center text-ebony-deep font-bold font-sans text-[11px] mb-2"><span className="flex items-center space-x-1 uppercase"><Network size={12} className="text-gold-leaf" /><span>Immutable Ledger Audit Status</span></span><span className="text-[10px] text-emerald-700">MINTED STATE ACTIVE</span></div>
                    <div className="flex justify-between"><span>BLOCKCHAIN ENTRY BLOCK:</span><span className="font-mono text-ebony-deep">#89412 - ECO-LEDGER CONSENSUS</span></div>
                    <div className="flex justify-between"><span>REGISTRY MINT TIMESTAMP:</span><span className="font-mono text-ebony-deep">{currentArtifact.mintDate}</span></div>
                    <div className="flex justify-between items-start gap-4"><span>DIGITAL CRYPTOGRAPHIC SEAL:</span><span className="font-mono text-ebony-deep truncate text-right overflow-hidden max-w-xs block select-all">{currentArtifact.blockHash}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-4">
                    <div className="space-y-1"><div className="font-serif text-lg italic text-gold-leaf border-b border-ebony-deep/15 pb-2">Amara Ndiaye</div><div className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/70">Chief Curator Signature</div></div>
                    <div className="space-y-1"><div className="font-serif text-lg italic text-gold-leaf border-b border-ebony-deep/15 pb-2">Benin Council Board</div><div className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/70">Advisory Assessor Stamp</div></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => setShowCertificate(false)} className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Fermer" : "Close"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-deep/75 backdrop-blur-sm overflow-y-auto select-none">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-parchment-ivory p-6 md:p-10 max-w-xl w-full border border-on-surface/10 shadow-2xl relative my-8">
              <button onClick={() => { setShowInquiry(false); setInquirySuccess(false); }} className="absolute top-4 right-4 text-on-surface hover:text-gold-leaf transition-colors p-2"><X size={24} /></button>
              {!inquirySuccess ? (
                <div className="space-y-6">
                  <div className="space-y-2 text-left">
                    <span className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-leaf"><Shield size={12} /><span>CONFIDENTIAL COLLECTOR VERIFICATION</span></span>
                    <h3 className="font-serif text-2xl md:text-3xl text-ebony-deep font-light uppercase">{lang === "fr" ? "Demander un Accès Privé" : "Request Private Access"}</h3>
                  </div>
                  <form onSubmit={handleSubmitInquiry} className="space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left"><label className="block text-[10px] uppercase font-semibold text-on-surface-variant/70 tracking-wider">{lang === "fr" ? "Nom Complet" : "Full Name"}</label><input type="text" required placeholder="Lord Alistair Vance" value={inquiryForm.fullName} onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })} className="w-full bg-white border-b border-ebony-deep/20 focus:border-gold-leaf px-3 py-2.5 text-ebony-deep text-sm focus:outline-none placeholder:text-on-surface-variant/30" /></div>
                      <div className="space-y-1 text-left"><label className="block text-[10px] uppercase font-semibold text-on-surface-variant/70 tracking-wider">{lang === "fr" ? "E-mail Sécurisé" : "Secure Email"}</label><input type="email" required placeholder="name@institution.org" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="w-full bg-white border-b border-ebony-deep/20 focus:border-gold-leaf px-3 py-2.5 text-ebony-deep text-sm focus:outline-none placeholder:text-on-surface-variant/30" /></div>
                    </div>
                    <div className="space-y-1 text-left"><label className="block text-[10px] uppercase font-semibold text-on-surface-variant/70 tracking-wider">{lang === "fr" ? "Niveau de Collectionneur" : "Collector Tier"}</label><select value={inquiryForm.collectorLevel} onChange={(e) => setInquiryForm({ ...inquiryForm, collectorLevel: e.target.value })} className="w-full bg-white border-b border-ebony-deep/20 focus:border-gold-leaf px-3 py-2.5 text-ebony-deep text-sm focus:outline-none cursor-pointer"><option value="Novice">{lang === "fr" ? "Enthousiaste Souverain Cultivateur" : "Sovereign Cultivating Enthusiast"}</option><option value="Institutional">{lang === "fr" ? "Administrateur de Musée / Fonds Patrimonial" : "Museum Trustee / Heritage Fund"}</option><option value="Private-VVIP">{lang === "fr" ? "Bureau Familial à Grande Valeur" : "High-Value Venture Family Office"}</option></select></div>
                    <div className="space-y-1 text-left"><label className="block text-[10px] uppercase font-semibold text-on-surface-variant/70 tracking-wider">{lang === "fr" ? "Artifact Cible" : "Target Artifact"}</label><select value={inquiryForm.artifactSelection} onChange={(e) => setInquiryForm({ ...inquiryForm, artifactSelection: e.target.value })} className="w-full bg-white border-b border-ebony-deep/20 focus:border-gold-leaf px-3 py-2.5 text-ebony-deep text-sm focus:outline-none cursor-pointer">{MASTERPIECES.map(art => <option key={art.id} value={art.id}>{art.name}</option>)}<option value="ALL">{lang === "fr" ? "Portfolio Complet" : "Entire Portfolio"}</option></select></div>
                    <div className="space-y-1 text-left"><label className="block text-[10px] uppercase font-semibold text-on-surface-variant/70 tracking-wider">{lang === "fr" ? "Déclaration d'Intention" : "Intent Statement"}</label><textarea required rows={3} placeholder={lang === "fr" ? "Résumez votre intention d'acquisition..." : "Summarize your acquisition intent..."} value={inquiryForm.interestReason} onChange={(e) => setInquiryForm({ ...inquiryForm, interestReason: e.target.value })} className="w-full bg-white border border-ebony-deep/10 focus:border-gold-leaf px-3 py-2.5 text-ebony-deep text-sm focus:outline-none placeholder:text-on-surface-variant/30 leading-relaxed resize-none" /></div>
                    <div className="pt-4 flex justify-end space-x-3">
                      <button type="button" onClick={() => setShowInquiry(false)} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 hover:text-ebony-deep transition-colors">{lang === "fr" ? "Annuler" : "Cancel"}</button>
                      <button type="submit" disabled={isSubmittingInquiry} className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-gold-leaf hover:text-ebony-deep transition-colors inline-flex items-center gap-2"><span>{isSubmittingInquiry ? (lang === "fr" ? "Ancrage en cours..." : "Anchoring...") : (lang === "fr" ? "Soumettre la Demande" : "Submit Inquiry")}</span><Send size={12} /></button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center text-emerald-600 mb-2"><CheckCircle2 size={44} strokeWidth={1.5} /></div>
                  <div className="space-y-2">
                    <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-gold-leaf">LEDGER NODE TRANSACTION COMPLETE</span>
                    <h3 className="font-serif text-2xl text-ebony-deep font-semibold">{lang === "fr" ? "Demande Reçue" : "Application Received"}</h3>
                  </div>
                  <div className="bg-white border border-gold-leaf/30 p-6 text-left max-w-sm mx-auto font-mono text-[10px] space-y-3 leading-relaxed border-double border-4">
                    <div className="flex justify-between items-center text-ebony-deep font-sans font-bold text-[11px] border-b border-ebony-deep/5 pb-2"><span className="flex items-center space-x-1.5 uppercase"><Award size={12} className="text-gold-leaf" /><span>PRE-VERIFIED ACCESS TICKET</span></span><span className="text-[10px] text-emerald-600">SEAL_OK</span></div>
                    <div><span className="block font-sans font-semibold text-ebony-deep uppercase text-[9px] text-on-surface-variant/60">COLLECTOR ID TIER:</span><span>{inquiryForm.collectorLevel.toUpperCase()}</span></div>
                    <div><span className="block font-sans font-semibold text-ebony-deep uppercase text-[9px] text-on-surface-variant/60">TARGET WORK:</span><span className="text-gold-leaf">{MASTERPIECES.find(m => m.id === inquiryForm.artifactSelection)?.name || "Portfolio"}</span></div>
                    <div className="pt-2 border-t border-on-surface/5"><span className="flex items-center space-x-1 font-sans font-semibold text-ebony-deep text-[9px] uppercase mb-1"><Terminal size={10} className="text-gold-leaf" /><span>TRANSACTION SEED KEY:</span></span><span className="break-all font-mono text-ebony-deep leading-snug">{generatedPassHash}</span></div>
                  </div>
                  <button onClick={() => { setShowInquiry(false); setInquirySuccess(false); }} className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-gold-leaf hover:text-ebony-deep transition-colors">{lang === "fr" ? "Fermer le Portail" : "Close Portal"}</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry FAB */}
      <button onClick={() => setShowInquiry(true)} className="fixed bottom-8 right-8 z-40 bg-ebony-deep text-parchment-ivory shadow-level-3 px-6 py-4 flex items-center gap-3 transition-all hover:bg-gold-leaf hover:text-ebony-deep group">
        <ShieldCheck className="w-4 h-4 text-gold-leaf group-hover:text-ebony-deep transition-colors" />
        <span className="font-sans text-xs uppercase tracking-widest font-bold">{lang === "fr" ? "Demander un Accès Privé" : "Request Private Access"}</span>
      </button>
    </>
  );
}

function GraduationCap({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></svg>;
}

function Shield({ size, className }: { size: number; className?: string }) {
  return <ShieldCheck size={size} className={className} />;
}