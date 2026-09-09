"use client";

import Link from "next/link";
import type { AdminProfile } from "@/lib/supabase/auth";

export default function AdminHeader({
  profile,
  logoutAction,
}: {
  profile: AdminProfile;
  logoutAction: () => Promise<void>;
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between transition">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent("admin:toggle-sidebar"))}
          className="lg:hidden w-9 h-9 border border-slate-200 rounded flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
          aria-label="Toggle navigation menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {/* Brand / title */}
        <div className="flex items-center gap-2">
          <span className="lg:hidden font-black text-sm text-[#0A1931] tracking-wider">SG ADMIN</span>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure Admin Portal</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-semibold">{profile.role.replace("_", " ").toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick jump to live website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#0A1931] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition"
          title="Open public website in a new tab"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="hidden md:inline">View Live Site</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>

        {/* User profile capsule */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0A1931] text-[#C5A253] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
            {(profile.full_name || profile.email).slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden xl:block text-left leading-tight pr-1">
            <div className="text-xs font-bold text-slate-800 truncate max-w-[140px]">
              {profile.full_name || profile.email.split("@")[0]}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{profile.email}</div>
          </div>
        </div>

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition"
            title="Sign out of Admin Console"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
