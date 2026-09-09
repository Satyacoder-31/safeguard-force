import fs from "fs";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = "lyxqlmmzjzkcjzcnbusp";

async function query(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  const data = await res.json();
  if (res.status >= 400 || (Array.isArray(data) && data[0]?.error)) {
    console.error("SQL Error:", data);
    throw new Error(JSON.stringify(data));
  }
  return data;
}

async function run() {
  console.log("Applying schema to Supabase project:", projectRef);

  const schemaSql = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Ensure services table
    CREATE TABLE IF NOT EXISTS public.services (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      short_description text NOT NULL DEFAULT '',
      full_description text NOT NULL DEFAULT '',
      eyebrow text NOT NULL DEFAULT '',
      hero_title text NOT NULL DEFAULT '',
      hero_subtitle text NOT NULL DEFAULT '',
      hero_image_url text NOT NULL DEFAULT '',
      card_image_url text NOT NULL DEFAULT '',
      icon_name text NOT NULL DEFAULT 'shield',
      meta_title text NOT NULL DEFAULT '',
      meta_description text NOT NULL DEFAULT '',
      sort_order integer NOT NULL DEFAULT 0,
      is_featured boolean NOT NULL DEFAULT true,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Ensure service_items table
    CREATE TABLE IF NOT EXISTS public.service_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      image_url text NOT NULL DEFAULT '',
      icon_name text NOT NULL DEFAULT '',
      points text[] NOT NULL DEFAULT '{}',
      sort_order integer NOT NULL DEFAULT 0,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Ensure industries table
    CREATE TABLE IF NOT EXISTS public.industries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      short_description text NOT NULL DEFAULT '',
      description text NOT NULL DEFAULT '',
      image_url text NOT NULL DEFAULT '',
      icon_name text NOT NULL DEFAULT 'building',
      points text[] NOT NULL DEFAULT '{}',
      sort_order integer NOT NULL DEFAULT 0,
      is_featured boolean NOT NULL DEFAULT true,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Ensure about_content table
    CREATE TABLE IF NOT EXISTS public.about_content (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      page_title text NOT NULL DEFAULT '',
      eyebrow text NOT NULL DEFAULT '',
      hero_subtitle text NOT NULL DEFAULT '',
      hero_image_url text NOT NULL DEFAULT '',
      who_we_are_heading text NOT NULL DEFAULT '',
      who_we_are_description text NOT NULL DEFAULT '',
      who_we_are_secondary text NOT NULL DEFAULT '',
      who_we_are_image_url text NOT NULL DEFAULT '',
      mission_title text NOT NULL DEFAULT '',
      mission_description text NOT NULL DEFAULT '',
      vision_title text NOT NULL DEFAULT '',
      vision_description text NOT NULL DEFAULT '',
      commitment_title text NOT NULL DEFAULT '',
      commitment_description text NOT NULL DEFAULT '',
      management_heading text NOT NULL DEFAULT '',
      management_description text NOT NULL DEFAULT '',
      management_checklist text[] NOT NULL DEFAULT '{}',
      approach_image_url text NOT NULL DEFAULT '',
      cta_text text NOT NULL DEFAULT '',
      cta_url text NOT NULL DEFAULT '',
      meta_title text NOT NULL DEFAULT '',
      meta_description text NOT NULL DEFAULT '',
      is_published boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Ensure values table
    CREATE TABLE IF NOT EXISTS public.values (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      icon_name text NOT NULL DEFAULT 'shield',
      sort_order integer NOT NULL DEFAULT 0,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Ensure contact_settings table
    CREATE TABLE IF NOT EXISTS public.contact_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      contact_heading text NOT NULL DEFAULT '',
      contact_subtitle text NOT NULL DEFAULT '',
      form_heading text NOT NULL DEFAULT '',
      form_subtitle text NOT NULL DEFAULT '',
      hero_image_url text NOT NULL DEFAULT '',
      map_image_url text NOT NULL DEFAULT '',
      assistance_hours text NOT NULL DEFAULT '',
      assistance_note text NOT NULL DEFAULT '',
      phone_numbers text[] NOT NULL DEFAULT '{}',
      whatsapp_number text NOT NULL DEFAULT '',
      whatsapp_message text NOT NULL DEFAULT '',
      email text NOT NULL DEFAULT '',
      address jsonb NOT NULL DEFAULT '{}'::jsonb,
      map_url text NOT NULL DEFAULT '',
      map_note text NOT NULL DEFAULT '',
      property_types text[] NOT NULL DEFAULT '{}',
      cta_text text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Ensure statistics table
    CREATE TABLE IF NOT EXISTS public.statistics (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      value text NOT NULL,
      label text NOT NULL,
      description text NOT NULL DEFAULT '',
      context text NOT NULL DEFAULT 'stats_band' CHECK (context IN ('hero_bar','trust','stats_band')),
      sort_order integer NOT NULL DEFAULT 0,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Ensure media_library table
    CREATE TABLE IF NOT EXISTS public.media_library (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      file_name text NOT NULL,
      storage_path text NOT NULL,
      public_url text NOT NULL,
      mime_type text NOT NULL DEFAULT '',
      file_size integer,
      folder text NOT NULL DEFAULT 'general',
      alt_text text NOT NULL DEFAULT '',
      uploaded_by uuid,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Add missing columns to homepage_sections
    ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS eyebrow text NOT NULL DEFAULT '';
    ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';
    ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS button_text text NOT NULL DEFAULT '';
    ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS button_url text NOT NULL DEFAULT '';
    ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb;
    ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

    -- Add missing columns to hero_slides
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS highlighted_title text NOT NULL DEFAULT '';
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS mobile_image_url text NOT NULL DEFAULT '';
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS alt_text text NOT NULL DEFAULT '';
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS button_text text NOT NULL DEFAULT '';
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS button_url text NOT NULL DEFAULT '';
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS phone_button_text text NOT NULL DEFAULT '';
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS phone_number text NOT NULL DEFAULT '';
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS duration_ms integer NOT NULL DEFAULT 5000;
    ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

    -- Add brochure columns to site_settings
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_url text NOT NULL DEFAULT '';
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_title text NOT NULL DEFAULT 'Download Company Brochure';
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_enabled boolean NOT NULL DEFAULT true;

    -- Enable RLS on all tables
    ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.values ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

    -- Allow public reads on content tables
    DO $$
    DECLARE t text;
    BEGIN
      FOREACH t IN ARRAY ARRAY[
        'services','service_items','industries','about_content','values',
        'contact_settings','statistics','media_library'
      ] LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = t AND policyname = t || '_read_policy') THEN
          EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (true);', t || '_read_policy', t);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = t AND policyname = t || '_all_policy') THEN
          EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t || '_all_policy', t);
        END IF;
      END LOOP;
    END $$;
  `;

  await query(schemaSql);
  console.log("Tables, columns, and policies created successfully!");
}

run().catch(console.error);
