begin;

alter table public.promotions drop constraint if exists promotions_percentage_check;
alter table public.promotions alter column percentage set default 0;
alter table public.promotions add column fixed_discount_cents integer
  check (fixed_discount_cents is null or fixed_discount_cents > 0);
alter table public.promotions add constraint promotions_discount_check
  check ((percentage > 0 and percentage <= 100 and fixed_discount_cents is null)
    or (percentage = 0 and fixed_discount_cents > 0));

create table public.property_pricing_rules (
  property_id uuid primary key references public.properties(id) on delete cascade,
  allowed_arrival_weekdays smallint[] not null default array[1,2,3,4,5,6,7]::smallint[],
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  check (allowed_arrival_weekdays <@ array[1,2,3,4,5,6,7]::smallint[]),
  check (cardinality(allowed_arrival_weekdays) > 0)
);

create table public.pricing_change_log (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  entity_type text not null check (entity_type in ('rate_override','season','promotion','option','pricing_rule','import')),
  entity_id uuid,
  action text not null check (action in ('create','update','delete','restore','import','copy')),
  previous_value jsonb,
  new_value jsonb,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index pricing_change_log_property_time_idx
  on public.pricing_change_log(property_id, changed_at desc);

create table public.rate_distribution_connections (
  property_id uuid not null references public.properties(id) on delete cascade,
  provider text not null check (provider in ('airbnb','booking')),
  status text not null default 'not_connected'
    check (status in ('not_connected','connected','available')),
  last_synchronization_at timestamptz,
  automatic_push_enabled boolean not null default false
    check (automatic_push_enabled = false),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key(property_id, provider)
);

insert into public.property_pricing_rules(property_id)
select id from public.properties on conflict do nothing;

insert into public.rate_distribution_connections(property_id, provider)
select property.id, provider.name
from public.properties property
cross join (values ('airbnb'), ('booking')) provider(name)
on conflict do nothing;

alter table public.property_pricing_rules enable row level security;
alter table public.pricing_change_log enable row level security;
alter table public.rate_distribution_connections enable row level security;

create policy "public reads pricing rules" on public.property_pricing_rules
  for select to public using (true);
create policy "staff read pricing history" on public.pricing_change_log
  for select to authenticated using (public.current_app_role() is not null);
create policy "admins manage pricing rules" on public.property_pricing_rules
  for all to authenticated using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');
create policy "admins write pricing history" on public.pricing_change_log
  for insert to authenticated with check (public.current_app_role() = 'admin');
create policy "staff read distribution status" on public.rate_distribution_connections
  for select to authenticated using (public.current_app_role() is not null);
create policy "admins manage distribution status" on public.rate_distribution_connections
  for all to authenticated using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin' and automatic_push_enabled = false);

create trigger property_pricing_rules_updated_at before update on public.property_pricing_rules
for each row execute function public.set_updated_at();
create trigger rate_distribution_connections_updated_at before update on public.rate_distribution_connections
for each row execute function public.set_updated_at();

comment on table public.property_pricing_rules is
  'Single-source booking rules consumed by the Beaux Rivages pricing engine.';
comment on table public.pricing_change_log is
  'Immutable audit trail for every pricing-center mutation.';
comment on table public.rate_distribution_connections is
  'Future official API or channel-manager connectors. Automatic price push is intentionally disabled.';

commit;
