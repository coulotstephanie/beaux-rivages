"use client";

import { FormEvent, useState } from "react";
import type { HospitalityServiceSlug } from "@/hospitalityServices";

export function ExperienceRequestForm({
  experience,
}: {
  experience: Extract<HospitalityServiceSlug, "demande-en-mariage" | "anniversaire">;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/experience-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experience,
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        desiredDate: data.get("date"),
        house: data.get("house"),
        budget: data.get("budget"),
        project: data.get("project"),
        consent: data.get("consent") === "on",
      }),
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  };
  return (
    <form className="experience-request-form" onSubmit={submit}>
      <div>
        <label>
          Nom
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          E-mail
          <input name="email" required type="email" autoComplete="email" />
        </label>
        <label>
          Téléphone
          <input name="phone" required type="tel" autoComplete="tel" />
        </label>
        <label>
          Date souhaitée
          <input name="date" required type="date" />
        </label>
        <label>
          Maison
          <select name="house" required>
            <option value="">À choisir</option>
            <option value="chai-des-tortues">Le Chai des Tortues</option>
            <option value="villa-raie-manta">Villa Raie Manta</option>
            <option value="nid-d-ete">Le Nid d’Été</option>
          </select>
        </label>
        <label>
          Budget indicatif
          <input name="budget" inputMode="numeric" placeholder="Ex. 500 €" />
        </label>
        <label className="wide">
          Votre projet
          <textarea name="project" required minLength={20} rows={7} />
        </label>
        <label className="wide experience-request-form__consent">
          <input name="consent" type="checkbox" required /> J’accepte que Beaux Rivages utilise ces
          informations uniquement pour répondre à ma demande.
        </label>
      </div>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Demander un devis"}
      </button>
      <p role="status">
        {status === "success"
          ? "Votre demande est enregistrée. Stéphanie ou Bruno vous répondra personnellement."
          : status === "error"
            ? "La demande n’a pas pu être envoyée. Réessayez dans quelques instants."
            : "Aucun paiement n’est demandé. La proposition reste à valider avec vous."}
      </p>
    </form>
  );
}
