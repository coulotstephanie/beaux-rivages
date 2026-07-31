begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

select has_table('public', 'guest_book_entries', 'guest book table exists');
select has_column('public', 'guest_book_entries', 'search_vector', 'full-text search vector exists');
select has_index('public', 'guest_book_entries', 'guest_book_search_idx', 'full-text search is indexed');
select has_index('public', 'guest_book_entries', 'guest_book_tags_idx', 'tags are indexed');
select is((select count(*)::integer from public.guest_book_entries), 8, 'the eight verified Chai entries are seeded');
select is((select count(*)::integer from public.guest_book_entries where featured), 5, 'five entries are featured');
select ok((select relrowsecurity from pg_class where oid = 'public.guest_book_entries'::regclass), 'guest book uses RLS');
select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'guest_book_entries' and 'anon' = any(roles) and cmd = 'SELECT'),
  1,
  'anonymous visitors have one read-only published-content policy'
);

select * from finish();
rollback;
