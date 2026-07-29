alter table public.housekeeping_tasks add column if not exists operational_status text not null default 'to_prepare'
  check (operational_status in ('to_prepare','cleaning','quality_control','ready','maintenance','blocked','urgent'));
alter table public.housekeeping_tasks add column if not exists started_at timestamptz;
alter table public.housekeeping_tasks add column if not exists signature_path text;
alter table public.housekeeping_tasks add column if not exists offline_revision integer not null default 0;

create table public.housekeeping_inspections (
  id uuid primary key default gen_random_uuid(), task_id uuid not null references public.housekeeping_tasks(id) on delete cascade,
  inspector text not null, rating integer check (rating between 1 and 5), remarks text, status text not null default 'pending' check(status in('pending','approved','correction_required')),
  inspected_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.inventory_items (
  id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade,
  room text not null, category text not null, name text not null, quantity integer not null default 1 check(quantity>=0),
  unit_value_cents integer not null default 0 check(unit_value_cents>=0), condition text not null default 'good' check(condition in('new','good','worn','damaged','missing')),
  purchased_on date, warranty_until date, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.stock_items (
  id uuid primary key default gen_random_uuid(), property_id uuid references public.properties(id) on delete cascade,
  category text not null check(category in('linen','towels','bathrobes','pillows','duvets','tableware','appliance','furniture','consumable')),
  name text not null, quantity numeric(10,2) not null default 0, alert_threshold numeric(10,2) not null default 0, unit text not null default 'unité',
  target_quantity numeric(10,2) not null default 0, last_restocked_at timestamptz, unit_cost_cents integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(property_id,name)
);
create table public.operational_photos (
  id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null, housekeeping_task_id uuid references public.housekeeping_tasks(id) on delete set null,
  maintenance_incident_id uuid references public.maintenance_incidents(id) on delete set null,
  kind text not null check(kind in('before_arrival','after_departure','incident','maintenance','quality')),
  storage_path text not null, caption text, taken_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table public.maintenance_interventions (
  id uuid primary key default gen_random_uuid(), incident_id uuid not null references public.maintenance_incidents(id) on delete cascade,
  assignee text, provider text, status text not null default 'planned' check(status in('planned','assigned','postponed','in_progress','completed','cancelled')),
  planned_for timestamptz, completed_at timestamptz, notes text, cost_cents integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.operational_reports (
  id uuid primary key default gen_random_uuid(), property_id uuid references public.properties(id) on delete set null,
  period_start date not null, period_end date not null, report_type text not null check(report_type in('housekeeping','quality','maintenance','inventory','stock')),
  metrics jsonb not null default '{}', summary text, created_at timestamptz not null default now()
);
create index housekeeping_inspection_task_idx on public.housekeeping_inspections(task_id,created_at desc);
create index inventory_property_room_idx on public.inventory_items(property_id,room);
create index stock_alert_idx on public.stock_items(quantity,alert_threshold);
create index operational_photos_property_idx on public.operational_photos(property_id,kind,taken_at desc);
create index interventions_planning_idx on public.maintenance_interventions(status,planned_for);
alter table public.housekeeping_inspections enable row level security; alter table public.inventory_items enable row level security;
alter table public.stock_items enable row level security; alter table public.operational_photos enable row level security;
alter table public.maintenance_interventions enable row level security; alter table public.operational_reports enable row level security;
do $$ declare relation text; begin foreach relation in array array['housekeeping_inspections','inventory_items','stock_items','operational_photos','maintenance_interventions','operational_reports'] loop
execute format('create policy "staff manage %1$s" on public.%1$I for all to authenticated using (public.current_app_role() in (''admin'',''concierge'')) with check (public.current_app_role() in (''admin'',''concierge''))',relation);
execute format('grant select,insert,update,delete on public.%I to authenticated,service_role',relation); end loop; end $$;
create trigger housekeeping_inspections_updated_at before update on public.housekeeping_inspections for each row execute function public.set_updated_at();
create trigger inventory_items_updated_at before update on public.inventory_items for each row execute function public.set_updated_at();
create trigger stock_items_updated_at before update on public.stock_items for each row execute function public.set_updated_at();
create trigger maintenance_interventions_updated_at before update on public.maintenance_interventions for each row execute function public.set_updated_at();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('operations','operations',false,10485760,array['image/jpeg','image/png','image/webp']) on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
create policy "staff manage operational photos" on storage.objects for all to authenticated using(bucket_id='operations' and public.current_app_role() in('admin','concierge')) with check(bucket_id='operations' and public.current_app_role() in('admin','concierge'));

update public.housekeeping_tasks task set checklist=source.checklist::jsonb
from (values
('chai-des-tortues','[{"id":"entrance","label":"Entrée","done":false},{"id":"kitchen","label":"Cuisine","done":false},{"id":"living","label":"Séjour","done":false},{"id":"bedrooms","label":"3 chambres","done":false},{"id":"bathrooms","label":"2 salles d’eau","done":false},{"id":"wc","label":"WC","done":false},{"id":"terrace","label":"Terrasse et mobilier extérieur","done":false},{"id":"airfryer","label":"Air Fryer Ninja","done":false},{"id":"kenwood","label":"Robot Kenwood","done":false},{"id":"coffee","label":"Machine à café","done":false},{"id":"seafood","label":"Matériel fruits de mer","done":false},{"id":"family","label":"Jeux, livres et équipement bébé","done":false},{"id":"beach","label":"Équipement plage","done":false},{"id":"fans","label":"Ventilateurs et rideaux thermiques","done":false},{"id":"wifi","label":"Connexion Wi-Fi et QR Code","done":false},{"id":"bins","label":"Poubelles","done":false},{"id":"welcome","label":"Cadeau et bouteilles d’eau fraîches","done":false},{"id":"book","label":"Livret d’accueil","done":false},{"id":"final","label":"Contrôle final","done":false}]'),
('villa-raie-manta','[{"id":"view","label":"Vue mer","done":false},{"id":"terrace","label":"Terrasse","done":false},{"id":"kitchen","label":"Cuisine","done":false},{"id":"living","label":"Salon","done":false},{"id":"suite","label":"Suite parentale","done":false},{"id":"bedrooms","label":"Chambres","done":false},{"id":"bathroom","label":"Salle de bain et WC","done":false},{"id":"barbecue-clean","label":"Barbecue : nettoyage","done":false},{"id":"barbecue-grid","label":"Barbecue : grille","done":false},{"id":"barbecue-ashes","label":"Barbecue : cendres","done":false},{"id":"outdoor","label":"Salon extérieur et mobilier","done":false},{"id":"wifi","label":"Connexion Wi-Fi","done":false},{"id":"tv","label":"Télévision","done":false},{"id":"book","label":"Livret","done":false},{"id":"welcome","label":"Eau fraîche et cadeau","done":false},{"id":"final","label":"Contrôle final","done":false}]'),
('nid-d-ete','[{"id":"apartment","label":"Appartement","done":false},{"id":"kitchen","label":"Cuisine","done":false},{"id":"living","label":"Salon","done":false},{"id":"bedrooms","label":"Chambres","done":false},{"id":"bathroom","label":"Salle de bain","done":false},{"id":"balcony","label":"Balcon","done":false},{"id":"bike","label":"Local vélo","done":false},{"id":"keys","label":"Clés","done":false},{"id":"gate","label":"Portail et télécommande","done":false},{"id":"book","label":"Livret","done":false},{"id":"wifi","label":"Connexion","done":false},{"id":"beach","label":"Accès plage","done":false},{"id":"final","label":"Contrôle final","done":false}]')
) source(slug,checklist) join public.properties property on property.slug=source.slug where task.property_id=property.id and task.notes='Checklist modèle créée automatiquement';

insert into public.stock_items(property_id,category,name,quantity,alert_threshold,target_quantity,unit)
select property.id,'consumable',item.name,0,item.threshold,item.target,item.unit from public.properties property cross join (values
('Papier toilette',6,18,'rouleau'),('Essuie-tout',2,6,'rouleau'),('Liquide vaisselle',1,3,'flacon'),('Lessive',10,30,'dose'),('Capsules café',12,40,'capsule'),('Éponges',2,6,'unité'),('Produits ménagers',1,3,'flacon'),('Savon',2,8,'unité'),('Shampooing',2,8,'unité'),('Sacs poubelle',8,25,'sac')
) item(name,threshold,target,unit) on conflict(property_id,name) do nothing;
