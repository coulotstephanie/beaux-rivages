export type ReferenceCalendarDay = {
  date: string;
  kind: "school_holiday" | "public_holiday" | "bridge";
  label: string;
};

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
  for (const [date] of holidays) {
    const value = new Date(`${date}T12:00:00Z`);
    if (value.getUTCDay() === 2)
      result.push({ date: iso(shifted(value, -1)), kind: "bridge", label: "Pont possible" });
    if (value.getUTCDay() === 4)
      result.push({ date: iso(shifted(value, 1)), kind: "bridge", label: "Pont possible" });
  }
  return result;
}
