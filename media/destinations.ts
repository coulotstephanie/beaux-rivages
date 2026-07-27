import type { MediaAsset } from "./types";

const destinationAsset = (file: string, alt: string, caption?: string): MediaAsset => ({
  src: `/images/destination/${file}`,
  alt,
  caption,
  scope: "destination",
});

export const destinationMedia = {
  sea: destinationAsset("bateau-calme.jpeg", "Bateau sur le littoral atlantique", "Le calme de l’Atlantique"),
  food: destinationAsset("huitres-vin-blanc.jpg", "Huîtres et vin blanc face à l’eau", "Les saveurs de l’Atlantique"),
  marsh: destinationAsset("marais-coucher-soleil.jpeg", "Marais au coucher du soleil", "La lumière sur les marais"),
  beach: destinationAsset("plage-ganivelles.jpeg", "Plage sauvage derrière les ganivelles", "Les plages des îles"),
  bridge: destinationAsset("pont-ile-de-re-rose.jpg", "Pont de l’Île de Ré sous un ciel rose", "Le pont dans la lumière"),
  lane: destinationAsset("ruelle.jpeg", "Ruelle insulaire fleurie", "Les villages à parcourir"),
  salt: destinationAsset("saunier.jpeg", "Saunier dans les marais salants", "Les savoir-faire des îles"),
  village: destinationAsset("village-fleuri.jpeg", "Village fleuri de l’Île de Ré", "L’art de vivre dans les villages"),
  saintMartinPort: destinationAsset("guide-port-saint-martin.jpg", "Port de Saint-Martin-de-Ré", "Le port au cœur des fortifications"),
  chassiron: destinationAsset("guide-phare-chassiron.jpg", "Pointe et phare de Chassiron", "Le nord sauvage d’Oléron"),
  laRochelleOldPort: destinationAsset("guide-vieux-port-la-rochelle.jpg", "Entrée du Vieux-Port de La Rochelle", "Les tours ouvrent la ville sur l’océan"),
  flowerDunes: destinationAsset("dunes-fleuries-barques.jpg", "Barques au pied de dunes couvertes de fleurs roses", "Les couleurs simples du littoral"),
  beachFishing: destinationAsset("peche-plage-atlantique.jpg", "Canne à pêche dressée face aux vagues de l’Atlantique", "Pêcher face au large"),
  familySunset: destinationAsset("famille-coucher-soleil.jpg", "Familles en silhouette au bord de l’océan au coucher du soleil", "Les derniers instants sur la plage"),
  morningSurf: destinationAsset("surf-matin.jpg", "Surfeur glissant sur une vague dans la lumière du matin", "L’Atlantique au réveil"),
  familyForeshore: destinationAsset("famille-estran.jpg", "Famille jouant sur la plage à marée basse", "L’estran comme terrain de jeu"),
  fortBoyard: destinationAsset("fort-boyard-depuis-plage.jpg", "Fort Boyard aperçu depuis la plage", "Fort Boyard à l’horizon"),
  oceanBreakfast: destinationAsset("petit-dejeuner-ocean.jpg", "Petit-déjeuner face à l’océan", "Le premier café face aux vagues"),
  beachPicnic: destinationAsset("pique-nique-plage.jpg", "Pique-nique sur la plage face à l’océan", "Une fin de journée sur le sable"),
} as const satisfies Record<string, MediaAsset>;
