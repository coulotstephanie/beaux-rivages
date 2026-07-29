-- Beaux Rivages Revenue & Marketing Engine V1

alter table public.guests
  add column if not exists locale text not null default 'fr' check (locale in ('fr', 'en', 'de')),
  add column if not exists country_code text,
  add column if not exists acquisition_channel text not null default 'direct',
  add column if not exists birthday date,
  add column if not exists allergies text,
  add column if not exists sleeping_preferences text,
  add column if not exists arrival_preferences text,
  add column if not exists internal_notes text,
  add column if not exists special_requests text,
  add column if not exists preferred_property_id uuid references public.properties(id) on delete set null,
  add column if not exists preferred_experience_codes text[] not null default '{}';

create table public.loyalty_accounts (
  guest_id uuid primary key references public.guests(id) on delete cascade,
  tier text not null default 'decouverte' check (tier in ('decouverte', 'insulaire', 'grand-large', 'ambassadeur')),
  qualifying_stays integer not null default 0,
  qualifying_spend_cents bigint not null default 0,
  benefits jsonb not null default '[]',
  evaluated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique,
  qr_token_hash text not null unique,
  purchaser_guest_id uuid references public.guests(id) on delete set null,
  recipient_name text,
  recipient_email_hash text,
  initial_amount_cents integer not null check (initial_amount_cents > 0),
  balance_cents integer not null check (balance_cents >= 0),
  currency text not null default 'EUR' check (currency = 'EUR'),
  status text not null default 'draft' check (status in ('draft', 'active', 'redeemed', 'expired', 'cancelled')),
  expires_at timestamptz not null,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gift_card_uses (
  id uuid primary key default gen_random_uuid(),
  gift_card_id uuid not null references public.gift_cards(id) on delete restrict,
  reservation_id uuid references public.reservations(id) on delete set null,
  amount_cents integer not null check (amount_cents > 0),
  idempotency_key text not null unique,
  used_at timestamptz not null default now()
);

create table public.revenue_promotions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  discount_type text not null check (discount_type in ('fixed', 'percentage')),
  value integer not null check (value > 0),
  minimum_stay_nights integer,
  direct_only boolean not null default true,
  low_season_only boolean not null default false,
  returning_guests_only boolean not null default false,
  property_ids uuid[] not null default '{}',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  enabled boolean not null default true,
  usage_limit integer,
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (discount_type <> 'percentage' or value <= 100)
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referral_code text not null unique,
  referrer_guest_id uuid not null references public.guests(id) on delete cascade,
  referred_guest_id uuid references public.guests(id) on delete set null,
  referrer_benefit jsonb not null,
  referred_benefit jsonb not null,
  status text not null default 'invited' check (status in ('invited', 'qualified', 'rewarded', 'cancelled')),
  qualified_reservation_id uuid references public.reservations(id) on delete set null,
  created_at timestamptz not null default now(),
  rewarded_at timestamptz
);

