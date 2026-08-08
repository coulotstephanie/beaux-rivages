begin;

-- Le rôle éditeur sépare la gestion éditoriale de l'administration système.
alter type public.app_role add value if not exists 'editor';
commit;

-- PostgreSQL interdit d'utiliser une nouvelle valeur d'enum avant le commit de
-- la transaction qui l'ajoute.
begin;

create table public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  page_type text not null default 'page' check (page_type in ('page', 'property', 'article', 'legal', 'landing')),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  locale text not null default 'fr',
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'published') = (published_at is not null))
);

create table public.cms_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages(id) on delete cascade,
  parent_id uuid references public.cms_blocks(id) on delete cascade,
  block_type text not null,
  position integer not null default 0 check (position >= 0),
  content jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, parent_id, position)
);

create table public.cms_media_assets (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  kind text not null check (kind in ('image', 'video', 'document')),
  bucket text not null default 'photos',
  storage_path text not null,
  title text,
  alt_text text,
  credit text,
  tags text[] not null default '{}',
  focal_point jsonb not null default '{"x":0.5,"y":0.5}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  checksum text,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, storage_path)
);

create table public.cms_galleries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  cover_asset_id uuid references public.cms_media_assets(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cms_gallery_items (
  gallery_id uuid not null references public.cms_galleries(id) on delete cascade,
  asset_id uuid not null references public.cms_media_assets(id) on delete cascade,
  position integer not null check (position >= 0),
  caption text,
  primary key (gallery_id, asset_id),
  unique (gallery_id, position)
);

create table public.cms_page_versions (
  id bigint generated always as identity primary key,
  page_id uuid not null references public.cms_pages(id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (page_id, version)
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  value jsonb not null,
  public boolean not null default false,
  description text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.managed_links (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  url text not null check (url ~ '^(https?://|mailto:|tel:|whatsapp:)'),
  active boolean not null default true,
  last_checked_at timestamptz,
  last_status integer,
  updated_at timestamptz not null default now()
);

create table public.cms_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table public.staff_login_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  email_hash text,
  outcome text not null check (outcome in ('success', 'failure', 'signed_out', 'expired', 'mfa_required', 'mfa_success', 'mfa_failure')),
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.staff_security_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  mfa_required boolean not null default false,
  idle_timeout_minutes integer not null default 30 check (idle_timeout_minutes between 5 and 480),
  updated_at timestamptz not null default now()
);

create index cms_pages_status_locale_idx on public.cms_pages (status, locale);
create index cms_blocks_page_position_idx on public.cms_blocks (page_id, position);
create index cms_media_search_idx on public.cms_media_assets using gin (tags);
create index cms_audit_entity_idx on public.cms_audit_log (entity_type, entity_id, created_at desc);
create index staff_login_events_user_date_idx on public.staff_login_events (user_id, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media', 'cms-media', true, 104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "editors upload cms media" on storage.objects for insert
  with check (bucket_id = 'cms-media' and public.current_app_role() in ('admin', 'editor'));
create policy "editors update cms media" on storage.objects for update
  using (bucket_id = 'cms-media' and public.current_app_role() in ('admin', 'editor'));
create policy "editors delete cms media" on storage.objects for delete
  using (bucket_id = 'cms-media' and public.current_app_role() in ('admin', 'editor'));

create or replace function public.cms_capture_page_version(
  target_page_id uuid,
  page_snapshot jsonb,
  change_reason text default null
)
returns integer language plpgsql security invoker set search_path = public as $$
declare next_version integer;
begin
  if public.current_app_role() not in ('admin', 'editor') then
    raise exception 'CMS write access required' using errcode = '42501';
  end if;
  select coalesce(max(version), 0) + 1 into next_version
  from public.cms_page_versions where page_id = target_page_id;
  insert into public.cms_page_versions (page_id, version, snapshot, reason, created_by)
  values (target_page_id, next_version, page_snapshot, change_reason, auth.uid());
  return next_version;
end;
$$;

create or replace function public.cms_save_page(
  page_payload jsonb,
  block_payload jsonb default '[]'::jsonb,
  change_reason text default 'Enregistrement depuis le Centre de Pilotage'
)
returns uuid language plpgsql security invoker set search_path = public as $$
declare
  target_id uuid := nullif(page_payload->>'id', '')::uuid;
  block jsonb;
  final_snapshot jsonb;
begin
  if public.current_app_role() not in ('admin', 'editor') then
    raise exception 'CMS write access required' using errcode = '42501';
  end if;
  if jsonb_typeof(block_payload) <> 'array' then
    raise exception 'Blocks must be an array' using errcode = '22023';
  end if;

  if target_id is null then
    insert into public.cms_pages (
      page_type, slug, title, status, locale, seo, published_at, created_by, updated_by
    ) values (
      coalesce(page_payload->>'pageType', 'page'), page_payload->>'slug',
      page_payload->>'title', coalesce(page_payload->>'status', 'draft'),
      coalesce(page_payload->>'locale', 'fr'), coalesce(page_payload->'seo', '{}'::jsonb),
      case when page_payload->>'status' = 'published' then now() else null end,
      auth.uid(), auth.uid()
    ) returning id into target_id;
  else
    perform 1 from public.cms_pages where id = target_id for update;
    if not found then raise exception 'Page not found' using errcode = 'P0002'; end if;
    update public.cms_pages set
      page_type = coalesce(page_payload->>'pageType', page_type),
      slug = coalesce(page_payload->>'slug', slug),
      title = coalesce(page_payload->>'title', title),
      status = coalesce(page_payload->>'status', status),
      locale = coalesce(page_payload->>'locale', locale),
      seo = coalesce(page_payload->'seo', seo),
      published_at = case
        when coalesce(page_payload->>'status', status) = 'published'
          then coalesce(published_at, now()) else null end,
      updated_by = auth.uid(), updated_at = now()
    where id = target_id;
    delete from public.cms_blocks where page_id = target_id;
  end if;

  for block in select value from jsonb_array_elements(block_payload)
  loop
    insert into public.cms_blocks (page_id, block_type, position, content, settings, visible)
    values (
      target_id, block->>'blockType', coalesce((block->>'position')::integer, 0),
      coalesce(block->'content', '{}'::jsonb), coalesce(block->'settings', '{}'::jsonb),
      coalesce((block->>'visible')::boolean, true)
    );
  end loop;

  select jsonb_build_object('page', to_jsonb(p), 'blocks', coalesce((
    select jsonb_agg(to_jsonb(b) order by b.position) from public.cms_blocks b where b.page_id = target_id
  ), '[]'::jsonb)) into final_snapshot from public.cms_pages p where p.id = target_id;
  perform public.cms_capture_page_version(target_id, final_snapshot, change_reason);
  insert into public.cms_audit_log (actor_id, entity_type, entity_id, action, after_data)
  values (auth.uid(), 'cms_page', target_id::text, 'save', final_snapshot);
  return target_id;
end;
$$;

create or replace function public.cms_restore_page(target_page_id uuid, target_version integer)
returns uuid language plpgsql security invoker set search_path = public as $$
declare
  saved_snapshot jsonb;
  page_data jsonb;
  blocks_data jsonb;
begin
  if public.current_app_role() not in ('admin', 'editor') then
    raise exception 'CMS write access required' using errcode = '42501';
  end if;
  select snapshot into saved_snapshot from public.cms_page_versions
  where page_id = target_page_id and version = target_version;
  if saved_snapshot is null then raise exception 'Version not found' using errcode = 'P0002'; end if;
  page_data := saved_snapshot->'page';
  blocks_data := saved_snapshot->'blocks';
  return public.cms_save_page(
    jsonb_build_object(
      'id', target_page_id, 'pageType', page_data->>'page_type', 'slug', page_data->>'slug',
      'title', page_data->>'title', 'status', page_data->>'status',
      'locale', page_data->>'locale', 'seo', page_data->'seo'
    ),
    (select coalesce(jsonb_agg(jsonb_build_object(
      'blockType', item->>'block_type', 'position', item->'position', 'content', item->'content',
      'settings', item->'settings', 'visible', item->'visible'
    )), '[]'::jsonb) from jsonb_array_elements(blocks_data) item),
    format('Restauration de la version %s', target_version)
  );
end;
$$;

alter table public.cms_pages enable row level security;
alter table public.cms_blocks enable row level security;
alter table public.cms_media_assets enable row level security;
alter table public.cms_galleries enable row level security;
alter table public.cms_gallery_items enable row level security;
alter table public.cms_page_versions enable row level security;
alter table public.site_settings enable row level security;
alter table public.managed_links enable row level security;
alter table public.cms_audit_log enable row level security;
alter table public.staff_login_events enable row level security;
alter table public.staff_security_settings enable row level security;

create policy "published pages are public" on public.cms_pages for select
  using (status = 'published' or public.current_app_role() in ('admin', 'editor', 'concierge', 'read_only'));
create policy "published blocks are public" on public.cms_blocks for select
  using (exists (select 1 from public.cms_pages p where p.id = page_id and p.status = 'published')
    or public.current_app_role() in ('admin', 'editor', 'concierge', 'read_only'));
create policy "staff read cms media" on public.cms_media_assets for select
  using (public.current_app_role() is not null);
create policy "staff read cms galleries" on public.cms_galleries for select
  using (status = 'published' or public.current_app_role() is not null);
create policy "staff read gallery items" on public.cms_gallery_items for select
  using (public.current_app_role() is not null);
create policy "staff read page versions" on public.cms_page_versions for select
  using (public.current_app_role() in ('admin', 'editor', 'read_only'));
create policy "public settings are readable" on public.site_settings for select
  using (public or public.current_app_role() is not null);
create policy "active links are readable" on public.managed_links for select
  using (active or public.current_app_role() is not null);
create policy "admins read cms audit" on public.cms_audit_log for select
  using (public.current_app_role() = 'admin');

create policy "editors manage pages" on public.cms_pages for all
  using (public.current_app_role() in ('admin', 'editor'))
  with check (public.current_app_role() in ('admin', 'editor'));
create policy "editors manage blocks" on public.cms_blocks for all
  using (public.current_app_role() in ('admin', 'editor'))
  with check (public.current_app_role() in ('admin', 'editor'));
create policy "editors manage media" on public.cms_media_assets for all
  using (public.current_app_role() in ('admin', 'editor'))
  with check (public.current_app_role() in ('admin', 'editor'));
create policy "editors manage galleries" on public.cms_galleries for all
  using (public.current_app_role() in ('admin', 'editor'))
  with check (public.current_app_role() in ('admin', 'editor'));
create policy "editors manage gallery items" on public.cms_gallery_items for all
  using (public.current_app_role() in ('admin', 'editor'))
  with check (public.current_app_role() in ('admin', 'editor'));
create policy "editors create versions" on public.cms_page_versions for insert
  with check (public.current_app_role() in ('admin', 'editor'));
create policy "admins manage settings" on public.site_settings for all
  using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admins manage links" on public.managed_links for all
  using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "staff append cms audit" on public.cms_audit_log for insert
  with check (actor_id = auth.uid() and public.current_app_role() in ('admin', 'editor'));
create policy "admins read login journal" on public.staff_login_events for select
  using (public.current_app_role() = 'admin');
create policy "users read security settings" on public.staff_security_settings for select
  using (user_id = auth.uid() or public.current_app_role() = 'admin');
create policy "admins manage security settings" on public.staff_security_settings for all
  using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

comment on table public.cms_pages is 'Pages dynamiques du site; leur publication ne nécessite aucun redéploiement.';
comment on table public.cms_page_versions is 'Instantanés immuables utilisés pour historique et restauration.';
comment on table public.cms_audit_log is 'Journal transverse et append-only des mutations éditoriales.';

commit;
