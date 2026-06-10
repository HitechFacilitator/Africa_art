export enum AdminView {
  Artworks = "artworks",
  Collectors = "collectors",
  Escrow = "escrow",
  AuditLog = "audit",
  Compliance = "compliance",
  Settings = "settings",
  Docs = "docs",
  Support = "support",
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
