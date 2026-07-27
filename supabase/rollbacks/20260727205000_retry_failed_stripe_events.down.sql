begin;

create or replace function public.claim_payment_event(
  event_provider text,
  event_id text,
  event_name text,
  event_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  claimed_id uuid;
begin
  insert into public.payment_events (provider, provider_event_id, event_type, payload)
  values (event_provider, event_id, event_name, event_payload)
  on conflict (provider, provider_event_id) do nothing
  returning id into claimed_id;
  return claimed_id;
end;
$$;

commit;
