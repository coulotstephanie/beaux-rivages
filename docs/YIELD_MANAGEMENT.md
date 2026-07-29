# Yield Management

Le module **Yield Management** analyse les 90 prochains jours par maison et produit des recommandations de prix explicables. Il enrichit le moteur tarifaire existant : il ne crée pas une seconde source de vérité.

## Principes

- Une recommandation tient compte de l’occupation glissante, du délai avant séjour, du week-end et des événements configurés.
- Chaque stratégie impose un tarif plancher, un plafond, une occupation cible et des variations maximales.
- Le score de confiance traduit la quantité et la force des signaux disponibles ; il ne constitue pas une promesse de revenu.
- Aucun prix n’est actif sans décision humaine.

## Flux

1. Le Back Office demande une analyse pour une maison.
2. `YieldRepository` charge tarifs, réservations, indisponibilités, événements et stratégie.
3. Le moteur pur `recommendRate` calcule une proposition arrondie et ses facteurs.
4. Les propositions restent `pending`.
5. Une acceptation crée ou remplace un `yield_rate_overrides` actif.
6. Le repository tarifaire charge uniquement les overrides actifs ; les devis les appliquent nuit par nuit.
7. Chaque génération et décision est inscrite dans `yield_decision_logs`.

## Sécurité

L’API `/api/admin/yield` exige le jeton administrateur. Les mutations exigent aussi une origine identique, sont limitées en débit et validées par Zod. Les tables sont sous RLS et les mutations réservées au rôle `admin`.

## Limites actuelles

Le moteur utilise les données internes disponibles. Il n’intègre pas encore les tarifs concurrents, les recherches abandonnées, la météo future ni les événements externes temps réel. Ces signaux devront être ajoutés via des connecteurs traçables, avec une provenance et une date de fraîcheur.
