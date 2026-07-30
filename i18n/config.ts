export const supportedLocales = ["fr", "en", "de", "es"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export const productionLocales: SupportedLocale[] = ["fr", "en", "de", "es"];
export const defaultLocale: SupportedLocale = "fr";
export const localeLabels: Record<SupportedLocale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
};
export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}
