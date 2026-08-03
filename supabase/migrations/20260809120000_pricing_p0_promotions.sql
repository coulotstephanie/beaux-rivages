begin;

-- Les promotions d'exemple ne constituent pas des règles commerciales obligatoires.
-- Le propriétaire repart d'un catalogue intégralement administrable.
delete from public.promotions
where name in ('Séjour de 7 nuits', 'Réservation anticipée');

commit;
