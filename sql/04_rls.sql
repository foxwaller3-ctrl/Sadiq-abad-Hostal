-- Sadiqabad Student Hostel — SQL 04
-- Explicit grants are included because new public-schema tables may not be
-- exposed to Supabase's Data API by default. RLS remains the row-level gate.

alter table public.profiles enable row level security;
alter table public.hostel_info enable row level security;
alter table public.site_settings enable row level security;
alter table public.rooms enable row level security;
alter table public.facilities enable row level security;
alter table public.mess_plans enable row level security;
alter table public.mess_menu enable row level security;
alter table public.gallery_items enable row level security;
alter table public.rules enable row level security;
alter table public.faqs enable row level security;
alter table public.reviews enable row level security;
alter table public.notices enable row level security;
alter table public.inquiries enable row level security;

create policy profiles_select_own on public.profiles
for select to authenticated using (id = (select auth.uid()));

create policy hostel_info_public_read on public.hostel_info
for select to anon, authenticated using (true);
create policy site_settings_public_read on public.site_settings
for select to anon, authenticated using (true);
create policy mess_menu_public_read on public.mess_menu
for select to anon, authenticated using (true);
create policy rooms_public_read on public.rooms
for select to anon, authenticated using (is_published);
create policy facilities_public_read on public.facilities
for select to anon, authenticated using (is_published);
create policy mess_plans_public_read on public.mess_plans
for select to anon, authenticated using (is_active);
create policy gallery_public_read on public.gallery_items
for select to anon, authenticated using (is_published);
create policy rules_public_read on public.rules
for select to anon, authenticated using (is_published);
create policy faqs_public_read on public.faqs
for select to anon, authenticated using (is_published);
create policy reviews_public_read on public.reviews
for select to anon, authenticated using (is_visible);
create policy notices_public_read on public.notices
for select to anon, authenticated
using (is_active and now() between starts_at and ends_at);

-- Column-level INSERT prevents visitors from setting status, IDs, notes, or timestamps.
create policy inquiries_public_insert on public.inquiries
for insert to anon, authenticated
with check (status = 'new' and admin_notes is null);

create policy admin_all_hostel_info on public.hostel_info for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_site_settings on public.site_settings for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_rooms on public.rooms for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_facilities on public.facilities for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_mess_plans on public.mess_plans for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_mess_menu on public.mess_menu for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_gallery on public.gallery_items for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_rules on public.rules for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_faqs on public.faqs for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_reviews on public.reviews for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_notices on public.notices for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_all_inquiries on public.inquiries for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

grant select on public.hostel_info, public.site_settings, public.rooms,
  public.facilities, public.mess_plans, public.mess_menu, public.gallery_items,
  public.rules, public.faqs, public.reviews, public.notices to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.hostel_info, public.site_settings,
  public.rooms, public.facilities, public.mess_plans, public.mess_menu,
  public.gallery_items, public.rules, public.faqs, public.reviews, public.notices
  to authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant insert (name, phone, room_type, wants_mess, move_in_date, category, message, source_lang)
  on public.inquiries to anon, authenticated;
grant insert, update, delete on public.inquiries to authenticated;
