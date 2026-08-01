-- Paramétrage annuel et historisé de la taxe de séjour par logement.
create table if not exists public.tourist_tax_settings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  municipality text not null,
  intercommunality text not null,
  accommodation_category text not null default 'Meublé de tourisme',
  classification text not null default 'unclassified' check (classification in ('unclassified','1','2','3','4','5')),
  calculation_mode text not null default 'proportional' check (calculation_mode in ('proportional','fixed')),
  rate_value numeric(8,3) not null check (rate_value between 0 and 100),
  additional_rate_percent numeric(6,3) not null default 0 check (additional_rate_percent between 0 and 500),
  nightly_cap_cents integer not null check (nightly_cap_cents >= 0),
  effective_from date not null,
  effective_to date,
  enabled boolean not null default true,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, effective_from),
  check (effective_to is null or effective_to >= effective_from)
);

alter table public.tourist_tax_settings enable row level security;
create policy "staff read tourist tax settings" on public.tourist_tax_settings for select to authenticated
using (public.current_app_role() is not null);
create policy "admin manage tourist tax settings" on public.tourist_tax_settings for all to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

insert into public.tourist_tax_settings (
  property_id, municipality, intercommunality, accommodation_category, classification,
  calculation_mode, rate_value, additional_rate_percent, nightly_cap_cents,
  effective_from, enabled, source_url
)
select
  property.id,
  case when property.slug = 'nid-d-ete' then 'Saint-Georges-d''Oléron' else 'Rivedoux-Plage' end,
  case when property.slug = 'nid-d-ete' then 'Communauté de communes de l''Île d''Oléron' else 'Communauté de communes de l''Île de Ré' end,
  'Meublé de tourisme non classé', 'unclassified', 'proportional', 5, 10,
  case when property.slug = 'nid-d-ete' then 300 else 410 end,
  date '2026-01-01', true, 'https://taxesejour.impots.gouv.fr/'
from public.properties property
on conflict (property_id, effective_from) do nothing;

create index if not exists tourist_tax_settings_property_effective_idx
  on public.tourist_tax_settings (property_id, effective_from desc) where enabled;

create trigger tourist_tax_settings_updated_at before update on public.tourist_tax_settings
for each row execute function public.set_updated_at();
