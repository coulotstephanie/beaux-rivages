# Expérience Premium — Back Office 1.1

## Objectif

Permettre à Stéphanie ou Bruno de comprendre et piloter leur journée en moins de cinq minutes, sur ordinateur, tablette ou mobile.

## Fonctionnalités

- **Command Palette** : `⌘ K` ou `Ctrl K`, recherche instantanée, navigation et message d’absence de résultat.
- **Recherche globale** : voyageurs, réservations, contrats, documents et contenus du Carnet.
- **Favoris** : étoile sur chaque résultat, tri prioritaire et conservation locale.
- **Raccourcis** : `Alt+1` Ma journée, `Alt+2` Calendrier, `Alt+3` Voyageurs, `Échap` pour fermer.
- **Notifications** : aperçu priorisé et accès à l’historique.
- **Mode sombre** : préférence système au premier accès, choix mémorisé ensuite.
- **Tableaux filtrables** : CRM, timeline, tarifs et contenus disposent de recherches, filtres ou segments adaptés.
- **Widgets configurables** : météo, indicateurs, agenda, occupation et priorités sont activables indépendamment ; le choix est mémorisé.
- **Responsive** : navigation mobile, grilles adaptatives et zones horizontales défilables.

## Performance

- Aucun SDK supplémentaire pour l’expérience.
- Filtrage et tri mémorisés avec `useMemo`.
- Données et réglages légers conservés localement.
- Pages administratives pré-rendues statiquement.
- Icônes vectorielles homogènes et animations limitées aux retours utiles.
- Pas de requête réseau déclenchée par la Command Palette ou les widgets.

Les futures connexions devront introduire pagination serveur, cache, chargement différé des modules lourds, budgets Core Web Vitals et mesure sur appareils réels.

## Accessibilité

Les commandes ont des libellés accessibles, les sélections exposent leur état, les dialogues sont fermables par `Échap` et toutes les fonctions principales restent utilisables au clavier.
