"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { BackOfficeReservation, BackOfficeSnapshot } from "@/platform/admin/contracts";
import { CalendarTodayView } from "@/components/admin/CalendarTodayView";
import { ReservationDetail } from "@/components/admin/dashboard/ReservationWorkspaceParts";

type ExternalBlock = {
  id?: string;
  startsOn: string;
  endsOn: string;
  status: string;
  source?: string;
};
type CalendarPayload = { blocks?: ExternalBlock[] };
const monthTitle = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const weekdays = ["L", "M", "M", "J", "V", "S", "D"];
const months = Array.from({ length: 12 }, (_, value) => ({
  value,
  label: new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(new Date(2024, value, 1)),
}));

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function nextDay(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
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

function sourceClass(channel: string) {
  const source = channel.toLowerCase();
  if (source.includes("airbnb")) return "airbnb";
  if (source.includes("booking")) return "booking";
  return "direct";
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
  const [loadFailed, setLoadFailed] = useState(false);
  const [mode, setMode] = useState<"today" | "month">("today");
  const [query, setQuery] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<BackOfficeReservation | null>(
    null,
  );
  const [quickBlock, setQuickBlock] = useState<{ propertySlug: string; startsOn: string } | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    void Promise.all(
      data.properties.map(async (property) => {
        const response = await fetch(`/api/calendar?property=${encodeURIComponent(property.slug)}`);
        if (!response.ok) throw new Error("CALENDAR_UNAVAILABLE");
        const payload = (await response.json()) as CalendarPayload;
        return [property.slug, uniqueBlocks(payload.blocks ?? [])] as const;
      }),
    )
      .then((entries) => {
        if (active) {
          setExternal(Object.fromEntries(entries));
          setLoadFailed(false);
        }
      })
      .catch(() => {
        if (active) setLoadFailed(true);
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

  const monthStart = iso(month);
  const monthEnd = iso(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  const matchingReservations = data.reservations.filter((reservation) => {
    if (["cancelled", "declined"].includes(reservation.status)) return false;
    if (!(reservation.arrival < monthEnd && reservation.departure > monthStart)) return false;
    const needle = query.trim().toLocaleLowerCase("fr-FR");
    return (
      !needle ||
      [
        reservation.guestName,
        reservation.reference,
        reservation.propertyName,
        reservation.channel,
      ].some((value) => value.toLocaleLowerCase("fr-FR").includes(needle))
    );
  });

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
    }).then(() => {
      form.reset();
      setQuickBlock(null);
    });
  };

  const returnToday = () => {
    const today = new Date(`${data.today}T12:00:00`);
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="admin-visual-calendar" aria-label="Airbnb · Booking · Réservation directe">
      <div className="concierge-calendar-toolbar">
        <div role="group" aria-label="Vue du calendrier">
          <button type="button" aria-pressed={mode === "today"} onClick={() => setMode("today")}>
            Aujourd’hui
          </button>
          <button type="button" aria-pressed={mode === "month"} onClick={() => setMode("month")}>
            Mois
          </button>
        </div>
        <label>
          <span>Rechercher</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Voyageur, référence, plateforme…"
          />
        </label>
      </div>

      {mode === "today" ? (
        <CalendarTodayView data={data} onOpenReservation={setSelectedReservation} />
      ) : (
        <>
          {loadFailed ? (
            <div className="admin-calendar-warning" role="alert">
              Calendrier indisponible. Les dates ne doivent pas être considérées comme libres.
            </div>
          ) : null}
          <form
            className="admin-calendar-blocker"
            onSubmit={blockDates}
            key={`${quickBlock?.propertySlug}-${quickBlock?.startsOn}`}
          >
            <div>
              <strong>Bloquer des dates</strong>
              <span>Cliquez aussi sur une date libre pour la préparer.</span>
            </div>
            <label>
              Logement
              <select name="propertySlug" defaultValue={quickBlock?.propertySlug} required>
                {data.properties.map((property) => (
                  <option key={property.id} value={property.slug}>
                    {property.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Du
              <input
                name="arrival"
                type="date"
                min={data.today}
                defaultValue={quickBlock?.startsOn}
                required
              />
            </label>
            <label>
              Au
              <input
                name="departure"
                type="date"
                min={data.today}
                defaultValue={quickBlock ? nextDay(quickBlock.startsOn) : undefined}
                required
              />
            </label>
            <label>
              Motif
              <input
                name="note"
                defaultValue="Blocage propriétaire"
                minLength={2}
                maxLength={300}
                required
              />
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
            <button type="button" className="is-today" onClick={returnToday}>
              Aujourd’hui
            </button>
            <label className="sr-only" htmlFor="calendar-month">
              Mois
            </label>
            <select
              id="calendar-month"
              value={month.getMonth()}
              onChange={(event) =>
                setMonth(new Date(month.getFullYear(), Number(event.target.value), 1))
              }
            >
              {months.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="calendar-year">
              Année
            </label>
            <select
              id="calendar-year"
              value={month.getFullYear()}
              onChange={(event) =>
                setMonth(new Date(Number(event.target.value), month.getMonth(), 1))
              }
            >
              {Array.from({ length: 7 }, (_, index) => new Date().getFullYear() - 1 + index).map(
                (year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ),
              )}
            </select>
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
              <i className="is-airbnb" /> Airbnb
            </span>
            <span>
              <i className="is-booking" /> Booking
            </span>
            <span>
              <i className="is-direct" /> Direct
            </span>
            <span>
              <i className="is-manual" /> Blocage propriétaire
            </span>
            <span>
              <i className="is-maintenance" /> Maintenance
            </span>
            <span>
              <i className="is-housekeeping" /> Ménage
            </span>
            <span>
              <i className="is-experience" /> Expérience
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
              const airbnbBlocks = blocks.filter((block) =>
                (block.source ?? "").toLowerCase().includes("airbnb"),
              );
              const bookingBlocks = blocks.filter((block) =>
                (block.source ?? "").toLowerCase().includes("booking"),
              );
              const platformBlocks = blocks.filter(
                (block) =>
                  !["reservation", "manual"].includes(block.source ?? "") &&
                  !airbnbBlocks.includes(block) &&
                  !bookingBlocks.includes(block),
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
                      const dayReservation = reservations.find(
                        (row) => value >= row.arrival && value < row.departure,
                      );
                      const direct =
                        Boolean(dayReservation) ||
                        directBlocks.some(
                          (block) => value >= block.startsOn && value < block.endsOn,
                        );
                      const manual = manualBlocks.some(
                        (block) => value >= block.startsOn && value < block.endsOn,
                      );
                      const airbnb = airbnbBlocks.some(
                        (block) => value >= block.startsOn && value < block.endsOn,
                      );
                      const booking = bookingBlocks.some(
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
                            : airbnb
                              ? "airbnb"
                              : booking
                                ? "booking"
                                : platform
                                  ? "platform"
                                  : "free";
                      const label = turnover
                        ? "départ et arrivée"
                        : dayReservation
                          ? `${dayReservation.guestName} · ${dayReservation.channel}`
                          : direct
                            ? "réservation directe"
                            : manual
                              ? "Période indisponible · Blocage manuel propriétaire"
                              : airbnb
                                ? "Période indisponible · Airbnb"
                                : booking
                                  ? "Période indisponible · Booking"
                                  : platform
                                    ? "Période indisponible (plateforme)"
                                    : "disponible";
                      return (
                        <button
                          type="button"
                          key={value}
                          className={`is-${state}`}
                          title={`${value} · ${label}`}
                          aria-label={`${day.toLocaleDateString("fr-FR")} : ${label}`}
                          disabled={!dayReservation && (state !== "free" || value < data.today)}
                          onClick={() =>
                            dayReservation
                              ? setSelectedReservation(dayReservation)
                              : setQuickBlock({ propertySlug: property.slug, startsOn: value })
                          }
                        >
                          <strong>{day.getDate()}</strong>
                          {arrival && <small>A</small>}
                          {departure && <small>D</small>}
                        </button>
                      );
                    })}
                  </div>
                  {manualBlocks.length ? (
                    <div className="admin-calendar-manual-blocks" aria-label="Blocages manuels">
                      {manualBlocks.map((block) => (
                        <div key={block.id ?? `${block.startsOn}-${block.endsOn}`}>
                          <span>
                            {block.startsOn} → {block.endsOn}
                          </span>
                          {block.id && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                void onSubmit({ action: "unblock_dates", blockId: block.id })
                              }
                            >
                              Débloquer
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="admin-calendar-stays" aria-label={`Séjours de ${property.name}`}>
                    {matchingReservations
                      .filter((reservation) => reservation.propertyId === property.id)
                      .map((reservation) => (
                        <button
                          type="button"
                          className={`is-${sourceClass(reservation.channel)}`}
                          key={reservation.id}
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <strong>{reservation.guestName}</strong>
                          <span>
                            {reservation.arrival} → {reservation.departure}
                          </span>
                          <small>
                            {reservation.channel} ·{" "}
                            {Math.max(
                              1,
                              Math.round(
                                (Date.parse(reservation.departure) -
                                  Date.parse(reservation.arrival)) /
                                  86_400_000,
                              ),
                            )}{" "}
                            nuit(s) · {reservation.adults + reservation.children} voyageur(s)
                          </small>
                        </button>
                      ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {selectedReservation ? (
        <>
          <ReservationDetail
            reservation={selectedReservation}
            payments={data.pilotage.recentPayments.filter(
              (item) => item.reservationReference === selectedReservation.reference,
            )}
            deposits={data.operations.deposits.filter(
              (item) => item.reservationReference === selectedReservation.reference,
            )}
            onClose={() => setSelectedReservation(null)}
          />
          <a className="admin-calendar-document-link" href="/administration?view=documents">
            Ouvrir contrat, devis et factures
          </a>
        </>
      ) : null}
    </div>
  );
}
