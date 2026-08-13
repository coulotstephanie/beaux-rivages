import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";
import { Beds24Client } from "@/platform/beds24/client";
import { noStoreJson, rateLimit } from "@/platform/http/security";

const START = "2026-09-01";
const END = "2027-12-31";
const HOUSES = [
  {
    slug: "chai-des-tortues",
    name: "Le Chai des Tortues",
    propertyId: 347169,
    roomId: 716656,
    airbnbListingId: "1346326704165406766",
    bookingHotelId: "14072488",
    cleaningFee: 95,
    csv: "le_chai_des_tortues_tarifs_beaux_rivages_v2.csv",
  },
  {
    slug: "villa-raie-manta",
    name: "Villa Raie Manta",
    propertyId: 347170,
    roomId: 716657,
    airbnbListingId: "1352690589369037929",
    bookingHotelId: "14072403",
    cleaningFee: 130,
    csv: "villa_raie_manta_tarifs_beaux_rivages_v2.csv",
  },
] as const;

type Json = Record<string, unknown>;
const object = (value: unknown): Json =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : {};
const numberOrNull = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

function dates(start: string, end: string) {
  const result: string[] = [];
  for (let day = new Date(`${start}T12:00:00Z`); day <= new Date(`${end}T12:00:00Z`); day.setUTCDate(day.getUTCDate() + 1))
    result.push(day.toISOString().slice(0, 10));
  return result;
}

async function sourceRows(file: string, cleaningFee: number, slug: string) {
  const csv = await readFile(path.join(process.cwd(), "data/beds24", file), "utf8");
  return csv.replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(1).map((line) => {
    const [date, target, season, minimum] = line.split(";");
    const targetNightlyRate = Number(target);
    const minStay = Number(minimum);
    const withoutCleaning = (targetNightlyRate * minStay - cleaningFee) / minStay;
    const protectedPeriod = date >= "2027-07-17" && date <= "2027-08-15";
    return {
      slug,
      date,
      season,
      targetNightlyRate,
      minStay,
      expectedPrice1: Math.max(120, Math.ceil(protectedPeriod ? withoutCleaning : withoutCleaning / 0.81)),
      expectedPrice2: Math.max(100, Math.ceil(withoutCleaning)),
    };
  });
}

function calendarDays(payload: unknown[]) {
  const map = new Map<string, Json>();
  const visit = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(visit);
    const row = object(value);
    const from = typeof row.from === "string" ? row.from : typeof row.date === "string" ? row.date : null;
    const to = typeof row.to === "string" ? row.to : from;
    if (from && to) for (const date of dates(from, to)) map.set(date, row);
    for (const nested of Object.values(row)) if (nested && typeof nested === "object") visit(nested);
  };
  visit(payload);
  return map;
}

