import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const expected = {
  "00_EXECUTIVE": ["Vision.md", "ProductStrategy.md", "Roadmap.md"],
  "01_PRODUCT": ["ProductBook.md", "Workflows.md", "BusinessRules.md", "Personas.md", "UserStories.md"],
  "02_BRAND": ["BrandBook.md", "EditorialGuide.md", "PhotoGuide.md", "VideoGuide.md"],
  "03_ARCHITECTURE": ["SystemArchitecture.md", "Database.md", "API.md", "Events.md", "Security.md"],
  "04_ENGINEERING": ["DeveloperHandbook.md", "CodingStandards.md", "Testing.md", "CICD.md"],
  "05_OPERATIONS": ["Runbooks.md", "Monitoring.md", "IncidentResponse.md", "BackupRecovery.md"],
  "06_AI": ["AIArchitecture.md", "AIWorkflows.md", "PromptLibrary.md"],
  "07_DESIGN": ["DesignSystem.md", "Components.md", "UXGuidelines.md", "Accessibility.md"],
} as const;

test("les sept espaces documentaires et leurs portails existent", () => {
  for (const [directory, files] of Object.entries(expected)) {
    assert.equal(existsSync(`docs/${directory}/README.md`), true);
    for (const file of files) {
      assert.equal(existsSync(`docs/${directory}/${file}`), true, `${directory}/${file}`);
    }
  }
});

test("les portails canoniques ne recopient pas les grandes références", () => {
  for (const file of [
    "docs/01_PRODUCT/BusinessRules.md",
    "docs/02_BRAND/BrandBook.md",
    "docs/03_ARCHITECTURE/SystemArchitecture.md",
    "docs/04_ENGINEERING/DeveloperHandbook.md",
  ]) {
    const content = readFileSync(file, "utf8");
    assert.match(content, /Source canonique/i);
    assert.ok(content.length < 600, `${file} doit rester un portail`);
  }
});

