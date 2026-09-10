import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import HomepageSectionsManager from "./HomepageSectionsManager";
import { getServices } from "@/lib/cms/queries";
import type { HomepageSection } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const admin = createAdminClient();
  const [{ data }, services] = await Promise.all([
    admin
      .from("homepage_sections")
      .select("*")
      .order("sort_order", { ascending: true }),
    getServices(false).catch(() => []),
  ]);
  const sections = (data as HomepageSection[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Homepage Sections"
        subtitle="Edit copy, images, core services, and buttons per section — or hide sections entirely."
      />
      <HomepageSectionsManager sections={sections} services={services} />
    </div>
  );
}

