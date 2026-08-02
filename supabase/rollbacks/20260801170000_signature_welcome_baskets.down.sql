begin;
delete from public.property_options where option_id in(select id from public.options where code in('signature-aperitif','signature-sweet'));
delete from public.options where code in('signature-aperitif','signature-sweet');
commit;
