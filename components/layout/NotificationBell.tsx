"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, MessageSquare, Ticket, CalendarCheck, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/translations";
import { chatApi } from "@/lib/api";
import { useChatSSE, useSSE } from "@/lib/useChatSSE";

interface Notification {
  id: string;
  threadKey: string;
  type: "message" | "ticket" | "consultation" | "por" | "inquiry";
  title: string;
  body: string;
  time: string;
  read: boolean;
  threadId?: string;
}

interface NotificationBellProps {
  basePath?: string;
  lightMode?: boolean;
  tabMap?: Partial<Record<Notification["type"], string>>;
}

function getStorageKey(userId: string | undefined): string {
  return `aduna_read_notifs_${userId || "guest"}`;
}

function loadReadSet(userId: string | undefined): Set<string> {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return new Set();
    const arr: string[] = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveReadSet(userId: string | undefined, readSet: Set<string>) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify([...readSet]));
  } catch {}
}

function getLastReadKey(userId: string | undefined): string {
  return `aduna_last_read_${userId || "guest"}`;
}

function loadLastRead(userId: string | undefined): number {
  try {
    return Number(localStorage.getItem(getLastReadKey(userId))) || 0;
  } catch {
    return 0;
  }
}

function saveLastRead(userId: string | undefined, ts: number) {
  try {
    localStorage.setItem(getLastReadKey(userId), String(ts));
  } catch {}
}

