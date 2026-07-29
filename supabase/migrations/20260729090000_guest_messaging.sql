-- Guest messaging: private access material and idempotent scheduling.
-- Secret values are encrypted by the server before insertion and never selected by public clients.

create table public.guest_access_secrets (
  reservation_id uuid primary key references public.reservations(id) on delete cascade,
  key_box_code_ciphertext bytea not null,
  pedestrian_gate_code_ciphertext bytea,
  wifi_name_ciphertext bytea not null,
  wifi_password_ciphertext bytea not null,
  available_from timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guest_access_secrets enable row level security;

create policy "staff manage guest access secrets"
on public.guest_access_secrets for all to authenticated
using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));

revoke all on public.guest_access_secrets from public, anon;
grant select, insert, update, delete on public.guest_access_secrets to authenticated, service_role;

alter table public.transactional_emails
  add column if not exists message_type text,
  add column if not exists locale text not null default 'fr',
  add column if not exists idempotency_key text,
  add column if not exists custom_paragraph text,
  add column if not exists manually_marked_sent_at timestamptz,
  add column if not exists cancelled_at timestamptz;

alter table public.transactional_emails
  add constraint transactional_emails_guest_type_check
  check (message_type is null or message_type in ('booking_confirmation', 'arrival', 'departure')),
  add constraint transactional_emails_locale_check
  check (locale in ('fr', 'en', 'de'));

create unique index transactional_emails_idempotency_unique
  on public.transactional_emails (idempotency_key)
  where idempotency_key is not null;

create index transactional_emails_scheduling_idx
  on public.transactional_emails (status, scheduled_at)
  where sent_at is null and cancelled_at is null;

create trigger guest_access_secrets_updated_at
before update on public.guest_access_secrets
for each row execute function public.set_updated_at();

comment on table public.guest_access_secrets is
  'Server-only encrypted access material. Never expose through public APIs, logs, SEO, or confirmation emails.';
comment on column public.transactional_emails.idempotency_key is
  'reservationId + messageType + locale + scheduledDate; prevents duplicate sends.';
