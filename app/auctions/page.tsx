"use client";

import { motion } from "motion/react";
import {
  ShieldCheck,
  Globe,
  Users,
  Award,
  BookOpen,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslate } from "@/lib/translations";
import { T } from "@/components/T";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function AboutPage() {
  const { lang, t } = useTranslate();

  const TIMELINE = [
    { year: "1987", title: lang === "fr" ? "Fondation" : "Foundation", text: lang === "fr" ? "Aduna Gallery fondée à Douala par un consortium de spécialistes d'art africain et de collectionneurs privés." : "Aduna Gallery established in Douala by a consortium of African art scholars and private collectors." },
    { year: "1994", title: lang === "fr" ? "Première Acquisition Majeure" : "First Major Acquisition", text: lang === "fr" ? "Acquisition de la Collection Harrison Ife, établissant notre réputation dans l'antiquité ouest-africaine." : "Acquired the Harrison Ife Collection, establishing our reputation in West African antiquities." },
    { year: "2003", title: lang === "fr" ? "Coffre-Fort de Genève" : "Geneva Vault", text: lang === "fr" ? "Ouverture d'un coffre-fort climatisé dédié à Genève pour la préservation d'artefacts de qualité muséale." : "Opened a dedicated climate-controlled vault in Geneva for institutional-grade artifact preservation." },
    { year: "2012", title: lang === "fr" ? "Authentification Numérique" : "Digital Authentication", text: lang === "fr" ? "Pionnier du suivi de provenance par blockchain vérifié pour toutes les acquisitions de la galerie." : "Pioneered blockchain-verified provenance tracking for all gallery acquisitions." },
    { year: "2021", title: lang === "fr" ? "Expansion Mondiale" : "Global Expansion", text: lang === "fr" ? "Expansion des services-conseils à Lagos, Dubaï et New York avec des salons de visite privés." : "Expanded advisory services to Lagos, Dubai, and New York with private viewing rooms." },
    { year: "2024", title: lang === "fr" ? "Intelligence Aduna" : "Aduna Intelligence", text: lang === "fr" ? "Lancement de la plateforme de conseil curatorial alimentée par l'IA pour les collectionneurs institutionnels et privés." : "Launched AI-powered curatorial advisory platform for institutional and private collectors." },
  ];

  const VALUES = [
    { icon: ShieldCheck, title: lang === "fr" ? "Authenticité d'Abord" : "Authenticity First", text: lang === "fr" ? "Chaque artifact subit une vérification multistage comprenant l'analyse XRF, les tests de thermoluminescence et des recherches de provenance indépendantes avant l'entrée en galerie." : "Every artifact undergoes multi-stage verification including XRF analysis, thermoluminescence testing, and independent provenance research before gallery entry." },
    { icon: Globe, title: lang === "fr" ? "Gestion Culturelle" : "Cultural Stewardship", text: lang === "fr" ? "Nous travaillons directement avec les communautés d'origine, les musées et les conseils de restitution pour garantir l'acquisition éthique et le respect culturel." : "We work directly with source communities, museums, and repatriation boards to ensure ethical acquisition and cultural respect." },
    { icon: Users, title: lang === "fr" ? "Focus Client Privé" : "Private Client Focus", text: lang === "fr" ? "Nos services-conseils sont exclusivement conçus pour les collectionneurs privés, les family offices et les portefeuilles institutionnels à la recherche de diversification d'actifs patrimoniaux." : "Our advisory services are exclusively designed for private collectors, family offices, and institutional portfolios seeking heritage asset diversification." },
    { icon: BookOpen, title: lang === "fr" ? "Rigueur Scientifique" : "Scholarly Rigor", text: lang === "fr" ? "Notre équipe curatoriale comprend des universitaires de premier plan en histoire de l'art africain, chaque pièce accompagnée de dossiers de recherche complets." : "Our curatorial team includes leading academics in African art history, each piece accompanied by comprehensive research dossiers." },
  ];

  const TEAM = [
    { name: "Dr. Amina Okafor", role: lang === "fr" ? "Fondatrice & Directrice" : "Founder & Director", bio: lang === "fr" ? "Ancienne conservatrice au British Museum avec plus de 30 ans d'expérience en art africain. Docteure de l'Université SOAS de Londres." : "Former curator at the British Museum with 30+ years in African art scholarship. PhD from SOAS University of London." },
    { name: "Jean-Marc Dupont", role: lang === "fr" ? "Directeur des Acquisitions" : "Head of Acquisitions", bio: lang === "fr" ? "Précédemment chez Christie's Genève. Spécialiste des bronzes ouest-africains et des traditions sculpturales centrafricaines." : "Previously at Christie's Geneva. Specialist in West African bronzes and Central African sculptural traditions." },
    { name: "Chinwe Eze", role: lang === "fr" ? "Directrice de l'Authentification" : "Chief Authentication Officer", bio: lang === "fr" ? "Scientifique des matériaux spécialisée dans les tests XRF et de thermoluminescence pour la vérification des antiquités." : "Materials scientist specializing in XRF and thermoluminescence testing for antiquity verification." },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-ebony-deep py-20 md:py-28 lg:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_50%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <motion.div
              className="max-w-3xl"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1.5px] bg-gold-leaf" />
                <span className="label-caps text-gold-leaf"><T>About Aduna Gallery</T></span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-display-xl text-parchment-ivory leading-[1.08] mb-6 md:mb-8">
                <T>Guardians of African Heritage,</T>{" "}
                <em className="not-italic text-gold-leaf"><T>Trusted by the Discerning</T></em>
              </motion.h1>
              <motion.p variants={fadeUp} className="font-sans text-sm md:text-base text-parchment-ivory/60 max-w-2xl leading-relaxed">
                {lang === "fr"
                  ? "Depuis 1987, Aduna Gallery est l'institution de premier plan pour l'art africain authentifié et de qualité investissement. Nous faisons le pont entre la préservation culturelle et la richesse privée, offrant aux collectionneurs un accès inégalé aux chefs-d'œuvre les plus significatifs du continent."
                  : "Since 1987, Aduna Gallery has been the premier institution for authenticated, investment-grade African art. We bridge the worlds of cultural preservation and private wealth, offering collectors unparalleled access to the continent's most significant masterworks."}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-14 md:py-20 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="label-caps text-gold-leaf mb-2 block"><T>Our Mission</T></span>
                <h2 className="font-headline-md text-ebony-deep mb-6"><T>Preserving Legacy, Empowering Collection</T></h2>
                <div className="space-y-4 font-sans text-sm text-on-surface-variant leading-relaxed">
                  <p>
                    {lang === "fr"
                      ? "Aduna Gallery existe pour préserver le patrimoine artistique de l'Afrique subsaharienne tout en offrant aux collectionneurs privés et aux portefeuilles institutionnels un accès à des chefs-d'œuvre authentifiés et de qualité investissement."
                      : "Aduna Gallery exists to safeguard the artistic heritage of sub-Saharan Africa while providing private collectors and institutional portfolios with access to authenticated, investment-grade masterworks."}
                  </p>
                  <p>
                    {lang === "fr"
                      ? "Notre double engagement envers la rigueur scientifique et l'excellence fiduciaire garantit que chaque artifact que nous représentons porte une provenance vérifiée, une authentification scientifique et une chaîne de garde claire — répondant aux normes internationales les plus élevées pour l'acquisition éthique."
                      : "Our dual commitment to scholarly rigor and fiduciary excellence ensures that every artifact we represent carries verified provenance, scientific authentication, and a clear chain of custody — meeting the highest international standards for ethical acquisition."}
                  </p>
                  <p>
                    {lang === "fr"
                      ? "Nous croyons que l'art africain représente l'une des classes d'actifs les plus sous-évaluées dans le collectionnement mondial. Nos services-conseils aident les collectionneurs à naviguer dans ce paysage avec confiance, transparence et intégrité culturelle."
                      : "We believe that African art represents one of the most undervalued asset classes in global collecting. Our advisory services help collectors navigate this landscape with confidence, transparency, and cultural integrity."}
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="bg-surface-container-low border border-on-surface/5 p-8 md:p-10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { num: "37+", label: t("Years of Operation") },
                    { num: "€8.4M", label: t("Under Custody") },
                    { num: "120+", label: t("Authenticated Pieces") },
                    { num: "98%", label: t("Client Retention Rate") },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4">
                      <span className="font-serif text-2xl md:text-3xl font-bold text-ebony-deep block">{stat.num}</span>
                      <span className="font-sans text-[10px] text-on-surface-variant/60 uppercase tracking-wider mt-1 block">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-parchment-ivory/40 border-t border-b border-on-surface/5 py-14 md:py-20 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="label-caps text-gold-leaf mb-2 block"><T>Our Principles</T></span>
              <h2 className="font-headline-md text-ebony-deep"><T>Core Values</T></h2>
              <div className="w-16 h-[1.5px] bg-gold-leaf mt-4 mx-auto" />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {VALUES.map((val) => (
                <motion.div
                  key={val.title}
                  variants={fadeUp}
                  className="bg-surface-container-low border border-on-surface/5 p-6 md:p-8 flex flex-col items-start hover:border-gold-leaf/30 hover:shadow-level-1 transition-all"
                >
                  <div className="w-12 h-12 bg-parchment-ivory flex items-center justify-center mb-5 border border-on-surface/5">
                    <val.icon className="w-5 h-5 text-gold-leaf" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ebony-deep mb-3">{val.title}</h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{val.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-14 md:py-20 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="label-caps text-gold-leaf mb-2 block"><T>Our Journey</T></span>
              <h2 className="font-headline-md text-ebony-deep"><T>Milestones</T></h2>
              <div className="w-16 h-[1.5px] bg-gold-leaf mt-4 mx-auto" />
            </motion.div>
            <div className="max-w-2xl mx-auto">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gold-leaf shrink-0 mt-1.5" />
                    {i < TIMELINE.length - 1 && <div className="w-[1px] flex-1 bg-on-surface/10 mt-2" />}
                  </div>
                  <div className="pb-8">
                    <span className="font-mono text-xs text-gold-leaf font-bold">{item.year}</span>
                    <h4 className="font-serif text-lg font-bold text-ebony-deep mt-1 mb-2">{item.title}</h4>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-parchment-ivory/40 border-t border-b border-on-surface/5 py-14 md:py-20 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="label-caps text-gold-leaf mb-2 block"><T>Leadership</T></span>
              <h2 className="font-headline-md text-ebony-deep"><T>Our Team</T></h2>
              <div className="w-16 h-[1.5px] bg-gold-leaf mt-4 mx-auto" />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {TEAM.map((member) => (
                <motion.div
                  key={member.name}
                  variants={fadeUp}
                  className="bg-surface-container-low border border-on-surface/5 p-6 md:p-8 text-center hover:border-gold-leaf/30 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-ebony-deep flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-xl font-bold text-gold-leaf">{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-ebony-deep">{member.name}</h4>
                  <p className="font-sans text-[10px] text-gold-leaf uppercase tracking-widest font-bold mt-1 mb-3">{member.role}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-14 md:py-20 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="label-caps text-gold-leaf mb-2 block"><T>Get in Touch</T></span>
                <h2 className="font-headline-md text-ebony-deep mb-6"><T>Contact Us</T></h2>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: t("Address"), value: "Boulevard de la République, Akwa, Douala, Cameroon" },
                    { icon: Phone, label: t("Phone"), value: "+237 2 33 42 18 90" },
                    { icon: Mail, label: t("Email"), value: "advisory@adunagallery.com" },
                  ].map((contact) => (
                    <div key={contact.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-surface-container-low flex items-center justify-center shrink-0 border border-on-surface/5">
                        <contact.icon className="w-4 h-4 text-gold-leaf" />
                      </div>
                      <div>
                        <span className="font-sans text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold block mb-0.5">{contact.label}</span>
                        <span className="font-sans text-sm text-ebony-deep">{contact.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="bg-ebony-deep p-8 md:p-10 text-parchment-ivory"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <h3 className="font-serif text-xl font-medium mb-4"><T>Schedule a Private Viewing</T></h3>
                <p className="font-sans text-xs text-parchment-ivory/60 mb-6 leading-relaxed">
                  {lang === "fr"
                    ? "Arrangez un rendez-vous confidentiel pour visiter notre collection en personne dans l'un de nos salons de visite privés à Douala."
                    : "Arrange a confidential appointment to view our collection in person at our private viewing rooms in Douala."}
                </p>
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-gold-leaf text-ebony-deep font-sans text-xs font-semibold uppercase tracking-widest px-6 py-4 hover:bg-parchment-ivory transition-colors"
                >
                  <T>Book an Appointment</T> <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
