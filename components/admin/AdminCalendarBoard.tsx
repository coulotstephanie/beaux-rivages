"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { BackOfficeSnapshot } from "@/platform/admin/contracts";

type ExternalBlock = { startsOn: string; endsOn: string; status: string; source?: string };
type CalendarPayload = { blocks?: ExternalBlock[] };
const monthTitle = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const weekdays = ["L", "M", "M", "J", "V", "S", "D"];

function iso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function uniqueBlocks(blocks: ExternalBlock[]) {
  return [
    ...new Map(
      blocks.map((block) => [
        `${block.startsOn}:${block.endsOn}:${block.source ?? "external"}`,
        block,
      ]),
    ).values(),
  ];
}

type Props = {
  data: BackOfficeSnapshot;
  busy: boolean;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
};

export function AdminCalendarBoard({ data, busy, onSubmit }: Props) {
  const [month, setMonth] = useState(() => {
    const today = new Date(`${data.today}T12:00:00`);
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [external, setExternal] = useState<Record<string, ExternalBlock[]>>({});

  useEffect(() => {
    let active = true;
    void Promise.all(
      data.properties.map(async (property) => {
        const response = await fetch(`/api/calendar?property=${encodeURIComponent(property.slug)}`);
        if (!response.ok) return [property.slug, []] as const;
        const payload = (await response.json()) as CalendarPayload;
        return [property.slug, uniqueBlocks(payload.blocks ?? [])] as const;
      }),
    ).then((entries) => {
      if (active) setExternal(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, [data.properties]);

  const days = useMemo(() => {
    const firstOffset = (month.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: firstOffset }, () => null),
      ...Array.from(
        { length: count },
        (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
      ),
    ];
  }, [month]);

  const blockDates = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    void onSubmit({
      action: "block_dates",
      propertySlug: values.get("propertySlug"),
      arrival: values.get("arrival"),
      departure: values.get("departure"),
      note: values.get("note"),
    }).then(() => form.reset());
  };

  return (
    <div className="admin-visual-calendar" aria-label="Airbnb · Booking · Réservation directe">
      <form className="admin-calendar-blocker" onSubmit={blockDates}>
        <div>
          <strong>Bloquer des dates</strong>
          <span>La période devient immédiatement indisponible à la réservation directe.</span>
        </div>
        <label>
          Logement
          <select name="propertySlug" required>
            {data.properties.map((property) => (
              <option key={property.id} value={property.slug}>
                {property.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Du
          <input name="arrival" type="date" min={data.today} required />
        </label>
        <label>
          Au
          <input name="departure" type="date" min={data.today} required />
        </label>
        <label>
          Motif
          <input name="note" defaultValue="Blocage manuel" minLength={2} maxLength={300} required />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Enregistrement…" : "Bloquer"}
        </button>
      </form>
      <div className="admin-visual-calendar__nav">
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          aria-label="Mois précédent"
        >
          ←
        </button>
        <h3>{monthTitle.format(month)}</h3>
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          aria-label="Mois suivant"
        >
          →
        </button>
      </div>
      <div className="admin-calendar-legend" aria-label="Légende">
        <span>
          <i className="is-free" /> Disponible
        </span>
        <span>
          <i className="is-platform" /> Plateforme
        </span>
        <span>
          <i className="is-direct" /> Direct
        </span>
        <span>
          <i className="is-manual" /> Blocage manuel
        </span>
        <span>
          <i className="is-turnover" /> Départ + arrivée
        </span>
      </div>
      <div className="admin-visual-calendar__houses">
        {data.properties.map((property) => {
          const reservations = data.reservations.filter(
            (row) =>
              row.propertyId === property.id && !["cancelled", "declined"].includes(row.status),
          );
          const blocks = external[property.slug] ?? [];
          const directBlocks = blocks.filter((block) => block.source === "reservation");
          const manualBlocks = blocks.filter((block) => block.source === "manual");
          const platformBlocks = blocks.filter(
            (block) => !["reservation", "manual"].includes(block.source ?? ""),
          );
          return (
            <section key={property.id}>
              <h3>{property.name}</h3>
              <div className="admin-visual-calendar__weekdays" aria-hidden="true">
                {weekdays.map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>
              <div className="admin-visual-calendar__days">
                {days.map((day, index) => {
                  if (!day) return <span key={`empty-${index}`} />;
                  const value = iso(day);
                  const direct =
                    reservations.some((row) => value >= row.arrival && value < row.departure) ||
                    directBlocks.some((block) => value >= block.startsOn && value < block.endsOn);
                  const manual = manualBlocks.some(
                    (block) => value >= block.startsOn && value < block.endsOn,
                  );
                  const platform = platformBlocks.some(
                    (block) => value >= block.startsOn && value < block.endsOn,
                  );
                  const arrival =
                    reservations.some((row) => row.arrival === value) ||
                    blocks.some((block) => block.startsOn === value);
                  const departure =
                    reservations.some((row) => row.departure === value) ||
                    blocks.some((block) => block.endsOn === value);
                  const turnover = arrival && departure;
                  const state = turnover
                    ? "turnover"
                    : direct
                      ? "direct"
                      : manual
                        ? "manual"
                        : platform
                          ? "platform"
                          : "free";
                  const label = turnover
                    ? "départ et arrivée"
                    : direct
                      ? "réservation directe"
                      : manual
                        ? "Période indisponible (blocage manuel)"
                        : platform
                          ? "Période indisponible (plateforme)"
                          : "disponible";
                  return (
                    <span
                      key={value}
                      className={`is-${state}`}
                      title={`${value} · ${label}`}
                      aria-label={`${day.toLocaleDateString("fr-FR")} : ${label}`}
                    >
                      <strong>{day.getDate()}</strong>
                      {arrival && <small>A</small>}
                      {departure && <small>D</small>}
                    </span>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
