begin;

drop policy if exists "staff manages heritage files" on storage.objects;
drop policy if exists "public reads heritage files" on storage.objects;

delete from storage.objects where bucket_id = 'heritage';
delete from storage.buckets where id = 'heritage';

drop trigger if exists heritage_media_updated_at on public.heritage_media;
drop table if exists public.heritage_media;

commit;
