import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Le Chai des Tortues à Rivedoux-Plage | Beaux Rivages",
  description:
    "Ancien chai rénové à Rivedoux-Plage : 3 chambres, 2 salles d’eau, cuisine très équipée, plage à 250 mètres et accueil familial Beaux Rivages.",
};

export default function ChaiPage() {
  return (
    <main>
      <Header />
      <section className="property-hero property-hero-chai">
        <div className="property-hero-content">
          <p className="eyebrow light">Authenticité · Patrimoine · Convivialité</p>
          <h1>Le Chai des Tortues</h1>
          <p>Un ancien chai de Pineau et de Cognac, rénové dans le respect de sa pierre d’origine, à seulement 250 mètres de la plage.</p>
          <div className="property-meta"><span>Rivedoux-Plage · Île de Ré</span><span>Jusqu’à 6 voyageurs et un bébé</span></div>
        </div>
      </section>

      <section className="shell editorial-section">
        <p className="eyebrow">Une maison faite pour se retrouver</p>
        <h2>Les vieilles pierres, les repas partagés et l’île à pied.</h2>
        <p>Ici, la cuisine devient le cœur de la maison. On revient du marché, on ouvre les huîtres, on prépare les fruits de mer et l’on prolonge le dîner autour d’une grande table.</p>
        <div className="feature-grid">
          <article><strong>250 m</strong><span>de la plage à pied</span></article>
          <article><strong>3</strong><span>chambres</span></article>
          <article><strong>2</strong><span>salles d’eau</span></article>
          <article><strong>6</strong><span>voyageurs</span></article>
        </div>
      </section>

      <section className="shell content-grid">
        <article className="content-card"><h3>Une cuisine signature</h3><p>Ninja Dual Air Fryer, robot Kenwood chauffant, appareil à raclette et équipement complet pour préparer huîtres, coquillages et fruits de mer.</p></article>
        <article className="content-card"><h3>Pensé pour les familles</h3><p>Lit parapluie, chaise haute, poussette, baignoire bébé, livres, jeux et matériel de plage sont mis à disposition gratuitement.</p></article>
        <article className="content-card"><h3>Tout se fait à pied</h3><p>La plage, les Halles, les commerces, les restaurants et les premières pistes cyclables sont à quelques minutes.</p></article>
      </section>

      <section className="booking-cta shell">
        <p className="eyebrow">Réservation directe</p>
        <h2>Préparons votre séjour au Chai des Tortues.</h2>
        <Link className="primary-button" href="/reserver">Demander mes dates</Link>
      </section>
      <Footer />
    </main>
  );
}
