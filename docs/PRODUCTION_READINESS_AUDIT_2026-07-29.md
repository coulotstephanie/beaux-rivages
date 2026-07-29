# Audit de préparation production — 29 juillet 2026

## Verdict

**Score : 67/100 — pilote interne possible, ouverture commerciale non
recommandée.**

Le code compile, le typage est strict, les parcours principaux sont testés et
les 63 tables déclarées dans les migrations activent RLS. La plateforme ne doit
cependant pas traiter de réservations et paiements réels avant la levée des
blocages P0 : migrations vérifiées sur l’environnement cible, recette Stripe
TEST, restauration démontrée, observabilité centralisée et traitement des
alertes de dépendances.

## Méthode et métriques

Audit statique du dépôt, migrations, routes, composants, configuration Next.js,
CI, scripts d’exploitation et documentation, complété par lint, TypeScript,
tests, audit npm et build de production.

| Mesure                            |      Avant |                 Après |
| --------------------------------- | ---------: | --------------------: |
| Tests d’intégrité/intégration     |        110 |                   114 |
| Erreurs TypeScript                |          0 |                     0 |
| `any` dans le code applicatif     |          0 |                     0 |
| Tables / tables avec RLS déclaré  |    63 / 63 |               63 / 63 |
| Index SQL déclarés                |         56 |                    56 |
| Routes API                        |         28 |    29, dont une sonde |
| Taille du dossier public          |    175 Mio |               175 Mio |
| Plus gros média                   |   13,7 Mio |              13,7 Mio |
| Composants dépassant 250 lignes   |          1 |                     1 |
| Taille maximale du limiteur local | non bornée |        10 000 entrées |
| Alertes npm production            |   3 hautes | 3 hautes, documentées |

Les alertes npm proviennent des copies de `postcss` et `sharp` embarquées par
Next.js 15.5.22. Une surcharge locale n’a pas été conservée car elle produit un
arbre invalide. Le correctif proposé par npm est un faux downgrade majeur. Une
montée contrôlée vers une version corrigée doit être testée séparément.

## Résultats par domaine

### Architecture — 7/10

App Router, TypeScript strict, frontières `features`, repositories, services,
ADR, migrations et rollbacks sont présents. Le composant historique
`AdminDashboard.tsx` atteint toutefois 1 371 lignes ; plusieurs domaines anciens
restent dans `platform/` et trois composants neutralisent une règle React.

### Performance — 6/10

Le contenu public est pré-généré, Next Image produit AVIF/WebP et les médias ont
des en-têtes de cache. La vidéo d’accueil ne précharge désormais rien en
économie de données, 2G ou réduction des animations.

`public/` pèse 175 Mio, quatre vidéos dépassent 3 Mio et plusieurs PNG dépassent
2 Mio. Le dashboard lit jusqu’à 5 000 réservations et plusieurs repositories
emploient `select("*")`. Il faut mesurer avec `pg_stat_statements` sur une copie
réaliste avant de réduire les projections ou paginer.

### Sécurité — 6/10

Validation serveur, contrôle d’origine, cookies HttpOnly, rôles serveur, RLS sur
les 63 tables, requêtes paramétrées, JSON-LD échappé, secrets privés et audits
sont présents. Le limiteur mémoire est désormais borné et purge les expirations.

Il reste local à chaque instance. CSP, suppression du jeton historique, alertes
npm et revue anti-fuite RLS sur la base déployée restent des blocages.

### Base de données — 7/10

Les migrations déclarent contraintes, 56 index, exclusions de chevauchement,
triggers, audit et RLS. Il manque la preuve que les 14 migrations sont appliquées
dans l’ordre, un rapport `supabase db lint`, des mesures réelles et un exercice
de restauration horodaté.

### Tests et qualité — 7/10

Lint, typage, tests unitaires, intégration, E2E et build sont présents en CI.
Quatre tests protègent les corrections du sprint. La couverture chiffrée n’est
pas configurée et les tests SQL Supabase ne tournent pas en CI.

### UX, responsive et accessibilité — 7/10

Lien d’évitement, focus visible, libellés, `aria-live`, zones tactiles,
réduction des animations et tests Playwright sont présents. Une recette lecteur
d’écran, zoom 200/400 %, iOS Safari, Android Chrome et clavier complet du Back
Office reste nécessaire.

### SEO — 8/10

Métadonnées, canonicals, Open Graph, robots, sitemap et JSON-LD sont centralisés.
Le sitemap ne simule plus une modification de toutes les pages à chaque lecture.
Les Core Web Vitals doivent encore être mesurés sur la vraie production.

### Monitoring, logs et sauvegardes — 4/10

La sonde `/api/health` expose disponibilité et latence base sans détail sensible.
Les tables d’audit et scripts de sauvegarde/restauration existent. Il manque APM,
agrégation d’erreurs, alertes, synthetic monitoring, astreinte et preuve de
restauration. C’est le principal écart opérationnel.

### CI/CD et documentation — 8/10

La CI exécute validation complète et E2E. Les documents d’architecture et
d’exploitation sont structurés. Preview, Production, migrations et rollback ne
sont pas encore orchestrés dans un pipeline éprouvé.

## Dette priorisée

### P0 — avant Go Live

1. appliquer migrations et tests RLS sur une préproduction ;
2. démontrer une sauvegarde et une restauration complètes ;
3. raccorder APM, collecte d’erreurs, alertes et synthetic monitoring ;
4. tester Stripe TEST, webhooks compris, sans argent réel ;
5. désactiver `ADMIN_TOKEN_FALLBACK_ENABLED` après création des comptes ;
6. traiter les alertes Next.js/postcss/sharp dans une PR de version dédiée ;
7. définir et tester une CSP compatible avec les services retenus.

### P1 — avant montée en charge

1. remplacer le rate limiting local par un stockage distribué ;
2. profiler et paginer le dashboard et les repositories volumineux ;
3. compresser les médias source et créer des variantes vidéo mobiles ;
4. ajouter couverture chiffrée, tests SQL en CI et tests WCAG automatiques ;
5. découper progressivement `AdminDashboard.tsx`.

### P2 — amélioration continue

1. supprimer les trois désactivations ESLint liées aux hooks ;
2. établir budgets bundle, LCP, INP et CLS dans la CI ;
3. exercer trimestriellement incident, rollback et restauration.

## Conclusion

La plateforme est cohérente et proche d’un produit pilotable, mais elle n’est
pas prête pour des transactions réelles tant que les preuves P0 ne sont pas
apportées. Aucun constat ne justifie une réécriture.
