"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { BackOfficeReservation, BackOfficeSnapshot } from "@/platform/admin/contracts";
import { GuestMessagesAdmin } from "@/components/admin/GuestMessagesAdmin";
import { RevenueMarketingAdmin } from "@/components/admin/RevenueMarketingAdmin";
import { PremiumOperations } from "@/components/admin/PremiumOperations";
import { ChannelManagerAdmin } from "@/components/admin/ChannelManagerAdmin";
import { HousekeepingAdmin } from "@/components/admin/HousekeepingAdmin";
import { CarnetCmsAdmin } from "@/components/admin/CarnetCmsAdmin";
import { GuestBookAdmin } from "@/components/admin/GuestBookAdmin";
import { StaffAccess } from "@/components/admin/StaffAccess";
import { YieldManagementAdmin } from "@/components/admin/YieldManagementAdmin";
import { ExperienceServicesAdmin } from "@/components/admin/ExperienceServicesAdmin";

type View =
  | "dashboard"
  | "calendrier"
  | "reservations"
  | "messages"
  | "revenue"
  | "yield"
  | "channel"
  | "housekeeping"
  | "experiences-services"
  | "carnet"
  | "livre-or"
  | "voyageurs"
  | "logements"
  | "documents"
  | "paiements"
  | "conciergerie"
  | "menage"
  | "maintenance"
  | "statistiques"
  | "pilotage"
  | "parametres";
const views: { id: View; label: string }[] = [
  { id: "dashboard", label: "Aujourd’hui" },
  { id: "calendrier", label: "Calendrier" },
  { id: "reservations", label: "Réservations" },
  { id: "messages", label: "Messages voyageurs" },
  { id: "revenue", label: "Revenue & Marketing" },
  { id: "yield", label: "Yield Management" },
  { id: "channel", label: "Channel Manager" },
  { id: "housekeeping", label: "Housekeeping" },
  { id: "experiences-services", label: "Expériences & Services" },
  { id: "carnet", label: "Carnet CMS" },
  { id: "livre-or", label: "Livre d’Or" },
  { id: "voyageurs", label: "Voyageurs" },
  { id: "logements", label: "Logements" },
  { id: "documents", label: "Documents" },
  { id: "paiements", label: "Paiements" },
  { id: "conciergerie", label: "Conciergerie" },
  { id: "menage", label: "Ménage" },
  { id: "maintenance", label: "Maintenance" },
  { id: "statistiques", label: "Statistiques" },
  { id: "pilotage", label: "Pilotage" },
  { id: "parametres", label: "Paramètres" },
];

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  pending_payment: "Paiement attendu",
  requested: "Demande",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Terminée",
  declined: "Refusée",
  paid: "Payé",
  pending: "En attente",
  signed: "Signé",
  generated: "Généré",
  sent: "Envoyé",
  viewed: "Consulté",
  healthy: "Opérationnel",
  success: "Réussi",
  failed: "Échec",
  warning: "Attention",
  error: "Erreur",
  queued: "En attente",
  delivered: "Livré",
  bounced: "Rejeté",
  opened: "Ouvert",
  authorized: "Autorisé",
};

