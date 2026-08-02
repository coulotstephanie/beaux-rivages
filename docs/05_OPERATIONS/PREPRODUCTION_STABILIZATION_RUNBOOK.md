# Runbook de stabilisation en préproduction

Ce runbook ne doit jamais cibler la production sans validation humaine explicite et sauvegarde vérifiée.

## Installation locale reproductible

```bash
npx supabase start
npm run db:verify-migrations
npm run db:test
npx supabase db lint --local --level warning
npm run validate
npm run test:e2e
```

## Test de rollback local

1. Confirmer que `supabase status` désigne l'instance locale.
2. Exécuter les fichiers `supabase/rollbacks/*.down.sql` dans l'ordre inverse, avec `ON_ERROR_STOP=1`.
3. Vérifier qu'aucune table applicative ne subsiste dans le schéma `public`.
4. Supprimer les éventuels buckets privés uniquement via l'API Supabase Storage, après contrôle de leur contenu.
5. Arrêter sans sauvegarde la base locale jetable, puis relancer `supabase start`.
6. Rejouer les tests SQL et applicatifs.

## Préproduction distante

1. Créer un projet Supabase distinct et identifiable comme préproduction.
2. Injecter les secrets dans le coffre du fournisseur, jamais dans Git ou un terminal partagé.
3. Restaurer une sauvegarde anonymisée ou générer des données synthétiques.
4. Appliquer les migrations avec la CLI explicitement liée au projet de préproduction.
5. Exécuter les tests RLS sous les rôles anonyme, voyageur, lecture seule, concierge et administrateur.
6. Réaliser la recette complète et enregistrer les preuves sans données personnelles.
7. Tester la sauvegarde, la restauration et le rollback avant toute décision de production.

## Règle d'arrêt

Tout échec de migration, RLS, sauvegarde, restauration, paiement, courriel transactionnel ou prévention de double réservation impose un NO-GO jusqu'à correction et nouvelle exécution complète.
