"use client";

import { useState } from "react";
import { carnetMapPoints } from "@/carnetData";
import { Badge } from "@/components/ui";

export function CarnetMap() {
  const [active, setActive] = useState(0);
  const point = carnetMapPoints[active];
  return (
    <div className="carnet-map">
      <div className="carnet-map__canvas" aria-label="Carte éditoriale interactive des îles">
        <span className="carnet-map__island island-re">Île de Ré</span>
        <span className="carnet-map__island island-oleron">Île d’Oléron</span>
        <span className="carnet-map__ocean">Océan Atlantique</span>
        {carnetMapPoints.map((item, index) => (
          <button
            type="button"
            key={item.type}
            className={active === index ? "is-active" : ""}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span>{index + 1}</span>
            <span className="sr-only"> — {item.type} : {item.name}</span>
          </button>
        ))}
      </div>
      <div className="carnet-map__panel" aria-live="polite">
        <Badge>{point.type}</Badge>
        <h3>{point.name}</h3>
        <p>Filtre actif : découvrez les adresses et expériences correspondantes dans les rubriques du Carnet, avec les conseils personnels de Stéphanie et Bruno.</p>
        <div>
          {carnetMapPoints.map((item, index) => (
            <button type="button" key={item.type} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-pressed={active === index}>
              <span>0{index + 1}</span>{item.type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
