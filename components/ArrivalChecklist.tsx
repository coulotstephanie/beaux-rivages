"use client";

import { useMemo, useState } from "react";

const sections = [
  {
    title: "À préparer",
    items: ["Confirmer le nombre de voyageurs", "Signaler bébé ou animal", "Ajouter le linge et les options", "Réserver vélos et activités sensibles"],
  },
  {
    title: "À emporter",
    items: ["Chaussures pour marcher", "Coupe-vent léger", "Protection solaire", "Gourde et petit sac de plage"],
  },
  {
    title: "La veille",
    items: ["Relire l’accès autonome", "Vérifier météo et marées", "Regarder le marché du lendemain", "Enregistrer le numéro de Stéphanie & Bruno"],
  },
] as const;

export function ArrivalChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  const allItems = sections.flatMap((section) => section.items);
  const progress = useMemo(() => Math.round((checked.length / allItems.length) * 100), [allItems.length, checked.length]);

  const toggle = (item: string) => setChecked((current) =>
    current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);

  return (
    <div className="arrival-checklist">
      <div className="arrival-checklist__progress">
        <div><span>Votre préparation</span><strong>{progress} %</strong></div>
        <div aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="arrival-checklist__grid">
        {sections.map((section, index) => (
          <fieldset key={section.title}>
            <legend><span>0{index + 1}</span>{section.title}</legend>
            {section.items.map((item) => (
              <label key={item}>
                <input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} />
                <span aria-hidden="true">{checked.includes(item) ? "✓" : ""}</span>
                {item}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <p>Cette liste reste enregistrée pendant votre visite uniquement. Aucun renseignement personnel n’est transmis.</p>
    </div>
  );
}
