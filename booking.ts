import type { Property } from "./data";

export type BookingStep = 1 | 2 | 3 | 4;
export type GuestCounts = { adults: number; children: number; babies: number; pets: number };
export type AttentionType =
  "Anniversaire" | "Demande en mariage" | "Anniversaire de mariage" | "Autre";
export type StayOptionId =
  | "signature"
  | "linen"
  | "beach-towels"
  | "robes"
  | "slippers"
  | "personal-arrival"
  | "early-checkin"
  | "late-checkout"
  | "pet"
  | "aperitif-basket"
  | "basket"
  | "signature-aperitif"
  | "signature-sweet";
export type StayOption = {
  id: StayOptionId;
  label: string;
  description: string;
  price: number;
  unit?: string;
};
export type BookingExperienceId = "romance" | "anniversaire";
export type BookingExperienceOption = {
  id: BookingExperienceId;
  label: string;
  description: string;
  image: string;
  imageAlt: string;
  price: number;
  duration: string;
  propertySlugs?: string[];
};

export type BookingSelection = {
  propertySlug: string | null;
  arrival: string | null;
  departure: string | null;
  guests: GuestCounts;
  experiences: BookingExperienceId[];
  options: StayOptionId[];
  attention: AttentionType | null;
  attentionMessage: string;
};

export const SIGNATURE_PACK_BASE_PRICE = 145;
export const SIGNATURE_PACK_ADDITIONAL_GUEST_PRICE = 20;
export const SIGNATURE_PACK_IMAGE =
  "/images/destination/experiences/experience-signature-chai-authentique.jpg";

/**
 * Unique pricing rule for the Pack Signature.
 * Babies are deliberately excluded: only adults and children are paying guests.
 */
export function calculateSignaturePackPrice(guests: Pick<GuestCounts, "adults" | "children">) {
  const payingGuests = Math.max(0, guests.adults) + Math.max(0, guests.children);
  return (
    SIGNATURE_PACK_BASE_PRICE +
    Math.max(0, payingGuests - 2) * SIGNATURE_PACK_ADDITIONAL_GUEST_PRICE
  );
}

export type BookingPropertyDetails = {
  beachDistance: string;
  atmosphere: string;
  estimatedNightlyRate: number;
};

export const bookingPropertyDetails: Record<string, BookingPropertyDetails> = {
  "chai-des-tortues": {
    beachDistance: "Plage à 250 m",
    atmosphere: "Authenticité, patrimoine et convivialité",
    estimatedNightlyRate: 245,
  },
  "villa-raie-manta": {
    beachDistance: "Océan à quelques pas",
    atmosphere: "Vue mer, design et lumière",
    estimatedNightlyRate: 365,
  },
  "nid-d-ete": {
    beachDistance: "Portail plage à 20 m",
    atmosphere: "Nature, plage et sérénité",
    estimatedNightlyRate: 225,
  },
};

export const stayOptions: StayOption[] = [
  {
    id: "signature",
    label: "Pack Signature Beaux Rivages",
    description:
      "Lits préparés, serviettes plage, deux peignoirs, panier et attention personnalisée.",
    price: SIGNATURE_PACK_BASE_PRICE,
  },
  {
    id: "linen",
    label: "Linge complet et lits faits",
    description:
      "Forfait par séjour : linge de lit complet, lits faits à l’arrivée, serviettes de toilette, tapis de bain, essuie-mains et torchons de cuisine. Une éponge neuve est également fournie dans les maisons de l’Île de Ré.",
    price: 20,
    unit: "par voyageur et par séjour",
  },
  {
    id: "beach-towels",
    label: "Serviettes de plage",
    description: "Une serviette par voyageur pour les journées au bord de l’océan.",
    price: 8,
    unit: "par voyageur",
  },
  {
    id: "robes",
    label: "Peignoirs",
    description: "Deux peignoirs doux préparés dans la maison.",
    price: 24,
  },
  {
    id: "slippers",
    label: "Chaussons",
    description: "Des chaussons de bain pour votre séjour.",
    price: 12,
  },
  {
    id: "personal-arrival",
    label: "Arrivée personnalisée",
    description: "Une mise en scène adaptée à votre séjour et à votre heure d’arrivée.",
    price: 35,
  },
  {
    id: "early-checkin",
    label: "Arrivée anticipée (sur demande)",
    description:
      "Étudiée individuellement selon les disponibilités, le calendrier des réservations et l’organisation du ménage. Elle n’est jamais garantie automatiquement.",
    price: 55,
  },
  {
    id: "late-checkout",
    label: "Départ tardif (sur demande)",
    description:
      "Étudié individuellement selon les disponibilités, le planning des réservations et l’organisation du ménage. Il n’est jamais garanti automatiquement.",
    price: 55,
  },
  {
    id: "pet",
    label: "Animal",
    description: "Accueil d’un animal, gamelles et guide des balades de Stéphanie & Bruno.",
    price: 25,
    unit: "par animal et par séjour",
  },
  {
    id: "aperitif-basket",
    label: "Panier Apéritif Beaux Rivages",
    description:
      "Vin Pelletier de l’Île de Ré, biscuits apéritifs artisanaux, terrine et carte des producteurs.",
    price: 45,
  },
  {
    id: "basket",
    label: "Panier Douceur Beaux Rivages",
    description:
      "Biscuits artisanaux, confiture locale, caramels au beurre salé, jus de fruits et carte des producteurs.",
    price: 45,
  },
  {
    id: "signature-aperitif",
    label: "Panier inclus · Panier Apéritif Beaux Rivages",
    description: "Panier de bienvenue inclus dans l’Expérience Signature.",
    price: 0,
  },
  {
    id: "signature-sweet",
    label: "Panier inclus · Panier Douceur Beaux Rivages",
    description: "Panier de bienvenue inclus dans l’Expérience Signature.",
    price: 0,
  },
];

