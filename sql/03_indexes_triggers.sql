-- Sadiqabad Student Hostel — SQL 03

create trigger trg_hostel_info_updated before update on public.hostel_info
for each row execute function public.set_updated_at();
create trigger trg_site_settings_updated before update on public.site_settings
for each row execute function public.set_updated_at();
create trigger trg_rooms_updated before update on public.rooms
for each row execute function public.set_updated_at();

create index idx_rooms_pub_sort on public.rooms (is_published, sort_order);
create index idx_facilities_pub_sort on public.facilities (is_published, sort_order);
create index idx_mess_plans_sort on public.mess_plans (is_active, sort_order);
create index idx_gallery_pub_cat on public.gallery_items (is_published, category, sort_order);
create index idx_rules_pub_sort on public.rules (is_published, sort_order);
create index idx_faqs_pub_sort on public.faqs (is_published, sort_order);
create index idx_reviews_visible on public.reviews (is_visible, created_at desc);
create index idx_notices_active_range on public.notices (is_active, starts_at, ends_at);
create index idx_inquiries_status_date on public.inquiries (status, created_at desc);
