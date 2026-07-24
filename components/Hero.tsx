import Link from "next/link";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <video className="hero-media" autoPlay muted loop playsInline preload="metadata" poster="/images/destination/ocean-atlantique.jpg">
        <source src="/videos/hero-ocean.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content shell">
        <p className="eyebrow light">Île de Ré · Île d’Oléron</p>
        <h1 id="hero-title">Trois maisons. Deux îles.<br />Une même passion de l’hospitalité.</h1>
        <p>Des maisons de caractère, une connaissance intime des îles et l’attention héritée de trois générations d’hôteliers.</p>
        <div className="hero-actions">
          <Link className="button" href="#maisons">Découvrir les maisons</Link>
          <Link className="button button-ghost" href="#reserver">Préparer mon séjour</Link>
        </div>
      </div>
    </section>
  );
}
