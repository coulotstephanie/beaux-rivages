"use client";

import { useEffect, useState } from "react";
import type { StayAccessPayload } from "@/platform/traveler/contracts";
import { conciergeSuggestions } from "@/conciergeEngine";
import { SmartWeatherAdvisor } from "@/components/SmartWeatherAdvisor";

const steps = ["Réservation", "Paiement", "Préparation", "Arrivée", "Séjour", "Départ", "Merci"];

export function StayPortal({ initialToken = "" }: { initialToken?: string }) {
  const [token, setToken] = useState(initialToken);
  const [stay, setStay] = useState<StayAccessPayload | null>(null);
  const [message, setMessage] = useState("Utilisez le lien sécurisé reçu après confirmation.");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [testimonial, setTestimonial] = useState("");
  const load = async (accessToken: string) => {
    if (!accessToken) return;
    const response = await fetch("/api/stay", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payload = (await response.json()) as StayAccessPayload & { error?: string };
    if (!response.ok) {
      setStay(null);
      setMessage(payload.error ?? "Accès impossible.");
      return;
    }
    setStay(payload);
    setMessage("Séjour chargé.");
  };
  useEffect(() => {
    if (initialToken) void load(initialToken);
  }, [initialToken]);
  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("beaux-rivages-favorites") ?? "[]") as string[]);
    } catch {
      setFavorites([]);
    }
  }, []);
  const toggleFavorite = (id: string) =>
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("beaux-rivages-favorites", JSON.stringify(next));
      return next;
    });
  if (!stay)
    return (
      <div className="stay-portal__login">
        <h2>Ouvrir mon séjour</h2>
        <p>Votre accès personnel protège les documents, paiements et informations d’arrivée.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void load(token);
          }}
        >
          <label htmlFor="stay-token">Code d’accès sécurisé</label>
          <input
            id="stay-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoComplete="one-time-code"
            required
          />
          <button type="submit">Accéder à mon séjour</button>
        </form>
        <p role="status">{message}</p>
      </div>
    );
  const today = new Date().toISOString().slice(0, 10);
  const activeStep = today < stay.arrival ? 2 : today <= stay.departure ? 4 : 6;
  const countdown = Math.max(
    0,
    Math.ceil((Date.parse(`${stay.arrival}T12:00:00`) - Date.now()) / 86_400_000),
  );
  const guide = conciergeSuggestions
    .filter(
      (item) =>
        stay.guideSlugs.includes(item.id) ||
        ["conseil", "marche", "itineraire-lumiere"].includes(item.id),
    )
    .slice(0, 6);
  return (
    <div className="stay-portal">
      <header>
        <p className="eyebrow">Réservation {stay.reference}</p>
        <h2>Bienvenue, {stay.travelerName}.</h2>
        <p>
          {stay.propertyName} · du{" "}
          {new Date(`${stay.arrival}T12:00:00`).toLocaleDateString("fr-FR")} au{" "}
          {new Date(`${stay.departure}T12:00:00`).toLocaleDateString("fr-FR")}
        </p>
        {today < stay.arrival ? (
          <strong className="stay-countdown">J−{countdown} avant votre arrivée</strong>
        ) : today <= stay.departure ? (
          <strong className="stay-countdown">Votre séjour est en cours</strong>
        ) : null}
      </header>
      <ol className="stay-timeline">
        {steps.map((step, index) => (
          <li
            key={step}
            className={index <= activeStep ? "is-complete" : ""}
            aria-current={index === activeStep ? "step" : undefined}
          >
            <span>{index + 1}</span>
            <strong>{step}</strong>
            <small>
              {index === 0
                ? "Confirmation enregistrée"
                : index === 1
                  ? `${stay.depositPaid} € d’acompte · ${stay.balanceRemaining} € restant`
                  : index === 2
                    ? "La maison se prépare"
                    : index === 3
                      ? "Informations accessibles au bon moment"
                      : index === 4
                        ? "Stéphanie & Bruno restent disponibles"
                        : index === 5
                          ? "Départ avant l’horaire convenu"
                          : "Merci pour votre confiance"}
            </small>
          </li>
        ))}
      </ol>
      <div className="stay-portal__grid">
        <section>
          <h3>Votre réservation</h3>
          <dl>
            <div>
              <dt>Voyageurs</dt>
              <dd>{stay.guests}</dd>
            </div>
            <div>
              <dt>Acompte</dt>
              <dd>{stay.depositPaid} €</dd>
            </div>
            <div>
              <dt>Solde</dt>
              <dd>{stay.balanceRemaining} €</dd>
            </div>
          </dl>
          {stay.balanceRemaining > 0 && (
            <div className="stay-portal__payments">
              <p>
                Règlement par virement bancaire ou Chèques‑Vacances, selon les instructions
                transmises par Stéphanie et Bruno.
              </p>
            </div>
          )}
          <p role="status">{message}</p>
        </section>
        <section>
          <h3>Vos expériences</h3>
          {stay.options.length || stay.experiences?.length ? (
            <ul>
              {stay.options.map((option) => (
                <li key={option}>{option}</li>
              ))}
              {stay.experiences?.map((experience) => (
                <li key={experience}>{experience}</li>
              ))}
            </ul>
          ) : (
            <p>Aucune attention ajoutée.</p>
          )}
          {stay.specialRequests && Object.values(stay.specialRequests).some(Boolean) && (
            <div>
              <h4>Demandes particulières</h4>
              <p>
                {[
                  stay.specialRequests.occasion,
                  stay.specialRequests.message,
                  stay.specialRequests.allergies,
                  stay.specialRequests.lateArrival,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}
        </section>
        <section>
          <h3>Stéphanie & Bruno</h3>
          <a href="tel:+33617260094">+33 6 17 26 00 94</a>
          <a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a>
        </section>
        <section>
          <h3>Documents</h3>
          {stay.documents.map((document) => (
            <span key={document.id}>
              <a
                href={`/api/documents/contract?token=${encodeURIComponent(token)}&document=${document.id}`}
              >
                PDF · {document.title}
              </a>
              <a
                href={`/api/documents/contract?token=${encodeURIComponent(token)}&document=${document.id}&format=html`}
                target="_blank"
                rel="noreferrer"
              >
                Version HTML imprimable
              </a>
            </span>
          ))}
        </section>
        <section>
          <h3>Arrivée</h3>
          {stay.arrivalDetails?.accessCode ? (
            <>
              <p>Code d’accès</p>
              <strong>{stay.arrivalDetails.accessCode}</strong>
              <p>{stay.arrivalDetails.parking}</p>
            </>
          ) : (
            <p>
              Les informations sensibles seront disponibles à partir du{" "}
              {stay.arrivalDetails
                ? new Date(stay.arrivalDetails.availableFrom).toLocaleString("fr-FR")
                : "moment prévu"}
              .
            </p>
          )}
        </section>
        <section>
          <h3>Guide personnalisé</h3>
          <a href="/carnet">Ouvrir le Carnet Beaux Rivages →</a>
        </section>
      </div>
      <section className="stay-personal-guide">
        <p className="eyebrow">Votre programme</p>
        <h3>Nos idées pour ce séjour</h3>
        <div>
          {guide.map((item) => (
            <article key={item.id}>
              <button
                type="button"
                aria-pressed={favorites.includes(item.id)}
                aria-label={
                  favorites.includes(item.id)
                    ? `Retirer ${item.title} des favoris`
                    : `Ajouter ${item.title} aux favoris`
                }
                onClick={() => toggleFavorite(item.id)}
              >
                {favorites.includes(item.id) ? "♥" : "♡"}
              </button>
              <span>{item.kind}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <a href={item.href}>Voir →</a>
            </article>
          ))}
        </div>
      </section>
      <SmartWeatherAdvisor compact />
      {today > stay.departure ? (
        <section className="stay-testimonial">
          <p className="eyebrow">Après le séjour</p>
          <h3>Racontez-nous votre plus beau moment.</h3>
          <label htmlFor="stay-testimonial">Votre témoignage</label>
          <textarea
            id="stay-testimonial"
            rows={5}
            value={testimonial}
            onChange={(event) => setTestimonial(event.target.value)}
          />
          <a
            className="primary-button"
            href={`mailto:coulotstephanie@gmail.com?subject=${encodeURIComponent(`Témoignage ${stay.reference}`)}&body=${encodeURIComponent(testimonial)}`}
          >
            Envoyer à Stéphanie & Bruno
          </a>
        </section>
      ) : null}
    </div>
  );
}
