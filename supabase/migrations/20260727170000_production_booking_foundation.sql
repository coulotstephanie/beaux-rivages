begin;

create extension if not exists btree_gist with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('admin', 'concierge', 'read_only');
create type public.reservation_status as enum (
  'draft', 'pending_payment', 'requested', 'confirmed', 'cancelled', 'completed', 'declined'
);
create type public.payment_status as enum (
  'pending', 'requires_action', 'authorized', 'paid', 'failed', 'cancelled', 'partially_refunded', 'refunded'
);
create type public.payment_kind as enum ('deposit', 'balance', 'full', 'refund');
create type public.contract_status as enum ('draft', 'generated', 'sent', 'viewed', 'signed', 'declined', 'expired');
create type public.message_status as enum ('queued', 'sent', 'delivered', 'failed', 'bounced', 'opened');
create type public.occupancy_source as enum ('reservation', 'airbnb', 'booking', 'abritel', 'google', 'manual', 'channel_manager');

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  address_line1 text,
  postal_code text,
  city text,
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  country_code char(2) not null default 'FR',
  capacity_adults smallint not null check (capacity_adults > 0),
  capacity_children smallint not null default 0 check (capacity_children >= 0),
  pets_allowed boolean not null default false,
  status text not null default 'active' check (status in ('draft', 'active', 'inactive', 'maintenance')),
  active boolean generated always as (status = 'active') stored,
  timezone text not null default 'Europe/Paris',
  currency char(3) not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.app_user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  first_name text not null check (length(first_name) between 1 and 100),
  last_name text not null check (length(last_name) between 1 and 100),
  email text not null check (email = lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text,
  address_line1 text,
  address_line2 text,
  postal_code text,
  city text,
  country_code char(2) default 'FR',
  locale text not null default 'fr',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('low', 'mid', 'high', 'school_holiday', 'public_holiday', 'custom')),
  begins_on date not null,
  ends_on date not null,
  date_range daterange generated always as (daterange(begins_on, ends_on + 1, '[)')) stored,
  priority smallint not null default 100,
  minimum_nights smallint check (minimum_nights > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on >= begins_on)
);

create table public.rates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  season_id uuid references public.seasons(id) on delete cascade,
  name text not null,
  date_range daterange,
  weekdays smallint[] not null default array[0,1,2,3,4,5,6]::smallint[],
  nightly_rate_cents integer not null check (nightly_rate_cents >= 0),
  minimum_nights smallint check (minimum_nights > 0),
  maximum_nights smallint check (maximum_nights is null or maximum_nights > 0),
  cleaning_fee_cents integer not null default 0 check (cleaning_fee_cents >= 0),
  tourist_tax_mode text not null default 'fixed' check (tourist_tax_mode in ('fixed', 'percentage', 'disabled')),
  tourist_tax_value numeric(8,2) not null default 0 check (tourist_tax_value >= 0),
  security_deposit_cents integer not null default 0 check (security_deposit_cents >= 0),
  priority smallint not null default 100,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (date_range is null or not isempty(date_range)),
  check (weekdays <@ array[0,1,2,3,4,5,6]::smallint[])
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  code text,
  name text not null,
  kind text not null check (kind in ('long_stay', 'last_minute', 'early_booking', 'code', 'seasonal')),
  percentage numeric(5,2) not null check (percentage > 0 and percentage <= 100),
  valid_range daterange,
  minimum_nights smallint,
  minimum_lead_days smallint,
  maximum_lead_days smallint,
  enabled boolean not null default true,
  rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (code is null or code = upper(code)),
  check (valid_range is null or not isempty(valid_range))
);
create unique index promotions_unique_code on public.promotions (upper(code)) where code is not null;

