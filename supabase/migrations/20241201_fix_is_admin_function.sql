-- Fix is_admin function to check both is_admin and role fields
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and (p.is_admin = true or p.role = 'admin')
  );
$$;
