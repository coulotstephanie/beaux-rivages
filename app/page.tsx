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
import { DynamicCmsPage } from "@/components/cms/DynamicCmsPage";
import { getPublishedCmsPage } from "@/platform/cms/public";
import { getServerLocale, localize, localizeDeep } from "@/i18n/server";
import { localizedHref } from "@/i18n/lot1-client";

const pageSeo = staticPageSeo["/"];

export async function generateMetadata() {
  const locale = await getServerLocale();
  return createPageMetadata({
    ...localizeDeep(locale, pageSeo),
    image: siteMedia.destination.sea,
    openGraphTitle: localize(locale, "Beaux Rivages — L’hospitalité des îles"),
  });
}

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

export default async function HomePage() {
  const locale = await getServerLocale();
  const t = (source: string) => localize(locale, source);
  const h = (href: string) => localizedHref(locale, href);
  const localizedProperties = localizeDeep(locale, properties);
  const localizedReasons = localizeDeep(locale, reasons);
  const localizedMoments = localizeDeep(locale, moments);
  const localizedSeo = localizeDeep(locale, pageSeo);
  const managedPage = await getPublishedCmsPage("accueil");
  if (managedPage) return <DynamicCmsPage page={localizeDeep(locale, managedPage)} />;
  return (
    <main>
      <PageStructuredData {...localizedSeo} />
      <Header locale={locale} />

      <section className="premium-hero" aria-labelledby="home-title">
        <div className="premium-hero__media">
          <Image
            src="/images/destination/patrimoine/saumonards-plage.jpg"
            alt={t("Plage de sable et océan dans la lumière des îles")}
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="100vw"
          />
        </div>
        <div className="premium-hero__overlay" />
        <div id="home-title">
          <VideoOverlay locale={locale} />
        </div>
        <a className="scroll-indicator" href="#maisons" aria-label={t("Découvrir Beaux Rivages")}>
          <span />
          {t("Découvrir Beaux Rivages")}
        </a>
      </section>

      <Section id="maisons" tone="sand" className="premium-properties">
        <Heading
          eyebrow={t("Nos maisons")}
          title={t("Trois identités, un même niveau d’attention.")}
          description={t("Chaque maison possède son rythme, ses matières, ses usages et son rapport particulier à l’océan.")}
        />
        <div className="property-grid">
          {localizedProperties.map((property) => (
            <PropertyCard
              key={property.title}
              title={property.title}
              subtitle={property.intro}
              href={h(`/maisons/${property.slug}`)}
              image={property.hero}
              location={property.location}
              facts={property.stats.slice(0, 4)}
              bookingHref={h(`/reserver?maison=${property.slug}`)}
              locale={locale}
            />
          ))}
        </div>
      </Section>

      <Section id="pourquoi" className="why-section">
        <Heading
          eyebrow={t("Pourquoi Beaux Rivages")}
          title={t("Le voyage commence avant même d’ouvrir la porte.")}
          description={t("Nos maisons sont le point de départ d’une expérience plus vaste : vivre les îles comme nous les vivons toute l’année.")}
        />
        <div className="why-grid">
          {localizedReasons.map(([number, title, copy]) => (
            <Card key={number} className="why-card">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Card>
          ))}
        </div>
        <div
          className="direct-benefits premium-benefits"
          aria-label={t("Avantages de la réservation directe")}
        >
          <div>
            <strong>{t("Meilleur tarif")}</strong>
            <span>{t("En réservant en direct")}</span>
          </div>
          <div>
            <strong>{t("Relation directe")}</strong>
            <span>{t("Avec Stéphanie & Bruno")}</span>
          </div>
          <div>
            <strong>{t("Virement bancaire")}</strong>
            <span>{t("Règlement direct et suivi")}</span>
          </div>
          <div>
            <strong>{t("Conseils locaux")}</strong>
            <span>{t("Vraiment personnalisés")}</span>
          </div>
        </div>
      </Section>

      <Section className="home-islands" tone="sand">
        <Heading
          eyebrow={t("Deux îles")}
          title={t("Deux horizons, une même invitation à ralentir.")}
          description={t("Choisissez une destination, puis laissez les villages, les chemins et l’océan composer la suite.")}
        />
        <div className="home-islands__grid">
          <Link
            href={h("/destinations/ile-de-re")}
            style={{ backgroundImage: `url(${siteMedia.destination.marsh})` }}
          >
            <span>Île de Ré</span>
            <strong>{t("Villages blancs, marais salants et chemins à vélo.")}</strong>
            <small>{t("Découvrir l’île")} →</small>
          </Link>
          <Link
            href={h("/destinations/ile-d-oleron")}
            style={{ backgroundImage: `url(${siteMedia.destination.beach})` }}
          >
            <span>Île d’Oléron</span>
            <strong>{t("Forêts, plages sauvages et Fort Boyard à l’horizon.")}</strong>
            <small>{t("Découvrir l’île")} →</small>
          </Link>
        </div>
      </Section>

      <Section id="experiences" tone="dark" className="moments-section">
        <Heading
          eyebrow={t("Les Instants Beaux Rivages")}
          title={t("Des souvenirs qui commencent par une lumière, un goût, un chemin.")}
          description={t("Traverser les marais salants, suivre une piste cyclable jusqu’à l’océan, partager des huîtres chez un producteur.")}
          light
        />
        <div className="moments-grid">
          {localizedMoments.map((moment) => (
            <Link
              href={h(moment.href)}
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
        <Button href={h("/experiences")} variant="secondary">
          {t("Explorer toutes les expériences")}
        </Button>
      </Section>

      <Section className="home-reviews" tone="sand">
        <div className="home-reviews__metric">
          <strong>{weightedAirbnbRating} / 5</strong>
          <span>{totalPublicPlatformReviews} {t("avis publics recensés")}</span>
        </div>
        <div className="home-reviews__copy">
          <p className="eyebrow">{t("Ils ont vécu Beaux Rivages")}</p>
          <h2>{t("Ce sont nos voyageurs qui racontent le mieux les maisons.")}</h2>
          <p>
            {t("Le confort, l’emplacement, la propreté et une présence attentive reviennent séjour après séjour.")}
          </p>
          <Button href={h("/avis")} variant="ghost">
            {t("Lire les avis voyageurs")} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </Section>

      <Section className="premium-closing">
        <Heading
          eyebrow={t("L’esprit Beaux Rivages")}
          title={t("Les îles nous ont offert tant de souvenirs… Nous espérons qu’elles vous en offriront autant.")}
          description={t("Bienvenue chez Beaux Rivages.")}
          align="center"
        />
        <Button href={h("/reserver")}>{t("Préparer votre séjour")}</Button>
      </Section>

      <Footer locale={locale} />
    </main>
  );
}
