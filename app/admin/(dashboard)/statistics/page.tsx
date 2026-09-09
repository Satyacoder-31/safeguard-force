import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import StatisticsManager from "./StatisticsManager";
import type { Statistic } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminStatisticsPage() {
  const admin = createAdminClient();
  const { data } = await admin.from("statistics").select("*").order("sort_order", { ascending: true });
  const stats = (data as Statistic[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Statistics"
        subtitle="Numbers shown in the hero bar (desktop) and the dark stats band on the homepage."
      />
      <StatisticsManager stats={stats} />
    </div>
  );
}
