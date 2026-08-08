import { chromium } from "playwright";
import assert from "node:assert/strict";

const origin = process.env.VISUAL_EDITOR_ORIGIN ?? "http://localhost:3000";
const supportedHouses = ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"];
const requestedHouses = process.env.VISUAL_EDITOR_HOUSES?.split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const houses = requestedHouses?.length ? requestedHouses : supportedHouses;
assert.ok(
  houses.every((house) => supportedHouses.includes(house)),
  "VISUAL_EDITOR_HOUSES contient une maison inconnue",
);

const supportedViewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const requestedViewports = process.env.VISUAL_EDITOR_VIEWPORTS?.split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const viewports = requestedViewports?.length
  ? supportedViewports.filter((viewport) => requestedViewports.includes(viewport.name))
  : supportedViewports;
assert.ok(
  viewports.length > 0 && (!requestedViewports || viewports.length === requestedViewports.length),
  "VISUAL_EDITOR_VIEWPORTS contient une vue inconnue",
);
const browser = await chromium.launch();
try {
  for (const house of houses)
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const capture = async (path) => {
        const page = await context.newPage();
        await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
        await page.addStyleTag({
          content:
            "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
        });
        await page.evaluate(async () => {
          await document.fonts.ready;
          window.scrollTo(0, 0);
        });
        const image = await page.screenshot();
        await page.close();
        return image;
      };
      const preview = await capture(`/administration/apercu-maison/${house}`);
      const publicPage = await capture(`/maisons/${house}`);
      assert.deepEqual(
        preview,
        publicPage,
        `${house} (${viewport.name}) diffère de la page publique`,
      );
      console.log(`✓ ${house} · ${viewport.name} · identique pixel par pixel`);
      await context.close();
    }
} finally {
  await browser.close();
}
