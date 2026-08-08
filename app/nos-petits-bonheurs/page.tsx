import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { StructuredData } from "@/components/StructuredData";
import { petitsBonheurs, type PetitBonheur } from "@/content/petitsBonheurs";
import { staticPageSeo } from "@/content/fr/seo";
import { CarnetRepository } from "@/features/carnet/repositories";
import { isDatabaseConfigured } from "@/platform/database/client";
import { absoluteUrl, createPageMetadata } from "@/seo";
import { DynamicCmsPage } from "@/components/cms/DynamicCmsPage";
import { getPublishedCmsPage } from "@/platform/cms/public";

const pageSeo = staticPageSeo["/nos-petits-bonheurs"];

export const metadata = createPageMetadata({
  ...pageSeo,
  image: petitsBonheurs[0].image,
});

export const dynamic = "force-dynamic";

async function getEntries(): Promise<PetitBonheur[]> {
  if (!isDatabaseConfigured()) return petitsBonheurs;
  try {
    const cmsEntries = (await new CarnetRepository().list({ publishedOnly: true })).filter(
      (entry) => entry.category === "host_tip" && entry.tags.includes("petit-bonheur"),
    );
    if (!cmsEntries.length) return petitsBonheurs;
    const cmsBySlug = new Map(cmsEntries.map((entry) => [entry.slug, entry]));
    const merged = petitsBonheurs.map<PetitBonheur>((fallback) => {
      const entry = cmsBySlug.get(fallback.slug);
      if (!entry) return fallback;
      cmsBySlug.delete(fallback.slug);
      return {
        ...fallback,
        title: entry.title,
        image: entry.imagePath || fallback.image,
        additionalImages: fallback.additionalImages,
        imageAlt: entry.imageAlt || fallback.imageAlt,
        anecdote: entry.body || entry.summary,
        tip: entry.hostTip || undefined,
        officialUrl: entry.officialUrl || undefined,
        mapUrl: entry.googleMapsUrl || undefined,
        destination: entry.destination === "all" ? "all" : "ile_de_re",
      };
    });
    return [
      ...merged,
      ...Array.from(cmsBySlug.values()).map<PetitBonheur>((entry) => ({
        slug: entry.slug,
        title: entry.title,
        image: entry.imagePath || "/images/destination/marais-coucher-soleil.jpeg",
        imageAlt: entry.imageAlt || entry.title,
        anecdote: entry.body || entry.summary,
        tip: entry.hostTip || undefined,
        officialUrl: entry.officialUrl || undefined,
        mapUrl: entry.googleMapsUrl || undefined,
        destination: entry.destination === "all" ? "all" : "ile_de_re",
      })),
    ];
  } catch {
    return petitsBonheurs;
  }
}

export default async function NosPetitsBonheursPage() {
  const managedPage = await getPublishedCmsPage("nos-petits-bonheurs");
  if (managedPage) return <DynamicCmsPage page={managedPage} />;
  const entries = await getEntries();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Les petits bonheurs de Stéphanie & Bruno",
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: entry.title,
        description: entry.anecdote,
        image: absoluteUrl(entry.image),
        url: `${absoluteUrl("/nos-petits-bonheurs")}#${entry.slug}`,
      },
    })),
  };

  return (
    <main className="small-happiness-page">
      <PageStructuredData {...pageSeo} />
      <StructuredData data={structuredData} />
      <Header />
      <section className="small-happiness-hero">
        <Image
          src={entries[0].image}
          alt="Un petit bonheur choisi par Stéphanie et Bruno"
          fill
          priority
          sizes="100vw"
        />
        <div className="small-happiness-hero__veil" />
        <div className="small-happiness-hero__copy">
          <p className="eyebrow light">Le carnet personnel</p>
          <h1>Les petits bonheurs de Stéphanie &amp; Bruno</h1>
          <p>
            Des souvenirs, des traditions et quelques fragments de notre vraie vie sur l’île. Ici,
            nous ne dressons pas une liste d’adresses : nous vous racontons les moments que nous
            aimons vivre et partager.
          </p>
        </div>
      </section>

      <nav className="small-happiness-index" aria-label="Les petits bonheurs">
        {entries.map((entry, index) => (
          <a href={`#${entry.slug}`} key={entry.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span> {entry.title}
          </a>
        ))}
      </nav>

      <section className="small-happiness-intro shell">
        <p className="eyebrow">Notre journal des îles</p>
        <h2>Les souvenirs commencent souvent par une chose toute simple.</h2>
        <p>
          Une première fraise, une table face au port, une pause après le vélo ou un ciel rempli
          d’ailes de kitesurf. Chaque chapitre raconte une émotion vécue, loin du format d’un guide
          pratique.
        </p>
      </section>

      <section className="small-happiness-stories" aria-label="Anecdotes de Stéphanie et Bruno">
        {entries.map((entry, index) => (
          <article
            className={`small-happiness-story${index % 2 ? " small-happiness-story--reverse" : ""}`}
            id={entry.slug}
            key={entry.slug}
          >
            <div className="small-happiness-story__image">
              <Image
                src={entry.image}
                alt={entry.imageAlt}
                fill
                sizes="(max-width: 850px) 100vw, 55vw"
              />
              {entry.additionalImages?.map((image, imageIndex) => (
                <Image
                  className={`small-happiness-story__inset small-happiness-story__inset--${imageIndex + 1}`}
                  src={image}
                  alt={`${entry.title}, autre moment authentique`}
                  width={594}
                  height={336}
                  key={image}
                />
              ))}
            </div>
            <div className="small-happiness-story__copy">
              <p className="eyebrow">Souvenir n° {String(index + 1).padStart(2, "0")}</p>
              <h2>{entry.title}</h2>
              <h3>Notre anecdote</h3>
              <p>{entry.anecdote}</p>
              {entry.tip && (
                <aside>
                  <strong>Le conseil de Stéphanie &amp; Bruno</strong>
                  <p>{entry.tip}</p>
                </aside>
              )}
              <div className="small-happiness-story__links">
                {entry.officialUrl && (
                  <a href={entry.officialUrl} target="_blank" rel="noreferrer">
                    {entry.officialLabel ?? "Voir le site officiel"}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {entry.mapUrl && (
                  <a href={entry.mapUrl} target="_blank" rel="noreferrer">
                    Voir sur la carte <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="small-happiness-outro shell">
        <p className="eyebrow">À votre tour</p>
        <h2>Quel sera votre petit bonheur ?</h2>
        <p>Gardez un peu de place pour l’imprévu. Les îles savent souvent écrire la suite.</p>
        <div>
          <Link className="primary-button" href="/carnet">
            Ouvrir le Carnet
          </Link>
          <Link className="secondary-button" href="/maisons">
            Découvrir nos maisons
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
