import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { hostRecommendations } from "@/recommendations";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/conseils"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.food });
const magazineImages = [
  siteMedia.destination.food,
  siteMedia.destination.saintMartinPort,
  siteMedia.destination.salt,
  siteMedia.destination.village,
] as const;

export default function HostAdvicePage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="subpage-hero">
        <HeroBackground src={siteMedia.destination.food} />
        <div className="subpage-overlay" />
        <div className="subpage-copy">
          <p className="eyebrow light">Les conseils de Stéphanie & Bruno</p>
          <h1>Les îles comme nous les raconterions à des amis.</h1>
          <p>Nos producteurs, nos gourmandises, nos balades et les petits conseils qui changent une journée.</p>
        </div>
      </section>
      <section className="host-magazine shell">
        {hostRecommendations.map((recommendation, index) => (
          <article key={recommendation.slug} className={index % 4 === 0 ? "is-featured" : ""}>
            <div className="host-magazine__media">
              <Image src={magazineImages[index % magazineImages.length]} alt="" fill sizes={index % 4 === 0 ? "(max-width: 800px) 100vw, 60vw" : "(max-width: 800px) 100vw, 32vw"} loading="lazy" quality={85} />
            </div>
            <div className="host-magazine__copy">
              <p>{recommendation.category} · {recommendation.location}</p>
              <h2>{recommendation.name}</h2>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.description}</p>
              <blockquote>« {recommendation.hostNote} »</blockquote>
              {recommendation.practicalTip ? <p className="host-magazine__tip"><strong>Notre astuce</strong>{recommendation.practicalTip}</p> : null}
              <a href={recommendation.website} target="_blank" rel="noreferrer">Lien officiel <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
