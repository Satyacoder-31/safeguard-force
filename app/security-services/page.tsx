import ServicePage from "../services/[slug]/page";

/**
 * Legacy URL compatibility: /security-services renders the CMS-driven
 * service page for the "security-services" record. All original URLs are
 * preserved — the content now comes from Supabase.
 */
export const revalidate = 300;

export async function generateMetadata() {
  const mod = await import("../services/[slug]/page");
  return mod.generateMetadata({ params: Promise.resolve({ slug: "security-services" }) });
}

export default async function Page() {
  const mod = await import("../services/[slug]/page");
  return mod.default({ params: Promise.resolve({ slug: "security-services" }) });
}
