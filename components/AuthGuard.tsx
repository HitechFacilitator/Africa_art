"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface AuthGuardProps {
  permission?: string;
  children: React.ReactNode;
}

export default function AuthGuard({ permission, children }: AuthGuardProps) {
  const { isAuthenticated, hasPermission } = useAuth();
  const router = useRouter();

  const allowed = !permission || hasPermission(permission);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/unauthorized");
    } else if (!allowed) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, allowed, router]);

  if (!isAuthenticated || !allowed) {
    return null;
  }

  return <>{children}</>;
}
