import { expect, test } from "@playwright/test";

test("le Livre d’Or est consultable et filtrable au clavier", async ({ page }) => {
  await page.goto("/livre-d-or");
  await expect(
    page.getByRole("heading", { name: "Les mots laissés avant de refermer la porte." }),
  ).toBeVisible();
  await expect(page.getByText("Anne & Lydie")).toBeVisible();
  const language = page.getByRole("combobox", { name: "Langue", exact: true });
  await language.focus();
  await language.selectOption("en");
  await expect(page.getByText("Bart, Nynke, Aline, Yfke & Eize")).toBeVisible();
  await expect(page.getByText("Anne & Lydie")).toBeHidden();
});

test("le Chai présente un aperçu du Livre d’Or", async ({ page }) => {
  await page.goto("/maisons/chai-des-tortues");
  await expect(
    page.getByRole("heading", { name: "Les mots laissés avant de refermer la porte." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Voir tout le Livre d’Or/ })).toHaveAttribute(
    "href",
    "/livre-d-or",
  );
});
