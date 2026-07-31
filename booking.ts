import type { Property } from "./data";

export type BookingStep = 1 | 2 | 3 | 4;
export type GuestCounts = { adults: number; children: number; babies: number; pets: number };
export type AttentionType =
  "Anniversaire" | "Lune de miel" | "Demande en mariage" | "Anniversaire de mariage" | "Autre";
export type StayOptionId =
  | "signature"
  | "linen"
  | "beach-towels"
  | "robes"
  | "slippers"
  | "personal-arrival"
  | "late-checkout"
  | "pet"
  | "aperitif-basket"
  | "basket";
export type StayOption = {
  id: StayOptionId;
  label: string;
  description: string;
  price: number;
  unit?: string;
};
export type BookingExperienceId =
  "romance" | "anniversaire" | "lune-de-miel" | "fruits-de-mer" | "velo" | "famille";
export type BookingExperienceOption = {
  id: BookingExperienceId;
  label: string;
  description: string;
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
    price: 145,
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
    id: "late-checkout",
    label: "Départ tardif",
    description: "Profitez de quelques heures supplémentaires, selon disponibilité.",
    price: 55,
  },
  {
    id: "pet",
    label: "Animal",
    description: "Accueil d’un animal avec gamelles mises à disposition.",
    price: 25,
    unit: "par séjour",
  },
  {
    id: "aperitif-basket",
    label: "Panier apéritif",
    description: "Une sélection conviviale inspirée des producteurs et saveurs des îles.",
    price: 52,
  },
  {
    id: "basket",
    label: "Panier gourmand",
    description: "Une sélection de saison, salée ou sucrée, préparée pour votre arrivée.",
    price: 48,
  },
];

export const bookingExperiences: BookingExperienceOption[] = [
  {
    id: "romance",
    label: "Escapade romantique",
    description: "Pétales, lumière douce et deux flûtes préparées dans la chambre.",
    price: 75,
    duration: "À l’arrivée",
    propertySlugs: ["villa-raie-manta"],
  },
  {
    id: "anniversaire",
    label: "Anniversaire sur mesure",
    description: "Ballons, banderole et décoration accordée à l’âge et aux goûts.",
    price: 85,
    duration: "À l’arrivée",
  },
  {
    id: "lune-de-miel",
    label: "Lune de miel",
    description: "Champagne, pétales et attentions délicates dans l’intimité du Chai.",
    price: 110,
    duration: "Une soirée",
    propertySlugs: ["chai-des-tortues"],
  },
  {
    id: "fruits-de-mer",
    label: "Plateau de fruits de mer",
    description: "Une sélection de l’Atlantique prête à partager à la maison.",
    price: 95,
    duration: "Une soirée",
  },
  {
    id: "velo",
    label: "Échappée à vélo",
    description: "Itinéraire conseillé et vélos préparés selon disponibilité.",
    price: 60,
    duration: "Une journée",
  },
  {
    id: "famille",
    label: "Parenthèse en famille",
    description: "Jeux, petite surprise enfant et idées adaptées à la météo.",
    price: 45,
    duration: "Tout le séjour",
  },
];

export const attentions: AttentionType[] = [
  "Anniversaire",
  "Lune de miel",
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
    const multiplier = option.unit === "par voyageur" ? Math.max(1, payingGuests) : 1;
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
  if (selection.attention === "Lune de miel") suggestions.push("lune-de-miel");
  if (selection.attention === "Anniversaire" || selection.attention === "Anniversaire de mariage")
    suggestions.push("anniversaire");
  if (selection.guests.children > 0 || selection.guests.babies > 0) suggestions.push("famille");
  if (selection.propertySlug === "villa-raie-manta") suggestions.push("fruits-de-mer");
  if (selection.propertySlug === "chai-des-tortues") suggestions.push("velo");
  if (selection.guests.adults === 2 && selection.guests.children === 0) suggestions.push("romance");
  return [...new Set(suggestions)].filter((id) => !selection.experiences.includes(id)).slice(0, 3);
}
