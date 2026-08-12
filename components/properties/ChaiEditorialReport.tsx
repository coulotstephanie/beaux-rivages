"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { GalleryImage } from "@/data";
import { destinationMedia } from "@/media/destinations";
import { chaiDesTortuesMedia } from "@/media/properties/chai-des-tortues";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Container } from "@/components/ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

type Chapter = {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
  galleryLabel: string;
  images: GalleryImage[];
};

const media = chaiDesTortuesMedia;

const chapters: Chapter[] = [
  {
    number: "01",
    eyebrow: "L’arrivée",
    title: "La pierre rétaise ouvre la porte.",
    text: "Au cœur de Rivedoux-Plage, la façade discrète laisse deviner une maison singulière. On pose les vélos, on pousse la porte et les volumes de l’ancien chai se révèlent peu à peu.",
    galleryLabel: "Explorer la galerie de l’arrivée",
    images: [media.arrival[0], media.exterior[3], media.exterior[2]],
  },
  {
    number: "02",
    eyebrow: "La cuisine",
    title: "Une cuisine imaginée pour vraiment recevoir.",
    text: "Ici, cuisiner fait partie des vacances. Le bois, les grands plans de travail et les équipements généreux accompagnent aussi bien un dîner improvisé qu’un repas de fête.",
    galleryLabel: "Explorer la galerie de la cuisine",
    images: [media.kitchen[8], media.kitchen[7], media.kitchen[1]],
  },
  {
    number: "03",
    eyebrow: "Les repas",
    title: "La grande table rassemble la maison.",
    text: "On y partage les huîtres, les histoires de la journée et les plats que l’on prend enfin le temps de préparer. Les repas se prolongent naturellement sous la charpente.",
    galleryLabel: "Explorer la galerie des repas",
    images: [media.kitchen[7], media.lifestyle[4], media.kitchen[8]],
  },
  {
    number: "04",
    eyebrow: "La pièce de vie",
    title: "Un même volume pour vivre ensemble.",
    text: "Salon, salle à manger et cuisine dialoguent sous les poutres. La pierre ancienne adoucit la lumière et donne à chaque moment, du café au dernier verre, une atmosphère particulière.",
    galleryLabel: "Explorer la galerie de la pièce de vie",
    images: [media.livingRoom[5], media.livingRoom[6], media.livingRoom[7]],
  },
  {
    number: "05",
    eyebrow: "Les chambres",
    title: "Le calme gagne l’étage.",
    text: "Trois chambres accueillent les nuits dans une palette de bois clair, de linge naturel et de pierre préservée. Chacune conserve son caractère et la douceur d’une vraie maison.",
    galleryLabel: "Explorer la galerie des chambres",
    images: [media.bedrooms[9], media.bedrooms[8], media.bedrooms[7]],
  },
  {
    number: "06",
    eyebrow: "Les salles d’eau",
    title: "Des matières franches, un confort contemporain.",
    text: "La pierre minérale, le bois brut et la robinetterie composent des espaces sobres et chaleureux, pensés pour que chacun trouve son rythme.",
    galleryLabel: "Explorer la galerie des salles d’eau",
    images: [media.bathrooms[9], media.bathrooms[8], media.bathrooms[0]],
  },
  {
    number: "07",
    eyebrow: "Les détails",
    title: "Ce sont eux qui racontent l’ancien chai.",
    text: "Une charpente, un mur irrégulier, l’escalier noir ou une fenêtre ouverte sur la pierre : les traces du lieu n’ont pas été effacées, elles sont devenues le fil conducteur de la maison.",
    galleryLabel: "Explorer la galerie des détails",
    images: [media.details[0], media.details[2], media.details[3]],
  },
  {
    number: "08",
    eyebrow: "Le rivage",
    title: "L’océan attend à quelques pas.",
    text: "À 250 mètres, le rivage change le tempo du séjour. On y part sans voiture pour marcher, regarder la lumière et retrouver l’air marin.",
    galleryLabel: "Explorer la galerie du rivage",
    images: [media.editorial!.beach, destinationMedia.reBeachCairn, destinationMedia.reLove],
  },
  {
    number: "09",
    eyebrow: "La soirée",
    title: "Quand la maison garde la lumière.",
    text: "Après la plage et les chemins de l’île, le Chai redevient le point de rassemblement. Une partie, un apéritif ou un dîner aux chandelles suffit à prolonger la journée.",
    galleryLabel: "Explorer la galerie de la soirée",
    images: [media.lifestyle[2], media.lifestyle[0], media.lifestyle[3]],
  },
];

function uniqueImages(images: readonly GalleryImage[]) {
  return Array.from(new Map(images.map((image) => [image.src, image])).values());
}

