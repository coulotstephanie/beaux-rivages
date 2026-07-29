begin;

create table public.carnet_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null check (category in (
    'restaurant','producer','bakery','pastry','market','beach','activity','walk',
    'cycle_route','village','fort_boyard','tide','weather','emergency',
    'useful_number','host_tip','seasonal_event'
  )),
  destination text not null check (destination in ('ile_de_re','ile_oleron','la_rochelle','all')),
  title text not null check (length(title) between 2 and 180),
  summary text not null check (length(summary) between 2 and 500),
  body text not null default '',
  address text,
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  official_url text,
  google_maps_url text,
  phone text,
  image_path text,
  image_alt text,
  gallery_paths text[] not null default '{}',
  video_url text,
  opening_hours jsonb not null default '{}'::jsonb,
  opening_period text,
  recommendation_level smallint not null default 0 check (recommendation_level between 0 and 5),
  highlights text[] not null default '{}' check (highlights <@ array[
    'stephanie_favorite','bruno_favorite','must_see','family','rainy_day',
    'sunset','bike_accessible'
  ]::text[]),
  host_tip text,
  tags text[] not null default '{}',
  seasonal_rules jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  meta_title text check (meta_title is null or length(meta_title) <= 70),
  meta_description text check (meta_description is null or length(meta_description) <= 170),
  open_graph_image_path text,
  published_at timestamptz,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  check ((latitude is null) = (longitude is null)),
  check (status <> 'published' or published_at is not null)
);

create table public.carnet_favorites (
  guest_id uuid not null references public.guests(id) on delete cascade,
  entry_id uuid not null references public.carnet_entries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (guest_id, entry_id)
);

create table public.carnet_entry_versions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.carnet_entries(id) on delete restrict,
  version integer not null check (version > 0),
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  unique (entry_id, version)
);

create index carnet_entries_publication_idx on public.carnet_entries (status, destination, category, sort_order);
create index carnet_entries_search_idx on public.carnet_entries using gin (
  to_tsvector('french', title || ' ' || summary || ' ' || body || ' ' ||
    coalesce(address, '') || ' ' || coalesce(host_tip, '') || ' ' || array_to_string(tags, ' '))
);
create index carnet_entries_tags_idx on public.carnet_entries using gin (tags);
create index carnet_entries_highlights_idx on public.carnet_entries using gin (highlights);
create index carnet_favorites_guest_idx on public.carnet_favorites (guest_id, created_at desc);

alter table public.carnet_entries enable row level security;
alter table public.carnet_favorites enable row level security;
alter table public.carnet_entry_versions enable row level security;

create policy "public reads published carnet entries" on public.carnet_entries
for select to public using (status = 'published');
create policy "staff reads all carnet entries" on public.carnet_entries
for select to authenticated using (public.current_app_role() is not null);
create policy "staff manages carnet entries" on public.carnet_entries
for all to authenticated using (public.current_app_role() in ('admin','concierge'))
with check (public.current_app_role() in ('admin','concierge'));
create policy "traveler manages own carnet favorites" on public.carnet_favorites
for all to authenticated using (
  exists (select 1 from public.guests guest where guest.id = guest_id and guest.user_id = auth.uid())
) with check (
  exists (select 1 from public.guests guest where guest.id = guest_id and guest.user_id = auth.uid())
);
create policy "staff reads carnet versions" on public.carnet_entry_versions
for select to authenticated using (public.current_app_role() is not null);

create trigger carnet_entries_updated_at before update on public.carnet_entries
for each row execute function public.set_updated_at();

create or replace function public.version_carnet_entry()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    insert into public.carnet_entry_versions(entry_id,version,snapshot,created_by)
    values(old.id,old.version,to_jsonb(old),auth.uid())
    on conflict (entry_id,version) do nothing;
    new.version := old.version + 1;
    new.updated_by := auth.uid();
    if new.status = 'published' and old.status is distinct from 'published' then
      new.published_at := now();
    end if;
  end if;
  return new;
end;
$$;

create trigger version_carnet_entry_before_update
before update on public.carnet_entries
for each row execute function public.version_carnet_entry();

comment on table public.carnet_entries is
  'Editable source of truth for the premium traveler guide. Static content remains the migration fallback.';
comment on table public.carnet_entry_versions is
  'Immutable editorial history for rollback and audit.';

commit;
