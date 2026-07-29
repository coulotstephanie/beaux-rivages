# API

Les routes publiques valident les entrées, limitent le débit et ne retournent aucune donnée interne. Les routes `/api/admin/*` exigent `ADMIN_API_TOKEN`; leurs mutations exigent également une origine identique.

Les erreurs exposent un message utilisateur et un code stable sans détail de base de données. Les montants reçus du navigateur ne sont jamais considérés comme autoritaires : prix et soldes sont recalculés côté serveur.

APIs administratives actuelles : opérations, messages, revenue, Channel Manager, Housekeeping, Yield Management, exports et remboursements.
