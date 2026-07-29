# Preuve P0 — disponibilité des sauvegardes

Date : 29 juillet 2026  
Mode : lecture seule  
Projet : `ydqtqfkzmovjdkmldhqr`

## Outils locaux

| Outil        | Résultat |
| ------------ | -------- |
| Docker       | absent   |
| `pg_dump`    | absent   |
| `pg_restore` | absent   |
| `psql`       | absent   |

## État Supabase vérifié

Commande :

```bash
npx supabase backups list \
  --project-ref ydqtqfkzmovjdkmldhqr \
  --output json
```

Résultat expurgé :

```json
{
  "backups": null,
  "physical_backup_data": {},
  "pitr_enabled": false,
  "region": "eu-west-1",
  "walg_enabled": true
}
```

Interprétation limitée aux faits observés :

- aucune sauvegarde physique listable n’est retournée ;
- PITR est désactivé ;
- WAL-G est signalé actif ;
- la région est `eu-west-1`.

Ce résultat ne prouve ni le plan de facturation, ni l’existence d’une
sauvegarde Dashboard logique, ni la rétention. Ces informations restent à
confirmer dans le Dashboard Supabase.

## Dump local

`supabase db dump --linked --dry-run` réussit à préparer une commande de lecture
mais son exécution réelle requiert Docker dans cet environnement. Aucun fichier
de sauvegarde n’a été produit.

Les sorties brutes susceptibles de contenir des identifiants temporaires ne
doivent pas être copiées dans Git.

## Conclusion

**Sauvegarde complète vérifiée : FAIL.**

Le contrôle n’a effectué aucune écriture en production.
