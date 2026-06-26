export interface ChatMessage {
  id: string;
  senderId: string | number;
  senderName: string;
  senderRole: "collector" | "visitor" | "advisor" | "admin" | "support" | "prestige";
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  clientName: string;
  clientRole: "collector" | "visitor" | "prestige" | "advisor";
  advisorName: string;
  clientUserId: number | null;
  advisorUserId: number | null;
  subject: string;
  status: "active" | "archived";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface SupportTicket {
  id: string;
  clientName: string;
  clientRole: "collector" | "visitor" | "advisor";
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
  responses: Array<{
    author: string;
    text: string;
    timestamp: string;
  }>;
}
