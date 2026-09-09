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
 * degrades gracefully to a safe fallback if Supabase is unreachable/empty —
 * the public site never crashes because of the CMS.
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
        (revalidateTag as (t: string, p?: string | { expire?: number }) => void)(tag, { expire: 0 });
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
  primary_phone: "9323581437",
  secondary_phone: "9136645289",
  email: "info@safeguardforce.in",
  whatsapp_number: "919323581437",
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
  top_bar_text: "Mumbai • Nationwide Service Capability",
  footer_description:
    "Integrated security, facility management, technical and investigation solutions. Professional, disciplined and reliable services for safer, cleaner and efficiently managed premises.",
  copyright_text: "SAFE Guard FORCE. All Rights Reserved.",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
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
        const { data } = await admin()
          .from("site_settings")
          .select("*")
          .ilike("site_name", "%SAFE%")
          .limit(1);
        if (data?.[0]) return data[0] as SiteSettings;
        const { data: anyRow } = await admin()
          .from("site_settings")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1);
        return (anyRow?.[0] as SiteSettings) ?? FALLBACK_SITE_SETTINGS;
      } catch {
        return FALLBACK_SITE_SETTINGS;
      }
    },
    ["cms-site-settings"],
    { tags: [TAGS.settings], revalidate: 300 },
  )();

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
        if (error || !data) return buildFallbackNav();
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
/* Homepage sections                                                          */
/* -------------------------------------------------------------------------- */

export async function getHomepageSections(): Promise<HomepageSection[]> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("homepage_sections")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true });
        return (data as HomepageSection[]) ?? [];
      } catch {
        return [];
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
/* Hero slides + stats                                                        */
/* -------------------------------------------------------------------------- */

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("hero_slides")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        return (data as HeroSlide[]) ?? [];
      } catch {
        return [];
      }
    },
    ["cms-hero-slides"],
    { tags: [TAGS.hero], revalidate: 300 },
  )();
}

export async function getStatistics(
  context?: Statistic["context"],
): Promise<Statistic[]> {
  return unstable_cache(
    async () => {
      try {
        let q = admin().from("statistics").select("*").eq("is_active", true);
        if (context) q = q.eq("context", context);
        const { data } = await q.order("sort_order", { ascending: true });
        return (data as Statistic[]) ?? [];
      } catch {
        return [];
      }
    },
    ["cms-statistics", context ?? "all"],
    { tags: [TAGS.stats], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export async function getServices(activeOnly = true): Promise<Service[]> {
  return unstable_cache(
    async () => {
      try {
        let q = admin().from("services").select("*");
        if (activeOnly) q = q.eq("is_active", true);
        const { data } = await q.order("sort_order", { ascending: true });
        return (data as Service[]) ?? [];
      } catch {
        return [];
      }
    },
    ["cms-services", activeOnly ? "active" : "all"],
    { tags: [TAGS.services], revalidate: 300 },
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
        return (data as Service) ?? null;
      } catch {
        return null;
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

export async function getIndustries(activeOnly = true): Promise<Industry[]> {
  return unstable_cache(
    async () => {
      try {
        let q = admin().from("industries").select("*");
        if (activeOnly) q = q.eq("is_active", true);
        const { data } = await q.order("sort_order", { ascending: true });
        return (data as Industry[]) ?? [];
      } catch {
        return [];
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
  management_checklist: [],
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
        return (data?.[0] as AboutContent) ?? null;
      } catch {
        return null;
      }
    },
    ["cms-about"],
    { tags: [TAGS.about], revalidate: 300 },
  )();
}

export async function getValues(): Promise<ValueItem[]> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("values")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        return (data as ValueItem[]) ?? [];
      } catch {
        return [];
      }
    },
    ["cms-values"],
    { tags: [TAGS.about], revalidate: 300 },
  )();
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export async function getContactSettings(): Promise<ContactSettings | null> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await admin()
          .from("contact_settings")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(1);
        return (data?.[0] as ContactSettings) ?? null;
      } catch {
        return null;
      }
    },
    ["cms-contact"],
    { tags: [TAGS.contact], revalidate: 300 },
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
