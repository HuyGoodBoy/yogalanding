-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.create_order(text[], integer);
DROP FUNCTION IF EXISTS public.create_order(uuid[], integer);
DROP FUNCTION IF EXISTS public.mark_order_paid(uuid);
DROP FUNCTION IF EXISTS public.grant_enrollments_for_order(uuid);
DROP FUNCTION IF EXISTS public.is_enrolled_in_course(uuid);
DROP FUNCTION IF EXISTS public.get_user_enrollments();

-- Create order function
CREATE OR REPLACE FUNCTION public.create_order(
  p_course_ids uuid[],
  p_total_amount_vnd integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_user_id uuid;
  v_course_record record;
  v_order_item_id uuid;
  v_result json;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Create order
  INSERT INTO public.orders (
    user_id,
    status,
    total_amount_vnd,
    payment_provider,
    client_return_url,
    metadata
  ) VALUES (
    v_user_id,
    'pending',
    p_total_amount_vnd,
    'vnpay',
    null,
    jsonb_build_object('course_ids', p_course_ids)
  ) RETURNING id INTO v_order_id;

  -- Create order items for each course
  FOR v_course_record IN 
    SELECT id, price_vnd 
    FROM public.courses 
    WHERE id = ANY(p_course_ids)
  LOOP
    INSERT INTO public.order_items (
      order_id,
      course_id,
      quantity,
      amount_vnd
    ) VALUES (
      v_order_id,
      v_course_record.id,
      1,
      v_course_record.price_vnd
    );
  END LOOP;

  -- Return order details
  SELECT json_build_object(
    'order_id', v_order_id,
    'user_id', v_user_id,
    'total_amount_vnd', p_total_amount_vnd,
    'course_ids', p_course_ids
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_order(uuid[], integer) TO authenticated;

-- Create function to mark order as paid
CREATE OR REPLACE FUNCTION public.mark_order_paid(
  p_order_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update order status to paid
  UPDATE public.orders 
  SET status = 'paid', updated_at = now()
  WHERE id = p_order_id;
  
  -- Grant enrollments for all courses in the order
  PERFORM public.grant_enrollments_for_order(p_order_id);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.mark_order_paid(uuid) TO authenticated;

-- Create function to grant enrollments for order
CREATE OR REPLACE FUNCTION public.grant_enrollments_for_order(
  p_order_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_record record;
  v_order_item_record record;
BEGIN
  -- Get order details
  SELECT * INTO v_order_record FROM public.orders WHERE id = p_order_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  -- Create enrollments for each course in the order
  FOR v_order_item_record IN 
    SELECT course_id 
    FROM public.order_items 
    WHERE order_id = p_order_id
  LOOP
    -- Insert enrollment if not already exists
    INSERT INTO public.enrollments (
      user_id,
      course_id,
      source,
      status,
      start_at
    ) VALUES (
      v_order_record.user_id,
      v_order_item_record.course_id,
      'purchase',
      'active',
      now()
    ) ON CONFLICT (user_id, course_id) DO NOTHING;
  END LOOP;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.grant_enrollments_for_order(uuid) TO authenticated;

-- Create function to check if user is enrolled in course
CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(
  p_course_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_enrollment_count integer;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  SELECT COUNT(*) INTO v_enrollment_count
  FROM public.enrollments
  WHERE user_id = v_user_id 
    AND course_id = p_course_id 
    AND status = 'active';
  
  RETURN v_enrollment_count > 0;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_enrolled_in_course(uuid) TO authenticated;

-- Create function to get user enrollments
CREATE OR REPLACE FUNCTION public.get_user_enrollments()
RETURNS TABLE (
  enrollment_id uuid,
  course_id uuid,
  course_title text,
  course_slug text,
  enrollment_status text,
  enrollment_source text,
  enrollment_created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  RETURN QUERY
  SELECT 
    e.id as enrollment_id,
    e.course_id,
    c.title as course_title,
    c.slug as course_slug,
    e.status as enrollment_status,
    e.source as enrollment_source,
    e.created_at as enrollment_created_at
  FROM public.enrollments e
  JOIN public.courses c ON e.course_id = c.id
  WHERE e.user_id = v_user_id
  ORDER BY e.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_enrollments() TO authenticated;
