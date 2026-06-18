export enum ActiveTab {
  Dashboard = 'Dashboard',
  Portfolio = 'Portfolio',
  Certificates = 'Certificates',
  Inquiries = 'Inquiries',
  Consultations = 'Consultations',
  PrivateCatalogues = 'Private Catalogues',
  AlertsAuctions = 'Alerts & Auctions',
  Investment = 'Investment',
  Previews = 'Previews',
  Logistics = 'Logistics',
  Security = 'Security',
  Settings = 'Settings',
  Chat = 'Chat',
  Documentation = 'Documentation',
  Support = 'Support'
}

export enum AcquisitionStatus {
  Certified = 'Certified',
  InTransit = 'In Transit',
  Pending = 'Pending'
}

export interface Acquisition {
  id: string;
  title: string;
  era: string;
  culture: string;
  acquisitionDate: string;
  status: AcquisitionStatus;
  imageUrl: string;
  estimatedValueEur: number;
  description: string;
  provenance: string[];
}

export interface Inquiry {
  id: string;
  artworkTitle: string;
  artworkYear: string;
  imageUrl: string;
  status: 'Received' | 'In Discussion' | 'Offer Presented' | 'Completed' | 'Archived';
  category: string;
  date: string;
  messages: Array<{
    sender: 'collector' | 'curator';
    text: string;
    timestamp: string;
  }>;
}

export interface Consultation {
  id: string;
  expertName: string;
  expertTitle: string;
  expertAvatar: string;
  date: string;
  timeSlot: string;
  topic: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Rejected';
  notes?: string;
  type?: string;
  rejectionReason?: string;
  clientName?: string;
  clientEmail?: string;
  currentCollection?: string;
  meetingFormat?: string;
}

export interface LogisticsShipment {
  id: string;
  artworkTitle: string;
  carrier: string;
  status: 'Origin Hub' | 'Customs Clearance' | 'International Transit' | 'Local Delivery' | 'Delivered';
  estimatedDeliveryDate: string;
  securityTier: string;
  insuranceCoverage: string;
  updates: Array<{
    date: string;
    status: string;
    location: string;
    description: string;
  }>;
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
  tier: string;
  currency: string;
  joinedDate: string;
  curatorName: string;
  regionsOfInterest: string[];
}