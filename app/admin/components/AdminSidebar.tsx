"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminProfile } from "@/lib/supabase/auth";

const NAV = [
  { section: null, items: [{ label: "Dashboard", href: "/admin", icon: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" }] },
  {
    section: "Website",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
      { label: "Brochure", href: "/admin/brochure", icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      { label: "Navigation", href: "/admin/navigation", icon: "M4 6h16M4 12h16M4 18h7" },
      { label: "Homepage", href: "/admin/homepage", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
      { label: "Hero Slides", href: "/admin/hero", icon: "M7 4v16M17 4v16M3 8l4-4 4 4M13 16l4 4 4-4" },
      { label: "About", href: "/admin/about", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
      { label: "Services", href: "/admin/services", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
      { label: "Industries", href: "/admin/industries", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
      { label: "Contact Page", href: "/admin/contact", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
      { label: "Testimonials", href: "/admin/testimonials", icon: "M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM7 17l-1 4 4-2" },
      { label: "Statistics", href: "/admin/statistics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
      { label: "Media Library", href: "/admin/media", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ],
  },
  {
    section: "Leads",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Admin Users", href: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
      { label: "Activity Logs", href: "/admin/activity", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    ],
  },
];

export default function AdminSidebar({ profile }: { profile: AdminProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    document.addEventListener("admin:toggle-sidebar", handler);
    return () => document.removeEventListener("admin:toggle-sidebar", handler);
  }, []);

  useEffect(() => {
    // close mobile drawer on navigation (deferred to avoid cascading render)
    const id = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  async function logout() {
    const { createClient } = await import("@/lib/supabase/browser");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex flex-col h-full bg-[#0A1931] text-white">
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/images/safelogo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <div className="leading-tight">
            <div className="font-black tracking-widest text-sm text-white">SG ADMIN</div>
            <div className="text-[#C5A253] text-[9px] tracking-[0.22em] uppercase font-bold">Control Portal</div>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open live website in a new tab"
          className="text-white/60 hover:text-[#C5A253] p-1.5 rounded hover:bg-white/5 transition flex items-center gap-1 text-[11px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV.map((group, gi) => (
          <div key={group.section ?? `g${gi}`}>
            {group.section && (
              <div className="text-white/35 text-[10px] tracking-[0.22em] uppercase font-bold px-3 mb-2">{group.section}</div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-sm transition min-h-[44px] ${
                      active
                        ? "bg-[#C5A253] text-[#0A1931] font-bold"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d={item.icon} /></svg>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C5A253] text-[#0A1931] flex items-center justify-center font-black text-xs shrink-0">
            {(profile.full_name || profile.email).slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate">{profile.full_name || profile.email}</div>
            <div className="text-[10px] text-[#C5A253] uppercase tracking-widest">{profile.role.replace("_", " ")}</div>
          </div>
          <button onClick={logout} title="Logout" className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] z-40">{sidebar}</aside>
      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
          <aside className="relative w-[280px] max-w-[85vw] h-full shadow-2xl">
            {sidebar}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3.5 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
