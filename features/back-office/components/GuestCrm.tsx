"use client";

import {
  CalendarCheck,
  ChevronRight,
  FileCheck,
  FileText,
  Mail,
  MessageCircle,
  PawPrint,
  Search,
  StickyNote,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { guests } from "../demo-data";
import type { GuestProfile, GuestTimelineItem } from "../types";

const allTags = [...new Set(guests.flatMap((guest) => guest.tags))].sort();
const eventIcons: Record<GuestTimelineItem["kind"], typeof CalendarCheck> = {
  stay: CalendarCheck, payment: WalletCards, contract: FileCheck,
  invoice: FileText, message: MessageCircle, note: StickyNote,
};

export function GuestCrm() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Tous");
  const [tier, setTier] = useState("Tous");
  const [selectedId, setSelectedId] = useState(guests[0].id);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("fr");
    return guests.filter((guest) => {
      const matchesText = !term || [guest.name, guest.email, guest.phone, guest.city, ...guest.tags, ...guest.preferences].some((value) => value.toLocaleLowerCase("fr").includes(term));
      return matchesText && (tag === "Tous" || guest.tags.includes(tag)) && (tier === "Tous" || guest.loyalty.tier === tier);
    });
  }, [query, tag, tier]);
  const selected = guests.find((guest) => guest.id === selectedId) ?? filtered[0] ?? null;

  return <div className="bo-page bo-crm-page">
    <div className="bo-page__heading"><div><p className="bo-eyebrow">Relation voyageurs</p><h1>Voyageurs CRM</h1><p>Chaque préférence et chaque séjour, au même endroit.</p></div><button className="bo-primary" type="button">+ Nouveau voyageur</button></div>
    <section className="bo-crm-tools">
      <label className="bo-crm-search"><Search /><input autoFocus type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, email, téléphone, ville, préférence…" /><kbd>⌘ K</kbd></label>
      <select aria-label="Filtrer par tag" value={tag} onChange={(e) => setTag(e.target.value)}><option>Tous</option>{allTags.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Filtrer par fidélité" value={tier} onChange={(e) => setTier(e.target.value)}><option>Tous</option>{["Bronze", "Argent", "Or", "Signature"].map((item) => <option key={item}>{item}</option>)}</select>
    </section>
    <div className="bo-crm-layout">
      <aside className="bo-guest-list" aria-label={`${filtered.length} voyageurs`}>
        <p>{filtered.length} voyageur{filtered.length > 1 ? "s" : ""}</p>
        {filtered.map((guest) => <button type="button" key={guest.id} className={selected?.id === guest.id ? "is-active" : ""} onClick={() => setSelectedId(guest.id)}><GuestAvatar guest={guest} /><span><strong>{guest.name}</strong><small>{guest.email}</small><i>{guest.tags.slice(0, 2).join(" · ")}</i></span><ChevronRight /></button>)}
        {!filtered.length && <div className="bo-empty">Aucun voyageur ne correspond à ces filtres.</div>}
      </aside>
      {selected && <GuestDetail guest={selected} />}
    </div>
  </div>;
}

function GuestAvatar({ guest }: { guest: GuestProfile }) {
  return <b className="bo-avatar">{guest.name.split(/[\s&]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("")}</b>;
}

function GuestDetail({ guest }: { guest: GuestProfile }) {
  const [note, setNote] = useState(guest.privateNotes);
  return <section className="bo-guest-detail">
    <header><GuestAvatar guest={guest} /><div><div className="bo-loyalty">{guest.loyalty.tier}</div><h2>{guest.name}</h2><p>{guest.city} · {guest.language}</p></div><button type="button"><Mail /> Écrire</button></header>
    <div className="bo-contact-row"><a href={`mailto:${guest.email}`}>{guest.email}</a><a href={`tel:${guest.phone}`}>{guest.phone}</a>{guest.birthday && <span>Anniversaire : {guest.birthday}</span>}</div>
    <div className="bo-tags">{guest.tags.map((item) => <span key={item}>{item}<button type="button" aria-label={`Retirer le tag ${item}`}>×</button></span>)}<button type="button">+ Ajouter un tag</button></div>
    <div className="bo-loyalty-grid"><article><small>Séjours</small><strong>{guest.loyalty.stays}</strong></article><article><small>Nuits</small><strong>{guest.loyalty.nights}</strong></article><article><small>Valeur voyageur</small><strong>{guest.loyalty.value.toLocaleString("fr-FR")} €</strong></article><article><small>Niveau</small><strong>{guest.loyalty.tier}</strong></article></div>
    <div className="bo-guest-columns">
      <div>
        <section className="bo-card"><h3>Préférences</h3><ul className="bo-chips">{guest.preferences.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="bo-card"><h3><PawPrint /> Animaux</h3>{guest.pets.length ? guest.pets.map((pet) => <article className="bo-pet" key={pet.name}><b>{pet.name}</b><span>{pet.type}</span><small>{pet.notes}</small></article>) : <p className="bo-muted">Aucun animal renseigné.</p>}</section>
        <section className="bo-card"><h3>Notes privées</h3><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} /><div className="bo-note-actions"><small>Visible uniquement par l’équipe autorisée.</small><button type="button">Enregistrer</button></div></section>
      </div>
      <section className="bo-card bo-timeline"><h3>Historique complet</h3>{guest.timeline.map((item) => { const Icon = eventIcons[item.kind]; return <article key={item.id}><i><Icon /></i><div><time>{item.date}</time><strong>{item.title}</strong><p>{item.detail}</p></div></article>; })}</section>
    </div>
  </section>;
}
