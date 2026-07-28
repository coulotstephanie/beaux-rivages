"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildSmartRecommendations,
  getSeason,
  weatherDestinations,
  windCardinal,
  type TideState,
  type WeatherDestination,
  type WeatherSnapshot,
} from "@/weatherEngine";

type ApiResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
};

type MarineResponse = { current?: { sea_surface_temperature?: number; wave_height?: number } };

const tides: { value: TideState; label: string }[] = [
  { value: "basse", label: "Basse" },
  { value: "montante", label: "Montante" },
  { value: "haute", label: "Haute" },
  { value: "descendante", label: "Descendante" },
];

export function SmartWeatherAdvisor({ compact = false }: { compact?: boolean }) {
  const [destination, setDestination] = useState<WeatherDestination>("ile-de-re");
  const [tide, setTide] = useState<TideState>("montante");
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [sun, setSun] = useState<{ sunrise: string; sunset: string } | null>(null);
  const [sea, setSea] = useState<{ temperature?: number; waveHeight?: number } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const location = weatherDestinations[destination];
    const params = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
      daily: "temperature_2m_max,precipitation_probability_max,sunrise,sunset",
      timezone: "Europe/Paris",
      forecast_days: "2",
    });
    const marineParams = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: "sea_surface_temperature,wave_height",
      timezone: "Europe/Paris",
    });
    setStatus("loading");
    Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal }),
      fetch(`https://marine-api.open-meteo.com/v1/marine?${marineParams}`, { signal: controller.signal }),
    ])
      .then(async ([weatherResponse, marineResponse]) => {
        if (!weatherResponse.ok) throw new Error("Prévisions indisponibles");
        return [
          await weatherResponse.json() as ApiResponse,
          marineResponse.ok ? await marineResponse.json() as MarineResponse : null,
        ] as const;
      })
      .then(([data, marine]) => {
        setWeather({
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          maxTemperature: data.daily.temperature_2m_max[0] ?? data.current.temperature_2m,
          precipitationProbability: data.daily.precipitation_probability_max[0] ?? 0,
          season: getSeason(),
        });
        setSun({ sunrise: data.daily.sunrise[0], sunset: data.daily.sunset[0] });
        setSea(marine?.current ? {
          temperature: marine.current.sea_surface_temperature,
          waveHeight: marine.current.wave_height,
        } : null);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, [destination]);

  const recommendations = useMemo(
    () => weather ? buildSmartRecommendations(weather, destination, tide) : [],
    [destination, tide, weather],
  );

  return (
    <section className={`smart-weather${compact ? " smart-weather--compact" : ""}`} aria-labelledby="smart-weather-title">
      <div className="smart-weather__head">
        <div>
          <p className="eyebrow">Conseils du jour</p>
          <h2 id="smart-weather-title">Le littoral, selon les conditions.</h2>
        </div>
        {weather ? (
          <div className="smart-weather__now" aria-live="polite">
            <div><strong>{Math.round(weather.temperature)}°</strong><span>Air</span></div>
            <div><strong>{sea?.temperature == null ? "—" : `${Math.round(sea.temperature)}°`}</strong><span>Mer</span></div>
            <div><strong>{Math.round(weather.windSpeed)}</strong><span>Vent km/h · {windCardinal(weather.windDirection)}</span></div>
            <div><strong>{sun?.sunrise ? new Date(sun.sunrise).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}</strong><span>Lever du soleil</span></div>
            <div><strong>{sun?.sunset ? new Date(sun.sunset).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}</strong><span>Coucher du soleil</span></div>
            <div><strong>{sea?.waveHeight == null ? "—" : `${sea.waveHeight.toFixed(1)} m`}</strong><span>Houle</span></div>
          </div>
        ) : null}
      </div>

      <div className="smart-weather__controls">
        <fieldset>
          <legend>Destination</legend>
          {(Object.entries(weatherDestinations) as [WeatherDestination, typeof weatherDestinations[WeatherDestination]][]).map(([value, location]) => (
            <button key={value} type="button" className={destination === value ? "is-active" : ""} aria-pressed={destination === value} onClick={() => setDestination(value)}>
              {location.label}
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>État de la marée</legend>
          {tides.map((item) => (
            <button key={item.value} type="button" className={tide === item.value ? "is-active" : ""} aria-pressed={tide === item.value} onClick={() => setTide(item.value)}>
              {item.label}
            </button>
          ))}
          <a href={weatherDestinations[destination].tideUrl} target="_blank" rel="noreferrer">Horaires officiels des marées · SHOM ↗</a>
        </fieldset>
      </div>

      {status === "loading" ? <p className="smart-weather__status" role="status">Lecture des prévisions locales…</p> : null}
      {status === "error" ? (
        <div className="smart-weather__status" role="status">
          <p>Les prévisions ne répondent pas pour le moment. Le Carnet reste disponible pour choisir un programme.</p>
          <Link href="/carnet">Ouvrir le Carnet</Link>
        </div>
      ) : null}
      {status === "ready" ? (
        <div className="smart-weather__recommendations" aria-live="polite">
          {recommendations.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <p>{item.reason}</p>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              {item.href.startsWith("http") ? <a href={item.href} target="_blank" rel="noreferrer">{item.label} <span aria-hidden="true">↗</span></a> : <Link href={item.href}>{item.label} <span aria-hidden="true">→</span></Link>}
            </article>
          ))}
        </div>
      ) : null}
      <p className="smart-weather__source">
        Météo, soleil et mer : <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>. Horaires de marées : vérification officielle SHOM. Les conditions locales et consignes de sécurité prévalent toujours.
      </p>
    </section>
  );
}
