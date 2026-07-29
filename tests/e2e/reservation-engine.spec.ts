import { expect, test } from "@playwright/test";

test("a traveler can reach the availability calendar", async ({ page }) => {
  await page.goto("/reserver");

  await page.getByRole("radio", { name: /Le Chai des Tortues/i }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: /Continuer/i }).click();

  await expect(
    page.getByRole("heading", {
      name: /Quand souhaitez-vous retrouver les îles/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Mois suivant" })).toBeVisible();
  await expect(page.getByLabel("Légende du calendrier")).toBeVisible();
});
