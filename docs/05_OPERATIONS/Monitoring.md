# Monitoring

Statut : fondation présente, raccordement externe incomplet.

`GET /api/health` retourne sans cache l’état global, l’accessibilité de
PostgreSQL, sa latence et l’heure du contrôle, sans erreur SQL ni secret.

Avant production, un moniteur externe doit appeler cette route chaque minute.
Un APM doit suivre les erreurs 5xx, latence p95, paiements, webhooks, messages et
connexions base. Les destinataires et escalades restent à nommer.