create table public.options (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  description text,
  pricing_mode text not null default 'per_stay' check (pricing_mode in ('per_stay', 'per_night', 'per_guest', 'per_pet')),
  default_price_cents integer not null default 0 check (default_price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_options (
  property_id uuid not null references public.properties(id) on delete cascade,
  option_id uuid not null references public.options(id) on delete cascade,
  price_cents integer not null check (price_cents >= 0),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (property_id, option_id)
);

create table public.property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  kind text not null check (kind in ('photo', 'video', 'virtual_tour', 'document')),
  storage_bucket text,
  storage_path text,
  external_url text,
  title text,
  category text,
  alt_text text,
  credits text,
  licence text,
  source_url text,
  display_order integer not null default 0,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  duration_seconds numeric(10,2) check (duration_seconds is null or duration_seconds >= 0),
  metadata jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(storage_path, external_url) = 1),
  check (storage_path is null or storage_bucket is not null)
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  property_id uuid not null references public.properties(id),
  status public.reservation_status not null default 'draft',
  channel text not null default 'direct' check (channel in ('direct', 'airbnb', 'booking', 'abritel', 'manual', 'channel_manager')),
  external_reference text,
  arrival date not null,
  departure date not null,
  adults smallint not null check (adults > 0),
  children smallint not null default 0 check (children >= 0),
  babies smallint not null default 0 check (babies >= 0),
  pets smallint not null default 0 check (pets >= 0),
  currency char(3) not null default 'EUR',
  nights_total_cents integer not null default 0 check (nights_total_cents >= 0),
  options_total_cents integer not null default 0 check (options_total_cents >= 0),
  cleaning_fee_cents integer not null default 0 check (cleaning_fee_cents >= 0),
  tourist_tax_cents integer not null default 0 check (tourist_tax_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  deposit_due_cents integer not null default 0 check (deposit_due_cents >= 0),
  balance_due_cents integer not null default 0 check (balance_due_cents >= 0),
  quote_snapshot jsonb not null default '{}'::jsonb,
  idempotency_key text unique,
  expires_at timestamptz,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (departure > arrival),
  check (deposit_due_cents + balance_due_cents = total_cents)
);
create unique index reservations_external_reference_unique
  on public.reservations (channel, external_reference) where external_reference is not null;

create table public.reservation_guests (
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  guest_id uuid not null references public.guests(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (reservation_id, guest_id)
);
create unique index one_primary_guest_per_reservation
  on public.reservation_guests (reservation_id) where is_primary;

create table public.reservation_options (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  option_id uuid references public.options(id) on delete set null,
  option_code text not null,
  label text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_cents integer generated always as (quantity * unit_price_cents) stored,
  created_at timestamptz not null default now(),
  unique (reservation_id, option_code)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  number text not null unique,
  kind text not null check (kind in ('deposit', 'balance', 'full', 'credit_note')),
  status text not null default 'draft' check (status in ('draft', 'issued', 'paid', 'void')),
  currency char(3) not null default 'EUR',
  total_cents integer not null check (total_cents >= 0),
  issued_at timestamptz,
  due_at timestamptz,
  pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  invoice_id uuid references public.invoices(id) on delete set null,
  provider text not null default 'stripe',
  provider_payment_id text,
  idempotency_key text not null unique,
  kind public.payment_kind not null,
  status public.payment_status not null default 'pending',
  currency char(3) not null default 'EUR',
  amount_cents integer not null check (amount_cents > 0),
  refunded_cents integer not null default 0 check (refunded_cents >= 0 and refunded_cents <= amount_cents),
  failure_code text,
  failure_message text,
  provider_payload jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index payments_provider_id_unique
  on public.payments (provider, provider_payment_id) where provider_payment_id is not null;

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  number text not null unique,
  version integer not null default 1 check (version > 0),
  status public.contract_status not null default 'draft',
  html_path text,
  pdf_path text,
  content_hash text,
  generated_at timestamptz,
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reservation_id, version)
);

create table public.signatures (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  provider text not null,
  provider_request_id text,
  status public.contract_status not null default 'draft',
  signed_document_path text,
  provider_payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index signatures_provider_id_unique
  on public.signatures (provider, provider_request_id) where provider_request_id is not null;

create table public.transactional_emails (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.reservations(id) on delete set null,
  provider text not null,
  template_key text not null,
  recipient_hash text not null,
  provider_message_id text,
  status public.message_status not null default 'queued',
  attempts smallint not null default 0 check (attempts >= 0),
  last_error text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index emails_provider_id_unique
  on public.transactional_emails (provider, provider_message_id) where provider_message_id is not null;

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references public.guests(id) on delete set null,
  email_hash text,
  purpose text not null check (purpose in ('booking', 'newsletter', 'analytics', 'advertising')),
  status text not null check (status in ('granted', 'withdrawn', 'pending')),
  policy_version text not null,
  source text not null,
  proof jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  check (guest_id is not null or email_hash is not null)
);

create table public.calendar_sources (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  provider public.occupancy_source not null,
  name text not null,
  secret_env_name text not null,
  ical_url_ciphertext bytea,
  enabled boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'healthy', 'warning', 'error', 'disabled')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, provider, name)
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.calendar_sources(id) on delete cascade,
  external_uid text not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'tentative', 'cancelled')),
  arrival date not null,
  departure date not null,
  summary text,
  payload_hash text,
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (departure > arrival),
  unique (source_id, external_uid)
);

