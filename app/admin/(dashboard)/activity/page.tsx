import { getAdminProfile } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader, EmptyState } from "../../components/ui";
import { formatDate } from "@/lib/utils";
import type { ActivityLog } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const profile = await getAdminProfile();
  const admin = createAdminClient();
  const { data } = await admin
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(150);
  const logs = (data as ActivityLog[]) ?? [];

  // Map admin ids to names for display
  const { data: profiles } = await admin.from("profiles").select("id, full_name, email");
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name || p.email]));

  return (
    <div>
      <PageHeader title="Activity Logs" subtitle="Audit trail of content, settings, media and enquiry changes." />
      {logs.length === 0 ? (
        <EmptyState title="No activity recorded yet" hint="Actions taken in the admin panel will appear here." />
      ) : (
        <div className="bg-white border border-slate-200 divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-slate-800 font-medium">{log.action}</div>
                <div className="text-xs text-slate-400">
                  {log.entity_type && <span className="uppercase tracking-wider font-bold text-slate-400">{log.entity_type}</span>}
                  {log.admin_user_id && <span> · {nameById.get(log.admin_user_id) ?? "unknown admin"}</span>}
                </div>
              </div>
              <div className="text-xs text-slate-400 shrink-0">{formatDate(log.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
