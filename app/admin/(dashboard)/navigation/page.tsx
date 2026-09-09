import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader, EmptyState } from "../../components/ui";
import NavigationManager from "./NavigationManager";
import type { NavigationItem } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("navigation_items")
    .select("*")
    .order("sort_order", { ascending: true });
  const items = (data as NavigationItem[]) ?? [];
  const tops = items.filter((i) => !i.parent_id);
  const children = items.filter((i) => i.parent_id);

  return (
    <div>
      <PageHeader
        title="Navigation"
        subtitle="Header menu and Services dropdown — driven entirely from here."
      />
      {items.length === 0 ? (
        <EmptyState title="No navigation items" hint="Add your first menu item below." />
      ) : (
        <NavigationManager items={items} tops={tops} childrenItems={children} />
      )}
    </div>
  );
}
