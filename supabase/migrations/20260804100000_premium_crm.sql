begin;

create table public.traveler_profiles (
  id uuid primary key default gen_random_uuid(),
  normalized_email text not null unique check (normalized_email = lower(trim(normalized_email))),
  first_name text not null,
  last_name text not null,
  phone text,
  address_line1 text,
  address_line2 text,
  postal_code text,
  city text,
  country_code char(2) default 'FR',
  locale text not null default 'fr' check (locale in ('fr','en','de','es')),
  preferred_property_id uuid references public.properties(id) on delete set null,
  floor_preference text,
  room_preference text,
  sleeping_preferences text,
  arrival_preferences text,
  allergies text,
  dietary_preferences text,
  useful_comments text,
  internal_notes text,
  loyalty_override text check (loyalty_override is null or loyalty_override in ('new','loyal','regular','vip')),
  birthday date,
  birthday_processing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guest_profile_links (
  guest_id uuid primary key references public.guests(id) on delete cascade,
  profile_id uuid not null references public.traveler_profiles(id) on delete cascade,
  linked_at timestamptz not null default now()
);
create index guest_profile_links_profile_idx on public.guest_profile_links(profile_id);

create table public.traveler_pets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.traveler_profiles(id) on delete cascade,
  name text,
  animal_type text not null default 'chien',
  useful_information text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.traveler_children (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.traveler_profiles(id) on delete cascade,
  first_name text,
  birth_year smallint check (birth_year is null or birth_year between 2000 and 2100),
  equipment_preferences text[] not null default '{}',
  useful_information text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.traveler_profiles(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  kind text not null check (kind in ('email','reminder','message','call','internal_note','document','system')),
  direction text not null default 'internal' check (direction in ('incoming','outgoing','internal')),
  subject text not null,
  details text,
  occurred_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index crm_activities_profile_time_idx on public.crm_activities(profile_id, occurred_at desc);

create table public.crm_change_log (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.traveler_profiles(id) on delete cascade,
  entity_type text not null check (entity_type in ('profile','pet','child','activity','loyalty')),
  entity_id uuid,
  previous_value jsonb,
  new_value jsonb,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);
create index crm_change_log_profile_time_idx on public.crm_change_log(profile_id, changed_at desc);

create or replace function public.link_guest_to_traveler_profile()
returns trigger language plpgsql security definer set search_path = public as $$
declare profile_uuid uuid;
begin
  insert into public.traveler_profiles(
    normalized_email,first_name,last_name,phone,address_line1,address_line2,postal_code,city,
    country_code,locale,allergies,sleeping_preferences,arrival_preferences,internal_notes,
    preferred_property_id,birthday
  ) values (
    lower(trim(new.email)),new.first_name,new.last_name,new.phone,new.address_line1,new.address_line2,
    new.postal_code,new.city,new.country_code,coalesce(new.locale,'fr'),new.allergies,
    new.sleeping_preferences,new.arrival_preferences,new.internal_notes,new.preferred_property_id,new.birthday
  ) on conflict(normalized_email) do update set
    first_name=excluded.first_name,last_name=excluded.last_name,
    phone=coalesce(excluded.phone,traveler_profiles.phone),
    address_line1=coalesce(excluded.address_line1,traveler_profiles.address_line1),
    postal_code=coalesce(excluded.postal_code,traveler_profiles.postal_code),
    city=coalesce(excluded.city,traveler_profiles.city),updated_at=now()
  returning id into profile_uuid;
  insert into public.guest_profile_links(guest_id,profile_id) values(new.id,profile_uuid)
  on conflict(guest_id) do update set profile_id=excluded.profile_id;
  return new;
end;
$$;

create trigger guest_crm_profile_link after insert or update of email on public.guests
for each row execute function public.link_guest_to_traveler_profile();

insert into public.traveler_profiles(
  normalized_email,first_name,last_name,phone,address_line1,address_line2,postal_code,city,
  country_code,locale,allergies,sleeping_preferences,arrival_preferences,internal_notes,
  preferred_property_id,birthday,created_at,updated_at
)
select distinct on (lower(trim(email))) lower(trim(email)),first_name,last_name,phone,address_line1,
  address_line2,postal_code,city,country_code,locale,allergies,sleeping_preferences,
  arrival_preferences,internal_notes,preferred_property_id,birthday,created_at,updated_at
from public.guests order by lower(trim(email)),updated_at desc
on conflict(normalized_email) do nothing;

insert into public.guest_profile_links(guest_id,profile_id)
select guest.id,profile.id from public.guests guest
join public.traveler_profiles profile on profile.normalized_email=lower(trim(guest.email))
on conflict do nothing;

alter table public.traveler_profiles enable row level security;
alter table public.guest_profile_links enable row level security;
alter table public.traveler_pets enable row level security;
alter table public.traveler_children enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_change_log enable row level security;

create policy "staff manage traveler profiles" on public.traveler_profiles for all to authenticated
using (public.current_app_role() in ('admin','concierge')) with check (public.current_app_role() in ('admin','concierge'));
create policy "staff manage guest profile links" on public.guest_profile_links for all to authenticated
using (public.current_app_role() in ('admin','concierge')) with check (public.current_app_role() in ('admin','concierge'));
create policy "staff manage traveler pets" on public.traveler_pets for all to authenticated
using (public.current_app_role() in ('admin','concierge')) with check (public.current_app_role() in ('admin','concierge'));
create policy "staff manage traveler children" on public.traveler_children for all to authenticated
using (public.current_app_role() in ('admin','concierge')) with check (public.current_app_role() in ('admin','concierge'));
create policy "staff manage crm activities" on public.crm_activities for all to authenticated
using (public.current_app_role() in ('admin','concierge')) with check (public.current_app_role() in ('admin','concierge'));
create policy "staff read crm change log" on public.crm_change_log for select to authenticated
using (public.current_app_role() in ('admin','concierge'));
create policy "staff write crm change log" on public.crm_change_log for insert to authenticated
with check (public.current_app_role() in ('admin','concierge'));

create trigger traveler_profiles_updated_at before update on public.traveler_profiles for each row execute function public.set_updated_at();
create trigger traveler_pets_updated_at before update on public.traveler_pets for each row execute function public.set_updated_at();
create trigger traveler_children_updated_at before update on public.traveler_children for each row execute function public.set_updated_at();

comment on table public.traveler_profiles is 'Canonical privacy-aware CRM profile, unique by normalized email.';
comment on column public.traveler_profiles.birthday_processing_consent_at is 'Explicit consent required before birthday reminders or segmentation.';

commit;
