"use client";

import { ArrowUpRight, CalendarCheck, CircleAlert, CreditCard, Euro, LogIn, LogOut, MessageSquare, RefreshCw, CheckSquare } from "lucide-react";
import { useState } from "react";

const metrics = [
  { label: "Occupation", value: "78 %", detail: "2 maisons occupées", icon: CalendarCheck, tone: "positive" },
  { label: "Revenus du mois", value: "28 640 €", detail: "+ 12 % vs N-1", icon: Euro, tone: "positive" },
  { label: "Arrivées", value: "3", detail: "9 voyageurs", icon: LogIn, tone: "default" },
  { label: "Départs", value: "2", detail: "2 ménages prévus", icon: LogOut, tone: "default" },
  { label: "Incidents", value: "1", detail: "Urgent aujourd’hui", icon: CircleAlert, tone: "danger" },
  { label: "Tâches", value: "8 / 14", detail: "57 % terminées", icon: CheckSquare, tone: "warning" },
  { label: "Communications", value: "7", detail: "2 prioritaires", icon: MessageSquare, tone: "warning" },
  { label: "Paiements", value: "3 480 €", detail: "5 à recevoir", icon: CreditCard, tone: "warning" },
];

export function CommandCenter() {
  const [refreshed, setRefreshed] = useState("10:45");
  return (
    <main className="bo-page bo-command-center">
      <header className="bo-page__heading"><div><p className="bo-eyebrow">Supervision opérationnelle</p><h1>Command Center</h1><p>La situation de Beaux Rivages en un seul regard.</p></div><button className="bo-primary" type="button" onClick={() => setRefreshed("à l’instant")}><RefreshCw /> Actualiser</button></header>
      <p className="bo-live"><i /> Données de démonstration · actualisées {refreshed}</p>
      <section className="bo-command-metrics">{metrics.map(({ label, value, detail, icon: Icon, tone }) => <article key={label} data-tone={tone}><div><Icon /><span>{label}</span></div><strong>{value}</strong><small>{detail}</small><button type="button">Détails <ArrowUpRight /></button></article>)}</section>
      <div className="bo-command-panels">
        <section className="bo-card"><div className="bo-card__heading"><div><p className="bo-eyebrow">7 derniers jours</p><h2>Revenus & occupation</h2></div></div><div className="bo-bars" aria-label="Graphique des revenus">{[42, 64, 53, 78, 85, 72, 91].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><small>{["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][index]}</small></div>)}</div></section>
        <section className="bo-card"><div className="bo-card__heading"><div><p className="bo-eyebrow">Attention requise</p><h2>Flux opérationnel</h2></div></div><ol className="bo-live-feed"><li><i data-tone="danger" /><span><strong>Erreur de synchronisation Airbnb</strong><small>Le Chai · il y a 4 min</small></span></li><li><i data-tone="positive" /><span><strong>Paiement de 1 680 € reçu</strong><small>Famille Martin · il y a 12 min</small></span></li><li><i data-tone="warning" /><span><strong>Tâche urgente non commencée</strong><small>Chauffe-eau · avant 14 h</small></span></li></ol></section>
      </div>
    </main>
  );
}
