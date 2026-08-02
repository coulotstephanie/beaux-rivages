begin;

alter table public.property_pricing_rules
  add column if not exists optimize_calendar_gaps boolean not null default true;

update public.seasons set minimum_nights = 2 where kind = 'mid' and minimum_nights > 2;

update public.rates rate
set minimum_nights = 2
from public.seasons season
where rate.season_id = season.id and season.kind = 'mid' and rate.minimum_nights > 2;

update public.options
set name = case code
  when 'early-checkin' then 'Arrivée anticipée (sur demande)'
  when 'late-checkout' then 'Départ tardif (sur demande)'
  else name
end
where code in ('early-checkin', 'late-checkout');

commit;
