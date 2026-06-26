export interface ArtworkCertificate {
  id: number;
  certificateNumber: string;
  title: string;
  issuedDate: string;
  expiryDate: string | null;
  isValid: boolean;
  blockchainHash: string;
  status: string;
  authenticationLevel: string;
  certifyingBody: string;
}

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
  blurDataURL?: string;
  label: "Price on Request" | number;
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
  certificates?: ArtworkCertificate[];
}

export interface AdvisorMessage {
  id: string;
  sender: "advisor" | "user";
  text: string;
  timestamp: string;
}

export interface MemberApplication {
  fullName: string;
  email: string;
  organization?: string;
  collectorProfile: string;
  message?: string;
  status: "Pending Review" | "Approved" | "Under Swiss Review";
}
