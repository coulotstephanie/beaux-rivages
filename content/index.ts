import * as fr from "./fr";
import type { Locale } from "./locales";

export { defaultLocale, isLocale, locales } from "./locales";
export type { Locale } from "./locales";

export const content = { fr } satisfies Record<Locale, typeof fr>;
