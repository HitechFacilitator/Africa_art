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

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const TIMELINE = [
  { year: "1987", title: "Foundation", text: "Aduna Gallery established in London by a consortium of African art scholars and private collectors." },
  { year: "1994", title: "First Major Acquisition", text: "Acquired the Harrison Ife Collection, establishing our reputation in West African antiquities." },
  { year: "2003", title: "Geneva Vault", text: "Opened a dedicated climate-controlled vault in Geneva for institutional-grade artifact preservation." },
  { year: "2012", title: "Digital Authentication", text: "Pioneered blockchain-verified provenance tracking for all gallery acquisitions." },
  { year: "2021", title: "Global Expansion", text: "Expanded advisory services to Lagos, Dubai, and New York with private viewing rooms." },
  { year: "2024", title: "Aduna Intelligence", text: "Launched AI-powered curatorial advisory platform for institutional and private collectors." },
];

const VALUES = [
  { icon: ShieldCheck, title: "Authenticity First", text: "Every artifact undergoes multi-stage verification including XRF analysis, thermoluminescence testing, and independent provenance research before gallery entry." },
  { icon: Globe, title: "Cultural Stewardship", text: "We work directly with source communities, museums, and repatriation boards to ensure ethical acquisition and cultural respect." },
  { icon: Users, title: "Private Client Focus", text: "Our advisory services are exclusively designed for private collectors, family offices, and institutional portfolios seeking heritage asset diversification." },
  { icon: BookOpen, title: "Scholarly Rigor", text: "Our curatorial team includes leading academics in African art history, each piece accompanied by comprehensive research dossiers." },
];

export default function AboutPage() {
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
                <span className="label-caps text-gold-leaf">About Aduna Gallery</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-display-xl text-parchment-ivory leading-[1.08] mb-6 md:mb-8">
                Guardians of African Heritage,{" "}
                <em className="not-italic text-gold-leaf">Trusted by the Discerning</em>
              </motion.h1>
              <motion.p variants={fadeUp} className="font-sans text-sm md:text-base text-parchment-ivory/60 max-w-2xl leading-relaxed">
                Since 1987, Aduna Gallery has been the premier institution for authenticated, investment-grade African art. We bridge the worlds of cultural preservation and private wealth, offering collectors unparalleled access to the continent&apos;s most significant masterworks.
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
                <span className="label-caps text-gold-leaf mb-2 block">Our Mission</span>
                <h2 className="font-headline-md text-ebony-deep mb-6">Preserving Legacy, Empowering Collection</h2>
                <div className="space-y-4 font-sans text-sm text-on-surface-variant leading-relaxed">
                  <p>
                    Aduna Gallery exists to safeguard the artistic heritage of sub-Saharan Africa while providing private collectors and institutional portfolios with access to authenticated, investment-grade masterworks.
                  </p>
                  <p>
                    Our dual commitment to scholarly rigor and fiduciary excellence ensures that every artifact we represent carries verified provenance, scientific authentication, and a clear chain of custody — meeting the highest international standards for ethical acquisition.
                  </p>
                  <p>
                    We believe that African art represents one of the most undervalued asset classes in global collecting. Our advisory services help collectors navigate this landscape with confidence, transparency, and cultural integrity.
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
                    { num: "37+", label: "Years of Operation" },
                    { num: "€8.4M", label: "Under Custody" },
                    { num: "120+", label: "Authenticated Pieces" },
                    { num: "98%", label: "Client Retention Rate" },
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
              <span className="label-caps text-gold-leaf mb-2 block">Our Principles</span>
              <h2 className="font-headline-md text-ebony-deep">Core Values</h2>
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
              <span className="label-caps text-gold-leaf mb-2 block">Our Journey</span>
              <h2 className="font-headline-md text-ebony-deep">Milestones</h2>
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
              <span className="label-caps text-gold-leaf mb-2 block">Leadership</span>
              <h2 className="font-headline-md text-ebony-deep">Our Team</h2>
              <div className="w-16 h-[1.5px] bg-gold-leaf mt-4 mx-auto" />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { name: "Dr. Amina Okafor", role: "Founder &amp; Director", bio: "Former curator at the British Museum with 30+ years in African art scholarship. PhD from SOAS University of London." },
                { name: "Jean-Marc Dupont", role: "Head of Acquisitions", bio: "Previously at Christie&apos;s Geneva. Specialist in West African bronzes and Central African sculptural traditions." },
                { name: "Chinwe Eze", role: "Chief Authentication Officer", bio: "Materials scientist specializing in XRF and thermoluminescence testing for antiquity verification." },
              ].map((member) => (
                <motion.div
                  key={member.name}
                  variants={fadeUp}
                  className="bg-surface-container-low border border-on-surface/5 p-6 md:p-8 text-center hover:border-gold-leaf/30 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-ebony-deep flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-xl font-bold text-gold-leaf">{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-ebony-deep">{member.name}</h4>
                  <p className="font-sans text-[10px] text-gold-leaf uppercase tracking-widest font-bold mt-1 mb-3" dangerouslySetInnerHTML={{ __html: member.role }} />
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed" dangerouslySetInnerHTML={{ __html: member.bio }} />
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
                <span className="label-caps text-gold-leaf mb-2 block">Get in Touch</span>
                <h2 className="font-headline-md text-ebony-deep mb-6">Contact Us</h2>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: "Address", value: "14 Bruton Street, Mayfair, London W1J 6LX" },
                    { icon: Phone, label: "Phone", value: "+44 (0)20 7946 0958" },
                    { icon: Mail, label: "Email", value: "advisory@adunagallery.com" },
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
                <h3 className="font-serif text-xl font-medium mb-4">Schedule a Private Viewing</h3>
                <p className="font-sans text-xs text-parchment-ivory/60 mb-6 leading-relaxed">
                  Arrange a confidential appointment to view our collection in person at one of our private viewing rooms.
                </p>
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-gold-leaf text-ebony-deep font-sans text-xs font-semibold uppercase tracking-widest px-6 py-4 hover:bg-parchment-ivory transition-colors"
                >
                  Book an Appointment <ArrowRight className="w-3.5 h-3.5" />
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
