-- 1. Create the Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id, 
    new.email, 
    CASE WHEN new.email = 'admin@laghana.org' THEN 'admin' ELSE 'member' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Fix Admin Account (Profile & Email Confirmation)
DO $$
DECLARE
  target_email TEXT := 'admin@laghana.org';
  target_id UUID;
BEGIN
  -- Find the user in auth.users
  SELECT id INTO target_id FROM auth.users WHERE email = target_email;
  
  IF target_id IS NOT NULL THEN
    -- A. Manually confirm the email so login works immediately
    UPDATE auth.users
    SET email_confirmed_at = now()
    WHERE id = target_id AND email_confirmed_at IS NULL;
    
    RAISE NOTICE 'Manually confirmed email for %', target_email;

    -- B. Check if profile exists, if not insert it
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_id) THEN
      INSERT INTO public.profiles (id, email, role)
      VALUES (target_id, target_email, 'admin');
      RAISE NOTICE 'Created profile for existing user %', target_email;
    ELSE
      -- C. Update existing profile to admin
      UPDATE public.profiles
      SET role = 'admin'
      WHERE id = target_id;
      RAISE NOTICE 'Updated role for existing user %', target_email;
    END IF;
  ELSE
    RAISE NOTICE 'User % not found in auth.users. Please create the user via Supabase Dashboard or /admin/setup page first.', target_email;
  END IF;
END $$;
