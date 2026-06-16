const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ─── Token Management ──────────────────────────────────────────────

const TOKEN_KEY = "aduna_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── API Response Types ─────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Core Fetch Helper ──────────────────────────────────────────────

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Auth API ───────────────────────────────────────────────────────

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    institution?: string;
  };
  token: string;
  requiresOTP: boolean;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  institution?: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await apiRequest<{ success: boolean; data: LoginResponse }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },

  verifyOtp: async (email: string, code: string): Promise<LoginResponse> => {
    const res = await apiRequest<{ success: boolean; data: LoginResponse }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    return res.data;
  },

  register: async (data: { email: string; password: string; name: string }) => {
    const res = await apiRequest<{ success: boolean; data: { user: UserSession; token: string } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  getMe: () => apiRequest<{ success: boolean; data: UserSession }>("/auth/me"),

  loginAs: async (role: string): Promise<LoginResponse> => {
    const res = await apiRequest<{ success: boolean; data: LoginResponse }>("/auth/login-as", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
    return res.data;
  },
};

// ─── Artworks API ───────────────────────────────────────────────────

export interface ArtworkData {
  id: string;
  title: string;
  region: string;
  tribe: string;
  material: string;
  period: string;
  era: string;
  origin: string;
  dimensions: string;
  imageUrl: string;
  blurDataURL?: string;
  label: string | number;
  scarcityIndex?: number;
  preservationStatus?: string;
  appreciationRate?: string;
  isHero?: boolean;
  provenance: string[];
  historicalStory: string;
  investmentThesis: string;
  investment?: {
    estimatedValue: number;
    historicalCagr: number;
    yieldIndex: number;
  };
  tier?: string;
  status?: string;
}

export const artworksApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    const qs = searchParams.toString();
    return apiRequest<PaginatedResponse<ArtworkData>>(`/artworks${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    apiRequest<{ success: boolean; data: ArtworkData }>(`/artworks/${id}`),
};

// ─── Categories API ─────────────────────────────────────────────────

export const categoriesApi = {
  getAll: () =>
    apiRequest<{ success: boolean; data: Array<{ id: number; name: string; description?: string; _count?: { artworks: number } }> }>("/categories"),
};

// ─── Artists API ────────────────────────────────────────────────────

export const artistsApi = {
  getAll: () =>
    apiRequest<{ success: boolean; data: Array<{ id: number; name: string; biography?: string; nationality?: string; _count?: { artworks: number } }> }>("/artists"),
};

// ─── Dashboard API ──────────────────────────────────────────────────

export const dashboardApi = {
  getAcquisitions: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      title: string;
      era: string;
      culture: string;
      acquisitionDate: string;
      status: string;
      imageUrl: string;
      estimatedValueEur: number;
      description: string;
      provenance: string[];
    }> }>("/dashboard/acquisitions"),

  getInquiries: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      artworkTitle: string;
      artworkYear: string;
      imageUrl: string;
      status: string;
      date: string;
      messages: Array<{ sender: string; text: string; timestamp: string }>;
    }> }>("/dashboard/inquiries"),

  getLogistics: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      artworkTitle: string;
      carrier: string;
      status: string;
      estimatedDeliveryDate: string;
      securityTier: string;
      insuranceCoverage: string;
      updates: Array<{ date: string; status: string; location: string; description: string }>;
    }> }>("/dashboard/logistics"),

  getSecurity: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      artworkTitle: string;
      vaultLocation: string;
      fingerprintId: string;
      smartContractAddress: string;
      lastInspectionDate: string;
      temperatureHumidity: string;
      insurancePolicyNumber: string;
    }> }>("/dashboard/security"),
};

// ─── Consultations API ──────────────────────────────────────────────

export const consultationsApi = {
  getMy: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      expertName: string;
      expertTitle: string;
      expertAvatar: string;
      date: string;
      timeSlot: string;
      topic: string;
      status: string;
      notes?: string;
    }> }>("/consultations/my"),
};

// ─── Favorites API ──────────────────────────────────────────────────

export const favoritesApi = {
  getAll: () =>
    apiRequest<{ success: boolean; data: Array<{ id: number; artworkId: number }> }>("/favorites"),

  add: (artworkId: string) =>
    apiRequest<{ success: boolean }>(`/favorites/${artworkId}`, { method: "POST" }),

  remove: (artworkId: string) =>
    apiRequest<{ success: boolean }>(`/favorites/${artworkId}`, { method: "DELETE" }),
};

// ─── Advisor API ────────────────────────────────────────────────────

export const advisorApi = {
  getConsultations: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      clientName: string;
      clientTier: string;
      topic: string;
      date: string;
      timeSlot: string;
      status: string;
      type: string;
      notes: string;
      followUpRequired: boolean;
    }> }>("/advisor/consultations"),

  getClients: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      name: string;
      email: string;
      tier: string;
      country: string;
      avatarColor: string;
      totalSpent: number;
      acquisitionsCount: number;
      satisfactionScore: number;
      lastContact: string;
      interests: string[];
    }> }>("/advisor/clients"),

  getPlacements: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      artworkTitle: string;
      artworkCulture: string;
      artworkEra: string;
      imageUrl: string;
      valuation: number;
      commission: number;
      clientName: string;
      status: string;
      notes: string;
      proposedDate: string;
    }> }>("/advisor/placements"),

  getActivities: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
      icon: string;
    }> }>("/advisor/activities"),
};

// ─── Chat API ───────────────────────────────────────────────────────

export const chatApi = {
  getThreads: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      clientName: string;
      clientRole: string;
      advisorName: string;
      subject: string;
      lastMessage: string;
      lastMessageTime: string;
      unreadCount: number;
      status: string;
      messages: Array<{
        id: string;
        senderId: string;
        senderName: string;
        senderRole: string;
        text: string;
        timestamp: string;
        read: boolean;
      }>;
    }> }>("/chat/threads"),
};

// ─── Admin API ──────────────────────────────────────────────────────

// ─── Provenance API ───────────────────────────────────────────────

export const provenanceApi = {
  getByArtwork: (artworkId: string) =>
    apiRequest<{ success: boolean; data: Array<{
      id: number;
      artworkId: number;
      previousOwner: string;
      acquisitionDate?: string;
      transferDate?: string;
      notes?: string;
      createdAt: string;
    }> }>(`/artworks/${artworkId}/provenance`),
};

// ─── Admin API ──────────────────────────────────────────────────────

export const adminApi = {
  getArtworks: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    const qs = searchParams.toString();
    return apiRequest<{ success: boolean; data: Array<{
      id: string;
      title: string;
      culture: string;
      era: string;
      valuation: number;
      status: string;
      tier: string;
      imageUrl: string;
      description: string;
      provenanceHash: string;
      dateCreated: string;
      acquiredYear: number;
      acquiredMethod: string;
      provenance: string[];
    }>; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/admin/artworks${qs ? `?${qs}` : ""}`);
  },

  getCollectors: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    const qs = searchParams.toString();
    return apiRequest<{ success: boolean; data: Array<{
      id: string;
      name: string;
      email: string;
      country: string;
      tier: string;
      purchasedValue: number;
      acquisitionsCount: number;
      amlStatus: string;
      joinedDate: string;
      avatarColor: string;
    }>; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/admin/collectors${qs ? `?${qs}` : ""}`);
  },

  getSupportTickets: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      clientName: string;
      clientRole: string;
      subject: string;
      description: string;
      status: string;
      priority: string;
      createdDate: string;
      lastUpdate: string;
      assignedTo: string;
      responses: Array<{ author: string; text: string; timestamp: string }>;
    }> }>("/chat/tickets"),

  getAuditLogs: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      user: string;
      timestamp: string;
      action: string;
      txHash: string;
      signed: boolean;
    }> }>("/admin/audit-logs"),

  getEscrow: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      artworkTitle: string;
      buyerName: string;
      sellerName: string;
      amount: number;
      status: string;
      createdDate: string;
      notes: string;
    }> }>("/admin/escrow"),

  verifyAuditLog: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/audit-logs/${id}/verify`, { method: "PATCH" }),

  verifyAllAuditLogs: () =>
    apiRequest<{ success: boolean }>("/admin/audit-logs/verify-all", { method: "POST" }),

  getUsers: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      institution: string;
      joinedDate: string;
      lastActive: string;
      status: string;
    }> }>("/admin/users"),

  updateUserStatus: (id: string, status: string) =>
    apiRequest<{ success: boolean }>(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  deleteUser: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/users/${id}`, { method: "DELETE" }),

  getCertificates: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      artworkTitle: string;
      artworkId: string;
      ownerName: string;
      ownerEmail: string;
      issuedDate: string;
      expiryDate: string;
      status: string;
      blockchainHash: string;
      verifiedBy: string;
    }> }>("/admin/certificates"),

  createCertificate: (data: { artworkTitle: string; artworkId?: string; ownerName?: string; ownerEmail?: string; expiryDate?: string; verifiedBy?: string }) =>
    apiRequest<{ success: boolean }>(`/admin/certificates`, { method: "POST", body: JSON.stringify(data) }),

  updateCertificate: (id: string, data: { artworkTitle?: string; ownerName?: string; ownerEmail?: string; expiryDate?: string; verifiedBy?: string }) =>
    apiRequest<{ success: boolean }>(`/admin/certificates/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  revokeCertificate: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/certificates/${id}/revoke`, { method: "PATCH" }),

  deleteCertificate: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/certificates/${id}`, { method: "DELETE" }),
};
