import { LocalizedPropertyPage } from "@/components/LocalizedPropertyPage";
import { getProperty } from "@/data";
import { createPageMetadata, createPropertySeo } from "@/seo";
import { GuestBookPreview } from "@/components/guestbook/GuestBookPreview";
import { getPublishedProperty } from "@/platform/property-editor/public";

const property = getProperty("chai-des-tortues");
const pageSeo = createPropertySeo(property);

export const metadata = createPageMetadata({
  ...pageSeo,
  image: property.hero,
  openGraphTitle: `${property.title} · ${property.location}`,
});

export default async function Page() {
  const managedProperty = await getPublishedProperty("chai-des-tortues");
  return (
    <LocalizedPropertyPage property={managedProperty}>
      <GuestBookPreview />
    </LocalizedPropertyPage>
  );
}
