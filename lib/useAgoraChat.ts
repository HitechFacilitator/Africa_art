"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { agoraChatManager } from "./agoraChatManager";
import { chatApi, getToken } from "./api";
import type { ChatMessage } from "./chatTypes";

interface AgoraChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  groupId: string;
}

/**
 * Hook that manages Agora Chat SDK connection and message state.
 * Replaces useChatSSE for real-time chat messaging.
 *
 * Thread list still comes from the DB via chatApi.getThreads().
 * Only message delivery/receipt goes through Agora.
 */
export function useAgoraChat(userId: string | undefined, userName: string | undefined) {
  const [isConnected, setIsConnected] = useState(false);
  const [agoraMessages, setAgoraMessages] = useState<Map<string, AgoraChatMessage[]>>(new Map());
  const [agoraAppId, setAgoraAppId] = useState<string>("");
  const messageHandlersRef = useRef<Map<string, (msgs: AgoraChatMessage[]) => void>>(new Map());

  // On mount: get token from backend, connect to Agora
  useEffect(() => {
    if (!userId || !getToken()) return;

    let cancelled = false;

    async function init() {
      try {
        // 1. Get Agora token from backend
        const res = await chatApi.getAgoraToken();

        if (cancelled) return;

        // 2. Register user in Agora (fire and forget)
        chatApi.registerAgoraUser().catch(() => {});

        // 3. Connect to Agora Chat with the correct appKey
        await agoraChatManager.connect(res.data.userId, res.data.token, res.data.appKey);

        if (!cancelled) {
          setIsConnected(true);
        }

        if (res.data.appId) {
          setAgoraAppId(res.data.appId);
        }
      } catch (err) {
        console.error("[useAgoraChat] Init failed:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      agoraChatManager.disconnect();
      setIsConnected(false);
    };
  }, [userId]);

  // Listen for incoming messages from Agora SDK
  useEffect(() => {
    const unsub = agoraChatManager.onMessage((msg: any) => {
      // Determine the group this message belongs to
      const groupId = msg.to || "";
      if (!groupId) return;

      // Build text content: file messages may have url/filename instead of msg
      let text = msg.msg || "";
      if (!text && msg.url) {
        const filename = msg.ext?.filename || msg.filename || "Attachment";
        const fileType = msg.ext?.fileType || "file";
        text = `[FILE:${fileType}:${filename}] ${filename}`;
      }

      const agoraMsg: AgoraChatMessage = {
        id: msg.id || `agora-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        senderId: msg.from || "",
        senderName: msg.displayName || msg.from || "Unknown",
        text,
        timestamp: msg.time
          ? new Date(msg.time).toISOString().replace("T", " ").slice(0, 19) + " UTC"
          : new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        groupId,
      };

      setAgoraMessages((prev) => {
        const next = new Map(prev);
        const existing = next.get(groupId) || [];
        // Deduplicate by id
        if (existing.some((m) => m.id === agoraMsg.id)) return prev;
        next.set(groupId, [...existing, agoraMsg]);
        return next;
      });
    });

    return unsub;
  }, []);

  const sendMessage = useCallback(async (groupId: string, text: string) => {
    await agoraChatManager.sendMessage(groupId, text);
  }, []);

  const sendFile = useCallback(async (groupId: string, file: File) => {
    await agoraChatManager.sendFileMessage(groupId, file);
  }, []);

  const joinGroup = useCallback(async (groupId: string) => {
    await agoraChatManager.joinGroup(groupId);
  }, []);

  return {
    isConnected,
    agoraMessages,
    sendMessage,
    sendFile,
    joinGroup,
    agoraAppId,
  };
}

/**
 * Convert an Agora message to the ChatMessage format used by ChatView.
 */
export function agoraMsgToChatMsg(agoraMsg: AgoraChatMessage, currentUserId?: string, currentUserRole?: string): ChatMessage {
  const isCurrentUser = agoraMsg.senderId === currentUserId;
  return {
    id: agoraMsg.id,
    senderId: isCurrentUser ? (currentUserId || agoraMsg.senderId) : agoraMsg.senderId,
    senderName: agoraMsg.senderName,
    senderRole: (isCurrentUser ? (currentUserRole || "collector") : "advisor") as ChatMessage["senderRole"],
    text: agoraMsg.text,
    timestamp: agoraMsg.timestamp,
    read: true,
  };
}
