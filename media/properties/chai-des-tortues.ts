import type { MediaAsset, PropertyMediaManifest } from "@/media/types";
import { destinationMedia } from "@/media/destinations";

const propertyAsset = (path: string, alt: string, caption: string): MediaAsset => ({
  src: `/images/properties/chai-des-tortues/${path}`,
  alt,
  caption,
  scope: "property",
  owner: "chai-des-tortues",
});

const destinationAsset = (file: string, alt: string, caption: string): MediaAsset => ({
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
const hero = originalHero;
const editorialAperitif = propertyAsset(
  "editorial/salon-aperitif.png",
  "Apéritif aux huîtres sur la table basse du salon",
  "L’apéritif après la plage",
);
const editorialIsland = propertyAsset(
  "editorial/ilot-retour-marche.png",
  "Îlot du Chai préparé avec des produits frais à partager",
  "L’îlot prêt à partager",
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
const editorialFamilyGameLived = propertyAsset(
  "editorial/jeu-de-societe-en-famille.png",
  "Parents et enfants réunis autour d’un jeu de société dans le salon du Chai",
  "Une partie en famille dans le salon",
);
const editorialFriendsGame = propertyAsset(
  "editorial/jeu-de-societe-entre-amis.png",
  "Groupe d’amis réuni autour d’un jeu de société dans le salon du Chai",
  "Une partie entre amis",
);
const editorialMarketCouple = propertyAsset(
  "editorial/retour-marche-en-couple.png",
  "Un couple préparant le dîner avec les produits du marché dans la grande pièce du Chai",
  "Le dîner se prépare à deux",
);
const editorialFamilyCat = propertyAsset(
  "editorial/matin-en-famille-chat.png",
  "Parents, enfants, bébé et chat réunis dans la pièce de vie du Chai",
  "Un matin pour toute la famille",
);
const editorialCandlelightDinner = propertyAsset(
  "editorial/diner-romantique-aux-chandelles.png",
  "Dîner romantique aux chandelles dans la grande pièce du Chai",
  "Un dîner à deux sous les poutres",
);
const editorialMultigenerationalChristmas = propertyAsset(
  "editorial/noel-multigenerationnel.png",
  "Plusieurs générations réunies autour de la table de Noël du Chai avec un bébé et un chat",
  "Noël réunit toutes les générations",
);
const editorialFamilyTable = propertyAsset(
  "editorial/grande-table-en-famille.png",
  "Grands-parents, parents, enfants et bébé partageant un grand repas dans le Chai",
  "Le grand déjeuner sous les poutres",
);
const editorialQuietBedroom = propertyAsset(
  "editorial/chambre-moment-calme.png",
  "Deux femmes profitant d’un moment calme dans une chambre du Chai",
  "Un moment calme dans la chambre",
);
const editorialFamilyBedroom = propertyAsset(
  "editorial/chambre-en-famille.png",
  "Une famille réunie autour de jeux et de livres dans une chambre du Chai",
  "La chambre devient un refuge en famille",
);
const editorialFamilyOuting = propertyAsset(
  "editorial/preparation-balade-en-famille.png",
  "Une grand-mère et sa petite-fille préparant une balade sur une carte dans le Chai",
  "Préparer ensemble la prochaine balade",
);
const editorialBeachDeparture = propertyAsset(
  "editorial/depart-pour-la-plage.png",
  "Une famille préparant chapeaux, jeux et tapis avant de partir à la plage",
  "Le départ pour la plage",
);
const editorialSeniorBedroom = propertyAsset(
  "editorial/chambre-sejour-seniors.png",
  "Un couple de seniors profitant d’une chambre lumineuse du Chai",
  "Une chambre accueillante pour toutes les générations",
);
const editorialWelcomeShower = propertyAsset(
  "editorial/douche-produits-accueil.png",
  "Douche minérale du Chai préparée avec linge et produits d’accueil",
  "La douche préparée pour l’arrivée",
);
const editorialBabyBathroom = propertyAsset(
  "editorial/salle-eau-avec-baignoire-bebe.png",
  "Salle d’eau du Chai équipée d’une baignoire pour bébé",
  "Le confort pensé aussi pour les tout-petits",
);
const editorialBabyBedroom = propertyAsset(
  "editorial/chambre-equipee-pour-bebe.png",
  "Chambre-suite du Chai préparée avec un lit bébé et les affaires d’un nourrisson",
  "Tout est prêt pour accueillir bébé",
);
const editorialGuestArrival = propertyAsset(
  "editorial/arrivee-voyageurs-facade.png",
  "Voyageuses arrivant avec leurs bagages, un enfant, un chien et un vélo devant le Chai",
  "L’arrivée au Chai des Tortues",
);
const editorialCourtyardMoment = propertyAsset(
  "editorial/moment-a-deux-dans-la-cour.png",
  "Un couple partageant un moment dans la petite cour en pierre du Chai",
  "Une pause à deux dans la cour",
);
const editorialFamilyBreakfast = propertyAsset(
  "editorial/petit-dejeuner-en-famille.png",
  "Deux parents et un enfant partageant un petit-déjeuner autour de l’îlot du Chai",
  "Le petit-déjeuner autour de l’îlot",
);
const editorialRemoteWork = propertyAsset(
  "editorial/teletravail-coin-bureau.png",
  "Deux professionnels travaillant avec un ordinateur dans le coin bureau du Chai",
  "Travailler sur l’île, habiter le Chai",
);

const newLivedMoments = [
  propertyAsset("editorial/repas-fruits-de-mer-famille.png", "Famille réunie autour d’un repas de fruits de mer au Chai", "Les saveurs de l’île en famille"),
  propertyAsset("editorial/anniversaire-en-famille.png", "Une famille célébrant un anniversaire dans la cuisine du Chai", "Un anniversaire à la maison"),
  propertyAsset("editorial/patisserie-intergenerationnelle.png", "Trois générations préparant des pâtisseries autour de l’îlot", "Pâtisser entre générations"),
  propertyAsset("editorial/sejour-cocooning-famille.png", "Une famille profitant d’un moment cocooning dans le salon", "Le plaisir de rester à la maison"),
  propertyAsset("editorial/repas-entre-amis.png", "Amis préparant et partageant un repas dans la grande pièce de vie", "La grande table entre amis"),
  propertyAsset("editorial/chambre-romantique.png", "Chambre-suite préparée avec peignoirs, pétales, champagne et chocolats", "Une escapade romantique"),
  propertyAsset("editorial/sejour-avec-chien.png", "Un couple séjournant avec son chien dans le salon du Chai", "Les vacances avec son compagnon"),
  propertyAsset("editorial/diner-romantique.png", "Un couple partageant un dîner romantique dans le Chai", "Un dîner à deux"),
  propertyAsset("editorial/baby-shower.png", "Amies réunies autour d’une future maman pour une baby shower", "Célébrer l’arrivée de bébé"),
];

const newCelebrations = [
  propertyAsset("editorial/raclette-entre-amis.png", "Amis réunis autour d’une raclette dans la grande pièce de vie", "Une soirée raclette entre amis"),
  propertyAsset("editorial/ramadan-repas-familial.png", "Famille réunie autour d’un repas de Ramadan", "Le repas partagé en famille"),
  propertyAsset("editorial/hanoucca-patisserie-famille.png", "Famille préparant des douceurs pour Hanoucca autour de l’îlot", "Les douceurs de Hanoucca"),
  propertyAsset("editorial/diwali-en-famille.png", "Famille célébrant Diwali dans le salon du Chai", "Diwali en famille"),
  propertyAsset("editorial/noel-cadeaux-en-famille.png", "Famille ouvrant les cadeaux de Noël dans le salon", "Noël réunit la famille"),
  propertyAsset("editorial/paques-patisserie-famille.png", "Parents et enfants préparant les douceurs de Pâques", "Pâques autour de l’îlot"),
  propertyAsset("editorial/halloween-en-famille.png", "Famille préparant Halloween dans la grande pièce de vie", "Halloween à la maison"),
  propertyAsset("editorial/fete-repas-famille-musulmane.png", "Famille musulmane réunie autour d’un repas de fête", "Une fête autour de la grande table"),
  propertyAsset("editorial/nouvel-an-entre-amis.png", "Amis de plusieurs générations célébrant le Nouvel An", "Passer la nouvelle année ensemble"),
  propertyAsset("editorial/anniversaire-enfant-chambre.png", "Une mère offrant un petit-déjeuner d’anniversaire à son enfant dans une chambre", "Un réveil d’anniversaire"),
];

const latestLivedMoments = [
  propertyAsset("editorial/petit-dejeuner-intergenerationnel.png", "Trois générations préparant un petit-déjeuner autour de l’îlot", "Le petit-déjeuner réunit les générations"),
  propertyAsset("editorial/jeu-pere-grand-pere-enfants.png", "Père, grand-père et enfants réunis autour d’un jeu dans le salon", "Une partie entre générations"),
  propertyAsset("editorial/parents-nourrisson-chambre.png", "Jeunes parents installant leur nourrisson dans une chambre équipée d’un lit bébé", "Les premiers séjours avec bébé"),
  propertyAsset("editorial/petit-dejeuner-au-lit-seniors.png", "Couple de seniors partageant un petit-déjeuner au lit dans une chambre", "Un matin tout en douceur"),
];

const arrival = [editorialGuestArrival, editorialBicycleArrival];

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
  editorialCourtyardMoment,
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
  editorialFamilyGameLived,
  editorialFriendsGame,
  editorialFamilyOuting,
  editorialBeachDeparture,
  editorialRemoteWork,
  newLivedMoments[3],
  newLivedMoments[6],
  newCelebrations[3],
  newCelebrations[4],
  newCelebrations[6],
  newCelebrations[8],
  latestLivedMoments[1],
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
    "De la cuisine à la grande table",
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
  propertyAsset(
    "editorial/cuisine-familiale.png",
    "Parents et enfant préparant un repas ensemble dans la cuisine du Chai",
    "La cuisine en famille",
  ),
  editorialFamilyBreakfast,
  newLivedMoments[0],
  newLivedMoments[1],
  newLivedMoments[2],
  newLivedMoments[4],
  newLivedMoments[7],
  newLivedMoments[8],
  newCelebrations[0],
  newCelebrations[1],
  newCelebrations[2],
  newCelebrations[5],
  newCelebrations[7],
  latestLivedMoments[0],
];

const bedrooms = [
  editorialBedroom,
  propertyAsset(
    "professional/chambre-pierre-bois-habillee.png",
    "Une chambre du Chai préparée avec du linge naturel entre pierre et bois",
    "Une chambre prête à accueillir",
  ),
  propertyAsset(
    "professional/chambre-bois-clair-habillee.png",
    "Une chambre lumineuse du Chai avec son lit soigneusement préparé",
    "Le calme du linge naturel",
  ),
  propertyAsset(
    "professional/chambre-suite-salle-eau-habillee.png",
    "Une chambre du Chai préparée avec soin et ouverte sur sa salle d’eau",
    "Le confort d’une suite prête à vivre",
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
  editorialQuietBedroom,
  editorialFamilyBedroom,
  editorialSeniorBedroom,
  editorialBabyBedroom,
  newLivedMoments[5],
  newCelebrations[9],
  latestLivedMoments[2],
  latestLivedMoments[3],
];

const bathrooms = [
  propertyAsset(
    "bathroom/authentique/salle-eau-complete.jpg",
    "Salle d’eau du Chai avec vasque en bois, miroir éclairé et douche minérale",
    "La salle d’eau dans son ensemble",
  ),
  propertyAsset(
    "bathroom/authentique/douche-minerale.jpg",
    "Douche à l’italienne du Chai avec parois minérales et robinetterie bronze",
    "La douche minérale",
  ),
  propertyAsset(
    "bathroom/authentique/vasque-toilettes.jpg",
    "Vasque contemporaine, miroir éclairé et toilettes dans la salle d’eau du Chai",
    "Le confort de la salle d’eau",
  ),
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
  editorialWelcomeShower,
  editorialBabyBathroom,
];

const utilities = [
  propertyAsset(
    "utilities/toilettes.jpeg",
    "Toilettes indépendantes du Chai des Tortues avec décoration murale",
    "Les toilettes indépendantes",
  ),
  propertyAsset(
    "utilities/buanderie.jpeg",
    "Buanderie du Chai des Tortues avec lave-linge séchant",
    "La buanderie et ses équipements",
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
const beachTerrace: MediaAsset = {
  ...destinationMedia.oceanBreakfast,
  caption: "Une pause face à l’océan",
};
const pastries = destinationAsset(
  "viennoiseries.jpeg",
  "Viennoiseries artisanales",
  "Les matins gourmands",
);

const propertyGallery = [
  // Ouverture et arrivée
  hero,
  editorialGuestArrival,
  editorialBicycleArrival,
  exterior[2],
  exterior[3],
  exterior[1],
  editorialMorningCoffee,
  editorialCourtyardMoment,

  // Pièce de vie
  livingRoom[1],
  livingRoom[2],
  livingRoom[3],
  livingRoom[5],
  livingRoom[6],
  livingRoom[7],
  editorialAperitif,
  editorialFamilyGames,
  editorialFamilyGameLived,
  editorialFriendsGame,
  editorialMarketCouple,
  editorialFamilyCat,
  editorialCandlelightDinner,
  editorialMultigenerationalChristmas,
  editorialFamilyTable,
  editorialFamilyOuting,
  editorialBeachDeparture,
  editorialRemoteWork,

  // Cuisine et grande table
  kitchen[1],
  editorialIsland,
  kitchen[2],
  kitchen[3],
  kitchen[4],
  kitchen[5],
  kitchen[6],
  editorialCelebration,
  editorialChristmas,
  kitchen[9],
  editorialFamilyBreakfast,
  ...newLivedMoments,
  ...newCelebrations,
  ...latestLivedMoments,

  // Chambres
  bedrooms[2],
  bedrooms[3],
  bedrooms[4],
  bedrooms[5],
  editorialBedroom,
  editorialQuietBedroom,
  editorialFamilyBedroom,
  editorialSeniorBedroom,
  editorialBabyBedroom,

  // Salles d’eau
  bathrooms[0],
  bathrooms[1],
  bathrooms[2],
  bathrooms[3],
  bathrooms[4],
  bathrooms[5],
  bathrooms[6],
  bathrooms[7],
  bathrooms[8],
  editorialWelcomeShower,
  editorialBabyBathroom,

  // Espaces pratiques
  utilities[0],
  utilities[1],

  // Matières et détails
  details[0],
  details[1],
  details[2],
  details[3],
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
  bathrooms: [...bathrooms, utilities[0]],
  terrace: [editorialMorningCoffee],
  details: [...details, utilities[1]],
  lifestyle: [
    editorialMarketCouple,
    editorialFamilyCat,
    editorialCandlelightDinner,
    editorialMultigenerationalChristmas,
    editorialFamilyTable,
    ...newLivedMoments,
    bicycle,
    port,
    destinationMedia.food,
    beachTerrace,
    pastries,
    destinationMedia.village,
    destinationMedia.reBridgeSunsetBike,
    destinationMedia.beach,
  ],
  videos: [
    {
      src: "/videos/chai-des-tortues-film-sans-son.mp4",
      alt: "Visite vidéo du Chai des Tortues",
      caption: "Le Chai des Tortues, de la pierre à la lumière",
      poster: hero.src,
      scope: "property",
      owner: "chai-des-tortues",
    },
    {
      src: "/videos/chai-des-tortues-chambre-1-sans-son.mp4",
      alt: "Visite vidéo d’une première chambre du Chai des Tortues",
      caption: "Une chambre du Chai, entre bois clair et douceur marine",
      poster: bedrooms[1].src,
      scope: "property",
      owner: "chai-des-tortues",
    },
    {
      src: "/videos/chai-des-tortues-chambre-2-sans-son.mp4",
      alt: "Visite vidéo d’une seconde chambre du Chai des Tortues",
      caption: "Une seconde chambre du Chai et ses détails inspirés de l’océan",
      poster: bedrooms[2].src,
      scope: "property",
      owner: "chai-des-tortues",
    },
  ],
  gallery: [
    ...propertyGallery,
    // L’Île de Ré autour de la maison
    bicycle,
    port,
    beachTerrace,
  ],
  editorial: {
    breakfast: editorialFamilyBreakfast,
    aperitif: editorialAperitif,
    market: editorialIsland,
    seafood: destinationMedia.food,
    family: editorialFamilyGames,
    pets: newLivedMoments[6],
    beach: destinationMedia.beach,
    cycling: bicycle,
    kitchen: kitchen[1],
    story: exterior[0],
    stone: details[1],
  },
} satisfies PropertyMediaManifest;
