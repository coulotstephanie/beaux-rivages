begin;
drop policy if exists "editors delete cms media" on storage.objects;
drop policy if exists "editors update cms media" on storage.objects;
drop policy if exists "editors upload cms media" on storage.objects;
delete from storage.objects where bucket_id = 'cms-media';
delete from storage.buckets where id = 'cms-media';
drop function if exists public.cms_restore_page(uuid, integer);
drop function if exists public.cms_save_page(jsonb, jsonb, text);
drop function if exists public.cms_capture_page_version(uuid, jsonb, text);
drop table if exists public.staff_security_settings;
drop table if exists public.staff_login_events;
drop table if exists public.cms_audit_log;
drop table if exists public.managed_links;
drop table if exists public.site_settings;
drop table if exists public.cms_page_versions;
drop table if exists public.cms_gallery_items;
drop table if exists public.cms_galleries;
drop table if exists public.cms_media_assets;
drop table if exists public.cms_blocks;
drop table if exists public.cms_pages;
-- PostgreSQL ne permet pas de retirer une valeur d'enum sans recréer le type.
-- La valeur `editor` est donc volontairement conservée lors du rollback.
commit;
