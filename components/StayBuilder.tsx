"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./StayBuilder.module.css";

type Group = "couple" | "famille" | "amis";
type Mood = "ocean" | "velo" | "gourmand" | "calme" | "fort-boyard" | "romantique";
type StayLevel = "essentiel" | "confort" | "signature";

type Home = {
  name: string;
  href: string;
  image: string;
  location: string;
  signature: string;
  capacities: Group[];
  scores: Record<Mood, number>;
};

const groups: { id: Group; title: string; text: string }[] = [
  { id: "couple", title: "En couple", text: "Une parenthèse à deux, entre océan et bonnes tables." },
  { id: "famille", title: "En famille", text: "Des espaces faciles à vivre et des attentions pour tous les âges." },
  { id: "amis", title: "Entre amis", text: "Une maison généreuse pour cuisiner, partager et explorer les îles." },
];

const moods: { id: Mood; title: string; text: string }[] = [
  { id: "ocean", title: "L’océan", text: "La plage, les embruns et les horizons atlantiques." },
  { id: "velo", title: "Le vélo", text: "Les pistes, les villages et les marchés sans voiture." },
  { id: "gourmand", title: "La gastronomie", text: "Huîtres, pâtisseries, producteurs et grandes tablées." },
  { id: "calme", title: "Le calme", text: "Ralentir, lire, respirer et retrouver du temps." },
  { id: "fort-boyard", title: "Fort Boyard", text: "La forêt des Saumonards et l’une des vues les plus emblématiques." },
  { id: "romantique", title: "Une occasion spéciale", text: "Un anniversaire, une surprise ou simplement le plaisir d’être ensemble." },
];

const levels: { id: StayLevel; title: string; text: string }[] = [
  { id: "essentiel", title: "Essentiel", text: "La maison et les attentions d’accueil Beaux Rivages." },
  { id: "confort", title: "Confort", text: "Le séjour facilité avec le linge et des services choisis." },
  { id: "signature", title: "Signature Beaux Rivages", text: "L’expérience la plus complète, pensée dans les moindres détails." },
];

const homes: Home[] = [
  {
    name: "Le Chai des Tortues",
    href: "/maisons/le-chai-des-tortues",
    image: "/images/chai/hero.jpg",
    location: "Rivedoux-Plage · Île de Ré",
    signature: "Patrimoine, convivialité et art de recevoir",
    capacities: ["couple", "famille", "amis"],
    scores: { ocean: 4, velo: 5, gourmand: 5, calme: 4, "fort-boyard": 1, romantique: 3 },
  },
  {
    name: "Villa Raie Manta",
    href: "/maisons/villa-raie-manta",
    image: "/images/villa/hero.jpg",
    location: "Rivedoux-Plage · Île de Ré",
    signature: "Océan, design et lumière",
    capacities: ["couple", "famille", "amis"],
    scores: { ocean: 5, velo: 4, gourmand: 4, calme: 4, "fort-boyard": 1, romantique: 5 },
  },
  {
    name: "Le Nid d’Été",
    href: "/maisons/le-nid-d-ete",
    image: "/images/nid/hero.jpg",
    location: "Saint-Georges-d’Oléron · Île d’Oléron",
    signature: "Nature, plage et sérénité face à Fort Boyard",
    capacities: ["couple", "famille"],
    scores: { ocean: 5, velo: 4, gourmand: 3, calme: 5, "fort-boyard": 5, romantique: 4 },
  },
];

const itineraryByMood: Record<Mood, string> = {
  ocean: "Commencer la journée au bord de l’eau, déjeuner de produits locaux puis retrouver la plage en fin d’après-midi.",
  velo: "Retirer les vélos tôt, rejoindre un marché de village et revenir par les chemins côtiers avant l’apéritif.",
  gourmand: "Choisir les produits du marché, passer chez un producteur d’huîtres et préparer une grande table à la maison.",
  calme: "Prendre le temps d’un petit déjeuner tardif, marcher dans la nature et garder l’après-midi libre, sans programme imposé.",
  "fort-boyard": "Traverser la forêt des Saumonards, rejoindre la plage et profiter de la perspective sur Fort Boyard au meilleur moment de la lumière.",
  romantique: "Prévoir une arrivée soignée, une promenade au coucher du soleil et une soirée intimiste préparée dans la maison.",
};

