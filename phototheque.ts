import { destinationMedia } from "@/media/destinations";
import { propertyMedia, type PropertySlug } from "@/media/properties";
import type { MediaAsset } from "@/media/types";

export const photoCategories = [
  "Tous",
  "Extérieurs",
  "Chambres",
  "Cuisine",
  "Salle de bain",
  "Détails",
  "Lifestyle",
  "Destination",
] as const;
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

/**
 * La photothèque publique est une sélection éditoriale, pas un miroir de la
 * médiathèque technique. Cet ordre privilégie les prises de vue professionnelles
 * et les scènes habitées, tout en évitant les variantes Airbnb, les espaces
 * purement utilitaires et les cadrages redondants.
 */
const curatedPhotoOrder = [
  // Le Chai des Tortues — volumes, matières et instants de vie
  "/images/properties/chai-des-tortues/editorial/espace-de-vie-retour-marche.png",
  "/images/properties/chai-des-tortues/professional/espace-de-vie-panoramique.jpg",
  "/images/properties/chai-des-tortues/editorial/retour-marche-en-couple.png",
  "/images/properties/chai-des-tortues/editorial/matin-en-famille-chat.png",
  "/images/properties/chai-des-tortues/editorial/salon-aperitif.png",
  "/images/properties/chai-des-tortues/professional/cuisine-bois.jpg",
  "/images/properties/chai-des-tortues/editorial/ilot-retour-marche.png",
  "/images/properties/chai-des-tortues/editorial/table-de-fete.png",
  "/images/properties/chai-des-tortues/professional/chambre-pierre-bois-habillee.png",
  "/images/properties/chai-des-tortues/professional/chambre-bois-clair-habillee.png",
  "/images/properties/chai-des-tortues/editorial/chambre-attention.png",
  "/images/properties/chai-des-tortues/professional/douche-pierre-verte.jpg",
  "/images/properties/chai-des-tortues/professional/cour-interieure-pierre.jpg",
  "/images/properties/chai-des-tortues/editorial/cafe-matinal-exterieur.png",
  "/images/properties/chai-des-tortues/editorial/velo-devant-porte.png",
  "/images/properties/chai-des-tortues/editorial/diner-romantique-aux-chandelles.png",
  "/images/properties/chai-des-tortues/editorial/noel-multigenerationnel.png",
  "/images/properties/chai-des-tortues/editorial/grande-table-en-famille.png",
  "/images/properties/chai-des-tortues/details/charpente-bois.jpeg",
  "/images/properties/chai-des-tortues/details/pierre-et-vegetation.jpeg",

  // Villa Raie Manta — lumière, océan et maison de famille
  "/images/properties/villa-raie-manta/editorial/salon-aperitif.png",
  "/images/properties/villa-raie-manta/editorial/enfants-bebe-et-chien.png",
  "/images/properties/villa-raie-manta/editorial/retour-plage-en-couple-fenetre-etage.png",
  "/images/properties/villa-raie-manta/editorial/ilot-aperitif.png",
  "/images/properties/villa-raie-manta/cuisine.jpeg",
  "/images/properties/villa-raie-manta/editorial/table-fruits-de-mer.png",
  "/images/properties/villa-raie-manta/editorial/table-jeux-famille.png",
  "/images/properties/villa-raie-manta/chambre-rez-de-chaussee-sans-texte.png",
  "/images/properties/villa-raie-manta/chambre-modulable-sans-texte.png",
  "/images/properties/villa-raie-manta/chambre-vue-mer-sans-texte.png",
  "/images/properties/villa-raie-manta/chambre-enfants-sans-texte.png",
  "/images/properties/villa-raie-manta/editorial/chambre-attention.png",
  "/images/properties/villa-raie-manta/salle-eau.jpeg",
  "/images/properties/villa-raie-manta/editorial/transat-balinais.png",
  "/images/properties/villa-raie-manta/editorial/diner-romantique-ocean.png",
  "/images/properties/villa-raie-manta/editorial/anniversaire-multigenerationnel.png",
  "/images/properties/villa-raie-manta/editorial/grande-table-en-famille.png",
  "/images/properties/villa-raie-manta/editorial/grande-table-famille-asiatique.png",
  "/images/properties/villa-raie-manta/editorial/aperitif-famille-en-terrasse.png",
  "/images/properties/villa-raie-manta/vue-ocean.jpeg",
  "/images/properties/villa-raie-manta/airbnb-exterieur-1-1.jpeg",

  // Le Nid d’Été — douceur familiale et plage au bout du chemin
  "/images/properties/nid-d-ete/editorial/salon-aperitif.png",
  "/images/properties/nid-d-ete/salon-retouche-premium.png",
  "/images/properties/nid-d-ete/editorial/retour-plage-en-famille.png",
  "/images/properties/nid-d-ete/editorial/lecture-bebe-et-chat.png",
  "/images/properties/nid-d-ete/editorial/petit-dejeuner-cuisine.png",
  "/images/properties/nid-d-ete/editorial/table-jeux-famille.png",
  "/images/properties/nid-d-ete/editorial/chambre-attention.png",
  "/images/properties/nid-d-ete/editorial/chambre-anniversaire-enfant.png",
  "/images/properties/nid-d-ete/editorial/terrasse-dejeuner.png",
  "/images/properties/nid-d-ete/editorial/diner-romantique.png",
  "/images/properties/nid-d-ete/editorial/paques-multigenerationnel.png",
  "/images/properties/nid-d-ete/editorial/table-en-famille.png",
  "/images/properties/nid-d-ete/editorial/aperitif-famille-en-terrasse.png",
  "/images/properties/nid-d-ete/acces-plage.jpeg",
  "/images/properties/nid-d-ete/peupliers.jpeg",

  // Ré, Oléron et La Rochelle — les paysages qui prolongent le séjour
  "/images/destination/pont-ile-de-re-rose.jpg",
  "/images/destination/guide-port-saint-martin.jpg",
  "/images/destination/guide-phare-chassiron.jpg",
  "/images/destination/fort-boyard-depuis-plage.jpg",
  "/images/destination/marais-coucher-soleil.jpeg",
  "/images/destination/dunes-fleuries-barques.jpg",
  "/images/destination/ruelle.jpeg",
  "/images/destination/huitres-vin-blanc.jpg",
  "/images/destination/petit-dejeuner-ocean.jpg",
  "/images/destination/pique-nique-plage.jpg",
  "/images/destination/famille-coucher-soleil.jpg",
  "/images/destination/famille-estran.jpg",
  "/images/destination/surf-matin.jpg",
  "/images/destination/guide-vieux-port-la-rochelle.jpg",
  "/images/destination/editorial/phare-chassiron-a-velo.png",
  "/images/destination/editorial/marais-salants-lumiere-du-soir.png",
  "/images/destination/editorial/fort-boyard-pique-nique.png",
  "/images/destination/editorial/famille-cerf-volant-chien.png",
  "/images/destination/editorial/famille-monoparentale-chateau-sable.png",
  "/images/destination/editorial/petanque-en-famille.png",
  "/images/destination/editorial/pique-nique-deux-mamans.png",
  "/images/destination/editorial/gouter-en-famille-sur-la-plage.png",
  "/images/destination/editorial/enfants-jouent-avec-chien.png",
] as const;

