"use client";

import { useCallback, useEffect, useState } from "react";
import type { GuestMessage, MessageType, PropertyId } from "@/platform/guest-messaging/contracts";
import type { BackOfficeReservation } from "@/platform/admin/contracts";

const propertyOptions: { id: PropertyId; label: string }[] = [
  { id: "chai-des-tortues", label: "Le Chai des Tortues" },
  { id: "villa-raie-manta", label: "Villa Raie Manta" },
  { id: "nid-d-ete", label: "Le Nid d’Été" },
];

export function GuestMessagesAdmin({ token, notify, reservations }: { token: string; notify: (message: string) => void; reservations: BackOfficeReservation[] }) {
  const [reservationId, setReservationId] = useState("");
  const [propertyId, setPropertyId] = useState<PropertyId>("chai-des-tortues");
  const [type, setType] = useState<MessageType>("booking_confirmation");
  const [preview, setPreview] = useState<GuestMessage | null>(null);
  const [override, setOverride] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/guest-messages/preview", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type,
        data: reservations.find((item) => item.id === reservationId) ? (() => {
          const reservation = reservations.find((item) => item.id === reservationId)!;
          const [guestFirstName, ...lastName] = reservation.guestName.trim().split(/\s+/);
          return {
            reservationId: reservation.id, guestFirstName, guestLastName: lastName.join(" ") || undefined,
            arrivalDate: reservation.arrival, departureDate: reservation.departure, adults: reservation.adults,
            children: reservation.children, babies: reservation.babies, pets: reservation.pets,
            bookingSource: ["direct", "airbnb", "booking", "abritel"].includes(reservation.channel) ? reservation.channel : "other",
          };
        })() : undefined,
      }),
    });
    const payload = await response.json() as { message?: GuestMessage; error?: string };
    if (!response.ok || !payload.message) return notify(payload.error ?? "Prévisualisation impossible.");
    setPreview(payload.message);
  }, [notify, propertyId, reservationId, reservations, token, type]);
  useEffect(() => { void load(); }, [load]);
  const copy = async (channel: "Airbnb" | "Booking") => {
    if (!preview) return;
    await navigator.clipboard.writeText(`${preview.text}${override.trim() ? `\n\n${override.trim()}` : ""}`);
    notify(`Version texte copiée pour ${channel}.`);
  };
  return <section className="admin-panel">
    <div className="admin-panel__heading"><div><p className="eyebrow">Relation voyageurs</p><h2>Messages voyageurs</h2></div><p>Prévisualisation et préparation uniquement. Aucun envoi réel automatique n’est activé.</p></div>
    <div className="guest-message-controls">
      <label>Réservation<select value={reservationId} onChange={(event) => {
        const id = event.target.value;
        setReservationId(id);
        const reservation = reservations.find((item) => item.id === id);
        if (reservation && propertyOptions.some((item) => item.id === reservation.propertySlug)) setPropertyId(reservation.propertySlug as PropertyId);
      }}><option value="">Prévisualisations de démonstration</option>{reservations.filter((item) => !["cancelled", "declined"].includes(item.status)).map((item) => <option key={item.id} value={item.id}>{item.reference} · {item.guestName} · {item.propertyName}</option>)}</select></label>
      <label>Réservation de démonstration<select value={propertyId} onChange={(event) => setPropertyId(event.target.value as PropertyId)}>{propertyOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>Catégorie<select value={type} onChange={(event) => setType(event.target.value as MessageType)}><option value="booking_confirmation">Confirmation de réservation</option><option value="arrival">Message d’arrivée</option><option value="departure">Départ</option></select></label>
      <label>Date et heure programmées<input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /></label>
    </div>
    <div className="guest-message-actions">
      <button type="button" onClick={() => void load()}>Prévisualiser</button>
      <button type="button" onClick={() => void copy("Airbnb")}>Copier pour Airbnb</button>
      <button type="button" onClick={() => void copy("Booking")}>Copier pour Booking</button>
      <button type="button" onClick={() => notify("Test préparé pour Stéphanie — envoi désactivé en développement.")}>Envoyer un test à Stéphanie</button>
      <button type="button" disabled={!scheduledAt} onClick={() => notify(`Programmation simulée pour le ${new Date(scheduledAt).toLocaleString("fr-FR")}.`)}>Programmer l’envoi</button>
      <button type="button" onClick={() => notify("Statut simulé : marqué comme envoyé.")}>Marquer comme envoyé</button>
      {type === "departure" && <button type="button" onClick={() => notify("Historique : aucun envoi réel pour cette prévisualisation.")}>Voir l’historique</button>}
    </div>
    <label className="guest-message-override">Paragraphe exceptionnel<textarea rows={4} value={override} onChange={(event) => setOverride(event.target.value)} placeholder="Ajout interne ponctuel — ne pas saisir de code d’accès ici." /></label>
    {preview && <div className="guest-message-preview-grid">
      <article><h3>Version HTML</h3><iframe title={`Prévisualisation ${preview.subject}`} srcDoc={preview.html} sandbox="" /></article>
      <article><h3>Version texte</h3><pre>{preview.text}{override.trim() ? `\n\n${override}` : ""}</pre></article>
    </div>}
  </section>;
}
