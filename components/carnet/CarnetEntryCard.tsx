import Image from "next/image";
import Link from "next/link";
import type { CarnetEntry } from "@/carnetData";
import { Badge } from "@/components/ui";

export function CarnetEntryCard({ entry, featured = false }: { entry: CarnetEntry; featured?: boolean }) {
  const action = (
    <>Découvrir <span aria-hidden="true">↗</span></>
  );
  return (
    <article className={`carnet-entry-card${featured ? " is-featured" : ""}`}>
      <div className="carnet-entry-card__media">
        <Image
          src={entry.image}
          alt={entry.imageAlt}
          fill
          quality={88}
          loading="lazy"
          sizes={featured ? "(max-width: 800px) 100vw, 58vw" : "(max-width: 800px) 100vw, 38vw"}
        />
        <Badge light>{entry.category}</Badge>
      </div>
      <div className="carnet-entry-card__copy">
        <div className="carnet-entry-card__meta"><span>{entry.distance}</span><span>{entry.time}</span></div>
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
        <blockquote><span>Le conseil de Stéphanie & Bruno</span>« {entry.hostTip} »</blockquote>
        {entry.external ? (
          <a href={entry.href} target="_blank" rel="noreferrer" aria-label={`Découvrir ${entry.title} — nouvelle fenêtre`}>{action}</a>
        ) : (
          <Link href={entry.href}>{action}</Link>
        )}
      </div>
    </article>
  );
}
