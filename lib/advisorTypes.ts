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
  clientTier: "VIP" | "Prestige" | "Standard";
  topic: string;
  date: string;
  timeSlot: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  type: "Video" | "In-Person" | "Phone";
  notes: string;
  followUpRequired: boolean;
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
