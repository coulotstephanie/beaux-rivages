# Base de données

Supabase PostgreSQL est la source transactionnelle. Toute évolution passe par une migration datée et un rollback associé.

Règles : clés UUID, contraintes métier en base, index sur parcours opérationnels, triggers `updated_at`, montants en centimes, dates de séjour en `date`, horodatages en `timestamptz`, RLS sur toute table exposée.

Les domaines principaux sont réservations, voyageurs, tarification, Guest Journey, Revenue, Channel Manager, Concierge, Housekeeping et Yield Management. Les repositories serveur sont les seules couches autorisées à composer plusieurs domaines.