export function StayBuilder() {
  const [step, setStep] = useState(1);
  const [group, setGroup] = useState<Group>("famille");
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>(["ocean", "calme"]);
  const [level, setLevel] = useState<StayLevel>("confort");

  const recommendation = useMemo(() => {
    return [...homes]
      .filter((home) => home.capacities.includes(group))
      .sort((a, b) => {
        const scoreA = selectedMoods.reduce((total, mood) => total + a.scores[mood], 0);
        const scoreB = selectedMoods.reduce((total, mood) => total + b.scores[mood], 0);
        return scoreB - scoreA;
      })[0];
  }, [group, selectedMoods]);

  const selectedLevel = levels.find((item) => item.id === level)!;
  const selectedGroup = groups.find((item) => item.id === group)!;

  function toggleMood(mood: Mood) {
    setSelectedMoods((current) => {
      if (current.includes(mood)) {
        return current.length === 1 ? current : current.filter((item) => item !== mood);
      }
      return current.length >= 3 ? [...current.slice(1), mood] : [...current, mood];
    });
  }

  const subject = encodeURIComponent(`Projet de séjour - ${recommendation.name}`);
  const body = encodeURIComponent(
    `Bonjour Stéphanie,\n\nJe souhaite préparer un séjour Beaux Rivages.\n\nMaison suggérée : ${recommendation.name}\nType de séjour : ${selectedGroup.title}\nEnvies : ${selectedMoods.map((mood) => moods.find((item) => item.id === mood)?.title).join(", ")}\nExpérience souhaitée : ${selectedLevel.title}\n\nDates envisagées :\nNombre de voyageurs :\n\nMerci de me confirmer les disponibilités et les possibilités de personnalisation.`,
  );

  return (
    <section className={styles.builder}>
      <div className={styles.hero}>
        <div className="shell">
          <p className="eyebrow light">Conciergerie Beaux Rivages</p>
          <h1>Construisez votre séjour</h1>
          <p>Quelques choix suffisent pour imaginer la maison, le rythme et les attentions qui vous ressemblent.</p>
        </div>
      </div>

      <div className={`shell ${styles.workspace}`}>
        <div className={styles.progress} aria-label={`Étape ${step} sur 4`}>
          {[1, 2, 3, 4].map((item) => (
            <button key={item} type="button" onClick={() => setStep(item)} className={item <= step ? styles.done : ""}>
              <span>0{item}</span>
              {item === 1 ? "Voyageurs" : item === 2 ? "Envies" : item === 3 ? "Expérience" : "Votre séjour"}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div className={styles.step}>
            <div className={styles.heading}>
              <p className="eyebrow">Première étape</p>
              <h2>Avec qui partez-vous&nbsp;?</h2>
            </div>
            <div className={styles.optionGrid}>
              {groups.map((item) => (
                <button key={item.id} type="button" onClick={() => setGroup(item.id)} className={group === item.id ? styles.selected : ""}>
                  <strong>{item.title}</strong><span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step}>
            <div className={styles.heading}>
              <p className="eyebrow">Deuxième étape</p>
              <h2>Que voulez-vous ressentir pendant ces vacances&nbsp;?</h2>
              <p>Choisissez jusqu’à trois envies.</p>
            </div>
            <div className={styles.optionGrid}>
              {moods.map((item) => {
                const active = selectedMoods.includes(item.id);
                return (
                  <button key={item.id} type="button" onClick={() => toggleMood(item.id)} className={active ? styles.selected : ""} aria-pressed={active}>
                    <strong>{item.title}</strong><span>{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.step}>
            <div className={styles.heading}>
              <p className="eyebrow">Troisième étape</p>
              <h2>Quel niveau d’accompagnement souhaitez-vous&nbsp;?</h2>
            </div>
            <div className={styles.optionGrid}>
              {levels.map((item) => (
                <button key={item.id} type="button" onClick={() => setLevel(item.id)} className={level === item.id ? styles.selected : ""}>
                  <strong>{item.title}</strong><span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.result}>
            <div className={styles.resultImage} style={{ backgroundImage: `linear-gradient(180deg, rgba(12,35,43,.05), rgba(12,35,43,.72)), url('${recommendation.image}')` }} />
            <div className={styles.resultCopy}>
              <p className="eyebrow">Votre séjour Beaux Rivages</p>
              <h2>{recommendation.name}</h2>
              <p className={styles.location}>{recommendation.location}</p>
              <p className={styles.signature}>{recommendation.signature}</p>
              <div className={styles.summary}>
                <div><span>Vous voyagez</span><strong>{selectedGroup.title.toLowerCase()}</strong></div>
                <div><span>Votre expérience</span><strong>{selectedLevel.title}</strong></div>
              </div>
              <div className={styles.itinerary}>
                <p className="eyebrow">Une journée imaginée pour vous</p>
                {selectedMoods.map((mood) => <p key={mood}>{itineraryByMood[mood]}</p>)}
              </div>
              <div className={styles.actions}>
                <Link className="button" href={recommendation.href}>Découvrir la maison</Link>
                <a className="button button-ghost" href={`mailto:coulotstephanie@gmail.com?subject=${subject}&body=${body}`}>Envoyer mon projet à Stéphanie</a>
              </div>
            </div>
          </div>
        )}

        <div className={styles.navigation}>
          <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>Retour</button>
          {step < 4 && <button type="button" className="button" onClick={() => setStep((current) => Math.min(4, current + 1))}>Continuer</button>}
          {step === 4 && <button type="button" onClick={() => setStep(1)}>Recommencer</button>}
        </div>
      </div>
    </section>
  );
}
