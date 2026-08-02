"use client";

import { useMemo, useState } from "react";
import { heritageHouses, type HeritageSite } from "@/content/patrimoine";

export function HeritageMap({ site }: { site: HeritageSite }) {
  const [houseIndex, setHouseIndex] = useState(0);
  const house = heritageHouses[houseIndex];
  const directions = useMemo(
    () =>
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(house.origin)}&destination=${encodeURIComponent(site.mapQuery)}`,
    [house.origin, site.mapQuery],
  );
  const bbox = `${site.coordinates.lng - 0.035},${site.coordinates.lat - 0.022},${site.coordinates.lng + 0.035},${site.coordinates.lat + 0.022}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${site.coordinates.lat}%2C${site.coordinates.lng}`;

  return (
    <div className="heritage-map">
      <iframe
        title={`Carte interactive — ${site.title}`}
        src={mapSrc}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="heritage-map__route">
        <p className="eyebrow">Préparer l’itinéraire</p>
        <h3>Partir depuis votre maison</h3>
        <div role="group" aria-label="Choisir la maison de départ">
          {heritageHouses.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={houseIndex === index ? "is-active" : ""}
              aria-pressed={houseIndex === index}
              onClick={() => setHouseIndex(index)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <a href={directions} target="_blank" rel="noreferrer">
          Ouvrir l’itinéraire →
        </a>
      </div>
    </div>
  );
}
