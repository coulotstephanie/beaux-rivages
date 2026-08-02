begin;

create table public.document_templates (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('quote','contract','deposit_invoice','balance_invoice','final_invoice','credit_note','receipt','payment_statement','certificate')),
  name text not null,
  logo_path text,
  primary_color text not null default '#153b3a',
  footer_text text,
  legal_text text,
  body_template text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(kind,name)
);

create table public.document_records (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  contract_id uuid references public.contracts(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  template_id uuid references public.document_templates(id) on delete set null,
  kind text not null check (kind in ('quote','contract','deposit_invoice','balance_invoice','final_invoice','credit_note','receipt','payment_statement','certificate')),
  number text not null,
  version integer not null default 1 check(version > 0),
  status text not null default 'draft' check(status in ('draft','issued','sent','viewed','signed','declined','expired','paid','void','archived')),
  snapshot jsonb not null,
  content_hash text,
  storage_path text,
  issued_at timestamptz,
  archived_at timestamptz,
  deleted_at timestamptz,
  deletion_reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(kind,number,version)
);

create table public.document_signature_requests (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_records(id) on delete cascade,
  provider text not null default 'none',
  provider_request_id text,
  signer_email text not null,
  status text not null default 'prepared' check(status in ('prepared','sent','viewed','signed','declined','expired','cancelled')),
  sent_at timestamptz, viewed_at timestamptz, signed_at timestamptz, expires_at timestamptz,
  signed_storage_path text,
  provider_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.document_deliveries (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_records(id) on delete cascade,
  recipient text not null,
  channel text not null default 'email' check(channel in ('email','portal','download')),
  status text not null default 'prepared' check(status in ('prepared','sent','delivered','opened','downloaded','failed')),
  provider_message_id text,
  sent_at timestamptz, opened_at timestamptz, downloaded_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.document_audit_log (
  id bigint generated always as identity primary key,
  document_id uuid references public.document_records(id) on delete set null,
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  origin text not null default 'administration' check(origin in ('administration','traveler','system')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.organization_document_settings (
  id boolean primary key default true check(id),
  legal_name text not null default 'Beaux Rivages',
  address text, phone text, email text, iban text, bic text,
  vat_number text, vat_enabled boolean not null default false,
  logo_path text, primary_color text not null default '#153b3a',
  footer_text text, legal_mentions text,
  owner_signature_path text, updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
insert into public.organization_document_settings(id) values(true) on conflict do nothing;

create index document_records_reservation_idx on public.document_records(reservation_id,created_at desc) where deleted_at is null;
create index document_records_search_idx on public.document_records(number,kind,created_at desc) where deleted_at is null;
create index document_signature_status_idx on public.document_signature_requests(status,expires_at);
create index document_deliveries_document_idx on public.document_deliveries(document_id,created_at desc);
create index document_audit_document_idx on public.document_audit_log(document_id,created_at desc);

alter table public.document_templates enable row level security;
alter table public.document_records enable row level security;
alter table public.document_signature_requests enable row level security;
alter table public.document_deliveries enable row level security;
alter table public.document_audit_log enable row level security;
alter table public.organization_document_settings enable row level security;

do $$ declare relation text; begin
  foreach relation in array array['document_templates','document_records','document_signature_requests','document_deliveries','document_audit_log','organization_document_settings'] loop
    execute format('create policy "staff manage %1$s" on public.%1$I for all to authenticated using (public.current_app_role() in (''admin'',''concierge'')) with check (public.current_app_role() in (''admin'',''concierge''))',relation);
    execute format('grant select,insert,update,delete on public.%I to authenticated,service_role',relation);
  end loop;
end $$;

create trigger document_templates_updated_at before update on public.document_templates for each row execute function public.set_updated_at();
create trigger document_records_updated_at before update on public.document_records for each row execute function public.set_updated_at();
create trigger document_signatures_updated_at before update on public.document_signature_requests for each row execute function public.set_updated_at();
create trigger organization_document_settings_updated_at before update on public.organization_document_settings for each row execute function public.set_updated_at();

-- Import the documents already generated by the reservation and finance modules.
insert into public.document_records(reservation_id,kind,number,status,snapshot,issued_at,created_at,updated_at)
select source.reservation_id,'quote','DEV-'||reservation.reference,
  case when source.status='draft' then 'draft' else 'issued' end,source.snapshot,
  case when source.status='draft' then null else source.updated_at end,source.created_at,source.updated_at
from public.reservation_documents source join public.reservations reservation on reservation.id=source.reservation_id
where source.kind='quote' on conflict do nothing;

insert into public.document_records(reservation_id,contract_id,kind,number,version,status,snapshot,storage_path,issued_at,created_at,updated_at)
select contract.reservation_id,contract.id,'contract',contract.number,contract.version,
  case when contract.status='generated' then 'issued' else contract.status::text end,
  coalesce(source.snapshot,'{}'::jsonb),contract.pdf_path,contract.generated_at,contract.created_at,contract.updated_at
from public.contracts contract left join public.reservation_documents source on source.reservation_id=contract.reservation_id and source.kind='contract'
on conflict do nothing;

insert into public.document_records(reservation_id,invoice_id,kind,number,status,snapshot,storage_path,issued_at,created_at,updated_at)
select invoice.reservation_id,invoice.id,
  case invoice.kind when 'deposit' then 'deposit_invoice' when 'balance' then 'balance_invoice' when 'credit_note' then 'credit_note' else 'final_invoice' end,
  invoice.number,case when invoice.status='void' then 'void' when invoice.status='paid' then 'paid' when invoice.status='draft' then 'draft' else 'issued' end,
  jsonb_build_object('reservationId',invoice.reservation_id,'invoiceId',invoice.id,'amountCents',invoice.total_cents,'currency',invoice.currency,'dueAt',invoice.due_at),
  invoice.pdf_path,invoice.issued_at,invoice.created_at,invoice.updated_at
from public.invoices invoice on conflict do nothing;

create or replace function public.create_payment_receipt_document()
returns trigger language plpgsql security definer set search_path=public as $$
declare reservation_row public.reservations%rowtype; receipt_number text; begin
  if new.status not in ('paid','partially_refunded','refunded') or (tg_op='UPDATE' and old.status=new.status and old.refunded_cents=new.refunded_cents) then return new; end if;
  select * into reservation_row from public.reservations where id=new.reservation_id;
  receipt_number := 'REC-'||reservation_row.reference||'-'||left(new.id::text,8);
  insert into public.document_records(reservation_id,payment_id,kind,number,status,snapshot,issued_at)
  values(new.reservation_id,new.id,'receipt',receipt_number,'issued',jsonb_build_object(
    'reservationId',new.reservation_id,'reference',reservation_row.reference,'propertyId',reservation_row.property_id,
    'paymentId',new.id,'amountCents',new.amount_cents,'refundedCents',new.refunded_cents,
    'method',new.method,'paidAt',coalesce(new.paid_at,new.received_at,now()),'currency',new.currency
  ),now()) on conflict do nothing;
  return new;
end $$;
create trigger payment_create_receipt after insert or update of status,refunded_cents on public.payments for each row execute function public.create_payment_receipt_document();

comment on table public.document_records is 'Canonical, immutable-versioned registry for every operational document.';
comment on column public.document_records.snapshot is 'Frozen source data used for deterministic regeneration and audit.';
comment on table public.document_signature_requests is 'Provider-neutral electronic signature state machine.';

commit;
