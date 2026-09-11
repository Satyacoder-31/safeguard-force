import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AboutContent,
  ContactSettings,
  HeroSlide,
  HomepageSection,
  Industry,
  NavNode,
  NavigationItem,
  Service,
  ServiceItem,
  SiteSettings,
  Statistic,
  Testimonial,
  ValueItem,
} from "@/types/database";

/**
 * Public CMS data layer.
 *
 * All functions are wrapped in unstable_cache (tagged) so pages render fast
 * and revalidate automatically when admin edits content. Every function
 * degrades gracefully to rich default data if Supabase is unreachable/empty —
 * the public site never crashes or goes blank.
 */

const TAGS = {
  settings: "cms:settings",
  nav: "cms:navigation",
  sections: "cms:homepage",
  hero: "cms:hero",
  services: "cms:services",
  industries: "cms:industries",
  about: "cms:about",
  contact: "cms:contact",
  testimonials: "cms:testimonials",
  stats: "cms:stats",
} as const;

export const CMS_TAGS = TAGS;

/** Revalidate every CMS tag — used after admin mutations. */
export async function revalidateAllCms() {
  try {
    const { revalidateTag } = await import("next/cache");
    Object.values(TAGS).forEach((tag) => {
      try {
        (revalidateTag as unknown as (t: string) => void)(tag);
      } catch (err) {
        console.warn(`[cms] revalidateTag failed for ${tag}:`, err);
      }
    });
  } catch (e) {
    console.warn("[cms] revalidateAllCms failed:", e);
  }
}

function admin() {
  return createAdminClient();
}

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  id: "fallback",
  site_name: "SAFE Guard FORCE",
  brand_name: "Your Security. Our Priority.",
  tagline: "Your Security. Our Priority.",
  logo_url: "/images/safelogo.png",
  favicon_url: "/images/safelogo.png",
  primary_phone: "7977179807",
  secondary_phone: "9136645289",
  email: "safeguardforce02@gmail.com",
  whatsapp_number: "917977179807",
  whatsapp_message:
    "Hello SAFE Guard FORCE, I would like to discuss your security/facility management services.",
  address_line_1: "C 517, Kailash Esplanade",
  address_line_2: "Opp. Shreyash Cinema, LBS Marg",
  city: "Ghatkopar West, Mumbai",
  state: "Maharashtra",
  pincode: "400086",
  country: "India",
  google_maps_url:
    "https://maps.google.com/?q=C+517+Kailash+Esplanade+Ghatkopar+West+Mumbai",
  support_text: "24/7 Professional Assistance",
  top_bar_text: "Pan-India • Integrated Facility & Security Solutions",
  footer_description:
    "Integrated security, facility management, technical and investigation solutions. Professional, disciplined and reliable services for safer, cleaner and efficiently managed premises.",
  copyright_text: "SAFE Guard FORCE. All Rights Reserved.",
  facebook_url: "",
  instagram_url: "https://www.instagram.com/safeguardforce",
  linkedin_url: "https://www.linkedin.com/company/safeguardforce",
  youtube_url: "",
  twitter_url: "",
  primary_color: "#0A1931",
  secondary_color: "#C5A253",
  dark_color: "#070F1F",
  light_color: "#F8FAFC",
  brochure_url: "/brochure.pdf",
  brochure_title: "SAFE Guard FORCE Corporate Brochure",
  brochure_enabled: true,
  updated_at: "",
};

export const getSiteSettings = async (): Promise<SiteSettings> =>
  unstable_cache(
    async () => {
      try {
        const [{ data }, { data: anyRow }, { data: brochureSec }] = await Promise.all([
          admin().from("site_settings").select("*").ilike("site_name", "%SAFE%").limit(1),
          admin().from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1),
          admin().from("homepage_sections").select("*").eq("section_key", "brochure").limit(1),
        ]);

        const base = (data?.[0] || anyRow?.[0] || FALLBACK_SITE_SETTINGS) as SiteSettings;
        const brochureData: Partial<SiteSettings> = {};

        if (brochureSec?.[0]) {
          const sec = brochureSec[0];
          brochureData.brochure_url = sec.button_url || sec.image_url || base.brochure_url || "/brochure.pdf";
          brochureData.brochure_title = sec.button_text || sec.title || base.brochure_title || "SAFE Guard FORCE Corporate Brochure";
          brochureData.brochure_enabled = sec.is_visible ?? true;
        }

        return { ...base, ...brochureData };
      } catch {
        return FALLBACK_SITE_SETTINGS;
      }
    },
    ["cms-site-settings"],
    { tags: [TAGS.settings], revalidate: 300 },
  )();

export type BrochurePageSettings = {
  eyebrow: string;
  title: string;
  subtitle: string;
  hero_image: string;
  action_bar_text: string;
  download_button_text: string;
  open_button_text: string;
  footer_card_title: string;
  footer_card_subtitle: string;
  pdf_url: string;
};

export const FALLBACK_BROCHURE_PAGE_SETTINGS: BrochurePageSettings = {
  eyebrow: "Official Corporate Profile",
  title: "SAFE GUARD FORCE Corporate Brochure",
  subtitle: "Explore our official corporate brochure containing operational capabilities, leadership foreword, statutory compliance, and service portfolio.",
  hero_image: "/images/hero-mumbai-security.png",
  action_bar_text: "Official Corporate Profile • PASARA License No. 293 • Govt. of Maharashtra",
  download_button_text: "Download PDF Brochure",
  open_button_text: "Open PDF in New Tab",
  footer_card_title: "SAFE GUARD FORCE Corporate Profile",
  footer_card_subtitle: "View the complete brochure above or download the official PDF file directly to your device.",
  pdf_url: "/brochure.pdf",
};

