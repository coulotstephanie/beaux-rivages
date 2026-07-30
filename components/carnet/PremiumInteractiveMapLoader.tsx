"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { premiumPlaces } from "@/carnetPremiumData";

function MapFallback({ retry }: { retry?: () => void }) {
  return (
    <div className="premium-map-fallback" role="status">
      <p>La carte interactive ne peut pas se charger pour le moment.</p>
      <p>Les itinéraires restent accessibles directement :</p>
      <div>
        {premiumPlaces.slice(0, 6).map((place) => (
          <a key={place.slug} href={place.mapUrl} target="_blank" rel="noreferrer">
            {place.name} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      {retry ? (
        <button type="button" onClick={retry}>
          Réessayer
        </button>
      ) : null}
    </div>
  );
}

const InteractiveMap = dynamic(
  () => import("./PremiumInteractiveMap").then((module) => module.PremiumInteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="premium-map-loading" role="status">
        <span aria-hidden="true" />
        <p>Chargement de la carte…</p>
        <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer">
          Ouvrir OpenStreetMap
        </a>
      </div>
    ),
  },
);

type MapRecoveryBoundaryState = {
  failed: boolean;
};

class MapRecoveryBoundary extends Component<{ children: ReactNode }, MapRecoveryBoundaryState> {
  state: MapRecoveryBoundaryState = { failed: false };

  static getDerivedStateFromError(): MapRecoveryBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to load the Carnet map", error, info.componentStack);
  }

  private retry = () => {
    this.setState({ failed: false });
  };

  render() {
    if (this.state.failed) return <MapFallback retry={this.retry} />;
    return this.props.children;
  }
}

export function PremiumInteractiveMap() {
  return (
    <MapRecoveryBoundary>
      <InteractiveMap />
    </MapRecoveryBoundary>
  );
}