create table public.availability (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  day date not null,
  status text not null check (status in ('available', 'occupied', 'arrival', 'departure', 'maintenance', 'hold')),
  source public.occupancy_source,
  reservation_id uuid references public.reservations(id) on delete cascade,
  calendar_event_id uuid references public.calendar_events(id) on delete cascade,
  updated_at timestamptz not null default now(),
  unique (property_id, day)
);

create table public.occupancy_blocks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  stay_range daterange not null,
  source public.occupancy_source not null,
  reservation_id uuid unique references public.reservations(id) on delete cascade,
  calendar_event_id uuid unique references public.calendar_events(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  check (not isempty(stay_range)),
  check (num_nonnulls(reservation_id, calendar_event_id) <= 1),
  exclude using gist (property_id with =, stay_range with &&) where (source = 'reservation')
);

create table public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.calendar_sources(id) on delete set null,
  status text not null check (status in ('running', 'success', 'partial', 'failed')),
  imported_count integer not null default 0,
  error_count integer not null default 0,
  error_details jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_role public.app_role,
  action text not null,
  entity_type text not null,
  entity_id text,
  request_id text,
  ip_hash text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create sequence public.reservation_reference_seq;

create index reservations_property_dates_idx on public.reservations (property_id, arrival, departure);
create index reservations_status_created_idx on public.reservations (status, created_at desc);
create index reservations_channel_idx on public.reservations (channel, created_at desc);
create index guests_email_idx on public.guests (email);
create index payments_reservation_idx on public.payments (reservation_id, created_at desc);
create index contracts_reservation_idx on public.contracts (reservation_id, version desc);
create index emails_reservation_idx on public.transactional_emails (reservation_id, created_at desc);
create index calendar_events_property_dates_idx on public.calendar_events (property_id, arrival, departure);
create index occupancy_blocks_property_range_idx on public.occupancy_blocks using gist (property_id, stay_range);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, occurred_at desc);
create index audit_logs_occurred_idx on public.audit_logs (occurred_at desc);
create index rates_lookup_idx on public.rates (property_id, enabled, priority);
create index seasons_property_range_idx on public.seasons using gist (property_id, date_range);
create index property_media_display_idx on public.property_media (property_id, category, display_order) where active;
create index availability_lookup_idx on public.availability (property_id, day, status);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.app_user_roles
  where user_id = auth.uid()
  order by case role when 'admin' then 1 when 'concierge' then 2 else 3 end
  limit 1;
$$;

create function public.sync_reservation_occupancy()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('pending_payment', 'requested', 'confirmed') then
    insert into public.occupancy_blocks (property_id, stay_range, source, reservation_id, note)
    values (new.property_id, daterange(new.arrival, new.departure, '[)'), 'reservation', new.id, new.reference)
    on conflict (reservation_id) do update
      set property_id = excluded.property_id,
          stay_range = excluded.stay_range,
          note = excluded.note;
  else
    delete from public.occupancy_blocks where reservation_id = new.id;
  end if;
  return new;
end;
$$;

create function public.sync_calendar_occupancy()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare source_provider public.occupancy_source;
begin
  if new.status = 'confirmed' then
    select provider into source_provider from public.calendar_sources where id = new.source_id;
    insert into public.occupancy_blocks (property_id, stay_range, source, calendar_event_id, note)
    values (new.property_id, daterange(new.arrival, new.departure, '[)'), source_provider, new.id, new.summary)
    on conflict (calendar_event_id) do update
      set property_id = excluded.property_id,
          stay_range = excluded.stay_range,
          source = excluded.source,
          note = excluded.note;
  else
    delete from public.occupancy_blocks where calendar_event_id = new.id;
  end if;
  return new;
end;
$$;

