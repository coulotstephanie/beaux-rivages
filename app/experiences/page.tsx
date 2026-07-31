import Link from "next/link";
import { HospitalityServiceCollection } from "@/components/experiences/HospitalityServiceCollection";
import { ExperienceCollection } from "@/components/ExperienceCollection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { hospitalityServices } from "@/hospitalityServices";
import { experiences } from "@/experiences";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/experiences"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.destination.marsh,
});

export default function ExperiencesPage() {
  const localExperiences = experiences.filter(
    ({ slug }) =>
      ![
        "pack-signature",
        "romance",
        "anniversaire",
        "demande-en-mariage",
        "lune-de-miel",
        "plateau-fruits-de-mer",
      ].includes(slug),
  );
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="page-hero experiences-hero">
        <HeroBackground src={siteMedia.destination.marsh} />
        <div className="page-hero-content">
          <p className="eyebrow light">La collection Beaux Rivages</p>
          <h1>Plus qu’un séjour, une hospitalité personnelle.</h1>
          <p>
            Des services inclus, des attentions choisies et des expériences préparées par Stéphanie
            & Bruno pour que chaque maison vous ressemble dès l’arrivée.
          </p>
          <Link href="#collection" className="primary-button">
            Découvrir la collection
          </Link>
        </div>
      </section>

      <section id="collection" className="experience-collection-intro shell">
        <p className="eyebrow">Expériences & Services Beaux Rivages</p>
        <h2>Une maison prête à vivre. Une attention qui vous ressemble.</h2>
        <p>
          Ce qui est essentiel est déjà inclus. Pour les moments particuliers, choisissez une
          expérience ou racontez-nous votre projet : chaque détail reste confirmé avec vous.
        </p>
      </section>

      <HospitalityServiceCollection services={hospitalityServices} />

      <section className="experience-collection-intro shell">
        <p className="eyebrow">Inspirations locales · hors packs</p>
        <h2>Des idées de journées pour découvrir les îles.</h2>
        <p>
          Ces suggestions ne sont pas des packs vendus à prix fixe. Stéphanie et Bruno vous
          conseillent gratuitement ; lorsqu’un prestataire est nécessaire, son tarif et sa
          disponibilité sont confirmés avant toute réservation.
        </p>
      </section>
      <ExperienceCollection experiences={localExperiences} />

      <section className="special-attention experience-final-cta">
        <div className="shell">
          <p className="eyebrow light">Une idée qui n’est pas dans la collection ?</p>
          <h2>Racontez-nous ce que vous aimeriez vivre.</h2>
          <p>
            Stéphanie & Bruno vous répondront avec une proposition sincère, adaptée à la saison, à
            la maison et à votre histoire.
          </p>
          <Link href="/reserver?option=personal-arrival" className="secondary-button">
            Composer mon séjour
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
