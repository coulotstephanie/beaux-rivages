"use client";

import type { AttentionType } from "@/booking";
import { attentions } from "@/booking";

type PersonalAttentionCardProps = {
  value: AttentionType | null;
  message: string;
  onChange: (value: AttentionType | null, message: string) => void;
};

export function PersonalAttentionCard({ value, message, onChange }: PersonalAttentionCardProps) {
  return (
    <section className="personal-attention-card" aria-labelledby="attention-title">
      <div>
        <p className="eyebrow light">Une attention particulière ?</p>
        <h3 id="attention-title">Dites-nous ce que vous célébrez.</h3>
        <p>Stéphanie vous répondra personnellement pour imaginer ce qui est possible.</p>
      </div>
      <div>
        <fieldset>
          <legend className="sr-only">Occasion particulière</legend>
          <div className="personal-attention-card__choices">
            {attentions.map((attention) => (
              <label key={attention} className={value === attention ? "is-selected" : ""}>
                <input type="radio" name="attention" value={attention} checked={value === attention} onChange={() => onChange(attention, message)} />
                {attention}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="personal-attention-card__message">
          <span>Votre message</span>
          <textarea rows={4} value={message} onChange={(event) => onChange(value, event.target.value)} placeholder="Racontez-nous ce que vous imaginez…" />
        </label>
      </div>
    </section>
  );
}
