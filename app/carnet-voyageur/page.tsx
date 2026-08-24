import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StayPortal } from "@/components/StayPortal";
import { StructuredData } from "@/components/StructuredData";
import { SITE_URL } from "@/seo";

export const metadata: Metadata = {
  title: "Mon séjour | Beaux Rivages",
  description: "Votre espace voyageur sécurisé Beaux Rivages.",
  robots: { index: false, follow: false },
};

export default async function TravelerPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const { access } = await searchParams;
  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Mon séjour",
          url: `${SITE_URL}/carnet-voyageur`,
          isPartOf: { "@type": "WebSite", name: "Beaux Rivages", url: SITE_URL },
        }}
      />
      <Header contrast="dark" />
      <section className="stay-portal-page shell">
        <p className="eyebrow">Mon séjour</p>
        <h1>Votre maison, vos attentions, vos repères.</h1>
        <StayPortal initialToken={access?.slice(0, 8_000)} />
      </section>
      <Footer />
    </main>
  );
}
