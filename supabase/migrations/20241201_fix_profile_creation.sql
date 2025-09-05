-- Fix profile creation for new users
-- This migration ensures that profiles are created when users sign up

-- First, let's check if there are any users without profiles
-- and create profiles for them
INSERT INTO public.profiles (id, full_name, avatar_url, phone, created_at, updated_at, is_admin, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'avatar_url', ''),
  COALESCE(au.raw_user_meta_data->>'phone', ''),
  au.created_at,
  au.updated_at,
  false,
  'user'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, created_at, updated_at, is_admin, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NOW(),
    NOW(),
    false,
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = NOW();

  -- Create user balance entry
  INSERT INTO public.user_balances (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure the profiles table has the correct structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Update existing profiles that might be missing these columns
UPDATE public.profiles 
SET is_admin = false 
WHERE is_admin IS NULL;

UPDATE public.profiles 
SET role = 'user' 
WHERE role IS NULL;

-- Ensure RLS policies are correct
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Recreate RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Ensure the profiles table is enabled for RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;

-- Create a function to manually create profile for existing users
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profiles for users who don't have them
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, created_at, updated_at, is_admin, role)
  SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    COALESCE(au.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(au.raw_user_meta_data->>'phone', ''),
    au.created_at,
    au.updated_at,
    false,
    'user'
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE p.id IS NULL;

  -- Create user balances for users who don't have them
  INSERT INTO public.user_balances (user_id, balance)
  SELECT 
    au.id,
    0
  FROM auth.users au
  LEFT JOIN public.user_balances ub ON au.id = ub.user_id
  WHERE ub.user_id IS NULL;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_missing_profiles() TO anon, authenticated;

-- Run the function to create missing profiles
SELECT public.create_missing_profiles();

-- Add a comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates profile and user balance when a new user signs up';
COMMENT ON FUNCTION public.create_missing_profiles() IS 'Creates missing profiles and balances for existing users';
