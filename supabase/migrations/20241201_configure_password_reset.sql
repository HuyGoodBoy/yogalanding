-- Configure password reset email settings
-- This migration sets up the email templates and settings for password reset

-- Enable email confirmation and password reset
-- Note: These settings need to be configured in the Supabase Dashboard under Authentication > Settings
-- But we can create the necessary database functions and policies here

-- Create a function to handle password reset completion
CREATE OR REPLACE FUNCTION public.handle_password_reset()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Log the password reset event
  INSERT INTO public.transaction_history (
    user_id,
    transaction_type,
    amount,
    description,
    created_at
  ) VALUES (
    NEW.id,
    'password_reset',
    0,
    'Password was reset successfully',
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the password reset if logging fails
    RAISE WARNING 'Error logging password reset: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for password reset logging (optional)
-- This will log when a user's password is updated
-- Note: This is a simplified approach. In production, you might want to use Supabase's built-in audit logging

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_password_reset() TO anon, authenticated;

-- Create a function to validate password reset tokens
CREATE OR REPLACE FUNCTION public.validate_reset_token(token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- This is a placeholder function
  -- In practice, Supabase handles token validation automatically
  -- This function could be used for additional validation if needed
  RETURN true;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.validate_reset_token(text) TO anon, authenticated;

-- Ensure the auth.users table has the necessary policies
-- Note: Most auth policies are managed by Supabase automatically
-- But we can add custom policies if needed

-- Create a view for password reset status (optional)
CREATE OR REPLACE VIEW public.password_reset_status AS
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.last_sign_in_at,
  u.created_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN 'confirmed'
    ELSE 'unconfirmed'
  END as email_status
FROM auth.users u;

-- Grant permissions on the view
GRANT SELECT ON public.password_reset_status TO anon, authenticated;

-- Add a comment explaining the setup
COMMENT ON FUNCTION public.handle_password_reset() IS 'Logs password reset events for audit purposes';
COMMENT ON FUNCTION public.validate_reset_token(text) IS 'Validates password reset tokens (placeholder function)';
COMMENT ON VIEW public.password_reset_status IS 'Shows password reset and email confirmation status for users';
