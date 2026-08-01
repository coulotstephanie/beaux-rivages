import "server-only";
import { getDatabaseClient } from "./client";
import type { Json } from "./database.types";

export class SupabasePaymentRepository {
  async findByProviderId(providerPaymentId: string) {
    const { data, error } = await getDatabaseClient()
      .from("payments")
      .select("*")
      .eq("provider", "stripe")
      .eq("provider_payment_id", providerPaymentId)
      .maybeSingle();
    if (error) throw new Error(`PAYMENT_READ_FAILED:${error.code}`);
    return data;
  }
}

export class SupabaseContractRepository {
  async listForReservation(reservationId: string) {
    const { data, error } = await getDatabaseClient()
      .from("contracts")
      .select("*")
      .eq("reservation_id", reservationId)
      .order("version", { ascending: false });
    if (error) throw new Error(`CONTRACT_LIST_FAILED:${error.code}`);
    return data;
  }
}

export class SupabaseAuditRepository {
  async record(input: {
    action: string;
    entityType: string;
    entityId?: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const { error } = await getDatabaseClient()
      .from("audit_logs")
      .insert({
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId,
        request_id: input.requestId,
        metadata: (input.metadata ?? {}) as Json,
      });
    if (error) throw new Error(`AUDIT_WRITE_FAILED:${error.code}`);
  }
}

export class SupabaseAdminRepository {
  async getYearSummary(year: number) {
    const from = `${year}-01-01`;
    const to = `${year + 1}-01-01`;
    const { data, error } = await getDatabaseClient()
      .from("reservations")
      .select("status,channel,total_cents,arrival,departure")
      .gte("arrival", from)
      .lt("arrival", to);
    if (error) throw new Error(`ADMIN_SUMMARY_FAILED:${error.code}`);
    const reservations = data ?? [];
    return {
      directReservations: reservations.filter((reservation) => reservation.channel === "direct")
        .length,
      confirmedRevenueCents: reservations
        .filter((reservation) => ["confirmed", "completed"].includes(reservation.status))
        .reduce((total, reservation) => total + reservation.total_cents, 0),
      requests: reservations.filter((reservation) => reservation.status === "requested").length,
    };
  }

  async exportRows(entity: "reservations" | "payments" | "audit_logs" | "tourist_tax") {
    const client = getDatabaseClient();
    if (entity === "tourist_tax") {
      const { data, error } = await client
        .from("reservations")
        .select(
          "reference,arrival,departure,adults,children,babies,tourist_tax_cents,quote_snapshot,properties(name,slug)",
        )
        .in("status", ["confirmed", "completed"])
        .order("arrival", { ascending: false })
        .limit(10_000);
      if (error) throw new Error(`ADMIN_EXPORT_FAILED:${error.code}`);
      return (data ?? []).map((row) => {
        const snapshot =
          row.quote_snapshot &&
          typeof row.quote_snapshot === "object" &&
          !Array.isArray(row.quote_snapshot)
            ? (row.quote_snapshot as Record<string, Json | undefined>)
            : {};
        const details =
          snapshot.touristTaxDetails &&
          typeof snapshot.touristTaxDetails === "object" &&
          !Array.isArray(snapshot.touristTaxDetails)
            ? (snapshot.touristTaxDetails as Record<string, Json | undefined>)
            : {};
        return {
          reference: row.reference,
          logement: row.properties?.name ?? "",
          arrivee: row.arrival,
          depart: row.departure,
          adultes_assujettis: details.liableGuests ?? row.adults,
          personnes_exonerees: details.exemptGuests ?? row.children + row.babies,
          methode: details.method ?? "",
          taux: details.baseRate ?? "",
          taxe_additionnelle: details.additionalRate ?? "",
          montant_collecte_eur: row.tourist_tax_cents / 100,
        };
      });
    }
    const result =
      entity === "reservations"
        ? await client
            .from("reservations")
            .select(
              "reference,status,channel,arrival,departure,adults,children,pets,total_cents,created_at",
            )
            .order("created_at", { ascending: false })
            .limit(10_000)
        : entity === "payments"
          ? await client
              .from("payments")
              .select(
                "reservation_id,provider,kind,status,amount_cents,refunded_cents,paid_at,created_at",
              )
              .order("created_at", { ascending: false })
              .limit(10_000)
          : await client
              .from("audit_logs")
              .select("occurred_at,actor_id,actor_role,action,entity_type,entity_id,request_id")
              .order("occurred_at", { ascending: false })
              .limit(10_000);
    const { data, error } = result;
    if (error) throw new Error(`ADMIN_EXPORT_FAILED:${error.code}`);
    return (data ?? []) as unknown as Record<string, unknown>[];
  }
}
