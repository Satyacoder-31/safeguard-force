"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { logActivity } from "@/lib/cms/logs";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { SiteSettings, Statistic, Enquiry, Profile, ContactSettings } from "@/types/database";

/* ========================================================================== */
/* Shared helpers                                                             */
/* ========================================================================== */

async function guard() {
  return requireAdmin();
}

async function publicRevalidate() {
  // Refresh all cached public pages and layouts after any content mutation.
  ["/", "/about", "/contact", "/industries", "/brochure"].forEach((p) => {
    try { revalidatePath(p, "page"); } catch (e) {}
    try { revalidatePath(p, "layout"); } catch (e) {}
  });
  try { revalidatePath("/services/[slug]", "page"); } catch (e) {}
  ["security-services", "facility-management", "housekeeping", "fire-safety", "technical-maintenance", "detective-services"].forEach(
    (p) => {
      try { revalidatePath(`/${p}`, "page"); } catch (e) {}
    }
  );
  try { revalidatePath("/admin", "layout"); } catch (e) {}
  try {
    const { revalidateAllCms } = await import("@/lib/cms/queries");
    await revalidateAllCms();
  } catch (err) {
    console.warn("[admin] CMS tag revalidation error:", err);
  }
}

type Result = { ok: boolean; error?: string; id?: string; publicUrl?: string };

function fail(err: unknown, fallback: string): Result {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("[admin-action]", msg);
  if (msg.includes("duplicate key")) return { ok: false, error: "A record with this slug/name already exists." };
  if (msg.includes("UNAUTHENTICATED")) return { ok: false, error: "Please sign in again." };
  if (msg.includes("FORBIDDEN")) return { ok: false, error: "You do not have permission for this action." };
  return { ok: false, error: fallback };
}

type IdLike = string | FormData;

function toId(input: IdLike): string {
  return typeof input === "string" ? input : String(input.get("id") || "");
}

/* ========================================================================== */
/* File upload (images & PDF documents)                                       */
/* ========================================================================== */

