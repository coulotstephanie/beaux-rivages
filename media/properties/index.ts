import { chaiDesTortuesMedia } from "./chai-des-tortues";
import { nidDEteMedia } from "./nid-d-ete";
import { villaRaieMantaMedia } from "./villa-raie-manta";
import type { MediaAsset } from "../types";

export const propertyMedia = {
  "chai-des-tortues": chaiDesTortuesMedia,
  "villa-raie-manta": villaRaieMantaMedia,
  "nid-d-ete": nidDEteMedia,
} as const;

export type PropertySlug = keyof typeof propertyMedia;

for (const [slug, manifest] of Object.entries(propertyMedia)) {
  const gallery: readonly MediaAsset[] = manifest.gallery;
  const allAssets: readonly MediaAsset[] = [
    manifest.hero,
    ...manifest.arrival,
    ...manifest.exterior,
    ...manifest.livingRoom,
    ...manifest.kitchen,
    ...manifest.bedrooms,
    ...manifest.bathrooms,
    ...manifest.terrace,
    ...manifest.details,
    ...manifest.lifestyle,
    ...manifest.videos,
    ...manifest.gallery,
    ...Object.values("editorial" in manifest && manifest.editorial ? manifest.editorial : {}),
  ];

  if (gallery.length < 6) {
    throw new Error(`Incomplete gallery for property: ${slug}`);
  }

  const gallerySources = gallery.map((asset) => asset.src);
  if (new Set(gallerySources).size !== gallerySources.length) {
    throw new Error(`Duplicate gallery media for property: ${slug}`);
  }

  const foreignPropertyMedia = allAssets.find(
    (asset) => asset.scope === "property" && asset.owner !== slug,
  );
  if (foreignPropertyMedia) {
    throw new Error(
      `Manifest ${slug} contains media owned by ${foreignPropertyMedia.owner}: ${foreignPropertyMedia.src}`,
    );
  }

  const invalidPath = allAssets.find(
    (asset) => asset.scope === "property"
      && !asset.src.startsWith(`/images/properties/${slug}/`)
      && !(asset.src.startsWith("/videos/") && asset.src.includes(slug)),
  );
  if (invalidPath) {
    throw new Error(`Manifest ${slug} references a foreign property path: ${invalidPath.src}`);
  }
}
