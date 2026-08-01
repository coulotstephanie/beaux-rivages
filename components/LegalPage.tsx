import { Footer } from "./Footer";
import { Header } from "./Header";
import { StructuredData } from "./StructuredData";
import { unstable_noStore as noStore } from "next/cache";
import { legalUpdatedAt, legalVersion } from "@/content/legal";
import { getPublishedLegalDocument } from "@/platform/legal/documents";
import type { LegalDocument } from "@/platform/legal/documents";

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
        {document.sections.map(([title, body]) =>
          accordion ? (
            <details key={title}>
              <summary>{title}</summary>
              <p>{body}</p>
            </details>
          ) : (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ),
        )}
      </article>
      <Footer />
    </main>
  );
}
