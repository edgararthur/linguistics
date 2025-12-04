-- Add missing columns to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS alternative_email text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS country text,
    ADD COLUMN IF NOT EXISTS qualification text,
    ADD COLUMN IF NOT EXISTS whatsapp_consent boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS joined_year text,
    ADD COLUMN IF NOT EXISTS other_names text,
    ADD COLUMN IF NOT EXISTS profile_url text,
    ADD COLUMN IF NOT EXISTS dues_paid_until timestamp with time zone;
-- Make sure research_area and affiliation are nullable if they aren't already, or keep them as is.
-- The script assumes they exist.