begin;
drop trigger if exists version_carnet_entry_before_update on public.carnet_entries;
drop function if exists public.version_carnet_entry();
drop table if exists public.carnet_entry_versions;
drop table if exists public.carnet_favorites;
drop table if exists public.carnet_entries;
drop function if exists public.carnet_tags_search_text(text[]);
commit;
