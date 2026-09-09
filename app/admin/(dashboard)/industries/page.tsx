import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import IndustriesManager from "./IndustriesManager";
import type { Industry } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminIndustriesPage() {
  const admin = createAdminClient();
  const { data } = await admin.from("industries").select("*").order("sort_order", { ascending: true });
  const industries = (data as Industry[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Industries"
        subtitle="Industry grid on the homepage and the Industries page."
      />
      <IndustriesManager industries={industries} />
    </div>
  );
}
