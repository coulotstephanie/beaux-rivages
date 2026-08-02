drop table if exists public.operational_reports cascade; drop table if exists public.maintenance_interventions cascade;
drop table if exists public.operational_photos cascade; drop table if exists public.stock_items cascade;
drop table if exists public.inventory_items cascade; drop table if exists public.housekeeping_inspections cascade;
alter table public.housekeeping_tasks drop column if exists operational_status,drop column if exists started_at,drop column if exists signature_path,drop column if exists offline_revision;
drop policy if exists "staff manage operational photos" on storage.objects;
-- Supabase Storage forbids direct SQL bucket deletion because it can orphan
-- objects. The now-private, inaccessible bucket is intentionally retained and
-- can be removed through the Storage API after its contents have been checked.
