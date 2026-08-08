export type ReferenceCalendarDay = {
  date: string;
  kind: "school_holiday" | "public_holiday" | "bridge";
  label: string;
  minimumNights?: number;
};

type OfficialHoliday = {
  description: string;
  start_date: string;
  end_date: string;
};

const schoolCalendarCache = new Map<string, Promise<ReferenceCalendarDay[]>>();

function iso(date: Date) {
  return date.toISOString().slice(0, 10);
}

function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function shifted(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function frenchPublicCalendar(year: number): ReferenceCalendarDay[] {
  const easter = easterSunday(year);
  const holidays = [
    [`${year}-01-01`, "Jour de l’An"],
    [iso(shifted(easter, 1)), "Lundi de Pâques"],
    [`${year}-05-01`, "Fête du Travail"],
    [`${year}-05-08`, "Victoire 1945"],
    [iso(shifted(easter, 39)), "Ascension"],
    [iso(shifted(easter, 50)), "Lundi de Pentecôte"],
    [`${year}-07-14`, "Fête nationale"],
    [`${year}-08-15`, "Assomption"],
    [`${year}-11-01`, "Toussaint"],
    [`${year}-11-11`, "Armistice"],
    [`${year}-12-25`, "Noël"],
  ] as const;
  const result: ReferenceCalendarDay[] = holidays.map(([date, label]) => ({
    date,
    label,
    kind: "public_holiday",
  }));
  for (const [date, label] of holidays) {
    const value = new Date(`${date}T12:00:00Z`);
    const bridgeStart = value.getUTCDay() === 2 ? -3 : value.getUTCDay() === 4 ? 0 : null;
    if (bridgeStart != null) {
      for (let offset = bridgeStart; offset < bridgeStart + 4; offset += 1)
        result.push({
          date: iso(shifted(value, offset)),
          kind: "bridge",
          label: `Pont de ${label}`,
          minimumNights: 4,
        });
    }
  }
  return result;
}

function parisIso(value: string) {
  const parts = new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

async function frenchSchoolCalendar(year: number, zone: "A" | "B" | "C") {
  const cacheKey = `${year}:${zone}`;
  const cached = schoolCalendarCache.get(cacheKey);
  if (cached) return cached;
  const request = (async () => {
    const where = `zones="Zone ${zone}" AND start_date <= date'${year}-12-31' AND end_date >= date'${year}-01-01'`;
    const url = new URL(
      "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records",
    );
    url.searchParams.set("select", "description,start_date,end_date");
    url.searchParams.set("where", where);
    url.searchParams.set("limit", "100");
    const response = await fetch(url, { next: { revalidate: 86_400 } });
    if (!response.ok) throw new Error("OFFICIAL_SCHOOL_CALENDAR_UNAVAILABLE");
    const payload = (await response.json()) as { results?: OfficialHoliday[] };
    const unique = new Map<string, OfficialHoliday>();
    for (const holiday of payload.results ?? [])
      unique.set(`${holiday.description}:${holiday.start_date}:${holiday.end_date}`, holiday);
    return [...unique.values()].flatMap((holiday) => {
      if (/^Début des vacances/i.test(holiday.description)) return [];
      const start = parisIso(holiday.start_date);
      const end = parisIso(holiday.end_date);
      const days: ReferenceCalendarDay[] = [];
      for (
        const day = new Date(`${start}T12:00:00Z`);
        iso(day) < end;
        day.setUTCDate(day.getUTCDate() + 1)
      ) {
        const date = iso(day);
        if (date.startsWith(String(year)))
          days.push({
            date,
            kind: "school_holiday",
            label: `${holiday.description} · Zone ${zone}`,
            minimumNights: 4,
          });
      }
      return days;
    });
  })();
  schoolCalendarCache.set(cacheKey, request);
  try {
    return await request;
  } catch (error) {
    schoolCalendarCache.delete(cacheKey);
    throw error;
  }
}

export async function frenchStayReferenceCalendar(
  years: number[],
  zone: "A" | "B" | "C" | "ALL" = "ALL",
) {
  const uniqueYears = [...new Set(years)];
  const zones = zone === "ALL" ? (["A", "B", "C"] as const) : [zone];
  const schoolDays = await Promise.all(
    uniqueYears.flatMap((year) =>
      zones.map((schoolZone) => frenchSchoolCalendar(year, schoolZone)),
    ),
  );
  return [...schoolDays.flat(), ...uniqueYears.flatMap((year) => frenchPublicCalendar(year))];
}
