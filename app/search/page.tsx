"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Compass, ArrowRight, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ARTWORKS } from "@/lib/mockData";
import { useTranslate } from "@/lib/translations";
import { useTranslatedArtworks } from "@/lib/useTranslatedArtwork";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);
  const { lang } = useTranslate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const allTranslated = useTranslatedArtworks(ARTWORKS);

  const displayResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTranslated.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.tribe.toLowerCase().includes(q) ||
        art.origin.toLowerCase().includes(q) ||
        art.region.toLowerCase().includes(q) ||
        art.material.toLowerCase().includes(q) ||
        art.period.toLowerCase().includes(q) ||
        art.historicalStory.toLowerCase().includes(q)
    );
  }, [query, allTranslated]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Search Header */}
        <section className="bg-ebony-deep py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_60%_50%,_#C5A059_0%,_transparent_70%)]" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Search size={12} className="text-gold-leaf" />
              <span className="label-caps text-gold-leaf">{lang === "fr" ? "Résultats de Recherche" : "Search Results"}</span>
            </div>
            <h1 className="font-display-lg text-parchment-ivory mb-2">
              {query ? `Results for "${query}"` : (lang === "fr" ? "Rechercher dans la collection" : "Search the Collection")}
            </h1>
            <p className="font-sans text-sm text-parchment-ivory/60">
              {displayResults.length} artwork{displayResults.length !== 1 ? "s" : ""} {lang === "fr" ? "résultats trouvés" : "found matching your query."}
            </p>
            {/* Inline search bar */}
            <form onSubmit={handleSearchSubmit} className="mt-6 max-w-xl">
              <div className="flex items-center border border-parchment-ivory/20 bg-parchment-ivory/5 backdrop-blur-sm">
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder={lang === "fr" ? "Rechercher par titre, tribu, origine, matériau..." : "Search by title, tribe, origin, material..."}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-parchment-ivory placeholder:text-parchment-ivory/30 focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-gold-leaf/20 text-gold-leaf hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-12 md:py-16">
          {displayResults.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {displayResults.map((artwork) => (
                <motion.div key={artwork.id} variants={fadeUp}>
                  <Link href={`/artwork/${artwork.id}`} className="group block">
                    <div className="relative bg-ebony-deep overflow-hidden mb-4 aspect-[4/5]">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-ebony-deep/80 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1.5 border border-gold-leaf/20">
                        <span className="text-[9px] text-gold-leaf font-bold uppercase tracking-widest">
                          {artwork.label === "Price on Request" ? "POR" : `€${(artwork.label as number).toLocaleString()}`}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ebony-deep/90 to-transparent text-parchment-ivory">
                        <p className="text-[9px] tracking-widest text-gold-leaf uppercase font-bold">
                          {artwork.period} · {artwork.material}
                        </p>
                        <h3 className="font-serif text-base mt-0.5">{artwork.title}</h3>
                        <p className="text-[10px] text-parchment-ivory/50 mt-0.5">{artwork.origin}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Region</p>
                        <p className="font-serif text-sm text-ebony-deep font-semibold">{artwork.region}</p>
                      </div>
                      <span className="font-sans text-xs font-semibold text-gold-leaf uppercase tracking-widest inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        {lang === "fr" ? "Voir les Détails" : "View Details"} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* No Results State */
            <div className="py-24 text-center border border-dashed border-on-surface/20 bg-surface-container-lowest">
              <Compass className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-4 stroke-[1.25]" />
              <h3 className="font-serif text-2xl text-ebony-deep font-medium mb-2">
                {lang === "fr" ? "Aucun résultat trouvé" : "No Artworks Found"}
              </h3>
              <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto mb-3">
                {lang === "fr" ? "Notre catalogue ne contient pas de pièces correspondant à" : "Our curated catalogue does not currently list pieces matching"} &ldquo;{query}&rdquo;.
                {lang === "fr" ? "Nos spécialistes peuvent être en mesure de localiser des œuvres spécifiques via notre réseau privé." : "Our specialists may be able to locate specific artworks through our private network."}
              </p>
              <p className="font-sans text-xs text-on-surface-variant/60 max-w-lg mx-auto mb-8">
                {lang === "fr" ? "Contactez notre équipe de conseil pour une recherche personnalisée dans nos institutions partenaires et collections privées." : "Contact our advisory team for a bespoke search across our global partner institutions and private collections."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/booking"
                  className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-gold-leaf hover:text-ebony-deep transition-colors inline-block"
                >
                  {lang === "fr" ? "Demander une Consultation" : "Request Consultation"}
                </Link>
                <Link
                  href="/catalogue"
                  className="border border-ebony-deep/20 text-ebony-deep font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:border-gold-leaf hover:text-gold-leaf transition-colors inline-block"
                >
                  {lang === "fr" ? "Parcourir le Catalogue Complet" : "Browse Full Catalogue"}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="flex-1">
            <section className="bg-ebony-deep py-12 md:py-16">
              <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20">
                <div className="animate-pulse">
                  <div className="h-4 w-32 bg-parchment-ivory/20 mb-3" />
                  <div className="h-10 w-96 bg-parchment-ivory/20 mb-2" />
                  <div className="h-4 w-64 bg-parchment-ivory/20" />
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
