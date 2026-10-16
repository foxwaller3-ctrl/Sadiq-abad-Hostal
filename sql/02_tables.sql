-- Sadiqabad Student Hostel — SQL 02

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create table public.hostel_info (
  id int primary key default 1 check (id = 1),
  name_en text not null, name_ur text not null default '',
  tagline_en text not null default '', tagline_ur text not null default '',
  about_en text not null default '', about_ur text not null default '',
  phone text not null default '', whatsapp text not null default '',
  email text not null default '', address_en text not null default '',
  address_ur text not null default '',
  map_embed_url text not null default '' check (map_embed_url = '' or map_embed_url like 'https://www.google.com/maps/embed%'),
  latitude numeric(9,6), longitude numeric(9,6),
  office_hours_en text not null default '', office_hours_ur text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  logo_url text not null default '' check (logo_url = '' or logo_url like 'https://%'),
  hostel_type text not null default 'boys' check (hostel_type in ('boys','girls','both')),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  seo_title_en text not null default '', seo_title_ur text not null default '',
  seo_description_en text not null default '', seo_description_ur text not null default '',
  default_language text not null default 'en' check (default_language in ('en','ur')),
  whatsapp_message_template_en text not null default '',
  whatsapp_message_template_ur text not null default '',
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null, name_ur text not null default '',
  room_type text not null check (room_type in ('single','double','triple','quad')),
  beds_total int not null check (beds_total > 0),
  beds_available int not null default 0,
  monthly_fee int not null check (monthly_fee >= 0),
  security_deposit int not null default 0 check (security_deposit >= 0),
  admission_fee int not null default 0 check (admission_fee >= 0),
  description_en text not null default '', description_ur text not null default '',
  features jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  image_urls text[] not null default '{}',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rooms_beds_valid check (beds_available >= 0 and beds_available <= beds_total)
);

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  title_en text not null, title_ur text not null default '',
  description_en text not null default '', description_ur text not null default '',
  icon_url text not null default '',
  is_published boolean not null default true, sort_order int not null default 0
);

create table public.mess_plans (
  id uuid primary key default gen_random_uuid(),
  name_en text not null, name_ur text not null default '',
  price_monthly int not null check (price_monthly >= 0),
  description_en text not null default '', description_ur text not null default '',
  is_active boolean not null default true, sort_order int not null default 0
);

create table public.mess_menu (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null unique check (day_of_week between 0 and 6),
  breakfast_en text not null default '', breakfast_ur text not null default '',
  lunch_en text not null default '', lunch_ur text not null default '',
  dinner_en text not null default '', dinner_ur text not null default ''
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('rooms','mess','bathrooms','study_area','building','surroundings')),
  image_url text not null check (image_url like 'https://%'),
  caption_en text not null default '', caption_ur text not null default '',
  is_published boolean not null default true, sort_order int not null default 0
);

create table public.rules (
  id uuid primary key default gen_random_uuid(),
  text_en text not null, text_ur text not null default '',
  is_published boolean not null default true, sort_order int not null default 0
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question_en text not null, question_ur text not null default '',
  answer_en text not null, answer_ur text not null default '',
  is_published boolean not null default true, sort_order int not null default 0
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  rating int not null check (rating between 1 and 5),
  comment_en text not null default '', comment_ur text not null default '',
  is_visible boolean not null default true, created_at timestamptz not null default now()
);

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  text_en text not null, text_ur text not null default '',
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  is_active boolean not null default true,
  constraint notices_range check (ends_at >= starts_at)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  phone text not null check (phone ~ '^(\+92|0)3[0-9]{2}[- ]?[0-9]{7}$'),
  room_type text check (room_type in ('single','double','triple','quad')),
  wants_mess boolean, move_in_date date,
  category text not null check (category in ('student','job','other')),
  message text check (message is null or char_length(message) <= 500),
  status text not null default 'new' check (status in ('new','contacted','booked','rejected')),
  admin_notes text,
  source_lang text not null default 'en' check (source_lang in ('en','ur')),
  created_at timestamptz not null default now()
);
