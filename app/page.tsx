import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PropertyCard } from "@/components/PropertyCard";

const properties = [
  {
    name: "Le Chai des Tortues",
    location: "Rivedoux-Plage · Île de Ré",
    promise: "Un ancien chai en pierre, pensé pour les familles, les grandes tablées et la douceur de vivre rétaise, à 250 mètres de la plage.",
    image: "/images/chai/hero.jpg",
    href: "/maisons/le-chai-des-tortues",
  },
  {
    name: "Villa Raie Manta",
    location: "Rivedoux-Plage · Île de Ré",
    promise: "Une maison contemporaine baignée de lumière, dont le salon panoramique ouvre le séjour sur l’océan et le pont de l’Île de Ré.",
    image: "/images/villa/hero.jpg",
    href: "/maisons/villa-raie-manta",
  },
  {
    name: "Le Nid d’Été",
    location: "Saint-Georges-d’Oléron · Île d’Oléron",
    promise: "Une parenthèse entre patrimoine, forêt et océan, dans la résidence historique La Maison Heureuse, avec accès privé à la plage des Saumonards.",
    image: "/images/nid/hero.jpg",
    href: "/maisons/le-nid-d-ete",
  },
] as const;

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />

      <section className="intro shell" id="iles">
        <p className="eyebrow">L’esprit Beaux Rivages</p>
        <h2>Nous ne proposons pas simplement des maisons. Nous ouvrons les portes des îles.</h2>
        <p>Beaux Rivages réunit trois lieux singuliers sur l’Île de Ré et l’Île d’Oléron. Chaque séjour associe le caractère d’une maison, nos adresses testées toute l’année et une hospitalité façonnée par trois générations d’expérience hôtelière.</p>
      </section>

      <section className="benefits shell" aria-label="Avantages de la réservation directe">
        <div><strong>Réservation directe</strong><span>Une relation simple, sans intermédiaire</span></div>
        <div><strong>Conseils locaux</strong><span>Les adresses de Stéphanie & Bruno</span></div>
        <div><strong>Accueil au choix</strong><span>Autonome ou personnalisé</span></div>
        <div><strong>Paiements souples</strong><span>Chèques-Vacances, virement ou espèces</span></div>
      </section>

      <section className="properties shell" id="maisons">
        <div className="section-heading">
          <p className="eyebrow">Nos maisons</p>
          <h2>Trois atmosphères, une même exigence.</h2>
        </div>
        <div className="property-grid">
          {properties.map((property) => <PropertyCard key={property.name} {...property} />)}
        </div>
      </section>

      <section className="hospitality" id="hospitalite">
        <div className="hospitality-image" aria-hidden="true" />
        <div className="hospitality-copy">
          <p className="eyebrow">Le mot de Stéphanie</p>
          <h2>L’excellence de l’hôtellerie, le charme d’une maison de famille.</h2>
          <p>Nous souhaitons que vous vous sentiez chez nous comme accueillis par des amis : libres de profiter de votre séjour en toute indépendance, mais toujours accompagnés lorsque vous avez besoin d’un conseil ou d’une attention particulière.</p>
        </div>
      </section>

      <section className="booking shell" id="reserver">
        <p className="eyebrow">Préparer votre séjour</p>
        <h2>Parlons de vos prochaines vacances.</h2>
        <p>Indiquez la maison souhaitée, vos dates et le nombre de voyageurs. Stéphanie vous répondra personnellement avec les disponibilités et les conditions de réservation directe.</p>
        <a className="button" href="mailto:coulotstephanie@gmail.com?subject=Demande%20de%20séjour%20Beaux%20Rivages">Faire une demande</a>
      </section>

      <Footer />
    </main>
  );
}