create table public.premium_experiences (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  image_path text,
  enabled boolean not null default true,
  property_ids uuid[] not null default '{}',
  rules jsonb not null default '{}',
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled')),
  locale text not null default 'fr' check (locale in ('fr', 'en', 'de')),
  subject text not null,
  preheader text,
  content_blocks jsonb not null default '[]',
  audience_rules jsonb not null default '{}',
  scheduled_at timestamptz,
  sent_count integer not null default 0,
  delivered_count integer not null default 0,
  opened_count integer not null default 0,
  clicked_count integer not null default 0,
  booking_count integer not null default 0,
  revenue_cents bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketing_automations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trigger_type text not null check (trigger_type in ('post_stay_90d', 'post_stay_1y', 'birthday', 'easter', 'may_holiday', 'summer', 'autumn', 'christmas', 'review_request')),
  campaign_id uuid references public.marketing_campaigns(id) on delete set null,
  enabled boolean not null default false,
  delay_days integer not null default 0,
  rules jsonb not null default '{}',
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_requests (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  platform text not null check (platform in ('airbnb', 'booking', 'google', 'direct')),
  status text not null default 'scheduled' check (status in ('scheduled', 'sent', 'clicked', 'reviewed', 'cancelled')),
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  reviewed_at timestamptz,
  rating numeric(2,1),
  review_external_id text,
  response_text text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create index loyalty_accounts_tier_idx on public.loyalty_accounts (tier);
create index gift_cards_status_expiry_idx on public.gift_cards (status, expires_at);
create index revenue_promotions_active_idx on public.revenue_promotions (enabled, starts_at, ends_at);
create index marketing_campaigns_status_schedule_idx on public.marketing_campaigns (status, scheduled_at);
create index review_requests_status_schedule_idx on public.review_requests (status, scheduled_at);

alter table public.loyalty_accounts enable row level security;
alter table public.gift_cards enable row level security;
alter table public.gift_card_uses enable row level security;
alter table public.revenue_promotions enable row level security;
alter table public.referrals enable row level security;
alter table public.premium_experiences enable row level security;
alter table public.marketing_campaigns enable row level security;
alter table public.marketing_automations enable row level security;
alter table public.review_requests enable row level security;

do $$
declare table_name text;
begin
  foreach table_name in array array['loyalty_accounts','gift_cards','gift_card_uses','revenue_promotions','referrals','premium_experiences','marketing_campaigns','marketing_automations','review_requests']
  loop
    execute format('create policy "staff read %1$s" on public.%1$I for select to authenticated using (public.current_app_role() is not null)', table_name);
    execute format('create policy "staff manage %1$s" on public.%1$I for all to authenticated using (public.current_app_role() in (''admin'', ''concierge'')) with check (public.current_app_role() in (''admin'', ''concierge''))', table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated, service_role', table_name);
  end loop;
end $$;

revoke all on public.gift_cards, public.gift_card_uses, public.referrals from public, anon;

create trigger loyalty_accounts_updated_at before update on public.loyalty_accounts for each row execute function public.set_updated_at();
create trigger gift_cards_updated_at before update on public.gift_cards for each row execute function public.set_updated_at();
create trigger revenue_promotions_updated_at before update on public.revenue_promotions for each row execute function public.set_updated_at();
create trigger premium_experiences_updated_at before update on public.premium_experiences for each row execute function public.set_updated_at();
create trigger marketing_campaigns_updated_at before update on public.marketing_campaigns for each row execute function public.set_updated_at();
create trigger marketing_automations_updated_at before update on public.marketing_automations for each row execute function public.set_updated_at();

insert into public.premium_experiences (code, label, description, price_cents, sort_order)
values
  ('signature', 'Pack Signature', 'Une arrivée mise en scène avec les attentions Beaux Rivages.', 14900, 10),
  ('romance', 'Pack Romance', 'Une attention délicate pour célébrer le séjour à deux.', 8900, 20),
  ('aperitif', 'Panier Apéritif', 'Une sélection locale à partager dès l’arrivée.', 5900, 30),
  ('sweet', 'Panier Douceur', 'Une parenthèse gourmande préparée dans la maison.', 3900, 40),
  ('linen', 'Linge préparé', 'Lits et linge prêts pour voyager plus léger.', 2500, 50),
  ('beach-towels', 'Serviettes de plage', 'Le nécessaire prêt pour rejoindre le rivage.', 1200, 60),
  ('bathrobes', 'Peignoirs', 'Une attention confortable pour les matins tranquilles.', 1800, 70),
  ('late-check-out', 'Départ tardif', 'Prolonger la dernière matinée, selon disponibilité.', 6000, 80),
  ('early-check-in', 'Arrivée anticipée', 'Commencer la parenthèse plus tôt, après confirmation.', 6000, 90),
  ('personal-arrival', 'Arrivée personnalisée', 'Un accueil personnel pensé avec Stéphanie et Bruno.', 4500, 100),
  ('pet', 'Accueil de votre compagnon', 'Des attentions utiles pour son arrivée dans la maison.', 3500, 110)
on conflict (code) do update set label = excluded.label, description = excluded.description, price_cents = excluded.price_cents, sort_order = excluded.sort_order;
