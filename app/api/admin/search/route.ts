import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit } from "@/platform/http/security";

type Result = { id: string; label: string; view: string; kind: string };

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base de données non configurée." }, { status: 503 });
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) ?? "";
  if (query.length < 2) return noStoreJson({ results: [] });
  const pattern = `%${query.replace(/[,%()]/g, " ")}%`;
  const client = getDatabaseClient();
  const [guests, reservations, properties, contracts, carnet, messages] = await Promise.all([
    client
      .from("guests")
      .select("id,first_name,last_name,email")
      .or(`first_name.ilike.${pattern},last_name.ilike.${pattern},email.ilike.${pattern}`)
      .limit(5),
    client
      .from("reservations")
      .select("id,reference,channel")
      .or(`reference.ilike.${pattern},channel.ilike.${pattern},external_reference.ilike.${pattern}`)
      .limit(5),
    client
      .from("properties")
      .select("id,name,slug")
      .or(`name.ilike.${pattern},slug.ilike.${pattern}`)
      .limit(4),
    client.from("contracts").select("id,number").ilike("number", pattern).limit(4),
    client
      .from("carnet_entries")
      .select("id,title,category")
      .or(`title.ilike.${pattern},summary.ilike.${pattern},category.ilike.${pattern}`)
      .limit(5),
    client
      .from("transactional_emails")
      .select("id,template_key,status")
      .ilike("template_key", pattern)
      .limit(4),
  ]);
  const failed = [guests, reservations, properties, contracts, carnet, messages].find(
    (result) => result.error,
  );
  if (failed?.error)
    return noStoreJson({ error: "Recherche momentanément indisponible." }, { status: 503 });
  const results: Result[] = [
    ...(guests.data ?? []).map((item) => ({
      id: item.id,
      label: `${item.first_name} ${item.last_name} · ${item.email}`,
      view: "voyageurs",
      kind: "Voyageur",
    })),
    ...(reservations.data ?? []).map((item) => ({
      id: item.id,
      label: `${item.reference} · ${item.channel}`,
      view: "reservations",
      kind: "Réservation",
    })),
    ...(properties.data ?? []).map((item) => ({
      id: item.id,
      label: item.name,
      view: "logements",
      kind: "Logement",
    })),
    ...(contracts.data ?? []).map((item) => ({
      id: item.id,
      label: `Contrat ${item.number}`,
      view: "documents",
      kind: "Document",
    })),
    ...(carnet.data ?? []).map((item) => ({
      id: item.id,
      label: `${item.title} · ${item.category}`,
      view: "carnet",
      kind: "Carnet",
    })),
    ...(messages.data ?? []).map((item) => ({
      id: item.id,
      label: `${item.template_key} · ${item.status}`,
      view: "messages",
      kind: "Message",
    })),
  ];
  return noStoreJson({ results });
}
