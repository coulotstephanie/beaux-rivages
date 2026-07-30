import type { Metadata, Viewport } from "next";
import { AmbientSound } from "@/components/AmbientSound";
import { PremiumUX } from "@/components/PremiumUX";
import { Analytics } from "@/components/Analytics";
import { AppProviders } from "@/components/providers";
import "./globals.css";
import "./foundations.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.beaux-rivages.com"),
  title: "Beaux Rivages — L’hospitalité des îles",
  description:
    "Trois maisons de caractère sur les îles de Ré et d’Oléron, préparées avec soin par Stéphanie et Bruno.",
  applicationName: "Beaux Rivages",
  keywords: [
    "Île de Ré",
    "Île d’Oléron",
    "maison de vacances",
    "location saisonnière",
    "Beaux Rivages",
  ],
  robots: { index: true, follow: true },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  manifest: "/manifest.webmanifest",
  openGraph: { images: ["/opengraph.png"] },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#16354A",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#main-content">
          Aller au contenu principal
        </a>
        <AppProviders>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <PremiumUX />
          <AmbientSound />
          <Analytics />
        </AppProviders>
      </body>
    </html>
  );
}
