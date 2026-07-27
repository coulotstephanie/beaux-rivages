import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { PremiumPhotoLibrary } from "@/components/PremiumPhotoLibrary";
import { Container } from "@/components/ui";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { photoLibrary } from "@/phototheque";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/phototheque"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.marsh });

export default function PhotoLibraryPage() {
  return (
    <main className="photo-library">
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="page-hero photo-library__hero">
        <HeroBackground src={siteMedia.properties["villa-raie-manta"].hero.src} />
        <div className="page-hero-content">
          <p className="eyebrow light">Maisons · Instants · Rivages</p>
          <h1>La Photothèque</h1>
          <p>Les maisons telles qu’elles se vivent, du premier café aux dernières lumières sur l’océan.</p>
        </div>
      </section>
      <section className="photo-library__intro">
        <Container size="narrow">
          <p className="eyebrow">Regarder avant d’arriver</p>
          <h2>Entrez dans l’univers Beaux Rivages.</h2>
          <p>Explorez chaque espace, ouvrez les images en plein écran et laissez défiler les histoires de Ré et d’Oléron.</p>
        </Container>
      </section>
      <Container className="photo-library__content">
        <PremiumPhotoLibrary photos={photoLibrary} />
      </Container>
      <Footer />
    </main>
  );
}
