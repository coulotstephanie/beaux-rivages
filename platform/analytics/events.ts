import { track } from "@vercel/analytics";

export type AnalyticsEventName =
  | "page_view"
  | "view_property"
  | "search_availability"
  | "booking_started"
  | "booking_quote_viewed"
  | "booking_abandoned"
  | "booking_request_submitted"
  | "booking_completed"
  | "contact_click"
  | "phone_click"
  | "email_click";

export function trackEvent(
  name: AnalyticsEventName,
  parameters: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  const layer = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  layer.dataLayer = layer.dataLayer ?? [];
  layer.dataLayer.push({ event: name, ...parameters });
  layer.gtag?.("event", name, parameters);
  track(name, parameters);
  window.dispatchEvent(
    new CustomEvent("beaux-rivages:conversion", { detail: { name, parameters } }),
  );
}
