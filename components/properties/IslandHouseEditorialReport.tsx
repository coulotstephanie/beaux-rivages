"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { GalleryImage } from "@/data";
import { destinationMedia } from "@/media/destinations";
import { nidDEteAuthenticMedia, nidDEteMedia } from "@/media/properties/nid-d-ete";
import { villaRaieMantaMedia } from "@/media/properties/villa-raie-manta";
import type { MediaAsset } from "@/media/types";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Container } from "@/components/ui";

type SupportedHouse = "villa-raie-manta" | "nid-d-ete";

type Chapter = {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
  quote?: string;
  galleryLabel: string;
  images: readonly MediaAsset[];
};

const villaChapters: readonly Chapter[] = [
  {
    number: "01",
    eyebrow: "L’arrivée",
    title: "L’océan donne immédiatement le ton.",
    text: "À Rivedoux-Plage, l’arrivée par le pont ouvre déjà le séjour sur l’horizon. Puis la Villa se découvre à quelques pas du rivage, tournée vers la lumière.",
    galleryLabel: "Explorer la galerie de l’arrivée",
    images: [
      villaRaieMantaMedia.arrival[0],
      destinationMedia.reBridgeAerial,
      destinationMedia.reMap,
    ],
  },
  {
    number: "02",
    eyebrow: "La maison se réveille",
    title: "La maison retrouve son rythme.",
    text: "Dans le salon, les enfants jouent, les retrouvailles se prolongent et chacun prend le temps de s’installer. La Villa devient immédiatement une maison à vivre.",
    quote: "Un espace pensé pour être ensemble.",
    galleryLabel: "Explorer la galerie de la vie au salon",
    images: [
      villaRaieMantaMedia.livingRoom[1],
      villaRaieMantaMedia.livingRoom[2],
      villaRaieMantaMedia.livingRoom[0],
    ],
  },
  {
    number: "03",
    eyebrow: "La cuisine",
    title: "Le retour des Halles rassemble la maison.",
    text: "La cuisine ouverte et la grande table accompagnent les produits rapportés du marché, les repas improvisés et les occasions que l’on choisit de célébrer.",
    galleryLabel: "Explorer la galerie de la cuisine",
    images: [
      villaRaieMantaMedia.kitchen[0],
      destinationMedia.reMarketTomatoes,
      destinationMedia.reMarketCheese,
    ],
  },
  {
    number: "04",
    eyebrow: "L’après-midi",
    title: "Un plateau de fruits de mer en famille.",
    text: "La terrasse prolonge les espaces de vie autour des saveurs de l’océan et d’un repas partagé face au large.",
    quote: "Les vacances se racontent aussi autour de la table.",
    galleryLabel: "Explorer la galerie des terrasses et des repas",
    images: [
      villaRaieMantaMedia.terrace[0],
      villaRaieMantaMedia.terrace[1],
      villaRaieMantaMedia.terrace[2],
    ],
  },
  {
    number: "05",
    eyebrow: "Les chambres",
    title: "Chacun retrouve son propre rythme.",
    text: "Suite, chambre modulable, chambre face à la mer et refuge des enfants composent une maison pensée pour se retrouver sans renoncer au calme.",
    galleryLabel: "Explorer la galerie des chambres",
    images: [
      villaRaieMantaMedia.bedrooms[0],
      villaRaieMantaMedia.bedrooms[9],
      villaRaieMantaMedia.bedrooms[2],
    ],
  },
  {
    number: "06",
    eyebrow: "Les salles d’eau",
    title: "Un confort simple à chaque niveau.",
    text: "Les salles d’eau et les toilettes indépendantes facilitent les séjours à plusieurs tout en conservant des lignes sobres et chaleureuses.",
    galleryLabel: "Explorer la galerie des salles d’eau",
    images: villaRaieMantaMedia.bathrooms.slice(0, 3),
  },
  {
    number: "07",
    eyebrow: "Les attentions",
    title: "Les occasions trouvent naturellement leur décor.",
    text: "Une chambre préparée, une partie en famille ou une table de fête : les détails transforment la Villa au fil des séjours.",
    galleryLabel: "Explorer la galerie des attentions",
    images: villaRaieMantaMedia.details.slice(0, 3),
  },
  {
    number: "08",
    eyebrow: "Le coucher du soleil",
    title: "Le pont devient une ligne de lumière.",
    text: "Depuis le salon panoramique, le ciel et la mer changent de couleur tandis que l’île retrouve son calme.",
    quote: "Le spectacle est déjà là.",
    galleryLabel: "Explorer la galerie de l’horizon",
    images: [
      villaRaieMantaMedia.exterior[0],
      villaRaieMantaMedia.exterior[1],
      destinationMedia.reBridgeSunsetBike,
    ],
  },
  {
    number: "09",
    eyebrow: "La soirée",
    title: "Une table pour célébrer.",
    text: "La cuisine et la salle à manger réunissent toutes les générations autour d’un anniversaire préparé face à l’océan.",
    quote: "Les grandes occasions deviennent des souvenirs de maison.",
    galleryLabel: "Explorer la galerie des soirées",
    images: villaRaieMantaMedia.lifestyle.slice(2, 5),
  },
];

