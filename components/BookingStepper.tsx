"use client";

import type { BookingStep } from "@/booking";

const labels = ["Maison", "Dates", "Voyageurs", "Personnaliser"];

export function BookingStepper({
  current,
  maxAccessible,
  propertyLocked,
  onSelect,
}: {
  current: BookingStep;
  maxAccessible: BookingStep;
  propertyLocked: boolean;
  onSelect: (step: BookingStep) => void;
}) {
  return (
    <nav className="booking-stepper" aria-label="Étapes de réservation">
      <ol>
        {labels.map((label, index) => {
          const step = (index + 1) as BookingStep;
          return (
            <li
              key={label}
              className={current === step ? "is-current" : current > step ? "is-complete" : ""}
            >
              <button
                type="button"
                disabled={step > maxAccessible || (step === 1 && propertyLocked)}
                onClick={() => onSelect(step)}
                aria-current={current === step ? "step" : undefined}
              >
                <span>{current > step ? "✓" : `0${step}`}</span>
                <strong>{label}</strong>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
