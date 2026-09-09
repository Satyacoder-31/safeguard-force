import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import AboutForm from "./AboutForm";
import ValuesManager from "./ValuesManager";
import type { AboutContent, ValueItem } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const admin = createAdminClient();
  const [aboutRes, valuesRes] = await Promise.all([
    admin.from("about_content").select("*").limit(1),
    admin.from("values").select("*").order("sort_order", { ascending: true }),
  ]);
  const about = (aboutRes.data?.[0] as AboutContent) ?? null;
  const values = (valuesRes.data as ValueItem[]) ?? [];

  return (
    <div className="space-y-10">
      <div>
        <PageHeader
          title="About Page"
          subtitle="Who we are, mission / vision / commitment, management approach and SEO."
        />
        <AboutForm about={about} />
      </div>
      <div>
        <PageHeader
          title="Core Values"
          subtitle="Values grid displayed on the About page."
        />
        <ValuesManager values={values} />
      </div>
    </div>
  );
}
