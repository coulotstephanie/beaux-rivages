"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeLabels, supportedLocales, type SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, clientMessage } from "@/i18n/lot1-client";

const flags: Record<SupportedLocale, string> = { fr: "🇫🇷", en: "🇬🇧", de: "🇩🇪", es: "🇪🇸", nl: "🇳🇱" };
const prefixPattern = new RegExp(
  `^/(${supportedLocales.filter((locale) => locale !== "fr").join("|")})(?=/|$)`,
);

export function LanguageSelector({ locale }: { locale?: SupportedLocale }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = locale ?? (pathname.match(prefixPattern)?.[1] as SupportedLocale | undefined) ?? "fr";

  const select = (locale: SupportedLocale) => {
    const basePath = pathname.replace(prefixPattern, "") || "/";
    router.push(locale === "fr" ? basePath : `/${locale}${basePath === "/" ? "" : basePath}`);
  };

  return (
    <div className="language-selector" data-no-translate>
      <button
        className="language-selector__current"
        type="button"
        aria-label={clientMessage(active, "language.current", { language: localeLabels[active] })}
      >
        <span aria-hidden="true">{flags[active]}</span>
        <span>{localeLabels[active]}</span>
      </button>
      <div className="language-selector__menu" role="menu" aria-label={tr(active, "Choisir la langue")}>
        {supportedLocales.map((locale) => (
          <button
            type="button"
            role="menuitemradio"
            aria-checked={locale === active}
            key={locale}
            onClick={() => select(locale)}
          >
            <span aria-hidden="true">{flags[locale]}</span>
            <span>{localeLabels[locale]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
