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
    if (res.status === 429) {
      throw new Error("Rate limited — please wait a moment and try again");
    }
    if (res.status === 401) {
      // Token expired or invalid — don't throw, let auth handler deal with it
      throw new Error(body.message || "Session expired");
    }
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
  getAll: (params?: { page?: number; limit?: number; category?: string; search?: string; artworkStatus?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.artworkStatus) searchParams.set("artworkStatus", params.artworkStatus);
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

  createInquiry: (data: { artworkTitle: string; artworkYear?: string; imageUrl?: string; messages?: Array<{ sender: string; text: string }> }) =>
    apiRequest<{ success: boolean; data: {
      id: string;
      artworkTitle: string;
      artworkYear: string;
      imageUrl: string;
      status: string;
      date: string;
      messages: Array<{ sender: string; text: string; timestamp: string }>;
    } }>("/dashboard/inquiries", { method: "POST", body: JSON.stringify(data) }),

  addInquiryMessage: (inquiryId: string, data: { sender: string; text: string }) =>
    apiRequest<{ success: boolean; data: { sender: string; text: string; timestamp: string } }>(
      `/dashboard/inquiries/${inquiryId.replace("inq-", "")}/messages`,
      { method: "POST", body: JSON.stringify(data) }
    ),

  createSupportTicket: (data: { subject: string; description: string; priority?: string; category?: string }) =>
    apiRequest<{ success: boolean; data: {
      id: string;
      clientName: string;
      clientRole: string;
      subject: string;
      description: string;
      category: string;
      status: string;
      priority: string;
      createdDate: string;
      lastUpdate: string;
      assignedTo: string;
      responses: Array<{ author: string; text: string; timestamp: string }>;
    } }>("/chat/tickets", { method: "POST", body: JSON.stringify(data) }),

  getMyTickets: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      clientName: string;
      clientRole: string;
      subject: string;
      description: string;
      category: string;
      status: string;
      priority: string;
      createdDate: string;
      lastUpdate: string;
      assignedTo: string;
      responses: Array<{ author: string; text: string; timestamp: string }>;
    }> }>("/chat/tickets"),

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

  create: (data: { type: string; date: string; notes?: string; topic?: string; timeSlot?: string; expertName?: string; expertTitle?: string; expertAvatar?: string }) =>
    apiRequest<{ success: boolean; data: {
      id: string;
      expertName: string;
      expertTitle: string;
      date: string;
      timeSlot: string;
      topic: string;
      status: string;
      notes?: string;
    } }>("/consultations", { method: "POST", body: JSON.stringify(data) }),

  getAdvisors: () =>
    apiRequest<{ success: boolean; data: Array<{
      id: string;
      name: string;
      email: string;
      institution: string;
      avatar: string;
    }> }>("/consultations/advisors"),
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
      clientUserId: number | null;
      advisorUserId: number | null;
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

  sendMessage: (threadId: string, data: { senderId?: string; senderName?: string; senderRole?: string; text: string }) =>
    apiRequest<{ success: boolean; data: {
      id: string;
      senderId: string;
      senderName: string;
      senderRole: string;
      text: string;
      timestamp: string;
      read: boolean;
    } }>(`/chat/threads/${threadId.replace("thr-", "")}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  markThreadRead: (threadId: string) =>
    apiRequest<{ success: boolean }>(`/chat/threads/${threadId.replace("thr-", "")}/read`, {
      method: "PATCH",
    }),
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

  getArtworkById: (id: string) =>
    apiRequest<{ success: boolean; data: Record<string, unknown> }>(`/admin/artworks/${id.replace("ART-", "")}`),

  createArtwork: (data: Record<string, unknown>) =>
    apiRequest<{ success: boolean; data: { id: string; title: string } }>("/admin/artworks", { method: "POST", body: JSON.stringify(data) }),

  updateArtwork: (id: string, data: Record<string, unknown>) =>
    apiRequest<{ success: boolean; data: { id: string; title: string } }>(`/admin/artworks/${id.replace("ART-", "")}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteArtwork: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/artworks/${id.replace("ART-", "")}`, { method: "DELETE" }),

  updateArtworkStatus: (id: string, status: string) =>
    apiRequest<{ success: boolean }>(`/admin/artworks/${id.replace("ART-", "")}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

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
      category: string;
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
    apiRequest<{ success: boolean }>(`/admin/audit-logs/${id.replace("log-", "")}/verify`, { method: "PATCH" }),

  verifyAllAuditLogs: () =>
    apiRequest<{ success: boolean }>("/admin/audit-logs/verify-all", { method: "POST" }),

  releaseEscrow: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/escrow/${id.replace("esc-", "")}/release`, { method: "PATCH" }),

  disputeEscrow: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/escrow/${id.replace("esc-", "")}/dispute`, { method: "PATCH" }),

  refundEscrow: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/escrow/${id.replace("esc-", "")}/refund`, { method: "PATCH" }),

  updateSupportTicketStatus: (id: string, status: string) =>
    apiRequest<{ success: boolean }>(`/chat/tickets/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  addSupportTicketResponse: (id: string, text: string) =>
    apiRequest<{ success: boolean; data: { author: string; text: string; timestamp: string } }>(`/chat/tickets/${id}/responses`, { method: "POST", body: JSON.stringify({ text }) }),

  deleteSupportTicket: (id: string) =>
    apiRequest<{ success: boolean }>(`/chat/tickets/${id}`, { method: "DELETE" }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ success: boolean }>(`/users/change-password`, { method: "POST", body: JSON.stringify(data) }),

  enable2FA: () =>
    apiRequest<{ success: boolean; data: { twoFactorEnabled: boolean } }>("/auth/2fa/enable", { method: "POST" }),

  disable2FA: (password: string) =>
    apiRequest<{ success: boolean; data: { twoFactorEnabled: boolean } }>("/auth/2fa/disable", { method: "POST", body: JSON.stringify({ password }) }),

  getUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    const qs = searchParams.toString();
    return apiRequest<{ success: boolean; data: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      institution: string;
      joinedDate: string;
      lastActive: string;
      status: string;
    }>; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/admin/users${qs ? `?${qs}` : ""}`);
  },

  getUserById: (id: string) =>
    apiRequest<{ success: boolean; data: Record<string, unknown> }>(`/admin/users/${id.replace("usr-", "")}`),

  createUser: (data: { name: string; email: string; password: string; role?: string; institution?: string; country?: string }) =>
    apiRequest<{ success: boolean; data: { id: string; name: string } }>("/admin/users", { method: "POST", body: JSON.stringify(data) }),

  updateUser: (id: string, data: { name?: string; email?: string; role?: string; institution?: string; country?: string; status?: string }) =>
    apiRequest<{ success: boolean; data: { id: string } }>(`/admin/users/${id.replace("usr-", "")}`, { method: "PATCH", body: JSON.stringify(data) }),

  updateUserStatus: (id: string, status: string) =>
    apiRequest<{ success: boolean }>(`/admin/users/${id.replace("usr-", "")}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  deleteUser: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/users/${id.replace("usr-", "")}`, { method: "DELETE" }),

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
    apiRequest<{ success: boolean }>(`/admin/certificates/${id.replace("cert-", "")}`, { method: "PATCH", body: JSON.stringify(data) }),

  revokeCertificate: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/certificates/${id.replace("cert-", "")}/revoke`, { method: "PATCH" }),

  deleteCertificate: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/certificates/${id.replace("cert-", "")}`, { method: "DELETE" }),

  downloadCertificatePdf: async (id: string) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/admin/certificates/${id.replace("cert-", "")}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to download PDF");
    return res.blob();
  },
};
