import "server-only";
import type {
  BackOfficeReservation,
  BackOfficeSnapshot,
  ReservationStatus,
} from "@/platform/admin/contracts";
import type { AdminOperationInput } from "./schemas";
import { getDatabaseClient } from "./client";
import type { Database } from "./database.types";

type Row = Record<string, unknown>;

function dateInParis() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function nights(arrival: string, departure: string) {
  return Math.max(
    0,
    Math.round(
      (Date.parse(`${departure}T12:00:00Z`) - Date.parse(`${arrival}T12:00:00Z`)) / 86_400_000,
    ),
  );
}

function enumerateDays(arrival: string, departure: string, lower: string, upper: string) {
  const result: string[] = [];
  const cursor = new Date(`${arrival}T12:00:00Z`);
  while (cursor.toISOString().slice(0, 10) < departure) {
    const day = cursor.toISOString().slice(0, 10);
    if (day >= lower && day < upper) result.push(day);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}

function countBy(rows: Row[], key: string) {
  return rows.reduce<Record<string, number>>((result, row) => {
    const value = String(row[key] ?? "unknown");
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

export class SupabaseBackOfficeRepository {
  private client = getDatabaseClient();

  async snapshot(): Promise<BackOfficeSnapshot> {
    const today = dateInParis();
    const year = Number(today.slice(0, 4));
    const month = today.slice(0, 7);
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year + 1}-01-01`;
    const [
      propertiesResult,
      reservationsResult,
      linksResult,
      guestsResult,
      optionsResult,
      paymentsResult,
      contractsResult,
      invoicesResult,
      blocksResult,
      sourcesResult,
      syncsResult,
      emailsResult,
      housekeepingResult,
      maintenanceResult,
      conciergeResult,
      conciergeOrdersResult,
      conciergeItemsResult,
      specialRequestsResult,
      depositsResult,
      notificationsResult,
      notesResult,
    ] = await Promise.all([
      this.client.from("properties").select("id,slug,name,status").order("name"),
      this.client
        .from("reservations")
        .select("*")
        .order("arrival", { ascending: false })
        .limit(5000),
      this.client.from("reservation_guests").select("reservation_id,guest_id,is_primary"),
      this.client.from("guests").select("id,first_name,last_name,email,phone").order("last_name"),
      this.client
        .from("reservation_options")
        .select("reservation_id,option_code,label,quantity,total_cents"),
      this.client
        .from("payments")
        .select(
          "id,reservation_id,kind,status,amount_cents,refunded_cents,provider_payment_id,paid_at,created_at",
        )
        .order("created_at", { ascending: false }),
      this.client
        .from("contracts")
        .select("id,reservation_id,number,status,updated_at")
        .order("updated_at", { ascending: false })
        .limit(500),
      this.client
        .from("invoices")
        .select("id,reservation_id,number,status,total_cents,updated_at")
        .order("updated_at", { ascending: false })
        .limit(500),
      this.client
        .from("occupancy_blocks")
        .select("property_id,source,stay_range,created_at")
        .limit(10000),
      this.client
        .from("calendar_sources")
        .select("id,property_id,provider,status,last_synced_at")
        .order("updated_at", { ascending: false }),
      this.client
        .from("sync_runs")
        .select("id,source_id,status,imported_count,error_count,error_details,started_at")
        .order("started_at", { ascending: false })
        .limit(40),
      this.client
        .from("transactional_emails")
        .select("status,last_error,updated_at")
        .order("updated_at", { ascending: false })
        .limit(500),
      this.client
        .from("housekeeping_tasks")
        .select("*")
        .order("scheduled_for", { ascending: true })
        .limit(200),
      this.client
        .from("maintenance_incidents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      this.client
        .from("concierge_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      this.client
        .from("concierge_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      this.client.from("concierge_order_items").select("id,order_id").limit(2000),
      this.client
        .from("concierge_special_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      this.client
        .from("security_deposits")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(200),
      this.client
        .from("back_office_notifications")
        .select("*")
        .is("dismissed_at", null)
        .order("created_at", { ascending: false })
        .limit(100),
      this.client
        .from("reservation_notes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);
    const failed = [
      propertiesResult,
      reservationsResult,
      linksResult,
      guestsResult,
      optionsResult,
      paymentsResult,
      contractsResult,
      invoicesResult,
      blocksResult,
      sourcesResult,
      syncsResult,
      emailsResult,
      housekeepingResult,
      maintenanceResult,
      conciergeResult,
      conciergeOrdersResult,
      conciergeItemsResult,
      specialRequestsResult,
      depositsResult,
      notificationsResult,
      notesResult,
    ].find((result) => result.error);
    if (failed?.error) throw new Error(`BACK_OFFICE_READ_FAILED:${failed.error.code}`);

    const propertyRows = (propertiesResult.data ?? []) as Row[];
    const propertyById = new Map(propertyRows.map((row) => [String(row.id), row]));
    const guestRows = (guestsResult.data ?? []) as Row[];
    const guestById = new Map(guestRows.map((row) => [String(row.id), row]));
    const links = (linksResult.data ?? []) as Row[];
    const optionRows = (optionsResult.data ?? []) as Row[];
    const primaryGuestByReservation = new Map(
      links
        .filter((row) => row.is_primary)
        .map((row) => [String(row.reservation_id), String(row.guest_id)]),
    );
    const reservations = ((reservationsResult.data ?? []) as Row[]).map(
      (row): BackOfficeReservation => {
        const property = propertyById.get(String(row.property_id));
        const guestId = primaryGuestByReservation.get(String(row.id)) ?? null;
        const guest = guestId ? guestById.get(guestId) : undefined;
        return {
          id: String(row.id),
          reference: String(row.reference),
          propertyId: String(row.property_id),
          propertyName: String(property?.name ?? "Logement"),
          propertySlug: String(property?.slug ?? ""),
          status: row.status as ReservationStatus,
          channel: String(row.channel),
          arrival: String(row.arrival),
          departure: String(row.departure),
          adults: Number(row.adults),
          children: Number(row.children),
          babies: Number(row.babies),
          pets: Number(row.pets),
          totalCents: Number(row.total_cents),
          depositDueCents: Number(row.deposit_due_cents),
          balanceDueCents: Number(row.balance_due_cents),
          touristTaxCents: Number(row.tourist_tax_cents),
          options: optionRows
            .filter((option) => String(option.reservation_id) === String(row.id))
            .map((option) => ({
              code: String(option.option_code),
              label: String(option.label),
              quantity: Number(option.quantity),
              totalCents: Number(option.total_cents),
            })),
          guestId,
          guestName: guest ? `${guest.first_name} ${guest.last_name}` : "Voyageur non renseigné",
          guestEmail: String(guest?.email ?? ""),
          guestPhone: String(guest?.phone ?? ""),
          createdAt: String(row.created_at),
        };
      },
    );
    const paymentRows = (paymentsResult.data ?? []) as Row[];
    const paidByReservation = new Map<string, number>();
    for (const payment of paymentRows.filter((row) =>
      ["paid", "authorized"].includes(String(row.status)),
    )) {
      const id = String(payment.reservation_id);
      paidByReservation.set(id, (paidByReservation.get(id) ?? 0) + Number(payment.amount_cents));
    }
    const contractRows = (contractsResult.data ?? []) as Row[];
    const contractByReservation = new Map(
      contractRows.map((row) => [String(row.reservation_id), row]),
    );
    const active = reservations.filter(
      (reservation) => !["cancelled", "declined"].includes(reservation.status),
    );
    const confirmed = active.filter((reservation) =>
      ["confirmed", "completed"].includes(reservation.status),
    );
    const confirmedThisYear = confirmed.filter(
      (reservation) => reservation.arrival >= yearStart && reservation.arrival < yearEnd,
    );
    const revenueFor = (prefix: string) =>
      confirmedThisYear
        .filter((reservation) => reservation.arrival.startsWith(prefix))
        .reduce((sum, reservation) => sum + reservation.totalCents, 0);
    const reservationById = new Map(
      reservations.map((reservation) => [reservation.id, reservation]),
    );
    const sevenDays = new Date(`${today}T12:00:00Z`);
    sevenDays.setUTCDate(sevenDays.getUTCDate() + 7);
    const sevenDaysEnd = sevenDays.toISOString().slice(0, 10);
    const currentMonthEnd = new Date(`${month}-01T12:00:00Z`);
    currentMonthEnd.setUTCMonth(currentMonthEnd.getUTCMonth() + 1);
    const guestSummaries = guestRows
      .map((guest) => {
        const guestReservations = links
          .filter((link) => String(link.guest_id) === String(guest.id))
          .map((link) => reservationById.get(String(link.reservation_id)))
          .filter((item): item is BackOfficeReservation => Boolean(item));
        return {
          id: String(guest.id),
          name: `${guest.first_name} ${guest.last_name}`,
          email: String(guest.email),
          phone: String(guest.phone ?? ""),
          stays: guestReservations.length,
          nights: guestReservations.reduce(
            (sum, reservation) => sum + nights(reservation.arrival, reservation.departure),
            0,
          ),
          pets: guestReservations.reduce((sum, reservation) => sum + reservation.pets, 0),
          lastStay:
            guestReservations
              .map((reservation) => reservation.departure)
              .sort()
              .at(-1) ?? null,
        };
      })
      .filter((guest) => guest.stays > 0);
    const blockRows = (blocksResult.data ?? []) as Row[];
    const propertyStats = propertyRows.map((property) => {
      const propertyReservations = confirmedThisYear.filter(
        (reservation) => reservation.propertyId === String(property.id),
      );
      const directDays = new Set(
        propertyReservations.flatMap((reservation) =>
          enumerateDays(reservation.arrival, reservation.departure, yearStart, yearEnd),
        ),
      );
      const platformDays = new Set(
        blockRows
          .filter(
            (block) =>
              String(block.property_id) === String(property.id) &&
              String(block.source) !== "reservation",
          )
          .flatMap((block) => {
            const match = String(block.stay_range).match(
              /\[(\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})\)/,
            );
            return match ? enumerateDays(match[1], match[2], yearStart, yearEnd) : [];
          }),
      );
      const allOccupiedDays = new Set([...directDays, ...platformDays]);
      const directNights = directDays.size;
      const platformNights = platformDays.size;
      const occupiedNights = allOccupiedDays.size;
      return {
        id: String(property.id),
        slug: String(property.slug),
        name: String(property.name),
        status: String(property.status),
        occupancyRate: Math.round((occupiedNights / 365) * 10_000) / 100,
        occupiedNights,
        directNights,
        platformNights,
        revenueCents: propertyReservations.reduce(
          (sum, reservation) => sum + reservation.totalCents,
          0,
        ),
      };
    });
    const sourceRows = (sourcesResult.data ?? []) as Row[];
    const sourceById = new Map(sourceRows.map((row) => [String(row.id), row]));
    const recentErrors = [
      ...((syncsResult.data ?? []) as Row[])
        .filter((row) => Number(row.error_count) > 0 || row.status === "failed")
        .map((row) => ({
          id: `sync-${row.id}`,
          area: "Calendrier",
          message: `${row.error_count} erreur(s) pendant la synchronisation`,
          occurredAt: String(row.started_at),
        })),
      ...((emailsResult.data ?? []) as Row[])
        .filter((row) => ["failed", "bounced"].includes(String(row.status)))
        .map((row, index) => ({
          id: `email-${index}-${row.updated_at}`,
          area: "E-mail",
          message: String(row.last_error ?? `Statut ${row.status}`),
          occurredAt: String(row.updated_at),
        })),
      ...paymentRows
        .filter((row) => ["failed", "cancelled"].includes(String(row.status)))
        .map((row) => ({
          id: `payment-${row.reservation_id}-${row.created_at}`,
          area: "Paiement",
          message: `Paiement ${row.status}`,
          occurredAt: String(row.created_at),
        })),
    ]
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, 20);
    return {
      generatedAt: new Date().toISOString(),
      today,
      metrics: {
        revenueTodayCents: revenueFor(today),
        revenueMonthCents: revenueFor(month),
        revenueYearCents: revenueFor(String(year)),
        pendingPaymentsCents: active.reduce(
          (sum, reservation) =>
            sum +
            Math.max(0, reservation.totalCents - (paidByReservation.get(reservation.id) ?? 0)),
          0,
        ),
        averageStayNights: confirmedThisYear.length
          ? Math.round(
              (confirmedThisYear.reduce(
                (sum, reservation) => sum + nights(reservation.arrival, reservation.departure),
                0,
              ) /
                confirmedThisYear.length) *
                10,
            ) / 10
          : 0,
        directShare: confirmedThisYear.length
          ? Math.round(
              (confirmedThisYear.filter((reservation) => reservation.channel === "direct").length /
                confirmedThisYear.length) *
                10_000,
            ) / 100
          : 0,
      },
      operational: {
        arrivals: active.filter((reservation) => reservation.arrival === today),
        departures: active.filter((reservation) => reservation.departure === today),
        inHouse: active.filter(
          (reservation) => reservation.arrival <= today && reservation.departure > today,
        ),
        requests: active.filter((reservation) =>
          ["draft", "requested"].includes(reservation.status),
        ),
        pendingPayments: active.filter(
          (reservation) => (paidByReservation.get(reservation.id) ?? 0) < reservation.totalCents,
        ),
        unsignedContracts: active.filter(
          (reservation) => contractByReservation.get(reservation.id)?.status !== "signed",
        ),
        upcoming7Days: active.filter(
          (reservation) => reservation.arrival >= today && reservation.arrival < sevenDaysEnd,
        ),
      },
      reservations: reservations.sort((a, b) => b.arrival.localeCompare(a.arrival)),
      guests: guestSummaries.sort((a, b) => b.stays - a.stays),
      properties: propertyStats,
      documents: {
        contracts: contractRows.map((row) => ({
          id: String(row.id),
          number: String(row.number),
          status: String(row.status),
          reservationReference: reservationById.get(String(row.reservation_id))?.reference ?? "—",
          updatedAt: String(row.updated_at),
        })),
        invoices: ((invoicesResult.data ?? []) as Row[]).map((row) => ({
          id: String(row.id),
          number: String(row.number),
          status: String(row.status),
          reservationReference: reservationById.get(String(row.reservation_id))?.reference ?? "—",
          totalCents: Number(row.total_cents),
          updatedAt: String(row.updated_at),
        })),
      },
      operations: {
        housekeeping: ((housekeepingResult.data ?? []) as Row[]).map((row) => ({
          id: String(row.id),
          propertyId: String(row.property_id),
          propertyName: String(propertyById.get(String(row.property_id))?.name ?? "Logement"),
          reservationReference: reservationById.get(String(row.reservation_id))?.reference ?? null,
          scheduledFor: String(row.scheduled_for),
          assignee: String(row.assignee ?? ""),
          status: String(row.status),
          checklist: Array.isArray(row.checklist)
            ? (row.checklist as { id: string; label: string; done: boolean }[])
            : [],
          notes: String(row.notes ?? ""),
        })),
        maintenance: ((maintenanceResult.data ?? []) as Row[]).map((row) => ({
          id: String(row.id),
          propertyId: String(row.property_id),
          propertyName: String(propertyById.get(String(row.property_id))?.name ?? "Logement"),
          reservationReference: reservationById.get(String(row.reservation_id))?.reference ?? null,
          title: String(row.title),
          description: String(row.description ?? ""),
          priority: String(row.priority),
          status: String(row.status),
          assignee: String(row.assignee ?? ""),
          costCents: Number(row.cost_cents),
          dueAt: row.due_at ? String(row.due_at) : null,
          createdAt: String(row.created_at),
        })),
        concierge: ((conciergeResult.data ?? []) as Row[]).map((row) => {
          const reservation = reservationById.get(String(row.reservation_id));
          return {
            id: String(row.id),
            reservationId: String(row.reservation_id),
            reservationReference: reservation?.reference ?? "—",
            guestName: reservation?.guestName ?? "Voyageur",
            kind: String(row.kind),
            title: String(row.title),
            details: String(row.details ?? ""),
            status: String(row.status),
            scheduledFor: row.scheduled_for ? String(row.scheduled_for) : null,
            isSurprise: Boolean(row.is_surprise),
          };
        }),
        conciergeOrders: ((conciergeOrdersResult.data ?? []) as Row[]).map((row) => {
          const reservation = reservationById.get(String(row.reservation_id));
          return {
            id: String(row.id),
            reservationReference: reservation?.reference ?? "—",
            guestName: reservation?.guestName ?? "Voyageur",
            status: String(row.status),
            locale: String(row.locale),
            totalCents: Number(row.total_cents),
            itemCount: ((conciergeItemsResult.data ?? []) as Row[]).filter(
              (item) => String(item.order_id) === String(row.id),
            ).length,
            createdAt: String(row.created_at),
          };
        }),
        specialRequests: ((specialRequestsResult.data ?? []) as Row[]).map((row) => {
          const reservation = reservationById.get(String(row.reservation_id));
          return {
            id: String(row.id),
            reservationReference: reservation?.reference ?? "—",
            guestName: reservation?.guestName ?? "Voyageur",
            occasion: String(row.occasion),
            details: String(row.details),
            allergies: String(row.allergies ?? ""),
            dietaryRequirements: String(row.dietary_requirements ?? ""),
            status: String(row.status),
            createdAt: String(row.created_at),
          };
        }),
        deposits: ((depositsResult.data ?? []) as Row[]).map((row) => {
          const reservation = reservationById.get(String(row.reservation_id));
          return {
            id: String(row.id),
            reservationReference: reservation?.reference ?? "—",
            guestName: reservation?.guestName ?? "Voyageur",
            amountCents: Number(row.amount_cents),
            status: String(row.status),
            provider: String(row.provider ?? "—"),
            updatedAt: String(row.updated_at),
          };
        }),
        notifications: ((notificationsResult.data ?? []) as Row[]).map((row) => ({
          id: String(row.id),
          kind: String(row.kind),
          title: String(row.title),
          body: String(row.body ?? ""),
          priority: String(row.priority),
          entityType: row.entity_type ? String(row.entity_type) : null,
          entityId: row.entity_id ? String(row.entity_id) : null,
          readAt: row.read_at ? String(row.read_at) : null,
          createdAt: String(row.created_at),
        })),
        notes: ((notesResult.data ?? []) as Row[]).map((row) => ({
          id: String(row.id),
          reservationId: String(row.reservation_id),
          category: String(row.category),
          content: String(row.content),
          pinned: Boolean(row.pinned),
          createdAt: String(row.created_at),
        })),
      },
      pilotage: {
        calendarSources: sourceRows.map((row) => ({
          id: String(row.id),
          property: String(propertyById.get(String(row.property_id))?.name ?? "Logement"),
          provider: String(row.provider),
          status: String(row.status),
          lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : null,
        })),
        recentSyncs: ((syncsResult.data ?? []) as Row[]).map((row) => {
          const source = sourceById.get(String(row.source_id));
          return {
            id: String(row.id),
            provider: String(source?.provider ?? "inconnu"),
            property: String(propertyById.get(String(source?.property_id))?.name ?? "Logement"),
            status: String(row.status),
            importedCount: Number(row.imported_count),
            errorCount: Number(row.error_count),
            startedAt: String(row.started_at),
          };
        }),
        emailStatus: countBy((emailsResult.data ?? []) as Row[], "status"),
        paymentStatus: countBy(paymentRows, "status"),
        recentPayments: paymentRows.slice(0, 30).map((row) => {
          const reservation = reservationById.get(String(row.reservation_id));
          return {
            id: String(row.id),
            reservationReference: reservation?.reference ?? "—",
            guestName: reservation?.guestName ?? "Voyageur",
            kind: String(row.kind),
            status: String(row.status),
            amountCents: Number(row.amount_cents),
            refundedCents: Number(row.refunded_cents),
            createdAt: String(row.created_at),
            refundable:
              Boolean(row.provider_payment_id) &&
              ["paid", "partially_refunded"].includes(String(row.status)) &&
              Number(row.refunded_cents) < Number(row.amount_cents),
          };
        }),
        recentErrors,
      },
    };
  }

  async execute(input: AdminOperationInput) {
    if (input.action === "create_reservation") {
      const deposit = Math.round(input.totalCents * 0.3);
      const quote = {
        adults: input.adults,
        children: input.children,
        babies: input.babies,
        pets: input.pets,
        nightsTotalCents: input.totalCents,
        optionsTotalCents: 0,
        cleaningFeeCents: 0,
        touristTaxCents: 0,
        discountCents: 0,
        totalCents: input.totalCents,
        depositDueCents: deposit,
        balanceDueCents: input.totalCents - deposit,
        source: "back_office",
        propertySlug: input.propertySlug,
      };
      const { data: reservation, error } = await this.client.rpc("create_direct_reservation", {
        property_slug: input.propertySlug,
        arrival_date: input.arrival,
        departure_date: input.departure,
        guest: input.guest,
        quote,
        selected_options: [],
        request_key: crypto.randomUUID(),
      });
      if (error) {
        if (error.code === "23P01") throw new Error("DATES_UNAVAILABLE");
        throw new Error(`RESERVATION_WRITE_FAILED:${error.code}`);
      }
      const { data: updated, error: updateError } = await this.client
        .from("reservations")
        .update({
          status: input.status,
          channel: input.channel,
          expires_at: null,
          confirmed_at: input.status === "confirmed" ? new Date().toISOString() : null,
        })
        .eq("id", reservation.id)
        .select("id,reference")
        .single();
      if (updateError) throw new Error(`RESERVATION_UPDATE_FAILED:${updateError.code}`);
      return updated;
    }
    if (input.action === "block_dates") {
      const property = await this.property(input.propertySlug);
      const { data, error } = await this.client
        .from("occupancy_blocks")
        .insert({
          property_id: property.id,
          stay_range: `[${input.arrival},${input.departure})`,
          source: "manual",
          note: input.note,
        })
        .select("id")
        .single();
      if (error) throw new Error(`BLOCK_WRITE_FAILED:${error.code}`);
      return { id: data.id };
    }
    if (input.action === "unblock_dates") {
      const { data, error } = await this.client
        .from("occupancy_blocks")
        .delete()
        .eq("id", input.blockId)
        .eq("source", "manual")
        .select("id")
        .single();
      if (error) throw new Error(`UNBLOCK_WRITE_FAILED:${error.code}`);
      return { id: data.id };
    }
    if (input.action === "update_housekeeping") {
      const completed = ["completed", "verified"].includes(input.status);
      const { data, error } = await this.client
        .from("housekeeping_tasks")
        .update({
          status: input.status,
          checklist: input.checklist,
          completed_at: completed ? new Date().toISOString() : null,
          verified_at: input.status === "verified" ? new Date().toISOString() : null,
        })
        .eq("id", input.taskId)
        .select("id")
        .single();
      if (error) throw new Error(`HOUSEKEEPING_UPDATE_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "create_maintenance") {
      const { data, error } = await this.client
        .from("maintenance_incidents")
        .insert({
          property_id: input.propertyId,
          reservation_id: input.reservationId ?? null,
          title: input.title,
          description: input.description ?? null,
          priority: input.priority,
          assignee: input.assignee ?? null,
        })
        .select("id")
        .single();
      if (error) throw new Error(`MAINTENANCE_WRITE_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "update_maintenance") {
      const { data, error } = await this.client
        .from("maintenance_incidents")
        .update({
          status: input.status,
          resolved_at: ["resolved", "closed"].includes(input.status)
            ? new Date().toISOString()
            : null,
        })
        .eq("id", input.incidentId)
        .select("id")
        .single();
      if (error) throw new Error(`MAINTENANCE_UPDATE_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "create_concierge") {
      const { data, error } = await this.client
        .from("concierge_requests")
        .insert({
          reservation_id: input.reservationId,
          kind: input.kind,
          title: input.title,
          details: input.details ?? null,
          scheduled_for: input.scheduledFor ?? null,
          is_surprise: input.isSurprise,
        })
        .select("id")
        .single();
      if (error) throw new Error(`CONCIERGE_WRITE_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "update_notification") {
      const { data, error } = await this.client
        .from("back_office_notifications")
        .update({
          read_at: input.read ? new Date().toISOString() : null,
        })
        .eq("id", input.notificationId)
        .select("id")
        .single();
      if (error) throw new Error(`NOTIFICATION_UPDATE_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "create_reservation_note") {
      const { data, error } = await this.client
        .from("reservation_notes")
        .insert({
          reservation_id: input.reservationId,
          category: input.category,
          content: input.content,
          pinned: input.pinned,
        })
        .select("id")
        .single();
      if (error) throw new Error(`RESERVATION_NOTE_WRITE_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "update_concierge_order") {
      const { data, error } = await this.client
        .from("concierge_orders")
        .update({ status: input.status })
        .eq("id", input.orderId)
        .select("id")
        .single();
      if (error) throw new Error(`CONCIERGE_ORDER_UPDATE_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "update_special_request") {
      const { data, error } = await this.client
        .from("concierge_special_requests")
        .update({ status: input.status })
        .eq("id", input.requestId)
        .select("id")
        .single();
      if (error) throw new Error(`CONCIERGE_REQUEST_UPDATE_FAILED:${error.code}`);
      return data;
    }
    const patch: Database["public"]["Tables"]["reservations"]["Update"] = { status: input.status };
    if (input.arrival) patch.arrival = input.arrival;
    if (input.departure) patch.departure = input.departure;
    if (input.status === "cancelled") {
      patch.cancelled_at = new Date().toISOString();
      patch.cancellation_reason = input.cancellationReason ?? "Annulation depuis le Back Office";
    }
    const { data, error } = await this.client
      .from("reservations")
      .update(patch)
      .eq("id", input.reservationId)
      .select("id,reference")
      .single();
    if (error) {
      if (error.code === "23P01") throw new Error("DATES_UNAVAILABLE");
      throw new Error(`RESERVATION_UPDATE_FAILED:${error.code}`);
    }
    if (input.status === "cancelled") {
      const { error: occupancyError } = await this.client
        .from("occupancy_blocks")
        .delete()
        .eq("reservation_id", input.reservationId);
      if (occupancyError)
        throw new Error(`RESERVATION_OCCUPANCY_RELEASE_FAILED:${occupancyError.code}`);
    }
    return data;
  }

  private async property(slug: string) {
    const { data, error } = await this.client
      .from("properties")
      .select("id")
      .eq("slug", slug)
      .single();
    if (error) throw new Error(`PROPERTY_NOT_FOUND:${error.code}`);
    return data;
  }
}
