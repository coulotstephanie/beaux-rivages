"use client";

import { Bell, Check, Mail, MessageSquareText, Send, Users } from "lucide-react";
import { useMemo, useState } from "react";

type Channel = "email" | "sms" | "notification";
const templates = [
  { id: "welcome", label: "Bienvenue", subject: "Bienvenue chez Beaux Rivages", body: "Bonjour {{prénom}}, nous sommes heureux de vous accueillir bientôt à {{maison}}." },
  { id: "arrival", label: "Avant arrivée", subject: "Votre arrivée approche", body: "Bonjour {{prénom}}, votre séjour commence le {{date_arrivée}}. Voici les informations utiles." },
  { id: "key", label: "Code boîte à clés", subject: "Votre accès à {{maison}}", body: "Bonjour {{prénom}}, votre code personnel est {{code_accès}}. Il sera actif à partir de {{heure_arrivée}}." },
  { id: "departure", label: "Départ", subject: "Votre départ de demain", body: "Bonjour {{prénom}}, nous espérons que votre séjour vous a plu. Le départ est prévu avant {{heure_départ}}." },
  { id: "thanks", label: "Remerciement", subject: "Merci pour votre séjour", body: "Merci {{prénom}} d’avoir choisi Beaux Rivages. Nous serions ravis de vous accueillir à nouveau." },
  { id: "promotion", label: "Promotion", subject: "Une parenthèse à retrouver", body: "Bonjour {{prénom}}, profitez de votre avantage {{niveau_fidélité}} pour un prochain séjour." },
  { id: "birthday", label: "Anniversaire", subject: "Joyeux anniversaire {{prénom}}", body: "Toute l’équipe Beaux Rivages vous souhaite une merveilleuse journée." },
];
const segments = [
  ["Tous les voyageurs", 482], ["Arrivées demain", 6], ["Arrivées semaine", 21],
  ["Départs", 8], ["Anciens clients", 364], ["Clients fidèles", 76],
  ["Animaux", 91], ["Familles", 208],
] as const;

export function CommunicationCenter() {
  const [channel, setChannel] = useState<Channel>("email");
  const [templateId, setTemplateId] = useState("arrival");
  const [segment, setSegment] = useState("Arrivées demain");
  const [prepared, setPrepared] = useState(false);
  const template = templates.find((item) => item.id === templateId) ?? templates[0];
  const recipients = segments.find(([label]) => label === segment)?.[1] ?? 0;
  const preview = useMemo(() => template.body
    .replaceAll("{{prénom}}", "Élodie")
    .replaceAll("{{maison}}", "Le Chai des Tortues")
    .replaceAll("{{date_arrivée}}", "3 août")
    .replaceAll("{{code_accès}}", "••••••")
    .replaceAll("{{heure_arrivée}}", "17 h")
    .replaceAll("{{heure_départ}}", "10 h")
    .replaceAll("{{niveau_fidélité}}", "Or"), [template]);

  return <div className="bo-page">
    <div className="bo-page__heading"><div><p className="bo-eyebrow">Relation voyageurs</p><h1>Communications</h1><p>Le bon message, à la bonne personne, au bon moment.</p></div><button className="bo-primary" type="button">+ Nouveau modèle</button></div>
    <div className="bo-channel-tabs" role="tablist">{([["email", Mail, "Email"], ["sms", MessageSquareText, "SMS"], ["notification", Bell, "Notifications"]] as const).map(([value, Icon, label]) => <button key={value} role="tab" aria-selected={channel === value} onClick={() => setChannel(value)}><Icon />{label}{value === "sms" && <small>Non connecté</small>}</button>)}</div>
    <div className="bo-communication-grid">
      <section className="bo-card bo-template-list"><div className="bo-card__heading"><div><p className="bo-eyebrow">Bibliothèque</p><h2>Modèles</h2></div></div>{templates.map((item) => <button type="button" key={item.id} className={templateId === item.id ? "is-active" : ""} onClick={() => { setTemplateId(item.id); setPrepared(false); }}><Mail /><span><strong>{item.label}</strong><small>{item.subject}</small></span><Check /></button>)}</section>
      <section className="bo-card bo-composer">
        <div className="bo-card__heading"><div><p className="bo-eyebrow">Composer</p><h2>{template.label}</h2></div><span className="bo-state is-active">Brouillon</span></div>
        <label>Destinataires<select value={segment} onChange={(e) => { setSegment(e.target.value); setPrepared(false); }}>{segments.map(([label, count]) => <option key={label}>{label} · {count}</option>)}</select></label>
        <label>Objet<input value={template.subject} readOnly /></label>
        <label>Message<textarea value={template.body} readOnly rows={7} /></label>
        <div className="bo-variables"><small>Variables disponibles</small>{["{{prénom}}", "{{maison}}", "{{date_arrivée}}", "{{code_accès}}", "{{niveau_fidélité}}"].map((item) => <button type="button" key={item}>{item}</button>)}</div>
        <div className="bo-send-summary"><Users /><span><strong>{recipients} destinataires</strong><small>Les doublons et désabonnements seront exclus lors d’une future connexion fournisseur.</small></span></div>
        <button className="bo-primary bo-send" type="button" onClick={() => setPrepared(true)} disabled={channel === "sms"}><Send />{channel === "sms" ? "Fournisseur SMS non connecté" : "Préparer l’envoi groupé"}</button>
        {prepared && <p className="bo-prepared" role="status"><Check /> Envoi simulé et prêt pour validation humaine. Aucun message n’a été transmis.</p>}
      </section>
      <aside className="bo-card bo-preview"><p className="bo-eyebrow">Aperçu personnalisé</p><div><small>À : Élodie Martin</small><strong>{template.subject.replace("{{prénom}}", "Élodie")}</strong><p>{preview}</p><footer>Stéphanie & Bruno<br />Beaux Rivages</footer></div><p><Bell /> Chaque envoi réel nécessitera une confirmation explicite.</p></aside>
    </div>
  </div>;
}
