-- Fix enrollment_source enum value in grant_enrollment_direct function
-- The function was using 'admin_grant' but enum only supports 'admin'

-- Drop and recreate grant_enrollment_direct function with correct enum value
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
    'admin',  -- Fixed: use 'admin' instead of 'admin_grant'
    'active',
    now()
  ) ON CONFLICT (user_id, course_id) 
  DO UPDATE SET 
    status = 'active',
    source = 'admin',  -- Fixed: use 'admin' instead of 'admin_grant'
    start_at = now()
  RETURNING id INTO v_enrollment_id;

  RETURN json_build_object(
    'success', true,
    'enrollment_id', v_enrollment_id,
    'user_id', p_user_id,
    'course_id', p_course_id,
    'message', 'Enrollment granted successfully'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.grant_enrollment_direct(uuid, uuid) TO authenticated;
