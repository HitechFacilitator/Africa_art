"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslate } from "./translations";
import type { Artwork } from "./types";

const ART_CACHE_KEY = "aduna_art_translations";

function loadArtCache(): Record<string, Record<string, string>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ART_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveArtCache(cache: Record<string, Record<string, string>>) {
  try {
    localStorage.setItem(ART_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // storage full — ignore
  }
}

const TEXT_FIELDS: (keyof Artwork)[] = [
  "title",
  "region",
  "tribe",
  "material",
  "period",
  "era",
  "origin",
  "dimensions",
  "historicalStory",
  "investmentThesis",
  "preservationStatus",
  "appreciationRate",
];

const INVESTMENT_FIELDS: (keyof NonNullable<Artwork["investment"]>)[] = [
  "estimatedValue",
];

async function translateArtworkFields(
  artwork: Artwork,
  lang: string,
  tAsync: (text: string) => Promise<string>,
  artCache: Record<string, Record<string, string>>
): Promise<Artwork> {
  const updates: Partial<Artwork> = {};
  const artId = artwork.id;
  if (!artCache[artId]) artCache[artId] = {};

  for (const field of TEXT_FIELDS) {
    const val = artwork[field];
    if (typeof val !== "string" || !val) continue;
    const cacheKey = `${field}→${lang}`;
    if (artCache[artId][cacheKey]) {
      (updates as Record<string, string>)[field] = artCache[artId][cacheKey];
      continue;
    }
    try {
      const t = await tAsync(val);
      if (t !== val) {
        artCache[artId][cacheKey] = t;
        (updates as Record<string, string>)[field] = t;
      }
    } catch { /* keep original */ }
  }

  if (artwork.provenance?.length) {
    const provCacheKey = `provenance→${lang}`;
    if (artCache[artId][provCacheKey]) {
      updates.provenance = JSON.parse(artCache[artId][provCacheKey]);
    } else {
      const translatedProv = await Promise.all(artwork.provenance.map((line) => tAsync(line)));
      artCache[artId][provCacheKey] = JSON.stringify(translatedProv);
      updates.provenance = translatedProv;
    }
  }

  if (artwork.investment) {
    const newInvestment = { ...artwork.investment };
    for (const field of INVESTMENT_FIELDS) {
      const val = artwork.investment[field];
      if (typeof val !== "string" || !val) continue;
      const cacheKey = `investment.${field}→${lang}`;
      if (artCache[artId][cacheKey]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newInvestment as any)[field] = artCache[artId][cacheKey];
        continue;
      }
      try {
        const t = await tAsync(val);
        if (t !== val) {
          artCache[artId][cacheKey] = t;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (newInvestment as any)[field] = t;
        }
      } catch { /* keep original */ }
    }
    updates.investment = newInvestment;
  }

  return { ...artwork, ...updates } as Artwork;
}

/**
 * Translates a single artwork's text fields to the current language.
 */
export function useTranslatedArtwork(artwork: Artwork): Artwork {
  const { lang, tAsync } = useTranslate();
  const [translated, setTranslated] = useState<Artwork>(artwork);
  const artworkRef = useRef(artwork);
  artworkRef.current = artwork;

  useEffect(() => {
    if (lang === "en") {
      setTranslated(artworkRef.current);
      return;
    }

    let cancelled = false;
    const cache = loadArtCache();

    translateArtworkFields(artworkRef.current, lang, tAsync, cache).then((result) => {
      if (!cancelled) {
        setTranslated(result);
        saveArtCache(cache);
      }
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork.id, lang]);

  return translated;
}

/**
 * Translates an array of artworks to the current language.
 */
export function useTranslatedArtworks(artworks: Artwork[]): Artwork[] {
  const { lang, tAsync } = useTranslate();
  const [translated, setTranslated] = useState<Artwork[]>(artworks);
  const artworksRef = useRef(artworks);
  artworksRef.current = artworks;

  useEffect(() => {
    if (lang === "en") {
      setTranslated(artworksRef.current);
      return;
    }

    let cancelled = false;
    const cache = loadArtCache();
    const currentArtworks = artworksRef.current;

    Promise.all(
      currentArtworks.map((art) => translateArtworkFields(art, lang, tAsync, cache))
    ).then((results) => {
      if (!cancelled) {
        setTranslated(results);
        saveArtCache(cache);
      }
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworks.map((a) => a.id).join(","), lang]);

  return translated;
}
