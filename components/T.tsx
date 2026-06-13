"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslate } from "@/lib/translations";

/**
 * <T> component — auto-translates its text children.
 *
 * Usage:
 *   <T>Hello World</T>
 *   <T className="text-sm">Some description</T>
 *
 * It renders the English text initially, then swaps to the translated
 * version once the async Google Translate call resolves.
 */
export function T({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: string;
}) {
  const { lang, tAsync } = useTranslate();
  const ref = useRef<HTMLElement | null>(null);
  const originalText = typeof children === "string" ? children : "";

  useEffect(() => {
    if (lang === "en" || !originalText || !ref.current) return;

    let cancelled = false;
    tAsync(originalText).then((translated) => {
      if (!cancelled && ref.current) {
        ref.current.textContent = translated;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lang, originalText, tAsync]);

  // Reset to English immediately
  useEffect(() => {
    if (lang === "en" && ref.current && originalText) {
      ref.current.textContent = originalText;
    }
  }, [lang, originalText]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className}>
      {originalText}
    </Tag>
  );
}
