"use client";

import { useEffect, useRef } from "react";
import { getToken } from "@/lib/api";

type SSEEventHandler = (data: unknown) => void;

function createSSE(
  url: string,
  handlers: Record<string, SSEEventHandler>,
  onReconnect?: () => void,
  shouldReconnect?: () => boolean
): EventSource {
  const es = new EventSource(url);

  Object.keys(handlers).forEach((event) => {
    es.addEventListener(event, ((e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        handlers[event]?.(data);
      } catch {
        if (process.env.NODE_ENV === "development") {
          console.warn("SSE parse error for event:", event);
        }
      }
    }) as EventListener);
  });

  let retryCount = 0;
  const MAX_RETRIES = 10;
  const BASE_DELAY = 3000;

  es.onopen = () => { retryCount = 0; };

  es.onerror = () => {
    es.close();
    if (shouldReconnect && !shouldReconnect()) return;
    if (retryCount >= MAX_RETRIES) {
      if (process.env.NODE_ENV === "development") {
        console.warn("SSE max retries reached, stopping reconnection");
      }
      return;
    }
    const delay = Math.min(BASE_DELAY * Math.pow(1.5, retryCount), 30000);
    retryCount++;
    setTimeout(() => {
      if (shouldReconnect && !shouldReconnect()) return;
      onReconnect?.();
    }, delay);
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
        () => connect(),
        () => !stopped && !!getToken()
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
        () => connect(),
        () => !stopped && !!getToken()
      );
    }

    connect();

    return () => {
      stopped = true;
      es?.close();
    };
  }, [url, enabled]);
}