create function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_logs (actor_id, actor_role, action, entity_type, entity_id, before_data, after_data)
  values (
    auth.uid(),
    public.current_app_role(),
    lower(tg_op),
    tg_table_name,
    coalesce((case when tg_op = 'DELETE' then old.id else new.id end)::text, ''),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

create function public.generate_reservation_number()
returns text
language sql
volatile
set search_path = ''
as $$
  select 'BR-' || to_char(current_date, 'YYYY') || '-' ||
    lpad(nextval('public.reservation_reference_seq')::text, 6, '0');
$$;

create function public.is_property_available(
  requested_property_id uuid,
  requested_arrival date,
  requested_departure date,
  ignored_reservation_id uuid default null
)
returns boolean
language sql
stable
set search_path = ''
as $$
  select requested_departure > requested_arrival
    and not exists (
      select 1
      from public.occupancy_blocks block
      where block.property_id = requested_property_id
        and block.stay_range && daterange(requested_arrival, requested_departure, '[)')
        and (ignored_reservation_id is null or block.reservation_id is distinct from ignored_reservation_id)
    );
$$;

create function public.calculate_stay_price(
  requested_property_id uuid,
  requested_arrival date,
  requested_departure date
)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  stay_day date;
  selected_rate public.rates;
  nights_total integer := 0;
  cleaning_total integer := 0;
  security_deposit integer := 0;
  minimum_stay integer := 1;
  night_count integer := requested_departure - requested_arrival;
  breakdown jsonb := '[]'::jsonb;
begin
  if requested_departure <= requested_arrival then
    raise exception using errcode = '22023', message = 'Invalid stay dates';
  end if;

  for stay_day in select generate_series(requested_arrival, requested_departure - 1, interval '1 day')::date
  loop
    select rate.* into selected_rate
    from public.rates rate
    left join public.seasons season on season.id = rate.season_id
    where rate.property_id = requested_property_id
      and rate.enabled
      and (rate.date_range is null or rate.date_range @> stay_day)
      and (season.id is null or season.date_range @> stay_day)
      and extract(dow from stay_day)::smallint = any(rate.weekdays)
    order by rate.priority desc, season.priority desc nulls last, rate.created_at desc
    limit 1;

    if not found then
      raise exception using errcode = 'P0001', message = 'Missing rate for ' || stay_day::text;
    end if;

    nights_total := nights_total + selected_rate.nightly_rate_cents;
    cleaning_total := greatest(cleaning_total, selected_rate.cleaning_fee_cents);
    security_deposit := greatest(security_deposit, selected_rate.security_deposit_cents);
    minimum_stay := greatest(minimum_stay, coalesce(selected_rate.minimum_nights, 1));
    breakdown := breakdown || jsonb_build_array(jsonb_build_object(
      'date', stay_day,
      'rateId', selected_rate.id,
      'nightlyRateCents', selected_rate.nightly_rate_cents
    ));
  end loop;

  if night_count < minimum_stay then
    raise exception using errcode = '22023', message = 'Minimum stay is ' || minimum_stay || ' nights';
  end if;

  return jsonb_build_object(
    'nights', night_count,
    'nightsTotalCents', nights_total,
    'cleaningFeeCents', cleaning_total,
    'securityDepositCents', security_deposit,
    'minimumNights', minimum_stay,
    'breakdown', breakdown
  );
end;
$$;

create function public.refresh_availability(
  requested_property_id uuid,
  begins_on date,
  ends_on date
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_day date;
  matching_block public.occupancy_blocks;
  calculated_status text;
begin
  if ends_on < begins_on then return; end if;
  for current_day in select generate_series(begins_on, ends_on, interval '1 day')::date
  loop
    select block.* into matching_block
    from public.occupancy_blocks block
    where block.property_id = requested_property_id
      and (block.stay_range @> current_day or upper(block.stay_range) = current_day)
    order by lower(block.stay_range)
    limit 1;

    if not found then
      calculated_status := 'available';
      matching_block := null;
    elsif lower(matching_block.stay_range) = current_day then
      calculated_status := 'arrival';
    elsif upper(matching_block.stay_range) = current_day then
      calculated_status := 'departure';
    else
      calculated_status := 'occupied';
    end if;

    insert into public.availability (
      property_id, day, status, source, reservation_id, calendar_event_id, updated_at
    ) values (
      requested_property_id, current_day, calculated_status,
      matching_block.source, matching_block.reservation_id, matching_block.calendar_event_id, now()
    )
    on conflict (property_id, day) do update set
      status = excluded.status,
      source = excluded.source,
      reservation_id = excluded.reservation_id,
      calendar_event_id = excluded.calendar_event_id,
      updated_at = now();
  end loop;
end;
$$;

create function public.sync_availability_from_block()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_property uuid := coalesce(new.property_id, old.property_id);
  affected_range daterange := coalesce(new.stay_range, old.stay_range);
begin
  perform public.refresh_availability(
    affected_property,
    lower(affected_range),
    upper(affected_range)
  );
  return coalesce(new, old);
end;
$$;

create function public.guard_occupancy_conflicts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.property_id::text, 0));
  if exists (
    select 1
    from public.occupancy_blocks existing
    where existing.property_id = new.property_id
      and existing.stay_range && new.stay_range
      and existing.id is distinct from new.id
      and (new.source = 'reservation' or existing.source = 'reservation')
  ) then
    raise exception using
      errcode = '23P01',
      message = 'Property is not available for the requested dates';
  end if;
  return new;
end;
$$;

