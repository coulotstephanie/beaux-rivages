begin;
drop table if exists public.rate_distribution_connections;
drop table if exists public.pricing_change_log;
drop table if exists public.property_pricing_rules;
alter table public.promotions drop constraint if exists promotions_discount_check;
alter table public.promotions drop column if exists fixed_discount_cents;
alter table public.promotions alter column percentage drop default;
alter table public.promotions add constraint promotions_percentage_check check (percentage > 0 and percentage <= 100);
commit;
