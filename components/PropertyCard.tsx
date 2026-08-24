import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

type PropertyCardProps = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  location: string;
  facts?: { value: string; label: string }[];
  bookingHref?: string;
  locale?: SupportedLocale;
};

export function PropertyCard({
  title,
  subtitle,
  href,
  image,
  location,
  facts = [],
  bookingHref,
  locale = "fr",
}: PropertyCardProps) {
  return (
    <article className="property-card premium-property-card">
      <Link href={localizedHref(locale, href)} className="property-image" aria-label={`${tr(locale, "Découvrir")} ${title}`}>
        <Image
          src={image}
          alt={`${tr(locale, "Découvrir")} ${title}`}
          fill
          quality={88}
          loading="lazy"
          sizes="(max-width: 900px) calc(100vw - 32px), (max-width: 1400px) 33vw, 400px"
          className="property-image__media"
        />
        <span className="property-image__shade" />
        <Badge light>{location}</Badge>
        <span className="property-card__arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="property-copy">
        <p className="eyebrow">{tr(locale, "Maison Beaux Rivages")}</p>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <div className="property-card__footer">
          {facts.length > 0 ? (
            <ul
              className="property-card__facts"
              aria-label={`${tr(locale, "Informations essentielles")} — ${title}`}
            >
              {facts.map((fact) => (
                <li key={fact.label}>
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="property-card__actions">
            <Link href={localizedHref(locale, href)} className="text-link">
              {tr(locale, "Découvrir")} <span aria-hidden="true">→</span>
            </Link>
            {bookingHref ? <Link href={localizedHref(locale, bookingHref)}>{tr(locale, "Réserver")}</Link> : null}
          </div>
        </div>
      </div>
    </article>
  );
}