create function public.notify_sensitive_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_notify(
    'beaux_rivages_events',
    jsonb_build_object(
      'entity', tg_table_name,
      'action', lower(tg_op),
      'id', coalesce((case when tg_op = 'DELETE' then old.id else new.id end)::text, '')
    )::text
  );
  return coalesce(new, old);
end;
$$;

create function public.replace_calendar_events(
  requested_property_slug text,
  requested_provider public.occupancy_source,
  imported_events jsonb,
  synced_at timestamptz default now()
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  property_record public.properties;
  source_record public.calendar_sources;
  imported_event jsonb;
  imported_uids text[] := array[]::text[];
  imported_count integer := 0;
begin
  select * into property_record from public.properties where slug = requested_property_slug;
  if not found then raise exception using errcode = '22023', message = 'Unknown property'; end if;
  select * into source_record
  from public.calendar_sources
  where property_id = property_record.id and provider = requested_provider and enabled
  order by created_at
  limit 1;
  if not found then raise exception using errcode = '22023', message = 'Unknown calendar source'; end if;

  perform pg_advisory_xact_lock(hashtextextended(property_record.id::text, 0));
  for imported_event in select * from jsonb_array_elements(imported_events)
  loop
    imported_uids := array_append(imported_uids, imported_event->>'uid');
    insert into public.calendar_events (
      source_id, external_uid, property_id, status, arrival, departure, summary, payload_hash, imported_at
    ) values (
      source_record.id,
      imported_event->>'uid',
      property_record.id,
      coalesce(imported_event->>'status', 'confirmed'),
      (imported_event->>'arrival')::date,
      (imported_event->>'departure')::date,
      left(imported_event->>'summary', 200),
      encode(extensions.digest(imported_event::text, 'sha256'), 'hex'),
      synced_at
    )
    on conflict (source_id, external_uid) do update set
      status = excluded.status,
      arrival = excluded.arrival,
      departure = excluded.departure,
      summary = excluded.summary,
      payload_hash = excluded.payload_hash,
      imported_at = excluded.imported_at;
    imported_count := imported_count + 1;
  end loop;

  update public.calendar_events
  set status = 'cancelled', updated_at = synced_at
  where source_id = source_record.id
    and status <> 'cancelled'
    and not (external_uid = any(imported_uids));

  update public.calendar_sources
  set last_synced_at = synced_at, status = 'healthy'
  where id = source_record.id;
  return imported_count;
end;
$$;

create function public.create_direct_reservation(
  property_slug text,
  arrival_date date,
  departure_date date,
  guest jsonb,
  quote jsonb,
  selected_options jsonb default '[]'::jsonb,
  request_key text default null
)
returns public.reservations
language plpgsql
security definer
set search_path = ''
as $$
declare
  property_record public.properties;
  guest_id uuid;
  reservation_record public.reservations;
  reference_value text;
  item jsonb;
begin
  if arrival_date < current_date or departure_date <= arrival_date then
    raise exception using errcode = '22023', message = 'Invalid stay dates';
  end if;
  select * into property_record from public.properties where slug = property_slug and active;
  if not found then raise exception using errcode = '22023', message = 'Unknown property'; end if;
  if greatest(coalesce((quote->>'adults')::integer, 0), 0)
      + greatest(coalesce((quote->>'children')::integer, 0), 0) > property_record.capacity_adults then
    raise exception using errcode = '22023', message = 'Property capacity exceeded';
  end if;
  if coalesce((quote->>'pets')::integer, 0) > 0 and not property_record.pets_allowed then
    raise exception using errcode = '22023', message = 'Pets are not allowed for this property';
  end if;
  if request_key is not null then
    select * into reservation_record from public.reservations where idempotency_key = request_key;
    if found then return reservation_record; end if;
  end if;

  insert into public.guests (first_name, last_name, email, phone, address_line1, postal_code, city, country_code)
  values (
    trim(guest->>'firstName'), trim(guest->>'lastName'), lower(trim(guest->>'email')),
    nullif(trim(guest->>'phone'), ''), nullif(trim(guest->>'addressLine1'), ''),
    nullif(trim(guest->>'postalCode'), ''), nullif(trim(guest->>'city'), ''),
    coalesce(nullif(upper(trim(guest->>'countryCode')), ''), 'FR')
  )
  returning id into guest_id;

  reference_value := public.generate_reservation_number();

  insert into public.reservations (
    reference, property_id, status, arrival, departure, adults, children, babies, pets,
    nights_total_cents, options_total_cents, cleaning_fee_cents, tourist_tax_cents,
    discount_cents, total_cents, deposit_due_cents, balance_due_cents,
    quote_snapshot, idempotency_key, expires_at
  ) values (
    reference_value, property_record.id, 'requested', arrival_date, departure_date,
    greatest((quote->>'adults')::smallint, 1), coalesce((quote->>'children')::smallint, 0),
    coalesce((quote->>'babies')::smallint, 0), coalesce((quote->>'pets')::smallint, 0),
    coalesce((quote->>'nightsTotalCents')::integer, 0),
    coalesce((quote->>'optionsTotalCents')::integer, 0),
    coalesce((quote->>'cleaningFeeCents')::integer, 0),
    coalesce((quote->>'touristTaxCents')::integer, 0),
    coalesce((quote->>'discountCents')::integer, 0),
    (quote->>'totalCents')::integer,
    coalesce((quote->>'depositDueCents')::integer, 0),
    coalesce((quote->>'balanceDueCents')::integer, (quote->>'totalCents')::integer),
    quote, request_key, now() + interval '30 minutes'
  ) returning * into reservation_record;

  insert into public.reservation_guests (reservation_id, guest_id, is_primary)
  values (reservation_record.id, guest_id, true);

  for item in select * from jsonb_array_elements(selected_options)
  loop
    insert into public.reservation_options (
      reservation_id, option_id, option_code, label, quantity, unit_price_cents
    )
    select reservation_record.id, o.id, o.code, coalesce(item->>'label', o.name),
      greatest(coalesce((item->>'quantity')::integer, 1), 1),
      coalesce((item->>'unitPriceCents')::integer, o.default_price_cents)
    from public.options o where o.code = item->>'code' and o.active;
  end loop;

  return reservation_record;
end;
$$;

revoke all on function public.create_direct_reservation(text, date, date, jsonb, jsonb, jsonb, text) from public, anon, authenticated;
grant execute on function public.create_direct_reservation(text, date, date, jsonb, jsonb, jsonb, text) to service_role;
revoke all on function public.replace_calendar_events(text, public.occupancy_source, jsonb, timestamptz) from public, anon, authenticated;
grant execute on function public.replace_calendar_events(text, public.occupancy_source, jsonb, timestamptz) to service_role;

create trigger reservations_updated_at before update on public.reservations
for each row execute function public.set_updated_at();
create trigger guests_updated_at before update on public.guests
for each row execute function public.set_updated_at();
create trigger properties_updated_at before update on public.properties
for each row execute function public.set_updated_at();
create trigger users_updated_at before update on public.users
for each row execute function public.set_updated_at();
create trigger rates_updated_at before update on public.rates
for each row execute function public.set_updated_at();
create trigger seasons_updated_at before update on public.seasons
for each row execute function public.set_updated_at();
create trigger payments_updated_at before update on public.payments
for each row execute function public.set_updated_at();
create trigger contracts_updated_at before update on public.contracts
for each row execute function public.set_updated_at();
create trigger signatures_updated_at before update on public.signatures
for each row execute function public.set_updated_at();
create trigger emails_updated_at before update on public.transactional_emails
for each row execute function public.set_updated_at();
create trigger calendar_sources_updated_at before update on public.calendar_sources
for each row execute function public.set_updated_at();
create trigger calendar_events_updated_at before update on public.calendar_events
for each row execute function public.set_updated_at();
create trigger invoices_updated_at before update on public.invoices
for each row execute function public.set_updated_at();
create trigger property_media_updated_at before update on public.property_media
for each row execute function public.set_updated_at();
create trigger property_options_updated_at before update on public.property_options
for each row execute function public.set_updated_at();

create trigger reservation_occupancy_after_write
after insert or update of property_id, arrival, departure, status on public.reservations
for each row execute function public.sync_reservation_occupancy();
create trigger calendar_occupancy_after_write
after insert or update of property_id, arrival, departure, status on public.calendar_events
for each row execute function public.sync_calendar_occupancy();
create trigger availability_after_block_write
after insert or update or delete on public.occupancy_blocks
for each row execute function public.sync_availability_from_block();
create trigger occupancy_conflict_before_write
before insert or update of property_id, stay_range, source on public.occupancy_blocks
for each row execute function public.guard_occupancy_conflicts();

create trigger audit_reservations after insert or update or delete on public.reservations
for each row execute function public.audit_row_change();
create trigger audit_payments after insert or update or delete on public.payments
for each row execute function public.audit_row_change();
create trigger audit_contracts after insert or update or delete on public.contracts
for each row execute function public.audit_row_change();
create trigger audit_rates after insert or update or delete on public.rates
for each row execute function public.audit_row_change();
create trigger audit_promotions after insert or update or delete on public.promotions
for each row execute function public.audit_row_change();
create trigger notify_reservations after insert or update or delete on public.reservations
for each row execute function public.notify_sensitive_change();
create trigger notify_payments after insert or update or delete on public.payments
for each row execute function public.notify_sensitive_change();
create trigger notify_contracts after insert or update or delete on public.contracts
for each row execute function public.notify_sensitive_change();

alter table public.properties enable row level security;
alter table public.users enable row level security;
alter table public.app_user_roles enable row level security;
alter table public.guests enable row level security;
alter table public.seasons enable row level security;
alter table public.rates enable row level security;
alter table public.promotions enable row level security;
alter table public.options enable row level security;
alter table public.property_options enable row level security;
alter table public.property_media enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_guests enable row level security;
alter table public.reservation_options enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.contracts enable row level security;
alter table public.signatures enable row level security;
alter table public.transactional_emails enable row level security;
alter table public.consents enable row level security;
alter table public.calendar_sources enable row level security;
alter table public.calendar_events enable row level security;
alter table public.availability enable row level security;
alter table public.occupancy_blocks enable row level security;
alter table public.sync_runs enable row level security;
alter table public.audit_logs enable row level security;

create policy "staff read properties" on public.properties for select to authenticated
using (public.current_app_role() is not null);
create policy "staff read reservations" on public.reservations for select to authenticated
using (public.current_app_role() is not null);
create policy "staff manage reservations" on public.reservations for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));
create policy "staff read guests" on public.guests for select to authenticated
using (public.current_app_role() is not null);
create policy "staff manage guests" on public.guests for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));
create policy "staff read operational data" on public.occupancy_blocks for select to authenticated
using (public.current_app_role() is not null);
create policy "staff read payments" on public.payments for select to authenticated
using (public.current_app_role() is not null);
create policy "staff read contracts" on public.contracts for select to authenticated
using (public.current_app_role() is not null);
create policy "staff read audit" on public.audit_logs for select to authenticated
using (public.current_app_role() = 'admin');
create policy "staff read own role" on public.app_user_roles for select to authenticated
using (user_id = auth.uid() or public.current_app_role() = 'admin');
create policy "users read own profile" on public.users for select to authenticated
using (id = auth.uid() or public.current_app_role() is not null);
create policy "admins manage users" on public.users for all to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');
create policy "traveler reads own guest record" on public.guests for select to authenticated
using (user_id = auth.uid());
create policy "traveler reads own reservations" on public.reservations for select to authenticated
using (
  exists (
    select 1
    from public.reservation_guests rg
    join public.guests guest on guest.id = rg.guest_id
    where rg.reservation_id = reservations.id and guest.user_id = auth.uid()
  )
);
create policy "staff read reservation guests" on public.reservation_guests for select to authenticated
using (public.current_app_role() is not null);
create policy "staff manage reservation guests" on public.reservation_guests for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));
create policy "traveler reads own reservation links" on public.reservation_guests for select to authenticated
using (
  exists (select 1 from public.guests guest where guest.id = guest_id and guest.user_id = auth.uid())
);
create policy "staff read reservation options" on public.reservation_options for select to authenticated
using (public.current_app_role() is not null);
create policy "staff manage reservation options" on public.reservation_options for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));
create policy "traveler reads own reservation options" on public.reservation_options for select to authenticated
using (
  exists (
    select 1 from public.reservation_guests rg
    join public.guests guest on guest.id = rg.guest_id
    where rg.reservation_id = reservation_options.reservation_id and guest.user_id = auth.uid()
  )
);

