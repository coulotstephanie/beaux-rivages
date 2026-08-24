begin;
create table if not exists public.property_visual_content (
  property_slug text primary key references public.properties(slug) on update cascade on delete cascade,
  draft_content jsonb not null,
  published_content jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  published_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table public.property_visual_content enable row level security;
create policy "staff read property visual content" on public.property_visual_content for select using (public.current_app_role() in ('admin','editor','read_only'));
create policy "editors write property visual content" on public.property_visual_content for all using (public.current_app_role() in ('admin','editor')) with check (public.current_app_role() in ('admin','editor'));
commit;
