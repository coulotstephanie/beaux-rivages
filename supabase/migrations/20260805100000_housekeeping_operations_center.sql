begin;

create table public.housekeeping_templates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  name text not null,
  task_type text not null check (task_type in ('cleaning','quality','arrival','linen','experience','stock')),
  checklist jsonb not null default '[]' check (jsonb_typeof(checklist) = 'array'),
  active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(property_id,name)
);
create table public.incident_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  default_priority text not null default 'normal' check(default_priority in ('low','normal','high','urgent')),
  active boolean not null default true, created_at timestamptz not null default now()
);
create table public.linen_rotations (
  id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  item text not null, quantity integer not null check(quantity > 0), direction text not null check(direction in ('prepared','sent_to_laundry','returned','discarded')),
  notes text, recorded_by uuid references auth.users(id) on delete set null, recorded_at timestamptz not null default now()
);
create table public.operational_audit_log (
  id bigint generated always as identity primary key,
  entity_type text not null, entity_id text not null, action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  previous_value jsonb, new_value jsonb, comment text, created_at timestamptz not null default now()
);
alter table public.maintenance_incidents add column if not exists category_id uuid references public.incident_categories(id) on delete set null;

alter table public.operational_photos drop constraint if exists operational_photos_kind_check;
alter table public.operational_photos add constraint operational_photos_kind_check check(kind in('before_arrival','after_departure','incident','maintenance','quality','before_cleaning','after_cleaning','before_intervention','after_intervention'));

create index linen_rotations_property_time_idx on public.linen_rotations(property_id,recorded_at desc);
create index operational_audit_entity_idx on public.operational_audit_log(entity_type,entity_id,created_at desc);
alter table public.housekeeping_templates enable row level security;
alter table public.incident_categories enable row level security;
alter table public.linen_rotations enable row level security;
alter table public.operational_audit_log enable row level security;
do $$ declare relation text; begin foreach relation in array array['housekeeping_templates','incident_categories','linen_rotations','operational_audit_log'] loop
execute format('create policy "staff manage %1$s" on public.%1$I for all to authenticated using (public.current_app_role() in (''admin'',''concierge'')) with check (public.current_app_role() in (''admin'',''concierge''))',relation);
execute format('grant select,insert,update,delete on public.%I to authenticated,service_role',relation); end loop; end $$;
create trigger housekeeping_templates_updated_at before update on public.housekeeping_templates for each row execute function public.set_updated_at();

insert into public.incident_categories(name,default_priority) values
('Électricité','high'),('Plomberie','high'),('Électroménager','normal'),('Mobilier','normal'),('Sécurité','urgent'),('Autre','normal') on conflict do nothing;

insert into public.housekeeping_templates(property_id,name,task_type,checklist)
select property.id,'Ménage complet','cleaning','[{"id":"kitchen-fridge","label":"Cuisine · Réfrigérateur","done":false},{"id":"kitchen-oven","label":"Cuisine · Four","done":false},{"id":"kitchen-dishwasher","label":"Cuisine · Lave-vaisselle","done":false},{"id":"kitchen-coffee","label":"Cuisine · Cafetière","done":false},{"id":"bath-shower","label":"Salle de bain · Douche","done":false},{"id":"bath-wc","label":"Salle de bain · WC","done":false},{"id":"bath-mirrors","label":"Salle de bain · Miroirs","done":false},{"id":"living-floor","label":"Salon · Sol","done":false},{"id":"living-tv","label":"Salon · Télévision","done":false},{"id":"living-sofa","label":"Salon · Canapé","done":false},{"id":"outside","label":"Extérieur · Terrasse, mobilier et barbecue","done":false},{"id":"linen","label":"Linge préparé selon les voyageurs","done":false},{"id":"stock","label":"Consommables vérifiés","done":false}]'::jsonb
from public.properties property on conflict do nothing;

create or replace function public.generate_housekeeping_for_reservation()
returns trigger language plpgsql security definer set search_path=public as $$
declare base_checklist jsonb; additions jsonb; begin
  if new.status not in ('confirmed','requested') or (tg_op='UPDATE' and old.status=new.status and old.departure=new.departure) then return new; end if;
  select checklist into base_checklist from public.housekeeping_templates where property_id=new.property_id and task_type='cleaning' and active limit 1;
  select coalesce(jsonb_agg(jsonb_build_object('id','service-'||item.id,'label','Préparer · '||item.label,'done',false)),'[]'::jsonb) into additions
  from public.reservation_items item where item.reservation_id=new.id and item.kind in ('option','experience','basket');
  insert into public.housekeeping_tasks(property_id,reservation_id,scheduled_for,status,operational_status,checklist,notes)
  values(new.property_id,new.id,new.departure::timestamp + interval '1 hour','todo','to_prepare',coalesce(base_checklist,'[]'::jsonb)||additions,'Générée automatiquement depuis la réservation '||new.reference)
  on conflict do nothing;
  return new;
end; $$;
create unique index housekeeping_one_task_per_reservation on public.housekeeping_tasks(reservation_id) where reservation_id is not null;
create trigger reservation_generate_housekeeping after insert or update of status,departure on public.reservations for each row execute function public.generate_housekeeping_for_reservation();

-- Reservation services can be persisted after the reservation itself. Keep the
-- preparation checklist aligned with that canonical source of truth.
create or replace function public.sync_reservation_item_to_housekeeping()
returns trigger language plpgsql security definer set search_path=public as $$
declare reservation_uuid uuid; item_uuid uuid; begin
  reservation_uuid := case when tg_op='DELETE' then old.reservation_id else new.reservation_id end;
  item_uuid := case when tg_op='DELETE' then old.id else new.id end;
  update public.housekeeping_tasks task set checklist =
    coalesce((select jsonb_agg(entry) from jsonb_array_elements(task.checklist) entry where entry->>'id' <> 'service-'||item_uuid),'[]'::jsonb)
    || case when tg_op='DELETE' or new.kind not in ('option','experience','basket') then '[]'::jsonb
       else jsonb_build_array(jsonb_build_object('id','service-'||new.id,'label','Préparer · '||new.label,'done',false)) end
  where task.reservation_id=reservation_uuid;
  if tg_op='DELETE' then return old; end if;
  return new;
end; $$;
create trigger reservation_item_sync_housekeeping after insert or update or delete on public.reservation_items for each row execute function public.sync_reservation_item_to_housekeeping();

commit;
