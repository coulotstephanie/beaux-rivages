import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { stayOptions } from "../booking";
import { calculateQuote } from "../platform/pricing/service";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const rates = JSON.parse(read("content/rates.json")) as {
  plans: { propertySlug: string; securityDeposit: number }[];
};

test("all three properties configure no security deposit", () => {
  assert.deepEqual(
    rates.plans.map((plan) => [plan.propertySlug, plan.securityDeposit]),
    [
      ["chai-des-tortues", 0],
      ["villa-raie-manta", 0],
      ["nid-d-ete", 0],
    ],
  );
});

test("quotes never charge or expose a security deposit amount", async () => {
  for (const propertySlug of ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"] as const) {
    const quote = await calculateQuote({
      propertySlug,
      arrival: "2027-08-01",
      departure: "2027-08-08",
      adults: 2,
      children: 0,
      babies: 0,
      pets: 0,
      options: [],
      experiences: [],
    });
    assert.deepEqual(quote.securityDeposit, { amount: 0, includedInTotal: false });
    assert.equal(
      quote.total,
      quote.accommodation +
        quote.cleaningFee +
        quote.touristTax +
        quote.optionsTotal +
        quote.experiencesTotal,
    );
  }
});

test("database values and financial settings cannot reactivate a deposit", () => {
  assert.match(read("platform/database/pricing.ts"), /securityDeposit:\s*0/);
  const settingsRoute = read("app/api/admin/financial-settings/route.ts");
  assert.match(settingsRoute, /securityDepositCents:\s*z\.literal\(0\)/);
  assert.match(settingsRoute, /security_deposit_cents:\s*0/);
});

test("the public summary and contract use the validated discreet wording", () => {
  const summary = read("components/PriceSummary.tsx");
  assert.match(summary, /Aucun dépôt de garantie n’est demandé\./);
  assert.doesNotMatch(summary, /Caution non encaissée/);

  const wording =
    "Aucun dépôt de garantie n’est demandé au locataire. Le locataire demeure néanmoins responsable des dommages, dégradations ou pertes qui lui sont imputables et qui seraient constatés pendant ou à l’issue du séjour, sur présentation des éléments justificatifs correspondants.";
  assert.match(read("platform/contracts/clauses.ts"), new RegExp(wording));
  assert.match(read("content/legal.ts"), new RegExp(wording));
});

test("every public translation contains the no-deposit wording", () => {
  const source =
    "Aucun dépôt de garantie n’est demandé au locataire. Le locataire demeure néanmoins responsable des dommages, dégradations ou pertes qui lui sont imputables et qui seraient constatés pendant ou à l’issue du séjour, sur présentation des éléments justificatifs correspondants.";
  for (const locale of ["en", "de", "es", "nl"]) {
    const dictionary = JSON.parse(read(`i18n/translations/${locale}.json`)) as Record<
      string,
      string
    >;
    assert.ok(dictionary[source]?.length > 80, `${locale} must translate the complete clause`);
    assert.ok(
      dictionary["Aucun dépôt de garantie n’est demandé."]?.length > 10,
      `${locale} must translate the discreet summary`,
    );
    assert.ok(dictionary["6. Caution"], `${locale} must translate the legal heading`);
    assert.ok(
      dictionary["Comment fonctionne la caution ?"],
      `${locale} must translate the FAQ question`,
    );
  }
});

test("legal pages localize only the security-deposit copy", () => {
  const legalPage = read("components/LegalPage.tsx");
  assert.match(legalPage, /securityDepositLegalCopy/);
  assert.match(legalPage, /localizeSecurityDepositCopy\(locale, body\)/);
});

test("no security deposit is offered as a selectable option", () => {
  assert.equal(
    stayOptions.some((option) =>
      /caution|garantie|security deposit/i.test(`${option.id} ${option.label}`),
    ),
    false,
  );
});
