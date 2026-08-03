import Image from "next/image";
import { destinationMedia } from "@/media/destinations";
import { nidDEteMedia } from "@/media/properties/nid-d-ete";
import type { MediaAsset } from "@/media/types";

const mosaic: readonly MediaAsset[] = [
  nidDEteMedia.lifestyle[7],
  nidDEteMedia.lifestyle[14],
  nidDEteMedia.lifestyle[9],
  nidDEteMedia.lifestyle[10],
  nidDEteMedia.lifestyle[12],
  nidDEteMedia.lifestyle[11],
];

export function NidSaumonardsStory() {
  return (
    <section className="nid-saumonards-story" aria-labelledby="nid-saumonards-title">
      <div className="nid-saumonards-story__copy shell">
        <p className="eyebrow">À quelques pas du Nid d’Été</p>
        <h2 id="nid-saumonards-title">La plage des Saumonards</h2>
        <p>
          À quelques pas seulement de la Maison Heureuse, un portail privé s’ouvre sur la plage des
          Saumonards. Ici, les journées s’écoulent au rythme des marées, entre les pins maritimes,
          le sable fin et la silhouette de Fort Boyard à l’horizon.
        </p>
        <p>
          C’est le lieu des vacances simples et précieuses : les enfants courent pieds nus, les
          chiens jouent librement sur la plage, les cerfs-volants colorent le ciel et les familles
          partagent ces instants dont on se souvient longtemps.
        </p>
        <strong>C’est cette sensation de liberté qui fait la magie des Saumonards.</strong>
      </div>

      <figure className="nid-saumonards-story__hero">
        <Image
          src={destinationMedia.kiteFamily.src}
          alt={destinationMedia.kiteFamily.alt}
          fill
          quality={90}
          loading="lazy"
          sizes="100vw"
        />
      </figure>

      <div className="nid-saumonards-story__mosaic shell" aria-label="Une journée aux Saumonards">
        {mosaic.map((asset, index) => (
          <figure key={asset.src}>
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              quality={86}
              loading="lazy"
              sizes="(max-width: 720px) 100vw, 33vw"
            />
            <figcaption>
              <span>0{index + 1}</span>
              {asset.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
