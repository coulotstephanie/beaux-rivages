drop table if exists public.experience_requests cascade;
alter table public.premium_experiences drop column if exists translations, drop column if exists content, drop column if exists gallery_paths, drop column if exists availability, drop column if exists updated_by;
