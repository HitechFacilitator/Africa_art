"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface AuthGuardProps {
  permission?: string;
  children: React.ReactNode;
}

export default function AuthGuard({ permission, children }: AuthGuardProps) {
  const { isAuthenticated, loading, loggingOut, hasPermission } = useAuth();
  const router = useRouter();

  const allowed = !permission || hasPermission(permission);

  useEffect(() => {
    if (loading || loggingOut) return;
    if (!isAuthenticated) {
      router.replace("/unauthorized");
    } else if (!allowed) {
      router.replace("/unauthorized");
    }
  }, [loading, isAuthenticated, allowed, loggingOut, router]);

  if (loading || loggingOut) return null;
  if (!isAuthenticated || !allowed) return null;

  return <>{children}</>;
}
