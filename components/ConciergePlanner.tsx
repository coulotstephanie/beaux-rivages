"use client";

import { useMemo, useState } from "react";
import {
  buildConciergePlan,
  durationLabels,
  interestLabels,
  profileLabels,
  type StayDuration,
  type StayInterest,
  type TravelProfile,
} from "@/conciergeEngine";

const kindLabels = {
  itineraire: "Itinéraire",
  plage: "Plage",
  restaurant: "Restaurant",
  producteur: "Producteur",
  marche: "Marché",
  balade: "Balade",
  conseil: "Le conseil de Stéphanie & Bruno",
};

export function ConciergePlanner() {
  const [profile, setProfile] = useState<TravelProfile>("couple");
  const [interests, setInterests] = useState<StayInterest[]>(["plage", "gastronomie"]);
  const [duration, setDuration] = useState<StayDuration>("semaine");
  const [busy, setBusy] = useState(false);
  const plan = useMemo(() => buildConciergePlan(profile, interests, duration), [profile, interests, duration]);
  const toggleInterest = (interest: StayInterest) => setInterests((current) =>
    current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  const download = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/concierge/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, interests, duration }),
      });
      if (!response.ok) throw new Error("PDF indisponible");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "votre-sejour-beaux-rivages.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  return <section className="concierge-planner" aria-labelledby="concierge-title">
    <div className="concierge-planner__intro"><p className="eyebrow">Conciergerie intelligente</p><h2 id="concierge-title">Un séjour composé autour de vous.</h2><p>Trois réponses suffisent pour préparer un carnet personnel, facile à modifier et à emporter.</p></div>
    <div className="concierge-planner__form">
      <fieldset><legend>Vous voyagez…</legend><div>{(Object.entries(profileLabels) as [TravelProfile, string][]).map(([value, label]) => <button type="button" key={value} aria-pressed={profile === value} onClick={() => setProfile(value)}>{label}</button>)}</div></fieldset>
      <fieldset><legend>Vos envies</legend><div>{(Object.entries(interestLabels) as [StayInterest, string][]).map(([value, label]) => <button type="button" key={value} aria-pressed={interests.includes(value)} onClick={() => toggleInterest(value)}>{label}</button>)}</div></fieldset>
      <fieldset><legend>Durée du séjour</legend><div>{(Object.entries(durationLabels) as [StayDuration, string][]).map(([value, label]) => <button type="button" key={value} aria-pressed={duration === value} onClick={() => setDuration(value)}>{label}</button>)}</div></fieldset>
    </div>
    <div className="concierge-planner__result" aria-live="polite">
      <div className="concierge-planner__result-head"><div><p className="eyebrow">Votre sélection</p><h3>{profileLabels[profile]} · {durationLabels[duration]}</h3></div><button type="button" className="primary-button" disabled={busy} onClick={() => void download()}>{busy ? "Création…" : "Télécharger mon PDF"}</button></div>
      <div className="concierge-planner__cards">{plan.map((item, index) => <article key={item.id}><span>0{index + 1} · {kindLabels[item.kind]}</span><h4>{item.title}</h4><p>{item.description}</p><a href={item.href}>Découvrir <span aria-hidden="true">→</span></a></article>)}</div>
    </div>
  </section>;
}
