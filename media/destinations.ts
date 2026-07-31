import type { MediaAsset } from "./types";

const destinationAsset = (file: string, alt: string, caption?: string): MediaAsset => ({
  src: `/images/destination/${file}`,
  alt,
  caption,
  scope: "destination",
});

export const destinationMedia = {
  sea: destinationAsset(
    "bateau-calme.jpeg",
    "Bateau sur le littoral atlantique",
    "Le calme de l’Atlantique",
  ),
  food: destinationAsset(
    "huitres-vin-blanc.jpg",
    "Huîtres et vin blanc face à l’eau",
    "Les saveurs de l’Atlantique",
  ),
  marsh: destinationAsset(
    "marais-coucher-soleil.jpeg",
    "Marais au coucher du soleil",
    "La lumière sur les marais",
  ),
  beach: destinationAsset(
    "plage-ganivelles.jpeg",
    "Plage sauvage derrière les ganivelles",
    "Les plages des îles",
  ),
  bridge: destinationAsset(
    "pont-ile-de-re-rose.jpg",
    "Pont de l’Île de Ré sous un ciel rose",
    "Le pont dans la lumière",
  ),
  lane: destinationAsset("ruelle.jpeg", "Ruelle insulaire fleurie", "Les villages à parcourir"),
  salt: destinationAsset(
    "saunier.jpeg",
    "Saunier dans les marais salants",
    "Les savoir-faire des îles",
  ),
  village: destinationAsset(
    "village-fleuri.jpeg",
    "Village fleuri de l’Île de Ré",
    "L’art de vivre dans les villages",
  ),
  saintMartinPort: destinationAsset(
    "guide-port-saint-martin.jpg",
    "Port de Saint-Martin-de-Ré",
    "Le port au cœur des fortifications",
  ),
  chassiron: destinationAsset(
    "guide-phare-chassiron.jpg",
    "Pointe et phare de Chassiron",
    "Le nord sauvage d’Oléron",
  ),
  laRochelleOldPort: destinationAsset(
    "guide-vieux-port-la-rochelle.jpg",
    "Entrée du Vieux-Port de La Rochelle",
    "Les tours ouvrent la ville sur l’océan",
  ),
  flowerDunes: destinationAsset(
    "dunes-fleuries-barques.jpg",
    "Barques au pied de dunes couvertes de fleurs roses",
    "Les couleurs simples du littoral",
  ),
  beachFishing: destinationAsset(
    "peche-plage-atlantique.jpg",
    "Canne à pêche dressée face aux vagues de l’Atlantique",
    "Pêcher face au large",
  ),
  familySunset: destinationAsset(
    "famille-coucher-soleil.jpg",
    "Familles en silhouette au bord de l’océan au coucher du soleil",
    "Les derniers instants sur la plage",
  ),
  morningSurf: destinationAsset(
    "surf-matin.jpg",
    "Surfeur glissant sur une vague dans la lumière du matin",
    "L’Atlantique au réveil",
  ),
  familyForeshore: destinationAsset(
    "famille-estran.jpg",
    "Famille jouant sur la plage à marée basse",
    "L’estran comme terrain de jeu",
  ),
  fortBoyard: destinationAsset(
    "fort-boyard-depuis-plage.jpg",
    "Fort Boyard aperçu depuis la plage",
    "Fort Boyard à l’horizon",
  ),
  fortBoyardAerial: destinationAsset(
    "oleron-authentique/fort-boyard-vue-aerienne.jpg",
    "Fort Boyard vu du ciel au milieu du pertuis d’Antioche",
    "Fort Boyard, entre Oléron et l’Île d’Aix",
  ),
  chassironPointAerial: destinationAsset(
    "oleron-authentique/phare-chassiron-pointe.jpg",
    "Pointe de Chassiron et son phare vus du ciel",
    "La pointe nord de l’Île d’Oléron",
  ),
  chassironGardensAerial: destinationAsset(
    "oleron-authentique/phare-chassiron-jardins.jpg",
    "Jardins en rose des vents autour du phare de Chassiron",
    "Les jardins du phare de Chassiron",
  ),
  chassironCoastAerial: destinationAsset(
    "oleron-authentique/phare-chassiron-cote.jpg",
    "Phare de Chassiron au bord de la côte rocheuse",
    "Chassiron face à l’Atlantique",
  ),
  oceanBreakfast: destinationAsset(
    "petit-dejeuner-ocean.jpg",
    "Petit-déjeuner face à l’océan",
    "Le premier café face aux vagues",
  ),
  beachPicnic: destinationAsset(
    "pique-nique-plage.jpg",
    "Pique-nique sur la plage face à l’océan",
    "Une fin de journée sur le sable",
  ),
  chassironBicycles: destinationAsset(
    "editorial/phare-chassiron-a-velo.png",
    "Vélos sur le chemin du phare de Chassiron dans la lumière du matin",
    "Chassiron au premier matin",
  ),
  saltMarshEvening: destinationAsset(
    "editorial/marais-salants-lumiere-du-soir.png",
    "Saunier dans les marais salants sous la lumière du soir",
    "Le soir sur les marais salants",
  ),
  fortBoyardPicnic: destinationAsset(
    "editorial/fort-boyard-pique-nique.png",
    "Panier de pique-nique sur la plage face à Fort Boyard",
    "Une échappée face à Fort Boyard",
  ),
  kiteFamily: destinationAsset(
    "editorial/famille-cerf-volant-chien.png",
    "Deux pères et leurs enfants faisant voler un cerf-volant avec leur chien sur la plage",
    "Le vent, le cerf-volant et les rires",
  ),
  sandcastleFamily: destinationAsset(
    "editorial/famille-monoparentale-chateau-sable.png",
    "Une mère, son enfant et son bébé construisant un château de sable",
    "Le château des vacances",
  ),
  familyPetanque: destinationAsset(
    "editorial/petanque-en-famille.png",
    "Grands-parents, parents et enfants réunis autour d’une partie de pétanque",
    "La partie qui réunit les générations",
  ),
  twoMothersPicnic: destinationAsset(
    "editorial/pique-nique-deux-mamans.png",
    "Deux mères et leurs enfants partageant un pique-nique avec leur chien face à l’océan",
    "Tous ensemble au bord de l’eau",
  ),
  familyBeachSnack: destinationAsset(
    "editorial/gouter-en-famille-sur-la-plage.png",
    "Plusieurs générations partageant un goûter avec un bébé et un chien sur la plage",
    "Le goûter face à l’Atlantique",
  ),
  childrenPlayingWithDog: destinationAsset(
    "editorial/enfants-jouent-avec-chien.png",
    "Des enfants jouant à la balle avec un chien sur la plage",
    "Courir ensemble sur le sable",
  ),
} as const satisfies Record<string, MediaAsset>;
