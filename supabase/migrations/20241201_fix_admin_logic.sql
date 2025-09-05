-- Fix admin logic and create functions to manage admin status

-- First, let's create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
LANGUAGE sql 
STABLE 
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (is_admin = true OR role = 'admin')
  );
$$;

-- Create function to set user as admin (only for existing admins)
CREATE OR REPLACE FUNCTION public.set_user_admin(
  p_user_id uuid,
  p_is_admin boolean DEFAULT true
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_email text;
  v_result JSON;
BEGIN
  -- Kiểm tra quyền admin
  IF NOT public.is_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Access denied: Admin privileges required');
  END IF;

  -- Kiểm tra user tồn tại
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Lấy email của user
  SELECT email INTO v_user_email FROM auth.users WHERE id = p_user_id;

  -- Cập nhật profile
  UPDATE public.profiles 
  SET 
    is_admin = p_is_admin,
    role = CASE WHEN p_is_admin THEN 'admin' ELSE 'user' END,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Tạo profile nếu chưa tồn tại
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, is_admin, role, created_at, updated_at)
    VALUES (p_user_id, p_is_admin, CASE WHEN p_is_admin THEN 'admin' ELSE 'user' END, NOW(), NOW());
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', CASE WHEN p_is_admin THEN 'User granted admin privileges' ELSE 'User admin privileges revoked' END,
    'user_id', p_user_id,
    'user_email', v_user_email,
    'is_admin', p_is_admin
  );
END;
$$;

-- Create function to get current user admin status
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_profile_record public.profiles%ROWTYPE;
  v_auth_user_record auth.users%ROWTYPE;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not authenticated');
  END IF;

  -- Lấy thông tin từ auth.users
  SELECT * INTO v_auth_user_record FROM auth.users WHERE id = v_user_id;
  
  -- Lấy thông tin từ profiles
  SELECT * INTO v_profile_record FROM public.profiles WHERE id = v_user_id;
  
  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', v_auth_user_record.email,
    'full_name', COALESCE(v_profile_record.full_name, ''),
    'is_admin', COALESCE(v_profile_record.is_admin, false),
    'role', COALESCE(v_profile_record.role, 'user'),
    'created_at', v_auth_user_record.created_at,
    'profile_exists', v_profile_record.id IS NOT NULL
  );
END;
$$;

-- Update the admin functions to use the new is_admin() function
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  is_admin boolean,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Kiểm tra quyền admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    p.full_name,
    au.created_at,
    p.is_admin,
    p.role
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  ORDER BY au.created_at DESC;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_user_admin(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;

-- Create a debug function to check admin status
CREATE OR REPLACE FUNCTION public.debug_admin_status()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_profile_record public.profiles%ROWTYPE;
  v_auth_user_record auth.users%ROWTYPE;
  v_is_admin_result boolean;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not authenticated');
  END IF;

  -- Lấy thông tin từ auth.users
  SELECT * INTO v_auth_user_record FROM auth.users WHERE id = v_user_id;
  
  -- Lấy thông tin từ profiles
  SELECT * INTO v_profile_record FROM public.profiles WHERE id = v_user_id;
  
  -- Kiểm tra is_admin function
  SELECT public.is_admin() INTO v_is_admin_result;
  
  RETURN json_build_object(
    'success', true,
    'debug_info', json_build_object(
      'user_id', v_user_id,
      'email', v_auth_user_record.email,
      'full_name', COALESCE(v_profile_record.full_name, ''),
      'is_admin_field', v_profile_record.is_admin,
      'role_field', v_profile_record.role,
      'is_admin_function_result', v_is_admin_result,
      'profile_exists', v_profile_record.id IS NOT NULL,
      'created_at', v_auth_user_record.created_at
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_admin_status() TO authenticated;
