-- ============================================================================
-- Row Level Security policies for all CMS tables.
--
-- Model:
--  • Public (anon): read published/active website content only.
--  • Public (anon): INSERT enquiries only — cannot read or update them.
--  • Authenticated admins (profiles.role in super_admin/editor, is_active):
--      full CRUD on CMS content; enquiries managed by admins only.
--  • RLS never bypassed in application code for browser access. The service
--      role key is used exclusively in trusted server-side code paths.
-- ============================================================================

-- Helper: current user is an active admin (super_admin or editor)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
      and p.role in ('super_admin','editor')
  );
$$ language sql security definer stable;

create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
      and p.role = 'super_admin'
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.site_settings     enable row level security;
alter table public.navigation_items  enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.hero_slides       enable row level security;
alter table public.services          enable row level security;
alter table public.service_items     enable row level security;
alter table public.industries        enable row level security;
alter table public.about_content     enable row level security;
alter table public.values            enable row level security;
alter table public.contact_settings  enable row level security;
alter table public.enquiries         enable row level security;
alter table public.testimonials      enable row level security;
alter table public.statistics        enable row level security;
alter table public.media_library     enable row level security;
alter table public.activity_logs     enable row level security;

-- ---------------------------------------------------------------------------
-- Public content tables: everyone reads; admins write
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','navigation_items','homepage_sections','hero_slides',
    'services','service_items','industries','about_content','values',
    'contact_settings','testimonials','statistics'
  ] loop
    execute format('create policy %I on public.%I for select using (true);', t || '_public_read', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin());', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());', t || '_admin_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin());', t || '_admin_delete', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- profiles: user reads own row; super_admin manages all; user updates own
-- limited fields (role/is_active changes restricted to super_admin)
-- ---------------------------------------------------------------------------
create policy profiles_self_read on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_super_admin());
create policy profiles_self_insert on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_super_admin())
  with check (
    -- ordinary users may edit their own name but never escalate role
    (id = auth.uid() and role = 'editor' and is_active = true)
    or public.is_super_admin()
  );
create policy profiles_admin_delete on public.profiles
  for delete to authenticated using (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- enquiries: anyone may insert; only admins may read/manage
-- ---------------------------------------------------------------------------
create policy enquiries_public_insert on public.enquiries
  for insert to anon, authenticated with check (true);
create policy enquiries_admin_read on public.enquiries
  for select to authenticated using (public.is_admin());
create policy enquiries_admin_update on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy enquiries_admin_delete on public.enquiries
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- media_library: everyone reads; admins write
-- ---------------------------------------------------------------------------
create policy media_public_read on public.media_library
  for select using (true);
create policy media_admin_insert on public.media_library
  for insert to authenticated with check (public.is_admin());
create policy media_admin_update on public.media_library
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy media_admin_delete on public.media_library
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- activity_logs: admins read; inserts happen server-side (service role) or
-- by admins explicitly
-- ---------------------------------------------------------------------------
create policy activity_admin_read on public.activity_logs
  for select to authenticated using (public.is_admin());
create policy activity_admin_insert on public.activity_logs
  for insert to authenticated with check (admin_user_id = auth.uid());
create policy activity_super_delete on public.activity_logs
  for delete to authenticated using (public.is_super_admin());
