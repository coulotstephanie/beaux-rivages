create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  document_key text not null,
  title text not null,
  description text not null default '',
  sections jsonb not null default '[]'::jsonb,
  version text not null,
  effective_from date not null default current_date,
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint legal_documents_key_format check (document_key ~ '^[a-z][a-z0-9_]*$'),
  constraint legal_documents_sections_array check (jsonb_typeof(sections) = 'array'),
  unique (document_key, version)
);

create index if not exists legal_documents_history_idx
  on public.legal_documents (document_key, created_at desc);
create unique index if not exists legal_documents_one_published_idx
  on public.legal_documents (document_key) where published;

alter table public.legal_documents enable row level security;

create policy "published legal documents are public"
  on public.legal_documents for select
  using (published or public.current_app_role() is not null);

create policy "admins manage legal documents"
  on public.legal_documents for all
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

create or replace function public.publish_legal_document(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare target_key text;
begin
  if coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
     and public.current_app_role() is distinct from 'admin'::public.app_role then
    raise exception 'permission denied';
  end if;
  select document_key into target_key from public.legal_documents where id = target_id;
  if target_key is null then raise exception 'document not found'; end if;
  update public.legal_documents set published = false where document_key = target_key and published;
  update public.legal_documents set published = true where id = target_id;
end;
$$;

revoke all on function public.publish_legal_document(uuid) from public;
grant execute on function public.publish_legal_document(uuid) to authenticated;
