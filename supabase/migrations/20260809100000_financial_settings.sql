begin;

create table public.financial_settings (
  id boolean primary key default true check (id),
  deposit_percentage integer not null default 30 check (deposit_percentage between 0 and 100),
  full_payment_threshold_days integer not null default 15 check (full_payment_threshold_days between 0 and 365),
  balance_due_days integer not null default 14 check (balance_due_days between 0 and 365),
  security_deposit_cents integer not null default 0 check (security_deposit_cents >= 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

insert into public.financial_settings (id) values (true) on conflict (id) do nothing;

alter table public.financial_settings enable row level security;

create policy "staff read financial settings" on public.financial_settings
  for select to authenticated
  using (public.current_app_role() in ('admin', 'concierge', 'read_only'));

create policy "admin manage financial settings" on public.financial_settings
  for all to authenticated
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

create trigger financial_settings_updated_at
  before update on public.financial_settings
  for each row execute function public.set_updated_at();

comment on table public.financial_settings is
  'Version administrable des règles financières appliquées aux nouvelles réservations.';

commit;
