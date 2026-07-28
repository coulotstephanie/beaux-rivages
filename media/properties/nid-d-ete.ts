import type { MediaAsset, PropertyMediaManifest } from "@/media/types";

const asset = (
  file: string,
  alt: string,
  caption?: string,
  scope: MediaAsset["scope"] = "destination",
): MediaAsset => ({
  src: `/images/properties/nid-d-ete/${file}`,
  alt,
  caption,
  scope,
  ...(scope === "property" ? { owner: "nid-d-ete" } : {}),
});

const propertyAsset = (file: string, alt: string, caption?: string) =>
  asset(file, alt, caption, "property");

const access = asset("acces-plage.jpeg", "Plage des Saumonards derrière les ganivelles", "La plage au bout du chemin");
const beachView = asset("vue-plage.jpeg", "Vue sur la plage des Saumonards", "La plage au bout du portail");
const ocean = asset("ocean.jpeg", "Océan derrière les ganivelles", "Face à l’Atlantique");
const poplars = asset("peupliers.jpeg", "Pinède et aire de promenade près de la plage", "La forêt des Saumonards");
const family = asset("famille-plage.jpeg", "Jeux d’enfants sur la plage", "Des vacances en famille");
const sunset = asset("coucher-soleil.jpeg", "Coucher de soleil sur l’océan", "Les soirées face à la mer");
const beach = asset("plage.jpeg", "Plage près du Nid d’Été", "Le sable au bout du chemin");
const shade = asset("voile-ombrage.jpeg", "Dune fleurie et embarcations sur la plage", "La côte sauvage d’Oléron");
const airbnbLivingRoom = [
  propertyAsset("airbnb-salon-1.jpeg", "Salon du Nid d’Été avec canapé convertible", "Le séjour, pensé pour se retrouver"),
  propertyAsset("airbnb-salon-2.jpeg", "Salon et espace de vie du Nid d’Été", "Une maison simple à vivre"),
];
const editorialLivingRoom = propertyAsset(
  "editorial/salon-aperitif.png",
  "Salon du Nid d’Été préparé pour un apéritif après la plage",
  "Le retour de la plage",
);
const editorialTerraceLunch = propertyAsset(
  "editorial/terrasse-dejeuner.png",
  "Déjeuner familial sous la voile d’ombrage du Nid d’Été",
  "Un déjeuner simple sous la voile",
);
const editorialBreakfast = propertyAsset(
  "editorial/petit-dejeuner-cuisine.png",
  "Petit-déjeuner préparé dans la cuisine du Nid d’Été",
  "Les matins gourmands au Nid",
);
const editorialBedroom = propertyAsset(
  "editorial/chambre-attention.png",
  "Chambre du Nid d’Été préparée avec livre, eau et linge",
  "Une attention pour votre arrivée",
);
const editorialChildrenBirthday = propertyAsset(
  "editorial/chambre-anniversaire-enfant.png",
  "Chambre du Nid d’Été décorée pour un anniversaire enfant sur le thème de l’aventure marine",
  "L’anniversaire des petits explorateurs",
);
const editorialFamilyGames = propertyAsset(
  "editorial/table-jeux-famille.png",
  "Jeu de société en famille sur la grande table du Nid d’Été",
  "Les parties qui prolongent les vacances",
);
const airbnbKitchen = [
  propertyAsset("airbnb-cuisine-entiere-2.jpeg", "Équipements de la cuisine du Nid d’Été", "Tout le nécessaire pour cuisiner"),
  propertyAsset("airbnb-espace-repas-1.jpeg", "Espace repas du Nid d’Été", "La table des vacances"),
];
const airbnbBedrooms = [
  propertyAsset("airbnb-chambre-1-2.jpeg", "Rangements de la chambre principale", "Le confort dans les détails"),
  propertyAsset("airbnb-chambre-2-1.jpeg", "Seconde chambre avec lit double", "La seconde chambre"),
];
const airbnbBathroom = [
  propertyAsset("airbnb-salle-de-bain-1.jpeg", "Salle d’eau avec douche à l’italienne", "La salle d’eau"),
];
const airbnbExterior = [
  propertyAsset("airbnb-arriere-cour-1.jpeg", "Terrasse et jardin clos du Nid d’Été", "Déjeuner dehors, sous les arbres"),
  propertyAsset("airbnb-cour-d-entree-1.jpeg", "Façade du Nid d’Été et emplacement de la boîte à clés", "Les repères de l’arrivée autonome"),
  propertyAsset("airbnb-exterieur-1-1.jpeg", "Façade historique de la Maison Heureuse", "L’élégance balnéaire de la résidence"),
  propertyAsset("airbnb-exterieur-1-2.jpeg", "Allée arborée de la Maison Heureuse", "Sous les arbres de la résidence"),
  propertyAsset("airbnb-exterieur-2-1.jpeg", "Résidence sécurisée autour du Nid d’Été", "Le calme de la résidence"),
];
const airbnbTerrace = [
  propertyAsset("airbnb-arriere-cour-2.jpeg", "Équipements de la terrasse du Nid d’Été", "Les détails de la vie dehors"),
  propertyAsset("airbnb-arriere-cour-3.jpeg", "Mobilier extérieur du Nid d’Été", "La terrasse en pratique"),
  propertyAsset("airbnb-arriere-cour-4.jpeg", "Transats disponibles au Nid d’Été", "Prendre le temps au soleil"),
  propertyAsset("airbnb-arriere-cour-5.jpeg", "Table pour six sous la voile d’ombrage", "Déjeuner à l’ombre"),
];
const airbnbDetails = [
  propertyAsset("airbnb-buanderie-1-1.jpeg", "Rangements et équipements pratiques du Nid d’Été", "Voyager léger"),
  propertyAsset("airbnb-buanderie-2-1.jpeg", "Buanderie avec lave-linge", "Le confort des longs séjours"),
  propertyAsset("airbnb-exterieur-3-1.jpeg", "Plan de la résidence La Maison Heureuse", "Se repérer dans la résidence"),
  propertyAsset("airbnb-exterieur-4-1.jpeg", "Environnement extérieur du Nid d’Été", "Entre résidence et plage"),
  propertyAsset("airbnb-piece-a-theme-1.jpeg", "Accès vers la plage des Saumonards", "Le chemin vers l’océan"),
  propertyAsset("airbnb-photos-supplementaires-1.jpeg", "Détail complémentaire du Nid d’Été", "L’esprit des vacances à Boyardville"),
];
export const nidDEteMedia = {
  slug: "nid-d-ete",
  hero: access,
  arrival: [airbnbExterior[1]],
  exterior: airbnbExterior,
  livingRoom: [editorialLivingRoom, ...airbnbLivingRoom],
  kitchen: [editorialBreakfast, editorialFamilyGames, ...airbnbKitchen],
  bedrooms: [editorialBedroom, editorialChildrenBirthday, ...airbnbBedrooms],
  bathrooms: airbnbBathroom,
  terrace: [editorialTerraceLunch, airbnbExterior[0], ...airbnbTerrace],
  details: [...airbnbDetails, ...airbnbTerrace.slice(0, 3)],
  lifestyle: [access, beachView, ocean, poplars, family, sunset, beach, shade],
  videos: [],
  gallery: [
    access,
    editorialLivingRoom,
    ...airbnbLivingRoom,
    editorialBreakfast,
    editorialBedroom,
    editorialChildrenBirthday,
    editorialFamilyGames,
    airbnbKitchen[0],
    airbnbKitchen[1],
    ...airbnbBedrooms,
    ...airbnbBathroom,
    airbnbExterior[0],
    airbnbExterior[1],
    airbnbExterior[2],
    airbnbExterior[3],
    airbnbExterior[4],
    editorialTerraceLunch,
    ...airbnbTerrace,
    airbnbDetails[0],
    airbnbDetails[1],
    airbnbDetails[4],
    beachView,
    ocean,
    poplars,
    family,
    sunset,
    beach,
    shade,
  ],
} satisfies PropertyMediaManifest;
