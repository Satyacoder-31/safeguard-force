import "server-only";
import { createAdminClient } from "./admin";
import type { Profile } from "@/types/database";

export type AdminProfile = Pick<Profile, "id" | "email" | "full_name" | "role" | "is_active">;

/**
 * Verify the caller is an authenticated, active admin and return their
 * profile. Uses the service-role client to read profiles (RLS-safe: the
 * profiles table is only readable by self/super_admin otherwise).
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const { createClient } = await import("./server");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");

  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (error || !profile || !profile.is_active || !["super_admin", "admin", "editor"].includes(profile.role)) {
    throw new Error("FORBIDDEN");
  }
  return profile as AdminProfile;
}

/** Non-throwing variant for UI display. */
export async function getAdminProfile(): Promise<AdminProfile | null> {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}

export async function signOut() {
  const { createClient } = await import("./server");
  const supabase = await createClient();
  await supabase.auth.signOut();
}
