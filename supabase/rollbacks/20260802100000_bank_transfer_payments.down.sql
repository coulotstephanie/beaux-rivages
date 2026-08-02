drop policy if exists "staff records manual payments" on public.payments;
drop policy if exists "admin updates manual payments" on public.payments;
drop index if exists public.payments_single_settlement_kind;

drop table if exists public.payment_reminders;
drop table if exists public.payment_method_settings;

alter table public.payments
  drop constraint if exists payments_method_check,
  drop column if exists method,
  drop column if exists received_at,
  drop column if exists bank_reference,
  drop column if exists iban_label,
  drop column if exists validated_by,
  drop column if exists comment,
  drop column if exists evidence_path;

create or replace function public.journal_payment_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.reservation_events(reservation_id,event_type,origin,details)
  values(new.reservation_id,
    case when tg_op='UPDATE' and new.refunded_cents > old.refunded_cents then 'payment.refunded' else 'payment.' || new.status end,
    'system',jsonb_build_object('paymentId',new.id,'amountCents',new.amount_cents,'refundedCents',new.refunded_cents));
  return new;
end $$;
