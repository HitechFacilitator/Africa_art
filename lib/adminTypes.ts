export enum AdminView {
  Artworks = "artworks",
  Users = "users",
  Collectors = "collectors",
  Certificates = "certificates",
  Escrow = "escrow",
  AuditLog = "audit",
  Compliance = "compliance",
  Settings = "settings",
  SupportManagement = "support_mgmt",
  POR = "por",
  Chat = "chat",
}

export interface AdminArtwork {
  id: string;
  title: string;
  culture: string;
  era: string;
  valuation: number | "POR";
  status: "Live" | "Draft" | "Unpublished";
  tier: "VIP" | "Prestige" | "Standard";
  imageUrl: string;
  description: string;
  provenanceHash: string;
  dateCreated: string;
  acquiredYear: number;
  acquiredMethod: string;
  provenance: string[];
}

export interface AdminCollector {
  id: string;
  name: string;
  email: string;
  country: string;
  tier: "VIP" | "Prestige" | "Standard";
  purchasedValue: number;
  acquisitionsCount: number;
  amlStatus: "Verified" | "Pending" | "Unverified";
  joinedDate: string;
  avatarColor: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "advisor" | "collector" | "prestige" | "visitor";
  institution: string;
  joinedDate: string;
  lastActive: string;
  status: string;
}

export interface AdminCertificate {
  id: string;
  artworkTitle: string;
  artworkId: string;
  ownerName: string;
  ownerEmail: string;
  issuedDate: string;
  expiryDate: string;
  status: "Valid" | "Expired" | "Revoked";
  blockchainHash: string;
  verifiedBy: string;
}

export interface EscrowTransaction {
  id: string;
  artworkTitle: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  status: "Held" | "Released" | "Disputed" | "Refunded";
  createdDate: string;
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  timestamp: string;
  action: string;
  txHash: string;
  signed: boolean;
}

export interface ComplianceScanResult {
  riskLevel: "High" | "Medium" | "Low";
  verdict: string;
  culturalSafeguard: string;
  treaties: string[];
  guidelines: string[];
}

export interface AdminPORRequest {
  id: string;
  userId: number;
  artworkId: number;
  message?: string;
  status: "PENDING" | "IN_DISCUSSION" | "CLOSED";
  response?: string;
  user?: { id: number; name: string; email: string };
  artwork?: { id: number; title: string };
  messages: Array<{ id: number; sender: string; senderId?: number; text: string; timestamp: string }>;
  createdAt: string;
}
