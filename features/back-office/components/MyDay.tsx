"use client";

import { AlertTriangle, Cake, CheckCircle2, CloudSun, CreditCard, FileSignature, LogIn, LogOut, MessageCircle, Sparkles, Waves } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const dayItems = [
  { id: "a1", time: "09:00", group: "Arrivées", title: "Préparer l’accueil de la famille Martin", detail: "Le Chai · 4 voyageurs, 2 enfants et Nestor", href: "/administration/voyageurs", icon: LogIn, urgent: true },
  { id: "d1", time: "10:00", group: "Départs", title: "Départ de Sophie Bernard", detail: "Villa Raie Manta · état des lieux rapide", href: "/administration/calendriers", icon: LogOut },
  { id: "m1", time: "11:00", group: "Ménage", title: "Ménage Villa Raie Manta", detail: "Nadia confirmée · contrôle à 15 h", href: "/administration/taches", icon: Sparkles },
  { id: "c1", time: "12:00", group: "Contrats", title: "Relancer le contrat BR-2026-091", detail: "Signature attendue avant l’arrivée", href: "/administration/communications", icon: FileSignature, urgent: true },
  { id: "p1", time: "14:00", group: "Paiements", title: "Solde de 840 € à recevoir", detail: "Le Nid d’Été · échéance aujourd’hui", href: "/administration/voyageurs", icon: CreditCard },
  { id: "v1", time: "15:30", group: "Voyageurs", title: "Appeler Daniel et Marc", detail: "Confirmer leur transfert depuis la gare", href: "/administration/communications", icon: MessageCircle },
  { id: "q1", time: "16:00", group: "Contrôle", title: "Contrôler la Villa", detail: "Checklist qualité après ménage", href: "/administration/taches", icon: CheckCircle2 },
  { id: "b1", time: "18:00", group: "Anniversaire", title: "Anniversaire d’Élodie demain", detail: "Préparer une attention et un message", href: "/administration/communications", icon: Cake },
];

export function MyDay() {
  const [done, setDone] = useState<string[]>([]);

  return (
    <main className="bo-page">
      <header className="bo-page__heading">
        <div><p className="bo-eyebrow">Jeudi 30 juillet 2026</p><h1>Ma journée</h1><p>{dayItems.length - done.length} actions restent à traiter aujourd’hui.</p></div>
        <Link className="bo-primary" href="/administration/taches">+ Ajouter une tâche</Link>
      </header>
      <section className="bo-day-brief">
        <article><CloudSun /><div><small>Météo</small><strong>24 °C · Ensoleillé</strong><span>Vent 18 km/h</span></div></article>
        <article><Waves /><div><small>Marées</small><strong>Haute à 11:42</strong><span>Basse à 17:58</span></div></article>
        <article className="is-alert"><AlertTriangle /><div><small>Alerte importante</small><strong>Chauffe-eau à contrôler</strong><span>Le Nid d’Été · avant 14 h</span></div></article>
      </section>
      <section className="bo-card bo-day-list">
        <div className="bo-card__heading"><div><p className="bo-eyebrow">Ordre recommandé</p><h2>Le fil de votre journée</h2></div><strong>{done.length}/{dayItems.length} terminé</strong></div>
        {dayItems.map(({ id, time, group, title, detail, href, icon: Icon, urgent }) => (
          <article key={id} className={done.includes(id) ? "is-done" : ""}>
            <button type="button" onClick={() => setDone((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])} aria-label={`Marquer ${title} comme terminé`}><CheckCircle2 /></button>
            <time>{time}</time><Icon /><Link href={href}><small>{group}{urgent ? " · prioritaire" : ""}</small><strong>{title}</strong><span>{detail}</span></Link>
          </article>
        ))}
      </section>
    </main>
  );
}
