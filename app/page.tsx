import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PropertyCard } from "@/components/PropertyCard";
import { StayInspiration } from "@/components/StayInspiration";

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

const moments = [
  {
    title: "Le matin, au rythme des marchés",
    text: "Un panier à la main, quelques produits choisis chez nos producteurs préférés et le plaisir de préparer un déjeuner qui sent déjà les vacances.",
  },
  {
    title: "L’après-midi, entre vélo et océan",
    text: "Des pistes cyclables, des chemins bordés de pins et cette lumière atlantique qui accompagne chaque détour jusqu’à la plage.",
  },
  {
    title: "Le soir, simplement ensemble",
    text: "Une grande table, des huîtres, un coucher de soleil et le sentiment précieux de ralentir enfin.",
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

      <section className="manifesto" aria-label="La promesse Beaux Rivages">
        <div className="manifesto-image" aria-hidden="true" />
        <div className="manifesto-copy">
          <p className="eyebrow light">L’Atlantique comme horizon</p>
          <h2>Partir avant même d’avoir fait ses valises.</h2>
          <p>Le séjour commence ici : dans le bruit des vagues, la lumière qui glisse sur les façades, le marché du matin et les chemins qui mènent à l’océan. Nos maisons ne sont pas une destination à part. Elles sont une manière plus intime de vivre les îles.</p>
          <Link className="text-link light-link" href="#maisons">Choisir son atmosphère <span>→</span></Link>
        </div>
      </section>

      <section className="benefits shell" aria-label="Avantages de la réservation directe">
        <div><strong>Réservation directe</strong><span>Une relation simple, sans intermédiaire</span></div>
        <div><strong>Conseils locaux</strong><span>Les adresses de Stéphanie & Bruno</span></div>
        <div><strong>Accueil au choix</strong><span>Autonome ou personnalisé</span></div>
        <div><strong>Paiements souples</strong><span>Chèques-Vacances, virement ou espèces</span></div>
      </section>

      <section className="properties shell" id="maisons">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Nos maisons</p>
            <h2>Trois atmosphères, une même exigence.</h2>
          </div>
          <p>Patrimoine et convivialité, design face à l’océan ou sérénité au bord de la plage : choisissez la maison qui ressemble à votre prochaine parenthèse.</p>
        </div>
        <div className="property-grid">
          {properties.map((property) => <PropertyCard key={property.name} {...property} />)}
        </div>
      </section>

      <StayInspiration />

      <section className="ideal-day shell">
        <div className="section-heading">
          <p className="eyebrow">Une journée idéale</p>
          <h2>Les îles se racontent dans les petits moments.</h2>
        </div>
        <div className="moments-grid">
          {moments.map((moment, index) => (
            <article className="moment-card" key={moment.title}>
              <span>0{index + 1}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hospitality" id="hospitalite">
        <div className="hospitality-image" aria-hidden="true" />
        <div className="hospitality-copy">
          <p className="eyebrow">Le mot de Stéphanie</p>
          <h2>L’excellence de l’hôtellerie, le charme d’une maison de famille.</h2>
          <p>Nous souhaitons que vous vous sentiez chez nous comme accueillis par des amis : libres de profiter de votre séjour en toute indépendance, mais toujours accompagnés lorsque vous avez besoin d’un conseil ou d’une attention particulière.</p>
          <p className="signature">Stéphanie & Bruno</p>
        </div>
      </section>

      <section className="carnet shell">
        <div>
          <p className="eyebrow">Le Carnet Beaux Rivages</p>
          <h2>Nos bonnes adresses, réellement testées toute l’année.</h2>
        </div>
        <div className="carnet-copy">
          <p>Ostréiculteurs, marchés, pâtisseries, restaurants, plages selon le vent, balades à vélo et escapades de saison : nous partageons les lieux que nous aimons et les conseils que nous donnons à nos proches.</p>
          <Link className="button" href="/carnet">Ouvrir le Carnet</Link>
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
