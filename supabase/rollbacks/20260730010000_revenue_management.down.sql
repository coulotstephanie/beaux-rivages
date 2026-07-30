begin;
drop trigger if exists enforce_rate_override_guardrails on public.rate_overrides;
drop function if exists public.enforce_rate_guardrails();
drop table if exists public.rate_overrides;
drop table if exists public.rate_guardrails;
commit;
