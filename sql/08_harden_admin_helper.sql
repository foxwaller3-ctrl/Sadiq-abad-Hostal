-- Sadiqabad Student Hostel — SQL 08
-- Harden the admin predicate. profiles_select_own allows the caller to see
-- only their own profile, so the predicate does not need SECURITY DEFINER.
-- This avoids exposing a privileged function through the public Data API.

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
