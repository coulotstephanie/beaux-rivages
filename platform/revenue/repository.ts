import "server-only";
import { randomBytes, createHash } from "node:crypto";
import QRCode from "qrcode";
import { getDatabaseClient } from "@/platform/database/client";
import { calculateLoyaltyTier, commercialRecommendations, loyaltyRules } from "./engine";
import type { CampaignKind, CommercialKpis } from "./contracts";

const money = (value: number | null | undefined) => Number(value ?? 0);

export class RevenueMarketingRepository {
  private readonly client = getDatabaseClient();

  async dashboard() {
    const [reservations, reservationGuests, guests, options, giftCards, promotions, campaigns, reviews, loyalty, experiences] = await Promise.all([
      this.client.from("reservations").select("id,property_id,channel,status,total_cents,arrival,departure,adults,children,babies,pets,created_at"),
      this.client.from("reservation_guests").select("reservation_id,guest_id,is_primary"),
      this.client.from("guests").select("id,first_name,last_name,email,phone,locale,country_code,acquisition_channel,birthday,allergies,sleeping_preferences,arrival_preferences,internal_notes,special_requests,preferred_property_id,preferred_experience_codes"),
      this.client.from("reservation_options").select("reservation_id,option_code,label,quantity,unit_price_cents"),
      this.client.from("gift_cards").select("id,public_code,initial_amount_cents,balance_cents,status,expires_at,created_at").order("created_at", { ascending: false }).limit(100),
      this.client.from("revenue_promotions").select("*").order("created_at", { ascending: false }).limit(100),
      this.client.from("marketing_campaigns").select("*").order("created_at", { ascending: false }).limit(100),
      this.client.from("review_requests").select("platform,status,rating,created_at"),
      this.client.from("loyalty_accounts").select("*"),
      this.client.from("premium_experiences").select("*").eq("enabled", true).order("sort_order"),
    ]);
    const failed = [reservations, reservationGuests, guests, options, giftCards, promotions, campaigns, reviews, loyalty, experiences].find((result) => result.error);
    if (failed?.error) throw new Error(`REVENUE_DASHBOARD_FAILED:${failed.error.message}`);
    const confirmed = (reservations.data ?? []).filter((row) => ["confirmed", "completed"].includes(row.status));
    const revenueCents = confirmed.reduce((sum, row) => sum + money(row.total_cents), 0);
    const guestStays = new Map<string, typeof confirmed>();
    const primaryGuestByReservation = new Map((reservationGuests.data ?? []).filter((row) => row.is_primary).map((row) => [row.reservation_id, row.guest_id]));
    confirmed.forEach((row) => {
      const guestId = primaryGuestByReservation.get(row.id);
      if (!guestId) return;
      guestStays.set(guestId, [...(guestStays.get(guestId) ?? []), row]);
    });
    const optionsByReservation = new Map<string, string[]>();
    (options.data ?? []).forEach((row) => optionsByReservation.set(row.reservation_id, [...(optionsByReservation.get(row.reservation_id) ?? []), row.option_code]));
    const crm = (guests.data ?? []).map((guest) => {
      const stays = guestStays.get(guest.id) ?? [];
      const spent = stays.reduce((sum, stay) => sum + money(stay.total_cents), 0);
      const experienceCodes = stays.flatMap((stay) => optionsByReservation.get(stay.id) ?? []);
      const tier = calculateLoyaltyTier({ stays: stays.length, totalSpentCents: spent });
      return {
        ...guest,
        stays: stays.length,
        totalSpentCents: spent,
        directStays: stays.filter((stay) => stay.channel === "direct").length,
        children: stays.some((stay) => stay.children > 0 || stay.babies > 0),
        pets: stays.some((stay) => stay.pets > 0),
        experienceCodes,
        tier,
        loyaltyLabel: loyaltyRules[tier].label,
        lastStay: stays.map((stay) => stay.departure).sort().at(-1) ?? null,
      };
    }).sort((a, b) => b.totalSpentCents - a.totalSpentCents);
    const repeatGuests = crm.filter((guest) => guest.stays > 1);
    const kpis: CommercialKpis = {
      directBookings: confirmed.filter((row) => row.channel === "direct").length,
      revenueCents,
      averageBasketCents: confirmed.length ? Math.round(revenueCents / confirmed.length) : 0,
      returningGuestRate: crm.length ? Math.round(repeatGuests.length / crm.length * 10_000) / 100 : 0,
      loyalTravelers: repeatGuests.length,
      giftCardsSoldCents: (giftCards.data ?? []).filter((row) => ["active", "redeemed"].includes(row.status)).reduce((sum, row) => sum + row.initial_amount_cents, 0),
      promotionUses: (promotions.data ?? []).reduce((sum, row) => sum + row.usage_count, 0),
      signaturePacks: (options.data ?? []).filter((row) => row.option_code === "signature").length,
    };
    const optionRevenue = Object.values((options.data ?? []).reduce<Record<string, { label: string; revenueCents: number; count: number }>>((all, row) => {
      const item = all[row.option_code] ?? { label: row.label, revenueCents: 0, count: 0 };
      item.revenueCents += row.quantity * row.unit_price_cents;
      item.count += row.quantity;
      all[row.option_code] = item;
      return all;
    }, {})).sort((a, b) => b.revenueCents - a.revenueCents);
    const directShare = confirmed.length ? Math.round(kpis.directBookings / confirmed.length * 100) : 0;
    return {
      generatedAt: new Date().toISOString(), kpis, crm, giftCards: giftCards.data ?? [], promotions: promotions.data ?? [],
      campaigns: campaigns.data ?? [], reviews: reviews.data ?? [], loyalty: loyalty.data ?? [], experiences: experiences.data ?? [],
      analytics: { optionRevenue, channels: Object.entries(confirmed.reduce<Record<string, number>>((all, row) => ({ ...all, [row.channel]: (all[row.channel] ?? 0) + 1 }), {})), directShare },
      recommendations: commercialRecommendations({ directShare, occupancyRate: confirmed.length ? 70 : 0, averageBasketCents: kpis.averageBasketCents, topExperience: optionRevenue[0]?.label }),
    };
  }

