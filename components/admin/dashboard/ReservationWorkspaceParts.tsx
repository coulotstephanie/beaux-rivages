"use client";

import { type FormEvent, useState } from "react";
import type { BackOfficeReservation, BackOfficeSnapshot } from "@/platform/admin/contracts";
import { describeWelcomeBaskets } from "@/platform/reservations/welcome-baskets";
import { dateTime, money, shortDate, Status, statusLabels } from "./format";

function nights(reservation: BackOfficeReservation) {
  return Math.round(
    (Date.parse(`${reservation.departure}T12:00:00Z`) -
      Date.parse(`${reservation.arrival}T12:00:00Z`)) /
      86_400_000,
  );
}

export function ManualReservationForm({
  properties,
  busy,
  onCancel,
  onSubmit,
}: {
  properties: BackOfficeSnapshot["properties"];
  busy: boolean;
  onCancel: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    void onSubmit({
      action: "create_reservation",
      propertySlug: values.get("propertySlug"),
      arrival: values.get("arrival"),
      departure: values.get("departure"),
      adults: Number(values.get("adults")),
      children: Number(values.get("children")),
      babies: Number(values.get("babies")),
      pets: Number(values.get("pets")),
      totalCents: values.get("total") ? Math.round(Number(values.get("total")) * 100) : undefined,
      overrideReason: values.get("overrideReason") || undefined,
      channel: values.get("channel"),
      status: values.get("status"),
      guest: {
        firstName: values.get("firstName"),
        lastName: values.get("lastName"),
        email: values.get("email"),
        phone: values.get("phone") || undefined,
        countryCode: "FR",
      },
    });
  };
  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="admin-editor__heading">
        <h3>Ajouter une réservation manuelle</h3>
        <p>La disponibilité sera vérifiée avant l’enregistrement.</p>
      </div>
      <div className="admin-form-grid">
        <label>
          Logement
          <select name="propertySlug" required>
            {properties.map((property) => (
              <option value={property.slug} key={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Arrivée
          <input name="arrival" type="date" required />
        </label>
        <label>
          Départ
          <input name="departure" type="date" required />
        </label>
        <label>
          Prénom
          <input name="firstName" required maxLength={100} />
        </label>
        <label>
          Nom
          <input name="lastName" required maxLength={100} />
        </label>
        <label>
          E-mail
          <input name="email" type="email" required />
        </label>
        <label>
          Téléphone
          <input name="phone" type="tel" />
        </label>
        <label>
          Adultes
          <input name="adults" type="number" min="1" max="30" defaultValue="2" required />
        </label>
        <label>
          Enfants
          <input name="children" type="number" min="0" max="30" defaultValue="0" required />
        </label>
        <label>
          Bébés
          <input name="babies" type="number" min="0" max="10" defaultValue="0" required />
        </label>
        <label>
          Animaux
          <input name="pets" type="number" min="0" max="10" defaultValue="0" required />
        </label>
        <label>
          Total exceptionnel (€)
          <input name="total" type="number" min="0" step="0.01" />
          <small>Laisser vide pour appliquer le calcul automatique.</small>
        </label>
        <label>
          Justification de la dérogation
          <input name="overrideReason" minLength={10} maxLength={500} />
        </label>
        <label>
          Origine
          <select name="channel">
            <option value="manual">Manuelle</option>
            <option value="direct">Directe</option>
          </select>
        </label>
        <label>
          Statut
          <select name="status">
            <option value="confirmed">Confirmée</option>
            <option value="requested">Demande</option>
          </select>
        </label>
      </div>
      <div className="admin-editor__actions">
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" disabled={busy}>
          Enregistrer
        </button>
      </div>
    </form>
  );
}

export function BlockDatesForm({
  properties,
  busy,
  onCancel,
  onSubmit,
}: {
  properties: BackOfficeSnapshot["properties"];
  busy: boolean;
  onCancel: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    void onSubmit({
      action: "block_dates",
      propertySlug: values.get("propertySlug"),
      arrival: values.get("arrival"),
      departure: values.get("departure"),
      note: values.get("note"),
    });
  };
  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="admin-editor__heading">
        <h3>Bloquer des dates</h3>
        <p>Pour travaux, usage personnel ou indisponibilité ponctuelle.</p>
      </div>
      <div className="admin-form-grid">
        <label>
          Logement
          <select name="propertySlug" required>
            {properties.map((property) => (
              <option value={property.slug} key={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Début
          <input name="arrival" type="date" required />
        </label>
        <label>
          Fin
          <input name="departure" type="date" required />
        </label>
        <label className="wide">
          Motif
          <input name="note" required minLength={2} maxLength={300} />
        </label>
      </div>
      <div className="admin-editor__actions">
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" disabled={busy}>
          Bloquer les dates
        </button>
      </div>
    </form>
  );
}

export function ReservationActions({
  reservation,
  busy,
  onSubmit,
}: {
  reservation: BackOfficeReservation;
  busy: boolean;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button type="button" className="admin-link-button" onClick={() => setOpen(true)}>
        Modifier
      </button>
    );
  return (
    <div className="admin-row-actions">
      <select
        aria-label={`Statut de ${reservation.reference}`}
        defaultValue={reservation.status}
        onChange={(event) => {
          void onSubmit({
            action: "update_reservation",
            reservationId: reservation.id,
            status: event.target.value,
          });
          setOpen(false);
        }}
        disabled={busy}
      >
        {["requested", "pending_payment", "confirmed", "completed", "cancelled", "declined"].map(
          (status) => (
            <option value={status} key={status}>
              {statusLabels[status]}
            </option>
          ),
        )}
      </select>
      <button type="button" onClick={() => setOpen(false)}>
        Fermer
      </button>
    </div>
  );
}

export function ReservationDetail({
  reservation,
  payments,
  deposits,
  onClose,
}: {
  reservation: BackOfficeReservation;
  payments: BackOfficeSnapshot["pilotage"]["recentPayments"];
  deposits: BackOfficeSnapshot["operations"]["deposits"];
  onClose: () => void;
}) {
  const paid = payments
    .filter((item) => ["paid", "authorized", "partially_refunded"].includes(item.status))
    .reduce((sum, item) => sum + item.amountCents - item.refundedCents, 0);
  return (
    <aside className="admin-reservation-detail" aria-labelledby="reservation-detail-title">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">{reservation.reference}</p>
          <h2 id="reservation-detail-title">{reservation.guestName}</h2>
        </div>
        <button type="button" onClick={onClose}>
          Fermer
        </button>
      </div>
      <div className="admin-detail-grid">
        <article>
          <h3>Séjour</h3>
          <dl>
            <div>
              <dt>Maison</dt>
              <dd>{reservation.propertyName}</dd>
            </div>
            <div>
              <dt>Plateforme</dt>
              <dd>{reservation.channel}</dd>
            </div>
            <div>
              <dt>Arrivée</dt>
              <dd>{shortDate(reservation.arrival)}</dd>
            </div>
            <div>
              <dt>Départ</dt>
              <dd>{shortDate(reservation.departure)}</dd>
            </div>
            <div>
              <dt>Durée</dt>
              <dd>{nights(reservation)} nuits</dd>
            </div>
            <div>
              <dt>Voyageurs</dt>
              <dd>
                {reservation.adults} adulte(s), {reservation.children} enfant(s),{" "}
                {reservation.babies} bébé(s), {reservation.pets} animal(aux)
              </dd>
            </div>
          </dl>
        </article>
        <article>
          <h3>Coordonnées</h3>
          <a href={`mailto:${reservation.guestEmail}`}>
            {reservation.guestEmail || "E-mail non renseigné"}
          </a>
          <a href={`tel:${reservation.guestPhone}`}>
            {reservation.guestPhone || "Téléphone non renseigné"}
          </a>
          {reservation.guestId ? (
            <a href={`?view=voyageurs&guest=${reservation.guestId}`}>Ouvrir la fiche CRM</a>
          ) : null}
        </article>
        <article>
          <h3>Finances</h3>
          <dl>
            <div>
              <dt>Prix du séjour</dt>
              <dd>{money(reservation.totalCents)}</dd>
            </div>
            <div>
              <dt>Taxe de séjour</dt>
              <dd>{money(reservation.touristTaxCents)}</dd>
              <dt>Personnes assujetties</dt>
              <dd>{reservation.touristTaxDetails.liableGuests}</dd>
              <dt>Personnes exonérées</dt>
              <dd>{reservation.touristTaxDetails.exemptGuests}</dd>
              <dt>Méthode de calcul</dt>
              <dd>{reservation.touristTaxDetails.method}</dd>
            </div>
            <div>
              <dt>Acompte prévu</dt>
              <dd>{money(reservation.depositDueCents)}</dd>
            </div>
            <div>
              <dt>Échéance du solde</dt>
              <dd>
                {reservation.fullPaymentRequired
                  ? "Paiement intégral immédiat"
                  : shortDate(reservation.balanceDueDate)}
              </dd>
            </div>
            <div>
              <dt>Paiements reçus</dt>
              <dd>{money(paid)}</dd>
            </div>
            <div>
              <dt>Restant</dt>
              <dd>{money(Math.max(0, reservation.totalCents - paid))}</dd>
            </div>
            <div>
              <dt>Statut du règlement</dt>
              <dd>
                {paid >= reservation.totalCents
                  ? "Réglé"
                  : paid < reservation.depositDueCents
                    ? "Acompte non reçu"
                    : reservation.balanceDueDate &&
                        reservation.balanceDueDate < new Date().toISOString().slice(0, 10)
                      ? "Solde en retard"
                      : "Solde à venir"}
              </dd>
            </div>
            <div>
              <dt>Caution</dt>
              <dd>
                {deposits.length
                  ? deposits.map((item) => `${money(item.amountCents)} · ${item.status}`).join(", ")
                  : "Non enregistrée"}
              </dd>
            </div>
          </dl>
        </article>
        <article>
          <h3>Options réservées</h3>
          <dl>
            <div>
              <dt>Accueil gourmand</dt>
              <dd>{describeWelcomeBaskets(reservation.options).included}</dd>
            </div>
            <div>
              <dt>Panier supplémentaire</dt>
              <dd>{describeWelcomeBaskets(reservation.options).extra}</dd>
            </div>
          </dl>
          {reservation.options.length ? (
            <ul>
              {reservation.options.map((item) => (
                <li key={item.code}>
                  {item.label} × {item.quantity} · {money(item.totalCents)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty">Aucune option réservée.</p>
          )}
        </article>
        <article>
          <h3>Expériences</h3>
          {reservation.experiences.length ? (
            <ul>
              {reservation.experiences.map((item) => (
                <li key={item.code}>
                  {item.label} · {money(item.totalCents)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty">Aucune expérience réservée.</p>
          )}
        </article>
        <article>
          <h3>Demandes particulières</h3>
          {Object.values(reservation.specialRequests).some(Boolean) ? (
            <dl>
              {reservation.specialRequests.occasion && (
                <div>
                  <dt>Occasion</dt>
                  <dd>{reservation.specialRequests.occasion}</dd>
                </div>
              )}
              {reservation.specialRequests.message && (
                <div>
                  <dt>Message</dt>
                  <dd>{reservation.specialRequests.message}</dd>
                </div>
              )}
              {reservation.specialRequests.allergies && (
                <div>
                  <dt>Allergies</dt>
                  <dd>{reservation.specialRequests.allergies}</dd>
                </div>
              )}
              {reservation.specialRequests.lateArrival && (
                <div>
                  <dt>Arrivée tardive</dt>
                  <dd>{reservation.specialRequests.lateArrival}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="admin-empty">Aucune demande particulière.</p>
          )}
        </article>
        <article>
          <h3>Acceptations juridiques</h3>
          <dl>
            <div>
              <dt>CGV</dt>
              <dd>Version {reservation.legalAcceptance.termsVersion}</dd>
            </div>
            <div>
              <dt>Acceptées le</dt>
              <dd>
                {reservation.legalAcceptance.termsAcceptedAt
                  ? dateTime(reservation.legalAcceptance.termsAcceptedAt)
                  : "Non renseigné"}
              </dd>
            </div>
            <div>
              <dt>Annulation</dt>
              <dd>Version {reservation.legalAcceptance.cancellationVersion}</dd>
            </div>
            <div>
              <dt>Prise en compte le</dt>
              <dd>
                {reservation.legalAcceptance.cancellationAcceptedAt
                  ? dateTime(reservation.legalAcceptance.cancellationAcceptedAt)
                  : "Non renseigné"}
              </dd>
            </div>
            <div>
              <dt>Règlement choisi</dt>
              <dd>
                {reservation.legalAcceptance.paymentMethod === "bank_transfer"
                  ? "Virement bancaire"
                  : reservation.legalAcceptance.paymentMethod === "holiday_voucher"
                    ? "Chèques‑Vacances"
                    : reservation.legalAcceptance.paymentMethod}
              </dd>
            </div>
          </dl>
        </article>
        <article>
          <h3>Historique du séjour</h3>
          {reservation.timeline.length ? (
            <ol className="admin-reservation-timeline">
              {reservation.timeline.map((event, index) => (
                <li key={`${event.occurredAt}-${event.eventType}-${index}`}>
                  <time>{dateTime(event.occurredAt)}</time>
                  <strong>{event.eventType}</strong>
                  <span>{event.origin}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="admin-empty">Aucun événement enregistré.</p>
          )}
        </article>
      </div>
    </aside>
  );
}

export function DocumentList({
  rows,
}: {
  rows: {
    id: string;
    number: string;
    status: string;
    reservationReference: string;
    updatedAt: string;
  }[];
}) {
  if (!rows.length) return <p className="admin-empty">Aucun document généré.</p>;
  return (
    <div className="admin-list">
      {rows.map((row) => (
        <div className="admin-document-row" key={row.id}>
          <div>
            <strong>{row.number}</strong>
            <span>
              {row.reservationReference} · {dateTime(row.updatedAt)}
            </span>
          </div>
          <Status value={row.status} />
        </div>
      ))}
    </div>
  );
}
