"use client";

import { useEffect, useRef } from "react";
import { getToken } from "@/lib/api";

type SSEEventHandler = (data: unknown) => void;

function createSSE(
  url: string,
  handlers: Record<string, SSEEventHandler>,
  onReconnect?: () => void
): EventSource {
  const es = new EventSource(url);

  Object.keys(handlers).forEach((event) => {
    es.addEventListener(event, ((e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        handlers[event]?.(data);
      } catch { /* ignore parse errors */ }
    }) as EventListener);
  });

  es.onerror = () => {
    es.close();
    setTimeout(() => {
      onReconnect?.();
    }, 3000);
  };

  return es;
}

export function useChatSSE(handlers: Record<string, SSEEventHandler>) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    let es: EventSource | null = null;
    let stopped = false;

    function connect() {
      if (stopped) return;
      es = createSSE(
        `${baseUrl}/api/v1/chat/events?token=${token}`,
        handlersRef.current,
        () => connect()
      );
    }

    connect();

    return () => {
      stopped = true;
      es?.close();
    };
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
    let es: EventSource | null = null;
    let stopped = false;

    function connect() {
      if (stopped) return;
      es = createSSE(
        `${baseUrl}${url}?token=${token}`,
        handlersRef.current,
        () => connect()
      );
    }

    connect();

    return () => {
      stopped = true;
      es?.close();
    };
  }, [url, enabled]);
}
