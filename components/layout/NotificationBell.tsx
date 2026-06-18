"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, Ticket, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/translations";
import { chatApi } from "@/lib/api";
import { useChatSSE } from "@/lib/useChatSSE";

interface Notification {
  id: string;
  type: "message" | "ticket";
  title: string;
  body: string;
  time: string;
  read: boolean;
  threadId?: string;
}

interface NotificationBellProps {
  basePath?: string;
  lightMode?: boolean;
}

export default function NotificationBell({ basePath = "/dashboard", lightMode = false }: NotificationBellProps) {
  const { user } = useAuth();
  const { lang } = useTranslate();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  useEffect(() => {
    if (!user) return;
    chatApi.getThreads().then((res) => {
      const threads = res.data || [];
      const totalUnread = threads.reduce((sum: number, thread: { unreadCount: number }) => sum + (thread.unreadCount || 0), 0);
      setUnreadCount(totalUnread);
      const threadNotifs: Notification[] = threads
        .filter((thread: { unreadCount: number }) => thread.unreadCount > 0)
        .map((thread: { id: string; clientName: string; subject: string; lastMessage: string; lastMessageTime: string }) => ({
          id: `notif-${thread.id}`,
          type: "message" as const,
          title: thread.subject || thread.clientName || t("Nouveau message", "New message"),
          body: thread.lastMessage || "",
          time: thread.lastMessageTime || "",
          read: false,
          threadId: thread.id,
        }));
      setNotifications(threadNotifs);
    }).catch(() => {});
  }, [user]);

  useChatSSE({
    "new-message": (data: unknown) => {
      const { threadId, message } = data as { threadId: number; message: { senderName: string; text: string; timestamp: string; senderId: string } };
      if (message.senderId === user?.id) return;
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-msg-${Date.now()}`,
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
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `notif-ticket-${Date.now()}`,
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: Notification) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setOpen(false);
    if (notif.type === "message" && notif.threadId) {
      router.push(`${basePath}?tab=chat&thread=${notif.threadId}`);
    } else if (notif.type === "ticket") {
      router.push(`${basePath}?tab=tickets`);
    }
  };

  const markAllRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
                    ) : (
                      <Ticket size={14} className="text-gold-leaf" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-medium text-ebony-deep truncate">{notif.title}</p>
                    <p className="font-sans text-[11px] text-on-surface-variant truncate mt-0.5">{notif.body}</p>
                  </div>
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
