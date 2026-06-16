"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight, CheckCircle, AlertTriangle, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useArtworks } from "@/lib/hooks";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtwork } from "@/lib/useTranslatedArtwork";
import type { Artwork } from "@/lib/types";
import AuthGuard from "@/components/AuthGuard";

const RESERVATION_DURATION = 48 * 60 * 60;

export default function ReservationPage() {
  const { lang } = useTranslate();
  const { artworks: apiArtworks } = useArtworks();
  const artwork = useTranslatedArtwork((apiArtworks as unknown as Artwork[])[0]);
  const [timeLeft, setTimeLeft] = useState(RESERVATION_DURATION);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setConfirmed(true), 500);
    return () => clearTimeout(t);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = ((RESERVATION_DURATION - timeLeft) / RESERVATION_DURATION) * 100;

  return (
    <AuthGuard permission="reserve_48h">
      <>
        <Navbar />
        <main className="flex-1">
        <section className="bg-ebony-deep py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">{lang === "fr" ? "Réservation Privée 48h" : "Private 48h Reservation"}</span>
            </div>
            <h1 className="font-display-lg text-parchment-ivory mb-2">
              {lang === "fr" ? "Réservation Confirmée" : "Reservation Confirmed"}
            </h1>
            <p className="font-sans text-sm text-parchment-ivory/60 max-w-lg">
              {lang === "fr"
                ? "Votre œuvre est réservée en toute sécurité. Vous avez 48 heures pour compléter l'acquisition."
                : "Your artwork is securely held. You have 48 hours to complete the purchase."}
            </p>
          </div>
        </section>

        <div className="max-w-[1000px] mx-auto px-6 md:px-16 py-12 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <CheckCircle className="w-16 h-16 text-gold-leaf mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-ebony-deep mb-3">
              {lang === "fr" ? "Œuvre Réservée avec Succès" : "Artwork Successfully Reserved"}
            </h2>
            <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
              {lang === "fr"
                ? "Un email de confirmation a été envoyé. La minuterie de 48 heures a commencé."
                : "A confirmation email has been sent. The 48-hour countdown has begun."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-surface-container-lowest border border-on-surface/5 p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-40 h-48 bg-ebony-deep/5 overflow-hidden border border-on-surface/5 shrink-0">
                    <img src={artwork.imageUrl} alt={artwork.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="font-serif text-lg text-ebony-deep">{artwork.title}</h3>
                    <p className="font-sans text-xs text-on-surface-variant">{artwork.origin} · {artwork.period}</p>
                    <p className="font-sans text-xs text-on-surface-variant">{artwork.material}</p>
                    <div className="mt-2">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                        {lang === "fr" ? "Valeur estimée" : "Estimated Value"}
                      </span>
                      <p className="font-serif text-xl text-ebony-deep font-semibold">{artwork.investment?.estimatedValue || "Price on Request"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low border border-on-surface/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={14} className="text-gold-leaf" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                    {lang === "fr" ? "Conditions de Réservation" : "Reservation Terms"}
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                    {lang === "fr" ? "L'œuvre est retirée de la vente publique pendant 48 heures" : "Artwork is removed from public sale for 48 hours"}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                    {lang === "fr" ? "Aucun autre collectionneur ne peut acheter cette pièce" : "No other collector can purchase this piece"}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                    {lang === "fr" ? "Vous pouvez acheter à tout moment pendant le délai" : "You can purchase at any time during the window"}
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={12} className="text-amber-600 mt-0.5 shrink-0" />
                    {lang === "fr" ? "Après 48 heures, la réservation expire automatiquement" : "After 48 hours, reservation expires automatically"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-surface-container-low border border-on-surface/5 p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">
                    {lang === "fr" ? "Temps Restant" : "Time Remaining"}
                  </p>
                  <p className={`font-mono text-4xl text-ebony-deep font-bold tracking-wider ${timeLeft < 3600 ? "animate-pulse text-terracotta-earth" : ""}`}>
                    {formatTimer(timeLeft)}
                  </p>
                  <div className="w-full bg-on-surface/10 h-1 mt-4">
                    <div
                      className="bg-gold-leaf h-1 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/acquisition?artwork=${artwork.id}`}
                    className="w-full bg-ebony-deep text-parchment-ivory py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors flex items-center justify-center gap-2 border-0"
                  >
                    {lang === "fr" ? "Acheter Maintenant" : "Buy Now"} <ArrowRight size={14} />
                  </Link>
                  <button className="w-full border border-on-surface/20 text-on-surface-variant py-3 text-xs uppercase tracking-widest font-bold hover:border-gold-leaf hover:text-gold-leaf transition-colors bg-transparent cursor-pointer flex items-center justify-center gap-2">
                    <Mail size={14} /> {lang === "fr" ? "Contacter un Expert" : "Contact an Expert"}
                  </button>
                </div>

                <div className="mt-6 bg-surface-container-high/40 p-4 border-l border-gold-leaf text-xs text-on-surface-variant">
                  <strong>{lang === "fr" ? "Besoin de plus de temps ?" : "Need more time?"}</strong>{" "}
                  {lang === "fr"
                    ? "Demandez une extension à notre équipe curatoriale. Des extensions manuelles peuvent être accordées pour les collectionneurs vérifiés."
                    : "Request an extension from our curatorial team. Manual extensions may be granted for verified collectors."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      </>
    </AuthGuard>
  );
}
