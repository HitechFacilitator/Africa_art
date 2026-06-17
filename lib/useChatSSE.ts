"use client";

import { useEffect, useRef, useCallback } from "react";
import { getToken } from "@/lib/api";

type SSEEventHandler = (data: unknown) => void;

export function useChatSSE(handlers: Record<string, SSEEventHandler>) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const es = new EventSource(`${baseUrl}/api/v1/chat/events?token=${token}`);

    Object.keys(handlersRef.current).forEach((event) => {
      es.addEventListener(event, ((e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          handlersRef.current[event]?.(data);
        } catch { /* ignore parse errors */ }
      }) as EventListener);
    });

    es.onerror = () => {
      es.close();
      setTimeout(() => {
        // Reconnect after 3 seconds
      }, 3000);
    };

    return () => es.close();
  }, []);
}

export function useSSE(
  url: string,
  handlers: Record<string, SSEEventHandler>,
  enabled = true
) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled) return;
    const token = getToken();
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const es = new EventSource(`${baseUrl}${url}?token=${token}`);

    Object.keys(handlersRef.current).forEach((event) => {
      es.addEventListener(event, ((e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          handlersRef.current[event]?.(data);
        } catch { /* ignore */ }
      }) as EventListener);
    });

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, [url, enabled]);
}
