import { LocalizedPropertyPage } from "@/components/LocalizedPropertyPage";
import { NidHeritageTeaser } from "@/components/NidHeritageTeaser";
import { getProperty } from "@/data";
import { createPageMetadata, createPropertySeo } from "@/seo";
import { getPublishedProperty } from "@/platform/property-editor/public";

const property = getProperty("nid-d-ete");
const pageSeo = createPropertySeo(property);

export const metadata = createPageMetadata({
  ...pageSeo,
  image: property.hero,
  openGraphTitle: `${property.title} · ${property.location}`,
});

export default async function Page() {
  const managedProperty = await getPublishedProperty("nid-d-ete");
  return (
    <LocalizedPropertyPage property={managedProperty}>
      <NidHeritageTeaser />
    </LocalizedPropertyPage>
  );
}
