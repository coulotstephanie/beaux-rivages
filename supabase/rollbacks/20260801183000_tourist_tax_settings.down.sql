begin;
drop trigger if exists tourist_tax_settings_updated_at on public.tourist_tax_settings;
drop index if exists public.tourist_tax_settings_property_effective_idx;
drop table if exists public.tourist_tax_settings;
commit;
