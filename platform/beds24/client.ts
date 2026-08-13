import "server-only";
import type { Beds24AirbnbCalendarRange, Beds24CalendarRange } from "./contracts";
import { assertAirbnbPrice2Payload } from "./airbnb-price2-payload";
import { NID_BEDS24 } from "./rates";

type CalendarDay = {
  from?: string;
  to?: string;
  price1?: number | null;
  price2?: number | null;
  minStay?: number | null;
};
type ApiResponse = {
  success?: boolean;
  data?: Array<{ propertyId?: number; roomId?: number; calendar?: CalendarDay[] }>;
  error?: { code?: string; message?: string } | string;
};
type PriceRule = {
  id?: number;
  name?: string;
  channels?: Record<string, { enabled?: boolean }>;
};
type AuthenticationResponse = { token?: string; expiresIn?: number };

let cachedAuthentication: { token: string; expiresAt: number } | null = null;

export class Beds24Client {
  private readonly baseUrl =
    process.env.BEDS24_API_BASE_URL?.trim() || "https://beds24.com/api/v2";
  private readonly refreshToken: string | undefined;

  constructor(
    private readonly request: typeof fetch = fetch,
    credential: "calendar" | "audit" | "setup" = "calendar",
  ) {
    this.refreshToken = (
      credential === "audit"
        ? process.env.BEDS24_AUDIT_REFRESH_TOKEN
        : credential === "setup"
          ? process.env.BEDS24_SETUP_REFRESH_TOKEN
        : process.env.BEDS24_REFRESH_TOKEN
    )?.trim();
  }

  private async token() {
    if (cachedAuthentication && cachedAuthentication.expiresAt > Date.now() + 60_000)
      return cachedAuthentication.token;
    if (!this.refreshToken) throw new Error("BEDS24_REFRESH_TOKEN_NOT_CONFIGURED");
    const response = await this.request(`${this.baseUrl}/authentication/token`, {
      method: "GET",
      headers: { accept: "application/json", refreshToken: this.refreshToken },
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as AuthenticationResponse | null;
    if (!response.ok || !payload?.token) throw new Error(`BEDS24_AUTHENTICATION_FAILED:${response.status}`);
    cachedAuthentication = {
      token: payload.token,
      expiresAt: Date.now() + Math.max(60, payload.expiresIn ?? 3600) * 1000,
    };
    return payload.token;
  }

  private async headers() {
    return {
      accept: "application/json",
      "content-type": "application/json",
      token: await this.token(),
    };
  }

  private async response(response: Response) {
    const payload = (await response.json().catch(() => null)) as ApiResponse | null;
    if (!response.ok || !payload)
      throw new Error(`BEDS24_API_FAILED:${response.status}`);
    if (payload.success === false || payload.error) throw new Error("BEDS24_API_REJECTED");
    return payload;
  }

  async writeCalendar(ranges: Beds24CalendarRange[]) {
    const response = await this.request(`${this.baseUrl}/inventory/rooms/calendar`, {
      method: "POST",
      headers: await this.headers(),
      body: JSON.stringify([{ roomId: NID_BEDS24.roomId, calendar: ranges }]),
      cache: "no-store",
    });
    await this.response(response);
  }

  async writeAirbnbPrice2(roomId: number, ranges: Beds24AirbnbCalendarRange[]) {
    if (process.env.BEDS24_AIRBNB_PRICE2_WRITES_ENABLED !== "true")
      throw new Error("BEDS24_AIRBNB_PRICE2_WRITE_LOCKED");
    assertAirbnbPrice2Payload(roomId, ranges);
    const response = await this.request(`${this.baseUrl}/inventory/rooms/calendar`, {
      method: "POST",
      headers: await this.headers(),
      body: JSON.stringify([{ roomId, calendar: ranges }]),
      cache: "no-store",
    });
    await this.response(response);
  }

  async readCalendar(start: string, end: string) {
    const query = new URLSearchParams({
      startDate: start,
      endDate: end,
      roomId: String(NID_BEDS24.roomId),
      propertyId: String(NID_BEDS24.propertyId),
      includePrices: "true",
      includeMinStay: "true",
    });
    const response = await this.request(`${this.baseUrl}/inventory/rooms/calendar?${query}`, {
      method: "GET",
      headers: await this.headers(),
      cache: "no-store",
    });
    const payload = await this.response(response);
    return payload.data ?? [];
  }

  async readAirbnbPrice2Calendar(start: string, end: string) {
    if (
      start < NID_BEDS24.authorizedPeriod.start ||
      end > NID_BEDS24.authorizedPeriod.end ||
      start > end
    ) throw new Error("BEDS24_AIRBNB_DATE_FORBIDDEN");
    const query = new URLSearchParams({
      startDate: start,
      endDate: end,
      roomId: String(NID_BEDS24.roomId),
      propertyId: String(NID_BEDS24.propertyId),
      includePrices: "true",
    });
    const response = await this.request(`${this.baseUrl}/inventory/rooms/calendar?${query}`, {
      method: "GET",
      headers: await this.headers(),
      cache: "no-store",
    });
    const payload = await this.response(response);
    return payload.data ?? [];
  }

  async readDailyPriceRules() {
    const query = new URLSearchParams({
      id: String(NID_BEDS24.propertyId),
      includePriceRules: "true",
      includeAllRooms: "true",
    });
    const response = await this.request(`${this.baseUrl}/properties?${query}`, {
      method: "GET",
      headers: await this.headers(),
      cache: "no-store",
    });
    const payload = await this.response(response) as ApiResponse & { data?: unknown[] };
    const rules: PriceRule[] = [];
    const visit = (value: unknown) => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) return value.forEach(visit);
      const record = value as Record<string, unknown>;
      if (Array.isArray(record.priceRules)) rules.push(...(record.priceRules as PriceRule[]));
      Object.values(record).forEach(visit);
    };
    visit(payload.data);
    return rules.find((rule) => rule.id === NID_BEDS24.dailyPriceNumber) ?? null;
  }

  async readOnlyEndpoint(path: string, query: Record<string, string>) {
    if (![
      "/properties",
      "/bookings",
      "/channels/settings",
      "/channels/airbnb/users",
      "/channels/airbnb/listings",
    ].includes(path)) throw new Error("BEDS24_READ_ENDPOINT_FORBIDDEN");
    const response = await this.request(
      `${this.baseUrl}${path}?${new URLSearchParams(query)}`,
      { method: "GET", headers: await this.headers(), cache: "no-store" },
    );
    return this.response(response) as Promise<ApiResponse & { data?: unknown[] }>;
  }

  async readOnlyCalendar(input: {
    propertyId: number;
    roomId: number;
    start: string;
    end: string;
  }) {
    if (![716656, 716657].includes(input.roomId))
      throw new Error("BEDS24_AUDIT_ROOM_FORBIDDEN");
    if (input.start !== "2026-09-01" || input.end !== "2027-12-31")
      throw new Error("BEDS24_AUDIT_PERIOD_FORBIDDEN");
    const query = new URLSearchParams({
      propertyId: String(input.propertyId),
      roomId: String(input.roomId),
      startDate: input.start,
      endDate: input.end,
      includePrices: "true",
      includeMinStay: "true",
      includeMaxStay: "true",
      includeNumAvail: "true",
    });
    const response = await this.request(`${this.baseUrl}/inventory/rooms/calendar?${query}`, {
      method: "GET",
      headers: await this.headers(),
      cache: "no-store",
    });
    const payload = await this.response(response);
    return payload.data ?? [];
  }
}
