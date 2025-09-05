-- Test and debug profile creation
-- This migration helps debug why profiles are not being created

-- First, let's see what users exist without profiles
SELECT 
  'Users without profiles:' as info,
  au.id,
  au.email,
  au.raw_user_meta_data,
  au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Check if the trigger exists
SELECT 
  'Trigger info:' as info,
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
  'Function info:' as info,
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Test the function manually with a sample user
-- (This will only work if there are users without profiles)
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get the first user without a profile
  SELECT au.id INTO test_user_id
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE p.id IS NULL
  LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    RAISE NOTICE 'Found user without profile: %', test_user_id;
    
    -- Try to create profile manually
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
    WHERE au.id = test_user_id;
    
    RAISE NOTICE 'Profile created for user: %', test_user_id;
  ELSE
    RAISE NOTICE 'No users without profiles found';
  END IF;
END $$;

-- Create a function to manually trigger profile creation for all users
CREATE OR REPLACE FUNCTION public.force_create_all_profiles()
RETURNS TABLE(user_id uuid, profile_created boolean, error_message text)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  profile_count INTEGER;
BEGIN
  -- Loop through all users
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data, au.created_at, au.updated_at
    FROM auth.users au
  LOOP
    BEGIN
      -- Check if profile exists
      SELECT COUNT(*) INTO profile_count
      FROM public.profiles
      WHERE id = user_record.id;
      
      IF profile_count = 0 THEN
        -- Create profile
        INSERT INTO public.profiles (id, full_name, avatar_url, phone, created_at, updated_at, is_admin, role)
        VALUES (
          user_record.id,
          COALESCE(user_record.raw_user_meta_data->>'full_name', ''),
          COALESCE(user_record.raw_user_meta_data->>'avatar_url', ''),
          COALESCE(user_record.raw_user_meta_data->>'phone', ''),
          user_record.created_at,
          user_record.updated_at,
          false,
          'user'
        );
        
        -- Create user balance
        INSERT INTO public.user_balances (user_id, balance)
        VALUES (user_record.id, 0)
        ON CONFLICT (user_id) DO NOTHING;
        
        user_id := user_record.id;
        profile_created := true;
        error_message := NULL;
      ELSE
        user_id := user_record.id;
        profile_created := false;
        error_message := 'Profile already exists';
      END IF;
      
      RETURN NEXT;
      
    EXCEPTION
      WHEN OTHERS THEN
        user_id := user_record.id;
        profile_created := false;
        error_message := SQLERRM;
        RETURN NEXT;
    END;
  END LOOP;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.force_create_all_profiles() TO anon, authenticated;

-- Run the function to create missing profiles
SELECT * FROM public.force_create_all_profiles();

-- Add a comment
COMMENT ON FUNCTION public.force_create_all_profiles() IS 'Forces creation of profiles for all users, useful for debugging';
