"use client";

import { useEffect, useMemo, useState } from "react";
import type { BackOfficeSnapshot } from "@/platform/admin/contracts";

type CalendarPayload = {
  propertySlug: string;
  blocks: { startsOn: string; endsOn: string; status: string }[];
  sources: { provider: string; status: string; imported: number }[];
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(`${value.slice(0, 10)}T12:00:00`),
  );

export function AdminCalendarBoard({ data }: { data: BackOfficeSnapshot }) {
  const [calendars, setCalendars] = useState<Record<string, CalendarPayload>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all(
      data.properties.map(async (property) => {
        const response = await fetch(
          `/api/calendar?property=${encodeURIComponent(property.slug)}`,
          {
            cache: "no-store",
          },
        );
        if (!response.ok) throw new Error("CALENDAR_LOAD_FAILED");
        return (await response.json()) as CalendarPayload;
      }),
    )
      .then((payloads) => {
        if (!active) return;
        setCalendars(
          Object.fromEntries(payloads.map((payload) => [payload.propertySlug, payload])),
        );
        setError("");
      })
      .catch(() => {
        if (active) setError("Les calendriers externes sont momentanément indisponibles.");
      });
    return () => {
      active = false;
    };
  }, [data.properties]);

  const directByProperty = useMemo(
    () =>
      new Map(
        data.properties.map((property) => [
          property.id,
          data.reservations
            .filter(
              (row) =>
                row.propertyId === property.id &&
                row.departure >= data.today &&
                row.status !== "cancelled",
            )
            .slice(0, 12),
        ]),
      ),
    [data.properties, data.reservations, data.today],
  );

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Airbnb · Booking · Réservation directe</p>
          <h2>Calendrier unifié</h2>
        </div>
        <a href="/administration/calendriers">Gérer les sources iCal</a>
      </div>
      {error ? <p className="admin-empty">{error}</p> : null}
      <div className="admin-calendar-board">
        {data.properties.map((property) => {
          const direct = directByProperty.get(property.id) ?? [];
          const external = (calendars[property.slug]?.blocks ?? [])
            .filter((block) => block.endsOn >= data.today && block.status !== "cancelled")
            .slice(0, 24);
          const providers = calendars[property.slug]?.sources
            .filter((source) => source.status === "success")
            .map((source) => source.provider)
            .join(" + ");
          return (
            <article key={property.id}>
              <h3>{property.name}</h3>
              {direct.map((row) => (
                <div
                  className={`admin-calendar-event channel-${row.channel}`}
                  draggable
                  key={row.id}
                >
                  <strong>{row.guestName}</strong>
                  <span>
                    {formatDate(row.arrival)} → {formatDate(row.departure)}
                  </span>
                  <small>
                    {row.channel} · {row.reference}
                  </small>
                </div>
              ))}
              {external.map((block, index) => (
                <div
                  className="admin-calendar-event channel-external"
                  key={`${property.slug}-${block.startsOn}-${block.endsOn}-${index}`}
                >
                  <strong>Période indisponible</strong>
                  <span>
                    {formatDate(block.startsOn)} → {formatDate(block.endsOn)}
                  </span>
                  <small>{providers || "Calendrier externe"}</small>
                </div>
              ))}
              {!direct.length && !external.length ? (
                <p className="admin-empty">
                  {calendars[property.slug]
                    ? "Aucune période future."
                    : "Chargement du calendrier…"}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
