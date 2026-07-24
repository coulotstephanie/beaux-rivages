"use client";

import { useMemo, useState } from "react";
import styles from "./CarnetExplorer.module.css";

type Place = {
  title: string;
  location: string;
  category: "Gastronomie" | "Plages" | "Vélo" | "Famille" | "Bien-être";
  island: "Île de Ré" | "Île d’Oléron";
  text: string;
  signature?: string;
};

const places: Place[] = [
  {
    title: "Huîtres et Ma Ré",
    location: "Rivedoux-Plage",
    category: "Gastronomie",
    island: "Île de Ré",
    text: "Notre producteur de confiance pour les repas de famille et les grandes occasions. Une adresse authentique pour goûter les huîtres de l’île.",
    signature: "Nous y achetons toutes nos huîtres.",
  },
  {
    title: "La Martinière",
    location: "Île de Ré",
    category: "Gastronomie",
    island: "Île de Ré",
    text: "Une institution gourmande pour les glaces et les macarons glacés. En haute saison, les habitués commandent à l’avance et retirent à l’atelier.",
    signature: "Le fraisier glacé de Stéphanie et le macaron réglisse de Bruno.",
  },
  {
    title: "Nina Métayer",
    location: "Rivedoux-Plage",
    category: "Gastronomie",
    island: "Île de Ré",
    text: "Une escale pâtissière liée aux origines rétaises de Nina Métayer, idéale après le marché ou au retour de la plage.",
    signature: "Notre conseil : le pain au chocolat praliné.",
  },
  {
    title: "Plage des Saumonards",
    location: "Saint-Georges-d’Oléron",
    category: "Plages",
    island: "Île d’Oléron",
    text: "Une longue plage bordée par la forêt, face à Fort Boyard. Depuis Le Nid d’Été, elle se rejoint directement par le portail privé de la résidence.",
  },
  {
    title: "Rivedoux à vélo",
    location: "Départ depuis nos maisons",
    category: "Vélo",
    island: "Île de Ré",
    text: "Une première balade douce entre plages, venelles et littoral, parfaite pour prendre le rythme de l’île sans reprendre la voiture.",
  },
  {
    title: "Une journée à Boyardville",
    location: "Saint-Georges-d’Oléron",
    category: "Famille",
    island: "Île d’Oléron",
    text: "Marché le matin, promenade sur le port, plage et vue sur Fort Boyard : une journée simple à composer avec les enfants.",
  },
  {
    title: "Reéduk Coach",
    location: "Île de Ré",
    category: "Bien-être",
    island: "Île de Ré",
    text: "Nos kinésithérapeutes de confiance proposent notamment yoga sur la plage, longe-côte, aquagym et accompagnement à domicile.",
    signature: "Une recommandation personnelle de Stéphanie & Bruno.",
  },
  {
    title: "La forêt des Saumonards",
    location: "Saint-Georges-d’Oléron",
    category: "Famille",
    island: "Île d’Oléron",
    text: "Des chemins ombragés entre pins et océan, agréables aux heures chaudes et parfaits pour une promenade sans programme.",
  },
];

const categories = ["Tout", "Gastronomie", "Plages", "Vélo", "Famille", "Bien-être"] as const;
const islands = ["Toutes les îles", "Île de Ré", "Île d’Oléron"] as const;

export function CarnetExplorer() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Tout");
  const [island, setIsland] = useState<(typeof islands)[number]>("Toutes les îles");

  const filteredPlaces = useMemo(
    () =>
      places.filter((place) => {
        const matchesCategory = category === "Tout" || place.category === category;
        const matchesIsland = island === "Toutes les îles" || place.island === island;
        return matchesCategory && matchesIsland;
      }),
    [category, island],
  );

  return (
    <div className={styles.explorer}>
      <div className={styles.controls} aria-label="Filtrer les recommandations">
        <div>
          <span className={styles.controlLabel}>Votre envie</span>
          <div className={styles.pills}>
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? styles.active : undefined}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <label className={styles.selectWrap}>
          <span className={styles.controlLabel}>Votre destination</span>
          <select value={island} onChange={(event) => setIsland(event.target.value as (typeof islands)[number])}>
            {islands.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className={styles.resultsHeader} aria-live="polite">
        <strong>{filteredPlaces.length} recommandations</strong>
        <span>Testées ou sélectionnées personnellement par vos hôtes</span>
      </div>

      <div className={styles.grid}>
        {filteredPlaces.map((place, index) => (
          <article key={place.title}>
            <div className={styles.cardTop}>
              <span>0{index + 1}</span>
              <span>{place.category}</span>
            </div>
            <p className={styles.location}>{place.location} · {place.island}</p>
            <h3>{place.title}</h3>
            <p>{place.text}</p>
            {place.signature && <p className={styles.signature}>{place.signature}</p>}
          </article>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className={styles.empty}>Aucune adresse ne correspond encore à ces critères. Le Carnet s’enrichit progressivement.</div>
      )}
    </div>
  );
}
