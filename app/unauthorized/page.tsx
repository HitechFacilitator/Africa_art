"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ShieldAlert, Home, LogIn, LayoutDashboard, ArrowLeft } from "lucide-react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { lang, t } = useTranslate();
  const { isAuthenticated, user } = useAuth();

  const dashboardHref = user?.role === "admin" ? "/admin" : user?.role === "advisor" ? "/advisor" : "/dashboard";

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-terracotta-earth/10 flex items-center justify-center border border-terracotta-earth/20">
            <ShieldAlert className="w-10 h-10 text-terracotta-earth" />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-ebony-deep mb-3">
            {lang === "fr" ? "Accès Non Autorisé" : "Unauthorized Access"}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-8 max-w-md mx-auto">
            {lang === "fr"
              ? "Vous n'avez pas les permissions nécessaires pour accéder à cette page. Veuillez vous connecter avec un compte autorisé ou contacter un administrateur."
              : "You don't have the required permissions to access this page. Please log in with an authorized account or contact an administrator."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-surface-container-low border border-on-surface/10 text-ebony-deep font-sans text-xs font-semibold uppercase tracking-widest hover:border-gold-leaf transition-colors"
            >
              <Home className="w-4 h-4" />
              {t("Home")}
            </Link>

            {!isAuthenticated ? (
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-3 bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t("Login")}
              </Link>
            ) : (
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 px-6 py-3 bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                {t("My Dashboard")}
              </Link>
            )}
          </div>

          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-1.5 text-on-surface-variant hover:text-ebony-deep transition-colors font-sans text-xs cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {lang === "fr" ? "Retour" : "Go Back"}
          </button>
        </motion.div>
      </div>
    </>
  );
}
