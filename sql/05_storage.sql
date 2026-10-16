-- Sadiqabad Student Hostel — SQL 05

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hostel-media', 'hostel-media', true, 5242880,
        array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy media_public_read on storage.objects
for select to anon, authenticated using (bucket_id = 'hostel-media');
create policy media_admin_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'hostel-media' and (select public.is_admin()));
create policy media_admin_update on storage.objects
for update to authenticated
using (bucket_id = 'hostel-media' and (select public.is_admin()))
with check (bucket_id = 'hostel-media' and (select public.is_admin()));
create policy media_admin_delete on storage.objects
for delete to authenticated
using (bucket_id = 'hostel-media' and (select public.is_admin()));

-- Upsert needs SELECT + INSERT + UPDATE; these policies cover all three.