export async function getBrochurePageSettings(): Promise<BrochurePageSettings> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("homepage_sections")
          .select("*")
          .eq("section_key", "brochure_page")
          .limit(1);

        const sec = data?.[0];
        if (!sec) return FALLBACK_BROCHURE_PAGE_SETTINGS;
        const itemsObj = (sec?.items?.[0] || {}) as Record<string, string>;

        return {
          eyebrow: sec?.eyebrow || FALLBACK_BROCHURE_PAGE_SETTINGS.eyebrow,
          title: sec?.title || FALLBACK_BROCHURE_PAGE_SETTINGS.title,
          subtitle: sec?.subtitle || FALLBACK_BROCHURE_PAGE_SETTINGS.subtitle,
          hero_image: sec?.image_url || FALLBACK_BROCHURE_PAGE_SETTINGS.hero_image,
          action_bar_text: itemsObj.action_bar_text || FALLBACK_BROCHURE_PAGE_SETTINGS.action_bar_text,
          download_button_text: sec?.button_text || FALLBACK_BROCHURE_PAGE_SETTINGS.download_button_text,
          open_button_text: itemsObj.open_button_text || FALLBACK_BROCHURE_PAGE_SETTINGS.open_button_text,
          footer_card_title: itemsObj.footer_card_title || FALLBACK_BROCHURE_PAGE_SETTINGS.footer_card_title,
          footer_card_subtitle: sec?.description || itemsObj.footer_card_subtitle || FALLBACK_BROCHURE_PAGE_SETTINGS.footer_card_subtitle,
          pdf_url: sec?.button_url || FALLBACK_BROCHURE_PAGE_SETTINGS.pdf_url,
        };
      } catch {
        return FALLBACK_BROCHURE_PAGE_SETTINGS;
      }
    },
    ["cms-brochure-page-settings"],
    { tags: [TAGS.settings, TAGS.sections], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export async function getNavigation(): Promise<NavNode[]> {
  return unstable_cache(
    async () => {
      try {
        const { data, error } = await admin()
          .from("navigation_items")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        if (error || !data || data.length === 0) return buildFallbackNav();
        return buildNavTree(data as NavigationItem[]);
      } catch {
        return buildFallbackNav();
      }
    },
    ["cms-navigation"],
    { tags: [TAGS.nav], revalidate: 300 },
  )();
}

function buildNavTree(items: NavigationItem[]): NavNode[] {
  const tops = items.filter((i) => !i.parent_id);
  return tops.map((t) => ({
    ...t,
    children: items.filter((i) => i.parent_id === t.id),
  }));
}

function buildFallbackNav(): NavNode[] {
  const mk = (id: string, label: string, href: string, children: NavigationItem[] = []): NavNode => ({
    id,
    label,
    href,
    parent_id: null,
    sort_order: 0,
    is_active: true,
    open_in_new_tab: false,
    created_at: "",
    updated_at: "",
    children,
  });
  const svc = (
    id: string,
    label: string,
    href: string,
  ): NavigationItem => ({
    id,
    label,
    href,
    parent_id: "services",
    sort_order: 0,
    is_active: true,
    open_in_new_tab: false,
    created_at: "",
    updated_at: "",
  });
  return [
    mk("home", "Home", "/"),
    mk("about", "About", "/about"),
    mk("services", "Services", "/security-services", [
      svc("svc-1", "Security Services", "/security-services"),
      svc("svc-2", "Facility Management", "/facility-management"),
      svc("svc-3", "Housekeeping & Gardening", "/housekeeping"),
      svc("svc-4", "Fire, Safety & Dog Squad", "/fire-safety"),
      svc("svc-5", "Technical & STP Operations", "/technical-maintenance"),
      svc("svc-6", "Detective & Investigation", "/detective-services"),
    ]),
    mk("industries", "Industries", "/industries"),
    mk("investigations", "Investigations", "/detective-services"),
    mk("contact", "Contact", "/contact"),
  ];
}

/* -------------------------------------------------------------------------- */
/* Hero slides                                                                */
/* -------------------------------------------------------------------------- */

export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "SECURITY",
    highlighted_title: "THAT PROTECTS.",
    description: "Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.",
    image_url: "/images/hero-mumbai-security.png",
    mobile_image_url: "/images/hero-mumbai-security.png",
    alt_text: "SAFE Guard FORCE trained security personnel",
    button_text: "Get a Free Consultation",
    button_url: "/contact",
    phone_button_text: "Call 7977179807",
    phone_number: "7977179807",
    sort_order: 0,
    is_active: true,
    duration_ms: 5000,
    created_at: "",
    updated_at: "",
  },
  {
    id: "slide-2",
    title: "SERVICES",
    highlighted_title: "THAT PERFORM.",
    description: "Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.",
    image_url: "/images/mumbai-business-district.png",
    mobile_image_url: "/images/mumbai-business-district.png",
    alt_text: "Premium corporate building entrance with security",
    button_text: "Get a Free Consultation",
    button_url: "/contact",
    phone_button_text: "Call 7977179807",
    phone_number: "7977179807",
    sort_order: 1,
    is_active: true,
    duration_ms: 5000,
    created_at: "",
    updated_at: "",
  },
  {
    id: "slide-3",
    title: "SECURITY",
    highlighted_title: "THAT PROTECTS.",
    description: "Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.",
    image_url: "/images/team-inspection.png",
    mobile_image_url: "/images/team-inspection.png",
    alt_text: "Security personnel monitoring CCTV",
    button_text: "Get a Free Consultation",
    button_url: "/contact",
    phone_button_text: "Call 7977179807",
    phone_number: "7977179807",
    sort_order: 2,
    is_active: true,
    duration_ms: 5000,
    created_at: "",
    updated_at: "",
  },
  {
    id: "slide-4",
    title: "SERVICES",
    highlighted_title: "THAT PERFORM.",
    description: "Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.",
    image_url: "/images/housekeeping-landscaping.png",
    mobile_image_url: "/images/housekeeping-landscaping.png",
    alt_text: "Professional housekeeping team",
    button_text: "Get a Free Consultation",
    button_url: "/contact",
    phone_button_text: "Call 7977179807",
    phone_number: "7977179807",
    sort_order: 3,
    is_active: true,
    duration_ms: 5000,
    created_at: "",
    updated_at: "",
  },
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("hero_slides")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        return data && data.length > 0 ? (data as HeroSlide[]) : FALLBACK_HERO_SLIDES;
      } catch {
        return FALLBACK_HERO_SLIDES;
      }
    },
    ["cms-hero-slides"],
    { tags: [TAGS.hero], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* Homepage sections                                                          */
/* -------------------------------------------------------------------------- */

export const FALLBACK_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: "sec-trust",
    section_key: "trust_intro",
    eyebrow: "Trusted Integrated Partner",
    title: "A Safer, Smarter\n& Better Managed\nTomorrow.",
    subtitle: "SAFE Guard FORCE combines security, facility management, housekeeping, technical services, STP operations and investigation capabilities under one professional organization — delivering disciplined execution, accountable supervision and customized solutions for every premises.",
    description: "From residential societies and corporate towers to hospitals, hotels, factories and large events — we protect people, manage properties, maintain operations and ensure cleaner, healthier environments.",
    image_url: "/images/hero-mumbai-security.png",
    button_text: "Discover Our Approach",
    button_url: "/about",
    items: [
      { a: "24/7", b: "Support" },
      { a: "Pan-India", b: "Presence" },
      { a: "One-Roof", b: "Solutions" },
    ],
    is_visible: true,
    sort_order: 10,
    background_type: "light",
    created_at: "",
    updated_at: "",
  },
  {
    id: "sec-services",
    section_key: "services",
    eyebrow: "12 Integrated Capabilities",
    title: "Core Services",
    subtitle: "One accountable partner for security, facility, hygiene, technical and investigation needs — customized to your environment.",
    description: "",
    image_url: "",
    button_text: "View All Services",
    button_url: "/security-services",
    items: [],
    is_visible: true,
    sort_order: 20,
    background_type: "light",
    created_at: "",
    updated_at: "",
  },
  {
    id: "sec-why",
    section_key: "why_choose_us",
    eyebrow: "WHY CHOOSE US",
    title: "Why Organizations Trust SAFE Guard FORCE",
    subtitle: "",
    description: "Structured supervision, verified manpower and continuous improvement — the reasons organizations rely on SAFE Guard FORCE.",
    image_url: "",
    button_text: "",
    button_url: "",
    items: [],
    is_visible: true,
    sort_order: 30,
    background_type: "dark",
    created_at: "",
    updated_at: "",
  },
  {
    id: "sec-process",
    section_key: "process",
    eyebrow: "Our Process",
    title: "How We Work",
    subtitle: "Disciplined, transparent and operationally accountable — from assessment to continuous improvement.",
    description: "",
    image_url: "",
    button_text: "",
    button_url: "",
    items: [
      { n: "01", t: "Understand", d: "Understand property, risks and operational requirements." },
      { n: "02", t: "Assess", d: "Conduct site assessment and identify service requirements." },
      { n: "03", t: "Plan", d: "Develop customized manpower and operational plan." },
      { n: "04", t: "Deploy", d: "Deploy trained personnel, supervisors and technical teams." },
      { n: "05", t: "Monitor", d: "Inspections, reporting, quality checks and continuous improvement." },
    ],
    is_visible: true,
    sort_order: 40,
    background_type: "light",
    created_at: "",
    updated_at: "",
  },
  {
    id: "sec-industries",
    section_key: "industries",
    eyebrow: "Where We Serve",
    title: "Industries We Serve",
    subtitle: "",
    description: "",
    image_url: "",
    button_text: "Explore All Industries →",
    button_url: "/industries",
    items: [],
    is_visible: true,
    sort_order: 50,
    background_type: "light",
    created_at: "",
    updated_at: "",
  },
  {
    id: "sec-personnel",
    section_key: "personnel",
    eyebrow: "Our Personnel",
    title: "Disciplined Personnel.\nProfessional Appearance.",
    subtitle: "Every SAFE Guard FORCE guard is screened, trained and kitted for the premises they protect — from ceremonial bearing to operational vigilance. White gloves, beret with insignia, SAFE-branded belt and disciplined posture reflect the standards we enforce daily.",
    description: "",
    image_url: "/images/hero-mumbai-security.png",
    button_text: "View Security Services",
    button_url: "/security-services",
    items: [
      { title: "Uniform discipline & grooming checks" },
      { title: "Verified antecedents & supervised deployment" },
      { title: "Ceremonial and operational readiness" },
      { title: "Client-facing courtesy with firm access control" },
    ],
    is_visible: true,
    sort_order: 60,
    background_type: "light",
    created_at: "",
    updated_at: "",
  },
  {
    id: "sec-stats-band",
    section_key: "stats_band",
    eyebrow: "",
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    button_text: "",
    button_url: "",
    items: [],
    is_visible: true,
    sort_order: 70,
    background_type: "dark",
    created_at: "",
    updated_at: "",
  },
  {
    id: "sec-final-cta",
    section_key: "final_cta",
    eyebrow: "",
    title: "Your Property Deserves\nMore Than Basic Security.",
    subtitle: "Partner with SAFE Guard FORCE for professional security, facility management, technical maintenance, STP operations and confidential investigation solutions.",
    description: "",
    image_url: "/images/mumbai-business-district.png",
    button_text: "Request a Consultation →",
    button_url: "/contact",
    items: [],
    is_visible: true,
    sort_order: 80,
    background_type: "image",
    created_at: "",
    updated_at: "",
  },
];

