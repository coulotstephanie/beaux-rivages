import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { SignatureStayBuilder } from "@/components/SignatureStayBuilder";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/construisez-votre-sejour"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.bridge });

export default function BuildYourStayPage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="subpage-hero">
        <HeroBackground src={siteMedia.destination.bridge} />
        <div className="subpage-overlay" />
        <div className="subpage-copy">
          <p className="eyebrow light">Construisez votre séjour</p>
          <h1>Quelques envies. Un séjour qui vous ressemble.</h1>
          <p>Couple, famille ou amis : choisissez ce que vous aimez et laissez Beaux Rivages composer un premier rythme.</p>
        </div>
      </section>
      <section className="signature-builder-section shell">
        <SignatureStayBuilder />
      </section>
      <Footer />
    </main>
  );
}
