"use client";

import { CalendarCheck, CreditCard, FileSignature, History, Mail, MessageSquare, PenLine, Wrench } from "lucide-react";
import { useState } from "react";

const events = [
  { time: "10:42", date: "Aujourd’hui", title: "Paiement reçu", detail: "1 680 € · Famille Martin · BR-2026-084", kind: "Paiements", icon: CreditCard },
  { time: "10:18", date: "Aujourd’hui", title: "Email avant arrivée envoyé", detail: "Sophie Bernard · ouvert à 10:24", kind: "Emails", icon: Mail },
  { time: "09:56", date: "Aujourd’hui", title: "Réservation confirmée", detail: "Le Nid d’Été · 12 au 18 août", kind: "Réservations", icon: CalendarCheck },
  { time: "09:31", date: "Aujourd’hui", title: "SMS reçu", detail: "Question sur la remise des clés · Sophie Bernard", kind: "SMS", icon: MessageSquare },
  { time: "08:50", date: "Aujourd’hui", title: "Contrat signé", detail: "BR-2026-084 · signature complète", kind: "Contrats", icon: FileSignature },
  { time: "Hier", date: "29 juillet", title: "Intervention planifiée", detail: "Chauffe-eau · Le Nid d’Été · technicien Marc", kind: "Interventions", icon: Wrench },
  { time: "17:12", date: "29 juillet", title: "Note privée ajoutée", detail: "Prévoir un lit bébé et une barrière d’escalier", kind: "Notes", icon: PenLine },
  { time: "16:40", date: "29 juillet", title: "Tarif modifié", detail: "Villa Raie Manta · week-end du 15 août", kind: "Modifications", icon: History },
];

export function OperationsTimeline() {
  const [filter, setFilter] = useState("Tout");
  const filters = ["Tout", ...Array.from(new Set(events.map((event) => event.kind)))];
  const visible = filter === "Tout" ? events : events.filter((event) => event.kind === filter);

  return (
    <main className="bo-page">
      <header className="bo-page__heading"><div><p className="bo-eyebrow">Historique centralisé</p><h1>Timeline</h1><p>Chaque événement opérationnel reste consultable au même endroit.</p></div><button className="bo-primary" type="button">Exporter l’historique</button></header>
      <div className="bo-filter-row" aria-label="Filtrer l’historique">{filters.map((item) => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <section className="bo-card bo-operations-timeline">
        {visible.map(({ time, date, title, detail, kind, icon: Icon }, index) => <article key={`${title}-${index}`}><div className="bo-timeline-date"><time>{time}</time><small>{date}</small></div><i><Icon /></i><div><small>{kind}</small><strong>{title}</strong><p>{detail}</p></div><button type="button">Consulter</button></article>)}
      </section>
    </main>
  );
}
