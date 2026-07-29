-- Premium Back Office operational foundation.

create table public.security_deposits (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'authorized', 'captured', 'released', 'partially_captured', 'cancelled')),
  provider text,
  provider_reference text,
  authorized_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reservation_id)
);

create table public.housekeeping_tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  scheduled_for timestamptz not null,
  assignee text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'completed', 'verified')),
  checklist jsonb not null default '[]',
  notes text,
  completed_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.maintenance_incidents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'assigned', 'in_progress', 'waiting', 'resolved', 'closed')),
  assignee text,
  cost_cents integer not null default 0 check (cost_cents >= 0),
  photo_paths text[] not null default '{}',
  due_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.concierge_requests (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  kind text not null,
  title text not null,
  details text,
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  scheduled_for timestamptz,
  is_surprise boolean not null default false,
  internal_only_details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.back_office_notifications (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('payment', 'contract', 'arrival', 'departure', 'message', 'maintenance', 'housekeeping', 'concierge', 'system')),
  title text not null,
  body text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  entity_type text,
  entity_id text,
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reservation_notes (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  category text not null default 'general' check (category in ('general', 'arrival', 'departure', 'payment', 'concierge', 'incident')),
  content text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index housekeeping_schedule_idx on public.housekeeping_tasks (scheduled_for, status);
create index maintenance_property_status_idx on public.maintenance_incidents (property_id, status, priority);
create index concierge_reservation_status_idx on public.concierge_requests (reservation_id, status);
create index notifications_unread_idx on public.back_office_notifications (created_at desc) where read_at is null and dismissed_at is null;
create index reservation_notes_reservation_idx on public.reservation_notes (reservation_id, created_at desc);

alter table public.security_deposits enable row level security;
alter table public.housekeeping_tasks enable row level security;
alter table public.maintenance_incidents enable row level security;
alter table public.concierge_requests enable row level security;
alter table public.back_office_notifications enable row level security;
alter table public.reservation_notes enable row level security;

do $$
declare table_name text;
begin
  foreach table_name in array array['security_deposits','housekeeping_tasks','maintenance_incidents','concierge_requests','back_office_notifications','reservation_notes']
  loop
    execute format('create policy "staff read %1$s" on public.%1$I for select to authenticated using (public.current_app_role() is not null)', table_name);
    execute format('create policy "staff manage %1$s" on public.%1$I for all to authenticated using (public.current_app_role() in (''admin'', ''concierge'')) with check (public.current_app_role() in (''admin'', ''concierge''))', table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated, service_role', table_name);
  end loop;
end $$;

create trigger security_deposits_updated_at before update on public.security_deposits for each row execute function public.set_updated_at();
create trigger housekeeping_tasks_updated_at before update on public.housekeeping_tasks for each row execute function public.set_updated_at();
create trigger maintenance_incidents_updated_at before update on public.maintenance_incidents for each row execute function public.set_updated_at();
create trigger concierge_requests_updated_at before update on public.concierge_requests for each row execute function public.set_updated_at();
create trigger reservation_notes_updated_at before update on public.reservation_notes for each row execute function public.set_updated_at();

-- Seed one reusable checklist per house for the next operational cycle.
insert into public.housekeeping_tasks (property_id, scheduled_for, status, checklist, notes)
select id, now() + interval '7 days', 'todo',
  case slug
    when 'villa-raie-manta' then '[{"id":"kitchen","label":"Cuisine","done":false},{"id":"bedrooms","label":"Chambres","done":false},{"id":"bathroom","label":"Salle de bain","done":false},{"id":"terrace","label":"Terrasse","done":false},{"id":"barbecue","label":"Barbecue","done":false},{"id":"water","label":"Eau au frais","done":false},{"id":"gift","label":"Cadeau","done":false},{"id":"qr","label":"QR Code","done":false},{"id":"wifi","label":"Contrôle Wi-Fi","done":false},{"id":"photos","label":"Photos","done":false}]'::jsonb
    when 'chai-des-tortues' then '[{"id":"kitchen","label":"Cuisine","done":false},{"id":"bedrooms","label":"Chambres","done":false},{"id":"bathrooms","label":"Salles de bain","done":false},{"id":"courtyard","label":"Cour intérieure","done":false},{"id":"linen","label":"Linge","done":false},{"id":"water","label":"Eau au frais","done":false},{"id":"gift","label":"Cadeau","done":false},{"id":"qr","label":"QR Code","done":false},{"id":"wifi","label":"Contrôle Wi-Fi","done":false},{"id":"photos","label":"Photos","done":false}]'::jsonb
    else '[{"id":"kitchen","label":"Cuisine","done":false},{"id":"bedrooms","label":"Chambres","done":false},{"id":"bathroom","label":"Salle de bain","done":false},{"id":"terrace","label":"Terrasse","done":false},{"id":"residence","label":"Parties communes","done":false},{"id":"water","label":"Eau au frais","done":false},{"id":"gift","label":"Cadeau","done":false},{"id":"qr","label":"QR Code","done":false},{"id":"wifi","label":"Contrôle Wi-Fi","done":false},{"id":"photos","label":"Photos","done":false}]'::jsonb
  end,
  'Checklist modèle créée automatiquement'
from public.properties
where slug in ('chai-des-tortues','villa-raie-manta','nid-d-ete')
and not exists (select 1 from public.housekeeping_tasks);
