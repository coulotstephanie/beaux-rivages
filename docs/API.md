# Contrats API

## Principes

- réponses privées avec `Cache-Control: private, no-store` ;
- validation Zod ou métier avant mutation ;
- limitation de débit ;
- contrôle d’origine sur les mutations navigateur ;
- audit des opérations sensibles ;
- aucun secret dans une variable `NEXT_PUBLIC_`.

## Authentification du Back Office

La connexion `/api/auth/staff` place la session dans un cookie `HttpOnly`,
`Secure` en production et `SameSite=Lax`. Les intégrations internes peuvent
également transmettre :

```http
Authorization: Bearer <supabase-access-token>
```

`authorizeStaff()` lit le cookie ou l’en-tête, vérifie le JWT avec Supabase Auth, charge
`app_user_roles`, choisit le rôle prioritaire et contrôle la permission.
Pendant la migration, `ADMIN_API_TOKEN` reste accepté sauf lorsque
`ADMIN_TOKEN_FALLBACK_ENABLED=false`.

## Matrice administrative

| Route | Lecture | Mutation |
| --- | --- | --- |
| `/api/admin/operations` | tous les rôles | `admin`, `concierge` |
| `/api/admin/dashboard` | tous les rôles | — |
| `/api/admin/channel-manager` | `admin`, `read_only` | `admin` |
| `/api/admin/revenue` | tous les rôles | `admin` |
| `/api/admin/housekeeping` | tous les rôles | `admin`, `concierge` |
| `/api/admin/export` | `admin`, `read_only` | — |
| `/api/admin/guest-messages/preview` | — | `admin`, `concierge` |
| `/api/admin/payments/refund` | — | `admin` |
| `/api/calendar/admin` | tous les rôles | `admin`, `concierge` |
| `/api/rates` | public | `admin` |
| `/api/promotions` | public | `admin` |

Une authentification absente ou invalide produit `401`. Une identité valide sans
permission produit `403`. Les routes publiques de réservation et de séjour ne
changent pas pendant ce sprint.
