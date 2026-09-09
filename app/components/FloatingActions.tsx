"use client";

import type { SiteSettings } from "@/types/database";
import { telHref, whatsappHref } from "@/lib/utils";

export default function FloatingActions({ settings }: { settings: SiteSettings }) {
  const waLink = whatsappHref(settings.whatsapp_number, settings.whatsapp_message);

  return (
    <>
      {/* Desktop floating WhatsApp + Call */}
      <div className="hidden lg:flex fixed right-5 bottom-6 z-50 flex-col gap-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-14 h-14 bg-[#25D366] rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition touch-manipulation"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.03 2C6.54 2 2.07 6.45 2.07 11.94c0 1.75.46 3.45 1.33 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.78 1.22h.01c5.49 0 9.96-4.46 9.96-9.95 0-2.66-1.04-5.16-2.95-7.05Zm-7.02 15.2h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.26 8.24Zm6.78-6.18c-.37-.19-2.2-1.09-2.54-1.21-.34-.12-.59-.19-.84.19-.25.37-.96 1.21-1.18 1.46-.22.25-.44.28-.81.09-.37-.19-1.57-.58-2.99-1.84-1.1-.98-1.85-2.2-2.06-2.57-.22-.37-.02-.57.16-.76.16-.16.37-.44.56-.66.19-.22.25-.37.37-.62.12-.25.06-.47-.03-.66-.09-.19-.84-2.02-1.15-2.77-.3-.73-.61-.63-.84-.64l-.72-.01c-.25 0-.66.09-1 .47-.34.37-1.31 1.28-1.31 3.12s1.34 3.62 1.53 3.87c.19.25 2.64 4.03 6.4 5.65.89.39 1.59.62 2.13.79.9.29 1.71.25 2.36.15.72-.11 2.2-.9 2.51-1.77.31-.87.31-1.62.22-1.77-.09-.15-.34-.25-.71-.44Z"/></svg>
        </a>
        <a
          href={telHref(settings.primary_phone)}
          aria-label="Call"
          className="w-14 h-14 bg-[#C5A253] rounded-full shadow-[0_8px_24px_rgba(197,162,83,0.4)] flex items-center justify-center text-[#0A1931] hover:scale-105 active:scale-95 transition touch-manipulation"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </a>
      </div>

      {/* Mobile sticky bottom bar - safe-area aware, 48px+ touch targets */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex pb-[env(safe-area-inset-bottom)]">
        <a href={telHref(settings.primary_phone)} className="flex-1 bg-[#0A1931] text-white flex items-center justify-center gap-1.5 py-3.5 min-h-[52px] text-[11px] tracking-[0.08em] sm:tracking-[0.12em] uppercase font-bold active:bg-[#132D4F] touch-manipulation">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Call
        </a>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white flex items-center justify-center gap-1.5 py-3.5 min-h-[52px] text-[11px] tracking-[0.08em] sm:tracking-[0.12em] uppercase font-bold active:bg-[#128C7E] touch-manipulation">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.03 2C6.54 2 2.07 6.45 2.07 11.94c0 1.75.46 3.45 1.33 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.78 1.22h.01c5.49 0 9.96-4.46 9.96-9.95 0-2.66-1.04-5.16-2.95-7.05Zm-7.02 15.2h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.26 8.24Zm6.78-6.18c-.37-.19-2.2-1.09-2.54-1.21-.34-.12-.59-.19-.84.19-.25.37-.96 1.21-1.18 1.46-.22.25-.44.28-.81.09-.37-.19-1.57-.58-2.99-1.84-1.1-.98-1.85-2.2-2.06-2.57-.22-.37-.02-.57.16-.76.16-.16.37-.44.56-.66.19-.22.25-.37.37-.62.12-.25.06-.47-.03-.66-.09-.19-.84-2.02-1.15-2.77-.3-.73-.61-.63-.84-.64l-.72-.01c-.25 0-.66.09-1 .47-.34.37-1.31 1.28-1.31 3.12s1.34 3.62 1.53 3.87c.19.25 2.64 4.03 6.4 5.65.89.39 1.59.62 2.13.79.9.29 1.71.25 2.36.15.72-.11 2.2-.9 2.51-1.77.31-.87.31-1.62.22-1.77-.09-.15-.34-.25-.71-.44Z"/></svg>
          WhatsApp
        </a>
        <a href="/contact" className="flex-1 bg-[#C5A253] text-[#0A1931] flex items-center justify-center gap-1.5 py-3.5 min-h-[52px] text-[11px] tracking-[0.08em] sm:tracking-[0.12em] uppercase font-bold active:bg-[#B8941F] touch-manipulation">
          Get Quote
        </a>
      </div>
    </>
  );
}
