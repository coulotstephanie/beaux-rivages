import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import { calculateRevenueKpis } from "../services";

const oneDay = 86_400_000;

function nightsBetween(start: string, end: string) {
  return Math.max(
    0,
    Math.round((Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) / oneDay),
  );
}

export class RevenueAnalyticsRepository {
  private client = getDatabaseClient();

  async annual(year: number) {
    const startsOn = `${year}-01-01`;
    const endsOn = `${year + 1}-01-01`;
    const [propertiesResult, reservationsResult] = await Promise.all([
      this.client.from("properties").select("id,slug,name").order("name"),
      this.client
        .from("reservations")
        .select("property_id,arrival,departure,total_cents,status")
        .lt("arrival", endsOn)
        .gt("departure", startsOn)
        .in("status", ["confirmed", "completed"]),
    ]);
    if (propertiesResult.error)
      throw new Error(`REVENUE_PROPERTIES_FAILED:${propertiesResult.error.code}`);
    if (reservationsResult.error)
      throw new Error(`REVENUE_RESERVATIONS_FAILED:${reservationsResult.error.code}`);
    const availableNights = nightsBetween(startsOn, endsOn);
    return propertiesResult.data.map((property) => {
      const reservations = reservationsResult.data.filter(
        (reservation) => reservation.property_id === property.id,
      );
      const occupiedNights = reservations.reduce(
        (sum, reservation) =>
          sum +
          nightsBetween(
            reservation.arrival < startsOn ? startsOn : reservation.arrival,
            reservation.departure > endsOn ? endsOn : reservation.departure,
          ),
        0,
      );
      return {
        propertyId: property.id,
        propertySlug: property.slug,
        propertyName: property.name,
        ...calculateRevenueKpis({
          revenueCents: reservations.reduce((sum, reservation) => sum + reservation.total_cents, 0),
          occupiedNights: Math.min(availableNights, occupiedNights),
          availableNights,
          reservations: reservations.length,
        }),
      };
    });
  }
}
