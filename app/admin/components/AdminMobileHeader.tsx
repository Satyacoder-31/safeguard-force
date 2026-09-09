"use client";

export default function AdminMobileHeader({ logoutAction }: { logoutAction: () => Promise<void> }) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#0A1931] text-white flex items-center justify-between px-4 h-14">
      <button
        onClick={() => document.dispatchEvent(new CustomEvent("admin:toggle-sidebar"))}
        className="w-10 h-10 border border-white/20 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <span className="font-black tracking-widest text-sm">SG ADMIN</span>
      <form action={logoutAction}>
        <button className="text-xs text-white/70 hover:text-white px-2">Logout</button>
      </form>
    </div>
  );
}
