import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui";

type PropertyCardProps = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  location: string;
  facts?: { value: string; label: string }[];
  bookingHref?: string;
};

export function PropertyCard({
  title,
  subtitle,
  href,
  image,
  location,
  facts = [],
  bookingHref,
}: PropertyCardProps) {
  return (
    <article className="property-card premium-property-card">
      <Link href={href} className="property-image" aria-label={`Découvrir ${title}`}>
        <Image
          src={image}
          alt={`Découvrir ${title}`}
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
        <p className="eyebrow">Maison Beaux Rivages</p>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        {facts.length > 0 ? (
          <ul className="property-card__facts" aria-label={`Informations essentielles — ${title}`}>
            {facts.map((fact) => (
              <li key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="property-card__actions">
          <Link href={href} className="text-link">
            Découvrir <span aria-hidden="true">→</span>
          </Link>
          {bookingHref ? <Link href={bookingHref}>Réserver</Link> : null}
        </div>
      </div>
    </article>
  );
}
