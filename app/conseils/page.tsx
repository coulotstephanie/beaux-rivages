import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { hostRecommendations } from "@/recommendations";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/conseils"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.food });
const recommendationImages: Record<string, { src: string; alt: string }> = {
  "chez-nina-metayer": {
    src: "/images/destination/nina-metayer/selection-patisseries.jpg",
    alt: "Sélection de pâtisseries de Nina Métayer à Rivedoux-Plage",
  },
  "amore-di-nonna": {
    src: "/images/properties/nid-d-ete/authentique/plateau-charcuterie.jpg",
    alt: "Sélection généreuse de charcuteries à partager",
  },
  "huitres-et-ma-re": {
    src: "/images/destination/huitres-vin-blanc.jpg",
    alt: "Huîtres de l’Atlantique accompagnées d’un verre de vin blanc",
  },
  "cremerie-marianne": {
    src: "/images/destination/re-authentique/marche-fromages.jpg",
    alt: "Fromages régionaux présentés sur un étal du marché",
  },
  "la-martiniere": {
    src: "/images/destination/petits-bonheurs/la-martiniere-02.jpeg",
    alt: "Gaufre, glace et fruits rouges de La Martinière",
  },
  "la-tartentiere": {
    src: "/images/destination/guides/la-tartentiere-tarte.jpg",
    alt: "Tarte artisanale préparée par La Tartentière",
  },
  "marche-rivedoux-plage": {
    src: "/images/destination/guides/marche-rivedoux.jpg",
    alt: "Les étals du marché de Rivedoux-Plage",
  },
  "reeduk-coach": {
    src: "/images/destination/guides/sante-ile-de-re.webp",
    alt: "Le pôle santé de Rivedoux-Plage face à l’océan",
  },
  "bio-sens-coiffure": {
    src: "/images/destination/guides/bio-sens-coiffeur.jpg",
    alt: "Le salon Bio Sens Coiffure sur l’Île de Ré",
  },
};

export default function HostAdvicePage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="subpage-hero">
        <HeroBackground src={siteMedia.destination.food} />
        <div className="subpage-overlay" />
        <div className="subpage-copy">
          <p className="eyebrow light">Les conseils de Stéphanie & Bruno</p>
          <h1>Les îles comme nous les raconterions à des amis.</h1>
          <p>
            Nos producteurs, nos gourmandises, nos balades et les petits conseils qui changent une
            journée.
          </p>
        </div>
      </section>
      <section className="host-magazine shell">
        {hostRecommendations.map((recommendation, index) => {
          const image = recommendationImages[recommendation.slug] ?? {
            src: siteMedia.destination.food,
            alt: `Illustration de ${recommendation.name}`,
          };
          return (
            <article key={recommendation.slug} className={index % 4 === 0 ? "is-featured" : ""}>
              <div className="host-magazine__media">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    index % 4 === 0
                      ? "(max-width: 800px) 100vw, 60vw"
                      : "(max-width: 800px) 100vw, 32vw"
                  }
                  loading="lazy"
                  quality={85}
                />
              </div>
              <div className="host-magazine__copy">
                <p>
                  {recommendation.category} · {recommendation.location}
                </p>
                <h2>{recommendation.name}</h2>
                <h3>{recommendation.title}</h3>
                <p>{recommendation.description}</p>
                <blockquote>« {recommendation.hostNote} »</blockquote>
                {recommendation.practicalTip ? (
                  <p className="host-magazine__tip">
                    <strong>Notre astuce</strong>
                    {recommendation.practicalTip}
                  </p>
                ) : null}
                <a href={recommendation.website} target="_blank" rel="noreferrer">
                  Lien officiel <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          );
        })}
      </section>
      <Footer />
    </main>
  );
}
