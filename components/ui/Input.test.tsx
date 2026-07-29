import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("connects its label and error message to the field", () => {
    render(<Input label="Adresse e-mail" error="Cette adresse est requise." defaultValue="" />);

    const input = screen.getByRole("textbox", { name: "Adresse e-mail" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Cette adresse est requise.");
  });
});
