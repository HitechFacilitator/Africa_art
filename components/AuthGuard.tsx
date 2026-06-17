"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface AuthGuardProps {
  permission?: string;
  children: React.ReactNode;
}

export default function AuthGuard({ permission, children }: AuthGuardProps) {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const router = useRouter();

  const allowed = !permission || hasPermission(permission);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/unauthorized");
    } else if (!allowed) {
      router.replace("/unauthorized");
    }
  }, [loading, isAuthenticated, allowed, router]);

  if (loading) return null;
  if (!isAuthenticated || !allowed) return null;

  return <>{children}</>;
}
