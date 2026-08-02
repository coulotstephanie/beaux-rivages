"use client";

import type { GuestCounts, StayOptionId } from "@/booking";
import { stayOptions } from "@/booking";
import { SignaturePackCard } from "./SignaturePackCard";
import {
  SignatureWelcomeBaskets,
  WelcomeBaskets,
  type WelcomeBasketChoice,
} from "./experiences/WelcomeBaskets";

export function StayOptions({
  value,
  guests,
  onChange,
}: {
  value: StayOptionId[];
  guests: GuestCounts;
  onChange: (value: StayOptionId[]) => void;
}) {
  const toggle = (id: StayOptionId) =>
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  const basketIds: StayOptionId[] = ["aperitif-basket", "basket"];
  const includedBasketIds: StayOptionId[] = ["signature-aperitif", "signature-sweet"];
  const signatureSelected = value.includes("signature");
  const options = stayOptions.filter(
    (item) =>
      item.id !== "signature" &&
      !basketIds.includes(item.id) &&
      !includedBasketIds.includes(item.id),
  );
  const basketChoice =
    value.find((item): item is Exclude<WelcomeBasketChoice, null> => basketIds.includes(item)) ??
    null;
  const selectBasket = (choice: WelcomeBasketChoice) =>
    onChange([...value.filter((item) => !basketIds.includes(item)), ...(choice ? [choice] : [])]);
  const includedBasket = value.includes("signature-sweet")
    ? "signature-sweet"
    : "signature-aperitif";
  const selectIncludedBasket = (choice: "signature-aperitif" | "signature-sweet") => {
    const matchingPaid = choice === "signature-aperitif" ? "aperitif-basket" : "basket";
    onChange([
      ...value.filter((item) => !includedBasketIds.includes(item) && item !== matchingPaid),
      choice,
    ]);
  };
  const toggleSignature = () => {
    if (signatureSelected) {
      onChange(value.filter((item) => item !== "signature" && !includedBasketIds.includes(item)));
      return;
    }
    onChange([
      ...value.filter((item) => !basketIds.includes(item) && !includedBasketIds.includes(item)),
      "signature",
      "signature-aperitif",
    ]);
  };
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
      <SignaturePackCard selected={signatureSelected} guests={guests} onToggle={toggleSignature} />
      {signatureSelected ? (
        <SignatureWelcomeBaskets
          included={includedBasket}
          extra={basketChoice as "aperitif-basket" | "basket" | null}
          onIncludedChange={selectIncludedBasket}
          onExtraChange={selectBasket}
        />
      ) : (
        <WelcomeBaskets value={basketChoice} onChange={selectBasket} />
      )}
    </div>
  );
}
