import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import { synchronizePropertyCalendars } from "@/platform/calendar/service";
import type { PropertySlug } from "@/platform/calendar/config";
import type { ChannelAction } from "./schemas";
import type { ChannelManagerSnapshot } from "./contracts";

type Row = Record<string, unknown>;
export class ChannelManagerRepository {
  private client = getDatabaseClient();

  async snapshot(): Promise<ChannelManagerSnapshot> {
    const [connections, mappings, jobs, conflicts, logs, properties, blocks, reservations] = await Promise.all([
      this.client.from("channel_connections").select("*").order("provider"),
      this.client.from("channel_listing_mappings").select("*").order("created_at"),
      this.client.from("channel_sync_jobs").select("*").order("created_at", { ascending: false }).limit(100),
      this.client.from("channel_conflicts").select("*").order("created_at", { ascending: false }).limit(100),
      this.client.from("channel_audit_logs").select("*").order("created_at", { ascending: false }).limit(200),
      this.client.from("properties").select("id,name,slug"),
      this.client.from("occupancy_blocks").select("id,property_id,source,stay_range,note,created_at").order("created_at", { ascending: false }).limit(500),
      this.client.from("reservations").select("id,channel,external_reference").not("external_reference", "is", null),
    ]);
    const failed = [connections,mappings,jobs,conflicts,logs,properties,blocks,reservations].find((result) => result.error);
    if (failed?.error) throw new Error(`CHANNEL_MANAGER_READ_FAILED:${failed.error.code}`);
    const propertyById = new Map(((properties.data ?? []) as Row[]).map((row) => [String(row.id), row]));
    const connectionById = new Map(((connections.data ?? []) as Row[]).map((row) => [String(row.id), row]));
    const jobRows = (jobs.data ?? []) as Row[];
    const conflictRows = (conflicts.data ?? []) as Row[];
    const lastSync = jobRows.filter((row) => row.finished_at).map((row) => String(row.finished_at)).sort().at(-1) ?? null;
    return {
      generatedAt: new Date().toISOString(),
      metrics: {
        synchronizedReservations: (reservations.data ?? []).length,
        running: jobRows.filter((row) => ["queued","running"].includes(String(row.status))).length,
        errors: jobRows.filter((row) => row.status === "failed").length,
        alerts: conflictRows.filter((row) => row.status === "open").length + jobRows.filter((row) => row.status === "failed").length,
        conflicts: conflictRows.filter((row) => !["resolved","ignored"].includes(String(row.status))).length,
        lastSyncAt: lastSync,
      },
      connections: ((connections.data ?? []) as Row[]).map((row) => ({ id:String(row.id), provider:String(row.provider), name:String(row.name), mode:String(row.mode), status:String(row.status), capabilities:Array.isArray(row.capabilities) ? row.capabilities.map(String) : [], lastCheckedAt:row.last_checked_at ? String(row.last_checked_at) : null, lastError:String(row.last_error ?? "") })),
      mappings: ((mappings.data ?? []) as Row[]).map((row) => ({ id:String(row.id), connectionId:String(row.connection_id), provider:String(connectionById.get(String(row.connection_id))?.provider ?? ""), propertyId:String(row.property_id), propertyName:String(propertyById.get(String(row.property_id))?.name ?? "Maison"), externalListingId:String(row.external_listing_id), externalListingName:String(row.external_listing_name ?? ""), status:String(row.status), syncPrices:Boolean(row.sync_prices), syncAvailability:Boolean(row.sync_availability), syncReservations:Boolean(row.sync_reservations) })),
      jobs: jobRows.map((row) => ({ id:String(row.id), provider:String(connectionById.get(String(row.connection_id))?.provider ?? ""), direction:String(row.direction), resource:String(row.resource), status:String(row.status), attempt:Number(row.attempt), errorMessage:String(row.error_message ?? ""), createdAt:String(row.created_at), startedAt:row.started_at ? String(row.started_at) : null, finishedAt:row.finished_at ? String(row.finished_at) : null })),
      conflicts: conflictRows.map((row) => ({ id:String(row.id), propertyName:String(propertyById.get(String(row.property_id))?.name ?? "Maison"), provider:String(row.provider), range:String(row.stay_range), type:String(row.conflict_type), severity:String(row.severity), status:String(row.status), proposedResolution:String(row.proposed_resolution ?? ""), createdAt:String(row.created_at) })),
      logs: ((logs.data ?? []) as Row[]).map((row) => ({ id:String(row.id), provider:String(row.provider ?? ""), action:String(row.action), entityType:String(row.entity_type), entityId:String(row.entity_id ?? ""), reversible:Boolean(row.reversible), actor:String(row.actor), createdAt:String(row.created_at) })),
      calendar: ((blocks.data ?? []) as Row[]).map((row) => ({ id:String(row.id), propertyName:String(propertyById.get(String(row.property_id))?.name ?? "Maison"), source:String(row.source), range:String(row.stay_range), note:String(row.note ?? "") })),
    };
  }

