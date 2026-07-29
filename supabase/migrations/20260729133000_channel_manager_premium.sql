-- Beaux Rivages Channel Manager: provider mappings, replayable jobs and conflict resolution.

create table public.channel_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('airbnb','booking','abritel','google_vacation_rentals','holidu','expedia','hometogo')),
  name text not null,
  mode text not null default 'ical' check (mode in ('ical','api')),
  status text not null default 'pending' check (status in ('pending','connected','degraded','disabled','error')),
  capabilities text[] not null default '{availability}',
  credentials_reference text,
  last_checked_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, name)
);

create table public.channel_listing_mappings (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.channel_connections(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  external_listing_id text not null,
  external_listing_name text,
  status text not null default 'active' check (status in ('active','paused','error')),
  sync_prices boolean not null default false,
  sync_availability boolean not null default true,
  sync_reservations boolean not null default true,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (connection_id, property_id),
  unique (connection_id, external_listing_id)
);

create table public.channel_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references public.channel_connections(id) on delete set null,
  mapping_id uuid references public.channel_listing_mappings(id) on delete set null,
  direction text not null check (direction in ('import','export')),
  resource text not null check (resource in ('availability','reservation','rates','guest','payment','full')),
  status text not null default 'queued' check (status in ('queued','running','success','partial','failed','cancelled','rolled_back')),
  idempotency_key text not null unique,
  attempt integer not null default 0,
  payload jsonb not null default '{}',
  result jsonb not null default '{}',
  error_code text,
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  rollback_of uuid references public.channel_sync_jobs(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.channel_conflicts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  external_reference text,
  provider text not null,
  stay_range daterange not null,
  conflict_type text not null check (conflict_type in ('double_booking','date_mismatch','guest_mismatch','price_mismatch','status_mismatch')),
  severity text not null default 'high' check (severity in ('low','normal','high','critical')),
  status text not null default 'open' check (status in ('open','investigating','resolved','ignored')),
  details jsonb not null default '{}',
  proposed_resolution text,
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.channel_audit_logs (
  id uuid primary key default gen_random_uuid(),
  provider text,
  action text not null,
  entity_type text not null,
  entity_id text,
  job_id uuid references public.channel_sync_jobs(id) on delete set null,
  before_data jsonb,
  after_data jsonb,
  reversible boolean not null default false,
  actor text not null default 'system',
  created_at timestamptz not null default now()
);

create index channel_jobs_status_idx on public.channel_sync_jobs (status, created_at desc);
create index channel_conflicts_open_idx on public.channel_conflicts (status, severity, created_at desc);
create index channel_conflicts_range_idx on public.channel_conflicts using gist (property_id, stay_range);
create index channel_logs_created_idx on public.channel_audit_logs (created_at desc);

alter table public.channel_connections enable row level security;
alter table public.channel_listing_mappings enable row level security;
alter table public.channel_sync_jobs enable row level security;
alter table public.channel_conflicts enable row level security;
alter table public.channel_audit_logs enable row level security;

do $$
declare relation text;
begin
  foreach relation in array array['channel_connections','channel_listing_mappings','channel_sync_jobs','channel_conflicts','channel_audit_logs']
  loop
    execute format('create policy "staff read %1$s" on public.%1$I for select to authenticated using (public.current_app_role() is not null)', relation);
    execute format('create policy "admins manage %1$s" on public.%1$I for all to authenticated using (public.current_app_role() = ''admin'') with check (public.current_app_role() = ''admin'')', relation);
    execute format('grant select, insert, update, delete on public.%I to authenticated, service_role', relation);
  end loop;
end $$;

create trigger channel_connections_updated_at before update on public.channel_connections for each row execute function public.set_updated_at();
create trigger channel_listing_mappings_updated_at before update on public.channel_listing_mappings for each row execute function public.set_updated_at();
create trigger channel_conflicts_updated_at before update on public.channel_conflicts for each row execute function public.set_updated_at();

insert into public.channel_connections (provider, name, mode, status, capabilities)
values
  ('airbnb','Airbnb Beaux Rivages','ical','pending','{availability,reservation}'),
  ('booking','Booking.com Beaux Rivages','ical','pending','{availability,reservation}'),
  ('abritel','Abritel / Vrbo Beaux Rivages','ical','pending','{availability,reservation}')
on conflict (provider, name) do nothing;

insert into public.channel_listing_mappings (connection_id, property_id, external_listing_id, external_listing_name)
select connection.id, property.id, concat('pending-', property.slug), concat(property.name, ' · mapping à compléter')
from public.channel_connections connection cross join public.properties property
where connection.provider in ('airbnb','booking','abritel')
on conflict (connection_id, property_id) do nothing;
