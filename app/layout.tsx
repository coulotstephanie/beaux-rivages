import type { Metadata, Viewport } from "next";
import { AmbientWaves } from "@/components/AmbientWaves";
import { PremiumUX } from "@/components/PremiumUX";
import { Analytics } from "@/components/Analytics";
import { AppProviders } from "@/components/providers";
import { StructuredData } from "@/components/StructuredData";
import { SITE_URL, languageAlternates } from "@/seo";
import { getServerLocale, localize } from "@/i18n/server";
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
  alternates: { canonical: SITE_URL, languages: languageAlternates("/") },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return (
    <html lang={locale}>
      <body>
        <StructuredData
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}#organization`,
              name: "Beaux Rivages",
              url: SITE_URL,
              logo: `${SITE_URL}/icon-192.png`,
              email: "coulotstephanie@gmail.com",
              telephone: "+33617260094",
              areaServed: ["Île de Ré", "Île d’Oléron", "La Rochelle"],
              availableLanguage: ["fr", "en", "de", "es", "nl"],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}#website`,
              name: "Beaux Rivages",
              url: SITE_URL,
              inLanguage: ["fr-FR", "en-GB", "de-DE", "es-ES", "nl-NL"],
              publisher: { "@id": `${SITE_URL}#organization` },
            },
          ]}
        />
        <a className="skip-link" href="#main-content">
          {localize(locale, "Aller au contenu principal")}
        </a>
        <AppProviders locale={locale}>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <PremiumUX />
          <AmbientWaves locale={locale} />
          <Analytics />
        </AppProviders>
      </body>
    </html>
  );
}
