"use client";

import { FormEvent, useState } from "react";

const properties = ["Le Chai des Tortues", "Villa Raie Manta", "Le Nid d’Été"];

export function BookingRequestForm() {
  const [personalWelcome, setPersonalWelcome] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = Array.from(data.entries()).map(([key, value]) => `${key} : ${value || "—"}`);
    const subject = encodeURIComponent("Demande de séjour — Beaux Rivages");
    const body = encodeURIComponent(`Bonjour Stéphanie,\n\nJe souhaite préparer un séjour chez Beaux Rivages.\n\n${lines.join("\n")}\n\nMerci de me recontacter.`);
    window.location.href = `mailto:coulotstephanie@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="booking-form" onSubmit={submit}>
      <div className="form-field full"><label htmlFor="property">Maison souhaitée</label><select id="property" name="Maison"><option>Je souhaite être conseillé(e)</option>{properties.map((property) => <option key={property}>{property}</option>)}</select></div>
      <div className="form-field"><label htmlFor="arrival">Arrivée</label><input id="arrival" name="Arrivée" type="date" required /></div>
      <div className="form-field"><label htmlFor="departure">Départ</label><input id="departure" name="Départ" type="date" required /></div>
      <div className="form-field"><label htmlFor="guests">Voyageurs</label><input id="guests" name="Voyageurs" type="number" min="1" max="8" defaultValue="2" /></div>
      <div className="form-field"><label htmlFor="name">Nom</label><input id="name" name="Nom" type="text" required /></div>
      <div className="form-field"><label htmlFor="email">E-mail</label><input id="email" name="E-mail" type="email" required /></div>
      <div className="form-field"><label htmlFor="phone">Téléphone</label><input id="phone" name="Téléphone" type="tel" /></div>

      <fieldset className="form-choice full"><legend>Votre arrivée</legend>
        <label className="radio-card"><input type="radio" name="Type d’arrivée" value="Arrivée autonome incluse" defaultChecked onChange={() => setPersonalWelcome(false)} /><span><strong>Arrivée autonome — incluse</strong><small>Installez-vous librement à partir de 16 h grâce à la boîte à clés sécurisée.</small></span></label>
        <label className="radio-card"><input type="radio" name="Type d’arrivée" value="Arrivée Personnalisée Beaux Rivages" onChange={() => setPersonalWelcome(true)} /><span><strong>Arrivée Personnalisée Beaux Rivages</strong><small>Stéphanie ou Bruno vous accueille et partage ses conseils.</small></span></label>
        {personalWelcome && <p className="inline-info">Cette option sera confirmée selon les disponibilités de vos hôtes.</p>}
      </fieldset>

      <div className="form-field full"><label htmlFor="options">Personnalisez votre séjour</label><textarea id="options" name="Options" rows={4} placeholder="Linge, Pack Signature, serviettes de plage, animal, expérience romantique…" /></div>
      <div className="form-field full"><label htmlFor="message">Votre séjour idéal</label><textarea id="message" name="Message" rows={5} placeholder="Parlez-nous de vos envies : plage, vélo, gastronomie, calme, vue mer…" /></div>
      <button className="primary-button booking-submit" type="submit">Préparer ma demande</button>
      <p className="form-note">Votre application de messagerie s’ouvrira avec les informations déjà préparées. Aucun message n’est envoyé sans votre validation.</p>
    </form>
  );
}