export default function NotificationBell({ basePath = "/dashboard", lightMode = false, tabMap }: NotificationBellProps) {
  const { user } = useAuth();
  const { lang } = useTranslate();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const readSetRef = useRef<Set<string>>(new Set());

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  useEffect(() => {
    if (!user) return;
    readSetRef.current = loadReadSet(user.id);

    chatApi.getThreads().then((res) => {
      const threads = res.data || [];
      const threadNotifs: Notification[] = threads
        .filter((thread: { unreadCount: number }) => thread.unreadCount > 0)
        .map((thread: { id: string; clientName: string; subject: string; lastMessage: string; lastMessageTime: string }) => {
          const threadKey = `thr-${thread.id}`;
          const isRead = readSetRef.current.has(threadKey);
          return {
            id: `notif-${thread.id}`,
            threadKey,
            type: "message" as const,
            title: thread.subject || thread.clientName || t("Nouveau message", "New message"),
            body: thread.lastMessage || "",
            time: thread.lastMessageTime || "",
            read: isRead,
            threadId: thread.id,
          };
        });
      setNotifications(threadNotifs);
      const unread = threadNotifs.filter((n) => !n.read).length;
      setUnreadCount(unread);
    }).catch(() => {});
  }, [user]);

  useChatSSE({
    "new-message": (data: unknown) => {
      const { threadId, message } = data as { threadId: number; message: { senderName: string; text: string; timestamp: string; senderId: string } };
      if (message.senderId === user?.id) return;
      const threadKey = `thr-${threadId}`;
      if (readSetRef.current.has(threadKey)) return;
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-msg-${Date.now()}`,
          threadKey,
          type: "message",
          title: message.senderName || t("Nouveau message", "New message"),
          body: message.text || "",
          time: message.timestamp || "",
          read: false,
          threadId: `thr-${threadId}`,
        },
        ...prev,
      ]);
    },
    "ticket-update": (data: unknown) => {
      const { response, ticketId } = data as { response: { author: string; text: string }; ticketId: number };
      const threadKey = `ticket-${ticketId}`;
      if (readSetRef.current.has(threadKey)) return;
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-ticket-${Date.now()}`,
          threadKey,
          type: "ticket",
          title: t("Mise à jour du ticket", "Ticket update"),
          body: `${response.author}: ${response.text}`.slice(0, 80),
          time: new Date().toISOString(),
          read: false,
          threadId: `ticket-${ticketId}`,
        },
        ...prev,
      ]);
    },
  });

  useSSE("/api/v1/events", {
    "consultation-update": (data: unknown) => {
      const { action, consultation } = data as { action: string; consultation?: { id: string; status: string } };
      if (action === "created") return;
      const threadKey = `cons-${consultation?.id || Date.now()}`;
      if (readSetRef.current.has(threadKey)) return;
      const statusLabel = consultation?.status || action;
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-cons-${Date.now()}`,
          threadKey,
          type: "consultation",
          title: t("Mise à jour de consultation", "Consultation update"),
          body: t(`Statut: ${statusLabel}`, `Status: ${statusLabel}`),
          time: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    },
    "por-update": (data: unknown) => {
      const { porId, status } = data as { porId: string; status?: string };
      const threadKey = `por-${porId}`;
      if (readSetRef.current.has(threadKey)) return;
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-por-${Date.now()}`,
          threadKey,
          type: "por",
          title: t("Mise à jour du prix", "Price request update"),
          body: t(`Statut: ${status || "mis à jour"}`, `Status: ${status || "updated"}`),
          time: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    },
    "por-message": (data: unknown) => {
      const { porId, message } = data as { porId: string; message?: { sender: string; text: string } };
      if (!message) return;
      const threadKey = `por-${porId}`;
      if (readSetRef.current.has(threadKey)) return;
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-por-msg-${Date.now()}`,
          threadKey,
          type: "por",
          title: t("Nouveau message POR", "POR message"),
          body: `${message.sender}: ${message.text}`.slice(0, 80),
          time: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    },
    "inquiry-update": (data: unknown) => {
      const { inquiryId } = data as { inquiryId: number };
      const threadKey = `inq-${inquiryId}`;
      if (readSetRef.current.has(threadKey)) return;
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-inq-${Date.now()}`,
          threadKey,
          type: "inquiry",
          title: t("Nouvelle réponse à l'enquête", "Inquiry reply"),
          body: t("Un administrateur a répondu à votre demande", "An admin replied to your inquiry"),
          time: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = useCallback((threadKey: string) => {
    readSetRef.current.add(threadKey);
    if (user) saveReadSet(user.id, readSetRef.current);
    setNotifications((prev) => prev.map((n) => n.threadKey === threadKey ? { ...n, read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, [user]);

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.threadKey);
    setOpen(false);
    const defaultTabs: Record<Notification["type"], string> = {
      message: "chat",
      ticket: "tickets",
      consultation: "consultations",
      por: "inquiries",
      inquiry: "inquiries",
    };
    const tabs = { ...defaultTabs, ...tabMap };
    const tab = tabs[notif.type];
    if (notif.type === "message" && notif.threadId) {
      router.push(`${basePath}?tab=${tab}&thread=${notif.threadId}`);
    } else if (tab) {
      router.push(`${basePath}?tab=${tab}`);
    }
  };

  const markAllRead = () => {
    const now = Date.now();
    notifications.forEach((n) => {
      readSetRef.current.add(n.threadKey);
    });
    if (user) {
      saveReadSet(user.id, readSetRef.current);
      saveLastRead(user.id, now);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex items-center justify-center w-8 h-8 transition-colors cursor-pointer border-0 bg-transparent ${lightMode ? "text-parchment-ivory/60 hover:text-gold-leaf" : "text-ebony-deep/40 hover:text-terracotta-earth"}`}
        aria-label={t("Notifications", "Notifications")}
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 flex items-center justify-center bg-terracotta-earth text-parchment-ivory text-[8px] font-sans font-bold rounded-full px-0.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-on-surface/10 shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-on-surface/5">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ebony-deep">
              {t("Notifications", "Notifications")}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-sans text-terracotta-earth hover:text-ebony-deep cursor-pointer bg-transparent border-0"
              >
                {t("Tout marquer lu", "Mark all read")}
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-on-surface-variant/20 mx-auto mb-2" />
                <p className="font-sans text-xs text-on-surface-variant">{t("Aucune notification", "No notifications")}</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full px-4 py-3 border-b border-on-surface/5 flex items-start gap-3 text-left cursor-pointer bg-transparent border-x-0 border-t-0 hover:bg-surface-container-low/30 transition-colors ${
                    notif.read ? "opacity-60" : ""
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {notif.type === "message" ? (
                      <MessageSquare size={14} className="text-terracotta-earth" />
                    ) : notif.type === "ticket" ? (
                      <Ticket size={14} className="text-gold-leaf" />
                    ) : notif.type === "consultation" ? (
                      <CalendarCheck size={14} className="text-emerald-600" />
                    ) : (
                      <HelpCircle size={14} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-medium text-ebony-deep truncate">{notif.title}</p>
                    <p className="font-sans text-[11px] text-on-surface-variant truncate mt-0.5">{notif.body}</p>
                  </div>
                  {!notif.read && (
                    <div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-terracotta-earth" />
                  )}
                </button>
              ))
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-on-surface/5 text-center">
            <a href={basePath} className="font-sans text-[10px] font-bold uppercase tracking-wider text-terracotta-earth hover:text-ebony-deep transition-colors">
              {t("Voir toutes les notifications", "View all notifications")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
