begin;

insert into public.rates (
  property_id, name, weekdays, nightly_rate_cents, minimum_nights, maximum_nights,
  cleaning_fee_cents, tourist_tax_mode, tourist_tax_value, security_deposit_cents, priority
)
select property.id, rate.name, rate.weekdays, rate.nightly_rate_cents, rate.minimum_nights, 28,
  rate.cleaning_fee_cents, 'disabled', 0, rate.security_deposit_cents, rate.priority
from public.properties property
cross join lateral (
  values
    ('Tarif standard', array[0,1,2,3,4]::smallint[],
      case property.slug when 'chai-des-tortues' then 24500 when 'villa-raie-manta' then 36500 else 22500 end,
      2::smallint,
      case property.slug when 'villa-raie-manta' then 13000 when 'chai-des-tortues' then 9500 else 9000 end,
      case property.slug when 'villa-raie-manta' then 120000 else 80000 end,
      10::smallint),
    ('Tarif week-end', array[5,6]::smallint[],
      case property.slug when 'chai-des-tortues' then 27000 when 'villa-raie-manta' then 39500 else 25000 end,
      2::smallint,
      case property.slug when 'villa-raie-manta' then 13000 when 'chai-des-tortues' then 9500 else 9000 end,
      case property.slug when 'villa-raie-manta' then 120000 else 80000 end,
      20::smallint)
) as rate(name, weekdays, nightly_rate_cents, minimum_nights, cleaning_fee_cents, security_deposit_cents, priority);

with season_values(slug, name, kind, begins_on, ends_on, priority, minimum_nights, nightly_rate_cents) as (
  values
    ('chai-des-tortues', 'Moyenne saison 2026', 'mid', date '2026-04-01', date '2026-06-30', 200, 2, 27500),
    ('chai-des-tortues', 'Haute saison 2026', 'high', date '2026-07-01', date '2026-08-31', 300, 7, 33000),
    ('chai-des-tortues', 'Basse saison 2026-2027', 'low', date '2026-09-01', date '2027-03-31', 100, 2, 22000),
    ('villa-raie-manta', 'Moyenne saison 2026', 'mid', date '2026-04-01', date '2026-06-30', 200, 2, 41000),
    ('villa-raie-manta', 'Haute saison 2026', 'high', date '2026-07-01', date '2026-08-31', 300, 7, 49500),
    ('villa-raie-manta', 'Basse saison 2026-2027', 'low', date '2026-09-01', date '2027-03-31', 100, 2, 33500),
    ('nid-d-ete', 'Moyenne saison 2026', 'mid', date '2026-04-01', date '2026-06-30', 200, 2, 26000),
    ('nid-d-ete', 'Haute saison 2026', 'high', date '2026-07-01', date '2026-08-31', 300, 7, 31000),
    ('nid-d-ete', 'Basse saison 2026-2027', 'low', date '2026-09-01', date '2027-03-31', 100, 2, 20500)
), inserted_seasons as (
  insert into public.seasons (property_id, name, kind, begins_on, ends_on, priority, minimum_nights)
  select property.id, value.name, value.kind, value.begins_on, value.ends_on, value.priority, value.minimum_nights
  from season_values value
  join public.properties property on property.slug = value.slug
  returning id, property_id, name, minimum_nights
)
insert into public.rates (
  property_id, season_id, name, weekdays, nightly_rate_cents, minimum_nights, maximum_nights,
  cleaning_fee_cents, tourist_tax_mode, tourist_tax_value, security_deposit_cents, priority
)
select season.property_id, season.id, season.name, array[0,1,2,3,4,5,6]::smallint[],
  value.nightly_rate_cents, season.minimum_nights, 28,
  case property.slug when 'villa-raie-manta' then 13000 when 'chai-des-tortues' then 9500 else 9000 end,
  'disabled', 0,
  case property.slug when 'villa-raie-manta' then 120000 else 80000 end,
  1000
from inserted_seasons season
join public.properties property on property.id = season.property_id
join season_values value on value.slug = property.slug and value.name = season.name;

insert into public.property_options (property_id, option_id, price_cents)
select property.id, option_item.id,
  case option_item.code
    when 'signature' then case when property.slug = 'villa-raie-manta' then 16500 else 14500 end
    when 'linen' then 2000
    when 'pet' then 2500
    when 'beach-towels' then 800
    when 'robes' then 2400
    when 'slippers' then 1200
    when 'personal-arrival' then 3500
    when 'early-checkin' then 5500
    when 'late-checkout' then case when property.slug = 'villa-raie-manta' then 6500 else 5500 end
    when 'aperitif-basket' then 5200
    when 'basket' then 4800
    else option_item.default_price_cents
  end
from public.properties property
cross join public.options option_item;

insert into public.promotions (
  property_id, name, kind, percentage, minimum_nights, minimum_lead_days, maximum_lead_days, enabled, rules
)
select property.id, promotion.name, promotion.kind, promotion.percentage,
  promotion.minimum_nights, promotion.minimum_lead_days, promotion.maximum_lead_days,
  promotion.enabled, '{}'::jsonb
from public.properties property
cross join lateral (
  values
    ('Séjour de 7 nuits', 'long_stay', 8.00::numeric, 7::smallint, null::smallint, null::smallint, true),
    ('Réservation anticipée', 'early_booking', 5.00::numeric, null::smallint, 120::smallint, null::smallint, false)
) as promotion(name, kind, percentage, minimum_nights, minimum_lead_days, maximum_lead_days, enabled);

insert into public.calendar_sources (property_id, provider, name, secret_env_name, status)
select property.id, source.provider::public.occupancy_source, source.name,
  'ICAL_' || upper(replace(property.slug, '-', '_')) || '_' || upper(source.provider) || '_URL',
  'pending'
from public.properties property
cross join (values ('airbnb', 'Airbnb'), ('booking', 'Booking.com')) as source(provider, name);

commit;
