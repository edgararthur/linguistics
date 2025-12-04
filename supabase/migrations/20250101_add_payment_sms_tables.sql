-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id uuid REFERENCES members(id) ON DELETE
    SET NULL,
        amount numeric NOT NULL,
        service_fee numeric DEFAULT 0,
        total_amount numeric NOT NULL,
        currency text DEFAULT 'GHS',
        status text DEFAULT 'pending',
        -- pending, completed, failed
        reference text,
        network text,
        payer_name text,
        payer_phone text,
        provider_reference text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Create sms_logs table
CREATE TABLE IF NOT EXISTS sms_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recipients text [] NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'pending',
    -- success, failed
    provider_response jsonb,
    error_message text,
    sent_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Add RLS policies (simplified for now, assuming admin has full access)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
-- Allow public insert for payments (for now, to allow unauthenticated payments)
CREATE POLICY "Enable insert for all users" ON payments FOR
INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all users" ON payments FOR
SELECT USING (true);
-- Should restrict to admin/owner
-- Allow admin read/write for sms_logs
CREATE POLICY "Enable all access for authenticated users" ON sms_logs FOR ALL USING (auth.role() = 'authenticated');