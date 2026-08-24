import { notFound } from "next/navigation";
import { PropertyVisualPreview } from "@/components/admin/PropertyVisualPreview";
import {
  editablePropertySlugs,
  type EditablePropertySlug,
} from "@/platform/property-editor/contracts";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!editablePropertySlugs.includes(slug as EditablePropertySlug)) notFound();
  return <PropertyVisualPreview slug={slug as EditablePropertySlug} />;
}
