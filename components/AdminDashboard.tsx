"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { BackOfficeReservation, BackOfficeSnapshot } from "@/platform/admin/contracts";
import { StaffAccess } from "@/components/admin/StaffAccess";
import { describeWelcomeBaskets } from "@/platform/reservations/welcome-baskets";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { TodayOverview } from "@/components/admin/dashboard/TodayOverview";
import { dateTime, money, shortDate, Status } from "@/components/admin/dashboard/format";
import {
  type DashboardView as View,
  isDashboardView,
} from "@/components/admin/dashboard/navigation";
import {
  BlockDatesForm,
  ManualReservationForm,
  ReservationActions,
  ReservationDetail,
} from "@/components/admin/dashboard/ReservationWorkspaceParts";
import { Pagination } from "@/components/admin/dashboard/Pagination";

const RESERVATIONS_PER_PAGE = 50;

const GuestMessagesAdmin = dynamic(() =>
  import("@/components/admin/GuestMessagesAdmin").then((module) => module.GuestMessagesAdmin),
);
const RevenueMarketingAdmin = dynamic(() =>
  import("@/components/admin/RevenueMarketingAdmin").then((module) => module.RevenueMarketingAdmin),
);
const PremiumOperations = dynamic(() =>
  import("@/components/admin/PremiumOperations").then((module) => module.PremiumOperations),
);
const ChannelManagerAdmin = dynamic(() =>
  import("@/components/admin/ChannelManagerAdmin").then((module) => module.ChannelManagerAdmin),
);
const HousekeepingAdmin = dynamic(() =>
  import("@/components/admin/HousekeepingAdmin").then((module) => module.HousekeepingAdmin),
);
const CarnetCmsAdmin = dynamic(() =>
  import("@/components/admin/CarnetCmsAdmin").then((module) => module.CarnetCmsAdmin),
);
const HeritageMediaAdmin = dynamic(() =>
  import("@/components/admin/HeritageMediaAdmin").then((module) => module.HeritageMediaAdmin),
);
const GuestBookAdmin = dynamic(() =>
  import("@/components/admin/GuestBookAdmin").then((module) => module.GuestBookAdmin),
);
const YieldManagementAdmin = dynamic(() =>
  import("@/components/admin/YieldManagementAdmin").then((module) => module.YieldManagementAdmin),
);
const ExperienceServicesAdmin = dynamic(() =>
  import("@/components/admin/ExperienceServicesAdmin").then(
    (module) => module.ExperienceServicesAdmin,
  ),
);
const FiscalityAdmin = dynamic(() =>
  import("@/components/admin/FiscalityAdmin").then((module) => module.FiscalityAdmin),
);
const LegalCenterAdmin = dynamic(() =>
  import("@/components/admin/LegalCenterAdmin").then((module) => module.LegalCenterAdmin),
);
const PremiumCrmAdmin = dynamic(() =>
  import("@/components/admin/PremiumCrmAdmin").then((module) => module.PremiumCrmAdmin),
);
const DocumentCenterAdmin = dynamic(() =>
  import("@/components/admin/DocumentCenterAdmin").then((module) => module.DocumentCenterAdmin),
);

