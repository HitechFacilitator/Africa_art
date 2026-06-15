"use client";

import { type ReactNode } from "react";
import { TranslationProvider } from "@/lib/translations";
import { AuthProvider } from "@/lib/auth";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <AuthProvider>{children}</AuthProvider>
    </TranslationProvider>
  );
}
