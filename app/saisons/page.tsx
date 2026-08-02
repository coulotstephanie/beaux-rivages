import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/saisons"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.destination.village,
});
const seasons = [
  {
    title: "Printemps",
    period: "Mars · avril · mai",
    copy: "Les villages refleurissent, les marchés reprennent leurs couleurs et la lumière douce invite aux premières longues balades.",
    images: [
      {
        src: siteMedia.destination.village,
        alt: "Ruelle fleurie d’un village de l’Île de Ré au printemps",
      },
      {
        src: siteMedia.destination.flowerDunes,
        alt: "Dunes couvertes de fleurs roses au retour des beaux jours",
      },
      {
        src: siteMedia.destination.lane,
        alt: "Ruelle insulaire fleurie dans la lumière douce du printemps",
      },
    ],
    moments: ["Roses trémières", "Marchés paisibles", "Balades à vélo"],
  },
  {
    title: "Été",
    period: "Juin · juillet · août",
    copy: "La plage devient le terrain de jeu de la journée, entre baignades, marée basse et soirées qui semblent ne jamais finir.",
    images: [
      {
        src: siteMedia.destination.familyForeshore,
        alt: "Familles en tenue d’été jouant sur la plage à marée basse",
      },
      {
        src: siteMedia.destination.beach,
        alt: "Chemin de sable entre les ganivelles menant à l’océan en été",
      },
      {
        src: siteMedia.destination.beachPicnic,
        alt: "Pique-nique estival sur la plage face à l’océan",
      },
    ],
    moments: ["Baignades", "Plage en famille", "Terrasses au soleil"],
  },
  {
    title: "Automne",
    period: "Septembre · octobre · novembre",
    copy: "La lumière se fait dorée sur les marais, les chemins retrouvent leur calme et l’océan accompagne les retours à la maison.",
    images: [
      {
        src: siteMedia.destination.marsh,
        alt: "Marais salants baignés par une lumière dorée d’automne",
      },
      {
        src: siteMedia.destination.reBridgeSunsetBike,
        alt: "Cycliste devant le pont de l’Île de Ré au soleil couchant",
      },
      {
        src: siteMedia.destination.food,
        alt: "Huîtres et vin blanc pour une soirée d’automne face à l’eau",
      },
    ],
    moments: ["Lumière dorée", "Marais silencieux", "Maisons chaleureuses"],
  },
  {
    title: "Hiver",
    period: "Décembre · janvier · février",
    copy: "Sous les cirés, l’estran continue de vivre. Les plages presque seules et le ciel changeant révèlent les îles dans leur vérité.",
    images: [
      {
        src: siteMedia.destination.reOysterFarming,
        alt: "Ostréiculteurs en vêtements de pluie sur l’estran sous un ciel d’hiver",
      },
      {
        src: siteMedia.destination.morningSurf,
        alt: "Surfeur solitaire dans la brume et les vagues de l’océan en hiver",
      },
      {
        src: siteMedia.destination.fortBoyard,
        alt: "Fort Boyard aperçu depuis une plage calme hors saison",
      },
    ],
    moments: ["Océan d’hiver", "Plages désertes", "Calme absolu"],
  },
] as const;
export default function SeasonsPage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="seasons-hero">
        <Image
          src={siteMedia.destination.village}
          alt="Ruelle fleurie d’un village de l’Île de Ré"
          fill
          priority
          sizes="100vw"
        />
        <div>
          <p className="eyebrow light">Revenir autrement</p>
          <h1>Nos maisons vivent au rythme des saisons.</h1>
          <p>Chaque lumière transforme les îles, les habitudes et la façon d’habiter la maison.</p>
        </div>
      </section>
      <section className="season-intro shell">
        <p className="eyebrow">Quatre façons de vivre les îles</p>
        <h2>Les mêmes rivages, jamais tout à fait le même séjour.</h2>
        <p>
          Ces images de la photothèque Beaux Rivages racontent les couleurs, les gestes et les
          lumières réellement rencontrés par Stéphanie et Bruno au fil de l’année.
        </p>
      </section>
      <section className="season-grid shell">
        {seasons.map((season) => (
          <article key={season.title}>
            <div className="season-grid__gallery">
              {season.images.map((image, index) => (
                <div key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 800px) 100vw, 34vw"
                        : "(max-width: 800px) 50vw, 17vw"
                    }
                  />
                </div>
              ))}
            </div>
            <p className="eyebrow">{season.period}</p>
            <h2>{season.title}</h2>
            <p className="season-grid__copy">{season.copy}</p>
            <ul aria-label={`Les plaisirs de ${season.title.toLowerCase()}`}>
              {season.moments.map((moment) => (
                <li key={moment}>{moment}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="season-films">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow light">Les maisons en mouvement</p>
              <h2>La lumière, les volumes, le calme.</h2>
            </div>
            <p>
              Des séquences authentiques du Chai des Tortues, sans musique imposée, pour ressentir
              la maison avant le séjour.
            </p>
          </div>
          <div className="season-films__grid">
            <figure>
              <video
                controls
                muted
                playsInline
                preload="metadata"
                poster={siteMedia.properties["chai-des-tortues"].hero.src}
              >
                <source src="/videos/chai-des-tortues-film-sans-son.mp4" type="video/mp4" />
              </video>
              <figcaption>Le Chai des Tortues · visite de la maison</figcaption>
            </figure>
            <figure>
              <video
                controls
                muted
                playsInline
                preload="none"
                poster={siteMedia.properties["chai-des-tortues"].bedrooms[0].src}
              >
                <source src="/videos/chai-des-tortues-chambre-1-sans-son.mp4" type="video/mp4" />
              </video>
              <figcaption>Les chambres préparées · détails et lumière</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="returning-cta shell">
        <p className="eyebrow">Votre saison</p>
        <h2>Quelle lumière aimeriez-vous retrouver ?</h2>
        <Link className="primary-button" href="/reserver">
          Choisir mes dates
        </Link>
      </section>
      <Footer />
    </main>
  );
}
