-- Operational financial registry: bank transfer is the only enabled method by default.
create table if not exists public.payment_method_settings (
  method text primary key check (method in ('bank_transfer', 'holiday_vouchers', 'card')),
  enabled boolean not null default false,
  label text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.payment_method_settings(method, enabled, label) values
  ('bank_transfer', true, 'Virement bancaire'),
  ('holiday_vouchers', false, 'Chèques-Vacances'),
  ('card', false, 'Carte bancaire')
on conflict (method) do nothing;

alter table public.payments
  add column if not exists method text not null default 'bank_transfer',
  add column if not exists received_at timestamptz,
  add column if not exists bank_reference text,
  add column if not exists iban_label text,
  add column if not exists validated_by uuid references auth.users(id) on delete set null,
  add column if not exists comment text,
  add column if not exists evidence_path text;

alter table public.payments drop constraint if exists payments_method_check;
alter table public.payments add constraint payments_method_check
  check (method in ('bank_transfer', 'holiday_vouchers', 'card'));

create unique index if not exists payments_single_settlement_kind
  on public.payments(reservation_id, kind)
  where kind in ('deposit', 'balance', 'full')
    and status in ('authorized', 'paid', 'partially_refunded');

create table if not exists public.payment_reminders (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  kind text not null check (kind in ('deposit', 'balance')),
  channel text not null default 'email' check (channel in ('email', 'manual')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'cancelled')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  comment text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists payment_reminders_reservation_idx
  on public.payment_reminders(reservation_id, created_at desc);

alter table public.payment_method_settings enable row level security;
alter table public.payment_reminders enable row level security;

create policy "staff read payment settings" on public.payment_method_settings
for select to authenticated using (public.current_app_role() is not null);
create policy "admin manages payment settings" on public.payment_method_settings
for all to authenticated using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');
create policy "staff read payment reminders" on public.payment_reminders
for select to authenticated using (public.current_app_role() is not null);
create policy "staff manages payment reminders" on public.payment_reminders
for all to authenticated using (public.current_app_role() in ('admin', 'concierge'))
with check (public.current_app_role() in ('admin', 'concierge'));

create policy "staff records manual payments" on public.payments
for insert to authenticated with check (
  public.current_app_role() in ('admin', 'concierge') and provider = 'manual'
);
create policy "admin updates manual payments" on public.payments
for update to authenticated using (
  public.current_app_role() = 'admin' and provider = 'manual'
) with check (
  public.current_app_role() = 'admin' and provider = 'manual'
);

create or replace function public.journal_payment_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.reservation_events(reservation_id,event_type,origin,actor_id,details)
  values(new.reservation_id,
    case when tg_op='UPDATE' and new.refunded_cents > old.refunded_cents then 'payment.refunded' else 'payment.' || new.status end,
    case when new.validated_by is null then 'system' else 'administration' end,
    new.validated_by,
    jsonb_build_object(
      'paymentId',new.id,'kind',new.kind,'method',new.method,
      'amountCents',new.amount_cents,'refundedCents',new.refunded_cents,
      'bankReference',new.bank_reference,'comment',new.comment
    ));
  return new;
end $$;

comment on table public.payment_method_settings is 'Feature switches for traveler payment methods.';
comment on table public.payment_reminders is 'Idempotent history and schedule of financial reminders.';
comment on column public.payments.bank_reference is 'Bank statement reference used for reconciliation.';
