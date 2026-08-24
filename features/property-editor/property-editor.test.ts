import { describe, expect, it } from "vitest";
import { getProperty } from "@/data";
import {
  applyVisualContent,
  visualContentFromProperty,
} from "@/platform/property-editor/contracts";
import { propertyEditorMutationSchema } from "@/platform/property-editor/schemas";

describe("property visual editor", () => {
  it.each(["chai-des-tortues", "villa-raie-manta", "nid-d-ete"] as const)(
    "preserves the exact public property by default for %s",
    (slug) => {
      const original = getProperty(slug);
      expect(applyVisualContent(original, visualContentFromProperty(original))).toEqual(original);
    },
  );

  it("changes editable content without losing non-editorial property data", () => {
    const original = getProperty("villa-raie-manta");
    const content = {
      ...visualContentFromProperty(original),
      title: "Titre de recette",
      intro: "Paragraphe de recette",
    };
    const result = applyVisualContent(original, content);
    expect(result.title).toBe("Titre de recette");
    expect(result.intro).toBe("Paragraphe de recette");
    expect(result.amenityGroups).toEqual(original.amenityGroups);
    expect(result.faq).toEqual(original.faq);
  });

  it("validates draft and publication payloads", () => {
    const content = visualContentFromProperty(getProperty("nid-d-ete"));
    expect(propertyEditorMutationSchema.safeParse({ action: "save-draft", content }).success).toBe(
      true,
    );
    expect(propertyEditorMutationSchema.safeParse({ action: "publish", content }).success).toBe(
      true,
    );
    expect(propertyEditorMutationSchema.safeParse({ action: "discard" }).success).toBe(true);
  });
});
