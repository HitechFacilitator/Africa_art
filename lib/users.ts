import type { Role, UserSession } from "@/lib/auth";

export interface MockUser extends UserSession {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "usr-001",
    email: "julian.doe@adunagallery.com",
    name: "Julian Doe",
    role: "collector",
    password: "Collector2024!",
    avatar: "JD",
    institution: undefined,
  },
  {
    id: "usr-002",
    email: "amara.nkosi@adunagallery.com",
    name: "Amara Nkosi",
    role: "prestige",
    password: "Prestige2024!",
    avatar: "AN",
    institution: undefined,
  },
  {
    id: "usr-003",
    email: "dr.fatima@louvre.fr",
    name: "Dr. Fatima Benali",
    role: "advisor",
    password: "Advisor2024!",
    avatar: "FB",
    institution: "Musée du Louvre",
  },
  {
    id: "usr-004",
    email: "admin@adunagallery.com",
    name: "Admin User",
    role: "admin",
    password: "Admin2024!",
    avatar: "AU",
    institution: "Aduna Gallery",
  },
  {
    id: "usr-005",
    email: "visitor@example.com",
    name: "Guest Visitor",
    role: "visitor",
    password: "Visitor2024!",
    avatar: "GV",
  },
];

export function findUserByEmail(email: string): MockUser | undefined {
  return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserByRole(role: Role): MockUser | undefined {
  return MOCK_USERS.find(u => u.role === role);
}

export function validateCredentials(email: string, password: string): MockUser | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
