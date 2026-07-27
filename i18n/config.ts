export const supportedLocales = ["fr", "en", "de"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export const productionLocales: SupportedLocale[] = ["fr"];
export const defaultLocale: SupportedLocale = "fr";
export const localeLabels: Record<SupportedLocale, string> = { fr: "Français", en: "English", de: "Deutsch" };
export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}
