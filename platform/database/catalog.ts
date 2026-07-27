import "server-only";
import { getDatabaseClient } from "./client";

export class SupabasePropertyRepository {
  async listActive() {
    const { data, error } = await getDatabaseClient()
      .from("properties")
      .select("id,slug,name,city,latitude,longitude,capacity_adults,capacity_children,pets_allowed,status")
      .eq("status", "active")
      .order("name");
    if (error) throw new Error(`PROPERTY_LIST_FAILED:${error.code}`);
    return data;
  }

  async listMedia(propertySlug: string) {
    const { data, error } = await getDatabaseClient()
      .from("property_media")
      .select("id,kind,storage_bucket,storage_path,external_url,title,category,alt_text,credits,licence,source_url,display_order,metadata,properties!inner(slug)")
      .eq("properties.slug", propertySlug)
      .eq("active", true)
      .order("display_order");
    if (error) throw new Error(`PROPERTY_MEDIA_LIST_FAILED:${error.code}`);
    return data;
  }
}

export class SupabaseRateRepository {
  async listForProperty(propertySlug: string) {
    const { data, error } = await getDatabaseClient()
      .from("rates")
      .select("*, seasons(*), properties!inner(slug)")
      .eq("properties.slug", propertySlug)
      .eq("enabled", true)
      .order("priority", { ascending: false });
    if (error) throw new Error(`RATE_LIST_FAILED:${error.code}`);
    return data;
  }

  async calculate(propertyId: string, arrival: string, departure: string) {
    const { data, error } = await getDatabaseClient().rpc("calculate_stay_price", {
      requested_property_id: propertyId,
      requested_arrival: arrival,
      requested_departure: departure,
    });
    if (error) throw new Error(`RATE_CALCULATION_FAILED:${error.code}`);
    return data;
  }
}