export const bookingExperiences: BookingExperienceOption[] = [
  {
    id: "romance",
    label: "Expérience Romance Signature",
    description:
      "Ambiance romantique, boisson au choix, gourmandises, peignoirs et attention personnalisée.",
    image: "/images/properties/villa-raie-manta/editorial/chambre-romance.webp",
    imageAlt: "Chambre préparée avec des pétales pour l’Expérience Romance Signature",
    price: 149,
    duration: "À l’arrivée",
    propertySlugs: ["villa-raie-manta"],
  },
];

export function isExperienceAvailableForProperty(
  experienceId: BookingExperienceId,
  propertySlug: string | null,
) {
  const experience = bookingExperiences.find((item) => item.id === experienceId);
  return Boolean(
    experience &&
    (!experience.propertySlugs ||
      (propertySlug !== null && experience.propertySlugs.includes(propertySlug))),
  );
}

export const attentions: AttentionType[] = [
  "Anniversaire",
  "Demande en mariage",
  "Anniversaire de mariage",
  "Autre",
];

export function getNights(arrival: string | null, departure: string | null) {
  if (!arrival || !departure) return 0;
  return Math.max(
    0,
    Math.round(
      (new Date(`${departure}T12:00:00`).getTime() - new Date(`${arrival}T12:00:00`).getTime()) /
        86_400_000,
    ),
  );
}

export function getBookingEstimate(selection: BookingSelection, property: Property | undefined) {
  const nights = getNights(selection.arrival, selection.departure);
  const nightlyRate = property ? bookingPropertyDetails[property.slug].estimatedNightlyRate : 0;
  const payingGuests = selection.guests.adults + selection.guests.children;
  const optionsTotal = selection.options.reduce((total, id) => {
    const option = stayOptions.find((item) => item.id === id);
    if (!option) return total;
    const multiplier =
      option.id === "pet"
        ? Math.max(1, selection.guests.pets)
        : option.unit?.startsWith("par voyageur")
          ? Math.max(1, payingGuests)
          : 1;
    return total + option.price * multiplier;
  }, 0);
  const experiencesTotal = selection.experiences.reduce(
    (total, id) => total + (bookingExperiences.find((item) => item.id === id)?.price ?? 0),
    0,
  );
  return {
    nights,
    nightlyRate,
    accommodation: nights * nightlyRate,
    optionsTotal,
    experiencesTotal,
    total: nights * nightlyRate + optionsTotal + experiencesTotal,
  };
}

export function getBookingSuggestions(selection: BookingSelection) {
  const suggestions: BookingExperienceId[] = [];
  if (selection.guests.adults === 2 && selection.guests.children === 0) suggestions.push("romance");
  return [...new Set(suggestions)]
    .filter(
      (id) =>
        !selection.experiences.includes(id) &&
        isExperienceAvailableForProperty(id, selection.propertySlug),
    )
    .slice(0, 3);
}
