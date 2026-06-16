"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Building2, Award, ExternalLink, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import ProvenanceModal from "@/components/home/ProvenanceModal";
import CollectorClubModal from "@/components/home/CollectorClubModal";
import ReportViewerModal from "@/components/home/ReportViewerModal";
import { useArtworks } from "@/lib/hooks";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtworks } from "@/lib/useTranslatedArtwork";
import { T } from "@/components/T";
import type { Artwork, MemberApplication } from "@/lib/types";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
  const { lang, t } = useTranslate();
  const { artworks: apiArtworks } = useArtworks({ limit: 3 });
  const curatedArtworks = useTranslatedArtworks(apiArtworks as unknown as Artwork[]);

  const handleApplicationSuccess = (app: MemberApplication) => {
    setMemberApp(app);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

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
              lang === "fr" ? "Provenance Vérifiée" : "Verified Provenance",
              lang === "fr" ? "Conformité UNIDROIT 1970" : "UNIDROIT 1970 Compliance",
              lang === "fr" ? "Séquestre Institutionnel" : "Institutional Escrow",
              lang === "fr" ? "Conseil Privé" : "Private Advisory",
              lang === "fr" ? "Expédition Internationale Sécurisée" : "Secure International Shipping",
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

        {/* Curated Selection */}
        <section className="bg-parchment-ivory/40 border-t border-b border-on-surface/5 py-14 md:py-20 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <motion.div
              className="flex flex-col items-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="label-caps text-gold-leaf mb-2">{lang === "fr" ? "Chef-d'Œuvres Sélectionnés" : "Handselected Masterworks"}</span>
              <h2 className="font-headline-md text-ebony-deep text-center">{lang === "fr" ? "La Sélection Curatée" : "The Curated Selection"}</h2>
              <div className="w-16 h-[1.5px] bg-gold-leaf mt-6" />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {curatedArtworks.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  onClick={() => setSelectedArtwork(item)}
                  className={`flex flex-col group cursor-pointer ${index === 1 ? "md:mt-12" : ""}`}
                >
                  <div className="relative w-full aspect-square bg-ebony-deep shadow-level-2 overflow-hidden mb-5 md:mb-6">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-ebony-deep/0 group-hover:bg-ebony-deep/20 transition-all duration-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-ebony-deep mb-1 group-hover:text-gold-leaf transition-colors">{item.title}</h3>
                    <p className="font-sans text-[10px] md:text-[11px] tracking-widest text-on-surface-variant/50 uppercase font-bold mb-2">
                      {item.era} &bull; {item.material}
                    </p>
                    <span className="font-sans text-[10px] md:text-[11px] font-semibold text-gold-leaf uppercase tracking-widest inline-block border-b border-gold-leaf/30 group-hover:border-gold-leaf pb-0.5 transition-all">
                      {lang === "fr" ? "Voir la Provenance" : "View Provenance"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Investment & Advisory */}
        <motion.section
          className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-14 md:py-20 lg:py-28"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="pr-0 md:pr-10">
              <span className="label-caps text-gold-leaf block mb-2">{lang === "fr" ? "Garanties Fiduciaires et Rendement Tokenisé" : "Fiduciary Safeguards & Tokenized Yield"}</span>
              <h2 className="font-headline-md text-ebony-deep mb-6 md:mb-8">{lang === "fr" ? "Investissement et Conseil" : "Investment & Advisory"}</h2>
              <div className="border-l-4 border-terracotta-earth bg-surface-container-low p-5 md:p-8 shadow-sm">
                <p className="font-sans text-[13px] md:text-sm text-on-surface-variant leading-relaxed">
                  {lang === "fr"
                    ? "Chez Aduna Gallery, nous considérons les artefacts culturels non seulement comme des triomphes esthétiques, mais comme des réserves de valeur durables. Nos services de conseil institutionnel offrent un suivi méticuleux de la provenance, des protocoles d'authentification chimique et au radiocarbone, et des conseils d'acquisition stratégique pour les collectionneurs privés et les family offices cherchant à diversifier leurs actifs patrimoniaux."
                    : "At Aduna Gallery, we view cultural artifacts not merely as aesthetic triumphs, but as enduring stores of value. Our institutional advisory services provide meticulous provenance tracking, chemical/radiocarbon authentication protocols, and strategic acquisition guidance for private collectors and family offices seeking to diversify into heritage assets."}
                </p>
              </div>
              <div className="mt-6 md:mt-8">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex items-center gap-2 text-gold-leaf hover:text-ebony-deep transition-colors group"
                >
                  <span className="font-sans text-xs uppercase tracking-widest font-bold">{lang === "fr" ? "Télécharger le Rapport Institutionnel" : "Download Institutional Report"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-full h-[380px] bg-surface-container-low/60 border border-on-surface/5 relative overflow-hidden flex flex-col items-center justify-center group hover:shadow-level-2 transition-shadow duration-500">
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)", backgroundSize: "28px 28px" }} />
                <div className="z-10 p-6 bg-parchment-ivory border border-on-surface/5 text-center shadow-lg max-w-xs group-hover:shadow-level-3 transition-shadow duration-500">
                  <Building2 size={36} className="text-gold-leaf mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-medium text-ebony-deep">{lang === "fr" ? "Garde-Safe Suisse" : "Swiss Safehouse Custody"}</h4>
                  <p className="font-sans text-[11px] text-on-surface-variant/60 mt-1 max-w-sm leading-relaxed">
                    {lang === "fr"
                      ? "Tous les artefacts sont assurés par Lloyd's et sécurisés dans des ports francs suisses à température vérifiée, filtrés au carbone et exonérés d'impôts."
                      : "All artifacts remain insured by Lloyd's and secured in temperature-verified, carbon-filtered, tax-exempt Swiss free ports."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Collector's Club */}
        <motion.section
          className="bg-ebony-deep w-full py-14 md:py-20 lg:py-28 text-center text-parchment-ivory relative overflow-hidden"
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
              <h2 className="font-display-lg text-parchment-ivory tracking-tight mb-4 md:mb-6">{lang === "fr" ? "Le Club des Collectionneurs" : "The Collector's Club"}</h2>
              <p className="font-sans text-sm md:text-base text-parchment-ivory/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                {lang === "fr"
                  ? "L'accès à nos acquisitions les plus importantes est strictement réservé aux membres vérifiés. Initiez une demande confidentielle pour discuter d'une curation sur mesure et d'un accès à la salle de coffre-fort privée."
                  : "Access to our most significant acquisitions is strictly reserved for vetted members. Initiate a confidential inquiry to discuss bespoke curation and private vault viewing room access."}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              {memberApp ? (
                <div className="p-6 bg-parchment-ivory/5 border border-gold-leaf/20 max-w-md mx-auto">
                  <p className="font-sans text-xs text-gold-leaf font-bold uppercase tracking-widest mb-2">{lang === "fr" ? "Adhésion Vérifiée Enregistrée" : "Vetted Membership Registered"}</p>
                  <p className="font-sans text-[11px] text-parchment-ivory/70">{lang === "fr" ? `Bienvenue, ${memberApp.fullName}. Votre dossier sécurisé est initialisé.` : `Welcome back, ${memberApp.fullName}. Your secure dossier is initialized.`}</p>
                </div>
              ) : (
                <button
                  onClick={() => setShowClubModal(true)}
                  className="bg-parchment-ivory text-ebony-deep font-sans text-xs font-bold px-8 py-4 md:px-10 md:py-5 hover:bg-gold-leaf hover:text-ebony-deep transition-all uppercase tracking-widest"
                >
                  {lang === "fr" ? "Demander l'Accès" : "Apply for Access"}
                </button>
              )}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Press Links */}
        <motion.section
          className="bg-parchment-ivory/40 border-t border-b border-on-surface/5 py-12 md:py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="label-caps text-gold-leaf mb-2 block">{lang === "fr" ? "Dans la Presse" : "In the Press"}</span>
              <h2 className="font-headline-md text-ebony-deep">{lang === "fr" ? "Couverture Sélectionnée" : "Featured Coverage"}</h2>
              <div className="w-16 h-[1.5px] bg-gold-leaf mt-4 mx-auto" />
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "The Art Newspaper", subtitle: lang === "fr" ? "Essor du Marché de l'Art Africain" : "African Art Market Surge", url: "https://www.theartnewspaper.com" },
                { title: "Financial Times", subtitle: lang === "fr" ? "Portefeuille d'Actifs Patrimoniaux" : "Heritage Asset Portfolio", url: "https://www.ft.com" },
                { title: "Sotheby's Magazine", subtitle: lang === "fr" ? "Provenance et Confiance" : "Provenance & Trust", url: "https://www.sothebys.com" },
                { title: "Christie's Review", subtitle: lang === "fr" ? "Antiquités de Grade Investissement" : "Investment-Grade Antiquities", url: "https://www.christies.com" },
              ].map((press, i) => (
                <motion.a
                  key={press.title}
                  href={press.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-surface-container-low border border-on-surface/5 p-5 flex flex-col gap-2 hover:border-gold-leaf/30 hover:shadow-level-1 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-medium text-ebony-deep group-hover:text-gold-leaf transition-colors">{press.title}</span>
                    <ExternalLink size={12} className="text-on-surface-variant/40 group-hover:text-gold-leaf transition-colors" />
                  </div>
                  <p className="font-sans text-[10px] text-on-surface-variant/60 uppercase tracking-wider">{press.subtitle}</p>
                </motion.a>
              ))}
            </div>
          </div>
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
