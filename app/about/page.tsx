"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Globe,
  Award,
  Lock,
  Eye,
  Users,
  MapPin,
  Landmark,
  TrendingUp,
  Fingerprint,
  BookOpen,
  Heart,
  ArrowRight,
  ChevronRight,
  Star,
  CheckCircle2,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslate } from "@/lib/translations";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function AboutPage() {
  const { lang } = useTranslate();

  return (
    <div className="min-h-screen bg-parchment-ivory">
      <Navbar />

      {/* Hero */}
      <section className="bg-ebony-deep py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-leaf/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Image src="/logo.png" alt="" width={600} height={600} className="object-contain" priority />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={14} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">{lang === "fr" ? "À Propos" : "About Us"}</span>
            </div>
            <h1 className="font-display-xl text-parchment-ivory max-w-3xl">
              {lang === "fr" ? "Aduna Gallery" : "Aduna Gallery"}
            </h1>
            <p className="font-sans text-lg text-parchment-ivory/60 max-w-2xl mt-6 leading-relaxed">
              {lang === "fr"
                ? "La première plateforme institutionnelle dédiée à l'acquisition, la conservation et l'investissement dans l'art africain d'exception."
                : "The premier institutional platform dedicated to the acquisition, preservation, and investment in exceptional African art."}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/register" className="bg-gold-leaf text-ebony-deep font-sans text-xs font-semibold uppercase tracking-[0.1em] px-6 py-3 hover:bg-parchment-ivory transition-colors inline-flex items-center gap-2">
                {lang === "fr" ? "Demander l'Accès" : "Request Access"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/catalogue" className="border border-parchment-ivory/30 text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.1em] px-6 py-3 hover:border-gold-leaf hover:text-gold-leaf transition-colors inline-flex items-center gap-2">
                {lang === "fr" ? "Voir la Collection" : "View Collection"} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 md:gap-20">
            <motion.div variants={fadeUp}>
              <div className="w-12 h-12 bg-gold-leaf/10 flex items-center justify-center mb-6">
                <Heart className="w-5 h-5 text-gold-leaf" />
              </div>
              <h2 className="font-display-lg text-ebony-deep mb-6">
                {lang === "fr" ? "Notre Mission" : "Our Mission"}
              </h2>
              <p className="font-sans text-on-surface-variant leading-relaxed mb-4">
                {lang === "fr"
                  ? "Aduna Gallery est née d'une conviction profonde : l'art africain, l'un des héritages culturels les plus riches au monde, mérite une plateforme à la hauteur de sa valeur historique et artistique."
                  : "Aduna Gallery was born from a deep conviction: African art, one of the world&apos;s richest cultural heritages, deserves a platform worthy of its historical and artistic value."}
              </p>
              <p className="font-sans text-on-surface-variant leading-relaxed">
                {lang === "fr"
                  ? "Nous connectons les collectionneurs institutionnels, les conseillers en art et les institutions muséales avec des œuvres authentifiées, traçables et certifiées."
                  : "We connect institutional collectors, art advisors, and museum institutions with authenticated, traceable, and certified works."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Blockchain", "XRF Analysis", "TL Dating", "Provenance"].map((tag) => (
                  <span key={tag} className="text-[10px] font-sans font-bold tracking-wider uppercase bg-surface-container-high px-3 py-1.5 text-on-surface-variant">{tag}</span>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="w-12 h-12 bg-gold-leaf/10 flex items-center justify-center mb-6">
                <Eye className="w-5 h-5 text-gold-leaf" />
              </div>
              <h2 className="font-display-lg text-ebony-deep mb-6">
                {lang === "fr" ? "Notre Vision" : "Our Vision"}
              </h2>
              <p className="font-sans text-on-surface-variant leading-relaxed mb-4">
                {lang === "fr"
                  ? "Créer un écosystème où chaque œuvre d'art africain est accompagnée d'une provenance complète, d'un certificat d'authenticité et d'une évaluation patrimoniale."
                  : "To create an ecosystem where every African artwork is accompanied by complete provenance, a certificate of authenticity, and a heritage valuation."}
              </p>
              <p className="font-sans text-on-surface-variant leading-relaxed">
                {lang === "fr"
                  ? "Notre engagement envers la transparence et la sécurité fait de nous le partenaire de confiance pour les investisseurs et les passionnés d'art africain."
                  : "Our commitment to transparency and security makes us the trusted partner for investors and enthusiasts of African art."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Transparency", "Security", "Trust", "Heritage"].map((tag) => (
                  <span key={tag} className="text-[10px] font-sans font-bold tracking-wider uppercase bg-surface-container-high px-3 py-1.5 text-on-surface-variant">{tag}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-16">
              <motion.span variants={fadeUp} className="text-[10px] tracking-[0.25em] font-bold text-gold-leaf uppercase block mb-2 font-sans">
                {lang === "fr" ? "Processus" : "Process"}
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display-lg text-ebony-deep">
                {lang === "fr" ? "Comment Ça Marche" : "How It Works"}
              </motion.h2>
              <div className="w-12 h-[2px] bg-gold-leaf mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  icon: <Fingerprint className="w-6 h-6 text-gold-leaf" />,
                  title: lang === "fr" ? "Vérification d'Identité" : "Identity Verification",
                  desc: lang === "fr"
                    ? "Créez votre compte et soumettez vos identifiants institutionnels pour validation par notre comité."
                    : "Create your account and submit institutional credentials for committee validation.",
                },
                {
                  step: "02",
                  icon: <Eye className="w-6 h-6 text-gold-leaf" />,
                  title: lang === "fr" ? "Exploration Privée" : "Private Browsing",
                  desc: lang === "fr"
                    ? "Accédez à notre collection complète d'œuvres certifiées avec provenance vérifiée et analyse scientifique."
                    : "Access our full collection of certified works with verified provenance and scientific analysis.",
                },
                {
                  step: "03",
                  icon: <Lock className="w-6 h-6 text-gold-leaf" />,
                  title: lang === "fr" ? "Acquisition Sécurisée" : "Secure Acquisition",
                  desc: lang === "fr"
                    ? "Procédez à l'achat en toute sécurité via notre système d'escrow certifié et assurance premium."
                    : "Purchase securely via our certified escrow system and premium insurance.",
                },
                {
                  step: "04",
                  icon: <TrendingUp className="w-6 h-6 text-gold-leaf" />,
                  title: lang === "fr" ? "Gestion Patrimoniale" : "Heritage Management",
                  desc: lang === "fr"
                    ? "Suivez votre portefeuille, recevez des rapports d'appréciation et gérer votre collection."
                    : "Track your portfolio, receive appreciation reports, and manage your collection.",
                },
              ].map((item, i) => (
                <motion.div key={i} variants={scaleIn} className="bg-parchment-ivory p-6 border border-ebony-deep/5 relative group hover:border-gold-leaf/30 transition-colors">
                  <div className="absolute top-4 right-4 font-serif text-4xl font-bold text-ebony-deep/5 group-hover:text-gold-leaf/10 transition-colors">{item.step}</div>
                  <div className="w-12 h-12 bg-gold-leaf/10 flex items-center justify-center mb-5">{item.icon}</div>
                  <h3 className="font-serif text-lg text-ebony-deep mb-3">{item.title}</h3>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-gold-leaf/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-ebony-deep">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-16">
              <motion.span variants={fadeUp} className="text-[10px] tracking-[0.25em] font-bold text-gold-leaf uppercase block mb-2 font-sans">
                {lang === "fr" ? "Fondamentaux" : "Fundamentals"}
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display-lg text-parchment-ivory">
                {lang === "fr" ? "Nos Valeurs Fondamentales" : "Our Core Values"}
              </motion.h2>
              <div className="w-12 h-[2px] bg-gold-leaf mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6 text-gold-leaf" />,
                  title: lang === "fr" ? "Authenticité" : "Authenticity",
                  desc: lang === "fr"
                    ? "Chaque œuvre est rigoureusement vérifiée par notre comité d'experts et accompagnée d'un certificat d'authenticité blockchain."
                    : "Each work is rigorously verified by our expert committee and accompanied by a blockchain certificate of authenticity.",
                  details: ["XRF Testing", "TL Dating", "Expert Panel"],
                },
                {
                  icon: <Globe className="w-6 h-6 text-gold-leaf" />,
                  title: lang === "fr" ? "Provenance" : "Provenance",
                  desc: lang === "fr"
                    ? "Traçabilité complète de la chaîne de possession, de la création à l'acquisition actuelle, documentée et vérifiable."
                    : "Complete traceability of the chain of ownership, from creation to current acquisition, documented and verifiable.",
                  details: ["Full Chain", "Documentation", "Verified"],
                },
                {
                  icon: <Lock className="w-6 h-6 text-gold-leaf" />,
                  title: lang === "fr" ? "Sécurité" : "Security",
                  desc: lang === "fr"
                    ? "Protection des actifs via des coffres-forts de niveau musée, assurance premium et gestion sécurisée des transactions."
                    : "Asset protection via museum-grade vaults, premium insurance, and secure transaction management.",
                  details: ["Museum Vaults", "Premium Insurance", "Escrow"],
                },
              ].map((value, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center p-8 bg-ebony-deep/50 border border-parchment-ivory/5 hover:border-gold-leaf/20 transition-colors">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gold-leaf/10 mb-5">{value.icon}</div>
                  <h3 className="font-serif text-lg text-parchment-ivory mb-3">{value.title}</h3>
                  <p className="font-sans text-sm text-parchment-ivory/60 leading-relaxed mb-5">{value.desc}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {value.details.map((d) => (
                      <span key={d} className="text-[9px] font-sans font-bold tracking-wider uppercase bg-gold-leaf/10 text-gold-leaf px-2.5 py-1">{d}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-12">
              <motion.span variants={fadeUp} className="text-[10px] tracking-[0.25em] font-bold text-gold-leaf uppercase block mb-2 font-sans">
                {lang === "fr" ? "Chiffres Clés" : "Key Figures"}
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display-lg text-ebony-deep">
                {lang === "fr" ? "Aduna Gallery en Chiffres" : "Aduna Gallery by the Numbers"}
              </motion.h2>
              <div className="w-12 h-[2px] bg-gold-leaf mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "€250M+", label: lang === "fr" ? "Valeur Gérée" : "Assets Under Management", icon: <TrendingUp className="w-5 h-5 text-gold-leaf" /> },
                { number: "150+", label: lang === "fr" ? "Œuvres Certifiées" : "Certified Works", icon: <Award className="w-5 h-5 text-gold-leaf" /> },
                { number: "40+", label: lang === "fr" ? "Institutions Partenaires" : "Partner Institutions", icon: <Landmark className="w-5 h-5 text-gold-leaf" /> },
                { number: "98%", label: lang === "fr" ? "Taux de Satisfaction" : "Client Satisfaction", icon: <Star className="w-5 h-5 text-gold-leaf" /> },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeUp} className="p-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gold-leaf/10 mb-4">{stat.icon}</div>
                  <div className="font-display-xl text-gold-leaf mb-2">{stat.number}</div>
                  <div className="font-sans text-xs text-on-surface-variant uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-16">
              <motion.span variants={fadeUp} className="text-[10px] tracking-[0.25em] font-bold text-gold-leaf uppercase block mb-2 font-sans">
                {lang === "fr" ? "Couverture" : "Coverage"}
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display-lg text-ebony-deep">
                {lang === "fr" ? "Nos Régions de Collection" : "Our Collection Regions"}
              </motion.h2>
              <div className="w-12 h-[2px] bg-gold-leaf mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { region: lang === "fr" ? "Afrique de l'Ouest" : "West Africa", countries: "Nigeria, Ghana, Mali, Senegal", count: "45+", icon: <MapPin className="w-4 h-4 text-gold-leaf" /> },
                { region: lang === "fr" ? "Afrique Centrale" : "Central Africa", countries: "DRC, Cameroon, Gabon, Congo", count: "35+", icon: <MapPin className="w-4 h-4 text-gold-leaf" /> },
                { region: lang === "fr" ? "Afrique de l'Est" : "East Africa", countries: "Kenya, Ethiopia, Tanzania, Uganda", count: "25+", icon: <MapPin className="w-4 h-4 text-gold-leaf" /> },
              ].map((r, i) => (
                <motion.div key={i} variants={scaleIn} className="bg-parchment-ivory p-6 border border-ebony-deep/5 hover:border-gold-leaf/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {r.icon}
                      <h3 className="font-serif text-lg text-ebony-deep">{r.region}</h3>
                    </div>
                    <span className="text-[10px] font-sans font-bold tracking-wider uppercase bg-gold-leaf/10 text-gold-leaf px-2.5 py-1">{r.count} {lang === "fr" ? "Œuvres" : "Works"}</span>
                  </div>
                  <p className="font-sans text-sm text-on-surface-variant">{r.countries}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team / Expertise */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-16">
              <motion.span variants={fadeUp} className="text-[10px] tracking-[0.25em] font-bold text-gold-leaf uppercase block mb-2 font-sans">
                {lang === "fr" ? "Excellence" : "Excellence"}
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display-lg text-ebony-deep">
                {lang === "fr" ? "Notre Expertise" : "Our Expertise"}
              </motion.h2>
              <div className="w-12 h-[2px] bg-gold-leaf mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp}>
                <h3 className="font-serif text-2xl text-ebony-deep mb-6">
                  {lang === "fr" ? "Une Équipe de Référence Mondiale" : "A World-Class Team"}
                </h3>
                <p className="font-sans text-on-surface-variant leading-relaxed mb-6">
                  {lang === "fr"
                    ? "Notre équipe comprend des conservateurs de musée, des historiens de l'art, des scientifiques spécialisés dans l'analyse des matériaux et des experts en traçabilité patrimoniale."
                    : "Our team includes museum curators, art historians, materials science specialists, and heritage traceability experts."}
                </p>
                <div className="space-y-3">
                  {[
                    lang === "fr" ? "Conservateurs certifiés par des musées internationaux" : "Curators certified by international museums",
                    lang === "fr" ? "Analystes scientifiques XRF et thermoluminescence" : "XRF and thermoluminescence scientific analysts",
                    lang === "fr" ? "Experts en provenance avec réseau mondial" : "Provenance experts with global network",
                    lang === "fr" ? "Conseillers en investissement artistique" : "Art investment advisors",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-leaf shrink-0 mt-0.5" />
                      <span className="font-sans text-sm text-on-surface-variant">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                {[
                  { icon: <BookOpen className="w-6 h-6 text-gold-leaf" />, label: lang === "fr" ? "Recherche" : "Research", desc: lang === "fr" ? "Archives & Études" : "Archives & Studies" },
                  { icon: <Fingerprint className="w-6 h-6 text-gold-leaf" />, label: lang === "fr" ? "Authentification" : "Authentication", desc: lang === "fr" ? "XRF & TL Testing" : "XRF & TL Testing" },
                  { icon: <Users className="w-6 h-6 text-gold-leaf" />, label: lang === "fr" ? "Conseil" : "Advisory", desc: lang === "fr" ? "Portfolio & Investissement" : "Portfolio & Investment" },
                  { icon: <Globe className="w-6 h-6 text-gold-leaf" />, label: lang === "fr" ? "Logistique" : "Logistics", desc: lang === "fr" ? "Transport & Assurance" : "Transport & Insurance" },
                ].map((item, i) => (
                  <div key={i} className="bg-surface-container-low p-5 border border-ebony-deep/5 text-center hover:border-gold-leaf/30 transition-colors">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gold-leaf/10 mb-3">{item.icon}</div>
                    <h4 className="font-serif text-sm font-bold text-ebony-deep mb-1">{item.label}</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-ebony-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_40%_50%,_#C5A059_0%,_transparent_70%)]" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles className="w-8 h-8 text-gold-leaf mx-auto mb-4" />
            <h2 className="font-display-lg text-parchment-ivory mb-6">
              {lang === "fr" ? "Prêt à Rejoindre Aduna Gallery ?" : "Ready to Join Aduna Gallery?"}
            </h2>
            <p className="font-sans text-parchment-ivory/60 max-w-lg mx-auto mb-8">
              {lang === "fr"
                ? "Demandez votre accès privé et découvrez une collection exclusive d'art africain d'exception."
                : "Request your private access and discover an exclusive collection of exceptional African art."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-gold-leaf text-ebony-deep font-sans text-xs font-semibold uppercase tracking-[0.1em] px-8 py-4 hover:bg-parchment-ivory transition-colors inline-flex items-center justify-center gap-2">
                {lang === "fr" ? "Demander un Accès" : "Request Access"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/catalogue" className="border border-parchment-ivory/30 text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.1em] px-8 py-4 hover:border-gold-leaf hover:text-gold-leaf transition-colors inline-flex items-center justify-center gap-2">
                {lang === "fr" ? "Parcourir la Collection" : "Browse Collection"} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
