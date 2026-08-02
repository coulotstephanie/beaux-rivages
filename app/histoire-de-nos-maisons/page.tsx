import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { Button, Container } from "@/components/ui";
import { staticPageSeo } from "@/content/fr/seo";
import { propertyMedia } from "@/media/properties";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/histoire-de-nos-maisons"];

export const metadata = createPageMetadata({
  ...pageSeo,
  image: propertyMedia["nid-d-ete"].exterior[0].src,
});

const houseStories = [
  {
    id: "nid-d-ete",
    number: "01",
    eyebrow: "Boyardville · Île d’Oléron",
    title: "La Maison Heureuse et l’horizon de Fort Boyard",
    copy: "Un ensemble né avec le chantier de Fort Boyard, devenu colonie de vacances puis résidence inscrite Monument historique. Le Nid d’Été y prolonge aujourd’hui une histoire tournée vers l’océan.",
    image: {
      src: "/images/properties/nid-d-ete/authentique/maison-heureuse-facade.jpeg",
      alt: "Façade historique jaune et blanche de la Maison Heureuse à Boyardville",
    },
    href: "/maison-heureuse-fort-boyard",
    houseHref: "/maisons/nid-d-ete",
    houseLabel: "Découvrir Le Nid d’Été",
  },
  {
    id: "chai-des-tortues",
    number: "02",
    eyebrow: "Rivedoux-Plage · Île de Ré",
    title: "Les pierres d’un ancien chai, devenues maison de famille",
    copy: "Les matières préservées et les volumes de l’ancien chai racontent le patrimoine viticole rétais. Une maison réinventée sans effacer ce qui lui donne son âme.",
    image: propertyMedia["chai-des-tortues"].hero,
    href: "/maisons/chai-des-tortues#histoire-de-la-maison",
    houseHref: "/maisons/chai-des-tortues",
    houseLabel: "Découvrir Le Chai des Tortues",
  },
  {
    id: "villa-raie-manta",
    number: "03",
    eyebrow: "Rivedoux-Plage · Île de Ré",
    title: "La lumière de l’océan pour première impression",
    copy: "Depuis le salon panoramique, le pont et la mer composent un paysage en mouvement. La Villa Raie Manta raconte le moment précis où l’on comprend que les vacances ont commencé.",
    image: propertyMedia["villa-raie-manta"].hero,
    href: "/maisons/villa-raie-manta#histoire-de-la-maison",
    houseHref: "/maisons/villa-raie-manta",
    houseLabel: "Découvrir Villa Raie Manta",
  },
] as const;

export default function HouseStoriesPage() {
  return (
    <main className="house-stories-page">
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="house-stories-hero">
        <Image
          src={propertyMedia["villa-raie-manta"].exterior[0].src}
          alt="L’océan et le pont de l’Île de Ré vus depuis Villa Raie Manta"
          fill
          priority
          sizes="100vw"
        />
        <div className="house-stories-hero__overlay" />
        <Container>
          <p className="eyebrow light">L’histoire de nos maisons</p>
          <h1>
            Trois maisons.
            <br />
            Trois histoires.
            <br />
            Une même passion de l’hospitalité.
          </h1>
          <p>
            L’une raconte Fort Boyard. L’autre perpétue la mémoire d’un ancien chai. La troisième
            célèbre la lumière de l’océan. Nous avons préservé leur âme tout en leur offrant le
            confort d’aujourd’hui.
          </p>
        </Container>
      </section>

      <section className="house-stories-list shell">
        {houseStories.map((story) => (
          <article id={story.id} className="house-story-card" key={story.id}>
            <div className="house-story-card__image">
              <Image
                src={story.image.src}
                alt={story.image.alt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <div className="house-story-card__copy">
              <span>{story.number}</span>
              <p className="eyebrow">{story.eyebrow}</p>
              <h2>{story.title}</h2>
              <p>{story.copy}</p>
              <div>
                <Button href={story.href}>Lire l’histoire</Button>
                <Link href={story.houseHref}>{story.houseLabel} →</Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
