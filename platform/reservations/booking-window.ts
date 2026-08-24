const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parisToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addUtcMonths(date: string, months: number) {
  const cursor = new Date(`${date}T12:00:00Z`);
  cursor.setUTCMonth(cursor.getUTCMonth() + months);
  return cursor.toISOString().slice(0, 10);
}

export function publicBookingWindow(today = parisToday()) {
  return {
    startsOn: today,
    endsOnExclusive: addUtcMonths(today, 12),
  };
}

export function isStayInsidePublicBookingWindow(
  arrival: string,
  departure: string,
  today = parisToday(),
) {
  if (!ISO_DATE.test(arrival) || !ISO_DATE.test(departure) || departure <= arrival) return false;
  const { startsOn, endsOnExclusive } = publicBookingWindow(today);
  return arrival >= startsOn && departure <= endsOnExclusive;
}
