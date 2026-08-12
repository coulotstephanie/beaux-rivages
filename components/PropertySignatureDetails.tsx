import Image from "next/image";
import { BLUR_DATA_URL } from "@/media";
import { propertyMedia, type PropertySlug } from "@/media/properties";
import type { MediaAsset } from "@/media/types";
import { Container } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

const copy: Record<
  PropertySlug,
  { introduction: string; cards: { title: string; text: string }[] }
> = {
  "chai-des-tortues": {
    introduction:
      "Dans l’ancien chai, chaque équipement a été choisi pour faire vivre la maison : cuisiner ensemble, accueillir les enfants et prolonger les repas autour de la grande table.",
    cards: [
      {
        title: "Une cuisine qui rassemble",
        text: "Ninja, batterie de cuisine et ustensiles pour les huîtres permettent de transformer les produits du marché en un déjeuner de famille.",
      },
      {
        title: "Les plus jeunes ont leur place",
        text: "Équipements bébé, jeux et livres permettent aux parents de voyager plus légèrement et à chacun de trouver son rythme.",
      },
      {
        title: "Le confort sans ostentation",
        text: "Ventilation, linge sélectionné selon la formule et équipements utiles accompagnent le séjour sans effacer le caractère des pierres et du bois.",
      },
      {
        title: "L’accueil Beaux Rivages",
        text: "Une carafe d’eau fraîche attend au réfrigérateur et les attentions choisies lors de la réservation préparent les premiers instants dans la maison.",
      },
    ],
  },
  "villa-raie-manta": {
    introduction:
      "À la Villa Raie Manta, les détails prolongent la lumière et la sensation d’espace : une maison facile à partager, du premier café face à la mer jusqu’au dîner.",
    cards: [
      {
        title: "Cuisiner face aux vacances",
        text: "La cuisine équipée, le Ninja et les ustensiles à huîtres donnent envie de rapporter les produits des Halles et de préparer le repas ensemble.",
      },
      {
        title: "Une maison pour les familles",
        text: "Équipements bébé, jeux, livres et espaces généreux simplifient les séjours à plusieurs sans encombrer la maison.",
      },
      {
        title: "La fraîcheur préservée",
        text: "Ventilateurs et protections thermiques participent au confort lorsque le soleil accompagne longuement les journées rétaises.",
      },
      {
        title: "Une arrivée déjà préparée",
        text: "Eau fraîche, cadeaux de bienvenue et attentions personnalisées permettent de commencer le séjour sans attendre.",
      },
    ],
  },
  "nid-d-ete": {
    introduction:
      "Au Nid d’Été, les attentions sont pensées pour une vie dehors : rejoindre la plage, revenir sous les grands arbres et retrouver une maison calme et pratique.",
    cards: [
      {
        title: "Les vacances en famille",
        text: "Équipements bébé, jeux, livres et accessoires utiles facilitent les journées entre la plage, la forêt et la maison.",
      },
      {
        title: "Une cuisine prête à vivre",
        text: "Ninja, ustensiles et vaisselle permettent de préparer simplement les produits rapportés de Boyardville.",
      },
      {
        title: "Le calme même en été",
        text: "Ventilateurs de plafond, ventilateurs mobiles et rideaux thermiques aident à préserver le confort de la maison lors des journées chaudes.",
      },
      {
        title: "Le premier geste d’accueil",
        text: "Une carafe d’eau fraîche est préparée au réfrigérateur, complétée par les attentions Beaux Rivages choisies pour le séjour.",
      },
    ],
  },
};

export function PropertySignatureDetails({ propertySlug, locale = "fr" }: { propertySlug: PropertySlug; locale?: SupportedLocale }) {
  const content = copy[propertySlug];
  const media = propertyMedia[propertySlug];
  const livedInMedia = media.lifestyle;
  const imagesByProperty: Record<PropertySlug, readonly MediaAsset[]> = {
    "chai-des-tortues": [
      media.kitchen[4] ?? livedInMedia[0],
      media.bedrooms[4],
      media.bathrooms[2],
      media.exterior[1],
    ],
    "villa-raie-manta": [
      media.kitchen[1] ?? livedInMedia[0],
      media.bedrooms[5],
      media.bathrooms[3],
      media.kitchen[3],
    ],
    "nid-d-ete": [
      media.kitchen[4] ?? livedInMedia[0],
      media.kitchen[5],
      media.bathrooms[3],
      media.arrival[1],
    ],
  };
  const images = imagesByProperty[propertySlug];

  return (
    <section
      className="property-signature-details"
      aria-labelledby={`${propertySlug}-signature-details-title`}
    >
      <Container size="wide">
        <div className="property-signature-details__heading">
          <p className="eyebrow">{tr(locale, "Les petits détails qui font la différence")}</p>
          <h2 id={`${propertySlug}-signature-details-title`}>
            {tr(locale, "Une maison préparée pour être vécue.")}
          </h2>
          <p>{tr(locale, content.introduction)}</p>
        </div>
        <div className="property-signature-details__grid">
          {content.cards.map((card, index) => {
            const image = images[index];
            return (
              <article key={card.title}>
                {image && (
                  <div>
                    <Image
                      src={image.src}
                      alt={tr(locale, image.alt)}
                      fill
                      quality={85}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 760px) calc(100vw - 40px), 25vw"
                    />
                  </div>
                )}
                <span>0{index + 1}</span>
                <h3>{tr(locale, card.title)}</h3>
                <p>{tr(locale, card.text)}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
