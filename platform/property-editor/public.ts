import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { getProperty, type Property } from "@/data";
import { applyVisualContent, type EditablePropertySlug } from "./contracts";
import { PropertyEditorRepository } from "./repository";

export async function getPublishedProperty(slug: EditablePropertySlug): Promise<Property> {
  noStore();
  const original = getProperty(slug);
  try {
    return applyVisualContent(original, (await new PropertyEditorRepository().get(slug)).published);
  } catch {
    return original;
  }
}
