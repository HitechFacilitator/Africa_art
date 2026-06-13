"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

type Lang = "en" | "fr";

interface TranslationCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (text: string) => string;
  tAsync: (text: string) => Promise<string>;
}

const Ctx = createContext<TranslationCtx>({
  lang: "en",
  setLang: () => {},
  t: (s) => s,
  tAsync: async (s) => s,
});

export function useTranslate() {
  return useContext(Ctx);
}

/* ── Dictionary for common UI strings (instant, no API call) ── */
const DICT: Record<string, Record<Lang, string>> = {
  // Nav
  "Home": { en: "Home", fr: "Accueil" },
  "Catalogue": { en: "Catalogue", fr: "Catalogue" },
  "About Us": { en: "About Us", fr: "À Propos" },
  "Provenance": { en: "Provenance", fr: "Provenance" },
  "Advisory": { en: "Advisory", fr: "Conseil" },
  "Request Private Access": { en: "Request Private Access", fr: "Demander un Accès Privé" },
  "Collector Portal": { en: "Collector Portal", fr: "Espace Collectionneur" },
  "Search the Collection": { en: "Search the Collection", fr: "Rechercher dans la Collection" },
  "Search": { en: "Search", fr: "Rechercher" },
  "Cancel": { en: "Cancel", fr: "Annuler" },
  "Search Collection": { en: "Search Collection", fr: "Rechercher" },

  // Footer
  "Collections": { en: "Collections", fr: "Collections" },
  "Browse Catalogue": { en: "Browse Catalogue", fr: "Parcourir le Catalogue" },
  "Private Catalogue": { en: "Private Catalogue", fr: "Catalogue Privé" },
  "Price on Request": { en: "Price on Request", fr: "Prix sur Demande" },
  "Investment Advisory": { en: "Investment Advisory", fr: "Conseil en Investissement" },
  "Consultation Booking": { en: "Consultation Booking", fr: "Réservation de Consultation" },
  "Provenance & Authenticity": { en: "Provenance & Authenticity", fr: "Provenance & Authentification" },
  "Certificates": { en: "Certificates", fr: "Certificats" },
  "Collector Services": { en: "Collector Services", fr: "Services Collectionneur" },
  "Collector Dashboard": { en: "Collector Dashboard", fr: "Tableau de Bord" },
  "Secure Acquisition": { en: "Secure Acquisition", fr: "Acquisition Sécurisée" },
  "Client Login": { en: "Client Login", fr: "Connexion Client" },
  "Legal": { en: "Legal", fr: "Juridique" },
  "Provenance Standards": { en: "Provenance Standards", fr: "Standards de Provenance" },
  "Legal & Compliance": { en: "Legal & Compliance", fr: "Juridique & Conformité" },
  "Shipping & Insurance": { en: "Shipping & Insurance", fr: "Expédition & Assurance" },
  "Privacy Policy": { en: "Privacy Policy", fr: "Politique de Confidentialité" },
  "All rights reserved.": { en: "All rights reserved.", fr: "Tous droits réservés." },
  "Provenance Charter": { en: "Provenance Charter", fr: "Charte de Provenance" },

  // About Page
  "About Aduna Gallery": { en: "About Aduna Gallery", fr: "À Propos d'Aduna Gallery" },
  "Guardians of African Heritage,": { en: "Guardians of African Heritage,", fr: "Gardiens du Patrimoine Africain," },
  "Trusted by the Discerning": { en: "Trusted by the Discerning", fr: "La Confiance des Connaisseurs" },
  "Our Mission": { en: "Our Mission", fr: "Notre Mission" },
  "Preserving Legacy, Empowering Collection": { en: "Preserving Legacy, Empowering Collection", fr: "Préserver l'Héritage, Favoriser la Collection" },
  "Our Principles": { en: "Our Principles", fr: "Nos Principes" },
  "Core Values": { en: "Core Values", fr: "Valeurs Fondamentales" },
  "Our Journey": { en: "Our Journey", fr: "Notre Parcours" },
  "Milestones": { en: "Milestones", fr: "Jalons" },
  "Leadership": { en: "Leadership", fr: "Direction" },
  "Our Team": { en: "Our Team", fr: "Notre Équipe" },
  "Get in Touch": { en: "Get in Touch", fr: "Contactez-Nous" },
  "Contact Us": { en: "Contact Us", fr: "Contactez-Nous" },
  "Schedule a Private Viewing": { en: "Schedule a Private Viewing", fr: "Planifier une Visite Privée" },
  "Book an Appointment": { en: "Book an Appointment", fr: "Prendre Rendez-vous" },
  "Address": { en: "Address", fr: "Adresse" },
  "Phone": { en: "Phone", fr: "Téléphone" },
  "Email": { en: "Email", fr: "E-mail" },
  "Years of Operation": { en: "Years of Operation", fr: "Années d'Activité" },
  "Under Custody": { en: "Under Custody", fr: "Sous Garde" },
  "Authenticated Pieces": { en: "Authenticated Pieces", fr: "Pièces Authentifiées" },
  "Client Retention Rate": { en: "Client Retention Rate", fr: "Taux de Fidélisation" },

  // Hero
  "Premium African Art": { en: "Premium African Art", fr: "Art Africain Premium" },
  "Explore Our Collection": { en: "Explore Our Collection", fr: "Découvrir Notre Collection" },
  "Discover How": { en: "Discover How", fr: "Découvrir" },
  "Join the Collector's Club": { en: "Join the Collector's Club", fr: "Rejoignez le Club des Collectionneurs" },
  "Exclusive access to museum-grade African art.": { en: "Exclusive access to museum-grade African art.", fr: "Accès exclusif à l'art africain de qualité muséale." },
  "Request Access": { en: "Request Access", fr: "Demander l'Accès" },
  "The Art Newspaper": { en: "The Art Newspaper", fr: "The Art Newspaper" },
  "Financial Times": { en: "Financial Times", fr: "Financial Times" },
  "Sotheby's": { en: "Sotheby's", fr: "Sotheby's" },
  "Christie's": { en: "Christie's", fr: "Christie's" },

  // Common
  "Loading...": { en: "Loading...", fr: "Chargement..." },
  "Read More": { en: "Read More", fr: "Lire la Suite" },
  "View Details": { en: "View Details", fr: "Voir les Détails" },
  "Inquire": { en: "Inquire", fr: "Enquêter" },
  "Reserve": { en: "Reserve", fr: "Réserver" },
  "Purchase": { en: "Purchase", fr: "Acheter" },
  "Back": { en: "Back", fr: "Retour" },
  "Close": { en: "Close", fr: "Fermer" },
  "Submit": { en: "Submit", fr: "Soumettre" },
  "Save": { en: "Save", fr: "Enregistrer" },
  "Delete": { en: "Delete", fr: "Supprimer" },
  "Edit": { en: "Edit", fr: "Modifier" },
  "Next": { en: "Next", fr: "Suivant" },
  "Previous": { en: "Previous", fr: "Précédent" },
  "Sold": { en: "Sold", fr: "Vendu" },
  "Available": { en: "Available", fr: "Disponible" },
  "Reserved": { en: "Reserved", fr: "Réservé" },

  // Filters
  "Region": { en: "Region", fr: "Région" },
  "Tribe": { en: "Tribe", fr: "Tribu" },
  "Material": { en: "Material", fr: "Matériau" },
  "All Regions": { en: "All Regions", fr: "Toutes les Régions" },
  "All Tribes": { en: "All Tribes", fr: "Toutes les Tribus" },
  "All Materials": { en: "All Materials", fr: "Tous les Matériaux" },
  "Clear All": { en: "Clear All", fr: "Tout Effacer" },

  // Dashboard
  "Dashboard": { en: "Dashboard", fr: "Tableau de Bord" },
  "Portfolio": { en: "Portfolio", fr: "Portefeuille" },
  "Inquiries": { en: "Inquiries", fr: "Demandes" },
  "Settings": { en: "Settings", fr: "Paramètres" },
  "Security": { en: "Security", fr: "Sécurité" },
  "Logistics": { en: "Logistics", fr: "Logistique" },
  "Consultations": { en: "Consultations", fr: "Consultations" },
  "Logout": { en: "Logout", fr: "Déconnexion" },

  // Language
  "EN": { en: "EN", fr: "EN" },
  "FR": { en: "FR", fr: "FR" },
};

