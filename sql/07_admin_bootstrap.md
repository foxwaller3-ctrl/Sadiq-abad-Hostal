# Supabase Admin Bootstrap — Sadiqabad Student Hostel

Run SQL files **01 through 06** in Supabase SQL Editor, in numeric order. This file is a guide, not a SQL script.

## 1. Create the owner account

1. Open **Authentication → Users → Add user** in the Supabase Dashboard.
2. Create the owner's email/password and confirm the account.
3. Disable public sign-ups in Authentication settings. Public registration is not part of this MVP.

## 2. Add the user's admin profile

1. In **Authentication → Users**, copy the new user's UUID.
2. In **SQL Editor**, run the following after replacing the placeholder with that UUID:

    insert into public.profiles (id, role)
    values ('<ADMIN_USER_UUID>'::uuid, 'admin')
    on conflict (id) do update set role = excluded.role;

Only create the intended owner's profile. The role constraint intentionally permits only admin in the MVP.

## 3. Configure the frontend

Set these variables in local .env and your deployment provider:

- VITE_SUPABASE_URL — the project's API URL.
- VITE_SUPABASE_PUBLISHABLE_KEY — the project's publishable key.

Never put a secret/service-role key in frontend variables or commit it to GitHub. The publishable key is intended for browser use with RLS enabled.

## 4. Before going live

- Replace placeholder phone/WhatsApp, email, address, fees, rules, menu and notice with owner-approved content.
- Add only genuine reviews with permission; 06_seed.sql does not insert sample reviews.
- Add real hostel images; the gallery intentionally starts empty.
- Test anonymous SELECT (published rows only) and INSERT to inquiries.
- Test that anonymous visitors cannot read inquiries or make admin changes.
- Test admin login, CRUD, media upload/replace/delete, and inquiry status/notes.
