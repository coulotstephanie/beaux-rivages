-- MANUAL ROLLBACK ONLY.
-- This script is deliberately not part of the forward migration chain.
-- Export the database and verify the target project before execution.
begin;

drop policy if exists "staff read private storage" on storage.objects;
drop policy if exists "staff upload private storage" on storage.objects;
drop policy if exists "staff update private storage" on storage.objects;
drop policy if exists "admins delete private storage" on storage.objects;

-- Bucket deletion is deliberately delegated to the Supabase Storage API.
-- Recent Storage releases reject direct SQL deletion to prevent orphaned
-- objects; all SQL access policies are removed above, leaving these private
-- buckets inaccessible until an operator verifies and removes them safely.

drop table if exists public.audit_logs cascade;
drop table if exists public.sync_runs cascade;
drop table if exists public.availability cascade;
drop table if exists public.occupancy_blocks cascade;
drop table if exists public.calendar_events cascade;
drop table if exists public.calendar_sources cascade;
drop table if exists public.consents cascade;
drop table if exists public.transactional_emails cascade;
drop table if exists public.signatures cascade;
drop table if exists public.contracts cascade;
drop table if exists public.payments cascade;
drop table if exists public.invoices cascade;
drop table if exists public.reservation_options cascade;
drop table if exists public.reservation_guests cascade;
drop table if exists public.reservations cascade;
drop table if exists public.property_media cascade;
drop table if exists public.property_options cascade;
drop table if exists public.options cascade;
drop table if exists public.promotions cascade;
drop table if exists public.rates cascade;
drop table if exists public.seasons cascade;
drop table if exists public.guests cascade;
drop table if exists public.app_user_roles cascade;
drop table if exists public.users cascade;
drop table if exists public.properties cascade;

drop sequence if exists public.reservation_reference_seq;
drop function if exists public.notify_sensitive_change();
drop function if exists public.replace_calendar_events(text, public.occupancy_source, jsonb, timestamptz);
drop function if exists public.guard_occupancy_conflicts();
drop function if exists public.sync_availability_from_block();
drop function if exists public.refresh_availability(uuid, date, date);
drop function if exists public.calculate_stay_price(uuid, date, date);
drop function if exists public.is_property_available(uuid, date, date, uuid);
drop function if exists public.generate_reservation_number();
drop function if exists public.create_direct_reservation(text, date, date, jsonb, jsonb, jsonb, text);
drop function if exists public.audit_row_change();
drop function if exists public.sync_calendar_occupancy();
drop function if exists public.sync_reservation_occupancy();
drop function if exists public.current_app_role();
drop function if exists public.set_updated_at();

drop type if exists public.occupancy_source;
drop type if exists public.message_status;
drop type if exists public.contract_status;
drop type if exists public.payment_kind;
drop type if exists public.payment_status;
drop type if exists public.reservation_status;
drop type if exists public.app_role;

commit;