export function ChaiEditorialReport({
  mediaOverrides = {},
  mediaOrder = {},
  textOverrides = {},
  locale = "fr",
}: {
  mediaOverrides?: Record<string, GalleryImage>;
  mediaOrder?: Record<string, string[]>;
  textOverrides?: Record<string, string>;
  locale?: SupportedLocale;
}) {
  const renderedChapters = useMemo(
    () =>
      chapters.map((chapter, chapterIndex) => ({
        ...chapter,
        eyebrow: tr(locale, chapter.eyebrow),
        title: tr(locale, chapter.title),
        text: tr(locale, chapter.text),
        galleryLabel: tr(locale, chapter.galleryLabel),
        images: (() => {
          const group = `editorial.${chapterIndex}`;
          const baseItems = chapter.images.map((image, imageIndex) => {
            const selected = mediaOverrides[`${group}.${imageIndex}`] ?? image;
            return {
              ...selected,
              alt: tr(locale, selected.alt),
              caption: selected.caption ? tr(locale, selected.caption) : selected.caption,
              editorField: `${group}.${imageIndex}`,
            };
          });
          const order = mediaOrder[group];
          const addedItems = (order ?? [])
            .filter((field) => !baseItems.some((item) => item.editorField === field))
            .flatMap((field) =>
              mediaOverrides[field] ? [{ ...mediaOverrides[field], editorField: field }] : [],
            );
          const items = [...baseItems, ...addedItems];
          return order
            ? order.flatMap((field) => items.find((item) => item.editorField === field) ?? [])
            : items;
        })(),
      })),
    [mediaOverrides, mediaOrder, locale],
  );
  const allImages = useMemo(
    () =>
      uniqueImages(
        [...renderedChapters.flatMap((chapter) => chapter.images), ...media.gallery].map((image) => ({
          ...image,
          alt: tr(locale, image.alt),
          caption: image.caption ? tr(locale, image.caption) : image.caption,
        })),
      ),
    [renderedChapters, locale],
  );
  const [activeImages, setActiveImages] = useState<GalleryImage[]>(allImages);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const change = useCallback((index: number) => setActiveIndex(index), []);
  const openGallery = (images: readonly GalleryImage[], index = 0) => {
    setActiveImages(uniqueImages(images));
    setActiveIndex(index);
  };

  return (
    <section className="chai-report" aria-labelledby="chai-report-title">
      <Container className="chai-report__intro">
        <p className="eyebrow">{tr(locale, "Le Chai des Tortues · Reportage")}</p>
        <h2 id="chai-report-title" data-editor-text-field="report.title">
          {textOverrides["report.title"] ??
            tr(locale, "Une maison qui se découvre comme on feuillette un carnet.")}
        </h2>
        <p data-editor-text-field="report.introduction">
          {textOverrides["report.introduction"] ?? (
            tr(locale, "De la première lumière sur les pierres aux longues soirées autour de la table, entrez dans le rythme d’une maison de famille au cœur de Rivedoux-Plage.")
          )}
        </p>
      </Container>

      <div className="chai-report__chapters">
        {renderedChapters.map((chapter, chapterIndex) => (
          <article className="chai-report__chapter" key={chapter.number}>
            <Container className="chai-report__copy">
              <span className="chai-report__number" aria-hidden="true">
                {chapter.number}
              </span>
              <div>
                <p className="eyebrow" data-editor-text-field={`chapter.${chapterIndex}.eyebrow`}>
                  {textOverrides[`chapter.${chapterIndex}.eyebrow`] ?? chapter.eyebrow}
                </p>
                <h3 data-editor-text-field={`chapter.${chapterIndex}.title`}>
                  {textOverrides[`chapter.${chapterIndex}.title`] ?? chapter.title}
                </h3>
                <p data-editor-text-field={`chapter.${chapterIndex}.text`}>
                  {textOverrides[`chapter.${chapterIndex}.text`] ?? chapter.text}
                </p>
              </div>
            </Container>

            <Container className={`chai-report__mosaic ${chapterIndex % 2 ? "is-reversed" : ""}`}>
              {chapter.images.map((image, imageIndex) => (
                <button
                  className={`chai-report__image chai-report__image--${imageIndex + 1}`}
                  type="button"
                  key={image.src}
                  onClick={() => openGallery(chapter.images, imageIndex)}
                  data-editor-media-field={image.editorField}
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
                    unoptimized={image.src.startsWith("http")}
                  />
                  <span className="chai-report__image-shade" />
                  <span className="chai-report__caption">{image.caption}</span>
                  <span className="visual-edit-media">{tr(locale, "Modifier la photo")}</span>
                  <span className="visual-reorder">
                    <span data-editor-reorder="previous" aria-label={tr(locale, "Déplacer à gauche")}>
                      ←
                    </span>
                    <span data-editor-reorder="next" aria-label={tr(locale, "Déplacer à droite")}>
                      →
                    </span>
                  </span>
                  <span className="visual-remove" data-editor-remove-media={image.editorField}>
                    {tr(locale, "Retirer")}
                  </span>
                </button>
              ))}
              <button
                type="button"
                className="visual-add-media"
                data-editor-add-media={`editorial.${chapterIndex}`}
              >
                {tr(locale, "+ Ajouter une photo")}
              </button>
            </Container>

            <Container className="chai-report__action">
              <button type="button" onClick={() => openGallery(chapter.images)}>
                {chapter.galleryLabel} <span aria-hidden="true">→</span>
              </button>
            </Container>
          </article>
        ))}
      </div>

      <Container className="chai-report__all">
        <p className="eyebrow">{tr(locale, "La maison en images")}</p>
        <h3>{tr(locale, "Continuer la visite, en plein écran.")}</h3>
        <button type="button" onClick={() => openGallery(allImages)}>
          {tr(locale, "Explorer toute la maison (")}{allImages.length} {tr(locale, "photos)")} <span aria-hidden="true">→</span>
        </button>
      </Container>

      <ImageLightbox
        images={activeImages}
        activeIndex={activeIndex}
        onClose={close}
        onChange={change}
      />
    </section>
  );
}
