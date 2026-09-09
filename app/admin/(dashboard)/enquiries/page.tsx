import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import EnquiriesTable from "./EnquiriesTable";
import type { Enquiry, EnquiryPriority, EnquiryStatus } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; priority?: string; service?: string }>;
}) {
  const params = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (params.status) query = query.eq("status", params.status as EnquiryStatus);
  if (params.priority) query = query.eq("priority", params.priority as EnquiryPriority);
  if (params.service) query = query.eq("service_required", params.service);

  const { data } = await query;
  let enquiries = (data as Enquiry[]) ?? [];

  // Simple in-memory search across name/phone/email/company (fine at inbox scale)
  if (params.q) {
    const q = params.q.toLowerCase();
    enquiries = enquiries.filter((e) =>
      [e.full_name, e.phone, e.email, e.company_name, e.location, e.service_required]
        .some((f) => f?.toLowerCase().includes(q)),
    );
  }

  // Distinct services for filter dropdown
  const allServices = [
    ...new Set(
      (((await admin.from("enquiries").select("service_required")).data ?? []) as { service_required: string }[]).map(
        (r) => r.service_required,
      ),
    ),
  ].sort();

  return (
    <div>
      <PageHeader
        title="Enquiries"
        subtitle={`${enquiries.length} enquiry${enquiries.length === 1 ? "" : "ies"} shown — submitted via the website contact form.`}
      />
      <EnquiriesTable enquiries={enquiries} services={allServices} filters={params} />
    </div>
  );
}