const nidChapters: readonly Chapter[] = [
  {
    number: "01",
    eyebrow: "L’arrivée",
    title: "La Maison Heureuse apparaît sous les arbres.",
    text: "Le Nid d’Été se rejoint au cœur d’une résidence historique, dans le calme des allées arborées qui conduisent vers l’océan.",
    galleryLabel: "Explorer la galerie de l’arrivée",
    images: [
      nidDEteAuthenticMedia.residenceGate,
      nidDEteMedia.exterior[2],
      nidDEteAuthenticMedia.gardenLoungers,
    ],
  },
  {
    number: "02",
    eyebrow: "La Maison Heureuse",
    title: "Un refuge dans une résidence historique.",
    text: "Liée au chantier de Fort Boyard puis devenue colonie de vacances, la Maison Heureuse conserve une architecture et une histoire profondément tournées vers l’océan.",
    galleryLabel: "Explorer la galerie de la Maison Heureuse",
    images: [
      nidDEteAuthenticMedia.residenceAerial,
      nidDEteAuthenticMedia.residenceFacade,
      nidDEteAuthenticMedia.residenceForestAerial,
    ],
  },
  {
    number: "03",
    eyebrow: "La maison se réveille",
    title: "La maison s’éveille doucement.",
    text: "Dans le salon, le matin commence dans une lumière douce. On se retrouve avant les premiers pas vers la plage.",
    quote: "Le calme d’un intérieur pensé pour se retrouver.",
    galleryLabel: "Explorer la galerie des pièces de vie",
    images: nidDEteMedia.livingRoom.slice(0, 3),
  },
  {
    number: "04",
    eyebrow: "La cuisine",
    title: "La grande table suit le rythme des vacances.",
    text: "Petit-déjeuner, jeux de société, raclette ou dîner en famille : la cuisine et la table deviennent le point de rencontre après les journées dehors.",
    galleryLabel: "Explorer la galerie de la cuisine et des repas",
    images: [nidDEteMedia.kitchen[0], nidDEteMedia.kitchen[1], nidDEteAuthenticMedia.raclette],
  },
  {
    number: "05",
    eyebrow: "Les chambres",
    title: "Le confort retrouve une douceur familière.",
    text: "Les chambres accueillent aussi bien les nuits calmes que les attentions préparées pour célébrer un anniversaire ou simplement souhaiter la bienvenue.",
    galleryLabel: "Explorer la galerie des chambres",
    images: [
      nidDEteMedia.bedrooms[0],
      nidDEteMedia.bedrooms[1],
      nidDEteAuthenticMedia.preparedBedroom,
    ],
  },
  {
    number: "06",
    eyebrow: "La salle d’eau",
    title: "Tout le nécessaire, dans un espace contemporain.",
    text: "Douche, vasque, rangements et toilettes composent un espace pratique pour les retours de plage et les séjours en famille.",
    galleryLabel: "Explorer la galerie de la salle d’eau",
    images: nidDEteMedia.bathrooms.slice(0, 3),
  },
  {
    number: "07",
    eyebrow: "La terrasse",
    title: "La vie se prolonge sous la voile.",
    text: "À l’ombre, les déjeuners, les apéritifs et les retours de plage se partagent dans un jardin clos, au calme de la résidence.",
    galleryLabel: "Explorer la galerie de la terrasse",
    images: [nidDEteMedia.terrace[1], nidDEteMedia.terrace[3], nidDEteMedia.terrace[4]],
  },
  {
    number: "08",
    eyebrow: "Le matin",
    title: "Le portail s’ouvre sur le sable.",
    text: "Quelques mètres suffisent pour quitter la maison et rejoindre la plage des Saumonards, sans route et sans voiture.",
    quote: "La plage devient le prolongement naturel de la maison.",
    galleryLabel: "Explorer la galerie du chemin vers la plage",
    images: nidDEteMedia.lifestyle.slice(6, 9),
  },
  {
    number: "09",
    eyebrow: "L’après-midi",
    title: "La journée appartient à l’océan.",
    text: "Promenade sur le sable et baignade composent un rythme simple, pensé pour les familles.",
    quote: "Rien à organiser, seulement profiter.",
    galleryLabel: "Explorer la galerie des Saumonards",
    images: [nidDEteMedia.lifestyle[10], nidDEteMedia.lifestyle[12], nidDEteMedia.lifestyle[13]],
  },
  {
    number: "10",
    eyebrow: "Le coucher du soleil",
    title: "Fort Boyard reste à l’horizon.",
    text: "La lumière descend sur la plage et dessine au loin la silhouette familière du fort.",
    quote: "Chaque soir offre une autre couleur.",
    galleryLabel: "Explorer la galerie de l’horizon",
    images: [
      nidDEteMedia.lifestyle[11],
      nidDEteAuthenticMedia.fortFromBeach,
      destinationMedia.fortBoyard,
    ],
  },
];

