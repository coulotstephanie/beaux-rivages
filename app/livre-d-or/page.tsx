import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { GuestBook } from "@/components/guestbook/GuestBook";
import { PageStructuredData } from "@/components/PageStructuredData";
import { initialGuestBookEntries } from "@/features/guestbook";
import { propertyMedia } from "@/media/properties";
import { createPageMetadata } from "@/seo";
import { staticPageSeo } from "@/content/fr/seo";
import { StructuredData } from "@/components/StructuredData";

const pageSeo = staticPageSeo["/livre-d-or"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: propertyMedia["chai-des-tortues"].hero.src,
});

export default function GuestBookPage() {
  return (
    <main className="guestbook-page">
      <PageStructuredData {...pageSeo} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Livre d’Or Beaux Rivages",
          numberOfItems: initialGuestBookEntries.length,
          itemListElement: initialGuestBookEntries.map((entry, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://www.beaux-rivages.com/livre-d-or#temoignage-${entry.id}`,
            item: {
              "@type": "CreativeWork",
              author: { "@type": "Person", name: entry.author },
              dateCreated: entry.date.length === 7 ? `${entry.date}-01` : entry.date,
              inLanguage: entry.language,
              text: entry.text,
              keywords: entry.tags.join(", "),
            },
          })),
        }}
      />
      <Header />
      <section className="page-hero guestbook-hero">
        <HeroBackground src={propertyMedia["chai-des-tortues"].hero.src} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content shell">
          <p className="eyebrow light">Le Livre d’Or</p>
          <h1>Les mots laissés avant de refermer la porte.</h1>
          <p>Des souvenirs manuscrits, retranscrits avec fidélité et publiés après validation.</p>
        </div>
      </section>
      <section className="guestbook-intro shell">
        <p className="eyebrow">Un carnet vivant</p>
        <h2>Chaque séjour laisse une trace singulière.</h2>
        <p>
          Ces mots proviennent des véritables Livres d’Or des maisons. Leur ton, leur langue et leur
          spontanéité sont préservés. Aucune transcription automatique n’est publiée sans une
          relecture humaine.
        </p>
      </section>
      <div className="shell">
        <GuestBook entries={initialGuestBookEntries} />
      </div>
      <Footer />
    </main>
  );
}
