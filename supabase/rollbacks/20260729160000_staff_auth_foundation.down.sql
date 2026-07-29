begin;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_auth_user();
drop index if exists public.app_user_roles_role_user_idx;

commit;