function bookingsAudit(payload: unknown[]) {
  const rows = payload.map((raw) => {
    const row = object(raw);
    return {
      id: row.id ?? null,
      channel: row.channel ?? null,
      status: row.status ?? null,
      arrival: row.arrival ?? null,
      departure: row.departure ?? null,
      apiReference: row.apiReference ?? row.apiRef ?? null,
    };
  });
  const active = rows.filter((row) => !["cancelled", "canceled"].includes(String(row.status).toLowerCase()));
  const overlaps = [];
  for (let left = 0; left < active.length; left += 1) for (let right = left + 1; right < active.length; right += 1) {
    if (String(active[left].arrival) < String(active[right].departure) && String(active[right].arrival) < String(active[left].departure))
      overlaps.push({ first: active[left].id, second: active[right].id, start: [active[left].arrival, active[right].arrival].sort().at(-1), end: [active[left].departure, active[right].departure].sort()[0] });
  }
  return { count: rows.length, rows, overlaps };
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 2, 60_000);
  if (limited) return limited;
  if (process.env.VERCEL_ENV !== "preview")
    return noStoreJson({ error: "Preview uniquement", writes: 0 }, { status: 403 });
  try {
    const client = new Beds24Client(fetch, "audit");
    const reports = [];
    const read = async <T>(label: string, operation: () => Promise<T>) => {
      try {
        return { ok: true as const, data: await operation(), error: null };
      } catch (error) {
        return {
          ok: false as const,
          data: null,
          error: `${label}:${error instanceof Error ? error.message : "UNKNOWN"}`,
        };
      }
    };
    for (const house of HOUSES) {
      const source = await sourceRows(house.csv, house.cleaningFee, house.slug);
      const [calendarResult, properties, airbnb, booking, bookings] = await Promise.all([
        read("calendar", () => client.readOnlyCalendar({ propertyId: house.propertyId, roomId: house.roomId, start: START, end: END })),
        read("properties", () => client.readOnlyEndpoint("/properties", { id: String(house.propertyId), includeAllRooms: "true", includePriceRules: "true", includeUnitDetails: "true" })),
        read("airbnb-settings", () => client.readOnlyEndpoint("/channels/settings", { propertyId: String(house.propertyId), roomId: String(house.roomId), channel: "airbnb" })),
        read("booking-settings", () => client.readOnlyEndpoint("/channels/settings", { propertyId: String(house.propertyId), roomId: String(house.roomId), channel: "booking" })),
        read("bookings", () => client.readOnlyEndpoint("/bookings", { propertyId: String(house.propertyId), roomId: String(house.roomId), includeGuests: "false", includeInvoiceItems: "false", includeInfoItems: "false" })),
      ]);
      const actual = calendarDays(calendarResult.data ?? []);
      const rows = source.map((expected) => {
        const current = actual.get(expected.date) ?? {};
        return {
          date: expected.date,
          availability: numberOrNull(current.numAvail ?? current.availability ?? current.inventory),
          price1: numberOrNull(current.price1),
          price2: numberOrNull(current.price2),
          minStay: numberOrNull(current.minStay),
          maxStay: numberOrNull(current.maxStay),
          expectedPrice1: expected.expectedPrice1,
          expectedPrice2: expected.expectedPrice2,
          expectedMinStay: expected.minStay,
        };
      });
      const bookingAudit = bookingsAudit(bookings.data?.data ?? []);
      const reservationDates = new Set<string>();
      for (const bookingRow of bookingAudit.rows) {
        if (typeof bookingRow.arrival === "string" && typeof bookingRow.departure === "string")
          for (const date of dates(bookingRow.arrival, bookingRow.departure).slice(0, -1)) reservationDates.add(date);
      }
      reports.push({
        house: { ...house, csv: `data/beds24/${house.csv}` },
        source: { count: source.length, first: source.at(0)?.date, last: source.at(-1)?.date },
        beds24: {
          datesPresent: rows.filter((row) => actual.has(row.date)).length,
          datesMissing: rows.filter((row) => !actual.has(row.date)).map((row) => row.date),
          price1Missing: rows.filter((row) => row.price1 == null).map((row) => row.date),
          price2Missing: rows.filter((row) => row.price2 == null).map((row) => row.date),
          minStayMissing: rows.filter((row) => row.minStay == null).map((row) => row.date),
          maxStayMissing: rows.filter((row) => row.maxStay == null).map((row) => row.date),
          closedWithoutReservation: rows.filter((row) => row.availability === 0 && !reservationDates.has(row.date)).map((row) => row.date),
          price1Different: rows.filter((row) => row.price1 !== row.expectedPrice1).length,
          price2Different: rows.filter((row) => row.price2 !== row.expectedPrice2).length,
          minStayDifferent: rows.filter((row) => row.minStay !== row.expectedMinStay).length,
        },
        readErrors: [calendarResult, properties, airbnb, booking, bookings].flatMap((result) => result.error ? [result.error] : []),
        settings: { properties: properties.data?.data ?? [], airbnb: airbnb.data?.data ?? [], booking: booking.data?.data ?? [] },
        bookings: bookingAudit,
        rows,
      });
    }
    return noStoreJson({ ok: true, method: "GET only", period: { start: START, end: END, expectedDates: 487 }, reports, writes: 0 });
  } catch (error) {
    return noStoreJson({ ok: false, error: error instanceof Error ? error.message.split(":")[0] : "AUDIT_FAILED", writes: 0 }, { status: 500 });
  }
}

export function POST() { return noStoreJson({ error: "METHOD_FORBIDDEN", writes: 0 }, { status: 405 }); }
export const PUT = POST;
export const PATCH = POST;
export const DELETE = POST;
