-- Harmonise l'accueil gourmand sans modifier la structure de réservation existante.
update public.options
set
  name = 'Panier Apéritif Beaux Rivages',
  description = 'Vin Pelletier de l''Île de Ré, biscuits apéritifs artisanaux, terrine et carte des producteurs.',
  default_price_cents = 4500,
  updated_at = now()
where code = 'aperitif-basket';

update public.options
set
  name = 'Panier Douceur Beaux Rivages',
  description = 'Biscuits artisanaux, confiture locale, caramels au beurre salé, jus de fruits et carte des producteurs.',
  default_price_cents = 4500,
  updated_at = now()
where code = 'basket';

update public.property_options property_option
set price_cents = 4500, updated_at = now()
from public.options option_item
where property_option.option_id = option_item.id
  and option_item.code in ('aperitif-basket', 'basket');
