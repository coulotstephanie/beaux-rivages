# Database

Sources canoniques : [DATABASE.md](../DATABASE.md) et
[SUPABASE_ENTERPRISE_ARCHITECTURE.md](../SUPABASE_ENTERPRISE_ARCHITECTURE.md).

## Revenue Management

- `rate_guardrails` conserve les bornes tarifaires par logement ;
- `rate_overrides` conserve les périodes tarifaires auditables.

Les périodes sont indexées par logement et intervalle. Les écritures sont
réservées aux administrateurs par RLS et un trigger PostgreSQL contrôle les
bornes tarifaires.