function nights(reservation: BackOfficeReservation) {
  return Math.round(
    (Date.parse(`${reservation.departure}T12:00:00Z`) -
      Date.parse(`${reservation.arrival}T12:00:00Z`)) /
      86_400_000,
  );
}

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<BackOfficeSnapshot | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [message, setMessage] = useState(
    "Connectez-vous avec votre compte professionnel pour ouvrir le Back Office.",
  );
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [serverResults, setServerResults] = useState<{ id: string; label: string; view: View }[]>(
    [],
  );
  const [dark, setDark] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [reservationMode, setReservationMode] = useState<"list" | "create" | "block">("list");
  const [reservationPage, setReservationPage] = useState(1);

  useEffect(() => {
    setDark(window.localStorage.getItem("beaux-rivages-admin-theme") === "dark");
    const requestedView = new URL(window.location.href).searchParams.get("view");
    if (isDashboardView(requestedView)) setView(requestedView);
  }, []);

  useEffect(() => {
    if (!data) return;
    const refresh = window.setInterval(
      () => {
        void fetch("/api/auth/staff", { cache: "no-store" });
      },
      30 * 60 * 1_000,
    );
    return () => window.clearInterval(refresh);
  }, [data]);

  useEffect(() => {
    const normalized = query.trim();
    if (!data || normalized.length < 2) {
      setServerResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch(`/api/admin/search?q=${encodeURIComponent(normalized)}`, {
        signal: controller.signal,
      })
        .then(async (response) => (response.ok ? response.json() : { results: [] }))
        .then((payload: { results?: { id: string; label: string; view: string }[] }) => {
          setServerResults(
            (payload.results ?? []).filter(
              (item): item is { id: string; label: string; view: View } =>
                isDashboardView(item.view),
            ),
          );
        })
        .catch(() => undefined);
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [data, query]);

  const selectView = (nextView: View) => {
    setView(nextView);
    const url = new URL(window.location.href);
    if (nextView === "dashboard") url.searchParams.delete("view");
    else url.searchParams.set("view", nextView);
    window.history.replaceState({}, "", url);
  };

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
        return setMessage(payload.error ?? "Accès impossible.");
      }
      setToken(accessToken);
      setData(payload);
      setMessage(
        `Données actualisées à ${new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(payload.generatedAt))}.`,
      );
    } catch {
      setMessage("Connexion interrompue. Les dernières données restent affichées. Réessayez.");
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
      if (payload.action === "update_housekeeping") {
        setData((current) =>
          current
            ? {
                ...current,
                operations: {
                  ...current.operations,
                  housekeeping: current.operations.housekeeping.map((task) =>
                    task.id === payload.taskId
                      ? {
                          ...task,
                          status: String(payload.status),
                          checklist: payload.checklist as typeof task.checklist,
                        }
                      : task,
                  ),
                },
              }
            : current,
        );
      } else if (payload.action === "update_maintenance") {
        setData((current) =>
          current
            ? {
                ...current,
                operations: {
                  ...current.operations,
                  maintenance: current.operations.maintenance.map((incident) =>
                    incident.id === payload.incidentId
                      ? {
                          ...incident,
                          status: String(payload.status),
                        }
                      : incident,
                  ),
                },
              }
            : current,
        );
      } else if (payload.action === "update_notification") {
        setData((current) =>
          current
            ? {
                ...current,
                operations: {
                  ...current.operations,
                  notifications: current.operations.notifications.map((notification) =>
                    notification.id === payload.notificationId
                      ? {
                          ...notification,
                          readAt: payload.read ? new Date().toISOString() : null,
                        }
                      : notification,
                  ),
                },
              }
            : current,
        );
      } else {
        await load(token);
      }
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
      setMessage("Remboursement demandé. Le statut sera mis à jour après confirmation.");
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
  const paginatedReservations = useMemo(() => {
    const lastPage = Math.max(1, Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE));
    const safePage = Math.min(reservationPage, lastPage);
    return filteredReservations.slice(
      (safePage - 1) * RESERVATIONS_PER_PAGE,
      safePage * RESERVATIONS_PER_PAGE,
    );
  }, [filteredReservations, reservationPage]);
  const globalResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!data || normalized.length < 2) return [];
    const localResults = [
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
    const unique = new Map(
      [...localResults, ...serverResults].map((item) => [`${item.view}-${item.id}`, item]),
    );
    return [...unique.values()].slice(0, 16);
  }, [data, query, serverResults]);
  const selectedReservation =
    data?.reservations.find((item) => item.id === selectedReservationId) ?? null;

  if (!data) return <StaffAccess busy={busy} message={message} onAuthenticated={load} />;

  return (
    <div className={`admin-workspace${dark ? " admin-workspace--dark" : ""}`}>
      <DashboardHeader
        view={view}
        onView={selectView}
        query={query}
        onQuery={setQuery}
        results={globalResults}
        onResult={(result) => {
          selectView(result.view);
          setSelectedReservationId(result.view === "reservations" ? result.id : null);
        }}
        dark={dark}
        onTheme={() => {
          const next = !dark;
          setDark(next);
          window.localStorage.setItem("beaux-rivages-admin-theme", next ? "dark" : "light");
        }}
        onSignOut={() => void signOut()}
        busy={busy}
        onRefresh={() => void load()}
      />
      <p className="admin-live-status" role="status">
        {message}
      </p>

      {view === "dashboard" && <TodayOverview data={data} />}
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
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setReservationPage(1);
                  }}
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
                    {paginatedReservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>
                          <strong>{reservation.guestName}</strong>
                          <small>{reservation.reference}</small>
                          {describeWelcomeBaskets(reservation.options).included !== "Aucun" ? (
                            <small>
                              {describeWelcomeBaskets(reservation.options).included}
                              {describeWelcomeBaskets(reservation.options).extra !== "Aucun"
                                ? ` + ${describeWelcomeBaskets(reservation.options).extra}`
                                : ""}
                            </small>
                          ) : null}
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
                          {reservation.guestId ? (
                            <a
                              className="admin-link-button"
                              href={`?view=voyageurs&guest=${reservation.guestId}`}
                            >
                              Fiche CRM
                            </a>
                          ) : null}
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
              <Pagination
                page={reservationPage}
                pageSize={RESERVATIONS_PER_PAGE}
                total={filteredReservations.length}
                onPage={setReservationPage}
              />
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
      {view === "patrimoine" && <HeritageMediaAdmin token={token} notify={setMessage} />}
      {view === "livre-or" && <GuestBookAdmin token={token} notify={setMessage} />}
      {view === "fiscalite" && <FiscalityAdmin token={token} notify={setMessage} />}
      {view === "juridique" && <LegalCenterAdmin token={token} notify={setMessage} />}
      {(view === "calendrier" ||
        view === "paiements" ||
        view === "conciergerie" ||
        view === "menage" ||
        view === "maintenance" ||
        view === "parametres") && (
        <PremiumOperations data={data} view={view} busy={busy} onSubmit={operate} />
      )}

      {view === "voyageurs" && <PremiumCrmAdmin token={token} notify={setMessage} />}

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

      {view === "documents" && <DocumentCenterAdmin token={token} notify={setMessage} />}

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
              <small>Aucun paiement en ligne actif</small>
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
              <h3>Historique des paiements</h3>
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
