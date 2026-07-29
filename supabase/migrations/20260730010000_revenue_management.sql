begin;

create table public.rate_guardrails (
  property_id uuid primary key references public.properties(id) on delete cascade,
  minimum_rate_cents integer not null check (minimum_rate_cents > 0),
  maximum_rate_cents integer not null check (maximum_rate_cents >= minimum_rate_cents),
  occupancy_pricing_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table public.rate_overrides (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null check (length(name) between 2 and 160),
  kind text not null check (kind in ('manual','weekend','school_holiday','public_holiday','event')),
  begins_on date not null,
  ends_on date not null,
  stay_range daterange generated always as (daterange(begins_on, ends_on + 1, '[)')) stored,
  nightly_rate_cents integer not null check (nightly_rate_cents > 0),
  minimum_nights smallint check (minimum_nights is null or minimum_nights > 0),
  priority smallint not null default 200,
  enabled boolean not null default true,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  check (ends_on >= begins_on)
);

create index rate_overrides_lookup_idx on public.rate_overrides
  (property_id, begins_on, ends_on, priority desc) where enabled;
create index rate_overrides_range_gist on public.rate_overrides using gist (property_id, stay_range);

alter table public.rate_guardrails enable row level security;
alter table public.rate_overrides enable row level security;
create policy "public reads rate guardrails" on public.rate_guardrails for select to public using (true);
create policy "public reads enabled rate overrides" on public.rate_overrides for select to public using (enabled);
create policy "admins manage rate guardrails" on public.rate_guardrails for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admins manage rate overrides" on public.rate_overrides for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

create trigger rate_guardrails_updated_at before update on public.rate_guardrails
for each row execute function public.set_updated_at();
create trigger rate_overrides_updated_at before update on public.rate_overrides
for each row execute function public.set_updated_at();

create or replace function public.enforce_rate_guardrails()
returns trigger language plpgsql set search_path = public as $$
declare bounds record;
begin
  select * into bounds from public.rate_guardrails where property_id = new.property_id;
  if bounds is not null and (
    new.nightly_rate_cents < bounds.minimum_rate_cents or
    new.nightly_rate_cents > bounds.maximum_rate_cents
  ) then
    raise exception 'RATE_OUTSIDE_GUARDRAILS' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger enforce_rate_override_guardrails before insert or update on public.rate_overrides
for each row execute function public.enforce_rate_guardrails();

insert into public.rate_guardrails(property_id,minimum_rate_cents,maximum_rate_cents)
select property.id,
  greatest(1000, min(rate.nightly_rate_cents) * 60 / 100),
  max(rate.nightly_rate_cents) * 200 / 100
from public.properties property join public.rates rate on rate.property_id = property.id
group by property.id
on conflict (property_id) do nothing;

comment on table public.rate_overrides is
  'Auditable calendar price overrides for manual periods, holidays and local events.';
comment on column public.rate_guardrails.occupancy_pricing_enabled is
  'Safety switch reserved for a future occupancy-based recommendation engine; disabled by default.';

commit;
