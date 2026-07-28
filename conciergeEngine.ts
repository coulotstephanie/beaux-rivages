export type TravelProfile = "couple" | "famille" | "amis" | "bebe" | "chien";
export type StayInterest = "plage" | "gastronomie" | "velo" | "nature" | "patrimoine" | "nautique" | "detente";
export type StayDuration = "court" | "semaine" | "long";

export type ConciergeSuggestion = {
  id: string;
  kind: "itineraire" | "plage" | "restaurant" | "producteur" | "marche" | "balade" | "conseil";
  title: string;
  description: string;
  href: string;
  profiles: TravelProfile[];
  interests: StayInterest[];
  minDays?: number;
};

export const profileLabels: Record<TravelProfile, string> = {
  couple: "En couple",
  famille: "En famille",
  amis: "Entre amis",
  bebe: "Avec bébé",
  chien: "Avec chien",
};

export const interestLabels: Record<StayInterest, string> = {
  plage: "Plage",
  gastronomie: "Gastronomie",
  velo: "Vélo",
  nature: "Nature",
  patrimoine: "Patrimoine",
  nautique: "Sports nautiques",
  detente: "Détente",
};

export const durationLabels: Record<StayDuration, string> = {
  court: "1 à 3 jours",
  semaine: "4 à 7 jours",
  long: "8 jours et plus",
};

const allProfiles = Object.keys(profileLabels) as TravelProfile[];

export const conciergeSuggestions: ConciergeSuggestion[] = [
  { id: "itineraire-lumiere", kind: "itineraire", title: "Une journée au rythme de la lumière", description: "Marché au réveil, vélo dans les marais, baignade en fin d’après-midi et dîner choisi dans le Carnet.", href: "/inspiration#journee-ideale", profiles: allProfiles, interests: ["plage", "velo", "nature", "gastronomie"], minDays: 1 },
  { id: "itineraire-grand-large", kind: "itineraire", title: "Trois jours entre Ré et l’océan", description: "Villages, producteurs, patrimoine et deux plages choisies selon le vent.", href: "/destinations/ile-de-re", profiles: ["couple", "famille", "amis"], interests: ["patrimoine", "gastronomie", "plage"], minDays: 3 },
  { id: "saumonards", kind: "plage", title: "Plage des Saumonards", description: "Une plage familiale tournée vers Fort Boyard, à choisir selon la marée et le vent.", href: "/carnet#plages", profiles: ["famille", "bebe", "couple"], interests: ["plage", "detente", "nature"] },
  { id: "rivedoux", kind: "plage", title: "Plage sud de Rivedoux", description: "Une rive douce du pertuis, souvent plus abritée quand l’ouest souffle.", href: "/destinations/ile-de-re", profiles: allProfiles, interests: ["plage", "nautique", "detente"] },
  { id: "table-locale", kind: "restaurant", title: "Une table choisie par Stéphanie & Bruno", description: "Cuisine de saison, accueil sincère et réservation conseillée avant votre arrivée.", href: "/carnet#gastronomie", profiles: allProfiles, interests: ["gastronomie", "detente"] },
  { id: "huitres", kind: "producteur", title: "Rencontrer un ostréiculteur", description: "Dégustation au bord d’un chenal et découverte d’un savoir-faire réglé par les marées.", href: "/carnet#producteurs", profiles: ["couple", "famille", "amis"], interests: ["gastronomie", "nature"] },
  { id: "marche", kind: "marche", title: "Le marché au réveil", description: "Un panier de produits locaux à rapporter dans la maison, avant que l’île ne s’anime.", href: "/carnet#marches", profiles: allProfiles, interests: ["gastronomie", "patrimoine"] },
  { id: "velo-marais", kind: "balade", title: "Les marais à vélo", description: "Une boucle plate et lumineuse, raccourcie pour les petites jambes et adaptée au sens du vent.", href: "/experiences/balade-velo", profiles: ["couple", "famille", "amis"], interests: ["velo", "nature"], minDays: 2 },
  { id: "poussette", kind: "balade", title: "Premiers pas face au pertuis", description: "Une promenade courte, praticable avec une poussette tout-terrain, avec une halte au calme.", href: "/carnet#familles", profiles: ["bebe"], interests: ["nature", "detente", "plage"] },
  { id: "chien", kind: "balade", title: "Forêt et sentiers avec votre chien", description: "Un parcours ombragé et des repères pratiques ; vérifiez les règles saisonnières des plages.", href: "/carnet#guides", profiles: ["chien"], interests: ["nature", "plage"] },
  { id: "nautique", kind: "balade", title: "Prendre le large", description: "Voile, paddle ou sortie accompagnée, sélectionnés selon la force et l’orientation du vent.", href: "/experiences", profiles: ["couple", "famille", "amis"], interests: ["nautique", "plage"] },
  { id: "conseil", kind: "conseil", title: "Gardez une journée libre", description: "Notre conseil : ne remplissez pas tout. La météo, une rencontre ou une lumière particulière feront le reste.", href: "/mot-de-stephanie", profiles: allProfiles, interests: Object.keys(interestLabels) as StayInterest[] },
];

const durationDays: Record<StayDuration, number> = { court: 2, semaine: 5, long: 9 };

export function buildConciergePlan(profile: TravelProfile, interests: StayInterest[], duration: StayDuration) {
  const selected = interests.length ? interests : (Object.keys(interestLabels) as StayInterest[]);
  return conciergeSuggestions
    .map((item) => ({
      item,
      score:
        (item.profiles.includes(profile) ? 4 : 0) +
        item.interests.filter((interest) => selected.includes(interest)).length * 3 +
        (item.minDays && durationDays[duration] >= item.minDays ? 1 : 0),
    }))
    .filter(({ item, score }) => score > 0 && (!item.minDays || durationDays[duration] >= item.minDays))
    .sort((a, b) => b.score - a.score)
    .reduce<ConciergeSuggestion[]>((items, { item }) => {
      if (items.some((candidate) => candidate.kind === item.kind) && items.length < 6) return items;
      return [...items, item];
    }, [])
    .slice(0, duration === "court" ? 5 : duration === "semaine" ? 7 : 9);
}
