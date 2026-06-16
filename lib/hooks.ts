"use client";

import { useState, useEffect } from "react";
import { artworksApi, type ArtworkData } from "@/lib/api";

export function useArtworks(options?: { page?: number; limit?: number }) {
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    artworksApi.getAll(options)
      .then((res) => {
        if (!cancelled) {
          setArtworks(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [options?.page, options?.limit]);

  return { artworks, loading, error };
}

export function useArtwork(id: string | null) {
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    artworksApi.getById(id)
      .then((res) => {
        if (!cancelled) {
          setArtwork(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  return { artwork, loading, error };
}
