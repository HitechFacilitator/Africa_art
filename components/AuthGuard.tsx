"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/translations";

interface AuthGuardProps {
  permission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ permission, children, fallback }: AuthGuardProps) {
  const { isAuthenticated, hasPermission } = useAuth();
  const { lang } = useTranslate();
  const router = useRouter();

  const allowed = !permission || hasPermission(permission);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <ShieldCheck size={48} className="text-gold-leaf/30 mx-auto mb-4" />
          <h2 className="font-serif text-xl text-ebony-deep mb-2">
            {lang === "fr" ? "Authentification Requise" : "Authentication Required"}
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            {lang === "fr"
              ? "Veuillez vous connecter pour accéder à cette page."
              : "Please log in to access this page."}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0"
          >
            {lang === "fr" ? "Se Connecter" : "Log In"}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!allowed) {
    return (
      fallback || (
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <ShieldCheck size={48} className="text-terracotta-earth/30 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-ebony-deep mb-2">
              {lang === "fr" ? "Accès Refusé" : "Access Denied"}
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">
              {lang === "fr"
                ? "Vous n'avez pas les permissions nécessaires pour accéder à cette page. Veuillez contacter un administrateur."
                : "You don't have the required permissions to access this page. Please contact an administrator."}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-ebony-deep text-parchment-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0"
            >
              {lang === "fr" ? "Retour au Tableau de Bord" : "Back to Dashboard"}
            </button>
          </motion.div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
