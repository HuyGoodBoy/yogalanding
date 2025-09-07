-- Fix type mismatch in admin functions

-- Drop and recreate get_all_users function with correct types
DROP FUNCTION IF EXISTS public.get_all_users();

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
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p_check
    WHERE p_check.id = auth.uid() AND (p_check.is_admin = true OR p_check.role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id as id,
    au.email::text as email,
    COALESCE(p.full_name, '')::text as full_name,
    au.created_at,
    COALESCE(p.is_admin, false) as is_admin,
    COALESCE(p.role, 'user')::text as role
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  ORDER BY au.created_at DESC;
END;
$$;

-- Drop and recreate get_user_enrollments function
DROP FUNCTION IF EXISTS public.get_user_enrollments(uuid);

CREATE OR REPLACE FUNCTION public.get_user_enrollments(p_user_id uuid)
RETURNS TABLE (
  enrollment_id uuid,
  course_id uuid,
  course_title text,
  course_slug text,
  enrollment_status text,
  source text,
  start_at timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Kiểm tra quyền admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p_check
    WHERE p_check.id = auth.uid() AND (p_check.is_admin = true OR p_check.role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    e.id as enrollment_id,
    e.course_id,
    c.title::text as course_title,
    c.slug::text as course_slug,
    e.status::text as enrollment_status,
    e.source::text as source,
    e.start_at,
    e.created_at
  FROM public.enrollments e
  JOIN public.courses c ON e.course_id = c.id
  WHERE e.user_id = p_user_id
  ORDER BY e.created_at DESC;
END;
$$;

-- Drop and recreate revoke_enrollment function
DROP FUNCTION IF EXISTS public.revoke_enrollment(uuid);

CREATE OR REPLACE FUNCTION public.revoke_enrollment(
  p_enrollment_id uuid
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_enrollment_record public.enrollments%ROWTYPE;
  v_course_record public.courses%ROWTYPE;
BEGIN
  -- Kiểm tra quyền admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (is_admin = true OR role = 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Access denied: Admin privileges required');
  END IF;

  -- Lấy thông tin enrollment
  SELECT * INTO v_enrollment_record 
  FROM public.enrollments 
  WHERE id = p_enrollment_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Enrollment not found');
  END IF;

  -- Lấy thông tin course
  SELECT * INTO v_course_record 
  FROM public.courses 
  WHERE id = v_enrollment_record.course_id;

  -- Xóa enrollment
  DELETE FROM public.enrollments WHERE id = p_enrollment_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Enrollment revoked successfully',
    'course_title', v_course_record.title,
    'user_id', v_enrollment_record.user_id
  );
END;
$$;

-- Drop and recreate grant_enrollment_direct function
DROP FUNCTION IF EXISTS public.grant_enrollment_direct(uuid, uuid);

CREATE OR REPLACE FUNCTION public.grant_enrollment_direct(
  p_user_id uuid,
  p_course_id uuid
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_record public.profiles%ROWTYPE;
  v_course_record public.courses%ROWTYPE;
  v_enrollment_id uuid;
BEGIN
  -- Kiểm tra quyền admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (is_admin = true OR role = 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Access denied: Admin privileges required');
  END IF;

  -- Kiểm tra user tồn tại
  SELECT * INTO v_user_record 
  FROM public.profiles p_user
  WHERE p_user.id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Kiểm tra course tồn tại
  SELECT * INTO v_course_record 
  FROM public.courses c_course
  WHERE c_course.id = p_course_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Course not found');
  END IF;

  -- Tạo enrollment (hoặc cập nhật nếu đã tồn tại)
  INSERT INTO public.enrollments (
    user_id,
    course_id,
    source,
    status,
    start_at
  ) VALUES (
    p_user_id,
    p_course_id,
    'admin',
    'active',
    now()
  ) ON CONFLICT (user_id, course_id) 
  DO UPDATE SET 
    status = 'active',
    source = 'admin_grant',
    start_at = now()
  RETURNING id INTO v_enrollment_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Enrollment granted successfully',
    'enrollment_id', v_enrollment_id,
    'course_title', v_course_record.title,
    'user_name', v_user_record.full_name
  );
END;
$$;

-- Drop and recreate get_all_courses function
DROP FUNCTION IF EXISTS public.get_all_courses();

CREATE OR REPLACE FUNCTION public.get_all_courses()
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  price_vnd bigint,
  instructor text,
  status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Kiểm tra quyền admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p_check
    WHERE p_check.id = auth.uid() AND (p_check.is_admin = true OR p_check.role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    c.id as id,
    c.title::text as title,
    c.slug::text as slug,
    c.price_vnd,
    COALESCE(c.instructor, '')::text as instructor,
    c.status::text as status,
    c.created_at
  FROM public.courses c
  ORDER BY c.created_at DESC;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_enrollments(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_enrollment(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_enrollment_direct(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_courses() TO authenticated;
