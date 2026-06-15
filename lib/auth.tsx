"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { ActiveTab } from "@/lib/dashboardTypes";
import { findUserByEmail, getUserByRole } from "@/lib/users";

// ── Roles ──────────────────────────────────────────────────────────────
export type Role = "visitor" | "collector" | "prestige" | "advisor" | "admin";

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
};

// ── Role display info ──────────────────────────────────────────────────
export const ROLE_INFO: Record<Role, { label: string; labelFr: string; tier: string; tierFr: string; color: string }> = {
  visitor: { label: "Visitor", labelFr: "Visiteur", tier: "Public", tierFr: "Public", color: "text-on-surface-variant" },
  collector: { label: "Collector", labelFr: "Collectionneur", tier: "Member", tierFr: "Membre", color: "text-gold-leaf" },
  prestige: { label: "Prestige Collector", labelFr: "Collectionneur Prestige", tier: "Prestige", tierFr: "Prestige", color: "text-gold-leaf" },
  advisor: { label: "Art Advisor", labelFr: "Conseiller en Art", tier: "Advisor", tierFr: "Conseiller", color: "text-terracotta-earth" },
  admin: { label: "Administrator", labelFr: "Administrateur", tier: "Admin", tierFr: "Admin", color: "text-terracotta-earth" },
};

// ── User session ───────────────────────────────────────────────────────
export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  institution?: string;
}

// ── Auth context ───────────────────────────────────────────────────────
interface AuthCtx {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string; requiresOTP?: boolean; user?: UserSession };
  loginAs: (role: Role) => void;
  verifyOTP: (code: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessTab: (tab: ActiveTab) => boolean;
  getVisibleTabs: () => ActiveTab[];
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  login: () => ({ success: false }),
  loginAs: () => {},
  verifyOTP: () => false,
  logout: () => {},
  hasPermission: () => false,
  canAccessTab: () => false,
  getVisibleTabs: () => [],
});

export function useAuth() {
  return useContext(AuthContext);
}

// ── Storage key ────────────────────────────────────────────────────────
const SESSION_KEY = "aduna_session";

// ── Provider ───────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [pendingUser, setPendingUser] = useState<UserSession | null>(null);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserSession;
        setUser(parsed);
      }
    } catch {}
  }, []);

  const login = useCallback((email: string, _password: string): { success: boolean; error?: string; requiresOTP?: boolean; user?: UserSession } => {
    // Mock validation — in real app this would call an API
    // For now, accept any email that matches a known user pattern
    const found = findUserByEmail(email);
    if (!found) {
      return { success: false, error: "Account not found. Please check your email." };
    }
    setPendingUser(found);
    return { success: true, requiresOTP: true, user: found };
  }, []);

  const loginAs = useCallback((role: Role) => {
    const found = getUserByRole(role);
    if (found) {
      setUser(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    }
  }, []);

  const verifyOTP = useCallback((code: string): boolean => {
    // Mock OTP — accept "123456" or any 6-digit code
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      const u = pendingUser || user;
      if (u) {
        setUser(u);
        localStorage.setItem(SESSION_KEY, JSON.stringify(u));
        setPendingUser(null);
        return true;
      }
    }
    return false;
  }, [pendingUser, user]);

  const logout = useCallback(() => {
    setUser(null);
    setPendingUser(null);
    localStorage.removeItem(SESSION_KEY);
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
