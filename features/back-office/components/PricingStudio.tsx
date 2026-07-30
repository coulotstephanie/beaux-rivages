"use client";

import { Check, Plus, Tag } from "lucide-react";
import { useState } from "react";
import { offers as initialOffers, properties, rateRules as initialRules } from "../demo-data";

export function PricingStudio() {
  const [rules, setRules] = useState(initialRules);
  const [offers, setOffers] = useState(initialOffers);
  const [property, setProperty] = useState("all");

  return <div className="bo-page">
    <div className="bo-page__heading"><div><p className="bo-eyebrow">Tarification privée</p><h1>Tarifs & offres</h1><p>Des règles claires, modifiables sans intervention technique.</p></div><button className="bo-primary" type="button"><Plus /> Nouvelle période</button></div>
    <section className="bo-pricing-summary">
      {properties.map((item, index) => <article key={item.id}><i style={{ background: item.color }} /><div><small>{item.name}</small><strong>{[285, 390, 185][index]} €</strong><span>prix de base / nuit</span></div><button type="button">Modifier</button></article>)}
    </section>
    <div className="bo-tabs" role="tablist"><button type="button" role="tab" aria-selected="true">Périodes & saisons</button><button type="button" role="tab" aria-selected="false">Promotions</button><button type="button" role="tab" aria-selected="false">Packs & services</button></div>
    <section className="bo-card">
      <div className="bo-card__heading"><div><p className="bo-eyebrow">Grille tarifaire</p><h2>Prix et règles de séjour</h2></div><select aria-label="Filtrer par maison" value={property} onChange={(e) => setProperty(e.target.value)}><option value="all">Toutes les maisons</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div className="bo-rate-table"><div className="bo-rate-table__head"><span>Période</span><span>Maison</span><span>Prix / nuit</span><span>Minimum</span><span>Jours interdits</span><span>Statut</span></div>{rules.filter((r) => property === "all" || r.propertyId === property).map((rule) => <article key={rule.id}><div><strong>{rule.label}</strong><small>{rule.period}</small></div><span>{properties.find((p) => p.id === rule.propertyId)?.shortName}</span><label><input aria-label={`Prix ${rule.label}`} type="number" value={rule.nightlyRate} onChange={(e) => setRules((current) => current.map((item) => item.id === rule.id ? { ...item, nightlyRate: Number(e.target.value) } : item))} /> €</label><span>{rule.minimumNights} nuits</span><span>{rule.closedDays.join(", ") || "Aucun"}</span><span className={`bo-state is-${rule.status}`}>{rule.status === "active" ? "Actif" : "Brouillon"}</span></article>)}</div>
    </section>
    <section className="bo-card">
      <div className="bo-card__heading"><div><p className="bo-eyebrow">Conversion</p><h2>Promotions, packs et services</h2></div><button type="button"><Plus /> Ajouter</button></div>
      <div className="bo-offers">{offers.map((offer) => <article key={offer.id}><div className="bo-offer-icon">{offer.kind === "code" ? <Tag /> : <Check />}</div><div><small>{offer.kind}</small><strong>{offer.label}</strong><span>{offer.description}</span></div><b>{offer.value}</b><label className="bo-switch"><input type="checkbox" checked={offer.enabled} onChange={() => setOffers((current) => current.map((item) => item.id === offer.id ? { ...item, enabled: !item.enabled } : item))} /><span /></label></article>)}</div>
    </section>
    <p className="bo-helper">Les modifications de cette version restent locales. Aucun tarif n’est envoyé vers un canal externe.</p>
  </div>;
}
