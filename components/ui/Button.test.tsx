import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a native button with its accessible name", () => {
    render(<Button>Continuer</Button>);

    expect(screen.getByRole("button", { name: "Continuer" })).toBeInTheDocument();
  });

  it("renders a navigation link when href is provided", () => {
    render(<Button href="/maisons">Découvrir les maisons</Button>);

    expect(screen.getByRole("link", { name: "Découvrir les maisons" })).toHaveAttribute(
      "href",
      "/maisons",
    );
  });
});