create policy "staff read seasons" on public.seasons for select to authenticated
using (public.current_app_role() is not null);
create policy "admins manage seasons" on public.seasons for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff read rates" on public.rates for select to authenticated
using (public.current_app_role() is not null);
create policy "admins manage rates" on public.rates for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff read promotions" on public.promotions for select to authenticated
using (public.current_app_role() is not null);
create policy "admins manage promotions" on public.promotions for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff read options" on public.options for select to authenticated
using (public.current_app_role() is not null);
create policy "admins manage options" on public.options for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff read property options" on public.property_options for select to authenticated
using (public.current_app_role() is not null);
create policy "admins manage property options" on public.property_options for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff read media" on public.property_media for select to authenticated
using (public.current_app_role() is not null);
create policy "admins manage media" on public.property_media for all to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

create policy "staff read invoices" on public.invoices for select to authenticated
using (public.current_app_role() is not null);
create policy "traveler reads own invoices" on public.invoices for select to authenticated
using (
  exists (
    select 1 from public.reservation_guests rg
    join public.guests guest on guest.id = rg.guest_id
    where rg.reservation_id = invoices.reservation_id and guest.user_id = auth.uid()
  )
);
create policy "traveler reads own payments" on public.payments for select to authenticated
using (
  exists (
    select 1 from public.reservation_guests rg
    join public.guests guest on guest.id = rg.guest_id
    where rg.reservation_id = payments.reservation_id and guest.user_id = auth.uid()
  )
);
create policy "traveler reads own contracts" on public.contracts for select to authenticated
using (
  exists (
    select 1 from public.reservation_guests rg
    join public.guests guest on guest.id = rg.guest_id
    where rg.reservation_id = contracts.reservation_id and guest.user_id = auth.uid()
  )
);
create policy "staff read signatures" on public.signatures for select to authenticated
using (public.current_app_role() is not null);
create policy "staff read messages" on public.transactional_emails for select to authenticated
using (public.current_app_role() is not null);
create policy "staff read consents" on public.consents for select to authenticated
using (public.current_app_role() is not null);

