export enum AdvisorView {
  Overview = "overview",
  Consultations = "consultations",
  Clients = "clients",
  Placements = "placements",
  Activity = "activity",
  Settings = "settings",
  Chat = "chat",
}

export interface AdvisorConsultation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientInstitution: string;
  clientCountry: string;
  clientTier: "VIP" | "Prestige" | "Standard";
  topic: string;
  date: string;
  timeSlot: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Rejected";
  type: string;
  notes: string;
  rejectionReason: string;
  currentCollection: string;
  meetingFormat: string;
  followUpRequired: boolean;
  createdAt: string;
}

export interface AdvisorClient {
  id: string;
  name: string;
  email: string;
  tier: "VIP" | "Prestige" | "Standard";
  country: string;
  totalSpent: number;
  acquisitionsCount: number;
  lastContact: string;
  satisfactionScore: number;
  avatarColor: string;
  interests: string[];
}

export interface AdvisorPlacement {
  id: string;
  artworkTitle: string;
  artworkCulture: string;
  artworkEra: string;
  valuation: number;
  clientName: string;
  status: "Proposed" | "Under Review" | "Accepted" | "Declined" | "Completed";
  commission: number;
  proposedDate: string;
  notes: string;
  imageUrl: string;
}

export interface AdvisorActivity {
  id: string;
  type: "consultation" | "placement" | "client" | "system";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}
