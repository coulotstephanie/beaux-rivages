import Image from "next/image";
import { propertyMedia, type PropertySlug } from "@/media/properties";
import { Button, Container } from "./ui";

const stories = {
  "chai-des-tortues": {
    eyebrow: "L’âme de la maison",
    title: "Il y a des maisons que l’on n’oublie pas en refermant la porte.",
    paragraphs: [
      "Ancien chai de Pineau et de Cognac, Le Chai des Tortues fait partie de ces lieux où les vieilles pierres continuent de raconter une histoire.",
      "Nous en avons préservé les volumes et la matière. La lumière retrouve aujourd’hui les murs anciens, tandis que la grande table rassemble les voyageurs.",
    ],
    quote:
      "Les maisons les plus vivantes sont celles qui gardent une trace de ce qu’elles ont été.",
    images: [
      propertyMedia["chai-des-tortues"].hero,
      propertyMedia["chai-des-tortues"].details[0],
      propertyMedia["chai-des-tortues"].livingRoom[0],
    ],
    href: "/histoire-de-nos-maisons#chai-des-tortues",
  },
  "villa-raie-manta": {
    eyebrow: "L’océan comme horizon",
    title: "Une maison où l’horizon entre avant vous.",
    paragraphs: [
      "À peine le pont franchi, le rythme change. Villa Raie Manta prolonge cette sensation dans une maison ouverte sur la lumière et la mer.",
      "Depuis le salon panoramique, le pont devient une ligne dans le paysage. Le matin comme le soir, l’océan accompagne naturellement les retrouvailles.",
    ],
    quote: "Ici, le pont n’est plus un passage : il devient une ligne de lumière dans le paysage.",
    images: [
      propertyMedia["villa-raie-manta"].hero,
      propertyMedia["villa-raie-manta"].livingRoom[1],
      propertyMedia["villa-raie-manta"].exterior[0],
    ],
    href: "/histoire-de-nos-maisons#villa-raie-manta",
  },
  "nid-d-ete": {
    eyebrow: "La Maison Heureuse · Monument historique",
    title: "Un refuge d’été au cœur d’une histoire maritime.",
    paragraphs: [
      "Le Nid d’Été se niche dans La Maison Heureuse, ensemble inscrit au titre des Monuments historiques et intimement lié au chantier de Fort Boyard.",
      "Sous les grands arbres, quelques pas mènent au portail privé de la plage des Saumonards. Le fort demeure à l’horizon, comme un fil discret entre le séjour et l’histoire.",
    ],
    quote:
      "Entre les allées de La Maison Heureuse et le fort à l’horizon, le paysage porte encore sa mémoire.",
    images: [
      propertyMedia["nid-d-ete"].livingRoom[0],
      propertyMedia["nid-d-ete"].lifestyle[14],
      propertyMedia["nid-d-ete"].lifestyle[6],
    ],
    href: "/maison-heureuse-fort-boyard",
  },
} as const;

export function PropertyHistoryStory({ propertySlug }: { propertySlug: PropertySlug }) {
  const story = stories[propertySlug];

  return (
    <section className="property-history-story" id="histoire-de-la-maison">
      <Container size="wide">
        <div className="property-history-story__heading">
          <p className="eyebrow">{story.eyebrow}</p>
          <h2>{story.title}</h2>
        </div>
        <div className="property-history-story__layout">
          <div className="property-history-story__copy">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <blockquote>« {story.quote} »</blockquote>
            <Button href={story.href} variant="ghost">
              Poursuivre cette histoire <span aria-hidden="true">→</span>
            </Button>
          </div>
          <div className="property-history-story__gallery">
            {story.images.map((image, index) => (
              <figure key={`${image.src}-${index}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={85}
                  loading="lazy"
                  sizes="(max-width: 900px) calc(100vw - 40px), 30vw"
                />
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
