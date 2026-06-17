"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, Ticket, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/translations";
import { dashboardApi, chatApi } from "@/lib/api";
import { useChatSSE } from "@/lib/useChatSSE";

interface Notification {
  id: string;
  type: "message" | "ticket" | "inquiry";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const { lang } = useTranslate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  // Fetch initial unread counts
  useEffect(() => {
    if (!user) return;

    // Fetch unread thread messages
    chatApi.getThreads().then((res) => {
      const threads = res.data || [];
      const totalUnread = threads.reduce((sum: number, thread: { unreadCount: number }) => sum + (thread.unreadCount || 0), 0);
      setUnreadCount(totalUnread);

      // Build notifications from threads with unread messages
      const threadNotifs: Notification[] = threads
        .filter((thread: { unreadCount: number }) => thread.unreadCount > 0)
        .map((thread: { id: string; clientName: string; subject: string; lastMessage: string; lastMessageTime: string }) => ({
          id: `notif-${thread.id}`,
          type: "message" as const,
          title: thread.subject || thread.clientName || t("Nouveau message", "New message"),
          body: thread.lastMessage || "",
          time: thread.lastMessageTime || "",
          read: false,
        }));
      setNotifications(threadNotifs);
    }).catch(() => {});
  }, [user]);

  // Listen for real-time events
  useChatSSE({
    "new-message": (data: unknown) => {
      const { message } = data as { message: { senderName: string; text: string; timestamp: string } };
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-msg-${Date.now()}`,
          type: "message",
          title: message.senderName || t("Nouveau message", "New message"),
          body: message.text || "",
          time: message.timestamp || "",
          read: false,
        },
        ...prev,
      ]);
    },
    "ticket-update": (data: unknown) => {
      const { response } = data as { response: { author: string; text: string } };
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-ticket-${Date.now()}`,
          type: "ticket",
          title: t("Mise à jour du ticket", "Ticket update"),
          body: `${response.author}: ${response.text}`.slice(0, 80),
          time: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    },
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-on-surface-variant/60 hover:text-gold-leaf transition-colors duration-300 cursor-pointer"
        aria-label={t("Notifications", "Notifications")}
      >
        <Bell size={17} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-terracotta-earth text-parchment-ivory text-[9px] font-sans font-bold rounded-full px-1">
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
                <p className="font-sans text-xs text-on-surface-variant">
                  {t("Aucune notification", "No notifications")}
                </p>
              </div>
            ) : (
              notifications.slice(0, 20).map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b border-on-surface/5 flex items-start gap-3 ${
                    notif.read ? "opacity-60" : "bg-surface-container-low/30"
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {notif.type === "message" ? (
                      <MessageSquare size={14} className="text-terracotta-earth" />
                    ) : notif.type === "ticket" ? (
                      <Ticket size={14} className="text-gold-leaf" />
                    ) : (
                      <Bell size={14} className="text-on-surface-variant" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-medium text-ebony-deep truncate">
                      {notif.title}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant truncate mt-0.5">
                      {notif.body}
                    </p>
                    {notif.time && (
                      <p className="font-sans text-[10px] text-on-surface-variant/50 mt-1">
                        {notif.time}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => clearNotification(notif.id)}
                    className="shrink-0 p-1 text-on-surface-variant/30 hover:text-on-surface-variant transition-colors cursor-pointer bg-transparent border-0"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-on-surface/5 text-center">
            <a
              href="/dashboard"
              className="font-sans text-[10px] font-bold uppercase tracking-wider text-terracotta-earth hover:text-ebony-deep transition-colors"
            >
              {t("Voir toutes les notifications", "View all notifications")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
