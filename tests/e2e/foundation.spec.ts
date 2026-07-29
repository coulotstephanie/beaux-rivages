import { expect, test } from "@playwright/test";

test("the public homepage remains available", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Beaux Rivages/i);
  await expect(page.locator("main")).toBeVisible();
});

test("the maintenance page explains the temporary interruption", async ({ page }) => {
  await page.goto("/maintenance");

  await expect(
    page.getByRole("heading", { name: /Nous préparons la suite avec soin/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Revenir à l’accueil/i })).toBeVisible();
});

test("unknown routes expose a useful recovery action", async ({ page }) => {
  await page.goto("/page-inconnue");

  await expect(
    page.getByRole("heading", {
      name: /Le chemin s’arrête ici. L’horizon, lui, continue/i,
    }),
  ).toBeVisible();
});
