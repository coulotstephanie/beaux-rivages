import { Footer } from "./Footer";
import { Header } from "./Header";
import { StructuredData } from "./StructuredData";
import { unstable_noStore as noStore } from "next/cache";
import { legalUpdatedAt, legalVersion } from "@/content/legal";
import { getPublishedLegalDocument } from "@/platform/legal/documents";
import type { LegalDocument } from "@/platform/legal/documents";
import { getServerLocale, localize } from "@/i18n/server";

const securityDepositLegalCopy = new Set([
  "6. Caution",
  "Comment fonctionne la caution ?",
  "Aucun dépôt de garantie n’est demandé.",
  "Aucun dépôt de garantie n’est demandé au locataire. Le locataire demeure néanmoins responsable des dommages, dégradations ou pertes qui lui sont imputables et qui seraient constatés pendant ou à l’issue du séjour, sur présentation des éléments justificatifs correspondants.",
]);

function localizeSecurityDepositCopy(
  locale: Awaited<ReturnType<typeof getServerLocale>>,
  copy: string,
) {
  return securityDepositLegalCopy.has(copy) ? localize(locale, copy) : copy;
}

export async function LegalPage({
  document: fallback,
  path,
  accordion = false,
}: {
  document: LegalDocument;
  path: string;
  accordion?: boolean;
}) {
  noStore();
  const locale = await getServerLocale();
  const published = await getPublishedLegalDocument(path, fallback);
  const document = published.document;
  const displayedVersion = published.version ?? legalVersion;
  const displayedDate = published.effectiveFrom
    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
        new Date(`${published.effectiveFrom}T12:00:00`),
      )
    : legalUpdatedAt;
  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: document.title,
          description: document.description,
          url: `https://www.beaux-rivages.com${path}`,
          dateModified: published.effectiveFrom ?? "2026-08-01",
        }}
      />
      <Header contrast="dark" />
      <article className="legal-page shell">
        <header>
          <p className="eyebrow">Informations légales</p>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
          <small>
            Version {displayedVersion} · mise à jour le {displayedDate}
          </small>
        </header>
        {document.sections.map(([title, body]) => {
          const displayedTitle = localizeSecurityDepositCopy(locale, title);
          const displayedBody = localizeSecurityDepositCopy(locale, body);
          return accordion ? (
            <details key={title}>
              <summary>{displayedTitle}</summary>
              <p>{displayedBody}</p>
            </details>
          ) : (
            <section key={title}>
              <h2>{displayedTitle}</h2>
              <p>{displayedBody}</p>
            </section>
          );
        })}
      </article>
      <Footer />
    </main>
  );
}
