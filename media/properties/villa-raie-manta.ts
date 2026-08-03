import type { MediaAsset, PropertyMediaManifest } from "@/media/types";

const asset = (file: string, alt: string, caption?: string): MediaAsset => ({
  src: `/images/properties/villa-raie-manta/${file}`,
  alt,
  caption,
  scope: "property",
  owner: "villa-raie-manta",
});

// Sources originales conservées dans la médiathèque pour réversibilité.
// Elles ne sont jamais rendues sur le site car leurs légendes sont incrustées.
export const villaRetouchedOriginals = [
  "airbnb-chambre-1-1.jpeg",
  "airbnb-chambre-2-1.jpeg",
  "airbnb-chambre-3-1.jpeg",
  "airbnb-chambre-4-1.jpeg",
] as const;

const salonSea = asset(
  "salon-vue-mer.jpeg",
  "Salon à l’étage de Villa Raie Manta",
  "Le salon signature",
);
const editorialSalon = asset(
  "editorial/salon-aperitif.png",
  "Salon de Villa Raie Manta préparé pour un apéritif",
  "L’apéritif dans la lumière",
);
const editorialIsland = asset(
  "editorial/ilot-aperitif.png",
  "Îlot de cuisine animé par un retour du marché",
  "L’îlot prêt à cuisiner",
);
const editorialKitchenLife = asset(
  "editorial/cuisine-fleurs-gourmandises.png",
  "Cuisine de Villa Raie Manta fleurie avec du pain et des pâtisseries",
  "Une cuisine vivante et accueillante",
);
const editorialSeafood = asset(
  "editorial/table-fruits-de-mer.png",
  "Table extérieure dressée autour d’un plateau de fruits de mer",
  "Les fruits de mer en terrasse",
);
const editorialBirthday = asset(
  "editorial/table-anniversaire.png",
  "Table d’anniversaire dressée dans la cuisine de Villa Raie Manta",
  "Un anniversaire face à l’océan",
);
const editorialNewYear = asset(
  "editorial/table-nouvel-an.png",
  "Table du Nouvel An dressée à Villa Raie Manta",
  "Le réveillon face à l’océan",
);
const editorialBedroom = asset(
  "editorial/chambre-attention.png",
  "Suite de Villa Raie Manta préparée avec livre, eau et linge",
  "Une attention dans la suite",
);
const editorialBirthdayBedroom = asset(
  "editorial/chambre-anniversaire-18-ans.png",
  "Chambre de Villa Raie Manta décorée pour un anniversaire de 18 ans",
  "Une majorité à célébrer",
);
const editorialFamilyGames = asset(
  "editorial/table-jeux-famille.png",
  "Jeu de société en famille sur la grande table de Villa Raie Manta",
  "Une partie tous ensemble",
);
const editorialChildrenRoom = asset(
  "editorial/chambre-enfants-famille.png",
  "Chambre à lits superposés préparée pour les enfants",
  "Le refuge des petits voyageurs",
);
const editorialRomance = asset(
  "editorial/chambre-romance.png",
  "Suite romantique avec cœur de pétales, bouteille et deux flûtes",
  "Une soirée à deux",
);
const editorialBalineseLounger = asset(
  "editorial/transat-balinais.png",
  "Transat balinais préparé pour une fin d’après-midi à la Villa",
  "L’heure douce sur le transat balinais",
);
const editorialBeachReturn = asset(
  "editorial/retour-plage-en-couple-fenetre-etage.png",
  "Un couple de retour de plage dans le salon à l’étage de Villa Raie Manta",
  "Le retour de la plage",
);
const editorialFamilyPets = asset(
  "editorial/enfants-bebe-et-chien.png",
  "Parents, enfants, bébé et chien réunis dans le salon de Villa Raie Manta",
  "La Villa en famille",
);
const editorialCandlelightDinner = asset(
  "editorial/diner-romantique-ocean.png",
  "Dîner romantique aux chandelles dans la lumière du soir de Villa Raie Manta",
  "Une soirée à deux face à l’océan",
);
const editorialMultigenerationalBirthday = asset(
  "editorial/anniversaire-multigenerationnel.png",
  "Grands-parents, parents, enfants et bébé célébrant un anniversaire dans la Villa",
  "Un anniversaire pour toutes les générations",
);
const editorialFamilyTable = asset(
  "editorial/grande-table-en-famille.png",
  "Plusieurs générations réunies autour de la grande table de Villa Raie Manta",
  "Le grand déjeuner en famille",
);
const editorialAsianFamilyTable = asset(
  "editorial/grande-table-famille-asiatique.png",
  "Une famille asiatique de plusieurs générations réunie autour de la table réelle de Villa Raie Manta",
  "Toutes les générations autour de la table",
);
const editorialFamilyTerraceAperitif = asset(
  "editorial/aperitif-famille-en-terrasse.png",
  "Une famille réunie autour d’un plateau de fruits de mer sur la terrasse de Villa Raie Manta",
  "Le plateau de fruits de mer en famille face à l’océan",
);
const ocean = asset(
  "vue-ocean.jpeg",
  "Vue sur l’océan depuis Villa Raie Manta",
  "L’art de vivre face à l’océan",
);
const authenticReBridge = asset(
  "authentique/pont-ile-de-re.jpg",
  "Pont de l’Île de Ré vu depuis la mer avec des voiliers",
  "Le pont dessine l’horizon",
);
const kitchen = asset("cuisine.jpeg", "Cuisine contemporaine", "Cuisine et salle à manger");
const childrenRoom = asset(
  "chambre-enfants.jpeg",
  "Chambre avec lits superposés",
  "La chambre des enfants",
);
const bathroom = asset(
  "salle-eau.jpeg",
  "Salle d’eau contemporaine",
  "Des lignes sobres et actuelles",
);
const brightSalon = asset(
  "salon-lumiere.jpeg",
  "Salon lumineux avec fauteuil jaune",
  "Océan, design et lumière",
);
const familyTable = asset(
  "table-famille.jpeg",
  "Table dressée pour un repas en famille",
  "La maison à partager",
);
const doubleRoom = asset(
  "chambre-double.jpeg",
  "Chambre double de Villa Raie Manta",
  "Des nuits paisibles",
);
const airbnbLivingRoom = [
  asset(
    "airbnb-salon-1.jpeg",
    "Salon panoramique de Villa Raie Manta",
    "Le salon face à l’horizon",
  ),
  asset(
    "airbnb-salon-2.jpeg",
    "Salon à l’étage avec vue sur la mer",
    "La mer entre dans le séjour",
  ),
];
const airbnbKitchen = [
  asset(
    "airbnb-cuisine-entiere-1.jpeg",
    "Cuisine ouverte de Villa Raie Manta",
    "Une cuisine faite pour partager",
  ),
  asset(
    "airbnb-cuisine-entiere-2.jpeg",
    "Cuisine équipée de Villa Raie Manta",
    "Le retour des Halles",
  ),
  asset("airbnb-espace-repas-1.jpeg", "Espace repas de Villa Raie Manta", "La grande table"),
];
const airbnbBedrooms = [
  asset(
    "chambre-rez-de-chaussee-sans-texte.png",
    "Suite du rez-de-chaussée avec lit 160",
    "La suite du rez-de-chaussée",
  ),
  asset(
    "airbnb-chambre-1-2.jpeg",
    "Dressing de la suite de Villa Raie Manta",
    "Une suite pensée dans les détails",
  ),
  asset(
    "chambre-modulable-sans-texte.png",
    "Chambre avec deux lits simples réunissables",
    "La chambre modulable",
  ),
  asset(
    "chambre-vue-mer-sans-texte.png",
    "Chambre double à l’étage avec vue sur l’océan",
    "Une chambre dans la lumière",
  ),
  asset("chambre-enfants-sans-texte.png", "Chambre avec lits superposés", "La chambre des enfants"),
];
const airbnbBathrooms = [
  asset(
    "airbnb-salle-de-bains-entiere-2-1.jpeg",
    "Seconde salle d’eau à l’étage",
    "Une salle d’eau à chaque niveau",
  ),
  asset(
    "airbnb-toilettes-avec-lavabo-1-1.jpeg",
    "Premier WC avec lave-mains",
    "Des espaces pratiques à chaque étage",
  ),
  asset(
    "airbnb-toilettes-avec-lavabo-2-1.jpeg",
    "Second WC avec lave-mains",
    "Trois WC dans la maison",
  ),
];
const authenticBathrooms = [
  asset(
    "authentique/salle-eau-vasque.jpg",
    "Salle d’eau de Villa Raie Manta avec douche, vasque en bois et miroir rond",
    "La salle d’eau dans son ensemble",
  ),
  asset(
    "authentique/douche-italienne.jpg",
    "Douche à l’italienne carrelée de Villa Raie Manta",
    "La douche à l’italienne",
  ),
  asset(
    "authentique/douche-et-vasque.jpg",
    "Douche et vasque en bois de Villa Raie Manta",
    "La douche et son meuble vasque",
  ),
  asset(
    "authentique/toilettes-independantes.jpg",
    "Toilettes indépendantes décorées d’une photographie de l’océan",
    "Les toilettes indépendantes",
  ),
];
const airbnbExterior = [
  asset(
    "airbnb-exterieur-2-1.jpeg",
    "Extérieur de Villa Raie Manta près de l’océan",
    "La plage à quelques pas",
  ),
];
const airbnbLeisure = [
  asset(
    "airbnb-salle-de-jeux-pour-enfants-1.jpeg",
    "Jeux et équipements pour les enfants",
    "Une maison accueillante pour les familles",
  ),
  asset(
    "airbnb-salle-de-jeux-1.jpeg",
    "Jeux de société et loisirs de la villa",
    "Les soirées à la maison",
  ),
];

