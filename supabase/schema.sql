-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Linked to Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'member', -- 'admin', 'staff', 'member'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. MEMBERS
create table members (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Optional linkage
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  affiliation text,
  research_area text,
  membership_type text check (membership_type in ('Student', 'Professional', 'Institutional')),
  status text default 'pending' check (status in ('active', 'pending', 'expired')),
  dues_paid_until date,
  image_url text,
  profile_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PUBLICATIONS
create table publications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  authors text not null,
  abstract text,
  category text,
  publication_date date,
  file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. EVENTS
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  location text,
  registration_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. LEADERSHIP
create table leadership (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null,
  bio text,
  image_url text,
  term_start date,
  term_end date,
  is_current boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. NEWS
create table news (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)

-- Enable RLS
alter table profiles enable row level security;
alter table members enable row level security;
alter table publications enable row level security;
alter table events enable row level security;
alter table leadership enable row level security;
alter table news enable row level security;

-- POLICIES

-- Public Read Access
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Public members directory is viewable by everyone" on members for select using (status = 'active');
create policy "Publications are viewable by everyone" on publications for select using (true);
create policy "Events are viewable by everyone" on events for select using (true);
create policy "Leadership is viewable by everyone" on leadership for select using (true);
create policy "News is viewable by everyone" on news for select using (true);

-- Admin Full Access (assuming role='admin' in profiles)
-- Note: This requires a trigger to sync auth.users to public.profiles or manual insertion.
-- For simplicity in this script, we'll allow authenticated users with specific email domain or metadata to act as admin, 
-- or simply allow all authenticated users to EDIT for now (Demo Mode), 
-- BUT strictly we should check `auth.uid() in (select id from profiles where role = 'admin')`.

create policy "Admins can do everything on members" on members for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

create policy "Admins can do everything on publications" on publications for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

create policy "Admins can do everything on events" on events for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

create policy "Admins can do everything on leadership" on leadership for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

create policy "Admins can do everything on news" on news for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- STORAGE BUCKETS
-- You will need to create storage buckets: 'avatars', 'documents', 'images'
-- insert into storage.buckets (id, name) values ('documents', 'documents');
-- insert into storage.buckets (id, name) values ('images', 'images');
