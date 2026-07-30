export type GoogleCalendarEvent = { id: string; summary?: string; start: { date?: string; dateTime?: string }; end: { date?: string; dateTime?: string }; status?: string };

export class GoogleCalendarAdapter {
  async listEvents(input: { accessToken: string; calendarId: string; timeMin: string; timeMax: string }) {
    if (!input.accessToken) throw new Error("Google Calendar access token is required.");
    const query = new URLSearchParams({ timeMin: input.timeMin, timeMax: input.timeMax, singleEvents: "true", orderBy: "startTime", maxResults: "250" });
    const calendar = encodeURIComponent(input.calendarId);
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?${query}`, {
      headers: { authorization: `Bearer ${input.accessToken}`, accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Google Calendar returned ${response.status}.`);
    const data = await response.json() as { items?: GoogleCalendarEvent[]; nextPageToken?: string };
    return { events: data.items ?? [], nextPageToken: data.nextPageToken };
  }
}
