# Traçabilité des règles métier

Référence : [BUSINESS_RULES.md](./BUSINESS_RULES.md).

## État au 29 juillet 2026

| Règle | État | Écart constaté |
| --- | --- | --- |
| Cycle de réservation officiel | Non conforme | `checked_in`, `checked_out` et `expired` absents de l’enum SQL actuel |
| États historiques de réservation | À migrer | `requested` et `declined` existent encore pour compatibilité |
| Transitions interdites | Incomplet | liste de statuts validée, machine à états centrale absente |
| Cycle de paiement officiel | Partiel | états supplémentaires nécessaires au fournisseur : `requires_action`, `cancelled`, `partially_refunded` |
| Paiement requis avant signature | Incomplet | règle documentée, verrou global de signature à vérifier |
| Contrat signé immuable et versionné | Partiel | versions présentes, immutabilité en base à renforcer |
| Logements archivés, jamais supprimés | Partiel | statuts présents, politique d’interdiction de suppression à généraliser |
| Anti-chevauchement | Conforme | contrôle serveur et contrainte transactionnelle en base |
| Snapshot tarifaire horodaté | Conforme partiel | totaux et lignes présents, version de règle à consolider |
| Options avec TVA et compatibilité | Partiel | catalogue présent, couverture des attributs à auditer |
| Supplément par animal | À vérifier | règles tarifaires non uniformisées sur tous les canaux |
| Linge propagé aux messages et checklists | Partiel | messages présents, automatisation complète à éprouver |
| CRM et dédoublonnage | Incomplet | identité présente, fusion automatique non finalisée |
| Mission ménage automatique | Partiel | domaine présent, déclenchement événementiel commun absent |
| Clôture ménage contrôlée | Partiel | checklist présente, obligation photo configurable à renforcer |
| Priorités maintenance officielles | Non conforme | vocabulaire actuel à rapprocher de Critique/Haute/Normale/Faible |
| Fidélité calculée automatiquement | Partiel | moteur présent, règles à versionner |
| Soft delete des données critiques | Incomplet | aucune politique transversale encore garantie |
| Audit complet ancien/nouveau/IP | Incomplet | journalisation présente, couverture des champs variable |

## Décisions de compatibilité

- Les valeurs historiques ne sont jamais retirées d’un enum PostgreSQL sans
  plan de conversion et vérification des données.
- Les statuts fournisseur restent dans la couche paiement, mais sont mappés
  vers les états métier officiels.
- L’introduction de `checked_in`, `checked_out` et `expired` nécessite une
  migration, une machine à états typée, un backfill et des tests de transitions.
- Le terme technique `option` reste compatible ; seule sa présentation publique
  suit le vocabulaire du Brand Book.

## Sprint de mise en conformité recommandé

1. Créer la machine à états `Reservation`.
2. Ajouter les états officiels par migration additive.
3. Mapper les états historiques et fournisseurs sans perte de données.
4. Verrouiller les contrats signés et leur versionnement en base.
5. Compléter l’audit et les politiques de suppression logique.

