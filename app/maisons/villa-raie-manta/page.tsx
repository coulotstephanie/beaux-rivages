import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Villa Raie Manta | Vue mer à Rivedoux-Plage | Beaux Rivages",
  description:
    "Maison contemporaine pour 8 voyageurs, quatre chambres, salon panoramique à l’étage et vue sur l’océan.",
};

export default function VillaPage() {
  return (
    <main>
      <Header />
      <section className="property-hero property-hero-villa">
        <div className="property-hero-content">
          <p className="eyebrow light">Océan · Design · Lumière</p>
          <h1>Villa Raie Manta</h1>
          <p>Tout commence en traversant le pont de l’Île de Ré. Quelques instants plus tard, la maison s’ouvre sur l’océan.</p>
          <div className="property-meta"><span>Rivedoux-Plage · Île de Ré</span><span>Jusqu’à 8 voyageurs et un bébé</span></div>
        </div>
      </section>

      <section className="shell editorial-section">
        <p className="eyebrow">Une maison tournée vers l’horizon</p>
        <h2>Le salon a été installé à l’étage pour faire entrer la mer dans chaque journée.</h2>
        <p>La lumière, la vue sur le pont et l’océan accompagnent les petits-déjeuners, les retours de plage et les longues soirées en famille.</p>
        <div className="feature-grid">
          <article><strong>8</strong><span>voyageurs</span></article>
          <article><strong>4</strong><span>chambres</span></article>
          <article><strong>2</strong><span>salles de bain</span></article>
          <article><strong>Vue mer</strong><span>depuis le salon</span></article>
        </div>
      </section>

      <section className="shell content-grid">
        <article className="content-card"><h3>Le salon signature</h3><p>Installé à l’étage pour offrir une perspective panoramique sur l’océan et le pont de l’Île de Ré.</p></article>
        <article className="content-card"><h3>Des espaces pour tous</h3><p>Une suite au rez-de-chaussée, une chambre vue mer, une chambre enfants et une chambre à lits jumeaux.</p></article>
        <article className="content-card"><h3>Rivedoux à quelques pas</h3><p>La plage, les Halles, les commerces, les restaurants et les pistes cyclables sont facilement accessibles.</p></article>
      </section>

      <section className="booking-cta shell">
        <p className="eyebrow">Réservation directe</p>
        <h2>Préparons votre séjour face à l’océan.</h2>
        <Link className="primary-button" href="/reserver">Demander mes dates</Link>
      </section>
      <Footer />
    </main>
  );
}
