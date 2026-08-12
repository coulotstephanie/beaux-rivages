import type { ReactNode } from "react";
import type { Property } from "@/data";
import { getServerLocale, localizeDeep } from "@/i18n/server";
import { PropertyPage } from "./PropertyPage";

export async function LocalizedPropertyPage({
  property,
  children,
}: {
  property: Property;
  children?: ReactNode;
}) {
  const locale = await getServerLocale();
  return (
    <PropertyPage property={localizeDeep(locale, property)} locale={locale}>
      {children}
    </PropertyPage>
  );
}
