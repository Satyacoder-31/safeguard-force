import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminProfile } from "@/lib/supabase/auth";
import { listActivityLogs } from "@/lib/cms/logs";
import { PageHeader, StatusBadge } from "../components/ui";
import { formatTimeAgo } from "@/lib/utils";
import type { Enquiry } from "@/types/database";

export const dynamic = "force-dynamic";

async function getStats() {
  const admin = createAdminClient();
  const [enquiries, services, industries, hero, media, activity] = await Promise.all([
    admin.from("enquiries").select("status, created_at"),
    admin.from("services").select("id", { count: "exact" }),
    admin.from("industries").select("id", { count: "exact" }),
    admin.from("hero_slides").select("id", { count: "exact" }).eq("is_active", true),
    admin.from("media_library").select("id", { count: "exact" }),
    listActivityLogs(8),
  ]);

  const rows = (enquiries.data ?? []) as { status: string }[];
  const count = (s: string) => rows.filter((r) => r.status === s).length;

  return {
    total: rows.length,
    fresh: count("New"),
    inProgress: count("In Progress"),
    converted: count("Converted"),
    services: services.count ?? 0,
    industries: industries.count ?? 0,
    heroActive: hero.count ?? 0,
    media: media.count ?? 0,
    activity: activity.filter((a) => !a.entity_type || a.entity_type !== "enquiry").slice(0, 6),
  };
}

export default async function AdminDashboard() {
  const [profile, stats] = await Promise.all([getAdminProfile(), getStats()]);
  const admin = createAdminClient();
  const { data: recentEnquiries } = await admin
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);
  const recent = (recentEnquiries as Enquiry[]) ?? [];

  const cards = [
    { label: "Total Enquiries", value: stats.total, href: "/admin/enquiries", accent: "bg-[#0A1931]" },
    { label: "New Enquiries", value: stats.fresh, href: "/admin/enquiries?status=New", accent: "bg-blue-600" },
    { label: "In Progress", value: stats.inProgress, href: "/admin/enquiries?status=In%20Progress", accent: "bg-purple-600" },
    { label: "Converted", value: stats.converted, href: "/admin/enquiries?status=Converted", accent: "bg-emerald-600" },
    { label: "Services", value: stats.services, href: "/admin/services", accent: "bg-[#C5A253]" },
    { label: "Industries", value: stats.industries, href: "/admin/industries", accent: "bg-[#C5A253]" },
    { label: "Active Hero Slides", value: stats.heroActive, href: "/admin/hero", accent: "bg-[#C5A253]" },
    { label: "Media Files", value: stats.media, href: "/admin/media", accent: "bg-[#C5A253]" },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${(profile?.full_name || profile?.email || "Admin").split("@")[0]}`}
        subtitle="Website content, media and leads at a glance — all live from Supabase."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white border border-slate-200 p-4 sm:p-5 hover:border-[#C5A253]/50 hover:shadow-md transition group">
            <div className={`w-1.5 h-8 ${c.accent} mb-3`} />
            <div className="text-[#0A1931] font-black text-2xl sm:text-3xl leading-none">{c.value}</div>
            <div className="text-slate-500 text-[11px] sm:text-xs tracking-wider uppercase font-bold mt-2">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-[#0A1931] font-bold text-sm tracking-widest uppercase mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/services" className="bg-[#0A1931] text-white px-4 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-[#132D4F] transition">+ Add Service</Link>
          <Link href="/admin/hero" className="bg-[#0A1931] text-white px-4 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-[#132D4F] transition">+ Add Hero Slide</Link>
          <Link href="/admin/media" className="bg-[#0A1931] text-white px-4 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-[#132D4F] transition">Upload Media</Link>
          <Link href="/admin/enquiries" className="bg-[#0A1931] text-white px-4 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-[#132D4F] transition">View Enquiries</Link>
          <Link href="/admin/settings" className="bg-[#C5A253] text-[#0A1931] px-4 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-[#B8941F] transition">Edit Site Settings</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent enquiries */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-sm text-[#0A1931] tracking-widest uppercase">Recent Enquiries</h2>
              <Link href="/admin/enquiries" className="text-xs text-[#C5A253] font-bold uppercase tracking-wider hover:underline">View All →</Link>
            </div>
            {recent.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No enquiries yet. Submissions from the contact form will appear here.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.map((e) => (
                  <Link key={e.id} href={`/admin/enquiries/${e.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-[#0A1931] truncate">{e.full_name}</div>
                      <div className="text-xs text-slate-400 truncate">{e.phone} • {e.service_required}</div>
                    </div>
                    <StatusBadge status={e.status} />
                    <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{formatTimeAgo(e.created_at)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <div className="bg-white border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-sm text-[#0A1931] tracking-widest uppercase">Recent Activity</h2>
              <Link href="/admin/activity" className="text-xs text-[#C5A253] font-bold uppercase tracking-wider hover:underline">All →</Link>
            </div>
            {stats.activity.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No activity yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.activity.map((a) => (
                  <div key={a.id} className="px-5 py-3">
                    <div className="text-sm text-slate-700">{a.action}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{formatTimeAgo(a.created_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
