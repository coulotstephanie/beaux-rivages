# Livre d’Or premium — architecture

## Principe éditorial

Le Livre d’Or numérique prolonge les carnets physiques des maisons. Une transcription conserve le ton et la langue d’origine. Aucun texte OCR n’est publié automatiquement et aucune citation n’est inventée.

## Workflow OCR Ready

1. **Photo reçue** (`photo_received`) : l’original est conservé dans un stockage privé.
2. **OCR à vérifier** (`ocr_review`) : un fournisseur futur peut remplir `ocr_raw_text`, `ocr_provider` et `ocr_confidence`.
3. **Validation humaine** (`validated`) : un membre autorisé compare la transcription à la photo.
4. **Publication** (`published`) : seule cette étape rend le texte visible publiquement.

Le fournisseur OCR reste interchangeable. La migration n’impose aucun service externe.

## Données et sécurité

- `guest_book_entries` contient la maison, la date et sa précision, la langue, l’auteur affiché, le texte, les thèmes, l’image source et le statut.
- Le public ne lit que les entrées publiées.
- Les rôles `admin` et `concierge` peuvent créer et modifier.
- Seul `admin` peut supprimer.
- Les recherches utilisent un index PostgreSQL GIN sur `search_vector`.
- Les photos sources doivent rester privées tant que leur publication n’est pas explicitement validée.

## Interfaces

- `/livre-d-or` : collection publique, recherche, filtres, statistiques et pagination.
- Page du Chai : aperçu des cinq entrées mises en avant.
- Back Office > Livre d’Or : CRUD et validation du workflow.
- `/api/guestbook` : lecture publique des entrées publiées.
- `/api/admin/guestbook` : lecture et mutations authentifiées.

## Déploiement

La migration et son rollback sont préparés localement. Ils ne doivent être appliqués à Supabase qu’après revue et sauvegarde vérifiée. Les données initiales servent de repli éditorial jusqu’à l’application contrôlée de la migration.
