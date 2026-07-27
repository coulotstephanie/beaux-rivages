import "server-only";
import { getDatabaseClient } from "./client";

export class SupabaseAvailabilityRepository {
  async isAvailable(propertySlug: string, arrival: string, departure: string) {
    const { data: property, error: propertyError } = await getDatabaseClient()
      .from("properties")
      .select("id")
      .eq("slug", propertySlug)
      .eq("status", "active")
      .single();
    if (propertyError) throw new Error(`PROPERTY_READ_FAILED:${propertyError.code}`);
    const { data, error } = await getDatabaseClient().rpc("is_property_available", {
      requested_property_id: property.id,
      requested_arrival: arrival,
      requested_departure: departure,
    });
    if (error) throw new Error(`AVAILABILITY_CHECK_FAILED:${error.code}`);
    return Boolean(data);
  }

  async list(propertySlug: string, from: string, to: string) {
    const { data, error } = await getDatabaseClient()
      .from("availability")
      .select("day,status,source")
      .eq("properties.slug", propertySlug)
      .gte("day", from)
      .lte("day", to)
      .order("day");
    if (error) throw new Error(`AVAILABILITY_LIST_FAILED:${error.code}`);
    return data;
  }
}
