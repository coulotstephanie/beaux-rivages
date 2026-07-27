do $verification$
declare
  chai_id uuid;
  nid_id uuid;
  rls_ok boolean;
  anonymous_policy_count integer;
  bucket_count integer;
begin
  select id into chai_id from public.properties where slug = 'chai-des-tortues';
  select id into nid_id from public.properties where slug = 'nid-d-ete';
  if chai_id is null or nid_id is null then
    raise exception 'Property seed verification failed';
  end if;

  select bool_and(relrowsecurity) into rls_ok
  from pg_class
  where relnamespace = 'public'::regnamespace
    and relkind = 'r'
    and relname in ('guests', 'reservations', 'payments', 'contracts', 'audit_logs');
  if not coalesce(rls_ok, false) then
    raise exception 'RLS verification failed';
  end if;

  select count(*) into anonymous_policy_count
  from pg_policies
  where schemaname = 'public' and 'anon' = any(roles);
  if anonymous_policy_count <> 0 then
    raise exception 'Anonymous policies must not expose business tables';
  end if;

  select count(*) into bucket_count
  from storage.buckets
  where id in ('contracts', 'photos', 'avatars', 'documents', 'guestbook', 'invoices')
    and not public;
  if bucket_count <> 6 then
    raise exception 'Private storage bucket verification failed';
  end if;

  if to_regprocedure('public.create_direct_reservation(text,date,date,jsonb,jsonb,jsonb,text)') is null
    or to_regprocedure('public.calculate_stay_price(uuid,date,date)') is null
    or to_regprocedure('public.is_property_available(uuid,date,date,uuid)') is null then
    raise exception 'Required database function verification failed';
  end if;

  -- This nested block always rolls back its test data by raising PBR01.
  begin
    insert into public.reservations (
      reference, property_id, status, arrival, departure, adults,
      total_cents, deposit_due_cents, balance_due_cents
    ) values (
      'BR-VERIFY-000001', chai_id, 'requested', date '2031-05-01', date '2031-05-05',
      2, 10000, 3000, 7000
    );

    begin
      insert into public.reservations (
        reference, property_id, status, arrival, departure, adults,
        total_cents, deposit_due_cents, balance_due_cents
      ) values (
        'BR-VERIFY-000002', chai_id, 'requested', date '2031-05-03', date '2031-05-07',
        2, 10000, 3000, 7000
      );
      raise exception 'Overlapping direct reservation was accepted';
    exception
      when exclusion_violation then null;
    end;

    insert into public.calendar_events (
      source_id, external_uid, property_id, status, arrival, departure
    )
    select source.id, 'verification-' || source.provider::text, nid_id,
      'confirmed', date '2031-06-01', date '2031-06-05'
    from public.calendar_sources source
    where source.property_id = nid_id and source.provider in ('airbnb', 'booking');

    raise exception using errcode = 'PBR01', message = 'Rollback verification fixtures';
  exception
    when sqlstate 'PBR01' then null;
  end;
end;
$verification$;
