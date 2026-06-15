import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Aduna Gallery",
    default: "Aduna Gallery — Premium African Art",
  },
  description:
    "A luxury digital platform for the discovery, acquisition, and investment of prestigious African artworks. Curated collections with verified provenance and institutional trust.",
  keywords: [
    "African art",
    "African art gallery",
    "premium art",
    "art investment",
    "provenance",
    "African artifacts",
    "luxury art marketplace",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Aduna Gallery",
    title: "Aduna Gallery — Premium African Art",
    description:
      "Discover, acquire and invest in prestigious African artworks with verified provenance and institutional trust.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-ebony-deep font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
