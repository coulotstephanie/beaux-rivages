import type { MediaAsset, PropertyMediaManifest } from "@/media/types";
import { destinationMedia } from "@/media/destinations";

const propertyAsset = (
  path: string,
  alt: string,
  caption: string,
): MediaAsset => ({
  src: `/images/properties/chai-des-tortues/${path}`,
  alt,
  caption,
  scope: "property",
  owner: "chai-des-tortues",
});

const destinationAsset = (
  file: string,
  alt: string,
  caption: string,
): MediaAsset => ({
  src: `/images/properties/chai-des-tortues/${file}`,
  alt,
  caption,
  scope: "destination",
});

const originalHero = propertyAsset(
  "hero/chai-espace-de-vie.jpeg",
  "Le vaste espace de vie du Chai des Tortues sous sa charpente en bois",
  "Le Chai des Tortues",
);
const hero = propertyAsset(
  "editorial/espace-de-vie-retour-marche.png",
  "Pièce de vie du Chai des Tortues préparée pour un retour du marché",
  "Du marché à la maison",
);
const editorialAperitif = propertyAsset(
  "editorial/salon-aperitif.png",
  "Apéritif aux huîtres sur la table basse du salon",
  "L’apéritif après la plage",
);
const editorialIsland = propertyAsset(
  "editorial/ilot-retour-marche.png",
  "Îlot du Chai animé par les produits rapportés du marché",
  "Le retour du marché sur l’îlot",
);
const editorialCelebration = propertyAsset(
  "editorial/table-de-fete.png",
  "Table de fête dressée pour six dans la salle à manger du Chai",
  "Une table pour célébrer",
);
const editorialChristmas = propertyAsset(
  "editorial/table-noel.png",
  "Table de Noël dressée pour six avec verrerie rouge et champagne au Chai des Tortues",
  "Noël autour de la grande table",
);
const editorialBedroom = propertyAsset(
  "editorial/chambre-attention.png",
  "Chambre du Chai préparée avec livre, eau et linge délicatement posé",
  "Une attention dans la chambre",
);
const editorialHoneymoon = propertyAsset(
  "editorial/chambre-lune-de-miel.png",
  "Chambre du Chai préparée pour une lune de miel avec pétales et champagne",
  "Une lune de miel sous les poutres",
);
const editorialMorningCoffee = propertyAsset(
  "editorial/cafe-matinal-exterieur.png",
  "Café matinal sur le mange-debout en bois du petit extérieur",
  "Le premier café dans la cour",
);
const editorialBicycleArrival = propertyAsset(
  "editorial/velo-devant-porte.png",
  "Vélo rétais devant la porte du Chai des Tortues",
  "L’île commence devant la porte",
);
const editorialFamilyGames = propertyAsset(
  "editorial/table-jeux-famille.png",
  "Jeu de société en famille autour de la table ronde du Chai",
  "Une partie sous les pierres",
);

const arrival = [
  editorialBicycleArrival,
];

const exterior = [
  editorialMorningCoffee,
  propertyAsset(
    "professional/cour-interieure-pierre.jpg",
    "La petite cour intérieure du Chai entourée de murs en pierre",
    "Une respiration minérale au cœur de la maison",
  ),
  propertyAsset(
    "exterior/facade-pierre.jpeg",
    "La façade en pierre du Chai des Tortues",
    "Une maison dans la pierre rétaise",
  ),
  propertyAsset(
    "exterior/rue-du-chai.jpeg",
    "La rue calme devant la façade du Chai des Tortues",
    "Au cœur de Rivedoux-Plage",
  ),
];

const livingRoom = [
  editorialAperitif,
  propertyAsset(
    "professional/espace-de-vie-panoramique.jpg",
    "Vue panoramique de la cuisine, de la salle à manger et du salon du Chai",
    "Tout l’espace de vie réuni sous la structure du chai",
  ),
  propertyAsset(
    "professional/sejour-cuisine-escalier.jpg",
    "Le séjour du Chai avec la cuisine en bois et l’escalier en colimaçon",
    "Pierre, bois et métal dans un même volume",
  ),
  propertyAsset(
    "professional/salon-pierre.jpg",
    "Le salon du Chai bordé de murs en pierre claire",
    "Le calme du salon sous les poutres",
  ),
  originalHero,
  propertyAsset(
    "living-room/salon-pierres.jpeg",
    "Le salon du Chai avec ses murs en pierre et sa charpente apparente",
    "Le salon sous les poutres",
  ),
  propertyAsset(
    "living-room/salon-charpente.jpeg",
    "Le séjour lumineux ouvert sous la charpente du Chai",
    "Un volume généreux pour se retrouver",
  ),
  propertyAsset(
    "living-room/sejour-et-cuisine.jpeg",
    "Le séjour du Chai ouvert sur la cuisine",
    "Une pièce de vie pensée pour les vacances",
  ),
];

