import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui";

type PropertyCardProps = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  location: string;
};

export function PropertyCard({ title, subtitle, href, image, location }: PropertyCardProps) {
  return (
    <article className="property-card premium-property-card">
      <Link href={href} className="property-image" aria-label={`Découvrir ${title}`}>
        <Image src={image} alt={`Découvrir ${title}`} fill quality={88} loading="lazy" sizes="(max-width: 900px) calc(100vw - 32px), (max-width: 1400px) 33vw, 400px" className="property-image__media" />
        <span className="property-image__shade" />
        <Badge light>{location}</Badge>
        <span className="property-card__arrow" aria-hidden="true">↗</span>
      </Link>
      <div className="property-copy">
        <p className="eyebrow">Maison Beaux Rivages</p>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <Link href={href} className="text-link">Découvrir la maison <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
