"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { ARTWORKS } from "@/lib/mockData";

const SLIDES = ARTWORKS.filter((a) => a.investment).slice(0, 5);

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const artwork = SLIDES[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] bg-ebony-deep overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={artwork.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="absolute inset-0"
        >
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ebony-deep/80 via-ebony-deep/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ebony-deep/60 via-transparent to-ebony-deep/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Lock size={12} className="text-gold-leaf" />
                <span className="label-caps text-gold-leaf">Asset of Prestige Class</span>
              </div>

              <h1 className="font-display-xl text-parchment-ivory mb-4 md:mb-6">
                {artwork.title}
              </h1>

              <p className="font-sans text-sm md:text-base text-parchment-ivory/60 max-w-lg leading-relaxed mb-2">
                {artwork.historicalStory}
              </p>

              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <span className="font-sans text-xs text-gold-leaf uppercase tracking-widest font-bold">
                  {artwork.era}
                </span>
                <span className="w-1 h-1 rounded-full bg-parchment-ivory/30" />
                <span className="font-sans text-xs text-parchment-ivory/50 uppercase tracking-wider">
                  {artwork.origin}
                </span>
                <span className="w-1 h-1 rounded-full bg-parchment-ivory/30" />
                <span className="font-sans text-xs text-parchment-ivory/50 uppercase tracking-wider">
                  {artwork.material}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  href={`/artwork/${artwork.id}`}
                  className="inline-block bg-gold-leaf text-ebony-deep font-sans text-xs font-semibold uppercase tracking-[0.1em] px-8 py-4 hover:bg-parchment-ivory transition-all duration-300 text-center"
                >
                  View Full Details
                </Link>
                <Link
                  href="/catalogue"
                  className="inline-block border border-parchment-ivory/30 text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-[0.1em] px-8 py-4 hover:border-gold-leaf hover:text-gold-leaf transition-all duration-300 text-center"
                >
                  Browse Collection
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-6 md:left-16 xl:left-20 flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-[2px] transition-all duration-500 ${
                  i === current
                    ? "w-10 bg-gold-leaf"
                    : "w-5 bg-parchment-ivory/30 hover:bg-parchment-ivory/50"
                }`}
              />
            ))}
          </div>

          {/* Nav Arrows */}
          <div className="absolute bottom-10 right-6 md:right-16 xl:right-20 flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 border border-parchment-ivory/20 flex items-center justify-center text-parchment-ivory/60 hover:border-gold-leaf hover:text-gold-leaf transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 border border-parchment-ivory/20 flex items-center justify-center text-parchment-ivory/60 hover:border-gold-leaf hover:text-gold-leaf transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] text-parchment-ivory/30 tracking-widest">
            {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </section>
  );
}
