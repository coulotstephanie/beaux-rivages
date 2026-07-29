# Traçabilité de l’architecture technique

Référence :
[PRODUCT_BOOK_08_TECHNICAL_ARCHITECTURE.md](./PRODUCT_BOOK_08_TECHNICAL_ARCHITECTURE.md).

## État au 29 juillet 2026

| Exigence | État | Constat |
| --- | --- | --- |
| Next.js 15, React 19, TypeScript strict | Conforme | stack et build validés |
| Supabase et PostgreSQL | Conforme partiel | schéma riche, configuration locale inactive |
| Supabase Auth | En cours | fondation du personnel dans la PR Auth |
| Multi-tenant | Absent | stratégie et phases définies, aucun scope tenant en base |
| Clean Architecture | Partiel | contrats et repositories dans `platform/` |
| Feature First | Incomplet | modules racine et composants transverses encore nombreux |
| Monorepo `apps/packages` | Cible | dépôt actuellement mono-application |
| Tailwind CSS et shadcn/ui | Absent | CSS global et primitives internes actuelles |
| React Hook Form | Absent | formulaires React contrôlés manuellement |
| TanStack Query | Absent | appels `fetch` et états locaux |
| API `/api/v1` | Absent | routes non versionnées à préserver pendant migration |
| Format de réponse homogène | Partiel | erreurs et données varient selon les routes |
| Rôles SaaS complets | Partiel | `admin`, `concierge`, `read_only` seulement |
| Permissions déclaratives | Cible | catalogue défini, autorisation encore basée sur les rôles |
| RLS | Conforme partiel | 55 tables protégées, revue globale encore nécessaire |
| Storage administrable | Partiel | buckets privés présents, médias publics encore dans Git |
| Observabilité | Incomplet | logs structurés locaux, aucun APM/alerting central |
| Architecture événementielle | Cible | catalogue défini, aucun bus/outbox commun |
| Moteur d’automatisation | Partiel | planifications métier dispersées |
| Scheduler central | Absent | aucune orchestration unique ni registre d’exécution |
| Cache documenté | Partiel | cache Next/images présent, politique par donnée absente |
| Couverture ≥ 80 % | Non mesuré | aucun outil de couverture configuré |
| E2E et accessibilité automatisés | Absent | aucun runner navigateur |
| GitHub Actions | Partiel | validation définie, exécution PR à fiabiliser |
| Sauvegardes et restauration | Partiel | scripts présents, exercice de restauration absent |

## Stratégie de convergence

1. Terminer l’authentification et les rôles sans casser le Back Office.
2. Introduire les tests E2E, accessibilité et la couverture avant les grands
   déplacements d’architecture.
3. Créer les machines à états et événements du Product Book 07 dans une couche
   métier indépendante.
4. Ajouter l’outbox, le registre d’exécution et un premier consommateur
   idempotent sur `ReservationCreated`.
5. Migrer un premier domaine vertical vers `features/` et mesurer le coût avant
   de décider du passage en monorepo.
6. Versionner les nouvelles API sous `/api/v1` et maintenir des adaptateurs pour
   les routes actuelles.
7. Introduire TanStack Query et React Hook Form sur les nouveaux écrans, puis
   migrer l’existant progressivement.
8. Évaluer Tailwind et shadcn/ui au regard du Design System existant avant toute
   réécriture CSS.
9. Introduire les fondations multi-tenant dans un sprint dédié, avec backfill et
   tests anti-fuite avant toute activation.

## Garde-fous

- aucun déplacement global de fichiers en une seule Pull Request ;
- aucune rupture des URL publiques ou contrats API existants ;
- aucune migration de média sans inventaire, contrôle d’intégrité et rollback ;
- aucune extension de rôle sans mise à jour simultanée de la RLS et des tests ;
- aucune nouvelle infrastructure sans procédure d’exploitation documentée.
