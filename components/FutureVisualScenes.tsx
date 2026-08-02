import Image from "next/image";
import Link from "next/link";
import { siteMedia } from "@/media/site";
import { Heading, Section } from "./ui";

const holidayScenes = [
  [
    "Petit-déjeuner",
    "La lumière du matin, une table simple, les premiers gestes de la journée.",
    siteMedia.properties["chai-des-tortues"].editorial.breakfast.src,
    "/maisons/chai-des-tortues",
  ],
  [
    "Panier apéritif",
    "Le retour du producteur et les saveurs de l’île à partager.",
    siteMedia.properties["villa-raie-manta"].terrace[0].src,
    "/panier-aperitif",
  ],
  [
    "Dîner romantique",
    "Une attention préparée pour deux lorsque le jour laisse place à la soirée.",
    siteMedia.properties["villa-raie-manta"].bedrooms[3].src,
    "/romance",
  ],
  [
    "Retour de marché",
    "Les paniers se vident et la cuisine devient le début du repas.",
    siteMedia.properties["chai-des-tortues"].editorial.market.src,
    "/carnet?categorie=marches#guides",
  ],
] as const;

export function FutureVisualScenes() {
  return (
    <Section tone="sand" className="future-scenes">
      <Heading
        eyebrow="Les gestes des vacances"
        title="Les souvenirs commencent souvent par un geste simple."
        description="Ouvrir les volets, rapporter le marché, préparer la table ou laisser une attention surprendre ceux que l’on aime."
      />
      <div className="future-scenes__grid">
        {holidayScenes.map(([title, copy, image, href], index) => (
          <article className={index === 0 || index === 3 ? "is-wide" : ""} key={title}>
            <Link className="future-scenes__frame" href={href} aria-label={`Découvrir : ${title}`}>
              <Image
                src={image}
                alt=""
                fill
                loading="lazy"
                quality={88}
                sizes="(max-width: 700px) 100vw, 50vw"
              />
            </Link>
            <div>
              <p className="eyebrow">{title}</p>
              <p>{copy}</p>
              <Link href={href} className="text-link">
                Découvrir <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
