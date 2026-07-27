import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data";
import { Badge, Button, Card, Heading, Section } from "@/components/ui";
import { FutureVisualScenes } from "@/components/FutureVisualScenes";
import { siteMedia } from "@/media/site";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { createPageMetadata } from "@/seo";
import { HeroVideo, VideoOverlay } from "@/components/media";

const pageSeo = staticPageSeo["/"];

export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.destination.sea,
  openGraphTitle: "Beaux Rivages — L’hospitalité des îles",
});

const reasons = [
  ["01", "Des maisons singulières", "Trois lieux de caractère, choisis pour leur relation particulière à l’océan et leur façon d’accueillir les moments partagés."],
  ["02", "Une hospitalité sincère", "Une arrivée libre, une présence discrète et les attentions d’une maison préparée comme si nous recevions des amis."],
  ["03", "Les îles de l’intérieur", "Nos producteurs, nos habitudes et nos adresses réellement fréquentées pour vivre Ré et Oléron avec justesse."],
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
          <HeroVideo
            poster={siteMedia.destination.sea}
            sources={{
              mp4: siteMedia.video.homepageHero,
              webm: siteMedia.video.homepageHeroWebm,
            }}
          />
        </div>
        <div className="premium-hero__overlay" />
        <div id="home-title"><VideoOverlay /></div>
        <a className="scroll-indicator" href="#pourquoi" aria-label="Faire défiler vers la suite">
          <span />
          Découvrir
        </a>
      </section>

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
        <div className="direct-benefits premium-benefits" aria-label="Avantages de la réservation directe">
          <div><strong>Meilleur tarif</strong><span>En réservant en direct</span></div>
          <div><strong>Relation directe</strong><span>Avec Stéphanie & Bruno</span></div>
          <div><strong>Chèques-Vacances</strong><span>Acceptés</span></div>
          <div><strong>Conseils locaux</strong><span>Vraiment personnalisés</span></div>
        </div>
      </Section>

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
            />
          ))}
        </div>
      </Section>

      <section className="local-signature" aria-labelledby="nina-metayer-title">
        <div className="local-signature__visual">
          <Image
            src={siteMedia.destination.food}
            alt="Une douceur gourmande à savourer sur l’Île de Ré"
            fill
            quality={90}
            loading="lazy"
            sizes="(max-width: 900px) 100vw, 52vw"
          />
        </div>
        <div className="local-signature__copy">
          <Badge>À Rivedoux-Plage</Badge>
          <p className="local-signature__award">Pâtissière Mondiale 2023 · World’s Best Pastry Chef 2024</p>
          <h2 id="nina-metayer-title">La pâtisserie de Nina Métayer, à quelques pas.</h2>
          <p>Chez Nina fait entrer l’excellence mondiale dans la vie du village. Pour une première visite, Stéphanie et Bruno vous conseillent la chocolatine praliné.</p>
          <div className="local-signature__actions">
            <Button href="/carnet#gastronomie">Voir dans notre Carnet</Button>
            <Button href="https://larochelle.delicatisserie.com/" variant="ghost">Découvrir Chez Nina <span aria-hidden="true">↗</span></Button>
          </div>
        </div>
      </section>

      <Section id="experiences" tone="dark" className="moments-section">
        <Heading
          eyebrow="Les Instants Beaux Rivages"
          title="Des souvenirs qui commencent par une lumière, un goût, un chemin."
          description="Traverser les marais salants, suivre une piste cyclable jusqu’à l’océan, partager des huîtres chez un producteur."
          light
        />
        <div className="moments-grid">
          {moments.map((moment) => (
            <Link href={moment.href} className={`moment-card ${moment.className}`} key={moment.title}>
              <Image src={moment.image} alt="" fill quality={88} loading="lazy" sizes="(max-width: 800px) 100vw, (max-width: 1400px) 58vw, 700px" />
              <span className="moment-card__overlay" />
              <span className="moment-card__content">
                <span className="eyebrow light">{moment.eyebrow}</span>
                <strong>{moment.title}</strong>
              </span>
              <span className="moment-card__arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <Button href="/experiences" variant="secondary">Explorer toutes les expériences</Button>
      </Section>

      <FutureVisualScenes />

      <section className="host-advice">
        <div className="host-advice__visual">
          <Image
            src={siteMedia.destination.lane}
            alt="Ruelle lumineuse au charme insulaire"
            fill
            quality={88}
            loading="lazy"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="host-advice__copy">
          <Badge>Le conseil de Stéphanie & Bruno</Badge>
          <blockquote>« Les plus belles vacances ne se mesurent pas en mètres carrés. Elles se mesurent en souvenirs. »</blockquote>
          <p>Nos recommandations viennent de notre vie sur les îles : des producteurs, artisans et expériences que nous partageons comme nous le ferions avec des amis.</p>
          <Button href="/carnet" variant="ghost">Ouvrir le Carnet Beaux Rivages <span aria-hidden="true">→</span></Button>
        </div>
      </section>

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
