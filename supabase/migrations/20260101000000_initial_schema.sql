-- ============================================================================
-- SAFE Guard FORCE CMS — Initial schema
-- Tables for site settings, navigation, homepage, hero slides, services,
-- service items, industries, about content, values, contact settings,
-- enquiries, testimonials, statistics, media library, profiles, activity logs.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (admin role system, linked to auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'editor' check (role in ('super_admin','editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'SAFE Guard FORCE',
  brand_name text not null default 'Your Security. Our Priority.',
  tagline text not null default 'Your Security. Our Priority.',
  logo_url text not null default '/images/safelogo.png',
  favicon_url text not null default '/images/safelogo.png',
  primary_phone text not null default '',
  secondary_phone text not null default '',
  email text not null default '',
  whatsapp_number text not null default '',
  whatsapp_message text not null default 'Hello SAFE Guard FORCE, I would like to discuss your security/facility management services.',
  address_line_1 text not null default '',
  address_line_2 text not null default '',
  city text not null default '',
  state text not null default '',
  pincode text not null default '',
  country text not null default 'India',
  google_maps_url text not null default '',
  support_text text not null default '24/7 Professional Assistance',
  top_bar_text text not null default 'Mumbai • Nationwide Service Capability',
  footer_description text not null default '',
  copyright_text text not null default '',
  facebook_url text not null default '',
  instagram_url text not null default '',
  linkedin_url text not null default '',
  youtube_url text not null default '',
  twitter_url text not null default '',
  primary_color text not null default '#0A1931',
  secondary_color text not null default '#C5A253',
  dark_color text not null default '#070F1F',
  light_color text not null default '#F8FAFC',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Navigation items (self-referencing tree for dropdowns)
-- ---------------------------------------------------------------------------
create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  parent_id uuid references public.navigation_items(id) on delete cascade,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  open_in_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_navigation_items_parent on public.navigation_items(parent_id);
create index idx_navigation_items_active_order on public.navigation_items(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Homepage sections (visibility + copy per section)
-- ---------------------------------------------------------------------------
create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null default '',
  subtitle text not null default '',
  description text not null default '',
  eyebrow text not null default '',
  image_url text not null default '',
  button_text text not null default '',
  button_url text not null default '',
  items jsonb not null default '[]'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  background_type text not null default 'light' check (background_type in ('light','dark','accent','image')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_homepage_sections_order on public.homepage_sections(is_visible, sort_order);

-- ---------------------------------------------------------------------------
-- Hero slides
-- ---------------------------------------------------------------------------
create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  highlighted_title text not null default '',
  description text not null default '',
  image_url text not null default '',
  mobile_image_url text not null default '',
  alt_text text not null default '',
  button_text text not null default '',
  button_url text not null default '',
  phone_button_text text not null default '',
  phone_number text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  duration_ms integer not null default 5000 check (duration_ms between 1500 and 30000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_hero_slides_active_order on public.hero_slides(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  full_description text not null default '',
  eyebrow text not null default '',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  hero_image_url text not null default '',
  card_image_url text not null default '',
  icon_name text not null default 'shield',
  meta_title text not null default '',
  meta_description text not null default '',
  sort_order integer not null default 0,
  is_featured boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_services_slug on public.services(slug);
create index idx_services_active_order on public.services(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Service items (feature cards inside a service page)
-- ---------------------------------------------------------------------------
create table public.service_items (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  title text not null,
  description text not null default '',
  image_url text not null default '',
  icon_name text not null default '',
  points jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_service_items_service on public.service_items(service_id);
create index idx_service_items_active_order on public.service_items(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Industries
-- ---------------------------------------------------------------------------
create table public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  image_url text not null default '',
  icon_name text not null default 'building',
  points jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_featured boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_industries_slug on public.industries(slug);
create index idx_industries_active_order on public.industries(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- About content (single row structured page content)
-- ---------------------------------------------------------------------------
create table public.about_content (
  id uuid primary key default gen_random_uuid(),
  page_title text not null default '',
  eyebrow text not null default '',
  hero_subtitle text not null default '',
  hero_image_url text not null default '',
  who_we_are_heading text not null default '',
  who_we_are_description text not null default '',
  who_we_are_secondary text not null default '',
  who_we_are_image_url text not null default '',
  mission_title text not null default '',
  mission_description text not null default '',
  vision_title text not null default '',
  vision_description text not null default '',
  commitment_title text not null default '',
  commitment_description text not null default '',
  management_heading text not null default '',
  management_description text not null default '',
  management_checklist jsonb not null default '[]'::jsonb,
  cta_text text not null default '',
  cta_url text not null default '/contact',
  meta_title text not null default '',
  meta_description text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Values (core values grid on About page)
-- ---------------------------------------------------------------------------
create table public.values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon_name text not null default 'shield',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_values_active_order on public.values(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Contact settings (single row)
-- ---------------------------------------------------------------------------
create table public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  contact_heading text not null default '',
  contact_subtitle text not null default '',
  form_heading text not null default '',
  form_subtitle text not null default '',
  assistance_hours text not null default '24/7 Professional Assistance',
  assistance_note text not null default '',
  phone_numbers jsonb not null default '[]'::jsonb,
  whatsapp_number text not null default '',
  whatsapp_message text not null default '',
  email text not null default '',
  address jsonb not null default '{}'::jsonb,
  map_url text not null default '',
  map_note text not null default '',
  property_types jsonb not null default '[]'::jsonb,
  cta_text text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Enquiries (public insert-only; admin managed)
-- ---------------------------------------------------------------------------
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  company_name text,
  location text,
  property_type text,
  service_required text not null,
  message text,
  status text not null default 'New' check (status in ('New','Contacted','In Progress','Converted','Closed','Spam')),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High','Urgent')),
  notes text not null default '',
  assigned_to text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_enquiries_status on public.enquiries(status);
create index idx_enquiries_created on public.enquiries(created_at desc);
create index idx_enquiries_service on public.enquiries(service_required);

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text not null default '',
  role text not null default '',
  testimonial text not null,
  photo_url text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  sort_order integer not null default 0,
  is_featured boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_testimonials_active_order on public.testimonials(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Statistics
-- ---------------------------------------------------------------------------
create table public.statistics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  description text not null default '',
  context text not null default 'stats_band',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_statistics_active_order on public.statistics(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Media library (public URLs point to Supabase Storage)
-- ---------------------------------------------------------------------------
create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null,
  public_url text not null,
  alt_text text not null default '',
  mime_type text not null default '',
  width integer,
  height integer,
  folder text not null default 'general',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_media_folder on public.media_library(folder);
create index idx_media_created on public.media_library(created_at desc);

-- ---------------------------------------------------------------------------
-- Activity logs (audit trail; admin-readable only)
-- ---------------------------------------------------------------------------
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null default '',
  entity_id text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_activity_created on public.activity_logs(created_at desc);
create index idx_activity_admin on public.activity_logs(admin_user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();
create trigger trg_navigation_items_updated before update on public.navigation_items
  for each row execute function public.set_updated_at();
create trigger trg_homepage_sections_updated before update on public.homepage_sections
  for each row execute function public.set_updated_at();
create trigger trg_hero_slides_updated before update on public.hero_slides
  for each row execute function public.set_updated_at();
create trigger trg_services_updated before update on public.services
  for each row execute function public.set_updated_at();
create trigger trg_service_items_updated before update on public.service_items
  for each row execute function public.set_updated_at();
create trigger trg_industries_updated before update on public.industries
  for each row execute function public.set_updated_at();
create trigger trg_about_content_updated before update on public.about_content
  for each row execute function public.set_updated_at();
create trigger trg_contact_settings_updated before update on public.contact_settings
  for each row execute function public.set_updated_at();
create trigger trg_enquiries_updated before update on public.enquiries
  for each row execute function public.set_updated_at();
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
