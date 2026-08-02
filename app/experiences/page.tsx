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
      !["pack-signature", "romance", "anniversaire", "demande-en-mariage"].includes(slug),
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

      <section className="experience-transition shell" aria-label="Hospitalité Beaux Rivages">
        <p>Les plus beaux souvenirs sont souvent les plus simples.</p>
      </section>

      <section className="included-attentions shell" aria-labelledby="included-attentions-title">
        <p className="eyebrow">Les attentions offertes</p>
        <h2 id="included-attentions-title">Une hospitalité qui se ressent dans les détails.</h2>
        <p>
          Elles ne sont pas des options : elles font naturellement partie de l’accueil Beaux Rivages
          et rendent la maison plus simple, plus chaleureuse et plus agréable à vivre.
        </p>
        <ul>
          <li>
            <strong>Bienvenue</strong>
            <span>Cadeaux de bienvenue et eau fraîche à l’arrivée.</span>
          </li>
          <li>
            <strong>Moments partagés</strong>
            <span>Jeux de plage, livres et jeux de société.</span>
          </li>
          <li>
            <strong>Voyager en famille</strong>
            <span>Équipements bébé mis gratuitement à disposition selon la maison.</span>
          </li>
          <li>
            <strong>Le plaisir de cuisiner</strong>
            <span>
              Cuisines particulièrement équipées et matériel pour préparer et déguster les fruits de
              mer.
            </span>
          </li>
        </ul>
      </section>

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
          <Link href="/contact" className="secondary-button">
            Nous contacter
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
