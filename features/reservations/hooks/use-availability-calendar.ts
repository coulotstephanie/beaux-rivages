"use client";

import { useEffect, useState } from "react";
import type { AvailabilityBlock } from "../types";

type CalendarState = {
  blocks: AvailabilityBlock[];
  status: "loading" | "ready" | "error";
};

export function useAvailabilityCalendar(propertySlug: string): CalendarState {
  const [state, setState] = useState<CalendarState>({
    blocks: [],
    status: "loading",
  });

  useEffect(() => {
    if (!propertySlug) {
      setState({ blocks: [], status: "error" });
      return;
    }

    const controller = new AbortController();
    setState({ blocks: [], status: "loading" });
    fetch(`/api/calendar?property=${encodeURIComponent(propertySlug)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("CALENDAR_UNAVAILABLE");
        return response.json() as Promise<{
          blocks: AvailabilityBlock[];
          reliable: boolean;
        }>;
      })
      .then(({ blocks, reliable }) => {
        if (!reliable) throw new Error("CALENDAR_UNRELIABLE");
        setState({ blocks, status: "ready" });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ blocks: [], status: "error" });
      });

    return () => controller.abort();
  }, [propertySlug]);

  return state;
}
