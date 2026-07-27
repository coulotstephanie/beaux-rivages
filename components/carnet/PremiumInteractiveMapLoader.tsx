"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("./PremiumInteractiveMap").then((module) => module.PremiumInteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="premium-map-loading" role="status">
        <span aria-hidden="true" />
        Chargement de la carte…
      </div>
    ),
  },
);

export function PremiumInteractiveMap() {
  return <InteractiveMap />;
}
