create table public.concierge_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label_fr text not null, label_en text not null, label_de text not null,
  description_fr text, description_en text, description_de text,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.concierge_experiences (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.concierge_categories(id) on delete restrict,
  code text not null unique,
  title_fr text not null, title_en text not null, title_de text not null,
  description_fr text not null, description_en text not null, description_de text not null,
  inclusions jsonb not null default '{}',
  image_path text,
  price_cents integer not null check (price_cents >= 0),
  pricing_unit text not null default 'stay' check (pricing_unit in ('stay','person','day','unit','request')),
  requires_confirmation boolean not null default false,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.concierge_orders (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  status text not null default 'requested' check (status in ('draft','requested','confirmed','partially_confirmed','declined','payment_pending','paid','preparing','delivered','cancelled')),
  locale text not null default 'fr' check (locale in ('fr','en','de')),
  promotion_code text,
  subtotal_cents integer not null default 0,
  discount_cents integer not null default 0,
  total_cents integer not null default 0,
  payment_id uuid references public.payments(id) on delete set null,
  guest_message text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.concierge_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.concierge_orders(id) on delete cascade,
  experience_id uuid not null references public.concierge_experiences(id) on delete restrict,
  quantity integer not null default 1 check (quantity between 1 and 30),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_cents integer generated always as (quantity * unit_price_cents) stored,
  status text not null default 'requested' check (status in ('requested','confirmed','declined','preparing','delivered','cancelled')),
  scheduled_for timestamptz,
  customization jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create table public.concierge_special_requests (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  occasion text not null,
  details text not null,
  allergies text,
  dietary_requirements text,
  status text not null default 'requested' check (status in ('requested','reviewing','accepted','declined','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index concierge_orders_reservation_idx on public.concierge_orders(reservation_id,created_at desc);
create index concierge_items_order_idx on public.concierge_order_items(order_id);
create index concierge_requests_reservation_idx on public.concierge_special_requests(reservation_id,created_at desc);
alter table public.concierge_categories enable row level security;
alter table public.concierge_experiences enable row level security;
alter table public.concierge_orders enable row level security;
alter table public.concierge_order_items enable row level security;
alter table public.concierge_special_requests enable row level security;
create policy "public read concierge categories" on public.concierge_categories for select to anon,authenticated using (enabled);
create policy "public read concierge experiences" on public.concierge_experiences for select to anon,authenticated using (enabled);
do $$ declare relation text; begin
  foreach relation in array array['concierge_categories','concierge_experiences','concierge_orders','concierge_order_items','concierge_special_requests'] loop
    execute format('create policy "staff manage %1$s" on public.%1$I for all to authenticated using (public.current_app_role() in (''admin'',''concierge'')) with check (public.current_app_role() in (''admin'',''concierge''))',relation);
    execute format('grant select,insert,update,delete on public.%I to authenticated,service_role',relation);
  end loop;
end $$;
grant select on public.concierge_categories,public.concierge_experiences to anon;
create trigger concierge_categories_updated_at before update on public.concierge_categories for each row execute function public.set_updated_at();
create trigger concierge_experiences_updated_at before update on public.concierge_experiences for each row execute function public.set_updated_at();
create trigger concierge_orders_updated_at before update on public.concierge_orders for each row execute function public.set_updated_at();
create trigger concierge_special_requests_updated_at before update on public.concierge_special_requests for each row execute function public.set_updated_at();

insert into public.concierge_categories(code,label_fr,label_en,label_de,sort_order) values
('signature','Expériences','Experiences','Erlebnisse',1),('services','Services','Services','Services',2),('gourmet','Paniers gourmands','Gourmet baskets','Genusskörbe',3),('wellness','Bien-être','Wellness','Wellness',4),('family','Famille','Family','Familie',5),('pets','Animaux','Pets','Haustiere',6),('mobility','Mobilité','Mobility','Mobilität',7),('activities','Découvertes','Discoveries','Entdeckungen',8);
insert into public.concierge_experiences(category_id,code,title_fr,title_en,title_de,description_fr,description_en,description_de,inclusions,price_cents,pricing_unit,requires_confirmation,sort_order)
select c.id,v.code,v.fr,v.en,v.de,v.description,v.description,v.description,v.inclusions::jsonb,v.price,v.unit,v.confirmation,v.sort
from public.concierge_categories c join (values
('signature','signature','Pack Signature Beaux Rivages','Beaux Rivages Signature Pack','Beaux Rivages Signature-Paket','Le séjour préparé dans ses moindres détails.','["Linge complet","Serviettes de plage","Deux peignoirs","Arrivée anticipée si disponible","Cadeau de bienvenue","Panier au choix","Attention personnalisée"]',14500,'stay',true,1),
('signature','romance','Escapade Romance','Romance Escape','Romantische Auszeit','Une atmosphère délicate préparée pour deux.','["Bougies LED","Pétales","Chocolats","Carte personnalisée","Peignoirs","Huile de massage","Départ tardif selon disponibilité"]',9500,'stay',true,2),
('gourmet','basket-aperitif','Panier Apéritif','Aperitif Basket','Aperitifkorb','Saveurs locales à partager dès votre arrivée.','["Produits locaux","Boisson sans alcool","Biscuits salés"]',4800,'unit',false,1),
('gourmet','basket-breakfast','Panier Petit-déjeuner','Breakfast Basket','Frühstückskorb','Un premier réveil tout en douceur.','["Viennoiseries","Confiture locale","Jus","Boisson chaude"]',4200,'unit',true,2),
('services','linen','Linge complet','Complete Linen','Komplettes Wäschepaket','Lits préparés et linge de toilette.','["Draps","Serviettes","Lits préparés"]',2000,'person',false,1),
('services','early-checkin','Arrivée anticipée','Early Check-in','Früher Check-in','Profitez de la maison un peu plus tôt, selon disponibilité.','[]',4500,'stay',true,2),
('services','late-checkout','Départ tardif','Late Check-out','Später Check-out','Prolongez les derniers instants, selon disponibilité.','[]',5500,'stay',true,3),
('family','baby-kit','Équipement bébé','Baby Equipment','Babyausstattung','Voyagez plus léger avec l’essentiel pour bébé.','["Lit bébé","Chaise haute","Petite vaisselle"]',2500,'stay',true,1),
('pets','pet-welcome','Accueil animal','Pet Welcome','Haustier-Willkommen','Gamelles, conseils de balades et plages autorisées.','["Gamelles","Guide des balades","Conseils plages"]',2500,'stay',false,1),
('mobility','bikes','Vélos livrés à la maison','Bikes Delivered','Fahrradlieferung','Location et livraison par un partenaire local.','["Livraison","Antivol","Conseils itinéraires"]',0,'request',true,1),
('wellness','massage','Massage à domicile','In-home Massage','Massage zu Hause','Un moment de détente avec un partenaire sélectionné.','[]',0,'request',true,1),
('activities','oyster-tasting','Dégustation d’huîtres','Oyster Tasting','Austernverkostung','Rencontre gourmande avec un producteur local.','[]',0,'request',true,1)
) as v(category,code,fr,en,de,description,inclusions,price,unit,confirmation,sort) on c.code=v.category;
