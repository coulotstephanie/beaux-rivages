"use client";

import { useState } from "react";
import type { PropertyPresentation } from "@/propertyPresentation";
import { Badge } from "./ui";

export function NearbyMap({ map }: { map: PropertyPresentation["map"] }) {
  const [active, setActive] = useState(0);
  const place = map.places[active];

  return (
    <div className="nearby-map">
      <div className="nearby-map__canvas" aria-label="Carte schématique interactive des alentours">
        <span className="nearby-map__water" />
        <span className="nearby-map__road road-a" />
        <span className="nearby-map__road road-b" />
        <div className="nearby-map__home"><span>BR</span>{map.centerLabel}</div>
        {map.places.map((item, index) => (
          <button
            type="button"
            key={item.name}
            className={active === index ? "is-active" : ""}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span>{index + 1}</span>
            <span className="sr-only"> — {item.name}, {item.distance}</span>
          </button>
        ))}
      </div>
      <div className="nearby-map__panel" aria-live="polite">
        <Badge>{place.type}</Badge>
        <h3>{place.name}</h3>
        <p>{place.distance} depuis la maison</p>
        <div>
          {map.places.map((item, index) => (
            <button type="button" key={item.name} onClick={() => setActive(index)} className={active === index ? "is-active" : ""} aria-pressed={active === index}>
              <span>0{index + 1}</span>{item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