function inferredCategory(asset: MediaAsset): PhotoCategory {
  if (asset.scope === "destination") return "Destination";
  const path = asset.src.toLowerCase();
  if (/(chambre|bedroom|lit-|suite)/.test(path)) return "Chambres";
  if (/(salle-de-bain|salle-deau|salle-eau|bathroom|toilette)/.test(path)) return "Salle de bain";
  if (/(cuisine|kitchen|ilot|table-)/.test(path)) return "Cuisine";
  if (/(exterior|exterieur|terrasse|cour|facade|arrivee|velo-devant)/.test(path))
    return "Extérieurs";
  if (
    /(detail|attention|aperitif|famille|romance|romantique|anniversaire|lune-de-miel|bebe|chien|chat|noel|paques)/.test(
      path,
    )
  )
    return "Lifestyle";
  return "Détails";
}

export function buildPhotoLibrary(): LibraryPhoto[] {
  const photos = new Map<string, LibraryPhoto>();
  const add = (
    asset: MediaAsset,
    category: PhotoCategory,
    collection: LibraryPhoto["collection"],
  ) => {
    if (photos.has(asset.src)) return;
    photos.set(asset.src, {
      ...asset,
      category: asset.scope === "destination" ? "Destination" : category,
      collection,
    });
  };

  for (const [slug, manifest] of Object.entries(propertyMedia) as [
    PropertySlug,
    (typeof propertyMedia)[PropertySlug],
  ][]) {
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

  return curatedPhotoOrder.flatMap((src) => {
    const photo = photos.get(src);
    return photo ? [photo] : [];
  });
}

export const photoLibrary = buildPhotoLibrary();
