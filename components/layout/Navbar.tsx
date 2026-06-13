"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, Lock, User, ShieldCheck, Globe } from "lucide-react";
import { useTranslate } from "@/lib/translations";

const NAV_LINKS = [
  { href: "/", labelKey: "Home" },
  { href: "/catalogue", labelKey: "Catalogue" },
  { href: "/auctions", labelKey: "About Us" },
  { href: "/provenance", labelKey: "Provenance" },
  { href: "/investment", labelKey: "Advisory" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useTranslate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchOpen(false);
    setSearchQuery("");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        id="site-navbar"
        role="navigation"
        aria-label="Main navigation"
        className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-on-surface/5 transition-all duration-300 ${
          scrolled ? "shadow-level-1" : ""
        }`}
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 xl:px-20 max-w-[1440px] mx-auto h-20">

          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            className="font-serif text-2xl md:text-[1.75rem] tracking-tight font-light text-ebony-deep hover:text-gold-leaf transition-colors duration-300 select-none"
            aria-label="Aduna Gallery — Go to homepage"
          >
            ADUNA <span className="text-gold-leaf">GALLERY</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-9" role="menubar">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className={`relative font-sans text-[11px] font-semibold uppercase tracking-[0.1em] pb-0.5 transition-all duration-200 group ${
                  isActive(link.href)
                    ? "text-ebony-deep"
                    : "text-on-surface-variant/80 hover:text-ebony-deep"
                }`}
              >
                {t(link.labelKey)}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-leaf transition-transform duration-300 origin-left ${
                    isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "fr" : "en")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest border border-on-surface/10 hover:border-gold-leaf/40 text-on-surface-variant/70 hover:text-gold-leaf transition-all cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe size={12} />
              {lang === "en" ? "FR" : "EN"}
            </button>

            {/* Search */}
            <button
              id="nav-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the collection registry"
              className="p-1.5 text-on-surface-variant/70 hover:text-gold-leaf transition-colors duration-300 cursor-pointer"
            >
              <Search size={18} strokeWidth={2} />
            </button>

            {/* Collector Login */}
            <Link
              href="/login"
              id="nav-login-btn"
              aria-label="Collector login"
              className="p-1.5 text-on-surface-variant/70 hover:text-gold-leaf transition-colors duration-300"
            >
              <User size={18} strokeWidth={2} />
            </Link>

            {/* Request Private Access CTA */}
            <Link
              href="/price-on-request"
              id="nav-access-btn"
              className="bg-ebony-deep text-parchment-ivory font-sans text-[10px] font-semibold uppercase tracking-[0.08em] px-5 py-3 hover:bg-gold-leaf hover:text-ebony-deep transition-all duration-300 border border-transparent hover:border-gold-leaf/20 shadow-sm whitespace-nowrap"
            >
              {t("Request Private Access")}
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Language Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "fr" : "en")}
              className="p-2 text-on-surface-variant hover:text-gold-leaf transition-colors flex items-center gap-1"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              <span className="text-[10px] font-bold uppercase">{lang === "en" ? "FR" : "EN"}</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 text-on-surface-variant hover:text-gold-leaf transition-colors"
            >
              <Search size={19} strokeWidth={2} />
            </button>
            <button
              id="nav-mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              className="p-2 text-ebony-deep hover:text-gold-leaf transition-colors duration-300"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-ebony-deep/30 backdrop-blur-sm" />
          <nav
            className="absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-background flex flex-col justify-between shadow-2xl border-l border-on-surface/8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            <div className="flex justify-between items-center px-8 h-20 border-b border-on-surface/5">
              <span className="font-serif text-lg tracking-tight text-ebony-deep">
                ADUNA <span className="text-gold-leaf">GALLERY</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-on-surface-variant hover:text-gold-leaf transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 flex flex-col px-8 py-10 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-4 font-serif text-xl border-b border-on-surface/6 flex justify-between items-center transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-gold-leaf"
                      : "text-ebony-deep hover:text-gold-leaf"
                  }`}
                >
                  {t(link.labelKey)}
                  {isActive(link.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-leaf" />
                  )}
                </Link>
              ))}

              <Link
                href="/dashboard"
                className="py-4 font-serif text-xl border-b border-on-surface/6 flex items-center gap-2 text-on-surface-variant hover:text-gold-leaf transition-colors duration-200"
              >
                <Lock size={16} />
                {t("Collector Portal")}
              </Link>
            </div>

            <div className="px-8 pb-10 space-y-4">
              <Link
                href="/price-on-request"
                className="block w-full bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-wider py-4 text-center hover:bg-gold-leaf hover:text-ebony-deep transition-all duration-300"
              >
                {t("Request Private Access")}
              </Link>
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-semibold tracking-widest text-on-surface-variant/50">
                <ShieldCheck size={12} />
                {t("Institutional Trust & Heritage Preservation")}
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Global Search Dialog */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 bg-ebony-deep/50 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-background border-l-4 border-gold-leaf p-8 max-w-lg w-full shadow-2xl relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-gold-leaf transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <h2 className="font-serif text-xl text-ebony-deep mb-1">
                {t("Search the Collection")}
              </h2>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {lang === "en"
                  ? "Explore our curated catalogue of museum-grade African artworks. Search by title, origin, tribe, or material."
                  : "Explorez notre catalogue d'œuvres d'art africain de qualité muséale. Recherchez par titre, origine, tribu ou matériau."}
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <input
                type="text"
                autoFocus
                required
                placeholder={lang === "en" ? "e.g. Benin Bronze, Ife Terracotta, Fang Guardian..." : "ex. Bronze du Bénin, Terre cuite d'Ife, Gardien Fang..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border-b border-ebony-deep/20 focus:border-gold-leaf px-2 py-3 placeholder:text-on-surface-variant/40 text-ebony-deep font-sans text-sm leading-none focus:outline-none rounded-none transition-colors"
              />
              <div className="flex justify-end space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-2 text-xs font-sans font-semibold uppercase tracking-wider text-on-surface-variant/70 hover:text-ebony-deep transition-colors cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-ebony-deep text-parchment-ivory px-5 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-gold-leaf hover:text-ebony-deep transition-colors duration-300 cursor-pointer"
                >
                  {t("Search Collection")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
