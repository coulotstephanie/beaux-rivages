export type ReviewTheme = {
  label: string;
  count: number;
};

export type PropertyReviewProfile = {
  slug: string;
  property: string;
  island: string;
  airbnbRating: string;
  airbnbReviewCount: number;
  accolade?: string;
  summary: string;
  themes: ReviewTheme[];
  sourceUrl: string;
};

export const reviewProfiles: PropertyReviewProfile[] = [
  {
    slug: "chai-des-tortues",
    property: "Le Chai des Tortues",
    island: "Île de Ré",
    airbnbRating: "4,93",
    airbnbReviewCount: 46,
    accolade: "Coup de cœur voyageurs · parmi les 10 % de logements préférés",
    summary:
      "Les voyageurs retiennent d’abord l’hospitalité, la situation pratique entre plage et village, ainsi que le niveau d’équipement et le confort intérieur.",
    themes: [
      { label: "Hospitalité", count: 31 },
      { label: "Emplacement", count: 19 },
      { label: "Équipements", count: 14 },
      { label: "Espaces intérieurs", count: 13 },
      { label: "Propreté", count: 11 },
      { label: "Confort", count: 10 },
    ],
    sourceUrl: "https://www.airbnb.fr/rooms/1346326704165406766",
  },
  {
    slug: "villa-raie-manta",
    property: "Villa Raie Manta",
    island: "Île de Ré",
    airbnbRating: "4,84",
    airbnbReviewCount: 31,
    summary:
      "La communication, l’arrivée, la propreté et la proximité de la mer structurent l’expérience. La décoration et les volumes de la villa sont également souvent relevés.",
    themes: [
      { label: "Hospitalité", count: 17 },
      { label: "Emplacement", count: 13 },
      { label: "Équipements", count: 8 },
      { label: "Décoration", count: 7 },
      { label: "À proximité", count: 6 },
      { label: "Espaces intérieurs", count: 5 },
    ],
    sourceUrl: "https://www.airbnb.fr/rooms/1352690589369037929",
  },
  {
    slug: "nid-d-ete",
    property: "Le Nid d’Été",
    island: "Île d’Oléron",
    airbnbRating: "4,93",
    airbnbReviewCount: 121,
    accolade: "Coup de cœur voyageurs · parmi les 10 % de logements préférés",
    summary:
      "L’accès privé à la plage, l’emplacement face à Fort Boyard, l’hospitalité et le calme de la résidence ressortent très nettement des retours voyageurs.",
    themes: [
      { label: "Plage", count: 74 },
      { label: "Hospitalité", count: 73 },
      { label: "Emplacement", count: 71 },
      { label: "Espaces intérieurs", count: 31 },
      { label: "Propreté", count: 31 },
      { label: "Calme", count: 22 },
    ],
    sourceUrl: "https://www.airbnb.fr/rooms/1189663838436081529",
  },
];

export const totalAirbnbReviews = reviewProfiles.reduce(
  (total, profile) => total + profile.airbnbReviewCount,
  0,
);
