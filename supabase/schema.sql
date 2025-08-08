-- Supabase SQL schema for Yoga Landing
-- Run this in the Supabase SQL editor (or via CLI) in the main project.

-- Extensions
create extension if not exists pgcrypto with schema public; -- for gen_random_uuid

-- Enums
do $$ begin
  create type public.order_status as enum ('pending','paid','failed','expired','canceled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending','success','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_provider as enum ('vnpay');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_status as enum ('active','canceled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_source as enum ('purchase','gift','admin');
exception when duplicate_object then null; end $$;

-- Helper: updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;$$;

-- (defined after `public.profiles` is created)

-- Profiles table mapped to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'user', -- user | admin | instructor (optional)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger t_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Helper: check admin (must come after profiles table exists)
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and (p.is_admin = true or p.role = 'admin')
  );
$$;

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  thumbnail_url text,
  level text,
  duration_weeks int,
  price_vnd bigint not null check (price_vnd >= 0),
  instructor text default 'Phạm Diệu Thuý',
  youtube_playlist_url text,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_courses_slug on public.courses(slug);
create trigger t_courses_updated_at before update on public.courses
  for each row execute function public.set_updated_at();

-- Orders (one order can contain multiple courses)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.order_status not null default 'pending',
  total_amount_vnd bigint not null default 0,
  payment_provider public.payment_provider default 'vnpay',
  client_return_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_user on public.orders(user_id);
create trigger t_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  quantity int not null default 1 check (quantity > 0),
  amount_vnd bigint not null,
  created_at timestamptz not null default now()
);
create unique index if not exists uniq_order_course on public.order_items(order_id, course_id);

-- Payments (created when VNPay returns/IPN)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider public.payment_provider not null,
  transaction_no text, -- vnp_TransactionNo
  bank_code text,
  pay_date timestamptz,
  amount_vnd bigint not null,
  status public.payment_status not null default 'pending',
  signature_valid boolean default false,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_payments_order on public.payments(order_id);
create trigger t_payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- Enrollment: what courses a user owns
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  source public.enrollment_source not null default 'purchase',
  status public.enrollment_status not null default 'active',
  start_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create unique index if not exists uniq_enrollment_user_course on public.enrollments(user_id, course_id);

-- VNPay IPN logs (optional for debugging)
create table if not exists public.vnpay_ipn_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  received_at timestamptz not null default now(),
  is_signature_valid boolean default false,
  payload jsonb
);

-- Function: grant enrollments for a paid order
create or replace function public.grant_enrollments_for_order(p_order_id uuid)
returns void language plpgsql as $$
declare
  v_user uuid;
begin
  select user_id into v_user from public.orders where id = p_order_id;
  if v_user is null then
    raise exception 'Order not found';
  end if;

  insert into public.enrollments (user_id, course_id, source)
  select v_user, oi.course_id, 'purchase'
  from public.order_items oi
  where oi.order_id = p_order_id
  on conflict (user_id, course_id) do nothing;
end;$$;

-- Function: process successful payment
-- This should be called from a server-side context (Edge Function) using the service key
create or replace function public.mark_order_paid(
  p_order_id uuid,
  p_provider public.payment_provider,
  p_transaction_no text,
  p_bank_code text,
  p_pay_date timestamptz,
  p_amount_vnd bigint,
  p_signature_valid boolean,
  p_raw jsonb
) returns void
language plpgsql
security definer set search_path = public as $$
begin
  -- Only allow service role to execute
  if auth.role() <> 'service_role' then
    raise exception 'Forbidden';
  end if;

  -- Create payment record
  insert into public.payments(order_id, provider, transaction_no, bank_code, pay_date, amount_vnd, status, signature_valid, raw_response)
  values (p_order_id, p_provider, p_transaction_no, p_bank_code, p_pay_date, p_amount_vnd,
          case when p_signature_valid then 'success' else 'failed' end,
          p_signature_valid, p_raw);

  if p_signature_valid then
    update public.orders set status = 'paid' where id = p_order_id;
    perform public.grant_enrollments_for_order(p_order_id);
  else
    update public.orders set status = 'failed' where id = p_order_id;
  end if;
end;$$;

-- RPC: create order from a list of course ids
create or replace function public.create_order(p_course_ids uuid[], p_client_return_url text default null)
returns uuid language plpgsql as $$
declare
  v_order_id uuid;
  v_total bigint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.orders(user_id, client_return_url)
  values (auth.uid(), p_client_return_url)
  returning id into v_order_id;

  insert into public.order_items(order_id, course_id, quantity, amount_vnd)
  select v_order_id, c.id, 1, c.price_vnd from public.courses c
  where c.id = any(p_course_ids);

  select coalesce(sum(amount_vnd * quantity),0) into v_total from public.order_items where order_id = v_order_id;
  update public.orders set total_amount_vnd = v_total where id = v_order_id;

  return v_order_id;
end;$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.enrollments enable row level security;
alter table public.payments enable row level security;
alter table public.vnpay_ipn_logs enable row level security;

-- Policies
-- profiles: users can view/update their own record; admins can view all
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles for insert with check (id = auth.uid());

-- courses: public readable, only admin can write
drop policy if exists "courses_select_all" on public.courses;
create policy "courses_select_all" on public.courses for select using (true);

drop policy if exists "courses_admin_write" on public.courses;
create policy "courses_admin_write" on public.courses for all using (public.is_admin()) with check (public.is_admin());

-- orders: owner can read; only owner can insert; no direct updates from client after creation
drop policy if exists "orders_owner_select" on public.orders;
create policy "orders_owner_select" on public.orders for select using (user_id = auth.uid());

drop policy if exists "orders_owner_insert" on public.orders;
create policy "orders_owner_insert" on public.orders for insert with check (user_id = auth.uid());

-- order_items: only access items of own orders
drop policy if exists "order_items_owner_access" on public.order_items;
create policy "order_items_owner_access" on public.order_items for all
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()))
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- enrollments: user can read their own; admin can manage
drop policy if exists "enrollments_owner_select" on public.enrollments;
create policy "enrollments_owner_select" on public.enrollments for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "enrollments_admin_write" on public.enrollments;
create policy "enrollments_admin_write" on public.enrollments for all using (public.is_admin()) with check (public.is_admin());

-- payments: no client access (service role only). Create read for owner to view their payment history.
drop policy if exists "payments_owner_select" on public.payments;
create policy "payments_owner_select" on public.payments for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- vnpay_ipn_logs: no public policies (service role only)

-- Auth trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();


