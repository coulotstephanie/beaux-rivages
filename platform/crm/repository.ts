import "server-only";

import { getDatabaseClient } from "@/platform/database/client";
import type { LoyaltyStatus, CrmTravelerSummary } from "./contracts";

type QueryClient = {
  // The migration is intentionally shipped with this repository; generated Supabase types are
  // refreshed only after it is applied to the validation project.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from(table: string): any;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function loyalty(stays: number, spent: number): LoyaltyStatus {
  if (stays >= 6 || spent >= 1_500_000) return "vip";
  if (stays >= 4 || spent >= 800_000) return "regular";
  if (stays >= 2 || spent >= 250_000) return "loyal";
  return "new";
}

export class CrmRepository {
  private db = getDatabaseClient() as unknown as QueryClient;

  private async base() {
    const [profiles, links, reservationGuests, reservations, properties] = await Promise.all([
      this.db.from("traveler_profiles").select("*").order("last_name").limit(5000),
      this.db.from("guest_profile_links").select("guest_id,profile_id"),
      this.db
        .from("reservation_guests")
        .select("reservation_id,guest_id,is_primary")
        .eq("is_primary", true),
      this.db
        .from("reservations")
        .select(
          "id,reference,property_id,status,channel,arrival,departure,adults,children,babies,pets,total_cents,created_at",
        )
        .limit(10000),
      this.db.from("properties").select("id,slug,name"),
    ]);
    const failed = [profiles, links, reservationGuests, reservations, properties].find(
      (item) => item.error,
    );
    if (failed?.error) throw new Error(`CRM_READ_FAILED:${failed.error.code}`);
    const profileByGuest = new Map(
      (links.data as Row[]).map((row) => [row.guest_id, row.profile_id]),
    );
    const reservationById = new Map((reservations.data as Row[]).map((row) => [row.id, row]));
    const reservationsByProfile = new Map<string, Row[]>();
    for (const link of reservationGuests.data as Row[]) {
      const profileId = profileByGuest.get(link.guest_id);
      const reservation = reservationById.get(link.reservation_id);
      if (!profileId || !reservation) continue;
      reservationsByProfile.set(profileId, [
        ...(reservationsByProfile.get(profileId) ?? []),
        reservation,
      ]);
    }
    const propertiesById = new Map((properties.data as Row[]).map((row) => [row.id, row]));
    return { profiles: profiles.data as Row[], reservationsByProfile, propertiesById };
  }

  async list(input: {
    query?: string;
    loyalty?: string;
    pets?: boolean;
    children?: boolean;
    locale?: string;
    country?: string;
    property?: string;
  }) {
    const { profiles, reservationsByProfile, propertiesById } = await this.base();
    const rows = profiles.map((profile): CrmTravelerSummary => {
      const stays = (reservationsByProfile.get(profile.id) ?? []).filter((row) =>
        ["confirmed", "completed"].includes(row.status),
      );
      const totalSpentCents = stays.reduce((sum, row) => sum + Number(row.total_cents ?? 0), 0);
      const visits = stays.map((row) => row.arrival).sort();
      const preferred = propertiesById.get(profile.preferred_property_id);
      return {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.normalized_email,
        phone: profile.phone ?? "",
        locale: profile.locale,
        countryCode: profile.country_code ?? "",
        stays: stays.length,
        totalSpentCents,
        firstVisit: visits[0] ?? null,
        lastVisit: visits.at(-1) ?? null,
        pets: stays.some((row) => row.pets > 0),
        children: stays.some((row) => row.children > 0 || row.babies > 0),
        preferredPropertySlug: preferred?.slug ?? null,
        loyalty: profile.loyalty_override ?? loyalty(stays.length, totalSpentCents),
      };
    });
    const query = input.query?.trim().toLocaleLowerCase("fr") ?? "";
    return rows
      .filter((row) => {
        const stays = reservationsByProfile.get(row.id) ?? [];
        const matchesQuery =
          !query ||
          [
            row.firstName,
            row.lastName,
            row.email,
            row.phone,
            ...stays.flatMap((stay) => [
              stay.reference,
              stay.channel,
              propertiesById.get(stay.property_id)?.name,
            ]),
          ].some((value) =>
            String(value ?? "")
              .toLocaleLowerCase("fr")
              .includes(query),
          );
        return (
          matchesQuery &&
          (!input.loyalty || row.loyalty === input.loyalty) &&
          (input.pets === undefined || row.pets === input.pets) &&
          (input.children === undefined || row.children === input.children) &&
          (!input.locale || row.locale === input.locale) &&
          (!input.country || row.countryCode === input.country) &&
          (!input.property || row.preferredPropertySlug === input.property)
        );
      })
      .sort((a, b) => b.totalSpentCents - a.totalSpentCents);
  }

