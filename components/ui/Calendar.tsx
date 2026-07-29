"use client";

import { useMemo, useState } from "react";
import { Button } from "./Button";

type CalendarProps = {
  value?: string;
  onChange?: (date: string) => void;
  min?: string;
  max?: string;
  locale?: string;
  label?: string;
};

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export function Calendar({
  value,
  onChange,
  min,
  max,
  locale = "fr-FR",
  label = "Choisir une date",
}: CalendarProps) {
  const selected = value ? new Date(`${value}T12:00:00`) : new Date();
  const [month, setMonth] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));
  const days = useMemo(() => {
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from(
        { length: count },
        (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
      ),
    ];
  }, [month]);

  return (
    <section className="ui-calendar" aria-label={label}>
      <header>
        <Button
          variant="ghost"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          ariaLabel="Mois précédent"
        >
          ←
        </Button>
        <strong>
          {new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric",
          }).format(month)}
        </strong>
        <Button
          variant="ghost"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          ariaLabel="Mois suivant"
        >
          →
        </Button>
      </header>
      <div className="ui-calendar__week" aria-hidden="true">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="ui-calendar__grid">
        {days.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} aria-hidden="true" />;
          const date = toISODate(day);
          const disabled = Boolean((min && date < min) || (max && date > max));
          return (
            <button
              type="button"
              key={date}
              disabled={disabled}
              aria-pressed={date === value}
              aria-label={new Intl.DateTimeFormat(locale, {
                dateStyle: "full",
              }).format(day)}
              onClick={() => onChange?.(date)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}
