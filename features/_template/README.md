# Feature template

Copier cette structure uniquement lorsqu’un domaine réel est développé.

- `components/` — vues propres à la feature ;
- `hooks/` — orchestration côté React ;
- `services/` — cas d’usage et règles d’application ;
- `repositories/` — interfaces et adaptateurs de persistance ;
- `schemas/` — validation des entrées externes ;
- `types/` — types du domaine ;
- `tests/` — tests colocalisés.

Une feature expose une API publique minimale depuis `index.ts`. Aucun fichier
ne doit être ajouté uniquement pour remplir un dossier.