export async function getHomepageSections(): Promise<HomepageSection[]> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("homepage_sections")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true });
        return data && data.length > 0 ? (data as HomepageSection[]) : FALLBACK_HOMEPAGE_SECTIONS;
      } catch {
        return FALLBACK_HOMEPAGE_SECTIONS;
      }
    },
    ["cms-homepage-sections"],
    { tags: [TAGS.sections], revalidate: 300 },
  )();
}

export async function getHomepageSection(
  key: string,
): Promise<HomepageSection | undefined> {
  const sections = await getHomepageSections();
  return sections.find((s) => s.section_key === key);
}

/* -------------------------------------------------------------------------- */
/* Statistics                                                                 */
/* -------------------------------------------------------------------------- */

export const FALLBACK_STATISTICS: Statistic[] = [
  { id: "s-1", label: "Professional Assistance", value: "24/7", description: "", context: "hero_bar", sort_order: 0, is_active: true, created_at: "", updated_at: "" },
  { id: "s-2", label: "Verified Personnel", value: "Trained", description: "", context: "hero_bar", sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "s-3", label: "Service Solutions", value: "Integrated", description: "", context: "hero_bar", sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "s-4", label: "Management System", value: "Professional", description: "", context: "hero_bar", sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "s-5", label: "Integrated Service Categories", value: "12+", description: "", context: "stats_band", sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "s-6", label: "Client Retention Rate", value: "98%", description: "", context: "stats_band", sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "s-7", label: "Years Operational Experience", value: "20+", description: "", context: "stats_band", sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "s-8", label: "Operations & Emergency Response", value: "24/7", description: "", context: "stats_band", sort_order: 7, is_active: true, created_at: "", updated_at: "" },
];

