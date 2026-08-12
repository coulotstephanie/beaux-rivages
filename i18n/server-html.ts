import de from "./translations/de.json";
import en from "./translations/en.json";
import es from "./translations/es.json";
import nl from "./translations/nl.json";
import type { SupportedLocale } from "./config";

type ServerLocale = Exclude<SupportedLocale, "fr">;
type Catalog = Record<string, string>;

const catalogs: Record<ServerLocale, Catalog> = { en, de, es, nl };
const protectedBrandNames = [
  "Beaux Rivages",
  "Villa Raie Manta",
  "Le Chai des Tortues",
  "Le Nid d’Été",
] as const;
const translatedBrandAliases: Record<ServerLocale, Record<string, string>> = {
  en: {
    "Beautiful Shores": "Beaux Rivages",
    "Villa Manta Ray": "Villa Raie Manta",
    "Manta Ray Villa": "Villa Raie Manta",
  },
  de: {
    "Schöne Ufer": "Beaux Rivages",
    "Villa Manta Ray": "Villa Raie Manta",
    "Manta Ray Villa": "Villa Raie Manta",
  },
  es: {
    "Hermosas orillas": "Beaux Rivages",
    "Villa Manta Ray": "Villa Raie Manta",
    "Villa Manta Raya": "Villa Raie Manta",
  },
  nl: {
    "Prachtige oevers": "Beaux Rivages",
    "Villa Manta Ray": "Villa Raie Manta",
    "Manta Ray Villa": "Villa Raie Manta",
    "Manta Ray-villa": "Villa Raie Manta",
    "Het zomernest": "Le Nid d’Été",
  },
};
const manual: Record<ServerLocale, Catalog> = {
  en: { Accueil: "Home" },
  de: { Accueil: "Startseite" },
  es: { Accueil: "Inicio" },
  nl: { Accueil: "Home" },
};

function replaceAll(value: string, source: string, target: string) {
  return source && source !== target ? value.split(source).join(target) : value;
}

function htmlEscaped(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function translateInitialHtml(html: string, locale: ServerLocale, pathname: string) {
  const catalog = { ...catalogs[locale], ...manual[locale] };
  protectedBrandNames.forEach((name) => {
    catalog[name] = name;
  });
  let translated = html;
  const entries = Object.entries(catalog)
    .filter(([source, target]) => source.trim() && source !== target)
    .sort(([left], [right]) => right.length - left.length);

  for (const [source, target] of entries) {
    translated = replaceAll(translated, source, target);
    translated = replaceAll(translated, htmlEscaped(source), htmlEscaped(target));
    translated = replaceAll(
      translated,
      JSON.stringify(source).slice(1, -1),
      JSON.stringify(target).slice(1, -1),
    );
  }

  // A longer translated sentence may contain a translated brand even though the
  // standalone brand entry is protected. Restore those immutable public names
  // after all catalogue substitutions.
  for (const name of protectedBrandNames) {
    const translatedName = catalogs[locale][name];
    if (translatedName && translatedName !== name) {
      translated = replaceAll(translated, translatedName, name);
      translated = replaceAll(translated, htmlEscaped(translatedName), htmlEscaped(name));
      translated = replaceAll(
        translated,
        JSON.stringify(translatedName).slice(1, -1),
        JSON.stringify(name).slice(1, -1),
      );
    }
  }
  for (const [alias, name] of Object.entries(translatedBrandAliases[locale])) {
    translated = replaceAll(translated, alias, name);
    translated = replaceAll(translated, htmlEscaped(alias), htmlEscaped(name));
    translated = replaceAll(
      translated,
      JSON.stringify(alias).slice(1, -1),
      JSON.stringify(name).slice(1, -1),
    );
  }

  const localizedUrl = `https://www.beaux-rivages.com/${locale}${pathname === "/" ? "" : pathname}`;
  translated = translated.replace(/<html lang="fr"/, `<html lang="${locale}"`);
  translated = translated.replace(/href="(\/[^"]*)"/g, (attribute, href: string) => {
    const path = href.split(/[?#]/, 1)[0];
    const firstSegment = path.split("/")[1];
    const excluded = new Set([
      "",
      "en",
      "de",
      "es",
      "nl",
      "api",
      "administration",
      "_next",
      "images",
      "videos",
      "icon.svg",
      "manifest.webmanifest",
      "robots.txt",
      "sitemap.xml",
    ]);
    return excluded.has(firstSegment) ? attribute : `href="/${locale}${href}"`;
  });
  translated = translated.replaceAll(`href="/${locale}/"`, `href="/${locale}"`);
  translated = translated.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${localizedUrl}"/>`,
  );
  translated = translated.replace(
    /(<meta property="og:url" content=")[^"]*("\s*\/?>)/,
    `$1${localizedUrl}$2`,
  );
  return translated;
}

export function missingCatalogEntries(locale: ServerLocale, sources: string[]) {
  const catalog = catalogs[locale];
  return sources.filter((source) => !catalog[source]?.trim());
}
