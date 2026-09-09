import type { MetadataRoute } from "next";
import { getServices } from "@/lib/cms/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://safeguardforce.in";
  const services = await getServices().catch(() => []);

  const staticRoutes = ["", "/about", "/contact", "/industries"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const legacyServiceRoutes = [
    "security-services",
    "facility-management",
    "housekeeping",
    "fire-safety",
    "technical-maintenance",
    "detective-services",
  ].map((p) => ({
    url: `${base}/${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(s.updated_at || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...legacyServiceRoutes, ...serviceRoutes];
}
