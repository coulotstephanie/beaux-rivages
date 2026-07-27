import { destinationMedia } from "@/media/destinations";
import { propertyMedia, type PropertySlug } from "@/media/properties";
import type { MediaAsset } from "@/media/types";

export const photoCategories = ["Tous", "Extérieurs", "Chambres", "Cuisine", "Salle de bain", "Détails", "Lifestyle", "Destination"] as const;
export type PhotoCategory = Exclude<(typeof photoCategories)[number], "Tous">;

export type LibraryPhoto = MediaAsset & {
  category: PhotoCategory;
  collection: "Beaux Rivages" | "Le Chai des Tortues" | "Villa Raie Manta" | "Le Nid d’Été";
};

const propertyLabels: Record<PropertySlug, LibraryPhoto["collection"]> = {
  "chai-des-tortues": "Le Chai des Tortues",
  "villa-raie-manta": "Villa Raie Manta",
  "nid-d-ete": "Le Nid d’Été",
};

function inferredCategory(asset: MediaAsset): PhotoCategory {
  if (asset.scope === "destination") return "Destination";
  const path = asset.src.toLowerCase();
  if (/(chambre|bedroom|lit-|suite)/.test(path)) return "Chambres";
  if (/(salle-de-bain|salle-deau|salle-eau|bathroom|toilette)/.test(path)) return "Salle de bain";
  if (/(cuisine|kitchen|ilot|table-)/.test(path)) return "Cuisine";
  if (/(exterior|exterieur|terrasse|cour|facade|arrivee|velo-devant)/.test(path)) return "Extérieurs";
  if (/(detail|attention|aperitif|famille|romance|anniversaire|lune-de-miel)/.test(path)) return "Lifestyle";
  return "Détails";
}

export function buildPhotoLibrary(): LibraryPhoto[] {
  const photos = new Map<string, LibraryPhoto>();
  const add = (asset: MediaAsset, category: PhotoCategory, collection: LibraryPhoto["collection"]) => {
    if (photos.has(asset.src)) return;
    photos.set(asset.src, {
      ...asset,
      category: asset.scope === "destination" ? "Destination" : category,
      collection,
    });
  };

  for (const [slug, manifest] of Object.entries(propertyMedia) as [PropertySlug, (typeof propertyMedia)[PropertySlug]][]) {
    const collection = propertyLabels[slug];
    manifest.arrival.forEach((asset) => add(asset, "Extérieurs", collection));
    manifest.exterior.forEach((asset) => add(asset, "Extérieurs", collection));
    manifest.terrace.forEach((asset) => add(asset, "Extérieurs", collection));
    manifest.bedrooms.forEach((asset) => add(asset, "Chambres", collection));
    manifest.kitchen.forEach((asset) => add(asset, "Cuisine", collection));
    manifest.bathrooms.forEach((asset) => add(asset, "Salle de bain", collection));
    manifest.details.forEach((asset) => add(asset, "Détails", collection));
    manifest.livingRoom.forEach((asset) => add(asset, "Lifestyle", collection));
    manifest.lifestyle.forEach((asset) => add(asset, "Lifestyle", collection));
    manifest.gallery.forEach((asset) => add(asset, inferredCategory(asset), collection));
  }

  Object.values(destinationMedia).forEach((asset) => add(asset, "Destination", "Beaux Rivages"));
  return [...photos.values()];
}

export const photoLibrary = buildPhotoLibrary();
