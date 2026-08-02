begin;
create extension if not exists pgtap with schema extensions;
select plan(25);

select has_table('public', 'properties', 'properties exists');
select has_table('public', 'property_media', 'property_media exists');
select has_table('public', 'seasons', 'seasons exists');
select has_table('public', 'rates', 'rates exists');
select has_table('public', 'reservations', 'reservations exists');
select has_table('public', 'guests', 'guests exists');
select has_table('public', 'payments', 'payments exists');
select has_table('public', 'contracts', 'contracts exists');
select has_table('public', 'signatures', 'signatures exists');
select has_table('public', 'availability', 'availability exists');
select has_table('public', 'audit_logs', 'audit_logs exists');
select has_column('public', 'properties', 'latitude', 'properties has latitude');
select has_column('public', 'property_media', 'alt_text', 'media has alt text');
select has_column('public', 'reservations', 'quote_snapshot', 'reservation freezes its quote');
select has_function('public', 'is_property_available', array['uuid', 'date', 'date', 'uuid'], 'availability function exists');
select has_function('public', 'calculate_stay_price', array['uuid', 'date', 'date'], 'pricing function exists');
select has_function('public', 'create_direct_reservation', array['text', 'date', 'date', 'jsonb', 'jsonb', 'jsonb', 'text'], 'transactional reservation function exists');
select is((select count(*)::integer from public.properties), 3, 'three properties are seeded');
select ok((select bool_and(relrowsecurity) from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' and relname in ('guests','reservations','payments','contracts','audit_logs')), 'sensitive tables use RLS');
select is((select count(*)::integer from storage.buckets where id in ('contracts','photos','avatars','documents','guestbook','invoices')), 6, 'required private buckets exist');
select isnt(public.generate_reservation_number(), public.generate_reservation_number(), 'reservation references are unique');
select ok(public.is_property_available((select id from public.properties where slug = 'chai-des-tortues'), current_date + 30, current_date + 33), 'empty dates are available');
select is(
  (select count(*)::integer
     from pg_policies
    where schemaname = 'public'
      and 'anon' = any(roles)
      and tablename not in ('guest_book_entries', 'concierge_categories', 'concierge_experiences')),
  0,
  'no table other than explicitly public editorial content has an anonymous policy'
);

insert into public.reservations (
  reference, property_id, status, arrival, departure, adults, total_cents, deposit_due_cents, balance_due_cents
) values (
  'BR-TEST-000001',
  (select id from public.properties where slug = 'chai-des-tortues'),
  'requested', date '2030-05-01', date '2030-05-05', 2, 10000, 3000, 7000
);
select throws_ok(
  $$insert into public.reservations (
      reference, property_id, status, arrival, departure, adults, total_cents, deposit_due_cents, balance_due_cents
    ) values (
      'BR-TEST-000002',
      (select id from public.properties where slug = 'chai-des-tortues'),
      'requested', date '2030-05-03', date '2030-05-07', 2, 10000, 3000, 7000
    )$$,
  '23P01',
  'Property is not available for the requested dates',
  'overlapping direct reservations are rejected'
);
select lives_ok(
  $$insert into public.calendar_events (source_id, external_uid, property_id, status, arrival, departure)
    select source.id, 'overlap-' || source.provider::text,
      source.property_id, 'confirmed', date '2030-06-01', date '2030-06-05'
    from public.calendar_sources source
    where source.property_id = (select id from public.properties where slug = 'nid-d-ete')$$,
  'overlapping external channel copies are accepted'
);

select * from finish();
rollback;
