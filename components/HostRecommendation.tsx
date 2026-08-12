import Link from "next/link";
import { hostRecommendations } from "@/recommendations";
import { Heading, Section } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, clientLocalizeDeep as localizeDeep, localizedHref } from "@/i18n/lot1-client";

export function HostRecommendation({ slugs, fallback, locale = "fr" }: { slugs: string[]; fallback: { title: string; copy: string }; locale?: SupportedLocale }) {
  const recommendations = localizeDeep(locale, slugs
    .map((slug) => hostRecommendations.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3));

  return (
    <Section tone="sand" className="host-recommendations">
      <Heading
        eyebrow={tr(locale, "Les conseils de Stéphanie & Bruno")}
        title={fallback.title}
        description={fallback.copy}
      />
      {recommendations.length > 0 && (
        <div className="host-recommendations__grid">
          {recommendations.map((item) => (
            <article key={item.slug}>
              <p className="eyebrow">{item.category} · {item.location}</p>
              <h3>{item.name}</h3>
              <blockquote>« {item.hostNote} »</blockquote>
              <a href={item.website} target="_blank" rel="noreferrer">{tr(locale, "Voir l’adresse")} <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      )}
      <Link href={localizedHref(locale, "/carnet")} className="text-link">{tr(locale, "Explorer tout le Carnet Beaux Rivages")} <span aria-hidden="true">→</span></Link>
    </Section>
  );
}
