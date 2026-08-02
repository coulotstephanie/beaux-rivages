import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

type QueryClient = {
  // The audit table is created by the operations-center migration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from(table: string): any;
};

const kinds = new Set([
  "before_cleaning",
  "after_cleaning",
  "before_intervention",
  "after_intervention",
  "quality",
  "incident",
]);
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const staff = await authorizeStaff(request, ["admin", "concierge"]);
  if (!staff) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("photo");
  const propertyId = String(form?.get("propertyId") ?? "");
  const kind = String(form?.get("kind") ?? "");
  if (
    !(file instanceof File) ||
    !propertyId ||
    !kinds.has(kind) ||
    file.size > 10_485_760 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  )
    return noStoreJson(
      { error: "Photo invalide (JPG, PNG ou WebP, 10 Mo maximum)." },
      { status: 400 },
    );
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${propertyId}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const database = getDatabaseClient();
  const uploaded = await database.storage
    .from("operations")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploaded.error) return noStoreJson({ error: "Téléversement impossible." }, { status: 500 });
  const taskId = String(form?.get("taskId") ?? "") || null;
  let reservationId = String(form?.get("reservationId") ?? "") || null;
  if (!reservationId && taskId) {
    const task = await database
      .from("housekeeping_tasks")
      .select("reservation_id")
      .eq("id", taskId)
      .maybeSingle();
    reservationId = task.data?.reservation_id ?? null;
  }
  const inserted = await database
    .from("operational_photos")
    .insert({
      property_id: propertyId,
      reservation_id: reservationId,
      housekeeping_task_id: taskId,
      maintenance_incident_id: String(form?.get("incidentId") ?? "") || null,
      kind,
      storage_path: path,
      caption: String(form?.get("caption") ?? "") || null,
    })
    .select("id")
    .single();
  if (inserted.error) {
    await database.storage.from("operations").remove([path]);
    return noStoreJson({ error: "Enregistrement impossible." }, { status: 500 });
  }
  await (database as unknown as QueryClient).from("operational_audit_log").insert({
    entity_type: "photo",
    entity_id: inserted.data.id,
    action: "upload_photo",
    actor_id: staff.userId,
    new_value: { path, kind },
  });
  return noStoreJson({ ok: true, id: inserted.data.id }, { status: 201 });
}
