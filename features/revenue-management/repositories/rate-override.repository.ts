import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import type { z } from "zod";
import type { rateOverrideSchema } from "../schemas";

type RateOverrideInput = z.infer<typeof rateOverrideSchema>;

export class RateOverrideRepository {
  private client = getDatabaseClient();

  async create(input: RateOverrideInput) {
    const { data: property, error: propertyError } = await this.client
      .from("properties")
      .select("id")
      .eq("slug", input.propertySlug)
      .single();
    if (propertyError) throw new Error(`RATE_PROPERTY_FAILED:${propertyError.code}`);
    const { data, error } = await this.client
      .from("rate_overrides")
      .insert({
        property_id: property.id,
        name: input.name,
        kind: input.kind,
        begins_on: input.start,
        ends_on: input.end,
        nightly_rate_cents: Math.round(input.nightlyRate * 100),
        minimum_nights: input.minimumNights ?? null,
      })
      .select("id")
      .single();
    if (error) {
      if (error.code === "23514") throw new Error("RATE_OUTSIDE_GUARDRAILS");
      throw new Error(`RATE_OVERRIDE_WRITE_FAILED:${error.code}`);
    }
    return data;
  }
}
