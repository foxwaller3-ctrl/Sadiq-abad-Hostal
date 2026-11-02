-- Sadiqabad Student Hostel — SQL 10 (Bed Occupancy & Resident Report Table)
-- Safe, idempotent migration for Supabase SQL Editor.
-- Stores per-bed resident allocations (who took the bed, when, and for how many days or months)
-- protected by admin-only Row Level Security.

begin;

create table if not exists public.bed_allocations (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  room_slug text not null default '',
  bed_number int not null check (bed_number >= 1),
  unit_label text not null default '',
  status text not null default 'occupied' check (status in ('occupied', 'vacant', 'reserved', 'maintenance')),
  resident_name text not null default '',
  resident_phone text not null default '',
  cnic_or_id text not null default '',
  resident_category text not null default 'student' check (resident_category in ('student', 'job_holder')),
  institution_or_workplace text not null default '',
  check_in_date date not null default current_date,
  duration_value int not null default 1 check (duration_value >= 1),
  duration_unit text not null default 'months' check (duration_unit in ('months', 'days')),
  check_out_date date not null default (current_date + interval '1 month')::date,
  agreed_rent int not null default 0 check (agreed_rent >= 0),
  security_deposit int not null default 0 check (security_deposit >= 0),
  payment_status text not null default 'paid' check (payment_status in ('paid', 'pending', 'partial')),
  notes text not null default '',
  updated_at timestamptz not null default now(),
  constraint bed_allocations_room_bed_unique unique (room_id, bed_number)
);

create index if not exists idx_bed_allocations_room_id on public.bed_allocations(room_id);
create index if not exists idx_bed_allocations_status on public.bed_allocations(status);

alter table public.bed_allocations enable row level security;

drop policy if exists admin_all_bed_allocations on public.bed_allocations;
create policy admin_all_bed_allocations
  on public.bed_allocations
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

revoke all on public.bed_allocations from anon;
grant select, insert, update, delete on public.bed_allocations to authenticated;

commit;
