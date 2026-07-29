# Sprint 24 — Automatisation et orchestrations

## Objectif

Réduire les tâches manuelles grâce à des workflows fiables.

## Périmètre

- scheduler centralisé ;
- outbox transactionnelle ;
- consommateurs idempotents ;
- reprises avec temporisation et file d’échecs ;
- rejeu contrôlé depuis le Back Office ;
- suivi des exécutions et alertes ;
- arrêt d’urgence par automatisation.

Chaque workflow possède un déclencheur, un propriétaire, une limite de reprise
et une procédure manuelle documentée.
