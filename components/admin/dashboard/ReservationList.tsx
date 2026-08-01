import type { BackOfficeReservation } from "@/platform/admin/contracts";
import { describeWelcomeBaskets } from "@/platform/reservations/welcome-baskets";
import { money, shortDate, Status } from "./format";

function nights(reservation: BackOfficeReservation) {
  return Math.round(
    (Date.parse(`${reservation.departure}T12:00:00Z`) -
      Date.parse(`${reservation.arrival}T12:00:00Z`)) /
      86_400_000,
  );
}

export function ReservationList({
  rows,
  empty = "Aucune réservation.",
}: {
  rows: BackOfficeReservation[];
  empty?: string;
}) {
  if (!rows.length) return <p className="admin-empty">{empty}</p>;
  return (
    <div className="admin-list">
      {rows.map((reservation) => {
        const baskets = describeWelcomeBaskets(reservation.options);
        return (
          <article key={reservation.id} className="admin-reservation-row">
            <div>
              <strong>{reservation.guestName}</strong>
              <span>
                {reservation.propertyName} · {nights(reservation)} nuit(s)
              </span>
              {baskets.included !== "Aucun" ? (
                <small>
                  Accueil gourmand : {baskets.included}
                  {baskets.extra !== "Aucun" ? ` + ${baskets.extra}` : ""}
                </small>
              ) : null}
            </div>
            <div>
              <strong>{shortDate(reservation.arrival)}</strong>
              <span>au {shortDate(reservation.departure)}</span>
            </div>
            <Status value={reservation.status} />
            <strong>{money(reservation.totalCents)}</strong>
          </article>
        );
      })}
    </div>
  );
}