export async function getStatistics(
  context?: Statistic["context"],
): Promise<Statistic[]> {
  return unstable_cache(
    async () => {
      try {
        let q = admin().from("statistics").select("*").eq("is_active", true);
        if (context) q = q.eq("context", context);
        const { data } = await q.order("sort_order", { ascending: true });
        if (data && data.length > 0) return data as Statistic[];
        return context ? FALLBACK_STATISTICS.filter((s) => s.context === context) : FALLBACK_STATISTICS;
      } catch {
        return context ? FALLBACK_STATISTICS.filter((s) => s.context === context) : FALLBACK_STATISTICS;
      }
    },
    ["cms-statistics", context ?? "all"],
    { tags: [TAGS.stats], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export const FALLBACK_SERVICES: Service[] = [
  {
    id: "svc-1",
    name: "Security Services",
    slug: "security-services",
    short_description: "Trained & verified guards, supervisors, officers, bouncers, access control and patrolling.",
    full_description: "Comprehensive manned guarding, supervision and technology-supported security for residential, corporate, industrial and institutional premises.",
    eyebrow: "Security Services",
    hero_title: "Professional Security.\nProactive Protection.",
    hero_subtitle: "Comprehensive manned guarding, supervision and technology-supported security for residential, corporate, industrial and institutional premises.",
    hero_image_url: "/images/hero-mumbai-security.png",
    card_image_url: "/images/service-security-guard.png",
    icon_name: "shield",
    meta_title: "Security Services — SAFE Guard FORCE",
    meta_description: "Trained, verified security guards, supervisors, officers, access control, patrolling and CCTV monitoring in Mumbai.",
    sort_order: 0,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-2",
    name: "Facility Management",
    slug: "facility-management",
    short_description: "Society & facility managers, supervisors, inspections and vendor coordination.",
    full_description: "End-to-end operations for societies, corporate offices, commercial complexes and institutions — people, property, operations, quality and reporting.",
    eyebrow: "Facility Management",
    hero_title: "Complete Facility\nManagement. One\nResponsible Partner.",
    hero_subtitle: "End-to-end operations for societies, corporate offices, commercial complexes and institutions — people, property, operations, quality and reporting.",
    hero_image_url: "/images/team-inspection.png",
    card_image_url: "/images/service-facility-manager.png",
    icon_name: "building",
    meta_title: "Facility Management — SAFE Guard FORCE",
    meta_description: "Facility and society managers, supervisors, quality control, vendor coordination and site inspections in Mumbai.",
    sort_order: 1,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-3",
    name: "Housekeeping",
    slug: "housekeeping",
    short_description: "Cleaning, sanitization, waste management and hygiene maintenance.",
    full_description: "Professional cleaning, gardening and pest-control services that elevate hygiene, appearance and occupant experience across residential, commercial and institutional premises.",
    eyebrow: "Housekeeping, Gardening & Hygiene",
    hero_title: "Cleaner Spaces.\nHealthier Environments.",
    hero_subtitle: "Professional cleaning, gardening and pest-control services that elevate hygiene, appearance and occupant experience across residential, commercial and institutional premises.",
    hero_image_url: "/images/housekeeping-landscaping.png",
    card_image_url: "/images/service-housekeeping.png",
    icon_name: "sparkles",
    meta_title: "Housekeeping, Gardening & Hygiene — SAFE Guard FORCE",
    meta_description: "Housekeeping, deep cleaning, gardening, landscaping and pest control services in Mumbai.",
    sort_order: 2,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-4",
    name: "Gardening & Landscaping",
    slug: "gardening-landscaping",
    short_description: "Lawn, garden, irrigation, pruning and landscape maintenance.",
    full_description: "Gardeners and landscaping support for lawns, planters, terraces, podium gardens and common-area greenery — irrigation, health and aesthetics managed.",
    eyebrow: "Gardening & Landscaping",
    hero_title: "Green Spaces,\nBeautifully Maintained.",
    hero_subtitle: "Lawn, garden, irrigation, pruning and landscape maintenance for societies, offices and institutions.",
    hero_image_url: "/images/housekeeping-landscaping.png",
    card_image_url: "/images/service-gardening.png",
    icon_name: "leaf",
    meta_title: "Gardening & Landscaping — SAFE Guard FORCE",
    meta_description: "Gardening and landscaping services: lawns, planters, irrigation, pruning and seasonal maintenance in Mumbai.",
    sort_order: 3,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-5",
    name: "Fire & Safety",
    slug: "fire-safety",
    short_description: "Fire marshals, inspections, evacuation planning and safety training.",
    full_description: "Specialized safety, canine and event-security capabilities for proactive risk mitigation and large-gathering management.",
    eyebrow: "Fire • Safety • Dog Squad • Events",
    hero_title: "Prepared for\nEvery Situation.",
    hero_subtitle: "Specialized safety, canine and event-security capabilities for proactive risk mitigation and large-gathering management.",
    hero_image_url: "/images/fire-event-safety.png",
    card_image_url: "/images/service-fire-safety.png",
    icon_name: "flame",
    meta_title: "Fire, Safety, Dog Squad & Event Security — SAFE Guard FORCE",
    meta_description: "Fire marshals, equipment inspections, evacuation planning, dog squad and event security services in Mumbai.",
    sort_order: 4,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-6",
    name: "Dog Squad",
    slug: "dog-squad",
    short_description: "Trained sniffer dogs & handlers for patrol and detection.",
    full_description: "Trained canine teams with certified handlers for entrance monitoring, perimeter patrols and detection support.",
    eyebrow: "Dog Squad Services",
    hero_title: "Trained Canine\nSecurity.",
    hero_subtitle: "Trained sniffer dogs with certified handlers for entrance monitoring, perimeter patrols and event augmentation.",
    hero_image_url: "/images/canine-handler.png",
    card_image_url: "/images/service-dog-squad.png",
    icon_name: "paw",
    meta_title: "Dog Squad Services — SAFE Guard FORCE",
    meta_description: "Trained sniffer dogs and certified handlers for patrol, detection and event security in Mumbai.",
    sort_order: 5,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-7",
    name: "Event Security",
    slug: "event-security",
    short_description: "Crowd control, VIP protection and venue entry management.",
    full_description: "Coverage for weddings, corporate events, exhibitions, clubs and private functions — from guest screening to stage and green-room protection.",
    eyebrow: "Bouncer & Event Security",
    hero_title: "Disciplined Crowd\n& Venue Control.",
    hero_subtitle: "Bouncers, crowd control, entry management and discreet VIP protection for events of every scale.",
    hero_image_url: "/images/fire-event-safety.png",
    card_image_url: "/images/service-event-security.png",
    icon_name: "users",
    meta_title: "Event Security & Bouncers — SAFE Guard FORCE",
    meta_description: "Bouncers, crowd control, VIP protection and venue security for events, weddings and exhibitions in Mumbai.",
    sort_order: 6,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-8",
    name: "Technical Maintenance",
    slug: "technical-maintenance",
    short_description: "Electrical, plumbing, HVAC, civil and infrastructure support.",
    full_description: "Electrical, plumbing, HVAC, civil and STP operations for uninterrupted, compliant and cost-efficient property performance.",
    eyebrow: "Technical Maintenance & STP",
    hero_title: "Technical Expertise\nBehind Efficient\nOperations.",
    hero_subtitle: "Electrical, plumbing, HVAC, civil and STP operations for uninterrupted, compliant and cost-efficient property performance.",
    hero_image_url: "/images/technical-maintenance.png",
    card_image_url: "/images/service-technical.png",
    icon_name: "wrench",
    meta_title: "Technical Maintenance & STP Operations — SAFE Guard FORCE",
    meta_description: "Electrical, plumbing, HVAC, civil maintenance and STP operations in Mumbai.",
    sort_order: 7,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-9",
    name: "Pest Control",
    slug: "pest-control",
    short_description: "Mosquito, termite, cockroach and rodent management.",
    full_description: "Scheduled and on-call pest-control services with safe, approved methods and preventive hygiene practices.",
    eyebrow: "Pest Control & Hygiene",
    hero_title: "Preventive Hygiene\n& Pest Management.",
    hero_subtitle: "Scheduled and on-call pest-control services with safe, approved methods and preventive hygiene practices.",
    hero_image_url: "/images/housekeeping-landscaping.png",
    card_image_url: "/images/service-pest-control.png",
    icon_name: "bug",
    meta_title: "Pest Control — SAFE Guard FORCE",
    meta_description: "Mosquito, termite, cockroach and rodent control with preventive hygiene audits in Mumbai.",
    sort_order: 8,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-10",
    name: "Reception & Helpdesk",
    slug: "reception-helpdesk",
    short_description: "Receptionists, helpdesk, pantry and office support staff.",
    full_description: "Front-office receptionists, helpdesk staff, pantry and office support for corporate environments.",
    eyebrow: "Reception & Helpdesk",
    hero_title: "Front-Office\nExcellence.",
    hero_subtitle: "Receptionists, helpdesk, pantry and office support staff for productive workplaces.",
    hero_image_url: "/images/service-helpdesk.png",
    card_image_url: "/images/service-helpdesk.png",
    icon_name: "headset",
    meta_title: "Reception & Helpdesk Staffing — SAFE Guard FORCE",
    meta_description: "Receptionists, helpdesk, pantry and office support staff in Mumbai.",
    sort_order: 9,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-11",
    name: "Detective Services",
    slug: "detective-services",
    short_description: "Confidential investigations, verification and surveillance.",
    full_description: "Discreet, lawful and professionally conducted verification, surveillance and corporate investigations — with strict confidentiality.",
    eyebrow: "Confidential Investigation",
    hero_title: "Confidential\nInformation.\nProfessional\nInvestigation.",
    hero_subtitle: "Discreet, lawful and professionally conducted verification, surveillance and corporate investigations — with strict confidentiality.",
    hero_image_url: "/images/investigation-consultation.png",
    card_image_url: "/images/service-investigation.png",
    icon_name: "search",
    meta_title: "Detective & Investigation Services — SAFE Guard FORCE",
    meta_description: "Confidential background verification, surveillance and corporate investigations conducted lawfully in Mumbai.",
    sort_order: 10,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "svc-12",
    name: "STP Operations",
    slug: "stp-operations",
    short_description: "Sewage treatment plant operation, maintenance & compliance.",
    full_description: "Compliant, well-documented STP operations covering treatment monitoring, electromechanical upkeep, sludge handling and water-quality discipline — aligned to MPCB / environmental norms and society requirements.",
    eyebrow: "STP Operation & Maintenance",
    hero_title: "Professional Sewage\nTreatment Operations.",
    hero_subtitle: "Compliant, well-documented STP operations covering treatment monitoring, electromechanical upkeep, sludge handling and water-quality discipline.",
    hero_image_url: "/images/stp-operations.png",
    card_image_url: "/images/service-stp.png",
    icon_name: "droplet",
    meta_title: "STP Operation & Maintenance — SAFE Guard FORCE",
    meta_description: "Sewage treatment plant operation, maintenance and MPCB compliance support in Mumbai.",
    sort_order: 11,
    is_featured: true,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

export async function getServices(activeOnly = true): Promise<Service[]> {
  return unstable_cache(
    async () => {
      try {
        let q = admin().from("services").select("*");
        if (activeOnly) q = q.eq("is_active", true);
        const [{ data: servicesData }, { data: secData }] = await Promise.all([
          q.order("sort_order", { ascending: true }),
          admin()
            .from("homepage_sections")
            .select("items")
            .eq("section_key", "services")
            .maybeSingle(),
        ]);

        const redirects: Record<string, string> = {};
        if (Array.isArray(secData?.items)) {
          for (const it of secData.items as { service_id?: string; redirect_url?: string }[]) {
            if (it?.service_id && it?.redirect_url) {
              redirects[it.service_id] = it.redirect_url;
            }
          }
        }

        const list = servicesData && servicesData.length > 0 ? (servicesData as Service[]) : FALLBACK_SERVICES;
        return list.map((s) => ({
          ...s,
          redirect_url: redirects[s.id] || (s as Service).redirect_url || "",
        }));
      } catch {
        return FALLBACK_SERVICES;
      }
    },
    ["cms-services", activeOnly ? "active" : "all"],
    { tags: [TAGS.services, TAGS.sections], revalidate: 300 },
  )();
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("services")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle();
        return (data as Service) ?? FALLBACK_SERVICES.find((s) => s.slug === slug) ?? null;
      } catch {
        return FALLBACK_SERVICES.find((s) => s.slug === slug) ?? null;
      }
    },
    ["cms-service", slug],
    { tags: [TAGS.services], revalidate: 300 },
  )();
}

export async function getServiceItems(
  serviceId: string,
  activeOnly = true,
): Promise<ServiceItem[]> {
  return unstable_cache(
    async () => {
      try {
        let q = admin()
          .from("service_items")
          .select("*")
          .eq("service_id", serviceId);
        if (activeOnly) q = q.eq("is_active", true);
        const { data } = await q.order("sort_order", { ascending: true });
        return (data as ServiceItem[]) ?? [];
      } catch {
        return [];
      }
    },
    ["cms-service-items", serviceId, activeOnly ? "active" : "all"],
    { tags: [TAGS.services], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* Industries                                                                 */
/* -------------------------------------------------------------------------- */

export const FALLBACK_INDUSTRIES: Industry[] = [
  { id: "ind-1", name: "Residential Societies", slug: "residential-societies", short_description: "Security, housekeeping, facility management, gardening, STP and support staff for harmonious living.", description: "Gate & visitor control, housekeeping, gardening, facility and STP operations.", image_url: "/images/service-facility-manager.png", icon_name: "building", points: ["Gate & visitor control", "Housekeeping & gardening", "Facility & STP ops"], sort_order: 0, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-2", name: "Corporate Offices", slug: "corporate-offices", short_description: "Reception, security, housekeeping and technical support for productive workplaces.", description: "Front-office, access and AMC coordination for corporate campuses.", image_url: "/images/service-helpdesk.png", icon_name: "building", points: ["Front-office & helpdesk", "Access & CCTV", "AMC coordination"], sort_order: 1, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-3", name: "Commercial Complexes", slug: "commercial-complexes", short_description: "High-footfall protocols for lobbies, parking and common areas.", description: "Visitor management, parking discipline and technical upkeep for commercial centers.", image_url: "/images/service-event-security.png", icon_name: "building", points: ["Visitor management", "Parking discipline", "Technical upkeep"], sort_order: 2, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-4", name: "Malls", slug: "malls", short_description: "Crowd management, asset protection and hygiene at scale.", description: "Crowd management, lost-and-found liaison and emergency drills for malls.", image_url: "/images/mumbai-business-district.png", icon_name: "building", points: ["Crowd & queue", "Lost-and-found liaison", "Emergency drills"], sort_order: 3, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-5", name: "Hospitals", slug: "hospitals", short_description: "Sensitive, hygienic and disciplined operations for healthcare.", description: "Infection-control cleaning, gate and ward security, and support staff for hospitals.", image_url: "/images/service-housekeeping.png", icon_name: "shield", points: ["Infection-control cleaning", "Gate & ward security", "Support staff"], sort_order: 4, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-6", name: "Hotels", slug: "hotels", short_description: "Guest-facing excellence in security, housekeeping and maintenance.", description: "Housekeeping, luggage and gate handling, and technical rooms for hotels.", image_url: "/images/hero-mumbai-security.png", icon_name: "building", points: ["Housekeeping", "Luggage & gate", "Technical rooms"], sort_order: 5, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-7", name: "Schools", slug: "schools", short_description: "Child-safe, vigilant and clean campuses.", description: "ID and visitor checks, patrols and CCTV, and hygiene for schools.", image_url: "/images/team-inspection.png", icon_name: "users", points: ["ID & visitor checks", "Patrols & CCTV", "Hygiene"], sort_order: 6, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-8", name: "Factories", slug: "factories", short_description: "Perimeter, material and workforce security with technical support.", description: "Material gate, shift supervision and safety audits for factories.", image_url: "/images/service-technical.png", icon_name: "wrench", points: ["Material gate", "Shift supervision", "Safety audits"], sort_order: 7, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-9", name: "Warehouses", slug: "warehouses", short_description: "Inventory protection and dock discipline.", description: "Perimeter and CCTV, inward/outward logs and night patrols for warehouses.", image_url: "/images/service-stp.png", icon_name: "shield", points: ["Perimeter & CCTV", "Inward/outward logs", "Night patrols"], sort_order: 8, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-10", name: "Construction Sites", slug: "construction-sites", short_description: "Overnight material, equipment and labour management.", description: "Material watch, labour verification and equipment logs for construction sites.", image_url: "/images/technical-maintenance.png", icon_name: "wrench", points: ["Material watch", "Labour verification", "Equipment logs"], sort_order: 9, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-11", name: "Events", slug: "events", short_description: "Bouncers, crowd control and discreet VIP protection.", description: "Entry and stage management, crowd flow and green-room protection for events.", image_url: "/images/fire-event-safety.png", icon_name: "users", points: ["Entry & stage", "Crowd flow", "Green-room"], sort_order: 10, is_featured: true, is_active: true, created_at: "", updated_at: "" },
  { id: "ind-12", name: "Institutions", slug: "institutions", short_description: "Customized integrated solutions for any premises type.", description: "Assessment first, custom SOPs and one accountable partner for institutions.", image_url: "/images/hospital-security.png", icon_name: "building", points: ["Assessment first", "Custom SOPs", "One partner"], sort_order: 11, is_featured: true, is_active: true, created_at: "", updated_at: "" },
];

export async function getIndustries(activeOnly = true): Promise<Industry[]> {
  return unstable_cache(
    async () => {
      try {
        let q = admin().from("industries").select("*");
        if (activeOnly) q = q.eq("is_active", true);
        const { data } = await q.order("sort_order", { ascending: true });
        return data && data.length > 0 ? (data as Industry[]) : FALLBACK_INDUSTRIES;
      } catch {
        return FALLBACK_INDUSTRIES;
      }
    },
    ["cms-industries", activeOnly ? "active" : "all"],
    { tags: [TAGS.industries], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const FALLBACK_ABOUT: AboutContent = {
  id: "fallback",
  page_title: "Built Around Safety.\nDriven by Professionalism.",
  eyebrow: "About SAFE Guard FORCE",
  hero_subtitle:
    "An integrated security, facility, technical and investigation organization delivering safer, cleaner and efficiently managed premises across Mumbai.",
  hero_image_url: "/images/team-inspection.png",
  who_we_are_heading: "Integrated Services. One Accountable Partner.",
  who_we_are_description:
    "SAFE Guard FORCE provides integrated security, facility management, housekeeping, gardening, technical maintenance, STP operations, fire & safety and confidential investigation services.",
  who_we_are_secondary:
    "Headquartered at C 517, Kailash Esplanade, Ghatkopar West, Mumbai, we serve residential societies, corporate offices, commercial complexes, hospitals, hotels, schools, factories, warehouses and event venues.",
  who_we_are_image_url: "/images/hero-mumbai-security.png",
  mission_title: "Our Mission",
  mission_description:
    "To provide reliable, disciplined and professional services that help organizations maintain safer, cleaner and efficiently managed premises.",
  vision_title: "Our Vision",
  vision_description:
    "To become a trusted integrated security and facility-management partner for organizations across India.",
  commitment_title: "Our Commitment",
  commitment_description:
    "Professional conduct, verified personnel, regular supervision and customized solutions — every site, every day.",
  management_heading: "Structured Operations. Measurable Quality.",
  management_description: "",
  management_checklist: [
    "Regular site inspections & audits",
    "Personnel supervision & attendance control",
    "Quality checks & SLA reporting",
    "Complaint resolution & escalation matrix",
    "Vendor coordination & AMC oversight",
    "Preventive maintenance scheduling",
  ],
  cta_text: "Discuss Your Requirements",
  cta_url: "/contact",
  meta_title: "About Us — SAFE Guard FORCE",
  meta_description:
    "Integrated security, facility, technical and investigation organization delivering safer, cleaner and efficiently managed premises across Mumbai.",
  is_published: true,
  created_at: "",
  updated_at: "",
};

export async function getAboutContent(): Promise<AboutContent | null> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("about_content")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: true })
          .limit(1);
        return (data?.[0] as AboutContent) ?? FALLBACK_ABOUT;
      } catch {
        return FALLBACK_ABOUT;
      }
    },
    ["cms-about"],
    { tags: [TAGS.about], revalidate: 300 },
  )();
}

export const FALLBACK_VALUES: ValueItem[] = [
  { id: "val-1", title: "Integrity", description: "Honest, ethical and transparent operations.", icon_name: "shield", sort_order: 0, is_active: true, created_at: "", updated_at: "" },
  { id: "val-2", title: "Discipline", description: "Uniformed, punctual and procedure-driven teams.", icon_name: "check", sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "val-3", title: "Professionalism", description: "Trained manpower with clear SOPs.", icon_name: "star", sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "val-4", title: "Accountability", description: "Supervised execution with reporting.", icon_name: "clipboard", sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "val-5", title: "Confidentiality", description: "Discreet handling of sensitive matters.", icon_name: "lock", sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "val-6", title: "Customer Satisfaction", description: "Responsive support and resolution.", icon_name: "smile", sort_order: 5, is_active: true, created_at: "", updated_at: "" },
];

export async function getValues(): Promise<ValueItem[]> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("values")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        return data && data.length > 0 ? (data as ValueItem[]) : FALLBACK_VALUES;
      } catch {
        return FALLBACK_VALUES;
      }
    },
    ["cms-values"],
    { tags: [TAGS.about], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const FALLBACK_CONTACT_SETTINGS: ContactSettings = {
  id: "fallback",
  contact_heading: "Let's Make Your\nPremises Safer,\nCleaner & Better Managed.",
  contact_subtitle: "Reach our team for a free consultation, site assessment or confidential discussion. Mumbai-based, nationwide capability.",
  form_heading: "Request a Consultation",
  form_subtitle: "Tell us about your premises and service needs — we'll respond promptly.",
  hero_image_url: "/images/team-inspection.png",
  map_image_url: "/images/mumbai-business-district.png",
  assistance_hours: "24/7 Professional Assistance",
  assistance_note: "Prompt response for enquiries and operational support.",
  phone_numbers: ["7977179807", "9136645289"],
  whatsapp_number: "917977179807",
  whatsapp_message: "Hello SAFE Guard FORCE, I would like to discuss your services.",
  email: "safeguardforce02@gmail.com",
  address: {
    line1: "C 517, Kailash Esplanade",
    line2: "Opp. Shreyash Cinema, LBS Marg",
    city: "Ghatkopar West, Mumbai",
    pincode: "400086",
  },
  map_url: "https://maps.google.com/?q=C+517+Kailash+Esplanade+Ghatkopar+West+Mumbai",
  map_note: "Located opposite Shreyash Cinema on LBS Marg — accessible from Ghatkopar Metro and Eastern Express Highway.",
  property_types: [
    "Residential Society",
    "Corporate Office",
    "Commercial Complex / Mall",
    "Hospital / Clinic",
    "Hotel / Restaurant",
    "School / Institution",
    "Factory / Warehouse",
    "Construction Site",
    "Event / Venue",
    "Other",
  ],
  cta_text: "Request a Consultation →",
  created_at: "",
  updated_at: "",
};

export async function getContactSettings(): Promise<ContactSettings | null> {
  return unstable_cache(
    async () => {
      try {
        const [{ data }, { data: secData }] = await Promise.all([
          admin()
            .from("contact_settings")
            .select("*")
            .order("updated_at", { ascending: false })
            .limit(1),
          admin()
            .from("homepage_sections")
            .select("*")
            .eq("section_key", "contact_page")
            .limit(1),
        ]);

        const base = (data?.[0] as ContactSettings) ?? FALLBACK_CONTACT_SETTINGS;
        const sec = secData?.[0];
        const itemsObj = (sec?.items?.[0] || {}) as Record<string, string>;

        const hero_image_url =
          base.hero_image_url ||
          itemsObj.hero_image_url ||
          sec?.image_url ||
          FALLBACK_CONTACT_SETTINGS.hero_image_url ||
          "/images/team-inspection.png";
        const map_image_url =
          base.map_image_url ||
          itemsObj.map_image_url ||
          FALLBACK_CONTACT_SETTINGS.map_image_url ||
          "/images/mumbai-business-district.png";

        return {
          ...base,
          hero_image_url,
          map_image_url,
        };
      } catch {
        return FALLBACK_CONTACT_SETTINGS;
      }
    },
    ["cms-contact"],
    { tags: [TAGS.contact], revalidate: 300 }
  )();
}

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

export async function getTestimonials(): Promise<Testimonial[]> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("testimonials")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        return (data as Testimonial[]) ?? [];
      } catch {
        return [];
      }
    },
    ["cms-testimonials"],
    { tags: [TAGS.testimonials], revalidate: 300 },
  )();
}
