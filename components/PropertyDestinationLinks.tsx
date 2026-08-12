import Link from "next/link";
import type { Property } from "@/data";
import { properties } from "@/data";
import { Container } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, clientLocalizeDeep as localizeDeep, localizedHref } from "@/i18n/lot1-client";

const destinationByProperty: Record<string, { href: string; label: string; copy: string }> = {
  "chai-des-tortues": { href: "/destinations/ile-de-re", label: "Guide de l’Île de Ré", copy: "Rivedoux, ses Halles, les pistes cyclables et les villages blancs." },
  "villa-raie-manta": { href: "/destinations/ile-de-re", label: "Guide de l’Île de Ré", copy: "Depuis Rivedoux, rejoindre les plages, les marais et Saint-Martin." },
  "nid-d-ete": { href: "/destinations/ile-d-oleron", label: "Guide de l’Île d’Oléron", copy: "Boyardville, son marché, les Saumonards et la forêt à quelques pas." },
};

export function PropertyDestinationLinks({ property, locale = "fr" }: { property: Property; locale?: SupportedLocale }) {
  const destination = localizeDeep(locale, destinationByProperty[property.slug]);
  const related = localizeDeep(locale, properties.filter((item) =>
    item.slug !== property.slug
    && item.location.split(" · ")[1] === property.location.split(" · ")[1]
  ));
  return (
    <section className="property-connections" aria-labelledby="property-connections-title">
      <Container>
        <p className="eyebrow">{tr(locale, "Prolonger la découverte")}</p>
        <h2 id="property-connections-title">{tr(locale, "De la maison à sa destination.")}</h2>
        <div>
          <Link href={localizedHref(locale, destination.href)}><small>{tr(locale, "Explorer autour de la maison")}</small><strong>{destination.label}</strong><span>{destination.copy}</span></Link>
          {related.map((item) => (
            <Link href={localizedHref(locale, `/maisons/${item.slug}`)} key={item.slug}><small>{tr(locale, "Une autre maison sur la même île")}</small><strong>{item.title}</strong><span>{item.location}</span></Link>
          ))}
          <Link href={localizedHref(locale, "/carnet")}><small>{tr(locale, "Les conseils de Stéphanie & Bruno")}</small><strong>{tr(locale, "Le Carnet Beaux Rivages")}</strong><span>{tr(locale, "Marchés, producteurs, plages et bonnes adresses.")}</span></Link>
        </div>
      </Container>
    </section>
  );
}
