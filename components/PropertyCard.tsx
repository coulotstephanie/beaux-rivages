import Link from "next/link";

type PropertyCardProps = {
  name: string;
  location: string;
  promise: string;
  image: string;
  href: string;
};

export function PropertyCard({ name, location, promise, image, href }: PropertyCardProps) {
  return (
    <article className="property-card">
      <div className="property-image" style={{ backgroundImage: `url('${image}')` }} aria-hidden="true" />
      <div className="property-copy">
        <p className="eyebrow">{location}</p>
        <h3>{name}</h3>
        <p>{promise}</p>
        <Link href={href}>Découvrir la maison <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
