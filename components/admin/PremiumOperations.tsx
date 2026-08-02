"use client";

import { FormEvent } from "react";
import type { BackOfficeSnapshot } from "@/platform/admin/contracts";
import { AdminCalendarBoard } from "@/components/admin/AdminCalendarBoard";

type OperationView =
  "calendrier" | "paiements" | "conciergerie" | "menage" | "maintenance" | "parametres";
type Props = {
  data: BackOfficeSnapshot;
  view: OperationView;
  busy: boolean;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
};
const money = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value / 100);
const date = (value: string | null) =>
  value ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value)) : "—";

export function PremiumOperations({ data, view, busy, onSubmit }: Props) {
  if (view === "calendrier")
    return (
      <section className="admin-panel">
        <div className="admin-panel__heading">
          <div>
            <p className="eyebrow">Planning mensuel</p>
            <h2>Calendrier unifié</h2>
          </div>
          <a href="/administration/calendriers">Gérer les sources iCal</a>
        </div>
        <AdminCalendarBoard data={data} busy={busy} onSubmit={onSubmit} />
      </section>
    );

  if (view === "paiements")
    return (
      <section className="admin-panel">
        <div className="admin-panel__heading">
          <div>
            <p className="eyebrow">Registre financier</p>
            <h2>Paiements</h2>
          </div>
          <p>{money(data.metrics.pendingPaymentsCents)} restant à suivre</p>
        </div>
        <div className="admin-kpis">
          <article>
            <span>CA réservé</span>
            <strong>{money(data.metrics.bookedRevenueCents)}</strong>
          </article>
          <article>
            <span>CA encaissé</span>
            <strong>{money(data.metrics.collectedRevenueCents)}</strong>
          </article>
          <article>
            <span>Acomptes reçus</span>
            <strong>{money(data.metrics.receivedDepositsCents)}</strong>
          </article>
          <article>
            <span>Soldes reçus</span>
            <strong>{money(data.metrics.receivedBalancesCents)}</strong>
          </article>
          <article>
            <span>En retard</span>
            <strong>{money(data.metrics.overduePaymentsCents)}</strong>
          </article>
          <article>
            <span>Remboursements</span>
            <strong>{money(data.metrics.refundsCents)}</strong>
          </article>
        </div>
        <PaymentRecordForm data={data} busy={busy} onSubmit={onSubmit} />
        <div className="admin-two-columns">
          <article className="admin-card">
            <h3>Registre des virements</h3>
            {data.finance.payments.map((row) => (
              <div className="admin-health-row" key={row.id}>
                <div>
                  <strong>
                    {row.guestName} · {money(row.amountCents - row.refundedCents)}
                  </strong>
                  <span>
                    {row.reservationReference} · {row.kind} ·{" "}
                    {row.bankReference || "Sans référence"}
                  </span>
                  {data.reservations.find((reservation) => reservation.id === row.reservationId)
                    ?.guestId ? (
                    <a
                      href={`?view=voyageurs&guest=${data.reservations.find((reservation) => reservation.id === row.reservationId)?.guestId}`}
                    >
                      Fiche CRM
                    </a>
                  ) : null}
                </div>
                <span className="admin-status">{row.status}</span>
              </div>
            ))}
            {!data.finance.payments.length && (
              <p className="admin-empty">Aucun virement enregistré.</p>
            )}
          </article>
          <article className="admin-card">
            <h3>Rapprochement bancaire</h3>
            {data.operational.pendingPayments.slice(0, 50).map((reservation) => {
              const received = data.finance.payments
                .filter((payment) => payment.reservationId === reservation.id)
                .reduce((sum, payment) => sum + payment.amountCents - payment.refundedCents, 0);
              return (
                <Line
                  key={reservation.id}
                  title={`${reservation.reference} · ${reservation.guestName}`}
                  detail={`${money(Math.max(0, reservation.totalCents - received))} à rapprocher`}
                  status={
                    reservation.balanceDueDate && reservation.balanceDueDate < data.today
                      ? "retard"
                      : "attendu"
                  }
                />
              );
            })}
          </article>
        </div>
        <FinancialActions data={data} busy={busy} onSubmit={onSubmit} />
      </section>
    );

  if (view === "menage")
    return (
      <section className="admin-panel">
        <div className="admin-panel__heading">
          <div>
            <p className="eyebrow">Housekeeping</p>
            <h2>Ménage & préparation</h2>
          </div>
          <p>Check-lists synchronisées</p>
        </div>
        <div className="admin-property-grid">
          {data.operations.housekeeping.map((task) => (
            <article key={task.id}>
              <h3>{task.propertyName}</h3>
              <small>
                {date(task.scheduledFor)} · {task.assignee || "Non assigné"}
              </small>
              <div className="admin-checklist">
                {task.checklist.map((item) => (
                  <label key={item.id}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      disabled={busy}
                      onChange={() => {
                        const checklist = task.checklist.map((entry) =>
                          entry.id === item.id ? { ...entry, done: !entry.done } : entry,
                        );
                        void onSubmit({
                          action: "update_housekeeping",
                          taskId: task.id,
                          status: checklist.every((entry) => entry.done)
                            ? "completed"
                            : "in_progress",
                          checklist,
                        });
                      }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );

  if (view === "maintenance")
    return (
      <section className="admin-panel">
        <div className="admin-panel__heading">
          <div>
            <p className="eyebrow">Suivi technique</p>
            <h2>Maintenance</h2>
          </div>
          <p>Incidents et interventions</p>
        </div>
        <MaintenanceForm data={data} busy={busy} onSubmit={onSubmit} />
        <div className="admin-list">
          {data.operations.maintenance.map((item) => (
            <article className="admin-reservation-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.propertyName} · {item.description || "Sans description"}
                </span>
              </div>
              <span className="admin-status">{item.priority}</span>
              <select
                value={item.status}
                disabled={busy}
                onChange={(event) =>
                  void onSubmit({
                    action: "update_maintenance",
                    incidentId: item.id,
                    status: event.target.value,
                  })
                }
              >
                {["open", "assigned", "in_progress", "waiting", "resolved", "closed"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  ),
                )}
              </select>
            </article>
          ))}
        </div>
      </section>
    );

  if (view === "conciergerie")
    return (
      <section className="admin-panel">
        <div className="admin-panel__heading">
          <div>
            <p className="eyebrow">Expériences & attentions</p>
            <h2>Conciergerie</h2>
          </div>
          <a href="/personnaliser">Voir l’espace voyageur</a>
        </div>
        <ConciergeForm data={data} busy={busy} onSubmit={onSubmit} />
        <div className="admin-kpis">
          <article>
            <span>Nouvelles demandes</span>
            <strong>
              {data.operations.conciergeOrders.filter((item) => item.status === "requested").length}
            </strong>
          </article>
          <article>
            <span>Demandes spéciales</span>
            <strong>
              {data.operations.specialRequests.filter((item) => item.status === "requested").length}
            </strong>
          </article>
          <article>
            <span>À préparer</span>
            <strong>
              {
                data.operations.conciergeOrders.filter((item) =>
                  ["confirmed", "paid", "preparing"].includes(item.status),
                ).length
              }
            </strong>
          </article>
        </div>
        <div className="admin-two-columns">
          <article className="admin-card">
            <h3>Expériences demandées</h3>
            {data.operations.conciergeOrders.map((item) => (
              <div className="admin-health-row" key={item.id}>
                <div>
                  <strong>
                    {item.guestName} · {money(item.totalCents)}
                  </strong>
                  <span>
                    {item.reservationReference} · {item.itemCount} expérience(s) ·{" "}
                    {date(item.createdAt)}
                  </span>
                </div>
                <select
                  value={item.status}
                  disabled={busy}
                  onChange={(event) =>
                    void onSubmit({
                      action: "update_concierge_order",
                      orderId: item.id,
                      status: event.target.value,
                    })
                  }
                >
                  {[
                    "requested",
                    "confirmed",
                    "declined",
                    "payment_pending",
                    "paid",
                    "preparing",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            ))}
          </article>
          <article className="admin-card">
            <h3>Demandes spéciales</h3>
            {data.operations.specialRequests.map((item) => (
              <div className="admin-health-row" key={item.id}>
                <div>
                  <strong>
                    {item.guestName} · {item.occasion}
                  </strong>
                  <span>
                    {item.details}
                    {item.allergies ? ` · Allergies : ${item.allergies}` : ""}
                  </span>
                </div>
                <select
                  value={item.status}
                  disabled={busy}
                  onChange={(event) =>
                    void onSubmit({
                      action: "update_special_request",
                      requestId: item.id,
                      status: event.target.value,
                    })
                  }
                >
                  {["requested", "reviewing", "accepted", "declined", "completed"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            ))}
          </article>
          {data.operations.concierge.map((item) => (
            <article className="admin-card" key={item.id}>
              <span className="admin-status">{item.status}</span>
              <h3>
                {item.title}
                {item.isSurprise ? " · Surprise" : ""}
              </h3>
              <p>
                {item.guestName} · {item.reservationReference}
              </p>
              <small>
                {item.details || item.kind} · {date(item.scheduledFor)}
              </small>
            </article>
          ))}
        </div>
      </section>
    );

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2>Paramètres & intégrations</h2>
        </div>
      </div>
      <div className="admin-two-columns">
        <article className="admin-card">
          <h3>Modes de paiement</h3>
          {data.finance.methods.map((method) => (
            <label className="admin-checklist" key={method.method}>
              <input
                type="checkbox"
                checked={method.enabled}
                disabled={busy || method.method === "bank_transfer"}
                onChange={(event) =>
                  void onSubmit({
                    action: "update_payment_method",
                    method: method.method,
                    enabled: event.target.checked,
                  })
                }
              />
              {method.label}
              {method.method === "bank_transfer" ? " · obligatoire" : " · désactivé par défaut"}
            </label>
          ))}
        </article>
        <article className="admin-card">
          <h3>Calendriers connectés</h3>
          {data.pilotage.calendarSources.map((row) => (
            <Line key={row.id} title={row.property} detail={row.provider} status={row.status} />
          ))}
        </article>
        <article className="admin-card">
          <h3>Centre de notifications</h3>
          {data.operations.notifications.map((item) => (
            <button
              className="admin-notification"
              type="button"
              key={item.id}
              onClick={() =>
                void onSubmit({
                  action: "update_notification",
                  notificationId: item.id,
                  read: !item.readAt,
                })
              }
            >
              <strong>{item.title}</strong>
              <span>{item.body}</span>
              <small>
                {item.readAt ? "Lue" : "À lire"} · {date(item.createdAt)}
              </small>
            </button>
          ))}
          {!data.operations.notifications.length && (
            <p className="admin-empty">Aucune notification.</p>
          )}
        </article>
      </div>
    </section>
  );
}

function Line({ title, detail, status }: { title: string; detail: string; status: string }) {
  return (
    <div className="admin-health-row">
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <span className="admin-status">{status}</span>
    </div>
  );
}

function PaymentRecordForm({ data, busy, onSubmit }: Omit<Props, "view">) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void onSubmit({
      action: "record_payment",
      reservationId: form.get("reservationId"),
      kind: form.get("kind"),
      amountCents: Math.round(Number(form.get("amount")) * 100),
      receivedAt: new Date(String(form.get("receivedAt"))).toISOString(),
      bankReference: form.get("bankReference"),
      ibanLabel: form.get("ibanLabel") || undefined,
      comment: form.get("comment") || undefined,
      evidencePath: form.get("evidencePath") || undefined,
    });
    event.currentTarget.reset();
  };
  return (
    <form className="admin-editor admin-editor--compact" onSubmit={submit}>
      <h3>Enregistrer un virement reçu</h3>
      <div className="admin-form-grid">
        <label>
          Réservation
          <select name="reservationId" required>
            {data.operational.pendingPayments.map((reservation) => (
              <option key={reservation.id} value={reservation.id}>
                {reservation.reference} · {reservation.guestName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nature
          <select name="kind">
            <option value="deposit">Acompte reçu</option>
            <option value="balance">Solde reçu</option>
            <option value="full">Paiement intégral</option>
          </select>
        </label>
        <label>
          Montant reçu (€)
          <input name="amount" type="number" min="0.01" step="0.01" required />
        </label>
        <label>
          Date de réception
          <input name="receivedAt" type="datetime-local" required />
        </label>
        <label>
          Référence bancaire
          <input name="bankReference" required minLength={2} />
        </label>
        <label>
          Compte / IBAN utilisé
          <input name="ibanLabel" placeholder="Compte principal" />
        </label>
        <label className="wide">
          Commentaire
          <input name="comment" />
        </label>
        <label className="wide">
          Justificatif (chemin sécurisé)
          <input name="evidencePath" />
        </label>
      </div>
      <button type="submit" disabled={busy}>
        Valider le virement
      </button>
    </form>
  );
}

function FinancialActions({ data, busy, onSubmit }: Omit<Props, "view">) {
  const submitReminder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void onSubmit({
      action: "create_payment_reminder",
      reservationId: form.get("reservationId"),
      kind: form.get("kind"),
      channel: "manual",
      comment: form.get("comment") || undefined,
    });
    event.currentTarget.reset();
  };
  const submitRefund = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void onSubmit({
      action: "refund_manual_payment",
      paymentId: form.get("paymentId"),
      amountCents: Math.round(Number(form.get("amount")) * 100),
      reason: form.get("reason"),
    });
    event.currentTarget.reset();
  };
  const submitCreditNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void onSubmit({
      action: "create_credit_note",
      reservationId: form.get("reservationId"),
      amountCents: Math.round(Number(form.get("amount")) * 100),
      reason: form.get("reason"),
    });
    event.currentTarget.reset();
  };
  const refundable = data.finance.payments.filter(
    (payment) => payment.status === "paid" || payment.status === "partially_refunded",
  );
  return (
    <div className="admin-two-columns">
      <form className="admin-editor admin-editor--compact" onSubmit={submitReminder}>
        <h3>Journaliser une relance</h3>
        <label>
          Réservation
          <select name="reservationId">
            {data.operational.pendingPayments.map((reservation) => (
              <option key={reservation.id} value={reservation.id}>
                {reservation.reference} · {reservation.guestName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Échéance
          <select name="kind">
            <option value="deposit">Acompte</option>
            <option value="balance">Solde</option>
          </select>
        </label>
        <label>
          Commentaire
          <input name="comment" />
        </label>
        <button type="submit" disabled={busy}>
          Enregistrer la relance
        </button>
      </form>
      <form className="admin-editor admin-editor--compact" onSubmit={submitRefund}>
        <h3>Remboursement manuel</h3>
        <label>
          Paiement
          <select name="paymentId">
            {refundable.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.reservationReference} ·{" "}
                {money(payment.amountCents - payment.refundedCents)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Montant (€)
          <input name="amount" type="number" min="0.01" step="0.01" required />
        </label>
        <label>
          Justification
          <input name="reason" required minLength={10} />
        </label>
        <button type="submit" disabled={busy || !refundable.length}>
          Enregistrer le remboursement
        </button>
      </form>
      <form className="admin-editor admin-editor--compact" onSubmit={submitCreditNote}>
        <h3>Créer un avoir</h3>
        <label>
          Réservation
          <select name="reservationId">
            {data.reservations.slice(0, 200).map((reservation) => (
              <option key={reservation.id} value={reservation.id}>
                {reservation.reference} · {reservation.guestName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Montant (€)
          <input name="amount" type="number" min="0.01" step="0.01" required />
        </label>
        <label>
          Justification
          <input name="reason" required minLength={10} />
        </label>
        <button type="submit" disabled={busy}>
          Émettre l’avoir
        </button>
      </form>
    </div>
  );
}
function MaintenanceForm({ data, busy, onSubmit }: Omit<Props, "view">) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    void onSubmit({
      action: "create_maintenance",
      propertyId: f.get("propertyId"),
      title: f.get("title"),
      description: f.get("description"),
      priority: f.get("priority"),
    });
    event.currentTarget.reset();
  };
  return (
    <form className="admin-editor admin-editor--compact" onSubmit={submit}>
      <div className="admin-form-grid">
        <label>
          Maison
          <select name="propertyId">
            {data.properties.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Incident
          <input name="title" required minLength={2} />
        </label>
        <label>
          Priorité
          <select name="priority">
            <option value="normal">Normale</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
            <option value="low">Basse</option>
          </select>
        </label>
        <label className="wide">
          Description
          <input name="description" />
        </label>
      </div>
      <button type="submit" disabled={busy}>
        Créer l’incident
      </button>
    </form>
  );
}
function ConciergeForm({ data, busy, onSubmit }: Omit<Props, "view">) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    void onSubmit({
      action: "create_concierge",
      reservationId: f.get("reservationId"),
      kind: f.get("kind"),
      title: f.get("title"),
      details: f.get("details"),
      isSurprise: f.get("isSurprise") === "on",
    });
    event.currentTarget.reset();
  };
  return (
    <form className="admin-editor admin-editor--compact" onSubmit={submit}>
      <div className="admin-form-grid">
        <label>
          Réservation
          <select name="reservationId">
            {data.reservations.slice(0, 100).map((item) => (
              <option value={item.id} key={item.id}>
                {item.reference} · {item.guestName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <input name="kind" required defaultValue="attention" />
        </label>
        <label>
          Titre
          <input name="title" required />
        </label>
        <label className="wide">
          Détails
          <input name="details" />
        </label>
        <label>
          <input type="checkbox" name="isSurprise" /> Surprise
        </label>
      </div>
      <button type="submit" disabled={busy}>
        Ajouter la demande
      </button>
    </form>
  );
}
