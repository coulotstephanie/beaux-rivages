import { expect, test } from "@playwright/test";

test("recherche et favoris du Carnet restent accessibles au clavier", async ({ page }) => {
  await page.goto("/carnet");
  const search = page.getByRole("searchbox", { name: "Rechercher dans le Carnet" });
  await search.fill("Fort Boyard");
  await expect(page.getByText(/adresse.*trouvée/)).toBeVisible();
  await page.locator(".carnet-search").screenshot({
    path: "docs/screenshots/carnet-cms-search.png",
  });
  const favorite = page.getByRole("button", { name: /Ajouter .* aux favoris/ }).first();
  const name = await favorite.getAttribute("aria-label");
  const place = name?.replace(/^Ajouter /, "").replace(/ aux favoris$/, "") ?? "";
  await favorite.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: `Retirer ${place} des favoris` })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