/* ── Google Translate free API (no key required) ── */
const GT_CACHE: Map<string, string> = new Map();

async function googleTranslate(text: string, target: Lang): Promise<string> {
  if (!text.trim()) return text;
  const cacheKey = `${text}→${target}`;
  if (GT_CACHE.has(cacheKey)) return GT_CACHE.get(cacheKey)!;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = data[0].map((s: string[]) => s[0]).join("");
    GT_CACHE.set(cacheKey, translated);

    // Persist to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("aduna_gt_cache") || "{}");
      stored[cacheKey] = translated;
      localStorage.setItem("aduna_gt_cache", JSON.stringify(stored));
    } catch {}

    return translated;
  } catch {
    return text;
  }
}

/* ── Provider ── */
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const mounted = useRef(false);

  // Load saved language preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aduna_lang") as Lang | null;
      if (saved === "fr" || saved === "en") setLangState(saved);
    } catch {}
    // Load GT cache from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("aduna_gt_cache") || "{}");
      Object.entries(stored).forEach(([k, v]) => GT_CACHE.set(k, v as string));
    } catch {}
    mounted.current = true;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("aduna_lang", l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  /** Synchronous translate — uses dictionary or cached Google Translate */
  const t = useCallback(
    (text: string): string => {
      if (lang === "en") return text;
      // Check dictionary first
      if (DICT[text]?.[lang]) return DICT[text][lang];
      // Check GT cache
      const cacheKey = `${text}→${lang}`;
      if (GT_CACHE.has(cacheKey)) return GT_CACHE.get(cacheKey)!;
      // Return original (will be async-translated on mount)
      return text;
    },
    [lang]
  );

  /** Async translate — fetches from Google Translate if not cached */
  const tAsync = useCallback(
    async (text: string): Promise<string> => {
      if (lang === "en") return text;
      if (DICT[text]?.[lang]) return DICT[text][lang];
      return googleTranslate(text, lang);
    },
    [lang]
  );

  return (
    <Ctx.Provider value={{ lang, setLang, t, tAsync }}>
      {children}
    </Ctx.Provider>
  );
}
