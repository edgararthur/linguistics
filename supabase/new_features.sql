-- 1. Dues Payments
create table if not exists dues_payments (
  id uuid default uuid_generate_v4() primary key,
  member_id uuid references members(id) not null,
  amount decimal(10,2) not null,
  currency text default 'GHS',
  payment_date date not null default CURRENT_DATE,
  payment_method text check (payment_method in ('Cash', 'Mobile Money', 'Bank Transfer', 'Cheque')),
  reference_number text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Event Registrations
create table if not exists event_registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) not null,
  member_id uuid references members(id) not null,
  registration_date timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'registered' check (status in ('registered', 'waitlisted', 'cancelled', 'attended')),
  payment_status text default 'pending' check (payment_status in ('paid', 'pending', 'refunded', 'na')),
  payment_reference text,
  unique(event_id, member_id)
);

-- 3. SMS Templates
create table if not exists sms_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  content text not null,
  category text check (category in ('dues', 'event', 'general')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SMS Logs
create table if not exists sms_logs (
  id uuid default uuid_generate_v4() primary key,
  recipient_phone text not null,
  message_body text not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'sent' check (status in ('sent', 'failed', 'queued')),
  trigger_type text, -- 'dues_reminder', 'event_alert', 'manual'
  triggered_by uuid references auth.users(id)
);

-- 5. Updates to Events
alter table events add column if not exists capacity integer;
alter table events add column if not exists price decimal(10,2) default 0;
alter table events add column if not exists is_paid boolean default false;

-- 6. Updates to Members
alter table members add column if not exists sms_opt_out boolean default false;

-- RLS Policies
alter table dues_payments enable row level security;
alter table event_registrations enable row level security;
alter table sms_templates enable row level security;
alter table sms_logs enable row level security;

-- Dues: Admin full access, Member read own
-- Note: We need to handle the case where members might not be linked to auth.users yet for some policies,
-- but generally we assume linkage for member portal features.

drop policy if exists "Admins can do everything on dues_payments" on dues_payments;
create policy "Admins can do everything on dues_payments" on dues_payments for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

drop policy if exists "Members can view own dues_payments" on dues_payments;
create policy "Members can view own dues_payments" on dues_payments for select using (
  auth.uid() in (select user_id from members where id = member_id)
);

-- Event Registrations: Admin full access, Member CRUD own
drop policy if exists "Admins can do everything on event_registrations" on event_registrations;
create policy "Admins can do everything on event_registrations" on event_registrations for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

drop policy if exists "Members can view own event_registrations" on event_registrations;
create policy "Members can view own event_registrations" on event_registrations for select using (
  auth.uid() in (select user_id from members where id = member_id)
);

drop policy if exists "Members can register themselves" on event_registrations;
create policy "Members can register themselves" on event_registrations for insert with check (
  auth.uid() in (select user_id from members where id = member_id)
);

drop policy if exists "Members can update own registrations" on event_registrations;
create policy "Members can update own registrations" on event_registrations for update using (
  auth.uid() in (select user_id from members where id = member_id)
);

-- SMS: Admin full access
drop policy if exists "Admins can do everything on sms_templates" on sms_templates;
create policy "Admins can do everything on sms_templates" on sms_templates for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

drop policy if exists "Admins can do everything on sms_logs" on sms_logs;
create policy "Admins can do everything on sms_logs" on sms_logs for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);
