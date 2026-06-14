"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslate } from "./translations";
import type { Acquisition, Inquiry, Consultation } from "./dashboardTypes";

const ACQ_CACHE_KEY = "aduna_acq_translations";

function loadAcqCache(): Record<string, Record<string, string>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ACQ_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAcqCache(cache: Record<string, Record<string, string>>) {
  try {
    localStorage.setItem(ACQ_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

const ACQ_FIELDS: (keyof Acquisition)[] = ["title", "era", "culture", "description"];
const PROV_FIELD = "provenance";

async function translateAcq(
  acq: Acquisition,
  lang: string,
  tAsync: (text: string) => Promise<string>,
  cache: Record<string, Record<string, string>>
): Promise<Acquisition> {
  const updates: Partial<Acquisition> = {};
  const id = acq.id;
  if (!cache[id]) cache[id] = {};

  for (const field of ACQ_FIELDS) {
    const val = acq[field];
    if (typeof val !== "string" || !val) continue;
    const cacheKey = `${field}→${lang}`;
    if (cache[id][cacheKey]) {
      (updates as Record<string, string>)[field] = cache[id][cacheKey];
      continue;
    }
    try {
      const t = await tAsync(val);
      if (t !== val) {
        cache[id][cacheKey] = t;
        (updates as Record<string, string>)[field] = t;
      }
    } catch { /* keep original */ }
  }

  if (acq.provenance?.length) {
    const provCacheKey = `${PROV_FIELD}→${lang}`;
    if (cache[id][provCacheKey]) {
      updates.provenance = JSON.parse(cache[id][provCacheKey]);
    } else {
      const translated = await Promise.all(acq.provenance.map((line) => tAsync(line)));
      cache[id][provCacheKey] = JSON.stringify(translated);
      updates.provenance = translated;
    }
  }

  return { ...acq, ...updates } as Acquisition;
}

async function translateInquiry(
  inq: Inquiry,
  lang: string,
  tAsync: (text: string) => Promise<string>,
  cache: Record<string, Record<string, string>>
): Promise<Inquiry> {
  const updates: Partial<Inquiry> = {};
  const id = inq.id;
  if (!cache[id]) cache[id] = {};

  const titleKey = "artworkTitle→" + lang;
  if (cache[id][titleKey]) {
    updates.artworkTitle = cache[id][titleKey];
  } else {
    try {
      const t = await tAsync(inq.artworkTitle);
      if (t !== inq.artworkTitle) {
        cache[id][titleKey] = t;
        updates.artworkTitle = t;
      }
    } catch {}
  }

  if (inq.messages?.length) {
    const msgKey = "messages→" + lang;
    if (cache[id][msgKey]) {
      updates.messages = JSON.parse(cache[id][msgKey]);
    } else {
      const translated = await Promise.all(
        inq.messages.map(async (msg) => ({
          ...msg,
          text: await tAsync(msg.text),
        }))
      );
      cache[id][msgKey] = JSON.stringify(translated);
      updates.messages = translated;
    }
  }

  return { ...inq, ...updates } as Inquiry;
}

async function translateConsultation(
  cons: Consultation,
  lang: string,
  tAsync: (text: string) => Promise<string>,
  cache: Record<string, Record<string, string>>
): Promise<Consultation> {
  const updates: Partial<Consultation> = {};
  const id = cons.id;
  if (!cache[id]) cache[id] = {};

  for (const field of ["topic", "notes"] as const) {
    const val = cons[field];
    if (typeof val !== "string" || !val) continue;
    const cacheKey = `${field}→${lang}`;
    if (cache[id][cacheKey]) {
      (updates as Record<string, string>)[field] = cache[id][cacheKey];
      continue;
    }
    try {
      const t = await tAsync(val);
      if (t !== val) {
        cache[id][cacheKey] = t;
        (updates as Record<string, string>)[field] = t;
      }
    } catch {}
  }

  return { ...cons, ...updates } as Consultation;
}

export function useTranslatedAcquisitions(acquisitions: Acquisition[]): Acquisition[] {
  const { lang, tAsync } = useTranslate();
  const [translated, setTranslated] = useState<Acquisition[]>(acquisitions);
  const ref = useRef(acquisitions);
  ref.current = acquisitions;

  useEffect(() => {
    if (lang === "en") {
      setTranslated(ref.current);
      return;
    }
    let cancelled = false;
    const cache = loadAcqCache();
    Promise.all(ref.current.map((a) => translateAcq(a, lang, tAsync, cache))).then((results) => {
      if (!cancelled) {
        setTranslated(results);
        saveAcqCache(cache);
      }
    });
    return () => { cancelled = true; };
  }, [acquisitions.map((a) => a.id).join(","), lang, tAsync]);

  return translated;
}

export function useTranslatedInquiries(inquiries: Inquiry[]): Inquiry[] {
  const { lang, tAsync } = useTranslate();
  const [translated, setTranslated] = useState<Inquiry[]>(inquiries);
  const ref = useRef(inquiries);
  ref.current = inquiries;

  useEffect(() => {
    if (lang === "en") {
      setTranslated(ref.current);
      return;
    }
    let cancelled = false;
    const cache = loadAcqCache();
    Promise.all(ref.current.map((i) => translateInquiry(i, lang, tAsync, cache))).then((results) => {
      if (!cancelled) {
        setTranslated(results);
        saveAcqCache(cache);
      }
    });
    return () => { cancelled = true; };
  }, [inquiries.map((i) => i.id).join(","), lang, tAsync]);

  return translated;
}

export function useTranslatedConsultations(consultations: Consultation[]): Consultation[] {
  const { lang, tAsync } = useTranslate();
  const [translated, setTranslated] = useState<Consultation[]>(consultations);
  const ref = useRef(consultations);
  ref.current = consultations;

  useEffect(() => {
    if (lang === "en") {
      setTranslated(ref.current);
      return;
    }
    let cancelled = false;
    const cache = loadAcqCache();
    Promise.all(ref.current.map((c) => translateConsultation(c, lang, tAsync, cache))).then((results) => {
      if (!cancelled) {
        setTranslated(results);
        saveAcqCache(cache);
      }
    });
    return () => { cancelled = true; };
  }, [consultations.map((c) => c.id).join(","), lang, tAsync]);

  return translated;
}
