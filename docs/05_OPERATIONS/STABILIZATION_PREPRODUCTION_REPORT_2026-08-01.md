# Stabilisation générale et préproduction — 1er août 2026

## Décision

**Préproduction locale : VALIDÉE. Production : NO-GO conditionnel.**

Le dépôt peut être installé intégralement sur une instance Supabase vierge et revenir à un schéma public vide par ses rollbacks. Aucun déploiement ni aucune migration distante n'a été exécuté. Le GO de production reste conditionné à une recette sur une préproduction distante isolée, avec les fournisseurs réels de courriel et de paiement ainsi qu'une sauvegarde restaurée.

## Résultats vérifiés

| Contrôle                  | Résultat                                          | Preuve                                        |
| ------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Migrations                | 27/27 appliquées deux fois depuis une base vierge | Supabase local Docker                         |
| Rollbacks                 | 27/27 exécutés en ordre inverse                   | zéro table applicative restante dans `public` |
| Intégrité des migrations  | 27 migrations et 27 rollbacks                     | `npm run db:verify-migrations`                |
| Tests SQL                 | 33/33                                             | `npm run db:test`                             |
| Lint SQL                  | aucune erreur ni alerte                           | `supabase db lint --local --level warning`    |
| RLS                       | activée sur toutes les tables applicatives        | requête `pg_class` : zéro table sans RLS      |
| Dépendances de production | aucune vulnérabilité connue                       | `npm audit --omit=dev`                        |
| Formatage, lint, types    | conformes                                         | `npm run validate`                            |
| Tests métier              | 160/160                                           | Node/TSX                                      |
| Tests unitaires           | 25/25 dans 11 fichiers                            | Vitest                                        |
| Tests navigateur          | 16/16 ordinateur et mobile                        | Playwright                                    |
| Build                     | 120 pages générées                                | Next.js 15.5.22                               |

## Corrections de stabilisation

- création des quatre rollbacks historiques manquants : paniers d'accueil, paniers Signature, taxe de séjour et documents juridiques ;
- remplacement, dans la migration de sécurisation des réservations, de rôles RLS inexistants par le contrôle central des rôles applicatifs ;
- conservation du message contractuel historique du verrou anti-chevauchement ;
- mise à jour du test RLS pour autoriser exclusivement les trois contenus éditoriaux publics attendus ;
- correction de l'ordre de suppression de l'index et de la fonction de recherche du Carnet ;
- suppression des effacements SQL directs de buckets Storage, interdits par Supabase : les politiques sont retirées et les buckets privés doivent être supprimés via l'API Storage après contrôle de leur contenu ;
- stabilisation de Playwright à deux workers ;
- isolation des appels réseau dans les scénarios de réservation ;
- actualisation des tests E2E avec les deux consentements juridiques en vigueur.

## Notes

| Domaine       | Note | Observation                                                                          |
| ------------- | ---: | ------------------------------------------------------------------------------------ |
| Architecture  | 9/10 | modules typés et frontières serveur présentes                                        |
| Sécurité      | 9/10 | RLS complète, API protégées, audit SQL propre                                        |
| Performance   | 8/10 | build maîtrisé ; charge SQL 10 000 réservations à mesurer sur préproduction distante |
| UX            | 9/10 | parcours principal testé sur ordinateur et mobile                                    |
| Responsive    | 9/10 | matrice Playwright desktop/Pixel 7 validée                                           |
| Accessibilité | 8/10 | clavier couvert sur les parcours principaux ; audit lecteur d'écran manuel restant   |
| Maintenance   | 9/10 | chaîne migration/rollback désormais complète                                         |
| Tests         | 9/10 | 234 contrôles automatisés verts, SQL inclus                                          |
| Documentation | 9/10 | procédures existantes complétées par ce rapport                                      |
| Déploiement   | 7/10 | préproduction locale validée, recette distante encore requise                        |

## Bloquants avant production

1. Appliquer les migrations sur un projet Supabase de préproduction distant, jamais sur la production en première intention.
2. Restaurer une sauvegarde récente sur la base miroir et comparer les données et objets attendus.
3. Exécuter le parcours réel réservation → contrat → acompte → courriel → solde → arrivée → départ → ménage avec des comptes de test.
4. Mesurer la charge SQL et l'interface avec 100, 1 000 et 10 000 réservations synthétiques sur cette préproduction.
5. Réaliser une vérification manuelle WCAG avec lecteur d'écran et une recette tablette physique.

## Recommandés

- ajouter des tests pgTAP spécifiques aux nouvelles tables CRM, housekeeping, tarification et documents ;
- automatiser le contrôle de restauration de sauvegarde ;
- exécuter Lighthouse sur l'URL de préproduction stable ;
- conserver les buckets Storage lors d'un rollback SQL et les traiter séparément par la procédure Storage.

## Facultatifs

- automatiser un rapport de capacité mensuel ;
- étendre les tests E2E aux vues authentifiées du Back Office ;
- ajouter une campagne de tests avec VoiceOver et TalkBack à chaque version majeure.

## Conclusion

Le socle local est reproductible et les anomalies bloquant une installation neuve ont été corrigées. Le dépôt n'est pas déclaré GO production tant que les cinq preuves distantes ci-dessus ne sont pas réunies.
