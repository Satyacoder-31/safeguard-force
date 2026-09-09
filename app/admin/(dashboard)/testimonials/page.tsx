import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader, EmptyState } from "../../components/ui";
import TestimonialsManager from "./TestimonialsManager";
import type { Testimonial } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const admin = createAdminClient();
  const { data } = await admin.from("testimonials").select("*").order("sort_order", { ascending: true });
  const testimonials = (data as Testimonial[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Testimonials"
        subtitle="Client testimonials ready to display anywhere on the website."
      />
      {testimonials.length === 0 ? (
        <EmptyState title="No testimonials yet" hint="Add your first client testimonial below." />
      ) : null}
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
