drop table if exists public.review_requests;
drop table if exists public.marketing_automations;
drop table if exists public.marketing_campaigns;
drop table if exists public.premium_experiences;
drop table if exists public.referrals;
drop table if exists public.revenue_promotions;
drop table if exists public.gift_card_uses;
drop table if exists public.gift_cards;
drop table if exists public.loyalty_accounts;
alter table public.guests
  drop column if exists locale, drop column if exists country_code, drop column if exists acquisition_channel,
  drop column if exists birthday, drop column if exists allergies, drop column if exists sleeping_preferences,
  drop column if exists arrival_preferences, drop column if exists internal_notes, drop column if exists special_requests,
  drop column if exists preferred_property_id, drop column if exists preferred_experience_codes;
