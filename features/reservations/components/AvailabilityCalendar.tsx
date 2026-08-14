"use client";

import { useMemo, useState } from "react";
import { isDateOccupied, isDateRangeAvailable } from "@/lib/date-ranges";
import { trackEvent } from "@/platform/analytics/events";
import { useAvailabilityCalendar } from "../hooks";
import type { AvailabilityBlock } from "../types";

type AvailabilityCalendarProps = {
  arrival: string | null;
  departure: string | null;
  propertySlug: string;
  demoMode?: boolean;
  onChange: (arrival: string | null, departure: string | null) => void;
};

const weekdayLabels = ["L", "M", "M", "J", "V", "S", "D"];
const monthNames = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const demoBlocks: AvailabilityBlock[] = [
  { startsOn: "2026-08-22", endsOn: "2026-08-28", status: "confirmed" },
  { startsOn: "2026-09-10", endsOn: "2026-09-14", status: "confirmed" },
];

function toISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISO(value: string) {
  return new Date(`${value}T12:00:00`);
}

function monthDays(view: Date) {
  const firstDay = (view.getDay() + 6) % 7;
  const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  return [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: count },
      (_, index) => new Date(view.getFullYear(), view.getMonth(), index + 1),
    ),
  ] as Array<Date | null>;
}

function demoPrice(date: Date) {
  const weekend = date.getDay() === 5 || date.getDay() === 6;
  return 165 + (date.getMonth() % 3) * 15 + (weekend ? 25 : 0);
}

export function AvailabilityCalendar({
  arrival,
  departure,
  propertySlug,
  demoMode = false,
  onChange,
}: AvailabilityCalendarProps) {
  const [view, setView] = useState(() => {
    if (demoMode) return new Date(2026, 7, 1);
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const liveCalendar = useAvailabilityCalendar(propertySlug, !demoMode);
  const blocks = demoMode ? demoBlocks : liveCalendar.blocks;
  const calendarStatus = demoMode ? "ready" : liveCalendar.status;
  const displayArrival = arrival ?? (demoMode ? "2026-08-28" : null);
  const displayDeparture = departure ?? (demoMode ? "2026-09-02" : null);
  const months = useMemo(
    () => [view, new Date(view.getFullYear(), view.getMonth() + 1, 1)],
    [view],
  );

  const selectDate = (date: Date) => {
    const value = toISO(date);
    const occupied = isDateOccupied(blocks, value);
    const validDeparture = Boolean(
      arrival && !departure && value > arrival && isDateRangeAvailable(blocks, arrival, value),
    );
    if (occupied && !validDeparture) return;
    if (!arrival || departure || value < arrival) onChange(value, null);
    else if (value > arrival && isDateRangeAvailable(blocks, arrival, value)) {
      onChange(arrival, value);
      trackEvent("search_availability", { property_slug: propertySlug, arrival, departure: value });
    }
  };

  return (
    <div className="availability-calendar" data-demo={demoMode || undefined}>
      {demoMode && (
        <p className="availability-calendar__demo-note">
          Aperçu visuel — données de démonstration, sans lien avec les disponibilités réelles
        </p>
      )}
      <div className="availability-calendar__summary" aria-live="polite">
        <div>
          <span>Arrivée</span>
          <strong>
            {displayArrival
              ? fromISO(displayArrival).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                })
              : "À choisir"}
          </strong>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <span>Départ</span>
          <strong>
            {displayDeparture
              ? fromISO(displayDeparture).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                })
              : "À choisir"}
          </strong>
        </div>
      </div>

      <div className="availability-calendar__legend" aria-label="Légende du calendrier">
        <span>
          <i className="is-free" />
          Disponible
        </span>
        <span>
          <i className="is-occupied" />
          Occupé
        </span>
        <span>
          <i className="is-arrival" />
          Arrivée
        </span>
        <span>
          <i className="is-departure" />
          Départ
        </span>
        <span>
          <i className="is-range" />
          Séjour sélectionné
        </span>
      </div>

      <div className="availability-calendar__navigation">
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          disabled={!demoMode && view <= new Date(today.getFullYear(), today.getMonth(), 1)}
          aria-label="Mois précédent"
        >
          ←
        </button>
        <strong>
          <span>{monthNames[view.getMonth()]}</span>
          <span className="availability-calendar__second-month">
            {" "}
            — {monthNames[(view.getMonth() + 1) % 12]}
          </span>
        </strong>
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          aria-label="Mois suivant"
        >
          →
        </button>
      </div>

      <div className="availability-calendar__months">
        {months.map((month) => (
          <section
            className="availability-calendar__month"
            key={toISO(month)}
            aria-label={`${monthNames[month.getMonth()]} ${month.getFullYear()}`}
          >
            <h3>
              {monthNames[month.getMonth()]} <span>{month.getFullYear()}</span>
            </h3>
            <div className="availability-calendar__weekdays" aria-hidden="true">
              {weekdayLabels.map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
            </div>
            <div className="availability-calendar__days">
              {monthDays(month).map((date, index) => {
                if (!date) return <span key={`empty-${index}`} className="is-empty" />;
                const value = toISO(date);
                const disabled = !demoMode && date < today;
                const occupied = isDateOccupied(blocks, value);
                const validDeparture = Boolean(
                  arrival &&
                  !departure &&
                  value > arrival &&
                  isDateRangeAvailable(blocks, arrival, value),
                );
                const arrivalDay = blocks.some((block) => value === block.startsOn);
                const departureDay = blocks.some((block) => value === block.endsOn);
                const selected = value === displayArrival || value === displayDeparture;
                const inRange = Boolean(
                  displayArrival &&
                  displayDeparture &&
                  value > displayArrival &&
                  value < displayDeparture,
                );
                const status = occupied ? "Occupé" : "Disponible";
                return (
                  <button
                    type="button"
                    key={value}
                    disabled={
                      disabled || (occupied && !validDeparture) || calendarStatus !== "ready"
                    }
                    className={`${selected ? "is-selected" : ""}${inRange ? " is-in-range" : ""}${occupied ? " is-occupied" : " is-free"}${arrivalDay ? " is-arrival" : ""}${departureDay ? " is-departure" : ""}`}
                    onClick={() => selectDate(date)}
                    aria-label={`${date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}${demoMode && !occupied ? `, ${demoPrice(date)} euros par nuit` : ""}${validDeparture ? ", départ possible" : occupied ? ", occupé" : arrivalDay ? ", arrivée" : departureDay ? ", départ et nouvelle arrivée possibles" : ", disponible"}`}
                    aria-pressed={selected}
                  >
                    <span className="availability-calendar__date">{date.getDate()}</span>
                    {demoMode && !occupied && <small>{demoPrice(date)} €</small>}
                    <em>{status}</em>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <p className="booking-disclaimer" role="status">
        {demoMode
          ? "Cette présentation utilise exclusivement des exemples visuels."
          : calendarStatus === "loading"
            ? "Synchronisation des calendriers…"
            : calendarStatus === "error"
              ? "Le calendrier ne peut pas être vérifié pour le moment. Contactez Stéphanie avant toute demande."
              : "Disponibilités synchronisées avec les calendriers des plateformes. Une ultime vérification est effectuée lors de la demande."}
      </p>
    </div>
  );
}