  async execute(input: ChannelAction) {
    if (input.action === "update_mapping") {
      const { data, error } = await this.client.from("channel_listing_mappings").update({ external_listing_id:input.externalListingId, external_listing_name:input.externalListingName ?? null, sync_prices:input.syncPrices, sync_availability:input.syncAvailability, sync_reservations:input.syncReservations }).eq("id",input.mappingId).select("id").single();
      if (error) throw new Error(`CHANNEL_MAPPING_UPDATE_FAILED:${error.code}`);
      await this.log("mapping.updated","mapping",data.id,null,true);
      return data;
    }
    if (input.action === "resolve_conflict") {
      const { data,error } = await this.client.from("channel_conflicts").update({ status:input.status,resolution:input.resolution,resolved_at:input.status === "resolved" ? new Date().toISOString() : null }).eq("id",input.conflictId).select("id").single();
      if (error) throw new Error(`CHANNEL_CONFLICT_UPDATE_FAILED:${error.code}`);
      await this.log("conflict.resolved","conflict",data.id,null,true);
      return data;
    }
    if (input.action === "retry_job") {
      const { data:old,error:readError } = await this.client.from("channel_sync_jobs").select("*").eq("id",input.jobId).single();
      if (readError) throw new Error(`CHANNEL_JOB_NOT_FOUND:${readError.code}`);
      const { data,error } = await this.client.from("channel_sync_jobs").insert({ connection_id:old.connection_id,mapping_id:old.mapping_id,direction:old.direction,resource:old.resource,payload:old.payload,idempotency_key:crypto.randomUUID(),attempt:old.attempt + 1 }).select("id").single();
      if (error) throw new Error(`CHANNEL_JOB_RETRY_FAILED:${error.code}`);
      await this.log("job.retried","sync_job",data.id,data.id,false);
      return data;
    }
    const started = new Date().toISOString();
    const { data:job,error:jobError } = await this.client.from("channel_sync_jobs").insert({ connection_id:input.connectionId,direction:"import",resource:"availability",status:"running",idempotency_key:crypto.randomUUID(),attempt:1,started_at:started,payload:{ propertySlug:input.propertySlug } }).select("id").single();
    if (jobError) throw new Error(`CHANNEL_JOB_CREATE_FAILED:${jobError.code}`);
    try {
      const result = await synchronizePropertyCalendars(input.propertySlug as PropertySlug,true);
      const failed = result.results.filter((item) => item.status === "error");
      await this.client.from("channel_sync_jobs").update({ status:failed.length ? "partial" : "success",result:{ imported:result.blocks.length,sources:result.results },finished_at:new Date().toISOString(),error_message:failed.map((item) => item.error).join("; ") || null }).eq("id",job.id);
      await this.log("availability.synchronized","property",input.propertySlug,job.id,false);
      return { id:job.id,imported:result.blocks.length };
    } catch (error) {
      await this.client.from("channel_sync_jobs").update({ status:"failed",error_code:"SYNC_FAILED",error_message:error instanceof Error ? error.message : "Unknown",finished_at:new Date().toISOString() }).eq("id",job.id);
      throw error;
    }
  }
  private async log(action:string,entityType:string,entityId:string,jobId:string|null,reversible:boolean) {
    await this.client.from("channel_audit_logs").insert({ action,entity_type:entityType,entity_id:entityId,job_id:jobId,reversible,actor:"admin" });
  }
}
