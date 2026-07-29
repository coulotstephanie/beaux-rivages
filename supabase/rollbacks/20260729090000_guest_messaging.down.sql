drop trigger if exists guest_access_secrets_updated_at on public.guest_access_secrets;
drop table if exists public.guest_access_secrets;
drop index if exists public.transactional_emails_scheduling_idx;
drop index if exists public.transactional_emails_idempotency_unique;
alter table public.transactional_emails
  drop constraint if exists transactional_emails_guest_type_check,
  drop constraint if exists transactional_emails_locale_check,
  drop column if exists message_type,
  drop column if exists locale,
  drop column if exists idempotency_key,
  drop column if exists custom_paragraph,
  drop column if exists manually_marked_sent_at,
  drop column if exists cancelled_at;
