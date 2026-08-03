"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { GalleryImage } from "@/data";
import { chaiDesTortuesMedia } from "@/media/properties/chai-des-tortues";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Container } from "@/components/ui";

type Chapter = {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
  images: GalleryImage[];
};

const media = chaiDesTortuesMedia;

const chapters: Chapter[] = [
  {
    number: "01",
    eyebrow: "L’arrivée",
    title: "La pierre rétaise ouvre la porte.",
    text: "Au cœur de Rivedoux-Plage, la façade discrète laisse deviner une maison singulière. On pose les vélos, on pousse la porte et les volumes de l’ancien chai se révèlent peu à peu.",
    images: [media.arrival[0], media.exterior[2], media.exterior[3]],
  },
  {
    number: "02",
    eyebrow: "Le marché",
    title: "Les Halles donnent le ton de la journée.",
    text: "À quelques minutes à pied, le marché inspire le déjeuner. Les paniers reviennent chargés de produits de l’île, prêts à rejoindre l’îlot central et la grande table.",
    images: [media.lifestyle[0], media.editorial!.market, media.lifestyle[7]],
  },
  {
    number: "03",
    eyebrow: "La cuisine",
    title: "Une cuisine imaginée pour vraiment recevoir.",
    text: "Ici, cuisiner fait partie des vacances. Le bois, les grands plans de travail et les équipements généreux accompagnent aussi bien un dîner improvisé qu’un repas de fête.",
    images: [media.kitchen[1], media.kitchen[2], media.kitchen[5]],
  },
  {
    number: "04",
    eyebrow: "Les repas",
    title: "La grande table rassemble la maison.",
    text: "On y partage les huîtres, les histoires de la journée et les plats que l’on prend enfin le temps de préparer. Les repas se prolongent naturellement sous la charpente.",
    images: [media.kitchen[7], media.lifestyle[4], media.kitchen[8]],
  },
  {
    number: "05",
    eyebrow: "La pièce de vie",
    title: "Un même volume pour vivre ensemble.",
    text: "Salon, salle à manger et cuisine dialoguent sous les poutres. La pierre ancienne adoucit la lumière et donne à chaque moment, du café au dernier verre, une atmosphère particulière.",
    images: [media.livingRoom[1], media.livingRoom[2], media.livingRoom[3]],
  },
  {
    number: "06",
    eyebrow: "Les chambres",
    title: "Le calme gagne l’étage.",
    text: "Trois chambres accueillent les nuits dans une palette de bois clair, de linge naturel et de pierre préservée. Chacune conserve son caractère et la douceur d’une vraie maison.",
    images: [media.bedrooms[1], media.bedrooms[2], media.bedrooms[3]],
  },
  {
    number: "07",
    eyebrow: "Les salles d’eau",
    title: "Des matières franches, un confort contemporain.",
    text: "La pierre minérale, le bois brut et la robinetterie composent des espaces sobres et chaleureux, pensés pour que chacun trouve son rythme.",
    images: [media.bathrooms[0], media.bathrooms[3], media.bathrooms[4]],
  },
  {
    number: "08",
    eyebrow: "Les détails",
    title: "Ce sont eux qui racontent l’ancien chai.",
    text: "Une charpente, un mur irrégulier, l’escalier noir ou une fenêtre ouverte sur la pierre : les traces du lieu n’ont pas été effacées, elles sont devenues le fil conducteur de la maison.",
    images: [media.details[0], media.details[2], media.details[3]],
  },
  {
    number: "09",
    eyebrow: "La plage",
    title: "L’océan attend à quelques pas.",
    text: "À 250 mètres, le rivage change le tempo du séjour. On y part sans voiture, pour marcher, jouer, regarder la lumière ou simplement retrouver l’air marin.",
    images: [media.editorial!.beach, media.lifestyle[11], media.lifestyle[6]],
  },
  {
    number: "10",
    eyebrow: "La soirée",
    title: "Quand la maison garde la lumière.",
    text: "Après la plage et les chemins de l’île, le Chai redevient le point de rassemblement. Une partie, un apéritif ou un dîner aux chandelles suffit à prolonger la journée.",
    images: [media.lifestyle[2], media.livingRoom[0], media.lifestyle[3]],
  },
];

function uniqueImages(images: readonly GalleryImage[]) {
  return Array.from(new Map(images.map((image) => [image.src, image])).values());
}

export function ChaiEditorialReport() {
  const allImages = useMemo(
    () => uniqueImages([...chapters.flatMap((chapter) => chapter.images), ...media.gallery]),
    [],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const change = useCallback((index: number) => setActiveIndex(index), []);
  const openImage = (src: string) => {
    const index = allImages.findIndex((image) => image.src === src);
    if (index >= 0) setActiveIndex(index);
  };

  return (
    <section className="chai-report" aria-labelledby="chai-report-title">
      <Container className="chai-report__intro">
        <p className="eyebrow">Le Chai des Tortues · Reportage</p>
        <h2 id="chai-report-title">Une maison qui se découvre comme on feuillette un carnet.</h2>
        <p>
          De la première lumière sur les pierres aux longues soirées autour de la table, entrez dans
          le rythme d’une maison de famille au cœur de Rivedoux-Plage.
        </p>
      </Container>

      <div className="chai-report__chapters">
        {chapters.map((chapter, chapterIndex) => (
          <article className="chai-report__chapter" key={chapter.number}>
            <Container className="chai-report__copy">
              <span className="chai-report__number" aria-hidden="true">
                {chapter.number}
              </span>
              <div>
                <p className="eyebrow">{chapter.eyebrow}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
              </div>
            </Container>

            <Container className={`chai-report__mosaic ${chapterIndex % 2 ? "is-reversed" : ""}`}>
              {chapter.images.map((image, imageIndex) => (
                <button
                  className={`chai-report__image chai-report__image--${imageIndex + 1}`}
                  type="button"
                  key={image.src}
                  onClick={() => openImage(image.src)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={88}
                    loading="lazy"
                    sizes={
                      imageIndex === 0
                        ? "(max-width: 760px) 100vw, 66vw"
                        : "(max-width: 760px) 100vw, 33vw"
                    }
                  />
                  <span className="chai-report__image-shade" />
                  <span className="chai-report__caption">{image.caption}</span>
                </button>
              ))}
            </Container>

            <Container className="chai-report__action">
              <button type="button" onClick={() => openImage(chapter.images[0].src)}>
                Voir toutes les photos de {chapter.eyebrow.toLowerCase()}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </Container>
          </article>
        ))}
      </div>

      <Container className="chai-report__all">
        <p className="eyebrow">La maison en images</p>
        <h3>Continuer la visite, en plein écran.</h3>
        <button type="button" onClick={() => setActiveIndex(0)}>
          Explorer les {allImages.length} photographies <span aria-hidden="true">→</span>
        </button>
      </Container>

      <ImageLightbox
        images={allImages}
        activeIndex={activeIndex}
        onClose={close}
        onChange={change}
      />
    </section>
  );
}
