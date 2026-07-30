# Backup & Restore Standard Operating Procedure

Version 1.0 — procédure obligatoire avant toute migration Supabase.

## 1. Principe

Aucune migration n’est appliquée à la production sans :

1. un point de restauration daté et vérifié ;
2. une copie séparée des objets Storage ;
3. un inventaire des paramètres hors base ;
4. une restauration réussie sur un miroir isolé ;
5. une recette signée et un rollback chronométré.

Les dumps, journaux contenant des identifiants et données personnelles restent
hors Git, sur un stockage chiffré à accès restreint.

## 2. Standard Beaux Rivages

La méthode officielle privilégiée est :

**sauvegarde physique Supabase + “Restore to a New Project” + sauvegarde
Storage/configuration séparée.**

Elle est retenue car elle clone la base, les rôles et Auth dans une cible
indépendante, sans écriture dans la source. Elle suppose un plan payant avec
sauvegardes physiques. Si cette capacité n’est pas disponible, utiliser un dump
PostgreSQL natif vérifié, mais conserver les mêmes étapes de restauration et de
recette.

## 3. Rôles

- Release Manager : ouvre et clôt la procédure, interdit les migrations ;
- propriétaire Supabase : atteste plan, backup et coût du miroir ;
- opérateur base : restaure, compare et applique les migrations au miroir ;
- responsable recette : signe les scénarios métier ;
- responsable Go Live : prononce le Go/No-Go.

Une même personne peut cumuler les rôles, mais chaque preuve doit être datée.

## 4. Préflight

Consigner dans le procès-verbal :

- commit et branche candidats ;
- référence, région et version PostgreSQL du projet ;
- plan Supabase et type de sauvegarde ;
- date/heure UTC de la dernière sauvegarde réussie ;
- taille base et Storage ;
- migrations locales/distantes ;
- responsable, fenêtre et contacts ;
- RPO/RTO approuvés.

Commandes en lecture seule :

```bash
git rev-parse HEAD
npx supabase projects list --output json
npx supabase migration list --linked
npx supabase db lint --linked --level warning
npm run db:verify-migrations
npx supabase db push --linked --dry-run
```

Arrêt immédiat si une migration distante manque dans Git, si un rollback manque
ou si le lint échoue.

## 5. Sauvegarde avant migration

### 5.1 Sauvegarde gérée

Dans **Supabase Dashboard > Database > Backups** :

1. relever le plan et la rétention ;
2. capturer la dernière sauvegarde réussie et son horodatage ;
3. confirmer le type logique/physique et l’option PITR ;
4. sélectionner **Restore to a New Project** sans lancer la création ;
5. faire approuver le coût et la région ;
6. lancer le clone seulement après autorisation.

Ne jamais restaurer par-dessus la production pour une recette.

### 5.2 Storage

Inventorier les buckets, leur caractère public/privé, le nombre d’objets et le
volume. Copier récursivement les objets vers un répertoire chiffré ou vers les
buckets du miroir avec la commande CLI officiellement supportée :

```bash
supabase storage cp ss:/// /volume-chiffre/storage -r --experimental
```

Tester l’ouverture d’un échantillon et comparer le nombre d’objets. La copie
Storage est obligatoire : les sauvegardes de base n’incluent pas les fichiers.

### 5.3 Configuration hors base

Exporter ou inventorier, sans publier les valeurs :

- Auth : URL, redirect URLs, fournisseurs, SMTP, MFA, durées JWT ;
- Realtime, extensions et publications ;
- Storage : limites, transformations, S3 ;
- Edge Functions et noms de secrets ;
- webhooks, cron, `pg_net`, wrappers ;
- restrictions réseau, SSL, compute et disque ;
- variables Vercel par environnement.

## 6. Alternative PostgreSQL native

Prérequis :

- client PostgreSQL compatible avec le serveur ;
- chaîne Session pooler et mot de passe obtenus dans le Dashboard ;
- volume chiffré, permissions `0700`, fichiers `0600` ;
- espace libre supérieur à deux fois la taille estimée.

```bash
export BR_BACKUP_DIR="/volume-chiffre/beaux-rivages/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BR_BACKUP_DIR"
chmod 700 "$BR_BACKUP_DIR"
export DATABASE_URL="postgresql://..."
npm run db:backup
shasum -a 256 "$BR_BACKUP_DIR"/* > "$BR_BACKUP_DIR/SHA256SUMS"
chmod 600 "$BR_BACKUP_DIR"/*
```

Le dump doit couvrir explicitement les schémas nécessaires. Le dump CLI
Supabase standard exclut des schémas gérés, dont `auth` et `storage`; il ne
suffit donc pas seul à une sauvegarde complète.

## 7. Restauration miroir

1. créer/restaurer un projet distinct en `eu-west-1` ;
2. ne connecter ni domaine public ni Vercel Production ;
3. remplacer e-mail, Stripe, calendriers et webhooks par des cibles TEST ;
4. désactiver `pg_cron`, `pg_net`, wrappers et appels externes ;
5. restaurer ou vérifier la base clonée ;
6. restaurer les objets Storage ;
7. appliquer les paramètres hors base nécessaires à la recette ;
8. enregistrer heure de début et fin pour calculer le RTO.

Pour un dump custom :

```bash
export DATABASE_URL="postgresql://...miroir..."
bash scripts/restore-supabase.sh /volume-chiffre/backup.dump
```

## 8. Vérification d’intégrité

Comparer source et miroir avec des résultats agrégés :

- schémas, tables, vues, fonctions, triggers, index, contraintes et politiques ;
- migrations enregistrées ;
- nombre de lignes par table ;
- sommes financières agrégées ;
- échantillons de réservations, paiements, contrats et audits ;
- comptes Auth et rôles ;
- buckets, objets et tailles ;
- erreurs de restauration.

Ne jamais copier de donnée personnelle dans le procès-verbal.

## 9. Test des migrations et du rollback

Sur le miroir uniquement :

```bash
npx supabase link --project-ref "<REF_MIROIR>"
npx supabase db push --linked --dry-run
npx supabase db push --linked
npx supabase db lint --linked --level warning
npm run db:types
npm run validate
npm run test:e2e
```

Exécuter les rollbacks dans l’ordre inverse sur une seconde copie ou après un
snapshot du miroir. Vérifier la conservation des données avant de chronométrer
le retour arrière.

## 10. Validation post-restauration

Signer les scénarios : authentification, réservation, indisponibilités, Stripe
TEST, contrats, Dashboard, Revenue/Yield, Carnet, Housekeeping, Maintenance,
CRM, responsive et multilingue. Vérifier journaux, santé et alertes.

## 11. Critères GO

Tous sont obligatoires :

- sauvegarde base récente et horodatée ;
- Storage et configuration sauvegardés ;
- restauration miroir réussie ;
- contrôles d’intégrité sans écart inexpliqué ;
- migrations et rollbacks réussis sur miroir ;
- tests, build et recette verts sur le commit exact ;
- RTO/RPO mesurés et acceptés ;
- retour arrière compatible avec la fenêtre ;
- responsables et surveillance confirmés.

Un seul élément absent entraîne **NO-GO**.

## 12. Conservation

Conserver le procès-verbal, les checksums et les journaux selon la politique
d’exploitation. Tester cette procédure avant chaque release avec migration et
au minimum trimestriellement, même sans migration.
