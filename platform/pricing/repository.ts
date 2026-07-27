import rates from "@/content/rates.json";
import type { PropertySlug } from "@/platform/calendar/config";
import type { PropertyRatePlan, RatePlanRepository } from "./contracts";

const plans = rates.plans as PropertyRatePlan[];

export class ConfigurationRatePlanRepository implements RatePlanRepository {
  async get(propertySlug: PropertySlug) {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
      const { SupabasePricingPlanReader } = await import("@/platform/database/pricing");
      return new SupabasePricingPlanReader().get(propertySlug);
    }
    const plan = plans.find((candidate) => candidate.propertySlug === propertySlug);
    if (!plan) throw new Error(`Unknown rate plan: ${propertySlug}`);
    return structuredClone(plan);
  }
  async list() {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
      return Promise.all((["chai-des-tortues", "villa-raie-manta", "nid-d-ete"] satisfies PropertySlug[])
        .map((propertySlug) => this.get(propertySlug)));
    }
    return structuredClone(plans);
  }
  async save(plan: PropertyRatePlan): Promise<PropertyRatePlan> {
    void plan;
    throw new Error("Persistent rate storage is not configured.");
  }
}

export const ratePlanRepository = new ConfigurationRatePlanRepository();
