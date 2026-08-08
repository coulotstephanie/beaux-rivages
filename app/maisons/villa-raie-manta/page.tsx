import { PropertyPage } from "@/components/PropertyPage";
import { getProperty } from "@/data";
import { createPageMetadata, createPropertySeo } from "@/seo";
import { getPublishedProperty } from "@/platform/property-editor/public";

const property = getProperty("villa-raie-manta");
const pageSeo = createPropertySeo(property);

export const metadata = createPageMetadata({
  ...pageSeo,
  image: property.hero,
  openGraphTitle: `${property.title} · ${property.location}`,
});

export default async function Page() {
  return <PropertyPage property={await getPublishedProperty("villa-raie-manta")} />;
}
