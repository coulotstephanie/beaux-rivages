-- Consolidate the existing premium experience catalog without creating a duplicate source of truth.
alter table public.premium_experiences
  add column if not exists translations jsonb not null default '{}',
  add column if not exists content jsonb not null default '{}',
  add column if not exists gallery_paths text[] not null default '{}',
  add column if not exists availability jsonb not null default '{"mode":"on_request"}',
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

create table public.experience_requests (
  id uuid primary key default gen_random_uuid(),
  experience_code text not null check (experience_code in ('demande-en-mariage', 'anniversaire')),
  guest_id uuid references public.guests(id) on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  email text not null,
  phone text not null,
  desired_date date not null,
  property_slug text not null check (property_slug in ('chai-des-tortues', 'villa-raie-manta', 'nid-d-ete')),
  budget text,
  project_description text not null check (char_length(project_description) between 20 and 4000),
  status text not null default 'new' check (status in ('new', 'contacted', 'proposal_sent', 'accepted', 'declined', 'cancelled')),
  source text not null default 'website',
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index experience_requests_status_date_idx on public.experience_requests (status, desired_date, created_at desc);
alter table public.experience_requests enable row level security;
create policy "staff read experience requests" on public.experience_requests for select to authenticated using (public.current_app_role() is not null);
create policy "staff manage experience requests" on public.experience_requests for all to authenticated using (public.current_app_role() in ('admin', 'concierge')) with check (public.current_app_role() in ('admin', 'concierge'));
grant select, insert, update, delete on public.experience_requests to authenticated, service_role;
revoke all on public.experience_requests from public, anon;
create trigger experience_requests_updated_at before update on public.experience_requests for each row execute function public.set_updated_at();

insert into public.premium_experiences (code, label, description, price_cents, image_path, enabled, content, gallery_paths, sort_order)
values
  ('essentiel', 'Séjour Essentiel', 'Les fondamentaux de l’hospitalité inclus dans chaque réservation.', 0, '/images/properties/chai-des-tortues/hero/chai-espace-de-vie.jpeg', true, '{"badge":"Inclus dans toutes les réservations"}', array['/images/properties/chai-des-tortues/kitchen/cuisine-et-table.jpeg'], 10),
  ('baby', 'Les Tout-Petits sont les Bienvenus', 'Des équipements gratuits pour voyager plus léger en famille.', 0, '/images/properties/nid-d-ete/editorial/lecture-bebe-et-chat.png', true, '{"badge":"Offert"}', array['/images/properties/villa-raie-manta/editorial/chambre-enfants-famille.png'], 20),
  ('pet', 'Vos Compagnons sont les Bienvenus', 'Un accueil attentif et un guide de promenades adaptées.', 2500, '/images/destination/editorial/enfants-jouent-avec-chien.png', true, '{"unit":"par animal et par séjour"}', array['/images/destination/editorial/famille-cerf-volant-chien.png'], 30),
  ('signature', 'Expérience Signature Beaux Rivages', 'La maison prête à vivre, le confort jusqu’à la plage et un accueil gourmand.', 14500, '/images/properties/villa-raie-manta/editorial/table-fruits-de-mer.png', true, '{"basketChoice":["aperitif","sweet"]}', array['/images/properties/chai-des-tortues/editorial/chambre-attention.png','/images/properties/villa-raie-manta/editorial/ilot-aperitif.png'], 40),
  ('romance', 'Expérience Romance Signature', 'Une ambiance romantique, un moment gourmand et des attentions à deux.', 14900, '/images/properties/villa-raie-manta/editorial/diner-romantique-ocean.png', true, '{}', array['/images/properties/villa-raie-manta/editorial/chambre-romance.png','/images/properties/chai-des-tortues/editorial/diner-romantique-aux-chandelles.png'], 50),
  ('demande-en-mariage', 'Expérience Demande en Mariage', 'Une organisation entièrement personnalisée et discrète.', 0, '/images/destination/experiences/demande-mariage-ocean.jpg', true, '{"pricing":"quote"}', array['/images/destination/experiences/demande-mariage-ocean.jpg'], 60),
  ('anniversaire', 'Expérience Anniversaire', 'Une célébration préparée autour de la personne et de son histoire.', 0, '/images/properties/villa-raie-manta/editorial/table-anniversaire.png', true, '{"pricing":"quote"}', array['/images/properties/villa-raie-manta/editorial/anniversaire-multigenerationnel.png'], 70)
on conflict (code) do update set label=excluded.label, description=excluded.description, price_cents=excluded.price_cents, image_path=excluded.image_path, enabled=excluded.enabled, content=excluded.content, gallery_paths=excluded.gallery_paths, sort_order=excluded.sort_order;
