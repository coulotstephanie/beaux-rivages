import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data";
import { Button, Card, Heading, Section } from "@/components/ui";
import { siteMedia } from "@/media/site";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { createPageMetadata } from "@/seo";
import { VideoOverlay } from "@/components/media";
import { totalPublicPlatformReviews, weightedAirbnbRating } from "@/reviews";

const pageSeo = staticPageSeo["/"];

export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.destination.sea,
  openGraphTitle: "Beaux Rivages — L’hospitalité des îles",
});

const reasons = [
  [
    "01",
    "Des maisons singulières",
    "Trois lieux de caractère, choisis pour leur relation particulière à l’océan et leur façon d’accueillir les moments partagés.",
  ],
  [
    "02",
    "Une hospitalité sincère",
    "Une arrivée libre, une présence discrète et les attentions d’une maison préparée comme si nous recevions des amis.",
  ],
  [
    "03",
    "Les îles de l’intérieur",
    "Nos producteurs, nos habitudes et nos adresses réellement fréquentées pour vivre Ré et Oléron avec justesse.",
  ],
];

const moments = [
  {
    eyebrow: "Au fil des saisons",
    title: "Les paysages qui nous font ralentir.",
    image: siteMedia.destination.marsh,
    href: "/destinations",
    className: "moment-card--large",
  },
  {
    eyebrow: "Savoir-faire",
    title: "Rencontrer ceux qui façonnent les îles.",
    image: siteMedia.destination.salt,
    href: "/experiences",
    className: "moment-card--portrait",
  },
  {
    eyebrow: "Carnet gourmand",
    title: "Les saveurs de l’Atlantique.",
    image: siteMedia.destination.food,
    href: "/carnet",
    className: "moment-card--wide",
  },
  {
    eyebrow: "Ralentir",
    title: "Retrouver le temps de regarder l’horizon.",
    image: siteMedia.destination.beach,
    href: "/experiences",
    className: "moment-card--small",
  },
];

export default function HomePage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />

      <section className="premium-hero" aria-labelledby="home-title">
        <div className="premium-hero__media">
          <Image
            src="/images/destination/patrimoine/saumonards-plage.jpg"
            alt="Plage de sable et océan dans la lumière des îles"
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="100vw"
          />
        </div>
        <div className="premium-hero__overlay" />
        <div id="home-title">
          <VideoOverlay />
        </div>
        <a className="scroll-indicator" href="#maisons" aria-label="Découvrir Beaux Rivages">
          <span />
          Découvrir Beaux Rivages
        </a>
      </section>

      <Section id="maisons" tone="sand" className="premium-properties">
        <Heading
          eyebrow="Nos maisons"
          title="Trois identités, un même niveau d’attention."
          description="Chaque maison possède son rythme, ses matières, ses usages et son rapport particulier à l’océan."
        />
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.title}
              title={property.title}
              subtitle={property.intro}
              href={`/maisons/${property.slug}`}
              image={property.hero}
              location={property.location}
              facts={property.stats.slice(0, 4)}
              bookingHref={`/reserver?maison=${property.slug}`}
            />
          ))}
        </div>
      </Section>

      <Section id="pourquoi" className="why-section">
        <Heading
          eyebrow="Pourquoi Beaux Rivages"
          title="Le voyage commence avant même d’ouvrir la porte."
          description="Nos maisons sont le point de départ d’une expérience plus vaste : vivre les îles comme nous les vivons toute l’année."
        />
        <div className="why-grid">
          {reasons.map(([number, title, copy]) => (
            <Card key={number} className="why-card">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Card>
          ))}
        </div>
        <div
          className="direct-benefits premium-benefits"
          aria-label="Avantages de la réservation directe"
        >
          <div>
            <strong>Meilleur tarif</strong>
            <span>En réservant en direct</span>
          </div>
          <div>
            <strong>Relation directe</strong>
            <span>Avec Stéphanie & Bruno</span>
          </div>
          <div>
            <strong>Virement bancaire</strong>
            <span>Règlement direct et suivi</span>
          </div>
          <div>
            <strong>Conseils locaux</strong>
            <span>Vraiment personnalisés</span>
          </div>
        </div>
      </Section>

      <Section className="home-islands" tone="sand">
        <Heading
          eyebrow="Deux îles"
          title="Deux horizons, une même invitation à ralentir."
          description="Choisissez une destination, puis laissez les villages, les chemins et l’océan composer la suite."
        />
        <div className="home-islands__grid">
          <Link
            href="/destinations/ile-de-re"
            style={{ backgroundImage: `url(${siteMedia.destination.marsh})` }}
          >
            <span>Île de Ré</span>
            <strong>Villages blancs, marais salants et chemins à vélo.</strong>
            <small>Découvrir l’île →</small>
          </Link>
          <Link
            href="/destinations/ile-d-oleron"
            style={{ backgroundImage: `url(${siteMedia.destination.beach})` }}
          >
            <span>Île d’Oléron</span>
            <strong>Forêts, plages sauvages et Fort Boyard à l’horizon.</strong>
            <small>Découvrir l’île →</small>
          </Link>
        </div>
      </Section>

      <Section id="experiences" tone="dark" className="moments-section">
        <Heading
          eyebrow="Les Instants Beaux Rivages"
          title="Des souvenirs qui commencent par une lumière, un goût, un chemin."
          description="Traverser les marais salants, suivre une piste cyclable jusqu’à l’océan, partager des huîtres chez un producteur."
          light
        />
        <div className="moments-grid">
          {moments.map((moment) => (
            <Link
              href={moment.href}
              className={`moment-card ${moment.className}`}
              key={moment.title}
            >
              <Image
                src={moment.image}
                alt=""
                fill
                quality={88}
                loading="lazy"
                sizes="(max-width: 800px) 100vw, (max-width: 1400px) 58vw, 700px"
              />
              <span className="moment-card__overlay" />
              <span className="moment-card__content">
                <span className="eyebrow light">{moment.eyebrow}</span>
                <strong>{moment.title}</strong>
              </span>
              <span className="moment-card__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
        <Button href="/experiences" variant="secondary">
          Explorer toutes les expériences
        </Button>
      </Section>

      <Section className="home-reviews" tone="sand">
        <div className="home-reviews__metric">
          <strong>{weightedAirbnbRating} / 5</strong>
          <span>{totalPublicPlatformReviews} avis publics recensés</span>
        </div>
        <div className="home-reviews__copy">
          <p className="eyebrow">Ils ont vécu Beaux Rivages</p>
          <h2>Ce sont nos voyageurs qui racontent le mieux les maisons.</h2>
          <p>
            Le confort, l’emplacement, la propreté et une présence attentive reviennent séjour après
            séjour.
          </p>
          <Button href="/avis" variant="ghost">
            Lire les avis voyageurs <span aria-hidden="true">→</span>
          </Button>
        </div>
      </Section>

      <Section className="premium-closing">
        <Heading
          eyebrow="L’esprit Beaux Rivages"
          title="Les îles nous ont offert tant de souvenirs… Nous espérons qu’elles vous en offriront autant."
          description="Bienvenue chez Beaux Rivages."
          align="center"
        />
        <Button href="/reserver">Préparer votre séjour</Button>
      </Section>

      <Footer />
    </main>
  );
}
