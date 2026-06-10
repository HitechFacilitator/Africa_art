"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Sparkles, Building2, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProvenanceModal from "@/components/home/ProvenanceModal";
import CollectorClubModal from "@/components/home/CollectorClubModal";
import ReportViewerModal from "@/components/home/ReportViewerModal";
import { ARTWORKS } from "@/lib/mockData";
import type { Artwork, MemberApplication } from "@/lib/types";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HomePage() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [memberApp, setMemberApp] = useState<MemberApplication | null>(null);

  const handleApplicationSuccess = (app: MemberApplication) => {
    setMemberApp(app);
  };

  const heroArtwork = ARTWORKS.find((art) => art.isHero) || ARTWORKS[0];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Banner Section */}
        <section className="relative min-h-[85vh] bg-ebony-deep flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(135deg,_#B35C44_0%,_transparent_50%,_#C5A059_100%)]" />

          <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-20 md:py-28 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Hero Text */}
              <motion.div
                className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-10 z-10"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6 md:mb-8">
                  <Sparkles size={14} className="text-gold-leaf animate-pulse" />
                  <span className="label-caps text-gold-leaf">Private Collection &mdash; Est. 1987</span>
                </motion.div>

                <motion.h1 variants={fadeUp} className="font-display-xl text-parchment-ivory max-w-2xl mb-6 md:mb-8 leading-tight">
                  Prestige African Art,{" "}
                  <em className="not-italic text-gold-leaf">Curated for the Discerning Collector</em>
                </motion.h1>

                <motion.p variants={fadeUp} className="font-sans text-sm md:text-base text-parchment-ivory/60 max-w-lg leading-relaxed mb-8 md:mb-12">
                  Discover rare and authenticated African artworks &mdash; from ancient ceremonial pieces to contemporary masterworks. Every piece carries verified provenance and institutional certification.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <a
                    href="/catalogue"
                    className="inline-block bg-gold-leaf text-ebony-deep font-sans text-xs font-semibold uppercase tracking-[0.1em] px-6 py-4 md:px-8 hover:bg-parchment-ivory transition-all duration-300 text-center"
                  >
                    Browse Collection
                  </a>
                  <button
                    onClick={() => setShowClubModal(true)}
                    className="inline-block border border-parchment-ivory/30 text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.1em] px-6 py-4 md:px-8 hover:border-gold-leaf hover:text-gold-leaf transition-all duration-300"
                  >
                    Request Private Access
                  </button>
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 md:gap-6 border-t border-parchment-ivory/15 pt-6 md:pt-8 mt-10 md:mt-12 w-full max-w-sm">
                  <div>
                    <span className="font-serif text-lg md:text-xl font-bold text-parchment-ivory">11.4%</span>
                    <span className="font-sans text-[8px] md:text-[9px] text-parchment-ivory/50 uppercase block tracking-wider mt-0.5">Avg Annual Return</span>
                  </div>
                  <div>
                    <span className="font-serif text-lg md:text-xl font-bold text-parchment-ivory">100%</span>
                    <span className="font-sans text-[8px] md:text-[9px] text-parchment-ivory/50 uppercase block tracking-wider mt-0.5">Vetted Origin</span>
                  </div>
                  <div>
                    <span className="font-serif text-lg md:text-xl font-bold text-parchment-ivory">&euro;8.4M</span>
                    <span className="font-sans text-[8px] md:text-[9px] text-parchment-ivory/50 uppercase block tracking-wider mt-0.5">Under Custody</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Hero Image */}
              <motion.div
                className="lg:col-span-7 mt-8 lg:mt-0 relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <div
                  onClick={() => setSelectedArtwork(heroArtwork)}
                  className="relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] bg-ebony-deep shadow-level-2 overflow-hidden cursor-pointer border border-ebony-deep/5"
                >
                  <img
                    src={heroArtwork.imageUrl}
                    alt={heroArtwork.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#0F0F0F]/65 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 text-gold-leaf text-[9px] md:text-[10px] font-sans font-semibold tracking-widest uppercase border border-gold-leaf/20 flex items-center gap-1.5">
                    <Lock size={10} className="text-gold-leaf" />
                    <span>Asset of Prestige Class</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-ebony-deep/90 via-ebony-deep/60 to-transparent text-parchment-ivory flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                    <div>
                      <p className="font-sans text-[9px] md:text-[10px] tracking-widest text-gold-leaf uppercase font-bold">{heroArtwork.era} &bull; {heroArtwork.origin}</p>
                      <h3 className="font-serif text-lg md:text-2xl tracking-tight mt-1">{heroArtwork.title}</h3>
                    </div>
                    <div className="font-sans text-[10px] md:text-xs tracking-widest underline decoration-gold-leaf/50 hover:text-gold-leaf transition-colors pb-0.5 shrink-0">
                      Launch Provenance Dossier
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <motion.section
          className="bg-surface-container border-y border-on-surface/5 py-5 md:py-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6">
            {[
              "Verified Provenance",
              "UNIDROIT 1970 Compliance",
              "Institutional Escrow",
              "Private Advisory",
              "Secure International Shipping",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant/60"
              >
                <span className="w-1 h-1 rounded-full bg-gold-leaf" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Curated Selection Section */}
        <section className="bg-parchment-ivory/40 border-t border-b border-on-surface/5 py-14 md:py-20 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <motion.div
              className="flex flex-col items-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="label-caps text-gold-leaf mb-2">Handselected Masterworks</span>
              <h2 className="font-headline-md text-ebony-deep text-center">The Curated Selection</h2>
              <div className="w-16 h-[1.5px] bg-gold-leaf mt-6" />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {ARTWORKS.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  onClick={() => setSelectedArtwork(item)}
                  className={`flex flex-col group cursor-pointer ${index === 1 ? "md:mt-12" : ""}`}
                >
                  <div className="w-full aspect-square bg-ebony-deep shadow-level-2 overflow-hidden mb-5 md:mb-6 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-ebony-deep/0 group-hover:bg-ebony-deep/20 transition-all duration-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-ebony-deep mb-1">{item.title}</h3>
                    <p className="font-sans text-[10px] md:text-[11px] tracking-widest text-on-surface-variant/50 uppercase font-bold mb-2">
                      {item.era} &bull; {item.material}
                    </p>
                    <span className="font-sans text-[10px] md:text-[11px] font-semibold text-gold-leaf uppercase tracking-widest inline-block border-b border-gold-leaf/30 group-hover:border-gold-leaf pb-0.5 transition-all">
                      View Provenance
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Investment & Advisory Block */}
        <motion.section
          className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-14 md:py-20 lg:py-28"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="pr-0 md:pr-10">
              <span className="label-caps text-gold-leaf block mb-2">Fiduciary Safeguards &amp; Tokenized Yield</span>
              <h2 className="font-headline-md text-ebony-deep mb-6 md:mb-8">Investment &amp; Advisory</h2>
              <div className="border-l-4 border-terracotta-earth bg-surface-container-low p-5 md:p-8 shadow-sm">
                <p className="font-sans text-[13px] md:text-sm text-on-surface-variant leading-relaxed">
                  At Aduna Gallery, we view cultural artifacts not merely as aesthetic triumphs, but as enduring stores of value. Our institutional advisory services provide meticulous provenance tracking, chemical/radiocarbon authentication protocols, and strategic acquisition guidance for private collectors and family offices seeking to diversify into heritage assets.
                </p>
              </div>
              <div className="mt-6 md:mt-8">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex items-center gap-2 text-gold-leaf hover:text-ebony-deep transition-colors"
                >
                  <span className="font-sans text-xs uppercase tracking-widest font-bold">Download Institutional Report</span>
                </button>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="w-full h-[380px] bg-surface-container-low/60 border border-on-surface/5 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)", backgroundSize: "28px 28px" }} />
                <div className="z-10 p-6 bg-parchment-ivory border border-on-surface/5 text-center shadow-lg max-w-xs">
                  <Building2 size={36} className="text-gold-leaf mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-medium text-ebony-deep">Swiss Safehouse Custody</h4>
                  <p className="font-sans text-[11px] text-on-surface-variant/60 mt-1 max-w-sm leading-relaxed">
                    All artifacts remain insured by Lloyd&apos;s and secured in temperature-verified, carbon-filtered, tax-exempt Swiss free ports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* The Collector's Club Invitation */}
        <motion.section
          className="bg-ebony-deep w-full py-14 md:py-20 lg:py-28 text-center text-parchment-ivory relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <motion.div
            className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 z-10 relative"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <Award size={36} className="text-gold-leaf mx-auto mb-4" />
              <h2 className="font-display-lg text-parchment-ivory tracking-tight mb-4 md:mb-6">The Collector&apos;s Club</h2>
              <p className="font-sans text-sm md:text-base text-parchment-ivory/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                Access to our most significant acquisitions is strictly reserved for vetted members. Initiate a confidential inquiry to discuss bespoke curation and private vault viewing room access.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              {memberApp ? (
                <div className="p-6 bg-parchment-ivory/5 border border-gold-leaf/20 max-w-md mx-auto">
                  <p className="font-sans text-xs text-gold-leaf font-bold uppercase tracking-widest mb-2">Vetted Membership Registered</p>
                  <p className="font-sans text-[11px] text-parchment-ivory/70">Welcome back, {memberApp.fullName}. Your secure dossier is initialized.</p>
                </div>
              ) : (
                <button
                  onClick={() => setShowClubModal(true)}
                  className="bg-parchment-ivory text-ebony-deep font-sans text-xs font-bold px-8 py-4 md:px-10 md:py-5 hover:bg-gold-leaf hover:text-ebony-deep transition-all uppercase tracking-widest"
                >
                  Apply for Access
                </button>
              )}
            </motion.div>
          </motion.div>
        </motion.section>
      </main>
      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {selectedArtwork && (
          <ProvenanceModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
            onApplyForClub={() => {
              setSelectedArtwork(null);
              setShowClubModal(true);
            }}
          />
        )}
        {showClubModal && (
          <CollectorClubModal
            onClose={() => setShowClubModal(false)}
            onSuccess={handleApplicationSuccess}
          />
        )}
        {showReportModal && (
          <ReportViewerModal onClose={() => setShowReportModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}