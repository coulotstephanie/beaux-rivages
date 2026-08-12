import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
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
  const localizedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement<{ locale?: typeof locale }>, { locale })
    : children;
  return (
    <PropertyPage property={localizeDeep(locale, property)} locale={locale}>
      {localizedChildren}
    </PropertyPage>
  );
}
