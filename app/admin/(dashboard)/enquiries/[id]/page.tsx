import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader, StatusBadge } from "../../../components/ui";
import EnquiryDetailForm from "./EnquiryDetailForm";
import type { Enquiry } from "@/types/database";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("enquiries").select("*").eq("id", id).maybeSingle();
  const enquiry = data as Enquiry | null;
  if (!enquiry) notFound();

  return (
    <div>
      <PageHeader
        title={enquiry.full_name}
        subtitle={`Received ${formatDate(enquiry.created_at)}`}
        actions={
          <Link href="/admin/enquiries" className="border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600">
            ← Back
          </Link>
        }
      />
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submitted details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={enquiry.status} />
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Priority: {enquiry.priority}</span>
            </div>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ["Full Name", enquiry.full_name],
                ["Phone", enquiry.phone],
                ["Email", enquiry.email],
                ["Company / Society", enquiry.company_name],
                ["Location", enquiry.location],
                ["Property Type", enquiry.property_type],
                ["Service Required", enquiry.service_required],
                ["Assigned To", enquiry.assigned_to],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{k}</dt>
                  <dd className="text-slate-800 mt-0.5 break-words">
                    {k === "Phone" ? <a href={`tel:${v}`} className="text-[#0A1931] underline">{v}</a> : v || "—"}
                  </dd>
                </div>
              ))}
            </dl>
            {enquiry.message && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1.5">Message</div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{enquiry.message}</p>
              </div>
            )}
          </div>

          <EnquiryDetailForm enquiry={enquiry} />
        </div>

        {/* Meta sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Timeline</div>
            <div className="text-sm text-slate-600 space-y-1">
              <div>Created: {formatDate(enquiry.created_at)}</div>
              <div>Last updated: {formatDate(enquiry.updated_at)}</div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Quick Contact</div>
            <div className="space-y-2">
              <a href={`tel:${enquiry.phone}`} className="block bg-[#0A1931] text-white text-center py-2.5 text-xs font-bold uppercase tracking-widest">Call {enquiry.phone}</a>
              <a href={`https://wa.me/${enquiry.phone.replace(/\D/g, "").replace(/^0+/, "91")}?text=Hello%20${encodeURIComponent(enquiry.full_name)}`} target="_blank" rel="noopener noreferrer" className="block bg-[#25D366] text-white text-center py-2.5 text-xs font-bold uppercase tracking-widest">WhatsApp</a>
              {enquiry.email && (
                <a href={`mailto:${enquiry.email}`} className="block border border-slate-200 text-center py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600">Email</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
