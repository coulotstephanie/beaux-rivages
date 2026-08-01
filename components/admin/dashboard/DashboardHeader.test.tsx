import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardHeader } from "./DashboardHeader";

describe("DashboardHeader", () => {
  it("conserve toutes les rubriques et leurs catégories accessibles", () => {
    render(
      <DashboardHeader
        view="dashboard"
        onView={vi.fn()}
        query=""
        onQuery={vi.fn()}
        results={[]}
        onResult={vi.fn()}
        dark={false}
        onTheme={vi.fn()}
        onSignOut={vi.fn()}
        busy={false}
        onRefresh={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Rubriques du Back Office" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Journée")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aujourd’hui" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("permet la navigation et la recherche avec des contrôles natifs", () => {
    const onView = vi.fn();
    const onQuery = vi.fn();
    render(
      <DashboardHeader
        view="dashboard"
        onView={onView}
        query=""
        onQuery={onQuery}
        results={[]}
        onResult={vi.fn()}
        dark={false}
        onTheme={vi.fn()}
        onSignOut={vi.fn()}
        busy={false}
        onRefresh={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Réservations" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Recherche globale" }), {
      target: { value: "Martin" },
    });
    expect(onView).toHaveBeenCalledWith("reservations");
    expect(onQuery).toHaveBeenCalledWith("Martin");
  });
});
