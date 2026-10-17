# Supabase connection — Sadiqabad Student Hostel

The database is provisioned in Supabase project `Sadiqabad-Hostel` (`zyuteumppyrazhswtext`). The owner Auth user `foxwaller3@gmail.com` has a confirmed email and `profiles.role = 'admin'`.

## 1. Configure the React app environment

The app now has the project's URL and **publishable** browser key as safe defaults, so it connects to this database even if the build environment does not yet contain variables. You can override both variables in Google AI Studio or Cloudflare Pages. Never use a secret/service-role key in browser code.

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_WITH_PROJECT_KEY
```

For this project the URL is `https://zyuteumppyrazhswtext.supabase.co`. The bundled fallback is a publishable key only; it is meant to be visible in client code. RLS protects all database access. Keep any secret/service-role key private. `.env.example` contains optional override placeholders.

If you override variables, restart the AI Studio dev server/rebuild or trigger a fresh Cloudflare deployment. The admin login is always real Supabase Auth; it is never mocked.

## 2. Admin account

The verified Auth user `foxwaller3@gmail.com` already has an admin profile. Sign in at `/admin/login` with its Supabase password. If you do not know the password, choose **Forgot password?**. The app sends a recovery email to that address and provides `/admin/reset-password` to set a new password.

For password recovery on a hosted deployment, open Supabase Dashboard → Authentication → URL Configuration and add the final website origin to the allowed redirect URLs, including `/admin/reset-password`. Add the local test origin such as `http://localhost:3000/admin/reset-password` when using local Vite. The final Cloudflare hostname is not yet known, so it cannot be added from this repository change.

## 3. Public sign-ups

No sign-up UI or public profile INSERT policy exists. Only a user with a matching `profiles.role = 'admin'` row can enter the admin area. For defense in depth, turn off public sign-ups in Supabase Dashboard → Authentication → Providers → Email before launch.

## 4. Database and security

SQL and bootstrap instructions live in `sql/`. Do not run the SQL files again against the already-provisioned project. Existing scripts are for a fresh project, except files explicitly documented as a hardening migration.

RLS is enabled on all 13 public tables. Anonymous users can read public content, insert inquiries using visitor fields only, and cannot select inquiries or profiles. The `hostel-media` bucket is public-read with admin-only writes.

## 5. Before public launch

- Replace placeholder phone, WhatsApp, email, address, fees, weekly menu, hostel rules, facilities and admission notice with owner-approved information.
- Add real gallery photos. Reviews and gallery are intentionally empty of fabricated content.
- Verify production and local environment variables, owner login/password reset, all CRUD screens, inquiry submit/read isolation, and image upload/delete.
- Re-run security advisors after schema changes..
