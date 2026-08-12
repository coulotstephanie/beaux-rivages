"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function TeleworkInquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/teletravail-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) form.reset();
  }

  return (
    <form className="telework-form" onSubmit={submit}>
      <div className="telework-form__grid">
        <label>Nom et prénom<input name="name" autoComplete="name" required /></label>
        <label>Entreprise ou organisme <span>— facultatif</span><input name="company" autoComplete="organization" /></label>
        <label>Adresse électronique<input name="email" type="email" autoComplete="email" required /></label>
        <label>Numéro de téléphone<input name="phone" type="tel" autoComplete="tel" required /></label>
        <label>Motif du séjour<select name="reason" required defaultValue=""><option value="" disabled>Choisir</option><option>Télétravail</option><option>Mission professionnelle</option><option>Chantier</option><option>Remplacement saisonnier</option><option>Remplacement médical</option><option>Formation</option><option>Événement professionnel</option><option>Autre</option></select></label>
        <label>Date d’arrivée souhaitée<input name="arrivalDate" type="date" /></label>
        <label>Date de départ souhaitée<input name="departureDate" type="date" /></label>
        <label>Durée approximative<input name="approximateDuration" placeholder="Ex. trois semaines" /></label>
        <label>Nombre d’occupants<input name="occupants" type="number" min="1" max="10" required /></label>
        <label>Nombre de chambres souhaitées<input name="bedrooms" type="number" min="1" max="4" required /></label>
        <label className="telework-form__wide">Maison préférée<select name="preferredHouse" required defaultValue="sans-preference"><option value="sans-preference">Sans préférence</option><option value="chai-des-tortues">Le Chai des Tortues · Île de Ré</option><option value="villa-raie-manta">Villa Raie Manta · Île de Ré</option><option value="nid-d-ete">Le Nid d’Été · Île d’Oléron</option></select></label>
        <label className="telework-form__wide">Message et besoins particuliers<textarea name="message" rows={6} required minLength={10} /></label>
        <label className="telework-form__consent telework-form__wide"><input name="consent" type="checkbox" required /> <span>J’accepte que les informations transmises soient utilisées pour répondre à ma demande, conformément à la <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.</span></label>
      </div>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Envoi en cours…" : "Recevoir une proposition"}</button>
      <p className="telework-form__reassurance" role="status">
        {status === "success" ? "Merci. Stéphanie ou Bruno vous répondra personnellement." : status === "error" ? "L’envoi n’a pas abouti. Vous pouvez nous appeler ou nous écrire directement." : "Réponse personnalisée de Stéphanie et Bruno, sans engagement."}
      </p>
    </form>
  );
}
