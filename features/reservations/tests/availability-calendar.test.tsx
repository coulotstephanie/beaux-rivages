import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AvailabilityCalendar } from "../components/AvailabilityCalendar";

const useAvailabilityCalendar = vi.fn();

vi.mock("../hooks", () => ({
  useAvailabilityCalendar: (...args: unknown[]) => useAvailabilityCalendar(...args),
}));

vi.mock("@/platform/analytics/events", () => ({
  trackEvent: vi.fn(),
}));

describe("AvailabilityCalendar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-01T12:00:00+02:00"));
    useAvailabilityCalendar.mockReturnValue({
      status: "ready",
      blocks: [
        { startsOn: "2026-07-30", endsOn: "2026-08-06" },
        { startsOn: "2026-08-07", endsOn: "2026-08-12" },
      ],
    });
  });

  it("allows arrival on the previous departure date", () => {
    const onChange = vi.fn();
    render(
      <AvailabilityCalendar
        arrival={null}
        departure={null}
        propertySlug="chai-des-tortues"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /jeudi 6 août.*départ/i }));
    expect(onChange).toHaveBeenCalledWith("2026-08-06", null);
    expect(useAvailabilityCalendar).toHaveBeenCalledWith("chai-des-tortues");
  });

  it("allows departure on the next reservation arrival date", () => {
    const onChange = vi.fn();
    render(
      <AvailabilityCalendar
        arrival="2026-08-06"
        departure={null}
        propertySlug="chai-des-tortues"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /vendredi 7 août.*départ possible/i }));
    expect(onChange).toHaveBeenCalledWith("2026-08-06", "2026-08-07");
  });

  it("keeps a genuinely occupied night unavailable", () => {
    render(
      <AvailabilityCalendar
        arrival={null}
        departure={null}
        propertySlug="chai-des-tortues"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /samedi 8 août.*occupé/i })).toBeDisabled();
  });
});