export async function uploadMediaFile(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const file = formData.get("file") as File | null;
    if (!file || typeof file === "string") return { ok: false, error: "No file provided." };
    const folder = String(formData.get("folder") || "general");
    const alt = String(formData.get("alt") || "");

    const ALLOWED = [
      "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif",
      "application/pdf", "application/x-pdf"
    ];
    const isPdf = file.type === "application/pdf" || file.type === "application/x-pdf" || file.name.toLowerCase().endsWith(".pdf");
    
    if (!ALLOWED.includes(file.type) && !isPdf && !file.type.startsWith("image/")) {
      return { ok: false, error: "Unsupported file type. Use JPG, PNG, WebP, GIF, SVG, AVIF or PDF." };
    }
    if (file.size > 50 * 1024 * 1024) {
      return { ok: false, error: "File exceeds 50 MB limit." };
    }

    const admin = createAdminClient();
    const ext = isPdf ? "pdf" : (file.name.split(".").pop() || "jpg");
    const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
    const path = `${folder}/${Date.now()}-${base}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = isPdf ? "application/pdf" : (file.type || "image/jpeg");

    const { error: upErr } = await admin.storage.from("website-media").upload(path, buffer, {
      contentType,
      upsert: true,
    });
    if (upErr) throw upErr;

    const { data: { publicUrl } } = admin.storage.from("website-media").getPublicUrl(path);

    // Register in media_library
    await admin.from("media_library").insert({
      file_name: file.name,
      storage_path: path,
      public_url: publicUrl,
      mime_type: contentType,
      file_size: file.size,
      folder,
      alt_text: alt || base.replace(/-/g, " "),
      uploaded_by: profile.id,
    });

    await logActivity({
      adminUserId: profile.id,
      action: `Uploaded ${isPdf ? "document" : "media"}: ${file.name}`,
      entityType: "media",
    });

    return { ok: true, publicUrl };
  } catch (err) {
    return fail(err, "File upload failed.");
  }
}

/* ========================================================================== */
/* Site settings & Brochure                                                   */
/* ========================================================================== */

const VALID_SITE_SETTINGS_COLUMNS = new Set([
  "site_name", "brand_name", "tagline", "logo_url", "favicon_url",
  "primary_phone", "secondary_phone", "email", "whatsapp_number", "whatsapp_message",
  "address_line_1", "address_line_2", "city", "state", "pincode", "country",
  "google_maps_url", "support_text", "top_bar_text", "footer_description",
  "copyright_text", "facebook_url", "instagram_url", "linkedin_url",
  "youtube_url", "twitter_url", "primary_color", "secondary_color",
  "dark_color", "light_color"
]);

export async function saveSiteSettings(_prev: unknown, formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    
    // Target SAFE Guard FORCE row
    let existingId: string | null = null;
    const { data: safeRow } = await admin.from("site_settings").select("id").ilike("site_name", "%SAFE%").limit(1);
    if (safeRow?.[0]) {
      existingId = safeRow[0].id;
    } else {
      const { data: anyRow } = await admin.from("site_settings").select("id").limit(1);
      if (anyRow?.[0]) existingId = anyRow[0].id;
    }

    const patch: Record<string, string | boolean> = {};
    for (const [k, v] of formData.entries()) {
      if (VALID_SITE_SETTINGS_COLUMNS.has(k) && typeof v === "string") {
        patch[k] = v;
      }
    }

    let error;
    if (existingId) {
      ({ error } = await admin.from("site_settings").update(patch as unknown as Partial<SiteSettings>).eq("id", existingId));
    } else {
      ({ error } = await admin.from("site_settings").insert(patch as unknown as Partial<SiteSettings>));
    }
    if (error) throw error;

    // Save brochure fields if present in form
    const brochureUrl = String(formData.get("brochure_url") || "").trim();
    const brochureTitle = String(formData.get("brochure_title") || "").trim();
    if (brochureUrl || brochureTitle || formData.has("brochure_enabled")) {
      const brochureEnabled = formData.has("brochure_enabled")
        ? (formData.get("brochure_enabled") === "on" || formData.get("brochure_enabled") === "true")
        : true;

      await admin.from("homepage_sections").upsert({
        section_key: "brochure",
        title: brochureTitle || "SAFE Guard FORCE Corporate Brochure",
        button_text: brochureTitle || "SAFE Guard FORCE Corporate Brochure",
        button_url: brochureUrl || "/brochure.pdf",
        image_url: brochureUrl || "/brochure.pdf",
        is_visible: brochureEnabled,
        sort_order: 99,
      }, { onConflict: "section_key" });
    }

    await logActivity({ adminUserId: profile.id, action: "Updated site settings", entityType: "site_settings" });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not save site settings.");
  }
}

export async function saveBrochureSettings(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const brochureUrl = String(formData.get("brochure_url") || "").trim();
    const brochureTitle = String(formData.get("brochure_title") || "SAFE Guard FORCE Corporate Brochure").trim();
    const eyebrow = String(formData.get("eyebrow") || "Official Company Document").trim();
    const description = String(formData.get("description") || "").trim();
    const buttonText = String(formData.get("button_text") || "View Corporate Profile (13 Pages) →").trim();
    const brochureEnabled = formData.has("brochure_enabled")
      ? (formData.get("brochure_enabled") === "on" || formData.get("brochure_enabled") === "true")
      : true;

    // Build 4 key highlights cards array
    const items = [
      { a: String(formData.get("card_1_a") || "20+ Years").trim(), b: String(formData.get("card_1_b") || "Industry Experience").trim() },
      { a: String(formData.get("card_2_a") || "PASARA #293").trim(), b: String(formData.get("card_2_b") || "Maharashtra Police Reg.").trim() },
      { a: String(formData.get("card_3_a") || "2 Centres").trim(), b: String(formData.get("card_3_b") || "Karjat & Gorakhpur Training").trim() },
      { a: String(formData.get("card_4_a") || "Full Audit").trim(), b: String(formData.get("card_4_b") || "PF, ESIC, GST & PT Compliant").trim() },
    ];

    // 1. Update homepage_sections
    const { error: secError } = await admin.from("homepage_sections").upsert({
      section_key: "brochure",
      eyebrow: eyebrow,
      title: brochureTitle,
      subtitle: description,
      description: description,
      button_text: buttonText,
      button_url: brochureUrl || "/brochure.pdf",
      image_url: brochureUrl || "/brochure.pdf",
      items: items,
      is_visible: brochureEnabled,
      sort_order: 99,
    }, { onConflict: "section_key" });

    if (secError) throw secError;

    // 2. Update site_settings for complete sync
    const { data: safeRow } = await admin.from("site_settings").select("id").ilike("site_name", "%SAFE%").limit(1);
    if (safeRow?.[0]?.id) {
      await admin.from("site_settings").update({
        brochure_url: brochureUrl || "/brochure.pdf",
        brochure_title: brochureTitle,
        brochure_enabled: brochureEnabled,
      }).eq("id", safeRow[0].id);
    }

    await logActivity({ adminUserId: profile.id, action: "Updated company brochure section", entityType: "site_settings" });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not save brochure settings.");
  }
}

export async function saveBrochurePageSettings(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();

    const eyebrow = String(formData.get("eyebrow") || "Official Corporate Profile").trim();
    const title = String(formData.get("title") || "SAFE GUARD FORCE Corporate Brochure").trim();
    const subtitle = String(formData.get("subtitle") || "").trim();
    const heroImage = String(formData.get("hero_image") || "/images/hero-mumbai-security.png").trim();
    const actionBarText = String(formData.get("action_bar_text") || "Official Corporate Profile • PASARA License No. 293 • Govt. of Maharashtra").trim();
    const downloadBtnText = String(formData.get("download_button_text") || "Download PDF Brochure").trim();
    const openBtnText = String(formData.get("open_button_text") || "Open PDF in New Tab").trim();
    const footerCardTitle = String(formData.get("footer_card_title") || "SAFE GUARD FORCE Corporate Profile").trim();
    const footerCardSubtitle = String(formData.get("footer_card_subtitle") || "").trim();
    const pdfUrl = String(formData.get("pdf_url") || "/brochure.pdf").trim();

    const items = [
      {
        action_bar_text: actionBarText,
        open_button_text: openBtnText,
        footer_card_title: footerCardTitle,
        footer_card_subtitle: footerCardSubtitle,
      },
    ];

    const { error: secError } = await admin.from("homepage_sections").upsert({
      section_key: "brochure_page",
      eyebrow: eyebrow,
      title: title,
      subtitle: subtitle,
      description: footerCardSubtitle,
      button_text: downloadBtnText,
      button_url: pdfUrl,
      image_url: heroImage,
      items: items,
      is_visible: true,
      sort_order: 100,
    }, { onConflict: "section_key" });

    if (secError) throw secError;

    // Sync pdfUrl to site_settings as well
    const { data: safeRow } = await admin.from("site_settings").select("id").ilike("site_name", "%SAFE%").limit(1);
    if (safeRow?.[0]?.id) {
      await admin.from("site_settings").update({
        brochure_url: pdfUrl,
        brochure_title: title,
      }).eq("id", safeRow[0].id);
    }

    await logActivity({ adminUserId: profile.id, action: "Updated /brochure page settings", entityType: "site_settings" });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not save brochure page settings.");
  }
}

/* ========================================================================== */
/* Navigation                                                                 */
/* ========================================================================== */

export async function upsertNavigationItem(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const parentId = String(formData.get("parent_id") || "");
    const values = {
      label: String(formData.get("label") || "").trim(),
      href: String(formData.get("href") || "/").trim(),
      parent_id: parentId || null,
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
      open_in_new_tab: formData.get("open_in_new_tab") === "on" || formData.get("open_in_new_tab") === "true",
    };
    if (!values.label) return { ok: false, error: "Label is required." };

    let error;
    if (id) {
      ({ error } = await admin.from("navigation_items").update(values).eq("id", id));
    } else {
      ({ error } = await admin.from("navigation_items").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: id ? "Updated navigation item" : "Created navigation item", entityType: "navigation_item", entityId: id, metadata: values });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save navigation item.");
  }
}

export async function deleteNavigationItem(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("navigation_items").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted navigation item", entityType: "navigation_item", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete navigation item.");
  }
}

/* ========================================================================== */
/* Homepage sections                                                          */
/* ========================================================================== */

export async function updateHomepageSection(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const values: Record<string, any> = {
      eyebrow: String(formData.get("eyebrow") || ""),
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || ""),
      description: String(formData.get("description") || ""),
      image_url: String(formData.get("image_url") || ""),
      button_text: String(formData.get("button_text") || ""),
      button_url: String(formData.get("button_url") || ""),
      is_visible: formData.get("is_visible") === "on" || formData.get("is_visible") === "true",
      sort_order: Number(formData.get("sort_order") || 0),
    };

    if (formData.has("items")) {
      try {
        const rawItems = String(formData.get("items") || "[]");
        values.items = JSON.parse(rawItems);
      } catch (e) {}
    }

    const { error } = await admin.from("homepage_sections").update(values as any).eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Updated homepage section", entityType: "homepage_section", entityId: id, metadata: { section: String(formData.get("section_key") || "") } });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save homepage section.");
  }
}

export async function toggleHomepageSection(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const visible = formData.get("visible") === "true";
    const { error } = await admin.from("homepage_sections").update({ is_visible: visible }).eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: visible ? "Showed homepage section" : "Hid homepage section", entityType: "homepage_section", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update section.");
  }
}

/* ========================================================================== */
/* Hero slides                                                                */
/* ========================================================================== */

export async function upsertHeroSlide(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const values = {
      title: String(formData.get("title") || ""),
      highlighted_title: String(formData.get("highlighted_title") || ""),
      description: String(formData.get("description") || ""),
      image_url: String(formData.get("image_url") || ""),
      mobile_image_url: String(formData.get("mobile_image_url") || ""),
      alt_text: String(formData.get("alt_text") || ""),
      button_text: String(formData.get("button_text") || ""),
      button_url: String(formData.get("button_url") || "/contact"),
      phone_button_text: String(formData.get("phone_button_text") || ""),
      phone_number: String(formData.get("phone_number") || ""),
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
      duration_ms: Math.min(30000, Math.max(1500, Number(formData.get("duration_ms") || 5000))),
    };

    let error;
    if (id) {
      ({ error } = await admin.from("hero_slides").update(values).eq("id", id));
    } else {
      ({ error } = await admin.from("hero_slides").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: id ? "Updated hero slide" : "Created hero slide", entityType: "hero_slide", entityId: id, metadata: { title: values.title } });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save hero slide.");
  }
}

export async function deleteHeroSlide(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("hero_slides").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted hero slide", entityType: "hero_slide", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete hero slide.");
  }
}

/* ========================================================================== */
/* Services + service items                                                   */
/* ========================================================================== */

export async function upsertService(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    if (!name) return { ok: false, error: "Name is required." };
    const values = {
      name,
      slug: String(formData.get("slug") || "").trim() || slugify(name),
      short_description: String(formData.get("short_description") || ""),
      full_description: String(formData.get("full_description") || ""),
      eyebrow: String(formData.get("eyebrow") || ""),
      hero_title: String(formData.get("hero_title") || ""),
      hero_subtitle: String(formData.get("hero_subtitle") || ""),
      hero_image_url: String(formData.get("hero_image_url") || ""),
      card_image_url: String(formData.get("card_image_url") || ""),
      icon_name: String(formData.get("icon_name") || "shield"),
      meta_title: String(formData.get("meta_title") || ""),
      meta_description: String(formData.get("meta_description") || ""),
      sort_order: Number(formData.get("sort_order") || 0),
      is_featured: formData.get("is_featured") === "on" || formData.get("is_featured") === "true",
      is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
    };

    let error;
    let savedId = id;
    if (id) {
      ({ error } = await admin.from("services").update(values).eq("id", id));
    } else {
      const res = await admin.from("services").insert(values).select("id").single();
      error = res.error;
      if (res.data) savedId = res.data.id;
    }
    if (error) throw error;

    // Handle custom Learn More redirect URL stored in homepage_sections
    const redirectUrl = String(formData.get("redirect_url") || "").trim();
    if (savedId) {
      try {
        const { data: sec } = await admin
          .from("homepage_sections")
          .select("items")
          .eq("section_key", "services")
          .maybeSingle();
        type CustomItem = { service_id?: string; redirect_url?: string };
        let items: CustomItem[] = Array.isArray(sec?.items) ? [...(sec.items as CustomItem[])] : [];
        items = items.filter((it) => it?.service_id !== savedId);
        if (redirectUrl) {
          items.push({ service_id: savedId, redirect_url: redirectUrl });
        }
        await admin.from("homepage_sections").update({ items }).eq("section_key", "services");
      } catch (e) {
        console.warn("[admin] Could not update service redirect url:", e);
      }
    }

    await logActivity({ adminUserId: profile.id, action: id ? "Updated service" : "Created service", entityType: "service", entityId: savedId || id, metadata: { name } });
    await publicRevalidate();
    return { ok: true, id: savedId || id };
  } catch (err) {
    return fail(err, "Could not save service.");
  }
}

export async function toggleServiceFeatured(serviceId: string, isFeatured: boolean): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const { error } = await admin.from("services").update({ is_featured: isFeatured }).eq("id", serviceId);
    if (error) throw error;
    await logActivity({
      adminUserId: profile.id,
      action: isFeatured ? "Added service to homepage core services" : "Removed service from homepage core services",
      entityType: "service",
      entityId: serviceId,
    });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update service featured status.");
  }
}

export async function deleteService(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("services").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted service", entityType: "service", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete service.");
  }
}

export async function upsertServiceItem(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const serviceId = String(formData.get("service_id") || "");
    const values = {
      service_id: serviceId,
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || ""),
      image_url: String(formData.get("image_url") || ""),
      icon_name: String(formData.get("icon_name") || ""),
      points: String(formData.get("points") || "").split("\n").map((s) => s.trim()).filter(Boolean),
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
    };
    if (!values.title) return { ok: false, error: "Title is required." };

    let error;
    if (id) {
      ({ error } = await admin.from("service_items").update(values).eq("id", id));
    } else {
      ({ error } = await admin.from("service_items").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: id ? "Updated service item" : "Created service item", entityType: "service_item", entityId: id, metadata: { title: values.title } });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save service item.");
  }
}

export async function deleteServiceItem(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("service_items").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted service item", entityType: "service_item", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete service item.");
  }
}

/* ========================================================================== */
/* Industries                                                                 */
/* ========================================================================== */

export async function upsertIndustry(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    if (!name) return { ok: false, error: "Name is required." };
    const values = {
      name,
      slug: String(formData.get("slug") || "").trim() || slugify(name),
      short_description: String(formData.get("short_description") || ""),
      description: String(formData.get("description") || ""),
      image_url: String(formData.get("image_url") || ""),
      icon_name: String(formData.get("icon_name") || "building"),
      points: String(formData.get("points") || "").split("\n").map((s) => s.trim()).filter(Boolean),
      sort_order: Number(formData.get("sort_order") || 0),
      is_featured: formData.get("is_featured") === "on" || formData.get("is_featured") === "true",
      is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
    };

    let error;
    if (id) {
      ({ error } = await admin.from("industries").update(values).eq("id", id));
    } else {
      ({ error } = await admin.from("industries").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: id ? "Updated industry" : "Created industry", entityType: "industry", entityId: id, metadata: { name } });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save industry.");
  }
}

export async function deleteIndustry(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("industries").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted industry", entityType: "industry", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete industry.");
  }
}

/* ========================================================================== */
/* About + values                                                             */
/* ========================================================================== */

export async function saveAboutContent(_prev: unknown, formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const { data: existing } = await admin.from("about_content").select("id").limit(1);
    const values = {
      page_title: String(formData.get("page_title") || ""),
      eyebrow: String(formData.get("eyebrow") || ""),
      hero_subtitle: String(formData.get("hero_subtitle") || ""),
      hero_image_url: String(formData.get("hero_image_url") || ""),
      who_we_are_heading: String(formData.get("who_we_are_heading") || ""),
      who_we_are_description: String(formData.get("who_we_are_description") || ""),
      who_we_are_secondary: String(formData.get("who_we_are_secondary") || ""),
      who_we_are_image_url: String(formData.get("who_we_are_image_url") || ""),
      mission_title: String(formData.get("mission_title") || ""),
      mission_description: String(formData.get("mission_description") || ""),
      vision_title: String(formData.get("vision_title") || ""),
      vision_description: String(formData.get("vision_description") || ""),
      commitment_title: String(formData.get("commitment_title") || ""),
      commitment_description: String(formData.get("commitment_description") || ""),
      management_heading: String(formData.get("management_heading") || ""),
      management_description: String(formData.get("management_description") || ""),
      management_checklist: String(formData.get("management_checklist") || "").split("\n").map((s) => s.trim()).filter(Boolean),
      cta_text: String(formData.get("cta_text") || ""),
      cta_url: String(formData.get("cta_url") || "/contact"),
      meta_title: String(formData.get("meta_title") || ""),
      meta_description: String(formData.get("meta_description") || ""),
      is_published: formData.get("is_published") === "on",
    };

    let error;
    if (existing?.[0]) {
      ({ error } = await admin.from("about_content").update(values).eq("id", existing[0].id));
    } else {
      ({ error } = await admin.from("about_content").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Updated about content", entityType: "about_content" });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not save about content.");
  }
}

/* ========================================================================== */
/* Contact settings                                                           */
/* ========================================================================== */

export async function saveContactSettings(_prev: unknown, formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const { data: existing } = await admin.from("contact_settings").select("id").limit(1);

    const hero_image_url = String(formData.get("hero_image_url") || "").trim();
    const map_image_url = String(formData.get("map_image_url") || "").trim();

    // 1. Sync hero & map image URLs to homepage_sections (section_key: "contact_page")
    try {
      await admin.from("homepage_sections").upsert(
        {
          section_key: "contact_page",
          title: "Contact Page Media",
          image_url: hero_image_url,
          items: [{ hero_image_url, map_image_url }],
          is_visible: true,
          sort_order: 999,
        },
        { onConflict: "section_key" }
      );
    } catch (e) {
      console.warn("[admin] Could not update contact_page section media:", e);
    }

    const values: Record<string, unknown> = {
      contact_heading: String(formData.get("contact_heading") || ""),
      contact_subtitle: String(formData.get("contact_subtitle") || ""),
      form_heading: String(formData.get("form_heading") || ""),
      form_subtitle: String(formData.get("form_subtitle") || ""),
      hero_image_url,
      map_image_url,
      assistance_hours: String(formData.get("assistance_hours") || ""),
      assistance_note: String(formData.get("assistance_note") || ""),
      phone_numbers: String(formData.get("phone_numbers") || "").split("\n").map((s) => s.trim()).filter(Boolean),
      whatsapp_number: String(formData.get("whatsapp_number") || ""),
      whatsapp_message: String(formData.get("whatsapp_message") || ""),
      email: String(formData.get("email") || ""),
      address: {
        line1: String(formData.get("addr_line1") || ""),
        line2: String(formData.get("addr_line2") || ""),
        city: String(formData.get("addr_city") || ""),
        pincode: String(formData.get("addr_pincode") || ""),
      },
      map_url: String(formData.get("map_url") || ""),
      map_note: String(formData.get("map_note") || ""),
      property_types: String(formData.get("property_types") || "").split("\n").map((s) => s.trim()).filter(Boolean),
      cta_text: String(formData.get("cta_text") || ""),
    };

    let error;
    if (existing?.[0]) {
      ({ error } = await admin.from("contact_settings").update(values as unknown as Partial<ContactSettings>).eq("id", existing[0].id));
    } else {
      ({ error } = await admin.from("contact_settings").insert(values as unknown as Partial<ContactSettings>));
    }

    // Fallback if contact_settings table in DB is missing hero_image_url or map_image_url columns
    if (
      error &&
      (error.message.includes("hero_image_url") ||
        error.message.includes("map_image_url") ||
        error.code === "PGRST204")
    ) {
      delete values.hero_image_url;
      delete values.map_image_url;
      if (existing?.[0]) {
        ({ error } = await admin.from("contact_settings").update(values as unknown as Partial<ContactSettings>).eq("id", existing[0].id));
      } else {
        ({ error } = await admin.from("contact_settings").insert(values as unknown as Partial<ContactSettings>));
      }
    }

    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Updated contact settings", entityType: "contact_settings" });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not save contact settings.");
  }
}

/* ========================================================================== */
/* Values (core values)                                                       */
/* ========================================================================== */

export async function upsertValue(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const values = {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || ""),
      icon_name: String(formData.get("icon_name") || "shield"),
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
    };
    if (!values.title) return { ok: false, error: "Title is required." };

    let error;
    if (id) {
      ({ error } = await admin.from("values").update(values).eq("id", id));
    } else {
      ({ error } = await admin.from("values").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: id ? "Updated value" : "Created value", entityType: "value", entityId: id });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save value.");
  }
}

export async function deleteValue(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("values").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted value", entityType: "value", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete value.");
  }
}

/* ========================================================================== */
/* Testimonials                                                               */
/* ========================================================================== */

export async function upsertTestimonial(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const values = {
      client_name: String(formData.get("client_name") || "").trim(),
      company: String(formData.get("company") || ""),
      role: String(formData.get("role") || ""),
      testimonial: String(formData.get("testimonial") || ""),
      photo_url: String(formData.get("photo_url") || ""),
      rating: Math.min(5, Math.max(1, Number(formData.get("rating") || 5))),
      sort_order: Number(formData.get("sort_order") || 0),
      is_featured: formData.get("is_featured") === "on",
      is_active: formData.get("is_active") === "on",
    };
    if (!values.client_name || !values.testimonial) return { ok: false, error: "Name and testimonial are required." };

    let error;
    if (id) {
      ({ error } = await admin.from("testimonials").update(values).eq("id", id));
    } else {
      ({ error } = await admin.from("testimonials").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: id ? "Updated testimonial" : "Created testimonial", entityType: "testimonial", entityId: id });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save testimonial.");
  }
}

export async function deleteTestimonial(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted testimonial", entityType: "testimonial", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete testimonial.");
  }
}

/* ========================================================================== */
/* Statistics                                                                 */
/* ========================================================================== */

export async function upsertStatistic(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const values = {
      value: String(formData.get("value") || "").trim(),
      label: String(formData.get("label") || "").trim(),
      description: String(formData.get("description") || ""),
      context: String(formData.get("context") || "stats_band") as Statistic["context"],
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
    };
    if (!values.value || !values.label) return { ok: false, error: "Value and label are required." };

    let error;
    if (id) {
      ({ error } = await admin.from("statistics").update(values).eq("id", id));
    } else {
      ({ error } = await admin.from("statistics").insert(values));
    }
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: id ? "Updated statistic" : "Created statistic", entityType: "statistic", entityId: id });
    await publicRevalidate();
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not save statistic.");
  }
}

export async function deleteStatistic(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("statistics").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted statistic", entityType: "statistic", entityId: id });
    await publicRevalidate();
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete statistic.");
  }
}

/* ========================================================================== */
/* Enquiries                                                                  */
/* ========================================================================== */

export async function updateEnquiry(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const patch: Record<string, string> = {};
    const status = formData.get("status");
    const priority = formData.get("priority");
    const notes = formData.get("notes");
    const assigned = formData.get("assigned_to");
    if (status) patch.status = String(status);
    if (priority) patch.priority = String(priority);
    if (notes !== null) patch.notes = String(notes);
    if (assigned !== null) patch.assigned_to = String(assigned);

    const { error } = await admin.from("enquiries").update(patch as unknown as Partial<Enquiry>).eq("id", id);
    if (error) throw error;
    await logActivity({
      adminUserId: profile.id,
      action: "Updated enquiry",
      entityType: "enquiry",
      entityId: id,
      metadata: patch,
    });
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${id}`);
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not update enquiry.");
  }
}

