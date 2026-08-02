import { expect, test } from "@playwright/test";

test("a traveler can reach the availability calendar", async ({ page }) => {
  await page.route("**/api/calendar?property=*", (route) =>
    route.fulfill({ json: { blocks: [], sources: [{ status: "success" }] } }),
  );
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

test("a traveler sees the real total and receives a clear request reference", async ({ page }) => {
  const quote = {
    propertySlug: "chai-des-tortues",
    currency: "EUR",
    nights: 3,
    stayRules: { valid: true, requiredMinimum: 2, maximumNights: 28 },
    nightlyLines: [
      { date: "2026-11-09", rate: 220, season: "Basse saison" },
      { date: "2026-11-10", rate: 220, season: "Basse saison" },
      { date: "2026-11-11", rate: 220, season: "Basse saison" },
    ],
    accommodationBeforeDiscount: 660,
    promotion: null,
    accommodation: 660,
    cleaningFee: 95,
    touristTax: 0,
    securityDeposit: { amount: 800, includedInTotal: false },
    paymentSchedule: {
      depositPercentage: 30,
      depositDue: 226.5,
      balanceDue: 528.5,
      balanceDueDate: "2026-10-26",
      fullPaymentRequired: false,
    },
    optionLines: [],
    experienceLines: [],
    optionsTotal: 0,
    experiencesTotal: 0,
    total: 755,
  };
  await page.route("**/api/calendar?property=*", (route) =>
    route.fulfill({ json: { blocks: [], sources: [{ status: "success" }] } }),
  );
  await page.route("**/api/pricing**", (route) => route.fulfill({ json: quote }));
  await page.route("**/api/quote**", (route) =>
    route.fulfill({ json: { available: true, sourcesHealthy: true, quote } }),
  );
  await page.route("**/api/reservation**", (route) =>
    route.fulfill({
      status: 201,
      json: {
        reference: "BR-TEST-001",
        status: "requested",
        message: "Demande enregistrée.",
      },
    }),
  );

  await page.goto("/reserver?maison=chai-des-tortues");
  await page.getByRole("button", { name: /Continuer/i }).click();
  await page.getByRole("button", { name: "Mois suivant" }).click();
  await page.locator(".availability-calendar__days button:not([disabled])").nth(1).click();
  await page.locator(".availability-calendar__days button:not([disabled])").nth(4).click();
  await page.getByRole("button", { name: /Continuer/i }).click();
  await page.getByRole("button", { name: /Continuer/i }).click();
  await page.getByRole("button", { name: /Voir mon séjour/i }).click();

  await expect(page.getByText("755 €", { exact: true }).last()).toBeVisible();
  await expect(page.getByText(/Disponibilité contrôlée/)).toBeVisible();
  await page.getByLabel("Prénom").fill("Camille");
  await page.getByLabel("Nom", { exact: true }).fill("Martin");
  await page.getByLabel("Adresse e-mail").fill("camille@example.com");
  await page.getByRole("checkbox", { name: /Conditions Générales de Vente/ }).check();
  await page.getByRole("checkbox", { name: /politique d’annulation/ }).check();
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByText(/BR-TEST-001/)).toBeVisible();
  await expect(page.getByText(/Aucun paiement n’a été débité/)).toBeVisible();
});
