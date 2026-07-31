-- Premium handwritten guest book. OCR can prepare a draft; only staff can publish it.
create table public.guest_book_entries (
  id uuid primary key default gen_random_uuid(),
  house text not null check (house in ('chai-des-tortues', 'villa-raie-manta', 'nid-d-ete')),
  entry_date date not null,
  date_precision text not null default 'day' check (date_precision in ('day', 'month')),
  language text not null default 'fr' check (language in ('fr', 'en', 'de', 'es', 'nl', 'other')),
  author text not null check (char_length(author) between 1 and 80),
  text text not null check (char_length(text) between 2 and 4000),
  featured boolean not null default false,
  tags text[] not null default '{}',
  image_path text,
  status text not null default 'photo_received' check (status in ('photo_received', 'ocr_review', 'validated', 'published')),
  ocr_raw_text text,
  ocr_provider text,
  ocr_confidence numeric(5,4) check (ocr_confidence between 0 and 1),
  validated_by uuid references auth.users(id) on delete set null,
  validated_at timestamptz,
  published_at timestamptz,
  search_vector tsvector not null default ''::tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.refresh_guest_book_search_vector()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.search_vector := to_tsvector(
    'simple',
    coalesce(new.author, '') || ' ' || coalesce(new.text, '') || ' ' ||
    coalesce(array_to_string(new.tags, ' '), '')
  );
  return new;
end;
$$;

create trigger guest_book_search_vector_refresh
before insert or update of author, text, tags on public.guest_book_entries
for each row execute function public.refresh_guest_book_search_vector();

create index guest_book_public_date_idx on public.guest_book_entries (entry_date desc) where status = 'published';
create index guest_book_house_language_idx on public.guest_book_entries (house, language, entry_date desc);
create index guest_book_tags_idx on public.guest_book_entries using gin (tags);
create index guest_book_search_idx on public.guest_book_entries using gin (search_vector);

alter table public.guest_book_entries enable row level security;
create policy "public read published guest book" on public.guest_book_entries for select to anon, authenticated using (status = 'published' or public.current_app_role() is not null);
create policy "staff create guest book" on public.guest_book_entries for insert to authenticated with check (public.current_app_role() in ('admin', 'concierge'));
create policy "staff update guest book" on public.guest_book_entries for update to authenticated using (public.current_app_role() in ('admin', 'concierge')) with check (public.current_app_role() in ('admin', 'concierge'));
create policy "admin delete guest book" on public.guest_book_entries for delete to authenticated using (public.current_app_role() = 'admin');

grant select on public.guest_book_entries to anon;
grant select, insert, update on public.guest_book_entries to authenticated;
grant select, insert, update, delete on public.guest_book_entries to service_role;
create trigger guest_book_entries_updated_at before update on public.guest_book_entries for each row execute function public.set_updated_at();

comment on table public.guest_book_entries is 'Verified transcriptions of physical guest books; OCR output is never published without staff validation.';

insert into public.guest_book_entries (house, entry_date, date_precision, language, author, text, featured, tags, status, validated_at, published_at)
values
  ('chai-des-tortues', '2026-03-01', 'month', 'fr', 'Anne & Lydie', 'Quel beau séjour nous avons passé dans votre Chai. Merci pour votre disponibilité et votre réactivité. Les espaces sont bien pensés et le lieu est très agréable à vivre. Une literie fantastique ! Encore un grand merci Stéphanie et Bruno. Nous reviendrons avec grand plaisir.', true, array['Accueil','Disponibilité','Literie','Confort','Retour'], 'published', now(), now()),
  ('chai-des-tortues', '2026-03-01', 'month', 'fr', 'Cédric, Mélissa et leurs enfants', 'Merci beaucoup Stéphanie et Bruno. Nous avons passé un très agréable séjour. Votre région a été une découverte incroyable. Le logement est parfaitement aménagé, très bien pensé et la literie est TOP. Merci pour tout.', true, array['Famille','Confort','Cuisine','Literie','Retour'], 'published', now(), now()),
  ('chai-des-tortues', '2026-03-01', 'month', 'fr', 'Famille', 'Tout est parfait : l''équipement, le confort, la propreté de la maison. Stéphanie et Bruno sont des hôtes attentifs, disponibles mais discrets. Tout est réuni pour un superbe séjour. Nous avons envie de revenir.', true, array['Équipements','Propreté','Accueil','Retour'], 'published', now(), now()),
  ('chai-des-tortues', '2026-03-20', 'day', 'fr', 'Élise & Guillaume', 'Merci beaucoup à Stéphanie et Bruno pour leur disponibilité. Le gîte est très bien équipé et très agréable à vivre. De plus, il est très bien situé.', false, array['Accueil','Emplacement','Confort'], 'published', now(), now()),
  ('chai-des-tortues', '2026-04-24', 'day', 'fr', 'Valentina (11 ans)', 'Merci pour tout Stéphanie et Bruno. La maison est incroyable ! Un très beau souvenir à l''Île de Ré. C''est une très belle île où il y a des coquillages et des vélos. Bonnes vacances !', true, array['Famille','Île de Ré','Vacances'], 'published', now(), now()),
  ('chai-des-tortues', '2026-04-01', 'month', 'fr', 'Famille', 'Merci beaucoup pour cette magnifique maison. Nous avons passé un incroyable séjour. À très vite.', false, array['Séjour','Retour'], 'published', now(), now()),
  ('chai-des-tortues', '2026-04-01', 'month', 'fr', 'Astrid, Benjamin et leurs enfants', 'Merci beaucoup pour cet agréable séjour dans cette maison.', false, array['Famille','Séjour'], 'published', now(), now()),
  ('chai-des-tortues', '2026-07-29', 'day', 'en', 'Bart, Nynke, Aline, Yfke & Eize', 'Thanks for everything! We had a wonderful stay and really enjoyed being here in this lovely house and on this beautiful island. Everything was taken care of and we felt very welcome.', true, array['International','Welcome','House','Island'], 'published', now(), now());
