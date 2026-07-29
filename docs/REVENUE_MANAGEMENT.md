# Revenue Management

Le module consolide le moteur tarifaire existant sans le remplacer. Il gère les
périodes manuelles, week-ends, vacances, jours fériés et événements locaux.

## Architecture

- `features/revenue-management/schemas` valide les commandes ;
- `features/revenue-management/repositories` isole Supabase ;
- `features/revenue-management/services` calcule les indicateurs ;
- `platform/pricing` reste l’unique moteur de calcul d’un séjour ;
- `RatesAdmin` fournit le calendrier visuel et les indicateurs annuels.

Les montants persistés sont exprimés en centimes. Les bornes minimum et maximum
sont contrôlées en base. Une période manuelle est prioritaire sur les règles
automatiques.

## Indicateurs

- ADR : revenu divisé par les nuits occupées ;
- RevPAR : revenu divisé par les nuits disponibles ;
- occupation : nuits occupées divisées par les nuits disponibles.

Les réservations annulées ou expirées sont exclues.

## Utilisation

Dans `/administration/tarifs`, choisir le logement, l’année et la période, puis
renseigner son libellé, sa nature, son tarif par nuit et le séjour minimum.
L’écriture exige une session administrateur et une origine fiable.

`occupancy_pricing_enabled` est volontairement désactivé. Le futur moteur
d’occupation ne modifiera aucun tarif sans règles validées et contrôle humain.
