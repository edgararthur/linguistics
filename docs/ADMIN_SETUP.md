# Admin User Setup Guide

**IMPORTANT:** The `/register` page on the website is for *membership applications only* and does not create a user account for logging in. You must create the admin account manually using one of the methods below.

## Option A: Use the In-App Setup Page (Recommended)

I have created a special setup page to make this easy.

1. **Run the Setup Script First**:
   - Go to the **SQL Editor** in your Supabase Dashboard.
   - Open (or copy-paste) the contents of `supabase/fix_auth.sql`.
   - **Run** the script. (This sets up the permissions system).

2. **Create the Account**:
   - Navigate to `http://localhost:5173/admin/setup` in your browser.
   - Enter your desired password for `admin@laghana.org`.
   - Click **Create Admin Account**.

3. **Fix "Email not confirmed" Error**:
   - If you see an "Email not confirmed" error, **Run the `supabase/fix_auth.sql` script again**.
   - I have updated it to automatically confirm the email for the admin user.

4. **Log In**:
   - You will be redirected to `/admin/login`.
   - Log in with the password you just set.

## Option B: Create via Supabase Dashboard (Manual)

If you prefer to use the Supabase Dashboard directly:

1. **Create User**:
   - Go to **Authentication** > **Users**.
   - Click **Add User**.
   - Enter `admin@laghana.org` and your password.
   - Check **Auto Confirm User**.
   - Click **Create User**.

2. **Assign Admin Role**:
   - Go to the **SQL Editor**.
   - Run the `supabase/fix_auth.sql` script.
   - It will find your user, confirm their email (if needed), and update their role to 'admin'.

## Troubleshooting

- **"Email not confirmed"**: Run `supabase/fix_auth.sql` in the Supabase SQL Editor. It will manually confirm the admin email.
- **"Invalid login credentials"**: The user does not exist, or the password is wrong. Try creating the user again or resetting the password in Supabase Dashboard.
- **"User already registered"**: The account exists. If you forgot the password, delete the user in Supabase Dashboard > Authentication > Users, then recreate it.
- **Permissions Errors**: If you can log in but can't edit data, run the `supabase/fix_auth.sql` script again to ensure your profile has the 'admin' role.
