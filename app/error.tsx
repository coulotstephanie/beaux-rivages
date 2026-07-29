"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { SystemState } from "@/components/states";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <>
      <SystemState
        code="500"
        eyebrow="Un contretemps"
        title="La page a rencontré un imprévu."
        description="Nos autres espaces restent disponibles. Vous pouvez réessayer dans un instant."
      />
      <div className="system-state__retry">
        <Button variant="secondary" onClick={reset}>
          Réessayer
        </Button>
      </div>
    </>
  );
}
