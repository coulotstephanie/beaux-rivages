"use client";

import type { BackOfficeReservation, BackOfficeSnapshot } from "@/platform/admin/contracts";

type TimelineItem = {
  id: string;
  time: string;
  kind: "arrival" | "departure" | "housekeeping" | "maintenance" | "experience" | "alert";
  title: string;
  detail: string;
  reservation?: BackOfficeReservation;
};

function timeOf(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function CalendarTodayView({
  data,
  onOpenReservation,
}: {
  data: BackOfficeSnapshot;
  onOpenReservation: (reservation: BackOfficeReservation) => void;
}) {
  const items: TimelineItem[] = [
    ...data.operational.departures.map((reservation) => ({
      id: `departure-${reservation.id}`,
      time: "10:00",
      kind: "departure" as const,
      title: `Départ · ${reservation.propertyName}`,
      detail: `${reservation.guestName} · ${reservation.reference}`,
      reservation,
    })),
    ...data.operations.housekeeping
      .filter((task) => task.scheduledFor.slice(0, 10) === data.today)
      .map((task) => ({
        id: `housekeeping-${task.id}`,
        time: timeOf(task.scheduledFor, "11:00"),
        kind: "housekeeping" as const,
        title: `Ménage · ${task.propertyName}`,
        detail: `${task.status} · ${task.assignee || "Non attribué"}`,
      })),
    ...data.operations.maintenance
      .filter((task) => (task.dueAt ?? task.createdAt).slice(0, 10) === data.today)
      .map((task) => ({
        id: `maintenance-${task.id}`,
        time: timeOf(task.dueAt, "12:00"),
        kind: "maintenance" as const,
        title: `Maintenance · ${task.propertyName}`,
        detail: `${task.title} · ${task.status}`,
      })),
    ...data.operations.concierge
      .filter((request) => request.scheduledFor?.slice(0, 10) === data.today)
      .map((request) => ({
        id: `experience-${request.id}`,
        time: timeOf(request.scheduledFor, "14:00"),
        kind: "experience" as const,
        title: `${request.title} · ${request.reservationReference}`,
        detail: `${request.kind} · ${request.status}`,
      })),
    ...data.operational.pendingPayments.map((reservation) => ({
      id: `payment-${reservation.id}`,
      time: "09:00",
      kind: "alert" as const,
      title: `Paiement à suivre · ${reservation.propertyName}`,
      detail: `${reservation.guestName} · ${reservation.reference}`,
      reservation,
    })),
    ...data.operational.unsignedContracts.map((reservation) => ({
      id: `contract-${reservation.id}`,
      time: "09:15",
      kind: "alert" as const,
      title: `Contrat à signer · ${reservation.propertyName}`,
      detail: `${reservation.guestName} · ${reservation.reference}`,
      reservation,
    })),
    ...data.operational.arrivals.flatMap((reservation) => [
      ...reservation.options
        .filter((option) => /panier|accueil|linge|animal/i.test(`${option.code} ${option.label}`))
        .map((option) => ({
          id: `welcome-${reservation.id}-${option.code}`,
          time: "14:30",
          kind: "experience" as const,
          title: `Préparation · ${reservation.propertyName}`,
          detail: `${option.label} × ${option.quantity} · ${reservation.guestName}`,
          reservation,
        })),
      ...reservation.experiences.map((experience) => ({
        id: `arrival-experience-${reservation.id}-${experience.code}`,
        time: "14:45",
        kind: "experience" as const,
        title: `Expérience · ${reservation.propertyName}`,
        detail: `${experience.label} × ${experience.quantity} · ${reservation.guestName}`,
        reservation,
      })),
    ]),
    ...data.operational.arrivals.map((reservation) => ({
      id: `arrival-${reservation.id}`,
      time: reservation.specialRequests.lateArrival || "16:00",
      kind: "arrival" as const,
      title: `Arrivée · ${reservation.propertyName}`,
      detail: `${reservation.guestName} · ${reservation.adults + reservation.children} voyageur(s)`,
      reservation,
    })),
    ...data.operations.notifications
      .filter((notice) => !notice.readAt && notice.priority === "urgent")
      .slice(0, 8)
      .map((notice) => ({
        id: `alert-${notice.id}`,
        time: "!",
        kind: "alert" as const,
        title: notice.title,
        detail: notice.body,
      })),
  ].sort((left, right) => left.time.localeCompare(right.time));

  return (
    <section className="concierge-today" aria-labelledby="concierge-today-title">
      <header>
        <div>
          <p className="eyebrow">Centre de pilotage</p>
          <h3 id="concierge-today-title">Aujourd’hui</h3>
        </div>
        <strong>
          {new Date(`${data.today}T12:00:00`).toLocaleDateString("fr-FR", { dateStyle: "full" })}
        </strong>
      </header>
      <div className="concierge-today__summary" aria-label="Résumé de la journée">
        <span>
          <strong>{data.operational.arrivals.length}</strong> arrivée(s)
        </span>
        <span>
          <strong>{data.operational.departures.length}</strong> départ(s)
        </span>
        <span>
          <strong>
            {
              data.operations.housekeeping.filter(
                (task) => task.scheduledFor.slice(0, 10) === data.today,
              ).length
            }
          </strong>{" "}
          ménage(s)
        </span>
        <span>
          <strong>{data.operations.notifications.filter((notice) => !notice.readAt).length}</strong>{" "}
          alerte(s)
        </span>
      </div>
      <ol className="concierge-timeline">
        {items.map((item) => (
          <li className={`is-${item.kind}`} key={item.id}>
            <time>{item.time}</time>
            <div>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
            {item.reservation ? (
              <button type="button" onClick={() => onOpenReservation(item.reservation!)}>
                Ouvrir le séjour
              </button>
            ) : null}
          </li>
        ))}
        {!items.length ? (
          <li className="is-complete">
            <strong>La journée est prête.</strong>
            <span>Aucune action urgente.</span>
          </li>
        ) : null}
      </ol>
    </section>
  );
}
