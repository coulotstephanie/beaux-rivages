import type { SupportedLocale } from "./config";

const fr = {
  navigation: { houses: "Nos maisons", destinations: "Les îles", experiences: "Expériences", book: "Réserver" },
  actions: { discover: "Découvrir", continue: "Continuer", back: "Retour", addToStay: "Ajouter à mon séjour" },
} as const;

export type MessageCatalog = {
  navigation: { houses: string; destinations: string; experiences: string; book: string };
  actions: { discover: string; continue: string; back: string; addToStay: string };
};

const en: MessageCatalog = {
  navigation: { houses: "Our houses", destinations: "The islands", experiences: "Experiences", book: "Book" },
  actions: { discover: "Discover", continue: "Continue", back: "Back", addToStay: "Add to my stay" },
};
const de: MessageCatalog = {
  navigation: { houses: "Unsere Häuser", destinations: "Die Inseln", experiences: "Erlebnisse", book: "Buchen" },
  actions: { discover: "Entdecken", continue: "Weiter", back: "Zurück", addToStay: "Zum Aufenthalt hinzufügen" },
};
export const messages: Record<SupportedLocale, MessageCatalog> = { fr, en, de };
