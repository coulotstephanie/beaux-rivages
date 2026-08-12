import type { MediaAsset, PropertyMediaManifest } from "@/media/types";
import { destinationMedia } from "@/media/destinations";

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

const access = asset(
  "acces-plage.jpeg",
  "Plage des Saumonards derrière les ganivelles",
  "La plage au bout du chemin",
);
const beachView = asset(
  "vue-plage.jpeg",
  "Vue sur la plage des Saumonards",
  "La plage au bout du portail",
);
const ocean = asset("ocean.jpeg", "Océan derrière les ganivelles", "Face à l’Atlantique");
const poplars = asset(
  "peupliers.jpeg",
  "Pinède et aire de promenade près de la plage",
  "La forêt des Saumonards",
);
const family = asset(
  "famille-plage.jpeg",
  "Jeux d’enfants sur la plage",
  "Des vacances en famille",
);
const sunset = asset(
  "coucher-soleil.jpeg",
  "Coucher de soleil sur l’océan",
  "Les soirées face à la mer",
);
const fortBoyard = asset(
  "fort-boyard-saumonards.jpg",
  "Fort Boyard vu depuis la plage des Saumonards",
  "Fort Boyard à l’horizon",
);
const beach = asset("plage.jpeg", "Plage près du Nid d’Été", "Le sable au bout du chemin");
const shade = asset(
  "voile-ombrage.jpeg",
  "Dune fleurie et embarcations sur la plage",
  "La côte sauvage d’Oléron",
);
const originalLivingRoom = propertyAsset(
  "airbnb-salon-1.jpeg",
  "Salon d’origine du Nid d’Été avec canapé convertible",
  "Photographie originale du séjour",
);
const airbnbLivingRoom = [
  propertyAsset(
    "salon-retouche-premium.png",
    "Salon lumineux du Nid d’Été avec canapé convertible",
    "Le séjour, pensé pour se retrouver",
  ),
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
const editorialBeachReturn = propertyAsset(
  "editorial/retour-plage-en-famille.png",
  "Une famille préparant un goûter après la plage dans le salon du Nid d’Été",
  "Le goûter au retour de la plage",
);
const editorialFamilyCat = propertyAsset(
  "editorial/lecture-bebe-et-chat.png",
  "Parents, enfants, bébé et chat réunis pour lire dans le salon du Nid d’Été",
  "Une histoire tous ensemble",
);
const editorialCandlelightDinner = propertyAsset(
  "editorial/diner-romantique.png",
  "Dîner romantique aux chandelles dans le salon du Nid d’Été",
  "Une soirée douce au Nid",
);
const editorialMultigenerationalEaster = propertyAsset(
  "editorial/paques-multigenerationnel.png",
  "Grands-parents, parent, enfants, bébé et chien réunis pour le déjeuner de Pâques",
  "Pâques avec toutes les générations",
);
const editorialFamilyTable = propertyAsset(
  "editorial/table-en-famille.png",
  "Grands-parents, parent, enfants et bébé partageant un repas au Nid d’Été",
  "Le dîner de famille au Nid",
);
const editorialFamilyTerraceAperitif = propertyAsset(
  "editorial/aperitif-famille-en-terrasse.png",
  "Plusieurs générations réunies avec un bébé et un chat autour de la table de la terrasse",
  "L’apéritif en famille sous la voile",
);
const editorialGuestArrival = propertyAsset(
  "editorial/arrivee-famille-bagages.png",
  "Une famille arrivant avec ses bagages devant le Nid d’Été",
  "L’arrivée au Nid d’Été",
);
const editorialRemoteWork = propertyAsset(
  "editorial/teletravail-piece-de-vie.png",
  "Une professionnelle travaillant sur ordinateur à la grande table du Nid d’Été",
  "Télétravailler au calme à Boyardville",
);
const editorialBabySetup = propertyAsset(
  "editorial/parents-installation-lit-bebe.png",
  "De jeunes parents installant un lit bébé dans une chambre du Nid d’Été",
  "Tout préparer pour le séjour de bébé",
);
const editorialFamilyCycling = propertyAsset(
  "editorial/depart-velo-en-famille.png",
  "Une famille préparant ses vélos devant le Nid d’Été pour partir vers la plage",
  "La plage à vélo depuis le Nid",
);
const editorialSeniorsResidence = propertyAsset(
  "editorial/seniors-residence-arboree.png",
  "Un couple de seniors se promenant dans la résidence arborée du Nid d’Été",
  "Une promenade paisible dans la résidence",
);
const editorialChristmasDinner = propertyAsset(
  "editorial/repas-noel-intergenerationnel.png",
  "Plusieurs générations réunies autour d’un repas de Noël au Nid d’Été",
  "Noël autour de la grande table",
);
const airbnbKitchen = [
  propertyAsset(
    "airbnb-cuisine-entiere-2.jpeg",
    "Équipements de la cuisine du Nid d’Été",
    "Tout le nécessaire pour cuisiner",
  ),
  propertyAsset("airbnb-espace-repas-1.jpeg", "Espace repas du Nid d’Été", "La table des vacances"),
];
const airbnbBedrooms = [
  propertyAsset(
    "airbnb-chambre-1-2.jpeg",
    "Chambre principale du Nid d’Été éclairée par la fenêtre",
    "La chambre principale",
  ),
  propertyAsset("airbnb-chambre-2-1.jpeg", "Seconde chambre avec lit double", "La seconde chambre"),
];
const bathroomHighlights = [
  propertyAsset(
    "lavabo-detail.jpeg",
    "Lavabo du Nid d’Été cadré de face avec sa vasque et son miroir éclairé",
    "Le lavabo bien centré",
  ),
  propertyAsset(
    "authentique/douche.jpg",
    "Douche vitrée et meuble vasque du Nid d’Été",
    "La douche et le meuble vasque",
  ),
  propertyAsset(
    "airbnb-toilettes.jpeg",
    "Toilettes suspendues et sèche-serviettes du Nid d’Été",
    "Les toilettes bien cadrées",
  ),
];
const additionalBathroomPhotos = [
  propertyAsset(
    "authentique/salle-eau-ensemble.jpg",
    "Salle d’eau complète du Nid d’Été avec douche et toilettes suspendues",
    "La salle d’eau dans son ensemble",
  ),
];
const authenticAerial = [
  propertyAsset(
    "authentique/maison-heureuse-vue-aerienne.jpg",
    "Vue aérienne de la Maison Heureuse entre forêt et plage des Saumonards",
    "La résidence entre forêt et océan",
  ),
  propertyAsset(
    "authentique/localisation-aerienne.jpg",
    "Localisation du Nid d’Été dans la Maison Heureuse avec l’accès direct à la plage",
    "Le Nid d’Été à quelques mètres du sable",
  ),
  propertyAsset(
    "authentique/maison-heureuse-facade.jpeg",
    "Façade historique de la Maison Heureuse à Boyardville",
    "La Maison Heureuse, restaurée face à l’océan",
  ),
];
const authenticFood = [
  propertyAsset(
    "authentique/raclette.jpg",
    "Raclette partagée autour de la table du Nid d’Été",
    "Une soirée raclette à la maison",
  ),
  propertyAsset(
    "authentique/plateau-charcuterie.jpg",
    "Plateau de charcuteries et fromages à partager",
    "Un plateau convivial pour l’apéritif",
  ),
];
export const nidDEteAuthenticMedia = {
  residenceGate: propertyAsset(
    "authentique/portail-maison-heureuse.jpeg",
    "Portail de la Maison Heureuse ouvrant sur l’allée vers l’océan",
    "L’arrivée au cœur de la Maison Heureuse",
  ),
  residenceAerial: propertyAsset(
    "authentique/maison-heureuse-chenal-plage.jpeg",
    "Vue aérienne de la Maison Heureuse entre le chenal de Boyardville et la plage",
    "La Maison Heureuse entre chenal, forêt et océan",
  ),
  residenceForestAerial: propertyAsset(
    "authentique/maison-heureuse-vue-aerienne.jpg",
    "Vue aérienne de la Maison Heureuse entre la forêt des Saumonards et l’océan",
    "La résidence historique dans son écrin naturel",
  ),
  residenceFacade: propertyAsset(
    "authentique/maison-heureuse-facade.jpeg",
    "Façade historique jaune et blanche de la Maison Heureuse à Boyardville",
    "La façade restaurée de la Maison Heureuse",
  ),
  fortFromBeach: propertyAsset(
    "authentique/fort-boyard-depuis-saumonards.jpeg",
    "Fort Boyard aperçu depuis la plage des Saumonards",
    "Fort Boyard depuis les Saumonards",
  ),
  gardenLoungers: propertyAsset(
    "authentique/transats-jardin.jpeg",
    "Deux transats dans le jardin clos du Nid d’Été",
    "Prendre le temps dans le jardin clos",
  ),
  preparedBedroom: propertyAsset(
    "authentique/chambre-linge.jpeg",
    "Chambre du Nid d’Été préparée avec linge et serviettes",
    "La chambre préparée pour l’arrivée",
  ),
  seafoodPlatter: propertyAsset(
    "authentique/plateau-fruits-de-mer.jpeg",
    "Plateau de fruits de mer préparé pour un repas de vacances",
    "Les saveurs de l’océan à partager",
  ),
  raclette: propertyAsset(
    "authentique/raclette.jpg",
    "Raclette partagée autour de la table du Nid d’Été",
    "Une soirée raclette à la maison",
  ),
} as const;
const arrivalEntrance = propertyAsset(
  "airbnb-cour-d-entree-1.jpeg",
  "Façade du Nid d’Été et emplacement de la boîte à clés",
  "Repérer la boîte à clés à votre arrivée",
);
const arrivalPlan = propertyAsset(
  "airbnb-exterieur-3-1.jpeg",
  "Plan d’accès au Nid d’Été dans la résidence La Maison Heureuse",
  "Du portillon piéton à l’appartement D12",
);
const airbnbExterior = [
  propertyAsset(
    "airbnb-arriere-cour-1.jpeg",
    "Terrasse et jardin clos du Nid d’Été",
    "Déjeuner dehors, sous les arbres",
  ),
  propertyAsset(
    "airbnb-exterieur-1-1.jpeg",
    "Façade historique de la Maison Heureuse",
    "L’élégance balnéaire de la résidence",
  ),
  propertyAsset(
    "airbnb-exterieur-1-2.jpeg",
    "Allée arborée de la Maison Heureuse",
    "Sous les arbres de la résidence",
  ),
  propertyAsset(
    "airbnb-exterieur-2-1.jpeg",
    "Résidence sécurisée autour du Nid d’Été",
    "Le calme de la résidence",
  ),
];
const airbnbTerrace = [
  propertyAsset(
    "airbnb-arriere-cour-2.jpeg",
    "Équipements de la terrasse du Nid d’Été",
    "Les détails de la vie dehors",
  ),
  propertyAsset(
    "airbnb-arriere-cour-4.jpeg",
    "Transats disponibles au Nid d’Été",
    "Prendre le temps au soleil",
  ),
];
const airbnbDetails = [
  propertyAsset(
    "airbnb-exterieur-4-1.jpeg",
    "Environnement extérieur du Nid d’Été",
    "Entre résidence et plage",
  ),
  propertyAsset(
    "airbnb-piece-a-theme-1.jpeg",
    "Décoration de Noël à la Maison Heureuse au sein du Nid d’Été",
    "Passer Noël à la Maison Heureuse au sein du Nid d’Été",
  ),
  propertyAsset(
    "airbnb-photos-supplementaires-1.jpeg",
    "Détail complémentaire du Nid d’Été",
    "L’esprit des vacances à Boyardville",
  ),
];
export const nidDEteMedia = {
  slug: "nid-d-ete",
  hero: airbnbLivingRoom[0],
  arrival: [editorialGuestArrival, nidDEteAuthenticMedia.residenceGate, arrivalEntrance, arrivalPlan],
  exterior: [
    editorialFamilyCycling,
    editorialSeniorsResidence,
    nidDEteAuthenticMedia.gardenLoungers,
    ...airbnbExterior.slice(1),
  ],
  livingRoom: [
    editorialLivingRoom,
    editorialBeachReturn,
    editorialFamilyCat,
    editorialRemoteWork,
    ...airbnbLivingRoom,
  ],
  kitchen: [
    editorialBreakfast,
    editorialFamilyGames,
    editorialChristmasDinner,
    ...airbnbKitchen,
    ...authenticFood,
  ],
  bedrooms: [
    editorialBedroom,
    editorialChildrenBirthday,
    editorialBabySetup,
    nidDEteAuthenticMedia.preparedBedroom,
    ...airbnbBedrooms,
  ],
  bathrooms: [...bathroomHighlights, ...additionalBathroomPhotos],
  terrace: [
    editorialFamilyTerraceAperitif,
    editorialTerraceLunch,
    nidDEteAuthenticMedia.gardenLoungers,
    ...airbnbTerrace,
  ],
  details: [...airbnbDetails, ...airbnbTerrace.slice(0, 3)],
  lifestyle: [
    editorialBeachReturn,
    editorialFamilyCat,
    editorialCandlelightDinner,
    editorialMultigenerationalEaster,
    editorialFamilyTable,
    editorialFamilyTerraceAperitif,
    access,
    beachView,
    ocean,
    poplars,
    family,
    sunset,
    beach,
    shade,
    fortBoyard,
    destinationMedia.fortBoyardAerial,
    nidDEteAuthenticMedia.residenceAerial,
    nidDEteAuthenticMedia.fortFromBeach,
    nidDEteAuthenticMedia.seafoodPlatter,
    ...authenticAerial,
    ...authenticFood,
  ],
  videos: [],
  gallery: [
    // Ouverture et pièces de vie
    editorialGuestArrival,
    ...airbnbLivingRoom,
    ...airbnbKitchen,
    editorialLivingRoom,
    editorialBeachReturn,
    editorialFamilyCat,
    editorialCandlelightDinner,
    editorialMultigenerationalEaster,
    editorialFamilyTable,
    editorialFamilyTerraceAperitif,
    editorialBreakfast,
    editorialChristmasDinner,
    editorialRemoteWork,

    // Chambres
    ...airbnbBedrooms,
    editorialBedroom,
    editorialChildrenBirthday,
    editorialBabySetup,
    nidDEteAuthenticMedia.preparedBedroom,
    editorialFamilyGames,

    // Salle d’eau et toilettes
    ...bathroomHighlights,
    ...additionalBathroomPhotos,

    // Extérieur et terrasse
    airbnbExterior[1],
    airbnbExterior[2],
    airbnbExterior[3],
    editorialFamilyCycling,
    editorialSeniorsResidence,
    editorialTerraceLunch,
    nidDEteAuthenticMedia.gardenLoungers,
    ...airbnbTerrace,
    airbnbDetails[1],
    ...authenticAerial,
    ...authenticFood,
    access,
    beachView,
    ocean,
    poplars,
    family,
    sunset,
    fortBoyard,
    nidDEteAuthenticMedia.fortFromBeach,
    nidDEteAuthenticMedia.residenceAerial,
    nidDEteAuthenticMedia.seafoodPlatter,
    beach,
    shade,
  ],
  editorial: {
    originalLivingRoom,
  },
} satisfies PropertyMediaManifest;
