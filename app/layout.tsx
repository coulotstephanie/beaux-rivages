import type { Metadata, Viewport } from "next";
import { AmbientSound } from "@/components/AmbientSound";
import { PremiumUX } from "@/components/PremiumUX";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.beaux-rivages.com"),
  title: "Beaux Rivages — L’hospitalité des îles",
  description: "Trois maisons de caractère sur les îles de Ré et d’Oléron, préparées avec soin par Stéphanie et Bruno.",
  applicationName: "Beaux Rivages",
  keywords: ["Île de Ré", "Île d’Oléron", "maison de vacances", "location saisonnière", "Beaux Rivages"],
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a2733",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#main-content">Aller au contenu principal</a>
        <div id="main-content" tabIndex={-1}>{children}</div>
        <PremiumUX />
        <AmbientSound />
      </body>
    </html>
  );
}
