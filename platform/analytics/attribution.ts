export type TrafficAttribution = {
  traffic_source: string;
  traffic_medium: string;
  traffic_campaign?: string;
  referrer_host?: string;
};

const STORAGE_KEY = "beaux-rivages:first-touch";

function clean(value: string | null, fallback = "") {
  return (value ?? fallback).trim().slice(0, 80);
}

export function parseAttribution(urlValue: string, referrerValue = ""): TrafficAttribution {
  const url = new URL(urlValue);
  const source = clean(url.searchParams.get("utm_source"));
  const medium = clean(url.searchParams.get("utm_medium"));
  const campaign = clean(url.searchParams.get("utm_campaign"));
  let referrerHost = "";

  try {
    referrerHost = referrerValue ? new URL(referrerValue).hostname.replace(/^www\./, "") : "";
  } catch {
    referrerHost = "";
  }

  return {
    traffic_source: source || referrerHost || "direct",
    traffic_medium: medium || (referrerHost ? "referral" : "none"),
    ...(campaign ? { traffic_campaign: campaign } : {}),
    ...(referrerHost ? { referrer_host: referrerHost } : {}),
  };
}

export function getTrafficAttribution(): TrafficAttribution {
  const current = parseAttribution(window.location.href, document.referrer);

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as TrafficAttribution;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Analytics still works when storage is unavailable or refused.
  }

  return current;
}
