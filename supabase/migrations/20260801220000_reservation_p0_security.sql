-- P0 reservation integrity: canonical services, special requests and chronological journal.
create table public.reservation_items (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  kind text not null check (kind in ('option','experience','basket')),
  code text not null,
  label text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null default 0 check (unit_price_cents >= 0),
  total_cents integer generated always as (quantity * unit_price_cents) stored,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (reservation_id, kind, code)
);

create table public.reservation_special_requests (
  reservation_id uuid primary key references public.reservations(id) on delete cascade,
  occasion text,
  message text,
  allergies text,
  late_arrival text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservation_events (
  id bigint generated always as identity primary key,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  event_type text not null,
  origin text not null check (origin in ('traveler','administration','system')),
  actor_id uuid references auth.users(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.reservation_documents (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  kind text not null check (kind in ('quote','contract')),
  status text not null default 'draft' check (status in ('draft','issued','signed','void')),
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(reservation_id,kind)
);

create index reservation_items_reservation_idx on public.reservation_items(reservation_id,kind);
create index reservation_events_reservation_time_idx on public.reservation_events(reservation_id,occurred_at desc);
alter table public.reservation_items enable row level security;
alter table public.reservation_special_requests enable row level security;
alter table public.reservation_events enable row level security;
alter table public.reservation_documents enable row level security;

create policy reservation_items_staff_read on public.reservation_items for select to authenticated
using (public.current_app_role() in ('owner','admin','staff','accountant','maintenance'));
create policy reservation_requests_staff_read on public.reservation_special_requests for select to authenticated
using (public.current_app_role() in ('owner','admin','staff'));
create policy reservation_events_staff_read on public.reservation_events for select to authenticated
using (public.current_app_role() in ('owner','admin','staff','accountant','maintenance'));
create policy reservation_documents_staff_read on public.reservation_documents for select to authenticated
using (public.current_app_role() in ('owner','admin','staff','accountant'));

create function public.persist_reservation_context()
returns trigger language plpgsql security definer set search_path = '' as $$
declare item jsonb; request jsonb;
begin
  for item in select * from jsonb_array_elements(coalesce(new.quote_snapshot->'services','[]'::jsonb)) loop
    insert into public.reservation_items(reservation_id,kind,code,label,quantity,unit_price_cents,metadata)
    values(new.id,item->>'kind',item->>'code',item->>'label',greatest(coalesce((item->>'quantity')::int,1),1),coalesce((item->>'unitPriceCents')::int,0),item)
    on conflict (reservation_id,kind,code) do update set
      label=excluded.label,quantity=excluded.quantity,unit_price_cents=excluded.unit_price_cents,metadata=excluded.metadata;
  end loop;
  request := new.quote_snapshot->'specialRequests';
  if request is not null and request <> 'null'::jsonb then
    insert into public.reservation_special_requests(reservation_id,occasion,message,allergies,late_arrival)
    values(new.id,nullif(request->>'occasion',''),nullif(request->>'message',''),nullif(request->>'allergies',''),nullif(request->>'lateArrival',''))
    on conflict (reservation_id) do update set occasion=excluded.occasion,message=excluded.message,
      allergies=excluded.allergies,late_arrival=excluded.late_arrival,updated_at=now();
  end if;
  insert into public.reservation_events(reservation_id,event_type,origin,details)
  values(new.id,'reservation.created',case when new.channel='direct' then 'traveler' else 'administration' end,
    jsonb_build_object('reference',new.reference,'calendarValidation',new.quote_snapshot->'calendarValidation'));
  if new.quote_snapshot->'calendarValidation' is not null then
    insert into public.reservation_events(reservation_id,event_type,origin,details)
    values(new.id,'calendar.validated','system',new.quote_snapshot->'calendarValidation');
  end if;
  if new.quote_snapshot->'manualOverride' is not null and new.quote_snapshot->'manualOverride' <> 'null'::jsonb then
    insert into public.reservation_events(reservation_id,event_type,origin,actor_id,details)
    values(new.id,'price.overridden','administration',auth.uid(),new.quote_snapshot->'manualOverride');
  end if;
  insert into public.reservation_documents(reservation_id,kind,snapshot)
  values
    (new.id,'quote',jsonb_build_object(
      'reservationId',new.id,'reference',new.reference,'propertyId',new.property_id,
      'arrival',new.arrival,'departure',new.departure,'adults',new.adults,'children',new.children,
      'babies',new.babies,'pets',new.pets,'services',new.quote_snapshot->'services',
      'specialRequests',new.quote_snapshot->'specialRequests','financials',new.quote_snapshot
    )),
    (new.id,'contract',jsonb_build_object(
      'reservationId',new.id,'reference',new.reference,'propertyId',new.property_id,
      'arrival',new.arrival,'departure',new.departure,'adults',new.adults,'children',new.children,
      'babies',new.babies,'pets',new.pets,'services',new.quote_snapshot->'services',
      'specialRequests',new.quote_snapshot->'specialRequests','financials',new.quote_snapshot
    ));
  insert into public.contracts(reservation_id,number,status)
  values(new.id,'CTR-' || new.reference || '-V1','draft') on conflict(reservation_id,version) do nothing;
  return new;
end $$;

create trigger reservation_context_after_insert after insert on public.reservations
for each row execute function public.persist_reservation_context();

create function public.prevent_reservation_overlap()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.property_id::text,0));
  if exists (
    select 1 from public.occupancy_blocks b
    where b.property_id=new.property_id
      and b.stay_range && daterange(new.arrival,new.departure,'[)')
      and (b.reservation_id is null or b.reservation_id <> new.id)
  ) then raise exception using errcode='23P01', message='Reservation dates unavailable'; end if;
  return new;
end $$;
create trigger reservation_no_overlap before insert or update of property_id,arrival,departure on public.reservations
for each row execute function public.prevent_reservation_overlap();

create function public.journal_reservation_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.status is distinct from new.status then
    insert into public.reservation_events(reservation_id,event_type,origin,actor_id,details)
    values(new.id,'status.changed','administration',auth.uid(),jsonb_build_object('from',old.status,'to',new.status));
  elsif old.quote_snapshot is distinct from new.quote_snapshot or old.total_cents is distinct from new.total_cents then
    insert into public.reservation_events(reservation_id,event_type,origin,actor_id,details)
    values(new.id,'reservation.modified','administration',auth.uid(),jsonb_build_object('oldTotalCents',old.total_cents,'newTotalCents',new.total_cents));
  end if;
  return new;
end $$;
create trigger reservation_journal_after_update after update on public.reservations
for each row execute function public.journal_reservation_change();

create function public.journal_reservation_item()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.reservation_events(reservation_id,event_type,origin,actor_id,details)
  values(new.reservation_id,'service.' || case when tg_op='INSERT' then 'added' else 'modified' end,
    case when auth.uid() is null then 'system' else 'administration' end,auth.uid(),
    jsonb_build_object('kind',new.kind,'code',new.code,'quantity',new.quantity,'totalCents',new.total_cents));
  return new;
end $$;
create trigger reservation_item_journal after insert or update on public.reservation_items
for each row execute function public.journal_reservation_item();

create function public.journal_payment_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.reservation_events(reservation_id,event_type,origin,details)
  values(new.reservation_id,
    case when tg_op='UPDATE' and new.refunded_cents > old.refunded_cents then 'payment.refunded' else 'payment.' || new.status end,
    'system',jsonb_build_object('paymentId',new.id,'amountCents',new.amount_cents,'refundedCents',new.refunded_cents));
  return new;
end $$;
create trigger payment_journal_after_write after insert or update on public.payments
for each row execute function public.journal_payment_change();

create trigger reservation_special_requests_updated_at before update on public.reservation_special_requests
for each row execute function public.set_updated_at();
create trigger reservation_documents_updated_at before update on public.reservation_documents
for each row execute function public.set_updated_at();

-- Backfill previous reservations from their immutable quote snapshot when possible.
insert into public.reservation_items(reservation_id,kind,code,label,quantity,unit_price_cents,metadata)
select r.id, item->>'kind', item->>'code', item->>'label', greatest(coalesce((item->>'quantity')::int,1),1),
  coalesce((item->>'unitPriceCents')::int,0), item
from public.reservations r cross join lateral jsonb_array_elements(coalesce(r.quote_snapshot->'services','[]'::jsonb)) item
on conflict do nothing;
