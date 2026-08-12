import Image from "next/image";
import { destinationMedia } from "@/media/destinations";
import type { MediaAsset } from "@/media/types";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

const mosaic: readonly MediaAsset[] = [
  {
    src: "/images/destination/patrimoine/saumonards-plage.jpg",
    alt: "La plage des Saumonards au bord de la forêt",
    caption: "Le sable au bout des pins",
    scope: "destination",
  },
  {
    src: "/images/destination/patrimoine/fort-boyard-coucher-soleil.jpg",
    alt: "Fort Boyard en silhouette dans la lumière du soir",
    caption: "Le fort dans la lumière du soir",
    scope: "destination",
  },
  destinationMedia.familyForeshore,
  destinationMedia.flowerDunes,
  destinationMedia.familySunset,
  destinationMedia.sea,
];

export function NidSaumonardsStory({ locale = "fr" }: { locale?: SupportedLocale }) {
  return (
    <section className="nid-saumonards-story" aria-labelledby="nid-saumonards-title">
      <div className="nid-saumonards-story__copy shell">
        <p className="eyebrow">{tr(locale, "À quelques pas du Nid d’Été")}</p>
        <h2 id="nid-saumonards-title">{tr(locale, "La plage des Saumonards")}</h2>
        <p>
          {tr(locale, "À quelques pas seulement de la Maison Heureuse, un portail privé s’ouvre sur la plage des Saumonards. Ici, les journées s’écoulent au rythme des marées, entre les pins maritimes, le sable fin et la silhouette de Fort Boyard à l’horizon.")}
        </p>
        <p>
          {tr(locale, "C’est le lieu des vacances simples et précieuses : les enfants courent pieds nus, les chiens jouent librement sur la plage, les cerfs-volants colorent le ciel et les familles partagent ces instants dont on se souvient longtemps.")}
        </p>
        <strong>{tr(locale, "C’est cette sensation de liberté qui fait la magie des Saumonards.")}</strong>
      </div>

      <figure className="nid-saumonards-story__hero">
        <Image
          src={destinationMedia.kiteFamily.src}
          alt={tr(locale, destinationMedia.kiteFamily.alt)}
          fill
          quality={90}
          loading="lazy"
          sizes="100vw"
        />
      </figure>

      <div className="nid-saumonards-story__mosaic shell" aria-label={tr(locale, "Une journée aux Saumonards")}>
        {mosaic.map((asset, index) => (
          <figure key={asset.src}>
            <Image
              src={asset.src}
              alt={tr(locale, asset.alt)}
              fill
              quality={85}
              loading="lazy"
              sizes="(max-width: 720px) 100vw, 33vw"
            />
            <figcaption>
              <span>0{index + 1}</span>
              {asset.caption ? tr(locale, asset.caption) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
