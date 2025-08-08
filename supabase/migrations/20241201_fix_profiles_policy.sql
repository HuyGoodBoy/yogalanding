-- Add a simpler policy for admin to read all profiles
drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select" on public.profiles for select
  using (public.is_admin());

-- Also allow users to read their own profile
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles for select
  using (id = auth.uid());
