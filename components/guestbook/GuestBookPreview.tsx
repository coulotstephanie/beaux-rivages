import Link from "next/link";
import { initialGuestBookEntries } from "@/features/guestbook";
import { GuestBook } from "./GuestBook";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, clientLocalizeDeep as localizeDeep, localizedHref } from "@/i18n/lot1-client";

export function GuestBookPreview({ locale = "fr" }: { locale?: SupportedLocale }) {
  const entries = localizeDeep(locale, initialGuestBookEntries.filter((entry) => entry.featured).slice(0, 5));
  return (
    <section className="guestbook-preview">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{tr(locale, "Le Livre d’Or du Chai")}</p>
            <h2>{tr(locale, "Les mots laissés avant de refermer la porte.")}</h2>
          </div>
          <p>{tr(locale, "Des souvenirs manuscrits, conservés dans leur ton d’origine.")}</p>
        </div>
        <GuestBook entries={entries} compact locale={locale} />
        <Link className="primary-button" href={localizedHref(locale, "/livre-d-or")}>
          {tr(locale, "Voir tout le Livre d’Or")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
