# Supabase database setup — Sadiqabad Student Hostel

The scripts in this folder implement the backend described in 05_Backend_Schema.md and align the columns with src/types/index.ts.

## Run order

Create a new Supabase project first, then open **SQL Editor** and run each SQL file separately, in this order:

1. **01_extensions_helpers.sql** — updated_at trigger helper.
2. **02_tables.sql** — 13 tables and the admin-check helper.
3. **03_indexes_triggers.sql** — indexes and update triggers.
4. **04_rls.sql** — Row Level Security, access policies, and explicit Data API grants.
5. **05_storage.sql** — public hostel-media bucket; admin-only upload, replace and delete.
6. **06_seed.sql** — bilingual sample content.
7. **08_harden_admin_helper.sql** — hardens the admin predicate with invoker rights. The live project already has this applied; fresh installs should run it last.

**07_admin_bootstrap.md** is a manual setup guide, not SQL. Follow it after the SQL files, when you create the owner's Auth user.

Run on a fresh project, in order, only once. If a script fails part-way, inspect the database before retrying because several DDL statements are not designed to be re-run blindly.

## What's included

- Publicly readable hostel info, settings, published rooms/facilities/rules/FAQs/gallery/reviews, active mess plans, weekly menu, and notices within their date window.
- Anonymous visitor inquiry insertion only. Visitors cannot select inquiries and can only submit allowed visitor fields.
- profiles.role = admin authorization for admin CRUD and Storage writes.
- hostel-media bucket with 5 MB image limit.

## Sample-data warnings

The phone number, email, address, fees, menus, rules and notice are placeholders. Review them in the Admin panel before launch. No fake reviews and no placeholder gallery photos are seeded.

The source specification's sample rooms had beds_available greater than beds_total, which violates its own database check. The seed corrects these values to keep the migration valid.

## First admin

Create a user from **Supabase Dashboard → Authentication → Users** with public sign-ups disabled. Copy that user's UUID and follow the SQL snippet in 07_admin_bootstrap.md to insert their profile as admin. Never grant the admin role to untrusted accounts.

## Frontend configuration

Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in local .env and the deployment environment. .env.example contains placeholders only. Never expose a Supabase secret/service-role key to browser code or commit real credentials.

After connecting the existing services/* layer, test anonymous access and admin access separately. RLS is not a substitute for end-to-end tests.
