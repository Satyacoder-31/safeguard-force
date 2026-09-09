import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminProfile } from "@/lib/supabase/auth";
import { PageHeader } from "../../components/ui";
import UsersManager from "./UsersManager";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const profile = await getAdminProfile();
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("*").order("created_at", { ascending: true });
  const users = (data as Profile[]) ?? [];
  const isSuper = profile?.role === "super_admin";

  return (
    <div>
      <PageHeader
        title="Admin Users"
        subtitle={isSuper ? "Manage administrators and editors." : "View team members. Only super admins can make changes."}
      />
      <UsersManager users={users} isSuper={isSuper} currentUserId={profile?.id ?? ""} />
    </div>
  );
}
