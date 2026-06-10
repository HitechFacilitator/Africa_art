export interface Artwork {
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
  label: "Price on Request" | "Available" | "Private Collection" | "Reserved";
  scarcityIndex?: number;
  preservationStatus?: string;
  appreciationRate?: string;
  isHero?: boolean;
  provenance: string[];
  historicalStory: string;
  investmentThesis: string;
  investment?: {
    estimatedValue: string;
    historicalCagr: number;
    yieldIndex: number;
  };
}

export type Artifact = Artwork;

export interface BidActivity {
  bidder: string;
  timestamp: string;
  amount: number;
  isUser?: boolean;
}

export interface ArtLot extends Artwork {
  description: string;
  currentBid: number;
  estimate: string;
  provenanceType: string;
  countdownSeconds: number;
  history: BidActivity[];
  region: string;
}

export interface Inquiry {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkOrigin: string;
  artworkCentury: string;
  fullName: string;
  affiliation?: string;
  budget: string;
  message: string;
  status: "Received" | "In Review" | "Curator Assigned" | "In Discussion" | "Resolved";
  curatorName?: string;
  timestamp: string;
  messages: Message[];
}

export interface Message {
  id: string;
  sender: "user" | "curator";
  content: string;
  timestamp: string;
}

export interface Masterpiece {
  id: string;
  title: string;
  origin: string;
  century: string;
  imageUrl: string;
  description: string;
  scarcityIndex: number;
  provenance: string[];
  appreciationRate: string;
  investmentThesis: string;
}

export interface Acquisition {
  id: string;
  title: string;
  era: string;
  culture: string;
  imageUrl: string;
  estimatedValueEur: number;
  status: "In Vault" | "In Transit" | "Appraisal Pending" | "Delivered";
  provenance: string[];
  description: string;
}

export type AcquisitionStatus =
  | "In Vault"
  | "In Transit"
  | "Appraisal Pending"
  | "Delivered";

export interface AcquisitionStatusType {
  InVault: "In Vault";
  InTransit: "In Transit";
  AppraisalPending: "Appraisal Pending";
  Delivered: "Delivered";
}

export interface Consultation {
  id: string;
  specialist: string;
  date: string;
  time: string;
  topic: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface LogisticsShipment {
  id: string;
  artworkTitle: string;
  carrier: string;
  status: string;
  estimatedDeliveryDate: string;
  securityTier: string;
  insuranceCoverage: string;
  updates: LogisticsUpdate[];
}

export interface LogisticsUpdate {
  date: string;
  status: string;
  location: string;
  description: string;
}

export interface SecurityRecord {
  id: string;
  artworkTitle: string;
  vaultLocation: string;
  fingerprintId: string;
  smartContractAddress: string;
  lastInspectionDate: string;
  temperatureHumidity: string;
  insurancePolicyNumber: string;
}

export interface CollectorProfile {
  name: string;
  email: string;
  tier: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialistId: string;
  artworkInterest: string;
  createdAt: string;
}

export interface MemberApplication {
  fullName: string;
  email: string;
  organization?: string;
  collectorProfile: string;
  message?: string;
  status: "Pending Review" | "Approved" | "Under Swiss Review";
}

export interface AdvisorMessage {
  id: string;
  sender: "advisor" | "user";
  text: string;
  timestamp: string;
}

export interface ProvenanceNode {
  id: string;
  date: string;
  location: string;
  description: string;
  verified: boolean;
}

export interface Certificate {
  id: string;
  artworkId: string;
  artworkTitle: string;
  issueDate: string;
  expiryDate: string;
  status: "VALID" | "REVIEWING" | "EXPIRED";
  issuer: string;
  certificateNumber: string;
}

export type ActiveTab =
  | "Dashboard"
  | "Portfolio"
  | "Inquiries"
  | "Consultations"
  | "Logistics"
  | "Security"
  | "Settings";

export type AdminTab =
  | "audit"
  | "artworks"
  | "collectors"
  | "escrow"
  | "compliance"
  | "settings"
  | "docs"
  | "support";