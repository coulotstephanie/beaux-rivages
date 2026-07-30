import type { SupportedLocale } from "./config";

export type TranslationCatalog = Record<string, string>;
export type PublishedLocale = Exclude<SupportedLocale, "fr">;

const loaders: Record<PublishedLocale, () => Promise<TranslationCatalog>> = {
  en: () => import("./translations/en.json").then((module) => module.default),
  de: () => import("./translations/de.json").then((module) => module.default),
  es: () => import("./translations/es.json").then((module) => module.default),
};

export function loadTranslations(locale: PublishedLocale) {
  return loaders[locale]();
}
