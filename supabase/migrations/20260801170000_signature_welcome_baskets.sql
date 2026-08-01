-- Distingue le panier inclus dans l'Expérience Signature du panier supplémentaire payant.
insert into public.options (code, name, description, pricing_mode, default_price_cents)
values
  ('signature-aperitif', 'Panier inclus · Panier Apéritif Beaux Rivages', 'Panier de bienvenue inclus dans l''Expérience Signature.', 'per_stay', 0),
  ('signature-sweet', 'Panier inclus · Panier Douceur Beaux Rivages', 'Panier de bienvenue inclus dans l''Expérience Signature.', 'per_stay', 0)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  default_price_cents = 0,
  updated_at = now();

insert into public.property_options (property_id, option_id, price_cents, enabled)
select property.id, option_item.id, 0, true
from public.properties property
cross join public.options option_item
where option_item.code in ('signature-aperitif', 'signature-sweet')
on conflict (property_id, option_id) do update set
  price_cents = 0,
  enabled = true,
  updated_at = now();
