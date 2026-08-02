import "server-only";
import { createHash } from "node:crypto";
import { getDatabaseClient } from "@/platform/database/client";
import type { DocumentAction } from "./schemas";
import type { DocumentCenterSnapshot, DocumentKind } from "./contracts";
type QueryClient = { from(table: string): any }; // eslint-disable-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const amountKinds = new Set([
  "deposit_invoice",
  "balance_invoice",
  "final_invoice",
  "credit_note",
  "receipt",
  "payment_statement",
]);
const prefix: Record<DocumentKind, string> = {
  quote: "DEV",
  contract: "CTR",
  deposit_invoice: "FAC-A",
  balance_invoice: "FAC-S",
  final_invoice: "FAC",
  credit_note: "AVO",
  receipt: "REC",
  payment_statement: "ETP",
  certificate: "ATT",
};
export class DocumentRepository {
  private db = getDatabaseClient() as unknown as QueryClient;
  private async context(reservationId: string) {
    const [reservation, items, requests, payments, guests, properties] = await Promise.all([
      this.db.from("reservations").select("*").eq("id", reservationId).single(),
      this.db.from("reservation_items").select("*").eq("reservation_id", reservationId),
      this.db
        .from("reservation_special_requests")
        .select("*")
        .eq("reservation_id", reservationId)
        .maybeSingle(),
      this.db.from("payments").select("*").eq("reservation_id", reservationId),
      this.db
        .from("reservation_guests")
        .select("guest_id,is_primary,guests(id,first_name,last_name,email)")
        .eq("reservation_id", reservationId),
      this.db.from("properties").select("id,name,slug"),
    ]);
    const failed = [reservation, items, requests, payments, guests, properties].find(
      (v) => v.error,
    );
    if (failed?.error) throw new Error(`DOCUMENT_CONTEXT_FAILED:${failed.error.code}`);
    const property = (properties.data as Row[]).find((p) => p.id === reservation.data.property_id);
    const primary =
      (guests.data as Row[]).find((g) => g.is_primary)?.guests ??
      (guests.data as Row[])[0]?.guests ??
      {};
    return {
      reservation: reservation.data,
      items: items.data ?? [],
      specialRequests: requests.data ?? null,
      payments: payments.data ?? [],
      property,
      guest: primary,
    };
  }
  async snapshot(): Promise<DocumentCenterSnapshot> {
    const [
      documents,
      reservations,
      properties,
      reservationGuests,
      templates,
      settings,
      signatures,
      deliveries,
      audit,
    ] = await Promise.all([
      this.db
        .from("document_records")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1000),
      this.db
        .from("reservations")
        .select("id,reference,property_id,quote_snapshot")
        .order("created_at", { ascending: false })
        .limit(5000),
      this.db.from("properties").select("id,name"),
      this.db
        .from("reservation_guests")
        .select("reservation_id,guest_id,is_primary,guests(id,first_name,last_name,email)"),
      this.db.from("document_templates").select("*").order("name"),
      this.db.from("organization_document_settings").select("*").eq("id", true).maybeSingle(),
      this.db
        .from("document_signature_requests")
        .select("document_id,status,created_at")
        .order("created_at", { ascending: false }),
      this.db
        .from("document_deliveries")
        .select("document_id,status,created_at")
        .order("created_at", { ascending: false }),
      this.db
        .from("document_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    const failed = [
      documents,
      reservations,
      properties,
      reservationGuests,
      templates,
      settings,
      signatures,
      deliveries,
      audit,
    ].find((v) => v.error);
    if (failed?.error) throw new Error(`DOCUMENT_READ_FAILED:${failed.error.code}`);
    const propertyMap = new Map((properties.data as Row[]).map((p) => [p.id, p]));
    const reservationMap = new Map((reservations.data as Row[]).map((r) => [r.id, r]));
    const guestMap = new Map<string, Row>();
    for (const link of reservationGuests.data as Row[])
      if (link.is_primary || !guestMap.has(link.reservation_id))
        guestMap.set(link.reservation_id, link);
    const signatureMap = new Map<string, string>();
    for (const row of signatures.data as Row[])
      if (!signatureMap.has(row.document_id)) signatureMap.set(row.document_id, row.status);
    const deliveryMap = new Map<string, string>();
    for (const row of deliveries.data as Row[])
      if (!deliveryMap.has(row.document_id)) deliveryMap.set(row.document_id, row.status);
    const rows = (documents.data as Row[]).map((row) => {
      const reservation = reservationMap.get(row.reservation_id) ?? {};
      const property = propertyMap.get(reservation.property_id) ?? {};
      const guestLink = guestMap.get(row.reservation_id);
      const guest = guestLink?.guests ?? {};
      return {
        id: row.id,
        kind: row.kind,
        number: row.number,
        version: row.version,
        status: row.status,
        reservationId: row.reservation_id,
        reservationReference: reservation.reference ?? "—",
        propertyId: property.id ?? "",
        propertyName: property.name ?? "Logement",
        guestId: guestLink?.guest_id ?? null,
        guestName: [guest.first_name, guest.last_name].filter(Boolean).join(" ") || "Voyageur",
        amountCents: amountKinds.has(row.kind)
          ? Number(row.snapshot?.amountCents ?? row.snapshot?.financials?.totalCents ?? 0)
          : null,
        storagePath: row.storage_path,
        issuedAt: row.issued_at,
        createdAt: row.created_at,
        signatureStatus: signatureMap.get(row.id) ?? null,
        deliveryStatus: deliveryMap.get(row.id) ?? null,
      };
    });
    const s = settings.data ?? {};
    return {
      generatedAt: new Date().toISOString(),
      metrics: {
        total: rows.length,
        toSign: rows.filter(
          (r) => r.kind === "contract" && !["signed", "archived", "void"].includes(r.status),
        ).length,
        sent: rows.filter((r) => r.status === "sent").length,
        signed: rows.filter((r) => r.status === "signed").length,
        archived: rows.filter((r) => r.status === "archived").length,
      },
      documents: rows,
      reservations: (reservations.data as Row[]).map((r) => {
        const p = propertyMap.get(r.property_id) ?? {};
        const g = guestMap.get(r.id)?.guests ?? {};
        return {
          id: r.id,
          reference: r.reference,
          propertyName: p.name ?? "Logement",
          guestName: [g.first_name, g.last_name].filter(Boolean).join(" ") || "Voyageur",
          guestEmail: g.email ?? "",
        };
      }),
      templates: (templates.data as Row[]).map((t) => ({
        id: t.id,
        kind: t.kind,
        name: t.name,
        primaryColor: t.primary_color,
        footerText: t.footer_text ?? "",
        legalText: t.legal_text ?? "",
        active: t.active,
      })),
      settings: {
        legalName: s.legal_name ?? "Beaux Rivages",
        address: s.address ?? "",
        phone: s.phone ?? "",
        email: s.email ?? "",
        iban: s.iban ?? "",
        bic: s.bic ?? "",
        vatNumber: s.vat_number ?? "",
        vatEnabled: s.vat_enabled ?? false,
        logoPath: s.logo_path ?? "",
        primaryColor: s.primary_color ?? "#153b3a",
        footerText: s.footer_text ?? "",
        legalMentions: s.legal_mentions ?? "",
        ownerSignaturePath: s.owner_signature_path ?? "",
      },
      audit: (audit.data as Row[]).map((a) => ({
        id: String(a.id),
        documentId: a.document_id,
        action: a.action,
        origin: a.origin,
        details: a.details ?? {},
        createdAt: a.created_at,
      })),
    };
  }
  async execute(input: DocumentAction, userId: string) {
    if (input.action === "generate") {
      const context = await this.context(input.reservationId);
      const existing = await this.db
        .from("document_records")
        .select("version")
        .eq("reservation_id", input.reservationId)
        .eq("kind", input.kind)
        .order("version", { ascending: false })
        .limit(1);
      if (existing.error) throw new Error("DOCUMENT_VERSION_FAILED");
      const version = Number(existing.data?.[0]?.version ?? 0) + 1;
      const number = `${prefix[input.kind]}-${context.reservation.reference}`;
      const snapshot = { ...context, generatedAt: new Date().toISOString() };
      const hash = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
      const saved = await this.db
        .from("document_records")
        .insert({
          reservation_id: input.reservationId,
          kind: input.kind,
          number,
          version,
          status: "issued",
          snapshot,
          content_hash: hash,
          issued_at: new Date().toISOString(),
          created_by: userId,
        })
        .select("id")
        .single();
      if (saved.error) throw new Error(`DOCUMENT_CREATE_FAILED:${saved.error.code}`);
      await this.audit(saved.data.id, "generated", userId, { kind: input.kind, version });
      return saved.data;
    }
    if (input.action === "prepare_signature") {
      const doc = await this.db
        .from("document_records")
        .select("id,kind")
        .eq("id", input.documentId)
        .single();
      if (doc.error || doc.data.kind !== "contract") throw new Error("SIGNATURE_CONTRACT_REQUIRED");
      const saved = await this.db
        .from("document_signature_requests")
        .insert({
          document_id: input.documentId,
          signer_email: input.signerEmail,
          expires_at: input.expiresAt ?? null,
        })
        .select("id")
        .single();
      if (saved.error) throw new Error("SIGNATURE_PREPARE_FAILED");
      await this.audit(input.documentId, "signature_prepared", userId, {
        requestId: saved.data.id,
      });
      return saved.data;
    }
    if (input.action === "update_signature") {
      const before = await this.db
        .from("document_signature_requests")
        .select("document_id")
        .eq("id", input.requestId)
        .single();
      if (before.error) throw new Error("SIGNATURE_NOT_FOUND");
      const times =
        input.status === "sent"
          ? { sent_at: new Date().toISOString() }
          : input.status === "viewed"
            ? { viewed_at: new Date().toISOString() }
            : input.status === "signed"
              ? { signed_at: new Date().toISOString() }
              : {};
      const saved = await this.db
        .from("document_signature_requests")
        .update({ status: input.status, ...times })
        .eq("id", input.requestId);
      if (saved.error) throw new Error("SIGNATURE_UPDATE_FAILED");
      await this.db
        .from("document_records")
        .update({ status: input.status })
        .eq("id", before.data.document_id);
      await this.audit(before.data.document_id, `signature_${input.status}`, userId, {});
      return { ok: true };
    }
    if (input.action === "record_delivery") {
      const saved = await this.db
        .from("document_deliveries")
        .insert({
          document_id: input.documentId,
          recipient: input.recipient,
          channel: input.channel,
          status: input.status,
          sent_at: input.status === "sent" ? new Date().toISOString() : null,
        })
        .select("id")
        .single();
      if (saved.error) throw new Error("DELIVERY_FAILED");
      await this.audit(input.documentId, "delivery_recorded", userId, {
        recipient: input.recipient,
        channel: input.channel,
        status: input.status,
      });
      return saved.data;
    }
    if (input.action === "archive") {
      const saved = await this.db
        .from("document_records")
        .update({ status: "archived", archived_at: new Date().toISOString() })
        .eq("id", input.documentId);
      if (saved.error) throw new Error("ARCHIVE_FAILED");
      await this.audit(input.documentId, "archived", userId, { reason: input.reason });
      return { ok: true };
    }
    if (input.action === "save_template") {
      const values = {
        kind: input.kind,
        name: input.name,
        primary_color: input.primaryColor,
        footer_text: input.footerText,
        legal_text: input.legalText,
        active: input.active,
      };
      const saved = input.templateId
        ? await this.db.from("document_templates").update(values).eq("id", input.templateId)
        : await this.db.from("document_templates").insert(values);
      if (saved.error) throw new Error("TEMPLATE_SAVE_FAILED");
      return { ok: true };
    }
    const values = {
      legal_name: input.legalName,
      address: input.address,
      phone: input.phone,
      email: input.email,
      iban: input.iban,
      bic: input.bic,
      vat_number: input.vatNumber,
      vat_enabled: input.vatEnabled,
      logo_path: input.logoPath,
      primary_color: input.primaryColor,
      footer_text: input.footerText,
      legal_mentions: input.legalMentions,
      owner_signature_path: input.ownerSignaturePath,
      updated_by: userId,
    };
    const saved = await this.db
      .from("organization_document_settings")
      .upsert({ id: true, ...values });
    if (saved.error) throw new Error("SETTINGS_SAVE_FAILED");
    return { ok: true };
  }
  private async audit(
    documentId: string,
    action: string,
    actorId: string,
    details: Record<string, unknown>,
  ) {
    const saved = await this.db
      .from("document_audit_log")
      .insert({ document_id: documentId, action, actor_id: actorId, details });
    if (saved.error) throw new Error("DOCUMENT_AUDIT_FAILED");
  }
}
