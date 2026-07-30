export type IntegrationStatus = { id: "stripe" | "email" | "sms" | "ical" | "google-calendar"; label: string; configured: boolean; mode: string; missing: string[] };

const configured = (names: string[]) => ({ configured: names.every((name) => Boolean(process.env[name])), missing: names.filter((name) => !process.env[name]) });

export function getIntegrationStatuses(): IntegrationStatus[] {
  const stripe = configured(["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]);
  const email = configured(["RESEND_API_KEY", "EMAIL_FROM"]);
  const sms = configured(["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_MESSAGING_SERVICE_SID"]);
  const icalNames = Object.keys(process.env).filter((name) => name.startsWith("ICAL_") && name.endsWith("_URL"));
  const google = configured(["GOOGLE_CALENDAR_CLIENT_ID", "GOOGLE_CALENDAR_CLIENT_SECRET", "GOOGLE_CALENDAR_REDIRECT_URI"]);
  return [
    { id: "stripe", label: "Stripe", ...stripe, mode: process.env.STRIPE_ALLOW_LIVE === "true" ? "live" : "test" },
    { id: "email", label: "Email · Resend", ...email, mode: "transactionnel" },
    { id: "sms", label: "SMS · Twilio", ...sms, mode: "désactivé par défaut" },
    { id: "ical", label: "Synchronisation iCal", configured: icalNames.some((name) => Boolean(process.env[name])), missing: icalNames.length ? [] : ["ICAL_*_URL"], mode: "lecture seule" },
    { id: "google-calendar", label: "Google Calendar", ...google, mode: "OAuth 2.0" },
  ];
}
