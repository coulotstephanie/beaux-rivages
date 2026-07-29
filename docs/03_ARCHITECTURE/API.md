# API

Source canonique : [API.md](../API.md). Les contrats spécialisés restent
référencés depuis cette source.

## Carnet CMS

- `GET /api/admin/carnet` — liste éditoriale complète, personnel authentifié.
- `POST /api/admin/carnet` — création ou mise à jour validée d’une fiche,
  réservée aux rôles `admin` et `concierge`.

Les réponses interdisent le cache navigateur. Les routes sont limitées en débit
et les mutations exigent une origine identique.
