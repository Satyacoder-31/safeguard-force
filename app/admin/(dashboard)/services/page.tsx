import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import ServicesManager from "./ServicesManager";
import type { Service, ServiceItem } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const admin = createAdminClient();
  const [servicesRes, itemsRes] = await Promise.all([
    admin.from("services").select("*").order("sort_order", { ascending: true }),
    admin.from("service_items").select("*").order("sort_order", { ascending: true }),
  ]);
  const services = (servicesRes.data as Service[]) ?? [];
  const items = (itemsRes.data as ServiceItem[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="The 12 service categories powering the homepage grid, navigation, footer and service pages."
      />
      <ServicesManager services={services} items={items} />
    </div>
  );
}
