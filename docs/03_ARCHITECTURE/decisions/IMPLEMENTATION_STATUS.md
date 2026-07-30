# État d’application des ADR

| ADR | Décision | Application actuelle |
| --- | --- | --- |
| ADR-0001 | Principes fondateurs | En convergence |
| ADR-0002 | Supabase PostgreSQL et migrations | Conforme pour les changements versionnés ; restauration à éprouver |
| ADR-0003 | Next.js App Router, serveur par défaut | Conforme partiel ; composants clients historiques à auditer |
| ADR-0004 | Supabase Auth et RLS | En cours ; email/mot de passe actif, Magic Link/MFA/OAuth non activés |
| ADR-0005 | Événements métier | Cible adoptée ; outbox commune non implémentée |
| ADR-0006 | Médias dans Supabase Storage | Non conforme actuellement ; médias publics encore dans Git |
| ADR-0007 | Design System obligatoire | En convergence ; catalogue de primitives incomplet |
| ADR-0008 | Documentation à chaque PR | Adopté sur la PR en cours |

Une décision `Accepted` exprime le choix d’architecture. Elle ne constitue pas
une preuve de migration terminée ; cette matrice porte l’état observable.

