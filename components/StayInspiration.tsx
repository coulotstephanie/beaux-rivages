"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./StayInspiration.module.css";

type Desire = "plage" | "velo" | "gastronomie" | "famille" | "repos" | "romantique";

type HomeRecommendation = {
  name: string;
  location: string;
  href: string;
  image: string;
  signature: string;
  reasons: Record<Desire, string>;
  scores: Record<Desire, number>;
};

const desires: { id: Desire; label: string; detail: string }[] = [
  { id: "plage", label: "Vivre près de l’océan", detail: "Baignades, sable et horizons atlantiques" },
  { id: "velo", label: "Explorer à vélo", detail: "Marchés, villages et pistes cyclables" },
  { id: "gastronomie", label: "Goûter les îles", detail: "Huîtres, marchés et grandes tablées" },
  { id: "famille", label: "Se retrouver en famille", detail: "Confort, jeux et souvenirs partagés" },
  { id: "repos", label: "Ralentir vraiment", detail: "Nature, calme et parenthèse au vert" },
  { id: "romantique", label: "S’offrir une escapade", detail: "Lumière, océan et moments à deux" },
];

const homes: HomeRecommendation[] = [
  {
    name: "Le Chai des Tortues",
    location: "Rivedoux-Plage · Île de Ré",
    href: "/maisons/le-chai-des-tortues",
    image: "/images/chai/hero.jpg",
    signature: "Patrimoine, cuisine et convivialité",
    scores: { plage: 4, velo: 5, gastronomie: 5, famille: 5, repos: 3, romantique: 3 },
    reasons: {
      plage: "La plage se rejoint à pied en quelques minutes, avec tout l’équipement nécessaire déjà prévu sur place.",
      velo: "Sa situation à Rivedoux-Plage permet de partir directement vers les villages et les pistes de l’Île de Ré.",
      gastronomie: "Son exceptionnelle cuisine et sa proximité avec les Halles en font la maison des repas généreux et des produits de l’île.",
      famille: "Trois chambres, deux salles d’eau et de nombreux équipements pour petits et grands facilitent les séjours en tribu.",
      repos: "La pierre ancienne, les matières chaleureuses et le jardin clos créent une atmosphère protectrice et apaisante.",
      romantique: "Le caractère du chai et les soirées autour d’une belle table offrent une escapade authentique à deux.",
    },
  },
  {
    name: "Villa Raie Manta",
    location: "Rivedoux-Plage · Île de Ré",
    href: "/maisons/villa-raie-manta",
    image: "/images/villa/hero.jpg",
    signature: "Océan, design et lumière",
    scores: { plage: 5, velo: 4, gastronomie: 4, famille: 5, repos: 4, romantique: 5 },
    reasons: {
      plage: "Quelques pas suffisent pour rejoindre l’océan, visible depuis les espaces de vie baignés de lumière.",
      velo: "La villa est un point de départ idéal pour découvrir Rivedoux et rejoindre le réseau cyclable de l’île.",
      gastronomie: "Les Halles et les commerces sont proches, tandis que la grande cuisine invite à préparer les produits du marché.",
      famille: "Ses quatre chambres et ses généreux espaces de vie accueillent confortablement les grandes familles.",
      repos: "Le salon panoramique ouvre le regard sur la mer et transforme chaque moment de calme en véritable respiration.",
      romantique: "La vue sur l’océan, le pont illuminé et l’élégance contemporaine composent le décor le plus spectaculaire pour deux.",
    },
  },
  {
    name: "Le Nid d’Été",
    location: "Saint-Georges-d’Oléron · Île d’Oléron",
    href: "/maisons/le-nid-d-ete",
    image: "/images/nid/hero.jpg",
    signature: "Nature, patrimoine et sérénité",
    scores: { plage: 5, velo: 4, gastronomie: 3, famille: 5, repos: 5, romantique: 4 },
    reasons: {
      plage: "Un portail privé de la résidence ouvre directement sur la plage des Saumonards, face à Fort Boyard.",
      velo: "Forêt, littoral et villages oléronais se découvrent facilement depuis cette adresse préservée.",
      gastronomie: "Les marchés, les ports et les producteurs d’Oléron permettent de composer des repas simples aux saveurs marines.",
      famille: "Les espaces sécurisés, la plage immédiate et les équipements pour enfants rendent les vacances particulièrement fluides.",
      repos: "Les grands peupliers, les chemins de la résidence historique et l’accès direct à la nature invitent à ralentir naturellement.",
      romantique: "Les promenades au lever du jour et les vues sur Fort Boyard offrent une parenthèse intime et hors du temps.",
    },
  },
];

export function StayInspiration() {
  const [selected, setSelected] = useState<Desire[]>(["plage", "repos"]);

  const recommendation = useMemo(() => {
    return [...homes].sort((a, b) => {
      const scoreA = selected.reduce((total, desire) => total + a.scores[desire], 0);
      const scoreB = selected.reduce((total, desire) => total + b.scores[desire], 0);
      return scoreB - scoreA;
    })[0];
  }, [selected]);

  function toggleDesire(desire: Desire) {
    setSelected((current) => {
      if (current.includes(desire)) {
        return current.length === 1 ? current : current.filter((item) => item !== desire);
      }
      return current.length >= 3 ? [...current.slice(1), desire] : [...current, desire];
    });
  }

  return (
    <section className={styles.section} id="inspiration" aria-labelledby="inspiration-title">
      <div className={`shell ${styles.shell}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Mode Inspiration</p>
          <h2 id="inspiration-title">Quelle parenthèse imaginez-vous&nbsp;?</h2>
          <p>Choisissez jusqu’à trois envies. Beaux Rivages vous suggère la maison dont l’atmosphère correspond le mieux à votre séjour.</p>
        </div>

        <div className={styles.experience}>
          <div className={styles.choices} aria-label="Vos envies de séjour">
            {desires.map((desire) => {
              const active = selected.includes(desire.id);
              return (
                <button
                  type="button"
                  key={desire.id}
                  className={`${styles.choice} ${active ? styles.active : ""}`}
                  aria-pressed={active}
                  onClick={() => toggleDesire(desire.id)}
                >
                  <span>{desire.label}</span>
                  <small>{desire.detail}</small>
                </button>
              );
            })}
          </div>

          <article className={styles.result}>
            <div className={styles.image} style={{ backgroundImage: `linear-gradient(180deg, rgba(9,35,44,.05), rgba(9,35,44,.55)), url('${recommendation.image}')` }} />
            <div className={styles.copy}>
              <p className="eyebrow">Notre suggestion</p>
              <h3>{recommendation.name}</h3>
              <p className={styles.location}>{recommendation.location}</p>
              <p className={styles.signature}>{recommendation.signature}</p>
              <div className={styles.reasons}>
                {selected.map((desire) => <p key={desire}>{recommendation.reasons[desire]}</p>)}
              </div>
              <Link className="button" href={recommendation.href}>Découvrir cette maison</Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