function money(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function shortDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value.slice(0, 10)}T12:00:00`));
}

function dateTime(value: string | null) {
  if (!value) return "Jamais";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(value),
  );
}

function nights(reservation: BackOfficeReservation) {
  return Math.round(
    (Date.parse(`${reservation.departure}T12:00:00Z`) -
      Date.parse(`${reservation.arrival}T12:00:00Z`)) /
      86_400_000,
  );
}

function Status({ value }: { value: string }) {
  return (
    <span className={`admin-status admin-status--${value}`}>{statusLabels[value] ?? value}</span>
  );
}

function ReservationList({
  rows,
  empty = "Aucune réservation.",
}: {
  rows: BackOfficeReservation[];
  empty?: string;
}) {
  if (!rows.length) return <p className="admin-empty">{empty}</p>;
  return (
    <div className="admin-list">
      {rows.map((reservation) => (
        <article key={reservation.id} className="admin-reservation-row">
          <div>
            <strong>{reservation.guestName}</strong>
            <span>
              {reservation.propertyName} · {nights(reservation)} nuit(s)
            </span>
          </div>
          <div>
            <strong>{shortDate(reservation.arrival)}</strong>
            <span>au {shortDate(reservation.departure)}</span>
          </div>
          <Status value={reservation.status} />
          <strong>{money(reservation.totalCents)}</strong>
        </article>
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<BackOfficeSnapshot | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [message, setMessage] = useState(
    "Saisissez le jeton administrateur pour ouvrir le Back Office.",
  );
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [reservationMode, setReservationMode] = useState<"list" | "create" | "block">("list");

  useEffect(() => {
    setDark(window.localStorage.getItem("beaux-rivages-admin-theme") === "dark");
  }, []);

  const call = async (path: string, init?: RequestInit, accessToken = token) =>
    fetch(path, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

  const load = async (accessToken = token) => {
    setBusy(true);
    try {
      const response = await call("/api/admin/operations", undefined, accessToken);
      const payload = (await response.json()) as BackOfficeSnapshot & { error?: string };
      if (!response.ok) {
        setData(null);
        return setMessage(payload.error ?? "Accès impossible.");
      }
      setToken(accessToken);
      setData(payload);
      setMessage(
        `Données actualisées à ${new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(payload.generatedAt))}.`,
      );
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/auth/staff", { method: "DELETE" });
    setToken("");
    setData(null);
    setMessage("Vous êtes déconnecté du Back Office.");
  };

  const operate = async (payload: Record<string, unknown>) => {
    setBusy(true);
    try {
      const response = await call("/api/admin/operations", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) return setMessage(result.error ?? "Opération impossible.");
      setMessage("Opération enregistrée et journalisée.");
      if (
        payload.action === "update_reservation" &&
        ["cancelled", "declined"].includes(String(payload.status))
      ) {
        setSelectedReservationId(null);
      }
      setReservationMode("list");
      await load(token);
    } finally {
      setBusy(false);
    }
  };

  const download = async (entity: "reservations" | "payments" | "audit_logs") => {
    const response = await fetch(`/api/admin/export?entity=${entity}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return setMessage("Export impossible.");
    const url = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `beaux-rivages-${entity}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Export CSV préparé.");
  };
  const refund = async (paymentId: string) => {
    if (!window.confirm("Confirmer le remboursement intégral de ce paiement TEST ?")) return;
    setBusy(true);
    try {
      const response = await call("/api/admin/payments/refund", {
        method: "POST",
        body: JSON.stringify({ paymentId, reason: "Remboursement intégral depuis le Back Office" }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) return setMessage(payload.error ?? "Remboursement impossible.");
      setMessage("Remboursement Stripe TEST demandé. Le webhook mettra le statut à jour.");
      await load(token);
    } finally {
      setBusy(false);
    }
  };

  const filteredReservations = useMemo(() => {
    const visibleReservations =
      data?.reservations.filter(
        (reservation) => !["cancelled", "declined"].includes(reservation.status),
      ) ?? [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return visibleReservations;
    return visibleReservations.filter((reservation) =>
      [
        reservation.guestName,
        reservation.guestEmail,
        reservation.reference,
        reservation.propertyName,
        reservation.channel,
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [data, query]);
  const globalResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!data || normalized.length < 2) return [];
    return [
      ...data.reservations
        .filter((item) =>
          [item.reference, item.guestName, item.guestEmail, item.propertyName].some((value) =>
            value.toLowerCase().includes(normalized),
          ),
        )
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          label: `${item.reference} · ${item.guestName}`,
          view: "reservations" as View,
        })),
      ...data.documents.contracts
        .filter((item) =>
          `${item.number} ${item.reservationReference}`.toLowerCase().includes(normalized),
        )
        .slice(0, 3)
        .map((item) => ({
          id: item.id,
          label: `Contrat ${item.number}`,
          view: "documents" as View,
        })),
      ...data.documents.invoices
        .filter((item) =>
          `${item.number} ${item.reservationReference}`.toLowerCase().includes(normalized),
        )
        .slice(0, 3)
        .map((item) => ({
          id: item.id,
          label: `Facture ${item.number}`,
          view: "documents" as View,
        })),
    ];
  }, [data, query]);
  const selectedReservation =
    data?.reservations.find((item) => item.id === selectedReservationId) ?? null;

  if (!data) return <StaffAccess busy={busy} message={message} onAuthenticated={load} />;

  return (
    <div className={`admin-workspace${dark ? " admin-workspace--dark" : ""}`}>
      <div className="admin-workspace__bar">
        <nav aria-label="Rubriques du Back Office">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-global-search">
          <input
            aria-label="Recherche globale"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher partout…"
          />
          {globalResults.length > 0 && (
            <div>
              {globalResults.map((result) => (
                <button
                  type="button"
                  key={`${result.view}-${result.id}`}
                  onClick={() => {
                    setView(result.view);
                    setSelectedReservationId(result.view === "reservations" ? result.id : null);
                  }}
                >
                  {result.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="admin-theme"
          aria-label={dark ? "Activer le mode clair" : "Activer le mode sombre"}
          onClick={() => {
            const next = !dark;
            setDark(next);
            window.localStorage.setItem("beaux-rivages-admin-theme", next ? "dark" : "light");
          }}
        >
          {dark ? "☀ Clair" : "☾ Sombre"}
        </button>
        <button type="button" className="admin-theme" onClick={() => void signOut()}>
          Se déconnecter
        </button>
        <button type="button" className="admin-refresh" disabled={busy} onClick={() => void load()}>
          {busy ? "Actualisation…" : "Actualiser"}
        </button>
      </div>
      <p className="admin-live-status" role="status">
        {message}
      </p>

      {view === "dashboard" && (
        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <p className="eyebrow">{shortDate(data.today)}</p>
              <h2>La journée en un regard</h2>
            </div>
            <p>Les priorités opérationnelles, mises à jour depuis Supabase.</p>
          </div>
          <div className="admin-kpis">
            <article>
              <span>Réservations</span>
              <strong>{data.reservations.length}</strong>
              <small>tous canaux</small>
            </article>
            <article>
              <span>CA du mois</span>
              <strong>{money(data.metrics.revenueMonthCents)}</strong>
            </article>
            <article>
              <span>CA annuel</span>
              <strong>{money(data.metrics.revenueYearCents)}</strong>
            </article>
            <article>
              <span>Panier moyen</span>
              <strong>
                {money(
                  data.reservations.length
                    ? Math.round(
                        data.reservations.reduce((sum, item) => sum + item.totalCents, 0) /
                          data.reservations.length,
                      )
                    : 0,
                )}
              </strong>
            </article>
            <article>
              <span>Part directe</span>
              <strong>{data.metrics.directShare} %</strong>
            </article>
            <article>
              <span>Séjour moyen</span>
              <strong>{data.metrics.averageStayNights}</strong>
              <small>nuits</small>
            </article>
            <article>
              <span>Arrivées</span>
              <strong>{data.operational.arrivals.length}</strong>
              <small>aujourd’hui</small>
            </article>
            <article>
              <span>Départs</span>
              <strong>{data.operational.departures.length}</strong>
              <small>aujourd’hui</small>
            </article>
            <article>
              <span>Sur place</span>
              <strong>{data.operational.inHouse.length}</strong>
              <small>séjour en cours</small>
            </article>
            <article className={data.operational.requests.length ? "needs-attention" : ""}>
              <span>Demandes</span>
              <strong>{data.operational.requests.length}</strong>
              <small>à traiter</small>
            </article>
            <article className={data.operational.pendingPayments.length ? "needs-attention" : ""}>
              <span>Paiements</span>
              <strong>{data.operational.pendingPayments.length}</strong>
              <small>{money(data.metrics.pendingPaymentsCents)} à suivre</small>
            </article>
            <article className={data.operational.unsignedContracts.length ? "needs-attention" : ""}>
              <span>Contrats</span>
              <strong>{data.operational.unsignedContracts.length}</strong>
              <small>non signés</small>
            </article>
            <article
              className={
                data.operations.maintenance.some(
                  (item) => !["resolved", "closed"].includes(item.status),
                )
                  ? "needs-attention"
                  : ""
              }
            >
              <span>Maintenance</span>
              <strong>
                {
                  data.operations.maintenance.filter(
                    (item) => !["resolved", "closed"].includes(item.status),
                  ).length
                }
              </strong>
              <small>incident(s) ouvert(s)</small>
            </article>
            <article>
              <span>Notifications</span>
              <strong>{data.operations.notifications.filter((item) => !item.readAt).length}</strong>
              <small>non lue(s)</small>
            </article>
          </div>
          <div className="admin-two-columns">
            <article className="admin-card">
              <h3>Arrivées aujourd’hui</h3>
              <ReservationList
                rows={data.operational.arrivals}
                empty="Aucune arrivée aujourd’hui."
              />
            </article>
            <article className="admin-card">
              <h3>Départs aujourd’hui</h3>
              <ReservationList
                rows={data.operational.departures}
                empty="Aucun départ aujourd’hui."
              />
            </article>
            <article className="admin-card">
              <h3>Voyageurs actuellement présents</h3>
              <ReservationList
                rows={data.operational.inHouse}
                empty="Aucun séjour direct en cours."
              />
            </article>
            <article className="admin-card">
              <h3>Demandes à traiter</h3>
              <ReservationList
                rows={data.operational.requests}
                empty="Toutes les demandes sont traitées."
              />
            </article>
            <article className="admin-card">
              <h3>Les 7 prochains jours</h3>
              <ReservationList
                rows={data.operational.upcoming7Days}
                empty="Aucune arrivée prévue."
              />
            </article>
            <article className="admin-card">
              <h3>Préparations des maisons</h3>
              {data.operations.housekeeping.slice(0, 6).map((task) => (
                <div className="admin-health-row" key={task.id}>
                  <div>
                    <strong>{task.propertyName}</strong>
                    <span>
                      {dateTime(task.scheduledFor)} ·{" "}
                      {task.checklist.filter((item) => item.done).length}/{task.checklist.length}{" "}
                      contrôles
                    </span>
                  </div>
                  <Status value={task.status} />
                </div>
              ))}
            </article>
          </div>
        </section>
      )}

      {view === "reservations" && (
        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <p className="eyebrow">Planning & dossiers</p>
              <h2>Gestion des réservations</h2>
            </div>
            <div className="admin-actions">
              <button type="button" onClick={() => setReservationMode("create")}>
                Ajouter une réservation
              </button>
              <button type="button" onClick={() => setReservationMode("block")}>
                Bloquer des dates
              </button>
            </div>
          </div>
          {reservationMode === "create" && (
            <ManualReservationForm
              busy={busy}
              properties={data.properties}
              onCancel={() => setReservationMode("list")}
              onSubmit={operate}
            />
          )}
          {reservationMode === "block" && (
            <BlockDatesForm
              busy={busy}
              properties={data.properties}
              onCancel={() => setReservationMode("list")}
              onSubmit={operate}
            />
          )}
          {reservationMode === "list" && (
            <>
              <div className="admin-search">
                <label htmlFor="reservation-search">
                  Rechercher par voyageur, référence ou logement
                </label>
                <input
                  id="reservation-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ex. Dupont ou BR-2026…"
                />
              </div>
              <div className="admin-calendar-strip" aria-label="Prochaines réservations">
                {filteredReservations
                  .filter(
                    (row) =>
                      row.departure >= data.today &&
                      !["cancelled", "declined"].includes(row.status),
                  )
                  .slice(0, 8)
                  .map((row) => (
                    <article key={row.id}>
                      <span>{shortDate(row.arrival)}</span>
                      <strong>{row.propertyName}</strong>
                      <small>{row.guestName}</small>
                    </article>
                  ))}
              </div>
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Voyageur</th>
                      <th>Séjour</th>
                      <th>Logement</th>
                      <th>Origine</th>
                      <th>Statut</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>
                          <strong>{reservation.guestName}</strong>
                          <small>{reservation.reference}</small>
                        </td>
                        <td>
                          {shortDate(reservation.arrival)} → {shortDate(reservation.departure)}
                          <small>{nights(reservation)} nuit(s)</small>
                        </td>
                        <td>{reservation.propertyName}</td>
                        <td>{reservation.channel}</td>
                        <td>
                          <Status value={reservation.status} />
                        </td>
                        <td>{money(reservation.totalCents)}</td>
                        <td>
                          <button
                            type="button"
                            className="admin-link-button"
                            onClick={() => setSelectedReservationId(reservation.id)}
                          >
                            Ouvrir
                          </button>
                          <ReservationActions
                            reservation={reservation}
                            busy={busy}
                            onSubmit={operate}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedReservation && (
                <ReservationDetail
                  reservation={selectedReservation}
                  payments={data.pilotage.recentPayments.filter(
                    (item) => item.reservationReference === selectedReservation.reference,
                  )}
                  deposits={data.operations.deposits.filter(
                    (item) => item.reservationReference === selectedReservation.reference,
                  )}
                  onClose={() => setSelectedReservationId(null)}
                />
              )}
            </>
          )}
        </section>
      )}

      {view === "messages" && (
        <GuestMessagesAdmin token={token} notify={setMessage} reservations={data.reservations} />
      )}
      {view === "revenue" && <RevenueMarketingAdmin token={token} notify={setMessage} />}
      {view === "yield" && <YieldManagementAdmin token={token} notify={setMessage} />}
      {view === "channel" && (
        <ChannelManagerAdmin token={token} properties={data.properties} notify={setMessage} />
      )}
      {view === "housekeeping" && <HousekeepingAdmin token={token} notify={setMessage} />}
      {view === "experiences-services" && (
        <ExperienceServicesAdmin token={token} notify={setMessage} />
      )}
      {view === "carnet" && <CarnetCmsAdmin token={token} notify={setMessage} />}
      {view === "livre-or" && <GuestBookAdmin token={token} notify={setMessage} />}
      {(view === "calendrier" ||
        view === "paiements" ||
        view === "conciergerie" ||
        view === "menage" ||
        view === "maintenance" ||
        view === "parametres") && (
        <PremiumOperations data={data} view={view} busy={busy} onSubmit={operate} />
      )}

      {view === "voyageurs" && (
        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <p className="eyebrow">Relation voyageurs</p>
              <h2>Historique et fidélité</h2>
            </div>
            <p>{data.guests.length} voyageur(s) connu(s)</p>
          </div>
          <div className="admin-guest-grid">
            {data.guests.map((guest) => (
              <article key={guest.id}>
                <div className="admin-avatar" aria-hidden="true">
                  {guest.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h3>{guest.name}</h3>
                <a href={`mailto:${guest.email}`}>{guest.email}</a>
                {guest.phone && <a href={`tel:${guest.phone}`}>{guest.phone}</a>}
                <dl>
                  <div>
                    <dt>Séjours</dt>
                    <dd>{guest.stays}</dd>
                  </div>
                  <div>
                    <dt>Nuits</dt>
                    <dd>{guest.nights}</dd>
                  </div>
                  <div>
                    <dt>Animaux</dt>
                    <dd>{guest.pets}</dd>
                  </div>
                </dl>
                <small>Dernier départ : {shortDate(guest.lastStay)}</small>
              </article>
            ))}
          </div>
          {!data.guests.length && (
            <p className="admin-empty">
              Les futurs voyageurs apparaîtront ici après leur première demande.
            </p>
          )}
        </section>
      )}

      {view === "logements" && (
        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <p className="eyebrow">Inventaire commercial</p>
              <h2>Logements, tarifs et disponibilités</h2>
            </div>
            <div className="admin-actions">
              <a href="/administration/tarifs">Modifier les tarifs</a>
              <a href="/administration/calendriers">Gérer les calendriers</a>
            </div>
          </div>
          <div className="admin-property-grid">
            {data.properties.map((property) => (
              <article key={property.id}>
                <div>
                  <Status value={property.status} />
                  <h3>{property.name}</h3>
                </div>
                <strong>{property.occupancyRate} %</strong>
                <span>occupation estimée</span>
                <dl>
                  <div>
                    <dt>Nuits occupées</dt>
                    <dd>{property.occupiedNights}</dd>
                  </div>
                  <div>
                    <dt>Réservation directe</dt>
                    <dd>{property.directNights}</dd>
                  </div>
                  <div>
                    <dt>Plateformes</dt>
                    <dd>{property.platformNights}</dd>
                  </div>
                  <div>
                    <dt>CA direct</dt>
                    <dd>{money(property.revenueCents)}</dd>
                  </div>
                </dl>
                <a href={`/maisons/${property.slug}`}>Voir la page du logement</a>
              </article>
            ))}
          </div>
          <div className="admin-callout">
            <h3>Tarifs, saisons, promotions et options</h3>
            <p>
              Le moteur tarifaire reste la source de vérité. Les réglages sont accessibles dans
              l’espace Tarifs, sans modifier le code du site.
            </p>
            <a href="/administration/tarifs">Ouvrir le moteur tarifaire</a>
          </div>
        </section>
      )}

      {view === "documents" && (
        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <p className="eyebrow">Centre documentaire</p>
              <h2>Contrats et factures</h2>
            </div>
            <p>Suivi des générations, signatures et exports.</p>
          </div>
          <div className="admin-two-columns">
            <article className="admin-card">
              <h3>Contrats</h3>
              <DocumentList rows={data.documents.contracts} />
            </article>
            <article className="admin-card">
              <h3>Factures</h3>
              <DocumentList
                rows={data.documents.invoices.map((row) => ({
                  ...row,
                  number: `${row.number} · ${money(row.totalCents)}`,
                }))}
              />
            </article>
          </div>
          <div className="admin-callout">
            <h3>Générateur PDF Beaux Rivages</h3>
            <p>
              Les contrats HTML, PDF et imprimables sont prêts. L’envoi et la signature resteront
              désactivés jusqu’à la validation juridique et au branchement Yousign.
            </p>
          </div>
        </section>
      )}

      {view === "statistiques" && (
        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <p className="eyebrow">Performance commerciale</p>
              <h2>Statistiques</h2>
            </div>
            <p>Les revenus des plateformes ne sont pas disponibles dans les flux iCal.</p>
          </div>
          <div className="admin-kpis admin-kpis--revenue">
            <article>
              <span>CA aujourd’hui</span>
              <strong>{money(data.metrics.revenueTodayCents)}</strong>
            </article>
            <article>
              <span>CA ce mois</span>
              <strong>{money(data.metrics.revenueMonthCents)}</strong>
            </article>
            <article>
              <span>CA cette année</span>
              <strong>{money(data.metrics.revenueYearCents)}</strong>
            </article>
            <article>
              <span>Séjour moyen</span>
              <strong>{data.metrics.averageStayNights}</strong>
              <small>nuits</small>
            </article>
            <article>
              <span>Part directe</span>
              <strong>{data.metrics.directShare} %</strong>
            </article>
          </div>
          <div className="admin-stat-bars">
            {data.properties.map((property) => (
              <article key={property.id}>
                <div>
                  <strong>{property.name}</strong>
                  <span>{property.occupancyRate} %</span>
                </div>
                <div className="admin-progress">
                  <i style={{ width: `${Math.min(100, property.occupancyRate)}%` }} />
                </div>
                <small>
                  {property.directNights} nuits directes · {property.platformNights} nuits
                  plateformes
                </small>
              </article>
            ))}
          </div>
          <p className="admin-note">
            Le chiffre d’affaires affiché correspond aux réservations directes confirmées. iCal
            transmet uniquement les périodes occupées, jamais les tarifs réellement encaissés sur
            Airbnb, Booking ou Abritel.
          </p>
        </section>
      )}

      {view === "pilotage" && (
        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <p className="eyebrow">Supervision technique</p>
              <h2>Mode pilotage</h2>
            </div>
            <p>
              {data.pilotage.recentErrors.length
                ? `${data.pilotage.recentErrors.length} alerte(s) récente(s)`
                : "Aucune alerte récente"}
            </p>
          </div>
          <div className="admin-health-grid">
            <article>
              <span>Sources iCal</span>
              <strong>
                {
                  data.pilotage.calendarSources.filter((source) => source.status === "healthy")
                    .length
                }
                /{data.pilotage.calendarSources.length}
              </strong>
              <small>opérationnelles</small>
            </article>
            <article>
              <span>E-mails échoués</span>
              <strong>
                {(data.pilotage.emailStatus.failed ?? 0) + (data.pilotage.emailStatus.bounced ?? 0)}
              </strong>
            </article>
            <article>
              <span>Paiements échoués</span>
              <strong>{data.pilotage.paymentStatus.failed ?? 0}</strong>
              <small>Stripe test non activé</small>
            </article>
            <article>
              <span>Alertes</span>
              <strong>{data.pilotage.recentErrors.length}</strong>
            </article>
          </div>
          <div className="admin-two-columns">
            <article className="admin-card">
              <h3>État des calendriers</h3>
              {data.pilotage.calendarSources.map((source) => (
                <div className="admin-health-row" key={source.id}>
                  <div>
                    <strong>{source.property}</strong>
                    <span>
                      {source.provider} · synchro {dateTime(source.lastSyncedAt)}
                    </span>
                  </div>
                  <Status value={source.status} />
                </div>
              ))}
            </article>
            <article className="admin-card">
              <h3>Dernières synchronisations</h3>
              {data.pilotage.recentSyncs.slice(0, 10).map((sync) => (
                <div className="admin-health-row" key={sync.id}>
                  <div>
                    <strong>
                      {sync.property} · {sync.provider}
                    </strong>
                    <span>
                      {sync.importedCount} import(s), {sync.errorCount} erreur(s) ·{" "}
                      {dateTime(sync.startedAt)}
                    </span>
                  </div>
                  <Status value={sync.status} />
                </div>
              ))}
            </article>
            <article className="admin-card">
              <h3>Alertes récentes</h3>
              {data.pilotage.recentErrors.map((error) => (
                <div className="admin-alert" key={error.id}>
                  <strong>{error.area}</strong>
                  <span>{error.message}</span>
                  <small>{dateTime(error.occurredAt)}</small>
                </div>
              ))}
              {!data.pilotage.recentErrors.length && (
                <p className="admin-empty">Aucune anomalie récente détectée.</p>
              )}
            </article>
            <article className="admin-card">
              <h3>Paiements Stripe TEST</h3>
              {data.pilotage.recentPayments.map((payment) => (
                <div className="admin-health-row" key={payment.id}>
                  <div>
                    <strong>
                      {payment.guestName} · {money(payment.amountCents)}
                    </strong>
                    <span>
                      {payment.reservationReference} · {payment.kind} ·{" "}
                      {dateTime(payment.createdAt)}
                    </span>
                  </div>
                  <div className="admin-payment-actions">
                    <Status value={payment.status} />
                    {payment.refundable && (
                      <button type="button" disabled={busy} onClick={() => void refund(payment.id)}>
                        Rembourser
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!data.pilotage.recentPayments.length && (
                <p className="admin-empty">Aucun paiement enregistré.</p>
              )}
            </article>
            <article className="admin-card">
              <h3>Exports & journaux</h3>
              <div className="admin-export-stack">
                <button type="button" onClick={() => void download("reservations")}>
                  Exporter les réservations CSV
                </button>
                <button type="button" onClick={() => void download("payments")}>
                  Exporter les paiements CSV
                </button>
                <button type="button" onClick={() => void download("audit_logs")}>
                  Exporter le journal d’audit CSV
                </button>
              </div>
            </article>
          </div>
        </section>
      )}
    </div>
  );
}

function ManualReservationForm({
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
      totalCents: Math.round(Number(values.get("total")) * 100),
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
          Total TTC (€)
          <input name="total" type="number" min="0" step="0.01" defaultValue="0" required />
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

function BlockDatesForm({
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

function ReservationActions({
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

function ReservationDetail({
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
            </div>
            <div>
              <dt>Acompte prévu</dt>
              <dd>{money(reservation.depositDueCents)}</dd>
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
      </div>
    </aside>
  );
}

function DocumentList({
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
