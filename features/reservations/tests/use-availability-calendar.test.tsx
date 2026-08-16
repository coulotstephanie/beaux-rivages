import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAvailabilityCalendar } from "../hooks/use-availability-calendar";

describe("useAvailabilityCalendar", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("never exposes dates when public calendar sources are unreliable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          reliable: false,
          blocks: [],
        }),
      }),
    );

    const { result } = renderHook(() => useAvailabilityCalendar("nid-d-ete"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.blocks).toEqual([]);
  });

  it("exposes the existing blocks only when sources are reliable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          reliable: true,
          blocks: [{ startsOn: "2027-08-01", endsOn: "2027-08-08" }],
        }),
      }),
    );

    const { result } = renderHook(() => useAvailabilityCalendar("nid-d-ete"));
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.blocks).toEqual([{ startsOn: "2027-08-01", endsOn: "2027-08-08" }]);
  });
});
