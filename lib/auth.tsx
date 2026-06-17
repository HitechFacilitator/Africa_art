"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { ActiveTab } from "@/lib/dashboardTypes";
import { authApi, setToken, getToken, removeToken } from "@/lib/api";

// ── Roles ──────────────────────────────────────────────────────────────
export type Role = "visitor" | "collector" | "prestige" | "advisor" | "admin" | "support";

// ── Permissions per role ───────────────────────────────────────────────
const PERMISSIONS: Record<Role, string[]> = {
  visitor: [
    "browse",
    "search",
    "por",
    "reserve_48h",
  ],
  collector: [
    "browse",
    "search",
    "por",
    "reserve_48h",
    "dashboard",
    "acquisitions",
    "certificates",
    "inquiries",
    "consultations",
    "investment",
    "logistics",
    "security",
    "settings",
    "purchase",
  ],
  prestige: [
    "browse",
    "search",
    "por",
    "reserve_48h",
    "dashboard",
    "acquisitions",
    "certificates",
    "inquiries",
    "consultations",
    "investment",
    "logistics",
    "security",
    "settings",
    "purchase",
    "private_catalogues",
    "auctions",
    "previews",
  ],
  advisor: [
    "browse",
    "search",
    "consultations_manage",
    "advisor_dashboard",
    "advisor_clients",
    "advisor_placements",
  ],
  admin: [
    "browse",
    "search",
    "por",
    "reserve_48h",
    "dashboard",
    "acquisitions",
    "certificates",
    "inquiries",
    "consultations",
    "investment",
    "logistics",
    "security",
    "settings",
    "purchase",
    "private_catalogues",
    "auctions",
    "previews",
    "admin_panel",
    "user_management",
    "audit_logs",
    "compliance",
    "escrow",
  ],
  support: [
    "browse",
    "search",
    "support_panel",
    "support_tickets",
    "support_manage",
  ],
};

// ── Dashboard tabs visible per role ────────────────────────────────────

const TAB_VISIBILITY: Record<Role, ActiveTab[]> = {
  visitor: [],
  collector: [
    ActiveTab.Dashboard,
    ActiveTab.Portfolio,
    ActiveTab.Certificates,
    ActiveTab.Inquiries,
    ActiveTab.Consultations,
    ActiveTab.AlertsAuctions,
    ActiveTab.Investment,
    ActiveTab.Logistics,
    ActiveTab.Security,
    ActiveTab.Chat,
    ActiveTab.Documentation,
    ActiveTab.Support,
    ActiveTab.Settings,
  ],
  prestige: [
    ActiveTab.Dashboard,
    ActiveTab.Portfolio,
    ActiveTab.Certificates,
    ActiveTab.Inquiries,
    ActiveTab.Consultations,
    ActiveTab.PrivateCatalogues,
    ActiveTab.AlertsAuctions,
    ActiveTab.Investment,
    ActiveTab.Previews,
    ActiveTab.Logistics,
    ActiveTab.Security,
    ActiveTab.Chat,
    ActiveTab.Documentation,
    ActiveTab.Support,
    ActiveTab.Settings,
  ],
  advisor: [],
  admin: [
    ActiveTab.Dashboard,
    ActiveTab.Portfolio,
    ActiveTab.Certificates,
    ActiveTab.Inquiries,
    ActiveTab.Consultations,
    ActiveTab.PrivateCatalogues,
    ActiveTab.AlertsAuctions,
    ActiveTab.Investment,
    ActiveTab.Previews,
    ActiveTab.Logistics,
    ActiveTab.Security,
    ActiveTab.Settings,
  ],
  support: [
    ActiveTab.Dashboard,
    ActiveTab.Support,
    ActiveTab.Chat,
    ActiveTab.Settings,
  ],
};

