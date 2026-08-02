import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { Container } from "@/components/ui";
import { staticPageSeo } from "@/content/fr/seo";
import { heritageSites } from "@/content/patrimoine";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/patrimoine"];
export const metadata = createPageMetadata({ ...pageSeo, image: heritageSites[0].images[0].src });

export default function HeritageIndexPage() {
  return (
    <main className="heritage-index">
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="heritage-index__hero">
        <Image
          src="/images/destination/re-authentique/abbaye-chateliers-jardins.jpg"
          alt="Abbaye des Châteliers, patrimoine de l’Île de Ré"
          fill
          priority
          sizes="100vw"
        />
        <div />
        <Container>
          <p className="eyebrow light">Patrimoine des îles</p>
          <h1>
            Des lieux qui racontent
            <br />
            l’Atlantique.
          </h1>
          <p>
            Forteresses, phares, abbayes, marais et ports : un carnet culturel personnel pour
            découvrir Ré et Oléron autrement.
          </p>
        </Container>
      </section>
      <section className="heritage-index__intro shell">
        <p className="eyebrow">Le magazine culturel Beaux Rivages</p>
        <h2>
          Chaque pierre, chaque paysage,
          <br />
          porte une mémoire.
        </h2>
        <p>
          Nous avons réuni les lieux que nous aimons faire découvrir, avec leur histoire, le regard
          à porter sur leur architecture et notre conseil pour choisir le meilleur moment.
        </p>
      </section>
      <section className="heritage-index__grid shell">
        {heritageSites.map((site, index) => (
          <Link
            href={`/patrimoine/${site.slug}`}
            key={site.slug}
            className={index === 0 || index === 5 ? "is-featured" : ""}
          >
            <article>
              <Image
                src={site.images[0].src}
                alt={site.images[0].alt}
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <div>
                <span>{site.island}</span>
                <h2>{site.title}</h2>
                <p>{site.subtitle}</p>
                <small>Lire l’histoire →</small>
              </div>
            </article>
          </Link>
        ))}
      </section>
      <section className="heritage-index__signature shell">
        <p className="eyebrow">Notre regard</p>
        <blockquote>
          « Le patrimoine se découvre mieux lorsqu’on laisse un peu de place à l’imprévu : une
          lumière, une rencontre, un chemin que l’on n’avait pas prévu de prendre. »
        </blockquote>
        <p>Stéphanie & Bruno</p>
      </section>
      <Footer />
    </main>
  );
}
