begin;

create table public.channel_pricing_settings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  channel text not null check (channel in ('airbnb','booking')),
  mode text not null default 'current' check (mode in ('previous','current')),
  effective_from date not null default current_date,
  commission_percentage numeric(6,3) not null default 0 check (commission_percentage between 0 and 100),
  commission_applies_to_cleaning boolean not null default true,
  markup_strategy text not null default 'none' check (markup_strategy in ('none','percentage','fixed','net-parity')),
  markup_value numeric(10,2) not null default 0,
  enabled boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (property_id, channel, mode)
);

create table public.channel_rate_overrides (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  channel text not null check (channel in ('airbnb','booking')),
  stay_date date not null,
  nightly_rate_cents integer not null check (nightly_rate_cents >= 0),
  active boolean not null default true,
  reason text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (property_id, channel, stay_date)
);

create table public.booking_channel_promotions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('genius-1','genius-2','genius-3','mobile','early-booking','last-minute','temporary')),
  enabled boolean not null default false,
  percentage numeric(6,3) not null check (percentage between 0 and 100),
  begins_on date,
  ends_on date,
  stackable boolean not null default false,
  priority integer not null default 100,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  check (ends_on is null or begins_on is null or ends_on >= begins_on)
);

create index channel_rate_overrides_lookup_idx on public.channel_rate_overrides(property_id, stay_date, channel) where active;
create index booking_channel_promotions_lookup_idx on public.booking_channel_promotions(property_id, enabled, begins_on, ends_on);

alter table public.channel_pricing_settings enable row level security;
alter table public.channel_rate_overrides enable row level security;
alter table public.booking_channel_promotions enable row level security;

create policy "staff read channel pricing settings" on public.channel_pricing_settings for select to authenticated using (public.current_app_role() is not null);
create policy "admins manage channel pricing settings" on public.channel_pricing_settings for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff read channel rate overrides" on public.channel_rate_overrides for select to authenticated using (public.current_app_role() is not null);
create policy "admins manage channel rate overrides" on public.channel_rate_overrides for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff read booking channel promotions" on public.booking_channel_promotions for select to authenticated using (public.current_app_role() is not null);
create policy "admins manage booking channel promotions" on public.booking_channel_promotions for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

grant select,insert,update,delete on public.channel_pricing_settings, public.channel_rate_overrides, public.booking_channel_promotions to authenticated,service_role;
grant select,insert,update,delete on public.rate_overrides, public.rate_guardrails, public.property_pricing_rules, public.financial_settings, public.tourist_tax_settings, public.pricing_change_log to authenticated,service_role;

insert into public.channel_pricing_settings(property_id,channel,mode,effective_from,commission_percentage,markup_strategy,markup_value)
select id,'airbnb','previous','2026-01-01',0,'none',0 from public.properties
on conflict(property_id,channel,mode) do nothing;
insert into public.channel_pricing_settings(property_id,channel,mode,effective_from,commission_percentage,markup_strategy,markup_value)
select id,'airbnb','current','2026-10-13',18.6,'net-parity',0 from public.properties
on conflict(property_id,channel,mode) do nothing;
insert into public.channel_pricing_settings(property_id,channel,mode,effective_from,commission_percentage,markup_strategy,markup_value)
select id,'booking','current','2026-01-01',0,'none',0 from public.properties
on conflict(property_id,channel,mode) do nothing;

insert into public.booking_channel_promotions(property_id,name,kind,enabled,percentage,stackable,priority)
select property.id, promotion.name, promotion.kind, false, promotion.percentage, false, promotion.priority
from public.properties property
cross join (values
  ('Genius 1','genius-1',10,300),('Genius 2','genius-2',15,290),('Genius 3','genius-3',20,280),
  ('Remise mobile','mobile',10,200),('Réservation anticipée','early-booking',10,150),
  ('Dernière minute','last-minute',10,140),('Promotion temporaire','temporary',10,100)
) as promotion(name,kind,percentage,priority)
where not exists (select 1 from public.booking_channel_promotions existing where existing.property_id=property.id and existing.kind=promotion.kind);

-- Existing public rates and cleaning fees deliberately remain untouched.
-- They will only change through an explicit, validated Beaux Rivages V2 import.

comment on table public.channel_pricing_settings is 'Configuration privée des calculs par canal; aucune connexion plateforme.';
comment on table public.channel_rate_overrides is 'Exception privée et supprimable par date/canal; le tarif Beaux Rivages reste maître.';
comment on table public.booking_channel_promotions is 'Structure Booking privée, intégralement désactivée avant validation Extranet.';

commit;
