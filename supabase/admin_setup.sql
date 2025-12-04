-- Script to promote a user to Admin
-- Usage: Replace 'admin@laghana.org' with the target user's email

DO $$
DECLARE
  target_email TEXT := 'admin@laghana.org'; -- CHANGE THIS EMAIL
  target_id UUID;
BEGIN
  -- Find user ID from auth.users
  SELECT id INTO target_id FROM auth.users WHERE email = target_email;

  IF target_id IS NULL THEN
    RAISE NOTICE 'User with email % not found in auth.users', target_email;
  ELSE
    -- Update profiles table
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = target_id;
    
    RAISE NOTICE 'User % (ID: %) promoted to admin.', target_email, target_id;
  END IF;
END $$;
