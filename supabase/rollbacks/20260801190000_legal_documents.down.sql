begin;
revoke execute on function public.publish_legal_document(uuid) from authenticated;
drop function if exists public.publish_legal_document(uuid);
drop index if exists public.legal_documents_one_published_idx;
drop index if exists public.legal_documents_history_idx;
drop table if exists public.legal_documents;
commit;
