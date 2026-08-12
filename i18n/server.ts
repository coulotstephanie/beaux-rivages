import "server-only";
import { headers } from "next/headers";
import de from "./translations/de.json";
import en from "./translations/en.json";
import es from "./translations/es.json";
import nl from "./translations/nl.json";
import { isSupportedLocale, type SupportedLocale } from "./config";
import { lot1Entries, type Lot1Key } from "./lot1";

const legacy = { fr: {}, en, de, es, nl } as const;
const brands = ["Beaux Rivages", "Villa Raie Manta", "Le Chai des Tortues", "Le Nid d’Été"];

export async function getServerLocale(): Promise<SupportedLocale> {
  const value = (await headers()).get("x-beaux-rivages-locale") ?? "fr";
  return isSupportedLocale(value) ? value : "fr";
}

export function localize(locale: SupportedLocale, source: string) {
  if (locale === "fr") return source;
  const structured = Object.values(lot1Entries).find((entry) => entry.fr === source)?.[locale];
  let value = structured ?? (legacy[locale] as Record<string, string>)[source] ?? source;
  for (const brand of brands) {
    const alias = (legacy[locale] as Record<string, string>)[brand];
    if (alias && alias !== brand) value = value.replaceAll(alias, brand);
  }
  return value;
}

export function message(
  locale: SupportedLocale,
  key: Lot1Key,
  variables: Record<string, string | number> = {},
) {
  return Object.entries(variables).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    lot1Entries[key][locale],
  );
}

export function localizeDeep<T>(locale: SupportedLocale, value: T): T {
  if (typeof value === "string") return localize(locale, value) as T;
  if (Array.isArray(value)) return value.map((item) => localizeDeep(locale, item)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeDeep(locale, item)]),
    ) as T;
  return value;
}
