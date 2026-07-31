"use client";

import type { StayOptionId } from "@/booking";
import { stayOptions } from "@/booking";
import { SignaturePackCard } from "./SignaturePackCard";

export function StayOptions({
  value,
  onChange,
}: {
  value: StayOptionId[];
  onChange: (value: StayOptionId[]) => void;
}) {
  const toggle = (id: StayOptionId) =>
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  const options = stayOptions.filter((item) => item.id !== "signature");
  return (
    <div className="stay-options">
      <fieldset>
        <legend>Les attentions à la carte</legend>
        <div className="stay-options__grid">
          {options.map((option) => (
            <label key={option.id} className={value.includes(option.id) ? "is-selected" : ""}>
              <input
                type="checkbox"
                checked={value.includes(option.id)}
                onChange={() => toggle(option.id)}
              />
              <span className="stay-options__check" aria-hidden="true">
                {value.includes(option.id) ? "✓" : "+"}
              </span>
              <strong>{option.label}</strong>
              <span>{option.description}</span>
              <small>
                + {option.price} € {option.unit ?? ""}
              </small>
            </label>
          ))}
        </div>
      </fieldset>
      <SignaturePackCard
        selected={value.includes("signature")}
        onToggle={() => toggle("signature")}
      />
    </div>
  );
}
