begin;

drop trigger if exists audit_payment_events on public.payment_events;
drop function if exists public.claim_payment_event(text, text, text, jsonb);
drop table if exists public.payment_events;
drop index if exists public.payments_provider_session_id_unique;
alter table public.payments drop column if exists provider_session_id;

commit;
