import de from "./translations/de.json";
import en from "./translations/en.json";
import es from "./translations/es.json";
import nl from "./translations/nl.json";
import { lot1Entries, type Lot1Key } from "./lot1";
import type { SupportedLocale } from "./config";

const legacy = { fr: {}, en, de, es, nl } as const;
export function clientLocalize(locale: SupportedLocale, source: string) {
  if (locale === "fr") return source;
  return (
    Object.values(lot1Entries).find((entry) => entry.fr === source)?.[locale] ??
    (legacy[locale] as Record<string, string>)[source] ??
    source
  );
}
export function clientLocalizeDeep<T>(locale: SupportedLocale, value: T): T {
  if (typeof value === "string") return clientLocalize(locale, value) as T;
  if (Array.isArray(value)) return value.map((item) => clientLocalizeDeep(locale, item)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, clientLocalizeDeep(locale, item)]),
    ) as T;
  return value;
}
export function clientMessage(
  locale: SupportedLocale,
  key: Lot1Key,
  variables: Record<string, string | number> = {},
) {
  return Object.entries(variables).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    lot1Entries[key][locale],
  );
}
export function localizedHref(locale: SupportedLocale, href: string) {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/api/") ||
    href.startsWith("/administration")
  )
    return href;
  const base = href.replace(/^\/(?:en|de|es|nl)(?=\/|$)/, "") || "/";
  return locale === "fr" ? base : `/${locale}${base === "/" ? "" : base}`;
}
