import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Le Nid d’Été | Accès privé plage | Beaux Rivages",
  description:
    "Maison familiale dans la résidence historique La Maison Heureuse, avec portail privé vers la plage des Saumonards face à Fort Boyard.",
};

export default function NidPage() {
  return (
    <main>
      <Header />
      <section className="property-hero property-hero-nid">
        <div className="property-hero-content">
          <p className="eyebrow light">Nature · Plage · Sérénité</p>
          <h1>Le Nid d’Été</h1>
          <p>Dans la résidence historique La Maison Heureuse, quelques pas suffisent pour rejoindre la plage des Saumonards face à Fort Boyard.</p>
          <div className="property-meta"><span>Saint-Georges-d’Oléron · Île d’Oléron</span><span>Jusqu’à 6 voyageurs et un bébé</span></div>
        </div>
      </section>

      <section className="shell editorial-section">
        <p className="eyebrow">Un privilège rare</p>
        <h2>Ouvrir le portail privé et rejoindre directement le sable.</h2>
        <p>Le Nid d’Été, appartement D12, se trouve à côté du portail privé de la résidence donnant accès à la plage. Les grands peupliers, les chemins arborés et la proximité de la forêt invitent naturellement à ralentir.</p>
        <div className="feature-grid">
          <article><strong>6</strong><span>voyageurs</span></article>
          <article><strong>2</strong><span>chambres</span></article>
          <article><strong>65,4 m²</strong><span>habitables</span></article>
          <article><strong>23 m²</strong><span>de terrasse</span></article>
        </div>
      </section>

      <section className="shell content-grid">
        <article className="content-card"><h3>La Maison Heureuse</h3><p>Une résidence historique classée, créée à l’origine pour héberger des travailleurs liés à la construction de Fort Boyard.</p></article>
        <article className="content-card"><h3>La plage sans voiture</h3><p>Le portail privé conduit directement à la plage des Saumonards, avec Fort Boyard à l’horizon.</p></article>
        <article className="content-card"><h3>Des vacances en famille</h3><p>Équipements bébé, livres, jeux, matériel de plage, tente anti-UV et résidence entièrement sécurisée.</p></article>
      </section>

      <section className="booking-cta shell">
        <p className="eyebrow">Réservation directe</p>
        <h2>Préparons votre séjour entre forêt et océan.</h2>
        <Link className="primary-button" href="/reserver">Demander mes dates</Link>
      </section>
      <Footer />
    </main>
  );
}
