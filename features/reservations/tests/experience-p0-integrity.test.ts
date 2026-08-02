import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { experiences } from "@/experiences";
import { hospitalityServices } from "@/hospitalityServices";

const root = process.cwd();

describe("intégrité P0 des expériences", () => {
  it("utilise les liens partenaires officiels et sûrs", () => {
    const page = readFileSync(resolve(root, "app/experiences/[slug]/page.tsx"), "utf8");
    const sections = readFileSync(
      resolve(root, "components/experiences/ExperienceSections.tsx"),
      "utf8",
    );

    expect(page).toContain("https://www.confetti-patisserie.com/les-ateliers/");
    expect(page).toContain("Réservation directement auprès de Confetti selon les disponibilités.");
    expect(page).toContain("https://www.reedukcoach.fr/");
    expect(page).toContain("Réservation directement auprès de Rééduk Coach");
    expect(sections).toContain('target={bookingExternal ? "_blank" : undefined}');
    expect(sections).toContain('rel={bookingExternal ? "noopener noreferrer" : undefined}');
  });

  it("ne propose pas de demande interne pour les expériences gratuites ou partenaires", () => {
    const collection = readFileSync(resolve(root, "components/ExperienceCollection.tsx"), "utf8");
    for (const slug of [
      "lever-de-soleil",
      "coucher-de-soleil",
      "peche-a-pied",
      "balade-velo",
      "famille",
      "atelier-macarons",
      "bien-etre",
    ]) {
      expect(collection).toContain(`"${slug}"`);
    }
  });

  it("distingue clairement la Signature du panier apéritif", () => {
    const signature = experiences.find((experience) => experience.slug === "pack-signature");
    const signatureService = hospitalityServices.find(
      (service) => service.slug === "experience-signature",
    );
    const aperitif = hospitalityServices.find((service) => service.slug === "panier-aperitif");

    expect(signature?.image).toBe(
      "/images/destination/experiences/experience-signature-chai-authentique.jpg",
    );
    expect(signatureService?.image).toBe(signature?.image);
    expect(signatureService?.image).not.toBe(aperitif?.image);
    expect(existsSync(resolve(root, `public${signature?.image}`))).toBe(true);
  });

  it("associe deux affiches distinctes aux deux films saisonniers", () => {
    const page = readFileSync(resolve(root, "app/saisons/page.tsx"), "utf8");
    expect(page).toContain('poster={siteMedia.properties["chai-des-tortues"].hero.src}');
    expect(page).toContain('poster={siteMedia.properties["chai-des-tortues"].bedrooms[0].src}');
  });
});
