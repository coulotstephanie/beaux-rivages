begin;
update public.options set name='Panier apéritif',description=null,default_price_cents=0,updated_at=now() where code='aperitif-basket';
update public.options set name='Panier gourmand',description=null,default_price_cents=0,updated_at=now() where code='basket';
update public.property_options property_option set price_cents=case option_item.code when 'aperitif-basket' then 5200 else 4800 end,updated_at=now()
from public.options option_item where property_option.option_id=option_item.id and option_item.code in('aperitif-basket','basket');
commit;