// ── Role display info ──────────────────────────────────────────────────
export const ROLE_INFO: Record<Role, { label: string; labelFr: string; tier: string; tierFr: string; color: string }> = {
  visitor: { label: "Visitor", labelFr: "Visiteur", tier: "Public", tierFr: "Public", color: "text-on-surface-variant" },
  collector: { label: "Collector", labelFr: "Collectionneur", tier: "Member", tierFr: "Membre", color: "text-gold-leaf" },
  prestige: { label: "Prestige Collector", labelFr: "Collectionneur Prestige", tier: "Prestige", tierFr: "Prestige", color: "text-gold-leaf" },
  advisor: { label: "Art Advisor", labelFr: "Conseiller en Art", tier: "Advisor", tierFr: "Conseiller", color: "text-terracotta-earth" },
  admin: { label: "Administrator", labelFr: "Administrateur", tier: "Admin", tierFr: "Admin", color: "text-terracotta-earth" },
  support: { label: "Support Staff", labelFr: "Équipe Support", tier: "Support", tierFr: "Support", color: "text-terracotta-earth" },
};

// ── User session ───────────────────────────────────────────────────────
export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  institution?: string;
  twoFactorEnabled?: boolean;
}

// ── Auth context ───────────────────────────────────────────────────────
interface AuthCtx {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresOTP?: boolean; pendingEmail?: string; user?: UserSession }>;
  loginAs: (role: Role) => Promise<void>;
  verifyOTP: (code: string) => Promise<{ success: boolean; user?: UserSession }>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessTab: (tab: ActiveTab) => boolean;
  getVisibleTabs: () => ActiveTab[];
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  loginAs: async () => {},
  verifyOTP: async () => ({ success: false }),
  logout: () => {},
  hasPermission: () => false,
  canAccessTab: () => false,
  getVisibleTabs: () => [],
});

export function useAuth() {
  return useContext(AuthContext);
}

// ── Pending email for OTP flow ──────────────────────────────────────────
const PENDING_EMAIL_KEY = "aduna_pending_email";

// ── Provider ───────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from JWT on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    // Set a timeout so the page isn't blocked if backend is down
    const timeout = setTimeout(() => setLoading(false), 3000);
    authApi.getMe()
      .then((res) => {
        setUser({ ...res.data, role: res.data.role as Role });
      })
      .catch(() => {
        removeToken();
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; requiresOTP?: boolean; pendingEmail?: string; user?: UserSession }> => {
    try {
      const res = await authApi.login(email, password);
      if (res.requiresOTP) {
        localStorage.setItem(PENDING_EMAIL_KEY, email);
        return { success: true, requiresOTP: true, pendingEmail: email };
      }
      // If no OTP required, set user directly and return user info for redirect
      setToken(res.token);
      setUser(res.user as UserSession);
      return { success: true, requiresOTP: false, user: res.user as UserSession };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      return { success: false, error: message };
    }
  }, []);

  const verifyOTP = useCallback(async (code: string): Promise<{ success: boolean; user?: UserSession }> => {
    const pendingEmail = localStorage.getItem(PENDING_EMAIL_KEY);
    if (!pendingEmail) return { success: false };

    try {
      const res = await authApi.verifyOtp(pendingEmail, code);
      setToken(res.token);
      const u = res.user as UserSession;
      setUser(u);
      localStorage.removeItem(PENDING_EMAIL_KEY);
      return { success: true, user: u };
    } catch {
      return { success: false };
    }
  }, []);

  const loginAs = useCallback(async (role: Role) => {
    try {
      const res = await authApi.loginAs(role);
      if (res.requiresOTP) {
        // loginAs also requires OTP - skip for quick-login convenience
        setToken(res.token);
        setUser(res.user as UserSession);
      } else {
        setToken(res.token);
        setUser(res.user as UserSession);
      }
    } catch {
      // Quick-login fallback — for demo purposes only
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
    localStorage.removeItem(PENDING_EMAIL_KEY);
    window.location.href = "/";
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return PERMISSIONS[user.role]?.includes(permission) ?? false;
  }, [user]);

  const canAccessTab = useCallback((tab: ActiveTab): boolean => {
    if (!user) return false;
    return TAB_VISIBILITY[user.role]?.includes(tab) ?? false;
  }, [user]);

  const getVisibleTabs = useCallback((): ActiveTab[] => {
    if (!user) return [];
    return TAB_VISIBILITY[user.role] ?? [];
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginAs,
      verifyOTP,
      logout,
      hasPermission,
      canAccessTab,
      getVisibleTabs,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
