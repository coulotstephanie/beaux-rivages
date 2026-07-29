# Traçabilité du Developer Handbook

Référence : [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md).

## État au 29 juillet 2026

| Exigence | État | Constat |
| --- | --- | --- |
| TypeScript strict | Conforme | `strict` actif et `npm run typecheck` validé |
| Absence de `any` | Partiel | règle adoptée, contrôle exhaustif à intégrer à la CI |
| Composants inférieurs à 250 lignes | Partiel | cible documentée, dette existante à mesurer |
| Logique métier hors React | Partiel | contrats dans `platform/`, composants historiques à migrer |
| Repository unique vers Supabase | Partiel | repositories présents, audit exhaustif encore nécessaire |
| Feature First | En convergence | architecture actuelle conservée, migration verticale prévue |
| Primitives Design System | Partiel | primitives internes présentes, catalogue unifié incomplet |
| Responsive | Conforme partiel | styles existants, matrice automatisée absente |
| WCAG AA | Non certifié | pratiques présentes, audit et tests navigateur requis |
| Tests unitaires et intégration | Conforme partiel | suite active, couverture non mesurée |
| Tests E2E | Absent | runner navigateur à introduire |
| Couverture minimale 80 % | Non mesuré | seuil à activer avant de déclarer la conformité |
| Autorisation centralisée | Conforme sur l’administration | `authorizeStaff()` protège les API concernées |
| Actions sensibles historisées | Partiel | audit présent dans plusieurs domaines, couverture à vérifier |
| Rate limiting | Incomplet | stratégie commune à introduire |
| GitHub Actions | Partiel | workflows présents, gates à consolider |
| Preview Vercel | Conforme | Preview liée aux Pull Requests |
| Monitoring et rollback | Incomplet | procédures de production à formaliser |
| Gouvernance IA | Cible | aucune automatisation IA sensible activée |

## Priorités de convergence

1. Mesurer la couverture et activer un seuil progressif jusqu’à 80 %.
2. Introduire les tests E2E, responsive et accessibilité sur les parcours P0.
3. Inventorier les accès Supabase et les faire converger vers les repositories.
4. Mesurer la taille et les responsabilités des composants historiques.
5. Consolider les primitives du Design System avant toute nouvelle interface.
6. Généraliser l’audit et le rate limiting des opérations sensibles.

## Garde-fous

- une règle cible n’est jamais présentée comme déjà conforme sans preuve ;
- aucune migration Feature First globale n’est autorisée ;
- aucun composant existant n’est réécrit uniquement pour respecter une
  préférence d’arborescence ;
- toute correction structurelle doit préserver les contrats et être couverte
  par des tests de non-régression.

