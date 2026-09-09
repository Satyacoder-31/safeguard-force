// ============================================================================
// Database / CMS types — single source of truth for app-wide typing.
// Mirrors supabase/migrations schema. Row types match table columns exactly.
// ============================================================================

export type AdminRole = "super_admin" | "admin" | "editor";

export type EnquiryStatus =
  | "New"
  | "Contacted"
  | "In Progress"
  | "Converted"
  | "Closed"
  | "Spam";

export type EnquiryPriority = "Low" | "Medium" | "High" | "Urgent";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  site_name: string;
  brand_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  primary_phone: string;
  secondary_phone: string;
  email: string;
  whatsapp_number: string;
  whatsapp_message: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  google_maps_url: string;
  support_text: string;
  top_bar_text: string;
  footer_description: string;
  copyright_text: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  twitter_url: string;
  primary_color: string;
  secondary_color: string;
  dark_color: string;
  light_color: string;
  brochure_url?: string;
  brochure_title?: string;
  brochure_enabled?: boolean;
  updated_at: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  created_at: string;
  updated_at: string;
};

/** Navigation tree node: top-level item with optional children. */
export interface NavNode extends NavigationItem {
  children: NavigationItem[];
}

export type HomepageSectionItem = {
  title?: string;
  desc?: string;
  a?: string;
  b?: string;
  n?: string;
  t?: string;
  d?: string;
  [key: string]: unknown;
};

export type HomepageSection = {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  eyebrow: string;
  image_url: string;
  button_text: string;
  button_url: string;
  items: HomepageSectionItem[];
  is_visible: boolean;
  sort_order: number;
  background_type: "light" | "dark" | "accent" | "image";
  created_at: string;
  updated_at: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  highlighted_title: string;
  description: string;
  image_url: string;
  mobile_image_url: string;
  alt_text: string;
  button_text: string;
  button_url: string;
  phone_button_text: string;
  phone_number: string;
  sort_order: number;
  is_active: boolean;
  duration_ms: number;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  card_image_url: string;
  icon_name: string;
  meta_title: string;
  meta_description: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceItem = {
  id: string;
  service_id: string;
  title: string;
  description: string;
  image_url: string;
  icon_name: string;
  points: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Industry = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  icon_name: string;
  points: string[];
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AboutContent = {
  id: string;
  page_title: string;
  eyebrow: string;
  hero_subtitle: string;
  hero_image_url: string;
  who_we_are_heading: string;
  who_we_are_description: string;
  who_we_are_secondary: string;
  who_we_are_image_url: string;
  mission_title: string;
  mission_description: string;
  vision_title: string;
  vision_description: string;
  commitment_title: string;
  commitment_description: string;
  management_heading: string;
  management_description: string;
  management_checklist: string[];
  cta_text: string;
  cta_url: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ValueItem = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type ContactAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  pincode?: string;
};

export type ContactSettings = {
  id: string;
  contact_heading: string;
  contact_subtitle: string;
  form_heading: string;
  form_subtitle: string;
  hero_image_url?: string;
  map_image_url?: string;
  assistance_hours: string;
  assistance_note: string;
  phone_numbers: string[];
  whatsapp_number: string;
  whatsapp_message: string;
  email: string;
  address: ContactAddress;
  map_url: string;
  map_note: string;
  property_types: string[];
  cta_text: string;
  updated_at: string;
};

export type Enquiry = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  company_name: string | null;
  location: string | null;
  property_type: string | null;
  service_required: string;
  message: string | null;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  notes: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  company: string;
  role: string;
  testimonial: string;
  photo_url: string;
  rating: number;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

export type Statistic = {
  id: string;
  label: string;
  value: string;
  description: string;
  context: "hero_bar" | "trust" | "stats_band";
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type MediaItem = {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  alt_text: string;
  mime_type: string;
  file_size?: number | null;
  width: number | null;
  height: number | null;
  folder: string;
  uploaded_by: string | null;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  admin_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

/** Aggregated hero content consumed by the public hero slideshow. */
export type HeroContent = {
  eyebrow: string;
  slides: HeroSlide[];
  heroBarStats: Statistic[];
  fallbackText: string;
};

/* ========================================================================== */
/* Structural Supabase Database type                                          */
/* (hand-maintained to mirror the SQL migrations; Regenerate with             */
/*  `npx supabase gen types typescript` for full fidelity if desired)         */
/* ========================================================================== */

type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile>;
      site_settings: TableDef<SiteSettings>;
      navigation_items: TableDef<NavigationItem>;
      homepage_sections: TableDef<HomepageSection>;
      hero_slides: TableDef<HeroSlide>;
      services: TableDef<Service>;
      service_items: TableDef<ServiceItem>;
      industries: TableDef<Industry>;
      about_content: TableDef<AboutContent>;
      values: TableDef<ValueItem>;
      contact_settings: TableDef<ContactSettings>;
      enquiries: TableDef<Enquiry>;
      testimonials: TableDef<Testimonial>;
      statistics: TableDef<Statistic>;
      media_library: TableDef<MediaItem>;
      activity_logs: TableDef<ActivityLog>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      admin_role: AdminRole;
      enquiry_status: EnquiryStatus;
      enquiry_priority: EnquiryPriority;
    };
    CompositeTypes: Record<string, never>;
  };
};
