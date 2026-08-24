begin;

insert into public.promotions (
  property_id,
  name,
  kind,
  percentage,
  minimum_nights,
  minimum_lead_days,
  maximum_lead_days,
  enabled,
  metadata
)
select
  property.id,
  promotion.name,
  promotion.kind,
  promotion.percentage,
  promotion.minimum_nights,
  promotion.minimum_lead_days,
  promotion.maximum_lead_days,
  promotion.enabled,
  '{}'::jsonb
from public.properties property
cross join (
  values
    ('Séjour de 7 nuits', 'long_stay', 8.00::numeric, 7::smallint, null::smallint, null::smallint, true),
    ('Réservation anticipée', 'early_booking', 5.00::numeric, null::smallint, 120::smallint, null::smallint, false)
) as promotion(name, kind, percentage, minimum_nights, minimum_lead_days, maximum_lead_days, enabled);

commit;
