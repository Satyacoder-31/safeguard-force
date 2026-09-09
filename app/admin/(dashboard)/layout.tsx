import { redirect } from "next/navigation";
import { getAdminProfile, signOut } from "@/lib/supabase/auth";
import AdminSidebar from "../components/AdminSidebar";

import AdminMobileHeader from "../components/AdminMobileHeader";

export const dynamic = "force-dynamic";

/**
 * Layout for all protected /admin/* pages (route group "(dashboard)").
 * /admin/login lives outside this group and renders its own page.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAdminProfile();
  if (!profile) redirect("/admin/login");

  async function logout() {
    "use server";
    await signOut();
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <AdminSidebar profile={profile} />
      <div className="lg:pl-[260px]">
        <AdminMobileHeader logoutAction={logout} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1280px]">{children}</main>
      </div>
    </div>
  );
}
