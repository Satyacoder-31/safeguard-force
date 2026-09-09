import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActivityLog } from "@/types/database";

/** Record an admin action to the activity_logs audit table. Never throws. */
export async function logActivity(params: {
  adminUserId: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const admin = createAdminClient();
    await admin.from("activity_logs").insert({
      admin_user_id: params.adminUserId,
      action: params.action,
      entity_type: params.entityType ?? "",
      entity_id: params.entityId ?? "",
      metadata: params.metadata ?? {},
    });
  } catch (err) {
    console.error("[activity-log] failed to record:", err);
  }
}

export async function listActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as ActivityLog[]) ?? [];
}
