"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import CollectorHeader from "@/components/dashboard/CollectorHeader";
import CertificatesView from "@/components/dashboard/CertificatesView";
import { ActiveTab, CollectorProfile } from "@/lib/dashboardTypes";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/translations";
import AuthGuard from "@/components/AuthGuard";

export default function CertificatesPage() {
  const { lang } = useTranslate();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const { user } = useAuth();
  const profile: CollectorProfile = {
    name: user?.name || "Guest",
    tier: user?.role === "prestige" ? "Prestige Tier" : "Member Tier",
    currency: "EUR (€)",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    curatorName: "Aduna Advisory Desk",
    regionsOfInterest: ["West Africa", "Central Africa", "East Africa"],
  };

  return (
    <AuthGuard permission="certificates">
      <div className="bg-surface text-ebony-deep min-h-screen font-sans flex flex-col transition-all duration-300 overflow-x-hidden">
        <Sidebar
          activeTab={ActiveTab.Certificates}
          setActiveTab={() => router.push("/dashboard")}
          profile={profile}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          onLogout={() => {
            if (confirm(lang === "fr" ? "Révoquer la session ?" : 'De-authorize session?')) {
              alert(lang === "fr" ? "Session fermée." : 'Session closed.');
            }
          }}
        />

        <CollectorHeader
          activeTab={ActiveTab.Certificates}
          onBack={() => router.push("/dashboard")}
          canGoBack={true}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className={`flex-1 bg-background min-h-screen px-6 sm:px-10 lg:px-12 py-12 lg:py-16 pt-20 lg:pt-16 w-full overflow-hidden transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
          <CertificatesView />
        </main>
      </div>
    </AuthGuard>
  );
}
