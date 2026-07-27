"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/platform/analytics/events";

export function Analytics() {
  const pathname = usePathname();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  useEffect(() => {
    trackEvent("page_view", { page_path: pathname });
    if (pathname.startsWith("/maisons/")) trackEvent("view_property", { property_slug: pathname.split("/").at(-1) ?? "" });
    if (pathname === "/reserver") trackEvent("booking_started");
  }, [pathname]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackEvent("phone_click");
      else if (href.startsWith("mailto:")) trackEvent("email_click");
      else if (href.includes("#contact")) trackEvent("contact_click");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  if (!measurementId) return null;
  return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" /><Script id="ga4-config" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false,anonymize_ip:true});`}</Script></>;
}
