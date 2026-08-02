import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { calculateSignaturePackPrice, SIGNATURE_PACK_IMAGE } from "@/booking";
import rates from "@/content/rates.json";
import { SignaturePackCard } from "@/components/SignaturePackCard";
import type { PropertyRatePlan } from "@/platform/pricing/contracts";
import { ratePlanRepository } from "@/platform/pricing/repository";
import { calculateQuote } from "@/platform/pricing/service";

const combinations = [
  { adults: 1, children: 0, babies: 0, expected: 145 },
  { adults: 2, children: 0, babies: 0, expected: 145 },
  { adults: 2, children: 0, babies: 1, expected: 145 },
  { adults: 2, children: 0, babies: 2, expected: 145 },
  { adults: 2, children: 1, babies: 0, expected: 165 },
  { adults: 2, children: 2, babies: 0, expected: 185 },
  { adults: 3, children: 0, babies: 0, expected: 165 },
  { adults: 4, children: 0, babies: 0, expected: 185 },
  { adults: 2, children: 2, babies: 1, expected: 185 },
  { adults: 6, children: 0, babies: 0, expected: 225 },
] as const;

describe("Pack Signature P0", () => {
  it.each(combinations)(
    "calcule $expected € pour $adults adulte(s), $children enfant(s) et $babies bébé(s)",
    ({ adults, children, expected }) => {
      expect(calculateSignaturePackPrice({ adults, children })).toBe(expected);
    },
  );

  it("utilise la même règle dans le devis et l'échéancier de paiement", async () => {
    const plan = (rates.plans as PropertyRatePlan[]).find(
      (candidate) => candidate.propertySlug === "chai-des-tortues",
    )!;
    vi.spyOn(ratePlanRepository, "get").mockResolvedValue(structuredClone(plan));

    const quote = await calculateQuote({
      propertySlug: "chai-des-tortues",
      arrival: "2027-06-07",
      departure: "2027-06-14",
      adults: 2,
      children: 2,
      babies: 1,
      pets: 0,
      options: ["signature"],
      experiences: [],
    });
    const signature = quote.optionLines.find((line) => line.id === "signature");

    expect(signature).toMatchObject({ quantity: 1, unitPrice: 185, total: 185 });
    expect(quote.optionsTotal).toBe(185);
    expect(quote.paymentSchedule.depositDue + quote.paymentSchedule.balanceDue).toBe(quote.total);
  });

  it("affiche immédiatement le prix réel, l'exclusion des bébés et l'image officielle", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <SignaturePackCard
        selected={false}
        guests={{ adults: 2, children: 0, babies: 1 }}
        onToggle={onToggle}
      />,
    );

    expect(screen.getByAltText(/Pack Signature/i).getAttribute("src")).toContain(
      encodeURIComponent(SIGNATURE_PACK_IMAGE),
    );
    expect(screen.getByText(/145 € · 2 personnes payantes · 1 bébé non facturé/)).toBeVisible();

    rerender(
      <SignaturePackCard
        selected
        guests={{ adults: 2, children: 2, babies: 1 }}
        onToggle={onToggle}
      />,
    );
    expect(screen.getByText(/185 € · 4 personnes payantes · 1 bébé non facturé/)).toBeVisible();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