const kitchen = [
  editorialIsland,
  propertyAsset(
    "professional/cuisine-bois.jpg",
    "La cuisine du Chai habillée de bois avec son îlot central",
    "Une cuisine généreuse pensée pour recevoir",
  ),
  propertyAsset(
    "kitchen/cuisine-ouverte.jpeg",
    "La cuisine ouverte et son grand plan de travail",
    "La cuisine ouverte",
  ),
  propertyAsset(
    "kitchen/cuisine-et-table.jpeg",
    "La cuisine du Chai et la table familiale",
    "Du marché à la grande table",
  ),
  propertyAsset(
    "kitchen/cuisine-equipee.jpeg",
    "La cuisine équipée sous les poutres en bois",
    "Une cuisine faite pour recevoir",
  ),
  propertyAsset(
    "kitchen/fours-integres.jpeg",
    "Les fours intégrés de la cuisine du Chai",
    "Tout le confort pour cuisiner",
  ),
  propertyAsset(
    "kitchen/table-familiale.jpeg",
    "La table à manger au centre de la pièce de vie",
    "Les repas qui se prolongent",
  ),
  editorialCelebration,
  editorialChristmas,
];

const bedrooms = [
  editorialBedroom,
  editorialHoneymoon,
  propertyAsset(
    "professional/chambre-pierre-bois.jpg",
    "Une chambre du Chai entre mur en pierre et plafond en bois clair",
    "Dormir entre pierre et bois",
  ),
  propertyAsset(
    "professional/chambre-bois-clair.jpg",
    "Une chambre lumineuse du Chai avec ses rangements en bois clair",
    "Une chambre douce et lumineuse",
  ),
  propertyAsset(
    "professional/chambre-suite-salle-eau.jpg",
    "Une chambre du Chai ouverte sur sa salle d’eau",
    "Le confort d’une chambre avec salle d’eau",
  ),
  propertyAsset(
    "professional/etage-chambres-salle-eau.jpg",
    "Le palier distribuant deux chambres et une salle d’eau du Chai",
    "L’étage pensé pour accueillir",
  ),
  propertyAsset(
    "bedroom-1/chambre-pierres.jpeg",
    "La chambre principale bordée d’un mur en pierre",
    "La douceur de la pierre",
  ),
  propertyAsset(
    "bedroom-2/chambre-lit-double.jpeg",
    "La deuxième chambre avec son lit double",
    "La deuxième chambre",
  ),
  propertyAsset(
    "bedroom-2/chambre-lumineuse.jpeg",
    "La deuxième chambre éclairée par une fenêtre",
    "Une chambre calme et lumineuse",
  ),
  propertyAsset(
    "bedrooms/troisieme-chambre.jpeg",
    "La troisième chambre du Chai avec son lit double",
    "La troisième chambre",
  ),
  propertyAsset(
    "bedrooms/chambre-sous-charpente.jpeg",
    "Une chambre sous la charpente en bois clair",
    "Des nuits sous les poutres",
  ),
];

const bathrooms = [
  propertyAsset(
    "professional/douche-pierre-verte.jpg",
    "La douche contemporaine aux parois minérales vertes du Chai",
    "Une salle d’eau au caractère minéral",
  ),
  propertyAsset(
    "professional/vasque-douche-suite.jpg",
    "La vasque en bois et la douche attenante d’une chambre du Chai",
    "Bois brut, verrière et douche minérale",
  ),
  propertyAsset(
    "bathroom/douche-pierre.jpeg",
    "La douche contemporaine encadrée de pierre",
    "La première salle d’eau",
  ),
  propertyAsset(
    "bathroom/salle-eau.jpeg",
    "La vasque et la douche de la première salle d’eau",
    "Matières naturelles et lignes sobres",
  ),
  propertyAsset(
    "bathroom/seconde-salle-eau.jpeg",
    "La seconde salle d’eau du Chai",
    "La seconde salle d’eau",
  ),
  propertyAsset(
    "bathroom/douche.jpeg",
    "La douche de la seconde salle d’eau",
    "Le confort pour toute la maison",
  ),
];

