"use client";

import { useMemo, useState } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import {
  premiumMapCategories,
  premiumPlaces,
  type PremiumDestination,
  type PremiumMapCategory,
  type PremiumPlace,
} from "@/carnetPremiumData";

const destinations: PremiumDestination[] = ["Île de Ré", "Île d’Oléron", "La Rochelle"];
const tileProviders = {
  carto: {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
  },
  openStreetMap: {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
} as const;
const markerIcon = divIcon({
  className: "premium-map-marker",
  html: '<span aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function PlacePopup({ place }: { place: PremiumPlace }) {
  return (
    <article className="premium-map-popup">
      <p>
        {place.kind} · {place.destination}
      </p>
      <h3>{place.name}</h3>
      <p>{place.description}</p>
      <dl>
        <div>
          <dt>Distance</dt>
          <dd>{place.distance}</dd>
        </div>
        <div>
          <dt>À vélo</dt>
          <dd>{place.bikeTime}</dd>
        </div>
        <div>
          <dt>À pied</dt>
          <dd>{place.walkTime}</dd>
        </div>
      </dl>
      <div className="premium-map-popup__links">
        <a href={place.officialUrl} target="_blank" rel="noreferrer">
          Site officiel
        </a>
        <a href={place.mapUrl} target="_blank" rel="noreferrer">
          Itinéraire
        </a>
      </div>
    </article>
  );
}

export function PremiumInteractiveMap() {
  const [category, setCategory] = useState<PremiumMapCategory | "all">("all");
  const [destination, setDestination] = useState<PremiumDestination | "all">("all");
  const [tileProvider, setTileProvider] = useState<keyof typeof tileProviders>("carto");
  const [tileError, setTileError] = useState(false);
  const provider = tileProviders[tileProvider];
  const filteredPlaces = useMemo(
    () =>
      premiumPlaces.filter(
        (place) =>
          (category === "all" || place.category === category) &&
          (destination === "all" || place.destination === destination),
      ),
    [category, destination],
  );

  return (
    <div className="premium-map-explorer">
      <div className="premium-map-filters" aria-label="Filtres de la carte">
        <div>
          <span>Explorer</span>
          <button
            type="button"
            className={category === "all" ? "is-active" : ""}
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
          >
            Tout
          </button>
          {premiumMapCategories.map((item) => (
            <button
              type="button"
              key={item.id}
              className={category === item.id ? "is-active" : ""}
              onClick={() => setCategory(item.id)}
              aria-pressed={category === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div>
          <span>Destination</span>
          <button
            type="button"
            className={destination === "all" ? "is-active" : ""}
            onClick={() => setDestination("all")}
            aria-pressed={destination === "all"}
          >
            Toutes
          </button>
          {destinations.map((item) => (
            <button
              type="button"
              key={item}
              className={destination === item ? "is-active" : ""}
              onClick={() => setDestination(item)}
              aria-pressed={destination === item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="premium-map-count" aria-live="polite">
        {filteredPlaces.length} repère{filteredPlaces.length > 1 ? "s" : ""} affiché
        {filteredPlaces.length > 1 ? "s" : ""}
      </p>

      <div className="premium-map-layout">
        <MapContainer
          center={[46.08, -1.22]}
          zoom={10}
          scrollWheelZoom={false}
          zoomControl={false}
          className="premium-leaflet-map"
          aria-label="Carte interactive du Carnet Beaux Rivages"
        >
          <TileLayer
            key={tileProvider}
            attribution={provider.attribution}
            url={provider.url}
            subdomains={"subdomains" in provider ? provider.subdomains : undefined}
            maxZoom={20}
            eventHandlers={{
              tileload: () => setTileError(false),
              tileerror: () => {
                setTileError(true);
                if (tileProvider === "carto") setTileProvider("openStreetMap");
              },
            }}
          />
          <ZoomControl position="bottomright" />
          {filteredPlaces.map((place) => (
            <Marker
              key={place.slug}
              position={[place.coordinates[0], place.coordinates[1]]}
              icon={markerIcon}
              title={place.name}
              alt={`Repère : ${place.name}`}
            >
              <Popup minWidth={285} maxWidth={330}>
                <PlacePopup place={place} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="premium-map-list" aria-label="Liste des repères affichés">
          {tileError && tileProvider === "openStreetMap" ? (
            <div className="premium-map-notice" role="status">
              <strong>La carte détaillée ne répond pas.</strong>
              <span>Toutes les adresses restent disponibles ci-dessous avec leur itinéraire.</span>
              <button
                type="button"
                onClick={() => {
                  setTileError(false);
                  setTileProvider("carto");
                }}
              >
                Réessayer la carte
              </button>
            </div>
          ) : null}
          {filteredPlaces.map((place) => (
            <article key={place.slug} id={`place-${place.slug}`}>
              <div>
                <p>
                  {place.kind} · {place.destination}
                </p>
                <h3>{place.name}</h3>
                <p>{place.description}</p>
              </div>
              <dl>
                <div>
                  <dt>Distance</dt>
                  <dd>{place.distance}</dd>
                </div>
                <div>
                  <dt>Vélo</dt>
                  <dd>{place.bikeTime}</dd>
                </div>
                <div>
                  <dt>À pied</dt>
                  <dd>{place.walkTime}</dd>
                </div>
              </dl>
              {place.hostTip ? (
                <blockquote>
                  <span>Conseil de Stéphanie & Bruno</span>« {place.hostTip} »
                </blockquote>
              ) : null}
              <div className="premium-map-list__actions">
                <a href={place.officialUrl} target="_blank" rel="noreferrer">
                  Site officiel <span aria-hidden="true">↗</span>
                </a>
                <a href={place.mapUrl} target="_blank" rel="noreferrer">
                  Voir la carte <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