create policy "staff read calendar sources" on public.calendar_sources for select to authenticated
using (public.current_app_role() is not null);
create policy "staff manage calendar sources" on public.calendar_sources for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));
create policy "staff read calendar events" on public.calendar_events for select to authenticated
using (public.current_app_role() is not null);
create policy "staff manage calendar events" on public.calendar_events for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));
create policy "staff read availability" on public.availability for select to authenticated
using (public.current_app_role() is not null);
create policy "staff read sync runs" on public.sync_runs for select to authenticated
using (public.current_app_role() is not null);
create policy "staff manage sync runs" on public.sync_runs for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

insert into public.properties (slug, name, address_line1, postal_code, city, capacity_adults, capacity_children, pets_allowed)
values
  ('chai-des-tortues', 'Le Chai des Tortues', '165 rue de la Fontaine', '17940', 'Rivedoux-Plage', 6, 4, true),
  ('villa-raie-manta', 'Villa Raie Manta', null, '17000', 'La Rochelle', 6, 4, true),
  ('nid-d-ete', 'Le Nid d''Été', '355 route des Saumonards', '17190', 'Saint-Georges-d''Oléron', 6, 4, true);

insert into public.options (code, name, pricing_mode, default_price_cents)
values
  ('signature', 'Pack Signature Beaux Rivages', 'per_stay', 0),
  ('linen', 'Linge de maison', 'per_stay', 0),
  ('beach-towels', 'Serviettes de plage', 'per_stay', 0),
  ('robes', 'Peignoirs', 'per_guest', 0),
  ('slippers', 'Chaussons', 'per_guest', 0),
  ('personal-arrival', 'Arrivée personnalisée', 'per_stay', 0),
  ('early-checkin', 'Arrivée anticipée', 'per_stay', 0),
  ('late-checkout', 'Départ tardif', 'per_stay', 0),
  ('pet', 'Accueil animal', 'per_pet', 0),
  ('aperitif-basket', 'Panier apéritif', 'per_stay', 0),
  ('basket', 'Panier gourmand', 'per_stay', 0);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('contracts', 'contracts', false, 10485760, array['application/pdf', 'text/html']),
  ('signed-contracts', 'signed-contracts', false, 10485760, array['application/pdf']),
  ('photos', 'photos', false, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 15728640, array['application/pdf', 'text/html']),
  ('guestbook', 'guestbook', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
  ('invoices', 'invoices', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

create policy "staff read private storage"
on storage.objects for select to authenticated
using (
  bucket_id in ('contracts', 'signed-contracts', 'photos', 'avatars', 'documents', 'guestbook', 'invoices')
  and public.current_app_role() is not null
);
create policy "staff upload private storage"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('contracts', 'signed-contracts', 'photos', 'avatars', 'documents', 'guestbook', 'invoices')
  and public.current_app_role() in ('admin', 'concierge')
);
create policy "staff update private storage"
on storage.objects for update to authenticated
using (
  bucket_id in ('contracts', 'signed-contracts', 'photos', 'avatars', 'documents', 'guestbook', 'invoices')
  and public.current_app_role() in ('admin', 'concierge')
)
with check (
  bucket_id in ('contracts', 'signed-contracts', 'photos', 'avatars', 'documents', 'guestbook', 'invoices')
  and public.current_app_role() in ('admin', 'concierge')
);
create policy "admins delete private storage"
on storage.objects for delete to authenticated
using (
  bucket_id in ('contracts', 'signed-contracts', 'photos', 'avatars', 'documents', 'guestbook', 'invoices')
  and public.current_app_role() = 'admin'
);

commit;
