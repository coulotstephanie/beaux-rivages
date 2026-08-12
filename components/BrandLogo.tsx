import Link from "next/link";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

type BrandLogoProps = { compact?: boolean; light?: boolean; locale?: SupportedLocale };

export function BrandLogo({ compact = false, light = false, locale = "fr" }: BrandLogoProps) {
  return (
    <Link href={localizedHref(locale, "/")} className={`brand-logo${compact ? " compact" : ""}${light ? " light" : ""}`}>
      <span className="sr-only">{tr(locale, "Accueil Beaux Rivages.")}</span>
      <svg className="brand-symbol" viewBox="0 0 120 110" aria-hidden="true">
        <g className="brand-monogram">
          <path d="M26 19V81M26 20H48C62 20 69 27 69 37C69 47 61 53 48 53H26M48 53C64 53 74 62 76 79" />
          <path className="brand-monogram__r" d="M52 20V81M52 20H69C82 20 89 27 89 37C89 47 81 53 69 53H52M69 53L91 81" />
          <path className="brand-monogram__horizon" d="M14 69C31 61 43 61 58 69C73 77 85 77 100 68" />
          <path className="brand-monogram__horizon brand-monogram__horizon--fine" d="M18 76C32 70 44 70 58 77C72 84 84 84 97 77" />
        </g>
      </svg>
      {!compact && (
        <span className="brand-wording">
          <strong>Beaux Rivages</strong>
          <small>{tr(locale, "Trois maisons · Deux îles · Une même passion")}</small>
        </span>
      )}
    </Link>
  );
}