const details = [
  propertyAsset(
    "professional/palier-pierre.jpg",
    "Le palier de l’étage autour de l’escalier noir et du mur en pierre",
    "La pierre accompagne chaque niveau",
  ),
  propertyAsset(
    "details/plan-de-travail.jpeg",
    "Le plan de travail de la cuisine et ses détails en bois",
    "Le soin des détails",
  ),
  propertyAsset(
    "details/fenetre-sur-pierre.jpeg",
    "Une fenêtre du Chai ouverte sur le mur en pierre",
    "La pierre comme fil conducteur",
  ),
  propertyAsset(
    "details/charpente-bois.jpeg",
    "La charpente en bois clair du Chai",
    "La charpente d’origine réinterprétée",
  ),
  propertyAsset(
    "details/escalier-colimacon.jpeg",
    "L’escalier en colimaçon noir vu depuis l’étage",
    "L’escalier graphique",
  ),
  propertyAsset(
    "details/decor-mappemonde.jpeg",
    "Une mappemonde décorative sur le mur en pierre",
    "L’esprit du voyage",
  ),
  propertyAsset(
    "details/pierre-et-vegetation.jpeg",
    "Une plante verte devant un mur en pierre du Chai",
    "Pierre et végétation",
  ),
];

const bicycle = destinationAsset(
  "village-velo.jpeg",
  "Vélo dans une rue de village de l’Île de Ré",
  "L’île à vélo",
);
const port = destinationAsset(
  "port-fleuri.jpeg",
  "Port fleuri de l’Île de Ré",
  "L’art de vivre rétais",
);
const beachTerrace = destinationAsset(
  "terrasse-plage.jpeg",
  "Terrasse sur la plage",
  "Une pause face à l’océan",
);
const pastries = destinationAsset(
  "viennoiseries.jpeg",
  "Viennoiseries artisanales",
  "Les matins gourmands",
);

const propertyGallery = [
  hero,
  editorialAperitif,
  editorialIsland,
  editorialCelebration,
  editorialChristmas,
  editorialMorningCoffee,
  editorialBicycleArrival,
  editorialBedroom,
  editorialHoneymoon,
  editorialFamilyGames,
  livingRoom[1],
  livingRoom[2],
  livingRoom[3],
  kitchen[1],
  bedrooms[2],
  bedrooms[3],
  bedrooms[4],
  bedrooms[5],
  bathrooms[0],
  bathrooms[1],
  exterior[1],
  details[0],
  originalHero,
  livingRoom[5],
  kitchen[2],
  exterior[2],
  livingRoom[6],
  kitchen[3],
  bathrooms[2],
  details[1],
  kitchen[6],
  bathrooms[4],
  details[3],
  exterior[3],
  livingRoom[7],
  kitchen[4],
  kitchen[5],
  bathrooms[3],
  bathrooms[5],
  details[2],
  details[4],
  details[5],
  details[6],
];

export const chaiDesTortuesMedia = {
  slug: "chai-des-tortues",
  hero,
  arrival,
  exterior,
  livingRoom,
  kitchen,
  bedrooms,
  bathrooms,
  terrace: [editorialMorningCoffee],
  details,
  lifestyle: [
    bicycle,
    port,
    destinationMedia.food,
    beachTerrace,
    pastries,
    destinationMedia.village,
  ],
  videos: [
    {
      src: "/videos/chai-des-tortues-film-sans-son.mp4",
      alt: "Visite vidéo du Chai des Tortues",
      caption: "Le Chai des Tortues, de la pierre à la lumière",
      scope: "property",
      owner: "chai-des-tortues",
    },
    {
      src: "/videos/chai-des-tortues-chambre-1-sans-son.mp4",
      alt: "Visite vidéo d’une première chambre du Chai des Tortues",
      caption: "Une chambre du Chai, entre bois clair et douceur marine",
      scope: "property",
      owner: "chai-des-tortues",
    },
    {
      src: "/videos/chai-des-tortues-chambre-2-sans-son.mp4",
      alt: "Visite vidéo d’une seconde chambre du Chai des Tortues",
      caption: "Une seconde chambre du Chai et ses détails inspirés de l’océan",
      scope: "property",
      owner: "chai-des-tortues",
    },
  ],
  gallery: [...propertyGallery, bicycle, port, beachTerrace],
  editorial: {
    breakfast: pastries,
    aperitif: beachTerrace,
    market: destinationMedia.food,
    seafood: destinationMedia.food,
    family: editorialFamilyGames,
    pets: destinationMedia.village,
    beach: beachTerrace,
    cycling: bicycle,
    kitchen: editorialIsland,
    story: exterior[0],
    stone: details[1],
  },
} satisfies PropertyMediaManifest;
