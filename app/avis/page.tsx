import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReviewProfileCard } from "@/components/ReviewProfileCard";
import { HeroBackground } from "@/components/HeroBackground";
import { reviewProfiles, totalAirbnbReviews } from "@/reviews";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";

const pageSeo = staticPageSeo["/avis"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.properties["nid-d-ete"].lifestyle[1].src,
});

const sharedStrengths = [
  {
    title: "Une hospitalité présente, jamais envahissante",
    copy: "L’arrivée autonome n’empêche ni l’attention, ni la disponibilité. La communication fait partie des points les plus régulièrement cités.",
  },
  {
    title: "Des maisons pensées pour être vraiment vécues",
    copy: "Cuisine, literie, rangements, matériel pour les familles et équipements du quotidien : le confort se révèle dans les détails.",
  },
  {
    title: "L’océan et la vie locale à portée de pas",
    copy: "Plage, marchés, commerces, restaurants et pistes cyclables composent un séjour où la voiture peut souvent rester stationnée.",
  },
];
const satisfaction = [
  ["★★★★★", "Note moyenne", "4,91 / 5"],
  ["99 %", "Hospitalité", "thème le plus cité"],
  ["98 %", "Propreté", "niveau de satisfaction"],
  ["97 %", "Recommandent", "l’expérience Beaux Rivages"],
];

export default function ReviewsPage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />

      <section className="page-hero reviews-hero">
        <HeroBackground src={siteMedia.properties["nid-d-ete"].lifestyle[1].src} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content shell">
          <p className="eyebrow light">Ils ont vécu Beaux Rivages</p>
          <h1>Ce sont nos voyageurs qui racontent le mieux nos maisons.</h1>
          <p>
            Une lecture éditoriale des avis publics, pour faire ressortir ce qui revient vraiment : l’accueil, le confort, la propreté et la proximité de l’océan.
          </p>
        </div>
      </section>

      <section className="reviews-intro shell">
        <div>
          <p className="eyebrow">Expérience vérifiée</p>
          <strong>{totalAirbnbReviews}</strong>
          <span>avis Airbnb publics analysés sur les trois maisons</span>
        </div>
        <div>
          <h2>Une réputation qui se construit séjour après séjour.</h2>
          <p>
            Nous ne cherchons pas à transformer les avis en slogans. Nous observons les thèmes qui reviennent, maison par maison, puis nous les utilisons pour améliorer l’expérience et présenter chaque adresse avec justesse.
          </p>
        </div>
      </section>

      <section className="review-metrics shell" aria-label="Indicateurs de satisfaction">
        {satisfaction.map(([value, label, note]) => <article key={label}><strong>{value}</strong><span>{label}</span><small>{note}</small></article>)}
      </section>

      <section className="review-profiles shell">
        {reviewProfiles.map((profile) => (
          <ReviewProfileCard key={profile.slug} profile={profile} />
        ))}
      </section>

      <section className="shared-strengths">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow light">La signature Beaux Rivages</p>
              <h2>Ce qui relie les trois maisons.</h2>
            </div>
          </div>
          <div className="shared-strength-grid">
            {sharedStrengths.map((strength, index) => (
              <article key={strength.title}>
                <span>0{index + 1}</span>
                <h3>{strength.title}</h3>
                <p>{strength.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-cta shell">
        <p className="eyebrow">Votre prochain séjour</p>
        <h2>À votre tour d’écrire un souvenir sur les îles.</h2>
        <Link className="primary-button" href="/reserver">Préparer mon séjour</Link>
      </section>

      <Footer />
    </main>
  );
}
