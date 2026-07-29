import { NextRequest } from "next/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { ChannelManagerRepository } from "@/platform/channel-manager/repository";
import { channelActionSchema } from "@/platform/channel-manager/schemas";
import { noStoreJson, rateLimit, requireAdmin, requireSameOrigin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request,15); if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error:"Authentification requise." },{ status:401 });
  if (!isDatabaseConfigured()) return noStoreJson({ error:"Base de données non configurée." },{ status:503 });
  try { return noStoreJson(await new ChannelManagerRepository().snapshot()); }
  catch (error) { return noStoreJson({ error:"Channel Manager indisponible.",code:error instanceof Error ? error.message.split(":")[0] : "UNKNOWN" },{ status:500 }); }
}
export async function POST(request: NextRequest) {
  const limited = rateLimit(request,8); if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error:"Origine non autorisée." },{ status:403 });
  if (!requireAdmin(request)) return noStoreJson({ error:"Authentification requise." },{ status:401 });
  const parsed = channelActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error:"Données invalides.",details:parsed.error.flatten() },{ status:400 });
  try { return noStoreJson({ ok:true,result:await new ChannelManagerRepository().execute(parsed.data) },{ status:201 }); }
  catch (error) { return noStoreJson({ error:"Synchronisation impossible.",code:error instanceof Error ? error.message.split(":")[0] : "UNKNOWN" },{ status:500 }); }
}