  async createGiftCard(input: { amountCents: number; expiresAt: string; recipientName?: string }) {
    const token = randomBytes(24).toString("base64url");
    const code = `BR-${randomBytes(4).toString("hex").toUpperCase()}`;
    const { data, error } = await this.client.from("gift_cards").insert({
      public_code: code,
      qr_token_hash: createHash("sha256").update(token).digest("hex"),
      initial_amount_cents: input.amountCents,
      balance_cents: input.amountCents,
      status: "active",
      expires_at: input.expiresAt,
      recipient_name: input.recipientName,
      activated_at: new Date().toISOString(),
    }).select("id,public_code,initial_amount_cents,balance_cents,status,expires_at").single();
    if (error) throw new Error(`GIFT_CARD_CREATE_FAILED:${error.message}`);
    const qrValue = `https://www.beaux-rivages.com/reserver?carte=${encodeURIComponent(code)}&jeton=${encodeURIComponent(token)}`;
    return { ...data, qrValue, qrDataUrl: await QRCode.toDataURL(qrValue, { width: 320, margin: 1, errorCorrectionLevel: "M" }) };
  }

  async createPromotion(input: { code: string; label: string; discountType: "fixed" | "percentage"; value: number; minimumStayNights?: number; directOnly: boolean; returningGuestsOnly: boolean; lowSeasonOnly: boolean; startsAt: string; endsAt: string }) {
    const { data, error } = await this.client.from("revenue_promotions").insert({
      code: input.code.trim().toUpperCase(), label: input.label, discount_type: input.discountType, value: input.value,
      minimum_stay_nights: input.minimumStayNights, direct_only: input.directOnly, returning_guests_only: input.returningGuestsOnly,
      low_season_only: input.lowSeasonOnly, starts_at: input.startsAt, ends_at: input.endsAt,
    }).select("*").single();
    if (error) throw new Error(`PROMOTION_CREATE_FAILED:${error.message}`);
    return data;
  }

  async createCampaign(input: { name: string; kind: CampaignKind; locale: "fr" | "en" | "de"; subject: string; preheader?: string; contentBlocks: { type: "heading" | "text" | "button"; content: string; href?: string }[]; scheduledAt?: string }) {
    const { data, error } = await this.client.from("marketing_campaigns").insert({
      name: input.name, kind: input.kind, locale: input.locale, subject: input.subject, preheader: input.preheader,
      content_blocks: input.contentBlocks, scheduled_at: input.scheduledAt, status: input.scheduledAt ? "scheduled" : "draft",
    }).select("*").single();
    if (error) throw new Error(`CAMPAIGN_CREATE_FAILED:${error.message}`);
    return data;
  }
}
