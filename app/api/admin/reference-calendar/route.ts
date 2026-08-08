import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import {
  frenchPublicCalendar,
  frenchStayReferenceCalendar,
} from "@/platform/calendar/french-reference-calendar";
import { noStoreJson, rateLimit } from "@/platform/http/security";

type EuropeanHoliday = {
  startDate: string;
  endDate: string;
  name: Array<{ language: string; text: string }>;
};

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const year = Number(request.nextUrl.searchParams.get("year"));
  const zone = request.nextUrl.searchParams.get("zone") ?? "B";
  const country = request.nextUrl.searchParams.get("country") ?? "FR";
  if (
    !Number.isInteger(year) ||
    year < 2025 ||
    year > 2035 ||
    !["FR", "DE", "BE"].includes(country) ||
    (country === "FR" && !["A", "B", "C"].includes(zone))
  )
    return noStoreJson({ error: "Calendrier de référence invalide." }, { status: 400 });

  if (country !== "FR") {
    const url = new URL("https://openholidaysapi.org/SchoolHolidays");
    url.searchParams.set("countryIsoCode", country);
    url.searchParams.set("languageIsoCode", "FR");
    url.searchParams.set("validFrom", `${year}-01-01`);
    url.searchParams.set("validTo", `${year}-12-31`);
    try {
      const response = await fetch(url, {
        headers: { Accept: "text/json" },
        next: { revalidate: 86400 },
      });
      if (!response.ok) throw new Error("EUROPEAN_CALENDAR_UNAVAILABLE");
      const holidays = (await response.json()) as EuropeanHoliday[];
      const days = holidays.flatMap((holiday) => {
        const result = [];
        const end = new Date(`${holiday.endDate}T12:00:00Z`);
        for (
          const day = new Date(`${holiday.startDate}T12:00:00Z`);
          day <= end;
          day.setUTCDate(day.getUTCDate() + 1)
        ) {
          const date = day.toISOString().slice(0, 10);
          if (date.startsWith(String(year)))
            result.push({
              date,
              kind: "school_holiday" as const,
              zone: country,
              country,
              label:
                holiday.name.find((name) => name.language === "FR")?.text ??
                holiday.name[0]?.text ??
                "Vacances scolaires",
            });
        }
        return result;
      });
      return noStoreJson({
        year,
        country,
        days,
        source: "OpenHolidays API — sources publiques européennes",
        sourceUrl: "https://www.openholidaysapi.org/en/sources-europe/",
      });
    } catch {
      return noStoreJson({
        year,
        country,
        days: [],
        warning: `Vacances scolaires ${country} momentanément indisponibles.`,
      });
    }
  }

  try {
    const days = await frenchStayReferenceCalendar([year], zone as "A" | "B" | "C");
    return noStoreJson({
      year,
      zone,
      days,
      source: "Ministère de l’Éducation nationale — calendrier scolaire officiel",
      sourceUrl:
        "https://data.education.gouv.fr/explore/dataset/fr-en-calendrier-scolaire/information/",
    });
  } catch {
    return noStoreJson({
      year,
      zone,
      days: frenchPublicCalendar(year),
      warning: "Vacances scolaires momentanément indisponibles. Les jours fériés restent affichés.",
    });
  }
}