const reports = {
  "villa-raie-manta": {
    eyebrow: "Villa Raie Manta · Reportage",
    title: "Une maison face à l’océan, racontée au fil de la lumière.",
    introduction:
      "Du premier café devant le pont aux longues soirées autour de la table, entrez dans le rythme d’une villa où l’horizon accompagne chaque moment.",
    chapters: villaChapters,
    gallery: villaRaieMantaMedia.gallery,
  },
  "nid-d-ete": {
    eyebrow: "Le Nid d’Été · Reportage",
    title: "Une maison historique qui se découvre entre forêt et océan.",
    introduction:
      "De la Maison Heureuse au portail privé des Saumonards, suivez une journée simple et précieuse, sous les grands arbres et face à Fort Boyard.",
    chapters: nidChapters,
    gallery: nidDEteMedia.gallery,
  },
} satisfies Record<
  SupportedHouse,
  {
    eyebrow: string;
    title: string;
    introduction: string;
    chapters: readonly Chapter[];
    gallery: readonly MediaAsset[];
  }
>;

function uniqueImages(images: readonly GalleryImage[]) {
  return Array.from(new Map(images.map((image) => [image.src, image])).values());
}

export function IslandHouseEditorialReport({ house }: { house: SupportedHouse }) {
  const report = reports[house];
  const allImages = useMemo(
    () =>
      uniqueImages([...report.chapters.flatMap((chapter) => chapter.images), ...report.gallery]),
    [report],
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
    <section className="chai-report island-house-report" aria-labelledby={`${house}-report-title`}>
      <Container className="chai-report__intro">
        <p className="eyebrow">{report.eyebrow}</p>
        <h2 id={`${house}-report-title`}>{report.title}</h2>
        <p>{report.introduction}</p>
      </Container>

      <div className="chai-report__chapters">
        {report.chapters.map((chapter, chapterIndex) => (
          <article className="chai-report__chapter" key={chapter.number}>
            <Container className="chai-report__copy">
              <span className="chai-report__number" aria-hidden="true">
                {chapter.number}
              </span>
              <div>
                <p className="eyebrow">{chapter.eyebrow}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
                {chapter.quote ? <blockquote>« {chapter.quote} »</blockquote> : null}
              </div>
            </Container>

            <Container className={`chai-report__mosaic ${chapterIndex % 2 ? "is-reversed" : ""}`}>
              {chapter.images.map((image, imageIndex) => (
                <button
                  className={`chai-report__image chai-report__image--${imageIndex + 1}`}
                  type="button"
                  key={image.src}
                  onClick={() => openGallery(chapter.images, imageIndex)}
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
              <button type="button" onClick={() => openGallery(chapter.images)}>
                {chapter.galleryLabel} <span aria-hidden="true">→</span>
              </button>
            </Container>
          </article>
        ))}
      </div>

      <Container className="chai-report__all">
        <p className="eyebrow">La maison en images</p>
        <h3>Continuer la visite, en plein écran.</h3>
        <button type="button" onClick={() => openGallery(allImages)}>
          Explorer toute la maison ({allImages.length} photos) <span aria-hidden="true">→</span>
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
