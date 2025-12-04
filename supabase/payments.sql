-- Create payments table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references public.members(id) on delete set null,
  amount decimal(10,2) not null, -- Dues amount
  service_fee decimal(10,2) default 1.00, -- Fixed service fee
  total_amount decimal(10,2) not null, -- Amount + Fee
  payer_name text not null,
  payer_phone text not null,
  payment_method text default 'MOMO',
  network text, -- MTN, VODAFONE, AIRTELTIGO
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  reference text unique not null,
  external_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.payments enable row level security;

-- Policies
-- Admins can view all payments
create policy "Admins can view all payments"
  on public.payments for select
  using ( auth.role() = 'authenticated' );

-- Public can insert (for payment initiation) - arguably dangerous without auth, 
-- but needed if payment page is public. Better to restrict if possible.
-- For now, assume anyone can initiate a payment.
create policy "Public can insert payments"
  on public.payments for insert
  with check ( true );

-- Only admins/service can update (via Edge Function usually uses service_role key which bypasses RLS)
-- So we don't strictly need an update policy for public.

-- Create logs table for payment events
create table if not exists public.payment_logs (
  id uuid default gen_random_uuid() primary key,
  payment_id uuid references public.payments(id) on delete cascade,
  event_type text not null, -- 'initiation', 'confirmation', 'split_transfer', 'failure'
  message text,
  payload jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payment_logs enable row level security;

create policy "Admins can view logs"
  on public.payment_logs for select
  using ( auth.role() = 'authenticated' );
