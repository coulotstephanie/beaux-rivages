begin;

drop trigger if exists financial_settings_updated_at on public.financial_settings;
drop table if exists public.financial_settings;

commit;
