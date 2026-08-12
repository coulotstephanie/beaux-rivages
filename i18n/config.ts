export const supportedLocales = ["fr", "en", "de", "es", "nl"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export const productionLocales: SupportedLocale[] = ["fr", "en", "de", "es", "nl"];
export const defaultLocale: SupportedLocale = "fr";
export const localeLabels: Record<SupportedLocale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
  nl: "Nederlands",
};
export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}
