begin;

create table public.heritage_media (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null check (site_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  image_path text not null,
  storage_path text,
  alt_text text not null check (char_length(alt_text) between 3 and 300),
  caption text,
  sort_order integer not null default 100 check (sort_order between 0 and 10000),
  is_cover boolean not null default false,
  status text not null default 'published' check (status in ('draft','published','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index heritage_media_site_order_idx
  on public.heritage_media(site_slug, status, sort_order, created_at);
create unique index heritage_media_one_cover_idx
  on public.heritage_media(site_slug) where is_cover and status <> 'archived';

alter table public.heritage_media enable row level security;
create policy "public reads published heritage media" on public.heritage_media
  for select to public using (status = 'published');
create policy "staff manages heritage media" on public.heritage_media
  for all to authenticated
  using (public.current_app_role() in ('admin','concierge'))
  with check (public.current_app_role() in ('admin','concierge'));

create trigger heritage_media_updated_at before update on public.heritage_media
for each row execute function public.set_updated_at();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('heritage','heritage',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set
  public=true,
  file_size_limit=10485760,
  allowed_mime_types=excluded.allowed_mime_types;

create policy "public reads heritage files" on storage.objects
  for select to public using(bucket_id='heritage');
create policy "staff manages heritage files" on storage.objects
  for all to authenticated
  using(bucket_id='heritage' and public.current_app_role() in('admin','concierge'))
  with check(bucket_id='heritage' and public.current_app_role() in('admin','concierge'));

grant select on public.heritage_media to anon;
grant select,insert,update,delete on public.heritage_media to authenticated,service_role;

commit;
