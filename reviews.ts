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
  verifiedQuotes?: {
    quote: string;
    author: string;
    platform: "Booking.com";
  }[];
  themes: ReviewTheme[];
  sourceUrl: string;
  otherSources?: {
    platform: "Booking.com" | "Abritel";
    rating?: string;
    scale?: 10 | 5;
    reviewCount?: number;
    sourceUrl: string;
  }[];
};

export const reviewsVerifiedOn = "31 juillet 2026";

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
    otherSources: [
      {
        platform: "Booking.com",
        rating: "9,3",
        scale: 10,
        reviewCount: 21,
        sourceUrl:
          "https://www.booking.com/hotel/fr/chai-renove-ile-de-re-250-m-de-la-plage-rivedoux-plage.fr.html",
      },
    ],
  },
  {
    slug: "villa-raie-manta",
    property: "Villa Raie Manta",
    island: "Île de Ré",
    airbnbRating: "4,84",
    airbnbReviewCount: 31,
    summary:
      "La vue mer, la propreté, le niveau d’équipement et les espaces pensés pour les familles structurent l’expérience. La disponibilité des hôtes et la proximité des commerces sont également souvent relevées.",
    verifiedQuotes: [
      {
        quote: "La maison est superbe, très bien équipée et offre un confort parfait.",
        author: "Karine",
        platform: "Booking.com",
      },
      {
        quote: "Très jolie maison dans le cœur de Rivedoux, face à la mer avec vue sur le pont.",
        author: "Erinyes83",
        platform: "Booking.com",
      },
      {
        quote: "Pour deux familles, la maison est idéale, avec deux espaces distincts.",
        author: "Olena",
        platform: "Booking.com",
      },
    ],
    themes: [
      { label: "Hospitalité", count: 17 },
      { label: "Emplacement", count: 13 },
      { label: "Équipements", count: 8 },
      { label: "Décoration", count: 7 },
      { label: "À proximité", count: 6 },
      { label: "Espaces intérieurs", count: 5 },
    ],
    sourceUrl: "https://www.airbnb.fr/rooms/1352690589369037929",
    otherSources: [
      {
        platform: "Booking.com",
        rating: "9,1",
        scale: 10,
        reviewCount: 30,
        sourceUrl:
          "https://www.booking.com/hotel/fr/maison-vue-mer-ile-de-re-rivedoux-plage.fr.html",
      },
    ],
  },
  {
    slug: "nid-d-ete",
    property: "Le Nid d’Été",
    island: "Île d’Oléron",
    airbnbRating: "4,93",
    airbnbReviewCount: 121,
    accolade: "Coup de cœur voyageurs · parmi les 10 % de logements préférés",
    summary:
      "L’accès privé à la plage, l’emplacement face à Fort Boyard, le calme et le confort de la résidence ressortent très nettement des retours voyageurs. L’équipement et la décoration de la maison sont également très appréciés.",
    verifiedQuotes: [
      {
        quote: "Agréable séjour au calme pour recharger les batteries.",
        author: "Catherine",
        platform: "Booking.com",
      },
      {
        quote: "Résidence très calme avec accès à une plage privée. Maison bien équipée.",
        author: "Marianne",
        platform: "Booking.com",
      },
      {
        quote: "Le confort, l’espace dans l’appartement et la situation à côté de la plage.",
        author: "Audrey",
        platform: "Booking.com",
      },
    ],
    themes: [
      { label: "Plage", count: 74 },
      { label: "Hospitalité", count: 73 },
      { label: "Emplacement", count: 71 },
      { label: "Espaces intérieurs", count: 31 },
      { label: "Propreté", count: 31 },
      { label: "Calme", count: 22 },
    ],
    sourceUrl: "https://www.airbnb.fr/rooms/1189663838436081529",
    otherSources: [
      {
        platform: "Booking.com",
        rating: "9,2",
        scale: 10,
        reviewCount: 15,
        sourceUrl:
          "https://www.booking.com/hotel/fr/maison-acces-plage-2-a-personnes-saint-georges-d-oleron.fr.html",
      },
    ],
  },
];

export const totalAirbnbReviews = reviewProfiles.reduce(
  (total, profile) => total + profile.airbnbReviewCount,
  0,
);

export const totalPublicPlatformReviews = reviewProfiles.reduce(
  (total, profile) =>
    total +
    profile.airbnbReviewCount +
    (profile.otherSources?.reduce((subtotal, source) => subtotal + (source.reviewCount ?? 0), 0) ??
      0),
  0,
);

export const weightedAirbnbRating = (
  reviewProfiles.reduce(
    (total, profile) =>
      total + Number(profile.airbnbRating.replace(",", ".")) * profile.airbnbReviewCount,
    0,
  ) / totalAirbnbReviews
)
  .toFixed(2)
  .replace(".", ",");
