import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import type { HousekeepingSnapshot } from "./contracts";
import type { HousekeepingAction } from "./schemas";
type Row = Record<string, unknown>;
type QueryClient = {
  // Tables are introduced by the accompanying migration and generated types are refreshed after application.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from(table: string): any;
};

export class HousekeepingRepository {
  private client = getDatabaseClient() as unknown as QueryClient;

  async snapshot(): Promise<HousekeepingSnapshot> {
    const today = new Date().toISOString().slice(0, 10);
    const results = await Promise.all([
      this.client.from("housekeeping_tasks").select("*").order("scheduled_for").limit(2000),
      this.client
        .from("housekeeping_inspections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300),
      this.client.from("inventory_items").select("*").order("room").limit(1000),
      this.client.from("stock_items").select("*").order("name").limit(1000),
      this.client
        .from("maintenance_incidents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      this.client.from("maintenance_interventions").select("*").order("planned_for").limit(500),
      this.client
        .from("operational_photos")
        .select("*")
        .order("taken_at", { ascending: false })
        .limit(500),
      this.client.from("properties").select("id,slug,name"),
      this.client.from("reservations").select("id,reference,arrival,departure,status").limit(5000),
      this.client
        .from("reservation_guests")
        .select("reservation_id,guest_id,is_primary")
        .eq("is_primary", true),
      this.client
        .from("linen_rotations")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(500),
      this.client.from("housekeeping_templates").select("*").order("name").limit(200),
      this.client.from("incident_categories").select("*").order("name"),
      this.client
        .from("operational_audit_log")
        .select("id,entity_type,action,comment,created_at")
        .order("created_at", { ascending: false })
        .limit(300),
    ]);
    const failed = results.find((result) => result.error);
    if (failed?.error) throw new Error(`HOUSEKEEPING_READ_FAILED:${failed.error.code}`);
    const [
      tasks,
      inspections,
      inventory,
      stock,
      maintenance,
      interventions,
      photos,
      properties,
      reservations,
      links,
      linen,
      templates,
      categories,
      audit,
    ] = results.map((result) => (result.data ?? []) as Row[]);
    const propertyById = new Map(properties.map((row) => [String(row.id), row]));
    const reservationById = new Map(reservations.map((row) => [String(row.id), row]));
    const guestByReservation = new Map(
      links.map((row) => [String(row.reservation_id), String(row.guest_id)]),
    );
    const incidentById = new Map(maintenance.map((row) => [String(row.id), row]));
    const completedDurations = tasks
      .filter((row) => row.started_at && row.completed_at)
      .map(
        (row) =>
          (Date.parse(String(row.completed_at)) - Date.parse(String(row.started_at))) / 60_000,
      );
    const recommendations = stock
      .filter((row) => Number(row.quantity) <= Number(row.alert_threshold))
      .map(
        (row) =>
          `Commander ${Math.max(0, Number(row.target_quantity) - Number(row.quantity))} ${row.unit} de ${row.name} pour ${propertyById.get(String(row.property_id))?.name ?? "le stock central"}`,
      );
    const propertyName = (id: unknown) => String(propertyById.get(String(id))?.name ?? "Maison");
    return {
      generatedAt: new Date().toISOString(),
      today,
      metrics: {
        arrivals: reservations.filter(
          (row) => row.arrival === today && !["cancelled", "declined"].includes(String(row.status)),
        ).length,
        departures: reservations.filter(
          (row) =>
            row.departure === today && !["cancelled", "declined"].includes(String(row.status)),
        ).length,
        ready: tasks.filter((row) => row.operational_status === "ready").length,
        preparing: tasks.filter((row) => row.operational_status === "to_prepare").length,
        cleaning: tasks.filter((row) => row.operational_status === "cleaning").length,
        blocked: tasks.filter((row) => row.operational_status === "blocked").length,
        urgent: maintenance.filter(
          (row) =>
            row.priority === "urgent" && !["resolved", "closed"].includes(String(row.status)),
        ).length,
        lowStock: recommendations.length,
        averageCleaningMinutes: completedDurations.length
          ? Math.round(
              completedDurations.reduce((sum, duration) => sum + duration, 0) /
                completedDurations.length,
            )
          : 0,
        averageInspectionMinutes: 0,
        maintenanceCostCents: maintenance.reduce((sum, row) => sum + Number(row.cost_cents), 0),
      },
      properties: properties.map((row) => ({
        id: String(row.id),
        slug: String(row.slug),
        name: String(row.name),
      })),
      tasks: tasks.map((row) => {
        const reservation = row.reservation_id
          ? reservationById.get(String(row.reservation_id))
          : undefined;
        return {
          id: String(row.id),
          propertyId: String(row.property_id),
          propertyName: propertyName(row.property_id),
          reservationId: row.reservation_id ? String(row.reservation_id) : null,
          guestId: row.reservation_id
            ? (guestByReservation.get(String(row.reservation_id)) ?? null)
            : null,
          reservationReference: String(reservation?.reference ?? "—"),
          arrival: reservation?.arrival ? String(reservation.arrival) : null,
          departure: reservation?.departure ? String(reservation.departure) : null,
          scheduledFor: String(row.scheduled_for),
          assignee: String(row.assignee ?? ""),
          status: String(row.status),
          operationalStatus: String(row.operational_status),
          checklist: Array.isArray(row.checklist)
            ? (row.checklist as HousekeepingSnapshot["tasks"][number]["checklist"])
            : [],
          notes: String(row.notes ?? ""),
          startedAt: row.started_at ? String(row.started_at) : null,
          completedAt: row.completed_at ? String(row.completed_at) : null,
          offlineRevision: Number(row.offline_revision),
        };
      }),
      inspections: inspections.map((row) => {
        const task = tasks.find((entry) => String(entry.id) === String(row.task_id));
        return {
          id: String(row.id),
          taskId: String(row.task_id),
          propertyName: propertyName(task?.property_id),
          inspector: String(row.inspector),
          rating: row.rating ? Number(row.rating) : null,
          remarks: String(row.remarks ?? ""),
          status: String(row.status),
          inspectedAt: row.inspected_at ? String(row.inspected_at) : null,
          createdAt: String(row.created_at),
        };
      }),
      inventory: inventory.map((row) => ({
        id: String(row.id),
        propertyId: String(row.property_id),
        propertyName: propertyName(row.property_id),
        room: String(row.room),
        category: String(row.category),
        name: String(row.name),
        quantity: Number(row.quantity),
        valueCents: Number(row.unit_value_cents),
        condition: String(row.condition),
        purchasedOn: row.purchased_on ? String(row.purchased_on) : null,
        warrantyUntil: row.warranty_until ? String(row.warranty_until) : null,
      })),
      stock: stock.map((row) => ({
        id: String(row.id),
        propertyId: row.property_id ? String(row.property_id) : null,
        propertyName: row.property_id ? propertyName(row.property_id) : "Stock central",
        category: String(row.category),
        name: String(row.name),
        quantity: Number(row.quantity),
        threshold: Number(row.alert_threshold),
        target: Number(row.target_quantity),
        unit: String(row.unit),
        low: Number(row.quantity) <= Number(row.alert_threshold),
        lastRestockedAt: row.last_restocked_at ? String(row.last_restocked_at) : null,
      })),
      maintenance: maintenance.map((row) => ({
        id: String(row.id),
        propertyId: String(row.property_id),
        propertyName: propertyName(row.property_id),
        reservationId: row.reservation_id ? String(row.reservation_id) : null,
        guestId: row.reservation_id
          ? (guestByReservation.get(String(row.reservation_id)) ?? null)
          : null,
        title: String(row.title),
        description: String(row.description ?? ""),
        priority: String(row.priority),
        status: String(row.status),
        assignee: String(row.assignee ?? ""),
        costCents: Number(row.cost_cents),
        dueAt: row.due_at ? String(row.due_at) : null,
        createdAt: String(row.created_at),
      })),
      interventions: interventions.map((row) => {
        const incident = incidentById.get(String(row.incident_id));
        return {
          id: String(row.id),
          incidentId: String(row.incident_id),
          incidentTitle: String(incident?.title ?? "Intervention"),
          propertyName: propertyName(incident?.property_id),
          assignee: String(row.assignee ?? ""),
          provider: String(row.provider ?? ""),
          status: String(row.status),
          plannedFor: row.planned_for ? String(row.planned_for) : null,
          completedAt: row.completed_at ? String(row.completed_at) : null,
          costCents: Number(row.cost_cents),
          notes: String(row.notes ?? ""),
        };
      }),
      photos: photos.map((row) => ({
        id: String(row.id),
        propertyName: propertyName(row.property_id),
        kind: String(row.kind),
        storagePath: String(row.storage_path),
        caption: String(row.caption ?? ""),
        takenAt: String(row.taken_at),
      })),
      linen: linen.map((row) => ({
        id: String(row.id),
        propertyName: propertyName(row.property_id),
        reservationReference: String(
          reservationById.get(String(row.reservation_id))?.reference ?? "—",
        ),
        item: String(row.item),
        quantity: Number(row.quantity),
        direction: String(row.direction),
        notes: String(row.notes ?? ""),
        recordedAt: String(row.recorded_at),
      })),
      templates: templates.map((row) => ({
        id: String(row.id),
        propertyId: row.property_id ? String(row.property_id) : null,
        propertyName: row.property_id ? propertyName(row.property_id) : "Toutes les maisons",
        name: String(row.name),
        taskType: String(row.task_type),
        checklist: Array.isArray(row.checklist)
          ? (row.checklist as HousekeepingSnapshot["templates"][number]["checklist"])
          : [],
        active: Boolean(row.active),
      })),
      categories: categories.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        defaultPriority: String(row.default_priority),
        active: Boolean(row.active),
      })),
      audit: audit.map((row) => ({
        id: String(row.id),
        entityType: String(row.entity_type),
        action: String(row.action),
        comment: String(row.comment ?? ""),
        createdAt: String(row.created_at),
      })),
      recommendations,
    };
  }

  async execute(input: HousekeepingAction, actorId: string) {
    let result: Row | null = null;
    if (input.action === "update_task") {
      if (input.operationalStatus === "ready") throw new Error("QUALITY_CONTROL_REQUIRED");
      const saved = await this.client
        .from("housekeeping_tasks")
        .update({
          operational_status: input.operationalStatus,
          status: "in_progress",
          checklist: input.checklist,
          started_at: input.operationalStatus === "cleaning" ? new Date().toISOString() : undefined,
          completed_at: null,
          verified_at: null,
          offline_revision: input.offlineRevision + 1,
        })
        .eq("id", input.taskId)
        .eq("offline_revision", input.offlineRevision)
        .select("*")
        .single();
      if (saved.error)
        throw new Error(
          saved.error.code === "PGRST116"
            ? "OFFLINE_CONFLICT"
            : `TASK_UPDATE_FAILED:${saved.error.code}`,
        );
      result = saved.data;
    } else if (input.action === "inspect") {
      const saved = await this.client
        .from("housekeeping_inspections")
        .insert({
          task_id: input.taskId,
          inspector: input.inspector,
          rating: input.rating ?? null,
          remarks: input.remarks ?? null,
          status: input.status,
          inspected_at: new Date().toISOString(),
        })
        .select("*")
        .single();
      if (saved.error) throw new Error(`INSPECTION_FAILED:${saved.error.code}`);
      await this.client
        .from("housekeeping_tasks")
        .update({
          operational_status: input.status === "approved" ? "ready" : "cleaning",
          status: input.status === "approved" ? "verified" : "in_progress",
          verified_at: input.status === "approved" ? new Date().toISOString() : null,
        })
        .eq("id", input.taskId);
      result = saved.data;
    } else if (input.action === "adjust_stock") {
      const saved = await this.client
        .from("stock_items")
        .update({ quantity: input.quantity, last_restocked_at: new Date().toISOString() })
        .eq("id", input.stockId)
        .select("*")
        .single();
      if (saved.error) throw new Error(`STOCK_UPDATE_FAILED:${saved.error.code}`);
      result = saved.data;
    } else if (input.action === "create_incident") {
      const saved = await this.client
        .from("maintenance_incidents")
        .insert({
          property_id: input.propertyId,
          reservation_id: input.reservationId,
          title: input.title,
          description: input.description ?? null,
          priority: input.priority,
          due_at: input.dueAt,
        })
        .select("*")
        .single();
      if (saved.error) throw new Error(`INCIDENT_FAILED:${saved.error.code}`);
      result = saved.data;
    } else if (input.action === "create_inventory") {
      const saved = await this.client
        .from("inventory_items")
        .insert({
          property_id: input.propertyId,
          room: input.room,
          category: input.category,
          name: input.name,
          quantity: input.quantity,
          unit_value_cents: input.unitValueCents,
          condition: input.condition,
        })
        .select("*")
        .single();
      if (saved.error) throw new Error(`INVENTORY_FAILED:${saved.error.code}`);
      result = saved.data;
    } else if (input.action === "record_linen") {
      const saved = await this.client
        .from("linen_rotations")
        .insert({
          property_id: input.propertyId,
          reservation_id: input.reservationId,
          item: input.item,
          quantity: input.quantity,
          direction: input.direction,
          notes: input.notes ?? null,
          recorded_by: actorId,
        })
        .select("*")
        .single();
      if (saved.error) throw new Error(`LINEN_FAILED:${saved.error.code}`);
      result = saved.data;
    } else if (input.action === "save_template") {
      const saved = await this.client
        .from("housekeeping_templates")
        .insert({
          property_id: input.propertyId,
          name: input.name,
          task_type: input.taskType,
          checklist: input.checklist,
        })
        .select("*")
        .single();
      if (saved.error) throw new Error(`TEMPLATE_FAILED:${saved.error.code}`);
      result = saved.data;
    } else if (input.action === "plan_intervention") {
      const saved = await this.client
        .from("maintenance_interventions")
        .insert({
          incident_id: input.incidentId,
          assignee: input.assignee ?? null,
          provider: input.provider ?? null,
          planned_for: input.plannedFor,
          notes: input.notes ?? null,
        })
        .select("*")
        .single();
      if (saved.error) throw new Error(`INTERVENTION_FAILED:${saved.error.code}`);
      result = saved.data;
    } else {
      const saved = await this.client
        .from("maintenance_interventions")
        .update({
          status: input.status,
          completed_at: input.status === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", input.interventionId)
        .select("*")
        .single();
      if (saved.error) throw new Error(`INTERVENTION_UPDATE_FAILED:${saved.error.code}`);
      result = saved.data;
    }
    const entityId = String(result?.id ?? "unknown");
    const audit = await this.client.from("operational_audit_log").insert({
      entity_type: input.action,
      entity_id: entityId,
      action: input.action,
      actor_id: actorId,
      new_value: result,
    });
    if (audit.error) throw new Error(`OPERATION_AUDIT_FAILED:${audit.error.code}`);
    return result;
  }
}
