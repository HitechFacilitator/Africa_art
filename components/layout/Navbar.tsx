"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, Lock, User, ShieldCheck, ChevronDown } from "lucide-react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";

const EXPLORER_LINKS = [
  { href: "/catalogue", labelKey: "Catalogue" },
  { href: "/about", labelKey: "About Us" },
  { href: "/provenance", labelKey: "Provenance" },
  { href: "/investment", labelKey: "Advisory" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useTranslate();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const explorerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setSearchOpen(false);
    setExplorerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (explorerRef.current && !explorerRef.current.contains(e.target as Node)) {
        setExplorerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const isExplorerActive = EXPLORER_LINKS.some((link) => isActive(link.href));

  return (
    <>
      <nav
        id="site-navbar"
        role="navigation"
        aria-label="Main navigation"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-on-surface/[0.04] shadow-level-1"
            : "bg-background/60 backdrop-blur-lg border-b border-on-surface/[0.02]"
        }`}
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 xl:px-20 max-w-[1440px] mx-auto h-20">

          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            className="font-serif text-2xl md:text-[1.75rem] tracking-tight font-light text-ebony-deep hover:text-gold-leaf transition-colors duration-300 select-none shrink-0"
            aria-label="Aduna Gallery — Go to homepage"
          >
            ADUNA <span className="text-gold-leaf">GALLERY</span>
          </Link>

          {/* Desktop Nav — Home + Explorer */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {/* Home */}
            <Link
              href="/"
              role="menuitem"
              className={`relative font-sans text-[11px] font-semibold uppercase tracking-[0.1em] pb-0.5 transition-all duration-200 group ${
                isActive("/")
                  ? "text-ebony-deep"
                  : "text-on-surface-variant/80 hover:text-ebony-deep"
              }`}
            >
              {t("Home")}
              <span
                className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-leaf transition-transform duration-300 origin-left ${
                  isActive("/") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>

            {/* Explorer Dropdown */}
            <div ref={explorerRef} className="relative">
              <button
                onClick={() => setExplorerOpen(!explorerOpen)}
                className={`relative font-sans text-[11px] font-semibold uppercase tracking-[0.1em] pb-0.5 transition-all duration-200 group flex items-center gap-1.5 cursor-pointer ${
                  isExplorerActive && !explorerOpen
                    ? "text-ebony-deep"
                    : explorerOpen
                      ? "text-ebony-deep"
                      : "text-on-surface-variant/80 hover:text-ebony-deep"
                }`}
              >
                {t("Explorer")}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${explorerOpen ? "rotate-180" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-leaf transition-transform duration-300 origin-left ${
                    isExplorerActive || explorerOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 pt-3 transition-all duration-200 ${
                  explorerOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
                }`}
              >
                <div className="bg-background/95 backdrop-blur-xl border border-on-surface/[0.06] shadow-xl min-w-[200px] py-2">
                  {EXPLORER_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setExplorerOpen(false)}
                      className={`block px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.08em] transition-all duration-150 ${
                        isActive(link.href)
                          ? "text-gold-leaf bg-gold-leaf/5"
                          : "text-on-surface-variant/80 hover:text-ebony-deep hover:bg-surface-container-low"
                      }`}
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Language Toggle */}
            <div className="flex items-center bg-surface-container-low/80 rounded-full p-0.5">
              <button
                onClick={() => setLang("en")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                  lang === "en"
                    ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                    : "text-on-surface-variant/60 hover:text-ebony-deep"
                }`}
                aria-label="Switch to English"
              >
                <span className="text-sm leading-none">🇬🇧</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => setLang("fr")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                  lang === "fr"
                    ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                    : "text-on-surface-variant/60 hover:text-ebony-deep"
                }`}
                aria-label="Passer en français"
              >
                <span className="text-sm leading-none">🇫🇷</span>
                <span>FR</span>
              </button>
            </div>

            {/* Search */}
            <button
              id="nav-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the collection registry"
              className="p-2 text-on-surface-variant/60 hover:text-gold-leaf transition-colors duration-300 cursor-pointer"
            >
              <Search size={17} strokeWidth={1.5} />
            </button>

            {/* Collector Login / Dashboard */}
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              id="nav-login-btn"
              aria-label={isAuthenticated ? "Go to dashboard" : "Collector login"}
              className="p-2 text-on-surface-variant/60 hover:text-gold-leaf transition-colors duration-300"
            >
              <User size={17} strokeWidth={1.5} />
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-on-surface/10" />

            {/* Request Private Access CTA */}
            <Link
              href="/price-on-request"
              id="nav-access-btn"
              className="bg-ebony-deep text-parchment-ivory font-sans text-[10px] font-semibold uppercase tracking-[0.08em] px-5 py-2.5 hover:bg-gold-leaf hover:text-ebony-deep transition-all duration-300 whitespace-nowrap"
            >
              {t("Request Private Access")}
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Language Toggle */}
            <div className="flex items-center bg-surface-container-low/80 rounded-full p-0.5">
              <button
                onClick={() => setLang("en")}
                className={`flex items-center gap-1 px-2 py-1.5 text-[9px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                  lang === "en"
                    ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                    : "text-on-surface-variant/60"
                }`}
                aria-label="Switch to English"
              >
                <span className="text-xs leading-none">🇬🇧</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => setLang("fr")}
                className={`flex items-center gap-1 px-2 py-1.5 text-[9px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                  lang === "fr"
                    ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                    : "text-on-surface-variant/60"
                }`}
                aria-label="Passer en français"
              >
                <span className="text-xs leading-none">🇫🇷</span>
                <span>FR</span>
              </button>
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 text-on-surface-variant hover:text-gold-leaf transition-colors"
            >
              <Search size={19} strokeWidth={1.5} />
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
              <Link
                href="/"
                className={`py-4 font-serif text-xl border-b border-on-surface/6 flex justify-between items-center transition-colors duration-200 ${
                  isActive("/") ? "text-gold-leaf" : "text-ebony-deep hover:text-gold-leaf"
                }`}
              >
                {t("Home")}
                {isActive("/") && <span className="w-1.5 h-1.5 rounded-full bg-gold-leaf" />}
              </Link>

              {/* Explorer Section in Mobile */}
              <div className="py-4 border-b border-on-surface/6">
                <p className="font-serif text-xl text-on-surface-variant/50 mb-3">{t("Explorer")}</p>
                <div className="flex flex-col gap-1 pl-4">
                  {EXPLORER_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`py-2.5 font-sans text-sm flex justify-between items-center transition-colors duration-200 ${
                        isActive(link.href)
                          ? "text-gold-leaf font-medium"
                          : "text-ebony-deep/80 hover:text-gold-leaf"
                      }`}
                    >
                      {t(link.labelKey)}
                      {isActive(link.href) && <span className="w-1.5 h-1.5 rounded-full bg-gold-leaf" />}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/dashboard"
                className="py-4 font-serif text-xl border-b border-on-surface/6 flex items-center gap-2 text-on-surface-variant hover:text-gold-leaf transition-colors duration-200"
              >
                <Lock size={16} />
                {t("Collector Portal")}
              </Link>
            </div>

            <div className="px-8 pb-10 space-y-4">
              {/* Mobile Drawer Language Selector */}
              <div className="flex items-center bg-surface-container-low rounded-full p-0.5">
                <button
                  onClick={() => setLang("en")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                    lang === "en"
                      ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                      : "text-on-surface-variant/60 hover:text-ebony-deep"
                  }`}
                >
                  <span className="text-xs leading-none">🇬🇧</span>
                  <span>English</span>
                </button>
                <button
                  onClick={() => setLang("fr")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                    lang === "fr"
                      ? "bg-ebony-deep text-parchment-ivory shadow-sm"
                      : "text-on-surface-variant/60 hover:text-ebony-deep"
                  }`}
                >
                  <span className="text-xs leading-none">🇫🇷</span>
                  <span>Français</span>
                </button>
              </div>
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
