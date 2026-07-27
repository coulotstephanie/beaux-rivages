begin;

alter table public.payments
  add column provider_session_id text;

create unique index payments_provider_session_id_unique
  on public.payments (provider, provider_session_id)
  where provider_session_id is not null;

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'stripe',
  provider_event_id text not null,
  event_type text not null,
  status text not null default 'processing'
    check (status in ('processing', 'processed', 'failed', 'ignored')),
  payment_id uuid references public.payments(id) on delete set null,
  error_message text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, provider_event_id)
);

create index payment_events_received_idx
  on public.payment_events (received_at desc);
create index payment_events_status_idx
  on public.payment_events (status, received_at desc);

alter table public.payment_events enable row level security;

create policy "staff read payment events"
on public.payment_events for select to authenticated
using (public.current_app_role() is not null);

create function public.claim_payment_event(
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

revoke all on function public.claim_payment_event(text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.claim_payment_event(text, text, text, jsonb) to service_role;

create trigger audit_payment_events
after insert or update or delete on public.payment_events
for each row execute function public.audit_row_change();

commit;
