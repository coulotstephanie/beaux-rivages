"use client";

import { useMemo, useState } from "react";

type AvailabilityCalendarProps = {
  arrival: string | null;
  departure: string | null;
  onChange: (arrival: string | null, departure: string | null) => void;
};

const weekdayLabels = ["L", "M", "M", "J", "V", "S", "D"];
const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function toISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISO(value: string) {
  return new Date(`${value}T12:00:00`);
}

export function AvailabilityCalendar({ arrival, departure, onChange }: AvailabilityCalendarProps) {
  const [view, setView] = useState(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const days = useMemo(() => {
    const firstDay = (view.getDay() + 6) % 7;
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: count }, (_, index) => new Date(view.getFullYear(), view.getMonth(), index + 1))];
  }, [view]);

  const selectDate = (date: Date) => {
    const value = toISO(date);
    if (!arrival || departure || value < arrival) onChange(value, null);
    else if (value > arrival) onChange(arrival, value);
  };

  return (
    <div className="availability-calendar">
      <div className="availability-calendar__summary" aria-live="polite">
        <div><span>Arrivée</span><strong>{arrival ? fromISO(arrival).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "À choisir"}</strong></div>
        <span aria-hidden="true">→</span>
        <div><span>Départ</span><strong>{departure ? fromISO(departure).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "À choisir"}</strong></div>
      </div>
      <div className="availability-calendar__month">
        <div className="availability-calendar__navigation">
          <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} disabled={view <= new Date(today.getFullYear(), today.getMonth(), 1)} aria-label="Mois précédent">←</button>
          <h3>{monthNames[view.getMonth()]} {view.getFullYear()}</h3>
          <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} aria-label="Mois suivant">→</button>
        </div>
        <div className="availability-calendar__weekdays" aria-hidden="true">{weekdayLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
        <div className="availability-calendar__days">
          {days.map((date, index) => {
            if (!date) return <span key={`empty-${index}`} />;
            const value = toISO(date);
            const disabled = date < today;
            const selected = value === arrival || value === departure;
            const inRange = Boolean(arrival && departure && value > arrival && value < departure);
            return (
              <button
                type="button"
                key={value}
                disabled={disabled}
                className={`${selected ? "is-selected" : ""}${inRange ? " is-in-range" : ""}`}
                onClick={() => selectDate(date)}
                aria-label={date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                aria-pressed={selected}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      <p className="booking-disclaimer">Calendrier de démonstration — les disponibilités réelles seront confirmées par Stéphanie.</p>
    </div>
  );
}