export const villaRaieMantaMedia = {
  slug: "villa-raie-manta",
  hero: editorialSalon,
  arrival: [airbnbExterior[0]],
  exterior: [ocean, authenticReBridge, ...airbnbExterior],
  livingRoom: [
    editorialSalon,
    editorialFamilyPets,
    editorialBeachReturn,
    salonSea,
    brightSalon,
    ...airbnbLivingRoom,
  ],
  kitchen: [editorialKitchenLife, editorialIsland, kitchen, ...airbnbKitchen],
  bedrooms: [
    editorialBedroom,
    editorialBirthdayBedroom,
    editorialChildrenRoom,
    editorialRomance,
    childrenRoom,
    doubleRoom,
    ...airbnbBedrooms,
  ],
  bathrooms: [...authenticBathrooms, bathroom, ...airbnbBathrooms],
  terrace: [editorialFamilyTerraceAperitif, editorialSeafood, editorialBalineseLounger],
  details: [
    editorialBirthday,
    editorialNewYear,
    editorialFamilyGames,
    familyTable,
    ...airbnbLeisure,
  ],
  lifestyle: [
    editorialFamilyPets,
    editorialBeachReturn,
    editorialCandlelightDinner,
    editorialMultigenerationalBirthday,
    editorialFamilyTable,
    editorialAsianFamilyTable,
    editorialFamilyTerraceAperitif,
    ocean,
    editorialBalineseLounger,
    editorialFamilyGames,
    familyTable,
  ],
  videos: [],
  gallery: [
    // Ouverture et arrivée
    editorialSalon,
    editorialFamilyPets,
    editorialBeachReturn,
    editorialCandlelightDinner,
    editorialMultigenerationalBirthday,
    editorialFamilyTable,
    editorialAsianFamilyTable,
    editorialFamilyTerraceAperitif,
    ...airbnbExterior,
    ocean,

    // Salon panoramique
    salonSea,
    airbnbLivingRoom[0],
    airbnbLivingRoom[1],
    brightSalon,

    // Cuisine et repas
    editorialKitchenLife,
    kitchen,
    editorialIsland,
    ...airbnbKitchen,
    editorialBirthday,
    editorialNewYear,
    editorialFamilyGames,
    familyTable,

    // Chambres
    airbnbBedrooms[0],
    airbnbBedrooms[1],
    airbnbBedrooms[2],
    airbnbBedrooms[3],
    airbnbBedrooms[4],
    doubleRoom,
    editorialBedroom,
    editorialBirthdayBedroom,
    editorialChildrenRoom,
    editorialRomance,

    // Salles d’eau et toilettes
    ...authenticBathrooms,
    bathroom,
    ...airbnbBathrooms,

    // Terrasse et loisirs
    editorialSeafood,
    editorialBalineseLounger,
    ...airbnbLeisure,
  ],
} satisfies PropertyMediaManifest;
