export const lot1Locales = ["fr", "en", "de", "es", "nl"] as const;
export type Lot1Locale = (typeof lot1Locales)[number];
export type Lot1Entry = {
  fr: string;
  en: string;
  de: string;
  es: string;
  nl: string;
  decision: "translate" | "preserve" | "already-correct" | "dynamic";
};
