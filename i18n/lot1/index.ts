import { lot1Catalog } from "./catalog";
import { lot1Content } from "./content";
import { lot1Locales, type Lot1Locale } from "./types";

export const lot1Entries = { ...lot1Catalog, ...lot1Content };
export type Lot1Key = keyof typeof lot1Entries;

export const lot1ByLocale = Object.fromEntries(
  lot1Locales.map((locale) => [
    locale,
    Object.fromEntries(Object.entries(lot1Entries).map(([key, entry]) => [key, entry[locale]])),
  ]),
) as Record<Lot1Locale, Record<Lot1Key, string>>;

export function lot1Translate(
  locale: Lot1Locale,
  key: Lot1Key,
  variables: Record<string, string | number> = {},
) {
  return Object.entries(variables).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    lot1ByLocale[locale][key],
  );
}
