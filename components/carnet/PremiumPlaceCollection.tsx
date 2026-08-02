"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  premiumMapCategories,
  premiumPlaces,
  type PremiumDestination,
  type PremiumMapCategory,
} from "@/carnetPremiumData";
import { Heading, Section } from "@/components/ui";

const destinationCopy = {
  "Île de Ré": "Artisans, villages, marchés et pistes : nos repères depuis Rivedoux.",
  "Île d’Oléron": "Fort Boyard, ports, forêt et plages : Oléron au rythme des marées.",
  "La Rochelle": "Vieux-Port, aquarium, tours, musées, shopping et solutions pratiques.",
} as const;

export function PremiumPlaceCollection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PremiumMapCategory | "all">("all");
  const [destinationFilter, setDestinationFilter] = useState<PremiumDestination | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    try {
      setFavorites(
        JSON.parse(localStorage.getItem("beaux-rivages-carnet-favorites") ?? "[]") as string[],
      );
    } catch {
      setFavorites([]);
    }
    const parameters = new URLSearchParams(window.location.search);
    const requestedQuery = parameters.get("recherche");
    const requestedCategory = parameters.get("categorie");
    if (requestedQuery) setQuery(requestedQuery);
    if (premiumMapCategories.some((item) => item.id === requestedCategory)) {
      setCategory(requestedCategory as PremiumMapCategory);
    }
  }, []);
  const visiblePlaces = useMemo(() => {
    const needle = query
      .trim()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase("fr");
    return premiumPlaces.filter((place) => {
      if (category !== "all" && place.category !== category) return false;
      if (destinationFilter !== "all" && place.destination !== destinationFilter) return false;
      if (favoritesOnly && !favorites.includes(place.slug)) return false;
      return (
        !needle ||
        [
          place.name,
          place.kind,
          place.category,
          place.destination,
          place.description,
          place.address,
          place.hostTip ?? "",
        ]
          .join(" ")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLocaleLowerCase("fr")
          .includes(needle)
      );
    });
  }, [category, destinationFilter, favorites, favoritesOnly, query]);
  const toggleFavorite = (slug: string) => {
    const next = favorites.includes(slug)
      ? favorites.filter((item) => item !== slug)
      : [...favorites, slug];
    setFavorites(next);
    localStorage.setItem("beaux-rivages-carnet-favorites", JSON.stringify(next));
  };

  return (
    <section className="premium-place-collection" id="guides">
      <span id="gastronomie" className="legacy-carnet-anchor" aria-hidden="true" />
      <span id="marches" className="legacy-carnet-anchor" aria-hidden="true" />
      <span id="plages" className="legacy-carnet-anchor" aria-hidden="true" />
      <span id="producteurs" className="legacy-carnet-anchor" aria-hidden="true" />
      <div className="shell carnet-search">
        <label htmlFor="carnet-search">Rechercher dans le Carnet</label>
        <input
          id="carnet-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Restaurant, plage, marché, vélo…"
        />
        <select
          aria-label="Filtrer par rubrique"
          value={category}
          onChange={(event) => setCategory(event.target.value as PremiumMapCategory | "all")}
        >
          <option value="all">Toutes les rubriques</option>
          {premiumMapCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrer par destination"
          value={destinationFilter}
          onChange={(event) =>
            setDestinationFilter(event.target.value as PremiumDestination | "all")
          }
        >
          <option value="all">Toutes les destinations</option>
          {(Object.keys(destinationCopy) as PremiumDestination[]).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <label className="carnet-search__favorite">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => setFavoritesOnly(event.target.checked)}
          />{" "}
          Mes favoris
        </label>
        <p aria-live="polite">
          {visiblePlaces.length} adresse{visiblePlaces.length > 1 ? "s" : ""} trouvée
          {visiblePlaces.length > 1 ? "s" : ""}
        </p>
      </div>
      {(Object.keys(destinationCopy) as (keyof typeof destinationCopy)[]).map(
        (destination, destinationIndex) => {
          const places = visiblePlaces.filter(
            (place) =>
              place.destination === destination &&
              !["parkings", "bornes-electriques"].includes(place.category),
          );
          if (!places.length) return null;
          return (
            <Section
              key={destination}
              tone={destinationIndex % 2 ? "light" : "sand"}
              className="premium-place-destination"
            >
              <Heading
                eyebrow="Guide premium"
                title={destination}
                description={destinationCopy[destination]}
              />
              <div className="premium-place-grid">
                {places.map((place) => (
                  <article key={place.slug} className="premium-place-card">
                    <div className="premium-place-card__media">
                      <Image
                        src={place.image}
                        alt={place.imageAlt}
                        fill
                        sizes="(max-width: 800px) 100vw, 31vw"
                        loading="lazy"
                        quality={85}
                      />
                      <span>{place.kind}</span>
                    </div>
                    <div className="premium-place-card__content">
                      <p>{place.destination}</p>
                      <div className="premium-place-card__title">
                        <h3>{place.name}</h3>
                        <button
                          type="button"
                          aria-pressed={favorites.includes(place.slug)}
                          aria-label={
                            favorites.includes(place.slug)
                              ? `Retirer ${place.name} des favoris`
                              : `Ajouter ${place.name} aux favoris`
                          }
                          onClick={() => toggleFavorite(place.slug)}
                        >
                          {favorites.includes(place.slug) ? "♥" : "♡"}
                        </button>
                      </div>
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
                      {place.hostTip ? (
                        <blockquote>
                          <span>Notre conseil</span>« {place.hostTip} »
                        </blockquote>
                      ) : null}
                      <div className="premium-place-card__actions">
                        <a href={place.officialUrl} target="_blank" rel="noreferrer">
                          Site officiel <span aria-hidden="true">↗</span>
                        </a>
                        <a href={place.mapUrl} target="_blank" rel="noreferrer">
                          Carte <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                      <p className="premium-place-card__credit">
                        Photo :{" "}
                        <a href={place.imageSource} target="_blank" rel="noreferrer">
                          {place.imageCredit}
                        </a>{" "}
                        · {place.imageLicense}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </Section>
          );
        },
      )}
    </section>
  );
}
