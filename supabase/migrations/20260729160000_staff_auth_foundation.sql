begin;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, display_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.users (id, display_name)
select
  auth_user.id,
  nullif(trim(coalesce(auth_user.raw_user_meta_data ->> 'display_name', '')), '')
from auth.users auth_user
on conflict (id) do nothing;

create index if not exists app_user_roles_role_user_idx
on public.app_user_roles (role, user_id);

comment on table public.app_user_roles is
  'Roles internes attribués aux comptes Supabase Auth. Une absence de rôle interdit tout accès au Back Office.';
comment on function public.current_app_role() is
  'Retourne le rôle interne prioritaire du compte Supabase Auth courant.';
comment on function public.handle_new_auth_user() is
  'Crée automatiquement le profil public minimal associé à un nouveau compte Supabase Auth.';

commit;