  async detail(profileId: string) {
    const { profiles, reservationsByProfile, propertiesById } = await this.base();
    const profile = profiles.find((row) => row.id === profileId);
    if (!profile) throw new Error("CRM_PROFILE_NOT_FOUND");
    const stays = (reservationsByProfile.get(profileId) ?? []).sort((a, b) =>
      String(b.arrival).localeCompare(String(a.arrival)),
    );
    const reservationIds = stays.map((row) => row.id);
    const [
      items,
      contracts,
      invoices,
      documentRecords,
      payments,
      pets,
      children,
      activities,
      history,
      emails,
    ] = await Promise.all([
      reservationIds.length
        ? this.db.from("reservation_items").select("*").in("reservation_id", reservationIds)
        : Promise.resolve({ data: [], error: null }),
      reservationIds.length
        ? this.db.from("contracts").select("*").in("reservation_id", reservationIds)
        : Promise.resolve({ data: [], error: null }),
      reservationIds.length
        ? this.db.from("invoices").select("*").in("reservation_id", reservationIds)
        : Promise.resolve({ data: [], error: null }),
      reservationIds.length
        ? this.db
            .from("document_records")
            .select("*")
            .in("reservation_id", reservationIds)
            .is("deleted_at", null)
        : Promise.resolve({ data: [], error: null }),
      reservationIds.length
        ? this.db.from("payments").select("*").in("reservation_id", reservationIds)
        : Promise.resolve({ data: [], error: null }),
      this.db
        .from("traveler_pets")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false }),
      this.db
        .from("traveler_children")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false }),
      this.db
        .from("crm_activities")
        .select("*")
        .eq("profile_id", profileId)
        .order("occurred_at", { ascending: false })
        .limit(200),
      this.db
        .from("crm_change_log")
        .select("*")
        .eq("profile_id", profileId)
        .order("changed_at", { ascending: false })
        .limit(100),
      reservationIds.length
        ? this.db
            .from("transactional_emails")
            .select("*")
            .in("reservation_id", reservationIds)
            .order("created_at", { ascending: false })
            .limit(200)
        : Promise.resolve({ data: [], error: null }),
    ]);
    const failed = [
      items,
      contracts,
      invoices,
      documentRecords,
      payments,
      pets,
      children,
      activities,
      history,
      emails,
    ].find((item) => item.error);
    if (failed?.error) throw new Error(`CRM_DETAIL_FAILED:${failed.error.code}`);
    const itemRows = items.data as Row[];
    const spent = stays.reduce((sum, row) => sum + Number(row.total_cents ?? 0), 0);
    const visits = stays.map((row) => row.arrival).sort();
    const preferred = propertiesById.get(profile.preferred_property_id);
    return {
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.normalized_email,
      phone: profile.phone ?? "",
      locale: profile.locale,
      countryCode: profile.country_code ?? "",
      stays: stays.length,
      totalSpentCents: spent,
      averageSpendCents: stays.length ? Math.round(spent / stays.length) : 0,
      firstVisit: visits[0] ?? null,
      lastVisit: visits.at(-1) ?? null,
      pets: stays.some((row) => row.pets > 0),
      children: stays.some((row) => row.children > 0 || row.babies > 0),
      preferredPropertySlug: preferred?.slug ?? null,
      loyalty: profile.loyalty_override ?? loyalty(stays.length, spent),
      address: {
        line1: profile.address_line1 ?? "",
        line2: profile.address_line2 ?? "",
        postalCode: profile.postal_code ?? "",
        city: profile.city ?? "",
      },
      preferences: {
        floor: profile.floor_preference ?? "",
        room: profile.room_preference ?? "",
        sleeping: profile.sleeping_preferences ?? "",
        arrival: profile.arrival_preferences ?? "",
        allergies: profile.allergies ?? "",
        dietary: profile.dietary_preferences ?? "",
        comments: profile.useful_comments ?? "",
        internalNotes: profile.internal_notes ?? "",
      },
      staysHistory: stays.map((stay) => ({
        ...stay,
        propertyName: propertiesById.get(stay.property_id)?.name ?? "Logement",
        nights: Math.round(
          (Date.parse(`${stay.departure}T12:00:00Z`) - Date.parse(`${stay.arrival}T12:00:00Z`)) /
            86_400_000,
        ),
        items: itemRows.filter((item) => item.reservation_id === stay.id),
      })),
      petsHistory: pets.data ?? [],
      childrenHistory: children.data ?? [],
      activities: [
        ...(activities.data ?? []),
        ...(emails.data ?? []).map((row: Row) => ({
          id: `email-${row.id}`,
          kind: "email",
          direction: "outgoing",
          subject: row.template_key,
          details: `Statut : ${row.status}`,
          occurred_at: row.sent_at ?? row.created_at,
        })),
      ].sort((a: Row, b: Row) => String(b.occurred_at).localeCompare(String(a.occurred_at))),
      documents: (documentRecords.data?.length
        ? documentRecords.data
        : [
            ...(contracts.data ?? []).map((row: Row) => ({ ...row, kind: "contract" })),
            ...(invoices.data ?? []),
          ]
      ).map((row: Row) => ({ ...row, type: row.kind ?? "document" })),
      payments: payments.data ?? [],
      changeLog: history.data ?? [],
    };
  }

  async detailByGuest(guestId: string) {
    const link = await this.db
      .from("guest_profile_links")
      .select("profile_id")
      .eq("guest_id", guestId)
      .maybeSingle();
    if (link.error || !link.data?.profile_id) throw new Error("CRM_PROFILE_NOT_FOUND");
    return this.detail(String(link.data.profile_id));
  }

  async update(profileId: string, values: Row, userId: string) {
    const before = await this.db.from("traveler_profiles").select("*").eq("id", profileId).single();
    if (before.error) throw new Error("CRM_PROFILE_NOT_FOUND");
    const saved = await this.db
      .from("traveler_profiles")
      .update(values)
      .eq("id", profileId)
      .select("*")
      .single();
    if (saved.error) throw new Error(`CRM_UPDATE_FAILED:${saved.error.code}`);
    const audit = await this.db.from("crm_change_log").insert({
      profile_id: profileId,
      entity_type: "profile",
      entity_id: profileId,
      previous_value: before.data,
      new_value: saved.data,
      changed_by: userId,
    });
    if (audit.error) throw new Error(`CRM_AUDIT_FAILED:${audit.error.code}`);
    return saved.data;
  }

  async addActivity(profileId: string, values: Row, userId: string) {
    const saved = await this.db
      .from("crm_activities")
      .insert({ profile_id: profileId, ...values, created_by: userId })
      .select("*")
      .single();
    if (saved.error) throw new Error(`CRM_ACTIVITY_FAILED:${saved.error.code}`);
    await this.db.from("crm_change_log").insert({
      profile_id: profileId,
      entity_type: "activity",
      entity_id: saved.data.id,
      new_value: saved.data,
      changed_by: userId,
    });
    return saved.data;
  }

  async addCompanion(profileId: string, entity: "pet" | "child", values: Row, userId: string) {
    const table = entity === "pet" ? "traveler_pets" : "traveler_children";
    const saved = await this.db
      .from(table)
      .insert({ profile_id: profileId, ...values })
      .select("*")
      .single();
    if (saved.error) throw new Error(`CRM_COMPANION_FAILED:${saved.error.code}`);
    const audit = await this.db.from("crm_change_log").insert({
      profile_id: profileId,
      entity_type: entity,
      entity_id: saved.data.id,
      new_value: saved.data,
      changed_by: userId,
    });
    if (audit.error) throw new Error(`CRM_AUDIT_FAILED:${audit.error.code}`);
    return saved.data;
  }
}
