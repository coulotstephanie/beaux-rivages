import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import type { z } from "zod";
import type { conciergeRequestSchema } from "./schemas";
type Input=z.infer<typeof conciergeRequestSchema>; type Row=Record<string,unknown>;
export class ConciergePremiumRepository {
  private client=getDatabaseClient();
  async catalog(locale:"fr"|"en"|"de"="fr") {
    const [categories,experiences]=await Promise.all([this.client.from("concierge_categories").select("*").eq("enabled",true).order("sort_order"),this.client.from("concierge_experiences").select("*").eq("enabled",true).order("sort_order")]);
    if(categories.error||experiences.error) throw new Error("CONCIERGE_CATALOG_FAILED");
    return { locale,categories:((categories.data??[]) as Row[]).map((r)=>({id:String(r.id),code:String(r.code),label:String(r[`label_${locale}`]),description:String(r[`description_${locale}`]??"")})),experiences:((experiences.data??[]) as Row[]).map((r)=>({id:String(r.id),categoryId:String(r.category_id),code:String(r.code),title:String(r[`title_${locale}`]),description:String(r[`description_${locale}`]),inclusions:r.inclusions,priceCents:Number(r.price_cents),pricingUnit:String(r.pricing_unit),requiresConfirmation:Boolean(r.requires_confirmation),imagePath:r.image_path?String(r.image_path):null})) };
  }
  async create(input:Input) {
    const identity=await this.identity(input.reservationReference,input.email);
    if(input.action==="special_request") {
      const {data,error}=await this.client.from("concierge_special_requests").insert({reservation_id:identity.reservationId,guest_id:identity.guestId,occasion:input.occasion,details:input.details,allergies:input.allergies??null,dietary_requirements:input.dietaryRequirements??null}).select("id").single();
      if(error) throw new Error(`CONCIERGE_REQUEST_FAILED:${error.code}`);
      await this.notify("concierge","Nouvelle demande spéciale",`${input.reservationReference} · ${input.occasion}`,data.id);
      return {id:data.id,status:"requested"};
    }
    const ids=input.items.map((item)=>item.experienceId);
    const {data:catalog,error:catalogError}=await this.client.from("concierge_experiences").select("id,price_cents,enabled,title_fr").in("id",ids);
    if(catalogError||!catalog||catalog.length!==new Set(ids).size) throw new Error("CONCIERGE_EXPERIENCE_INVALID");
    const prices=new Map(catalog.map((item)=>[item.id,item]));
    const subtotal=input.items.reduce((sum,item)=>sum+Number(prices.get(item.experienceId)?.price_cents??0)*item.quantity,0);
    const {data:order,error}=await this.client.from("concierge_orders").insert({reservation_id:identity.reservationId,guest_id:identity.guestId,status:"requested",locale:input.locale,promotion_code:input.promotionCode??null,subtotal_cents:subtotal,total_cents:subtotal,guest_message:input.message??null}).select("id").single();
    if(error) throw new Error(`CONCIERGE_ORDER_FAILED:${error.code}`);
    const {error:itemsError}=await this.client.from("concierge_order_items").insert(input.items.map((item)=>({order_id:order.id,experience_id:item.experienceId,quantity:item.quantity,unit_price_cents:Number(prices.get(item.experienceId)?.price_cents??0)})));
    if(itemsError) { await this.client.from("concierge_orders").delete().eq("id",order.id); throw new Error(`CONCIERGE_ITEMS_FAILED:${itemsError.code}`); }
    await this.notify("concierge","Nouvelle expérience demandée",`${input.reservationReference} · ${(subtotal/100).toFixed(2)} €`,order.id);
    return {id:order.id,status:"requested",totalCents:subtotal,paymentRequired:subtotal>0};
  }
  private async identity(reference:string,email:string) {
    const {data:reservation,error}=await this.client.from("reservations").select("id").eq("reference",reference).single(); if(error) throw new Error("RESERVATION_NOT_FOUND");
    const {data:links}=await this.client.from("reservation_guests").select("guest_id,is_primary").eq("reservation_id",reservation.id);
    const ids=(links??[]).map((item)=>item.guest_id); if(!ids.length) throw new Error("RESERVATION_IDENTITY_FAILED");
    const {data:guest}=await this.client.from("guests").select("id,email").in("id",ids).ilike("email",email).maybeSingle(); if(!guest) throw new Error("RESERVATION_IDENTITY_FAILED");
    return {reservationId:reservation.id,guestId:guest.id};
  }
  private async notify(kind:string,title:string,body:string,entityId:string) { await this.client.from("back_office_notifications").insert({kind,title,body,priority:"high",entity_type:"concierge",entity_id:entityId}); }
}
