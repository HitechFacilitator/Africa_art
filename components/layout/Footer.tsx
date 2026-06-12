"use client";

import Link from "next/link";
import { ShieldCheck, Globe } from "lucide-react";

const FOOTER_LINKS = {
  Collections: [
    { label: "Browse Catalogue", href: "/catalogue" },
    { label: "Private Catalogue", href: "/catalogue/private" },
    { label: "About Us", href: "/auctions" },
    { label: "Price on Request", href: "/price-on-request" },
  ],
  Advisory: [
    { label: "Investment Advisory", href: "/investment" },
    { label: "Consultation Booking", href: "/booking" },
    { label: "Provenance & Authenticity", href: "/provenance" },
    { label: "Certificates", href: "/dashboard/certificates" },
  ],
  "Collector Services": [
    { label: "Collector Dashboard", href: "/dashboard" },
    { label: "Secure Acquisition", href: "/acquisition" },
    { label: "Client Login", href: "/login" },
    { label: "Request Private Access", href: "/price-on-request" },
  ],
  Legal: [
    { label: "Provenance Standards", href: "#provenance-standards" },
    { label: "Legal & Compliance", href: "#compliance" },
    { label: "Shipping & Insurance", href: "#logistics" },
    { label: "Privacy Policy", href: "#privacy" },
  ],
};

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="bg-ebony-deep text-parchment-ivory/80 border-t border-gold-leaf/20 mt-auto"
    >
      {/* ── Main Footer Grid ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* ── Brand Column ── */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link
              href="/"
              className="font-serif text-2xl font-light tracking-tight text-gold-leaf hover:opacity-90 transition-opacity"
            >
              ADUNA <span className="text-parchment-ivory/90">GALLERY</span>
            </Link>

            <p className="font-sans text-xs text-parchment-ivory/50 leading-relaxed max-w-xs">
              A luxury digital platform dedicated to the exhibition, promotion,
              and investment management of prestigious African artworks. Trusted
              by collectors, museums, and institutions worldwide.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <ShieldCheck size={12} className="text-gold-leaf/70" />
                Institutional Trust & Heritage Preservation
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-parchment-ivory/40">
                <Globe size={12} className="text-gold-leaf/70" />
                UNIDROIT 1970 Compliance Certified
              </div>
            </div>
          </div>

          {/* ── Link Columns ── */}
          <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-parchment-ivory/60 mb-1">
                  {category}
                </h3>
                {links.map((link) => (
                  <Link
                    key={link.href}
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

      {/* ── Bottom Bar ── */}
      <div className="border-t border-gold-leaf/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-sans text-[10px] text-parchment-ivory/30 uppercase tracking-wider">
            © 2024–2026 Aduna Gallery. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#compliance"
              className="font-sans text-[10px] uppercase tracking-wider text-parchment-ivory/30 hover:text-gold-leaf/70 transition-colors"
            >
              Legal &amp; Compliance
            </Link>
            <Link
              href="#privacy"
              className="font-sans text-[10px] uppercase tracking-wider text-parchment-ivory/30 hover:text-gold-leaf/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#provenance-standards"
              className="font-sans text-[10px] uppercase tracking-wider text-parchment-ivory/30 hover:text-gold-leaf/70 transition-colors"
            >
              Provenance Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
