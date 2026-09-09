import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import HomepageSectionsManager from "./HomepageSectionsManager";
import type { HomepageSection } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  const sections = (data as HomepageSection[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Homepage Sections"
        subtitle="Edit copy, images and buttons per section — or hide sections entirely."
      />
      <HomepageSectionsManager sections={sections} />
    </div>
  );
}
