"use client";

import Link from "next/link";
import { ShieldCheck, Globe } from "lucide-react";
import { useTranslate } from "@/lib/translations";

export default function Footer() {
  const { t } = useTranslate();

  const FOOTER_LINKS = {
    [t("Collections")]: [
      { label: t("Browse Catalogue"), href: "/catalogue" },
      { label: t("Private Catalogue"), href: "/catalogue/private" },
      { label: t("About Us"), href: "/about" },
      { label: t("Price on Request"), href: "/price-on-request" },
    ],
    [t("Advisory")]: [
      { label: t("Investment Advisory"), href: "/investment" },
      { label: t("Consultation Booking"), href: "/booking" },
      { label: t("Provenance & Authenticity"), href: "/provenance" },
      { label: t("Certificates"), href: "/dashboard/certificates" },
    ],
    [t("Collector Services")]: [
      { label: t("Collector Dashboard"), href: "/dashboard" },
      { label: t("Secure Acquisition"), href: "/acquisition" },
      { label: t("Client Login"), href: "/login" },
      { label: t("Request Private Access"), href: "/price-on-request" },
    ],
    [t("Legal")]: [
      { label: t("Provenance Standards"), href: "#provenance-standards" },
      { label: t("Legal & Compliance"), href: "#compliance" },
      { label: t("Shipping & Insurance"), href: "#logistics" },
      { label: t("Privacy Policy"), href: "#privacy" },
    ],
  };

  return (
    <footer
      id="site-footer"
      className="bg-ebony-deep text-parchment-ivory/80 border-t border-gold-leaf/20 mt-auto"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link
              href="/"
              className="font-serif text-2xl font-light tracking-tight text-gold-leaf hover:opacity-90 transition-opacity"
            >
              ADUNA <span className="text-parchment-ivory/90">GALLERY</span>
            </Link>

            <p className="font-sans text-xs text-parchment-ivory/50 leading-relaxed max-w-xs">
              {t("A luxury digital platform dedicated to the exhibition, promotion, and investment management of prestigious African artworks. Trusted by collectors, museums, and institutions worldwide.")}
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <ShieldCheck size={12} className="text-gold-leaf/70" />
                {t("Institutional Trust & Heritage Preservation")}
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <Globe size={12} className="text-gold-leaf/70" />
                UNIDROIT 1970 {t("Compliance Certified")}
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-parchment-ivory/60 mb-1">
                  {category}
                </h3>
                {links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="font-sans text-xs text-parchment-ivory/50 hover:text-gold-leaf transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-leaf/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-sans text-[10px] text-parchment-ivory/30 uppercase tracking-wider">
            © 2024–2026 Aduna Gallery. {t("All rights reserved.")}
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#compliance"
              className="font-sans text-[10px] uppercase tracking-wider text-parchment-ivory/30 hover:text-gold-leaf/70 transition-colors"
            >
              {t("Legal & Compliance")}
            </Link>
            <Link
              href="#privacy"
              className="font-sans text-[10px] uppercase tracking-wider text-parchment-ivory/30 hover:text-gold-leaf/70 transition-colors"
            >
              {t("Privacy Policy")}
            </Link>
            <Link
              href="#provenance-standards"
              className="font-sans text-[10px] uppercase tracking-wider text-parchment-ivory/30 hover:text-gold-leaf/70 transition-colors"
            >
              {t("Provenance Charter")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
