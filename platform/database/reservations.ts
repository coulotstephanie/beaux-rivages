import "server-only";
import type { Reservation, ReservationRepository } from "@/platform/reservations/contracts";
import { getDatabaseClient } from "./client";
import type { Json } from "./database.types";
import { createReservationSchema, type CreateReservationInput } from "./schemas";

type ReservationRow = {
  id: string;
  reference: string;
  status: Reservation["status"] | "pending_payment" | "declined";
  property_id: string;
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  babies: number;
  pets: number;
  quote_snapshot: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

function mapReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    reference: row.reference,
    travelerId: "",
    selection: {
      propertySlug: String(row.quote_snapshot.propertySlug ?? ""),
      arrival: row.arrival,
      departure: row.departure,
      guests: { adults: row.adults, children: row.children, babies: row.babies, pets: row.pets },
      options: [],
      experiences: [],
      attention: null,
      attentionMessage: "",
    },
    status: row.status === "pending_payment" || row.status === "declined" ? "requested" : row.status,
    paymentStatus: "pending",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseReservationRepository implements ReservationRepository {
  async create(untrustedInput: CreateReservationInput) {
    const input = createReservationSchema.parse(untrustedInput);
    const { data, error } = await getDatabaseClient().rpc("create_direct_reservation", {
      property_slug: input.propertySlug,
      arrival_date: input.arrival,
      departure_date: input.departure,
      guest: input.guest,
      quote: { ...input.quote, propertySlug: input.propertySlug } as Json,
      selected_options: input.options as Json,
      request_key: input.idempotencyKey,
    });
    if (error) {
      if (error.code === "23P01") throw new ReservationConflictError();
      throw new Error(`RESERVATION_CREATE_FAILED:${error.code}`);
    }
    return mapReservation(data as ReservationRow);
  }

  async getById(id: string) {
    const { data, error } = await getDatabaseClient()
      .from("reservations")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`RESERVATION_READ_FAILED:${error.code}`);
    return data ? mapReservation(data as ReservationRow) : null;
  }

  async listForTraveler(travelerId: string) {
    const { data, error } = await getDatabaseClient()
      .from("reservations")
      .select("*, reservation_guests!inner(guest_id)")
      .eq("reservation_guests.guest_id", travelerId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`RESERVATION_LIST_FAILED:${error.code}`);
    return (data as unknown as ReservationRow[]).map(mapReservation);
  }

  async save(_reservation: Reservation): Promise<Reservation> {
    void _reservation;
    throw new Error("Use an explicit reservation command instead of generic save().");
  }
}

export class ReservationConflictError extends Error {
  constructor() {
    super("DATES_UNAVAILABLE");
    this.name = "ReservationConflictError";
  }
}
