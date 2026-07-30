# Backup & Recovery

La stratégie actuelle est décrite dans
[SUPABASE_ENTERPRISE_ARCHITECTURE.md](../SUPABASE_ENTERPRISE_ARCHITECTURE.md).
Elle ne sera considérée validée qu’après un exercice de restauration documenté.

`npm run db:backup` exige `BR_BACKUP_DIR` et `DATABASE_URL` explicites.
`scripts/restore-supabase.sh` exige également une cible explicite.

Avant Go Live, restaurer sur une base isolée, vérifier tables, réservations et
audits, mesurer RTO/RPO et conserver le procès-verbal hors du dépôt public.

La sauvegarde doit aussi couvrir Storage, Auth et l’inventaire des paramètres.
Le détail et l’état de la dernière tentative figurent dans
[BACKUP_REPORT_2026-07-29.md](./BACKUP_REPORT_2026-07-29.md).
La comparaison des méthodes et la procédure retenue sont consignées dans
[BACKUP_READINESS_REPORT_2026-07-29.md](./BACKUP_READINESS_REPORT_2026-07-29.md).
