begin;

update public.rates as rate
set cleaning_fee_cents = case property.slug
  when 'chai-des-tortues' then 12000
  when 'villa-raie-manta' then 15000
  when 'nid-d-ete' then 9000
end
from public.properties as property
where rate.property_id = property.id
  and property.slug in ('chai-des-tortues', 'villa-raie-manta', 'nid-d-ete');

commit;