export async function deleteEnquiry(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { error } = await admin.from("enquiries").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted enquiry", entityType: "enquiry", entityId: id });
    revalidatePath("/admin/enquiries");
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete enquiry.");
  }
}

/* ========================================================================== */
/* Media library                                                              */
/* ========================================================================== */

export async function deleteMedia(input: IdLike): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = toId(input);
    const { data: rec } = await admin.from("media_library").select("storage_path").eq("id", id).single();
    if (rec) {
      await admin.storage.from("website-media").remove([rec.storage_path]);
    }
    const { error } = await admin.from("media_library").delete().eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Deleted media", entityType: "media", entityId: id });
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not delete media.");
  }
}

export async function updateMediaAlt(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const alt = String(formData.get("alt_text") || "");
    const { error } = await admin.from("media_library").update({ alt_text: alt }).eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Updated media alt text", entityType: "media", entityId: id });
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update media.");
  }
}

/* ========================================================================== */
/* Admin users (super admin only)                                             */
/* ========================================================================== */

export async function updateAdminUser(formData: FormData): Promise<Result> {
  try {
    const profile = await guard();
    if (profile.role !== "super_admin") {
      return { ok: false, error: "Only super admins can manage users." };
    }
    const admin = createAdminClient();
    const id = String(formData.get("id") || "");
    const patch: Record<string, string | boolean> = {};
    const fullName = formData.get("full_name");
    const role = formData.get("role");
    const isActive = formData.get("is_active");
    if (fullName !== null) patch.full_name = String(fullName);
    if (role !== null && (role === "super_admin" || role === "editor")) patch.role = role;
    if (isActive !== null) patch.is_active = isActive === "on" || isActive === "true";

    const { error } = await admin.from("profiles").update(patch as unknown as Partial<Profile>).eq("id", id);
    if (error) throw error;
    await logActivity({ adminUserId: profile.id, action: "Updated admin user", entityType: "profile", entityId: id, metadata: patch });
    revalidatePath("/admin/users");
    return { ok: true, id };
  } catch (err) {
    return fail(err, "Could not update user.");
  }
}
