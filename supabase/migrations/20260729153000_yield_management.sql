create table public.yield_strategies (
 id uuid primary key default gen_random_uuid(),property_id uuid not null references public.properties(id) on delete cascade,
 name text not null default 'Stratégie principale',enabled boolean not null default true,
 minimum_rate_cents integer not null check(minimum_rate_cents>=0),maximum_rate_cents integer not null check(maximum_rate_cents>=minimum_rate_cents),
 target_occupancy numeric(5,2) not null default 75 check(target_occupancy between 0 and 100),
 last_minute_days integer not null default 14,early_booking_days integer not null default 120,
 maximum_increase_percentage numeric(5,2) not null default 30,maximum_decrease_percentage numeric(5,2) not null default 20,
 occupancy_weight numeric(5,2) not null default 1,lead_time_weight numeric(5,2) not null default 1,event_weight numeric(5,2) not null default 1,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(property_id)
);
create table public.demand_events (
 id uuid primary key default gen_random_uuid(),name text not null,kind text not null check(kind in('school_holiday','public_holiday','local_event','seasonal')),
 date_range daterange not null,impact_percentage numeric(5,2) not null default 0 check(impact_percentage between -50 and 100),
 applies_to_property_ids uuid[] not null default '{}',source text,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.yield_recommendations (
 id uuid primary key default gen_random_uuid(),property_id uuid not null references public.properties(id) on delete cascade,
 stay_date date not null,base_rate_cents integer not null,recommended_rate_cents integer not null,
 occupancy_rate numeric(5,2) not null default 0,lead_days integer not null,factors jsonb not null default '[]',
 confidence numeric(5,2) not null default 0 check(confidence between 0 and 100),
 status text not null default 'pending' check(status in('pending','accepted','rejected','expired','superseded')),
 decided_by text,decision_note text,decided_at timestamptz,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(property_id,stay_date,status)
);
create table public.yield_rate_overrides (
 id uuid primary key default gen_random_uuid(),property_id uuid not null references public.properties(id) on delete cascade,
 recommendation_id uuid references public.yield_recommendations(id) on delete set null,stay_date date not null,
 nightly_rate_cents integer not null check(nightly_rate_cents>=0),minimum_nights integer check(minimum_nights between 1 and 60),
 status text not null default 'active' check(status in('active','cancelled','expired')),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(property_id,stay_date)
);
create table public.yield_decision_logs (
 id uuid primary key default gen_random_uuid(),recommendation_id uuid references public.yield_recommendations(id) on delete set null,
 action text not null check(action in('generated','accepted','rejected','cancelled','expired')),before_data jsonb,after_data jsonb,actor text not null,created_at timestamptz not null default now()
);
create index demand_events_range_idx on public.demand_events using gist(date_range);
create index yield_recommendations_pending_idx on public.yield_recommendations(status,stay_date);
create index yield_overrides_date_idx on public.yield_rate_overrides(property_id,stay_date,status);
alter table public.yield_strategies enable row level security;alter table public.demand_events enable row level security;alter table public.yield_recommendations enable row level security;alter table public.yield_rate_overrides enable row level security;alter table public.yield_decision_logs enable row level security;
do $$ declare relation text;begin foreach relation in array array['yield_strategies','demand_events','yield_recommendations','yield_rate_overrides','yield_decision_logs'] loop execute format('create policy "staff read %1$s" on public.%1$I for select to authenticated using(public.current_app_role() is not null)',relation);execute format('create policy "admins manage %1$s" on public.%1$I for all to authenticated using(public.current_app_role()=''admin'') with check(public.current_app_role()=''admin'')',relation);execute format('grant select,insert,update,delete on public.%I to authenticated,service_role',relation);end loop;end$$;
create trigger yield_strategies_updated_at before update on public.yield_strategies for each row execute function public.set_updated_at();create trigger demand_events_updated_at before update on public.demand_events for each row execute function public.set_updated_at();create trigger yield_recommendations_updated_at before update on public.yield_recommendations for each row execute function public.set_updated_at();create trigger yield_rate_overrides_updated_at before update on public.yield_rate_overrides for each row execute function public.set_updated_at();
insert into public.yield_strategies(property_id,minimum_rate_cents,maximum_rate_cents,target_occupancy)
select id,case slug when 'villa-raie-manta' then 12000 when 'chai-des-tortues' then 13000 else 9000 end,case slug when 'villa-raie-manta' then 55000 when 'chai-des-tortues' then 60000 else 35000 end,75 from public.properties on conflict(property_id)do nothing;
insert into public.demand_events(name,kind,date_range,impact_percentage,source)values
('Vacances de Noël 2026','school_holiday','[2026-12-19,2027-01-04)'::daterange,15,'Calendrier initial Beaux Rivages'),
('Jour de l’An','public_holiday','[2027-01-01,2027-01-02)'::daterange,10,'Calendrier initial Beaux Rivages'),
('Haute saison littorale','seasonal','[2026-07-01,2026-09-01)'::daterange,20,'Stratégie Beaux Rivages')
on conflict do nothing;
