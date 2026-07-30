import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("announces an empty collection without hiding the next action", () => {
    render(
      <EmptyState
        title="Aucune réservation"
        description="Les prochaines réservations apparaîtront ici."
        action={{ label: "Voir les maisons", href: "/maisons" }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Aucune réservation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voir les maisons" })).toBeVisible();
  });
});
