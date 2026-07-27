import Link from "next/link";
import { ExperienceCollection } from "@/components/ExperienceCollection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { experiences } from "@/experiences";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/experiences"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.destination.marsh,
});

export default function ExperiencesPage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="page-hero experiences-hero">
        <HeroBackground src={siteMedia.destination.marsh} />
        <div className="page-hero-content">
          <p className="eyebrow light">La collection Beaux Rivages</p>
          <h1>Les souvenirs que l’on emporte avec soi.</h1>
          <p>Des attentions et des expériences choisies par Stéphanie & Bruno pour vivre les îles avec plus d’émotion, de goût et de liberté.</p>
          <Link href="#collection" className="primary-button">Découvrir la collection</Link>
        </div>
      </section>

      <section id="collection" className="experience-collection-intro shell">
        <p className="eyebrow">Douze façons de vivre les îles</p>
        <h2>Choisir moins. Ressentir davantage.</h2>
        <p>Chaque expérience précise son rythme, sa meilleure saison et la maison depuis laquelle elle prend tout son sens. Ajoutez-la à votre séjour : nous vérifierons ensuite les disponibilités et les conditions avec vous.</p>
      </section>

      <ExperienceCollection experiences={experiences} />

      <section className="special-attention experience-final-cta">
        <div className="shell">
          <p className="eyebrow light">Une idée qui n’est pas dans la collection ?</p>
          <h2>Racontez-nous ce que vous aimeriez vivre.</h2>
          <p>Stéphanie & Bruno vous répondront avec une proposition sincère, adaptée à la saison, à la maison et à votre histoire.</p>
          <Link href="/reserver?option=personal-arrival" className="secondary-button">Composer mon séjour</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
