begin;
alter table public.property_pricing_rules drop column if exists optimize_calendar_gaps;
update public.seasons set minimum_nights = 3 where kind = 'mid' and minimum_nights = 2;
update public.rates rate
set minimum_nights = 3
from public.seasons season
where rate.season_id = season.id and season.kind = 'mid' and rate.minimum_nights = 2;
update public.options set name = 'Arrivée anticipée' where code = 'early-checkin';
update public.options set name = 'Départ tardif' where code = 'late-checkout';
commit;
