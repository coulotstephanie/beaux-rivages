begin;
delete from public.calendar_sources where provider in ('airbnb', 'booking');
delete from public.promotions;
delete from public.property_options;
delete from public.rates;
delete from public.seasons;
commit;
