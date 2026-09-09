"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { NavNode } from "@/types/database";
import type { SiteSettings } from "@/types/database";
import { telHref, whatsappHref } from "@/lib/utils";

export default function Header({
  settings,
  navigation,
}: {
  settings: SiteSettings;
  navigation: NavNode[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);


  return (
    <>
      {/* Top bar - hidden on mobile, visible lg */}
      <div className="hidden lg:block bg-[#070F1F] text-white text-[11px] tracking-[0.18em] uppercase">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A253] animate-pulse" />
              {settings.support_text}
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span>{settings.top_bar_text}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={telHref(settings.primary_phone)} className="flex items-center gap-2 hover:text-[#C5A253] transition min-h-[28px] touch-manipulation">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {settings.primary_phone}
            </a>
            {settings.secondary_phone && (
              <>
                <span className="text-white/30">|</span>
                <a href={telHref(settings.secondary_phone)} className="hover:text-[#C5A253] transition min-h-[28px] flex items-center touch-manipulation">{settings.secondary_phone}</a>
              </>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="hidden xl:inline text-white/50 hover:text-white transition normal-case tracking-normal text-xs ml-2">{settings.email}</a>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "bg-[#0A1931]/95 nav-blur border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" : "bg-[#0A1931] border-white/5"}`}>
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between h-[60px] sm:h-[64px] lg:h-[76px]">
          {/* Logo - always visible, optimized for mobile */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 touch-manipulation" onClick={() => setOpen(false)}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-transparent shrink-0 overflow-hidden">
              <img src={settings.logo_url || "/images/safelogo.png"} alt="SAFE Guard FORCE Logo" className="w-full h-full object-contain" />
            </div>
            <div className="leading-none">
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-white font-black text-[17px] sm:text-[20px] lg:text-[24px] tracking-[0.02em]">SAFE</span>
                <span className="text-[#C5A253] font-black text-[17px] sm:text-[20px] lg:text-[24px] tracking-[0.02em]">GUARD</span>
                <span className="text-white font-black text-[17px] sm:text-[20px] lg:text-[24px] tracking-[0.02em]">FORCE</span>
              </div>
              <div className="text-[#C5A253] text-[7.5px] sm:text-[8.5px] lg:text-[9.5px] tracking-[0.24em] sm:tracking-[0.28em] lg:tracking-[0.32em] uppercase font-bold mt-1">
                {settings.tagline && !settings.tagline.toLowerCase().includes("nationwide") ? settings.tagline : "Your Security. Our Priority."}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navigation.map((item) =>
              item.children.length > 0 ? (
                <div key={item.id} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                  <button className="text-white/80 text-[12.5px] tracking-[0.14em] uppercase font-medium hover:text-white transition flex items-center gap-1.5 min-h-[32px]">
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition ${servicesOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                      <div className="bg-white shadow-2xl min-w-[280px] py-2 border-t-[3px] border-[#C5A253]">
                        {item.children.map((child) => (
                          <Link key={child.id} href={child.href} className="block px-6 py-3 text-[13px] font-medium text-slate-800 hover:bg-slate-50 hover:text-[#0A1931] border-b border-slate-100 last:border-0 transition min-h-[44px] flex items-center">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.id} href={item.href} className="text-white/80 text-[12.5px] tracking-[0.14em] uppercase font-medium hover:text-white transition min-h-[32px] flex items-center">{item.label}</Link>
              ),
            )}
            {settings.brochure_enabled !== false && (
              <a
                href={settings.brochure_url || "/brochure.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 text-[12.5px] tracking-[0.14em] uppercase font-medium hover:text-[#C5A253] transition min-h-[32px] flex items-center"
              >
                Brochure
              </a>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/contact" className="hidden lg:inline-flex bg-[#C5A253] hover:bg-[#B8941F] active:bg-[#A9893A] text-[#0A1931] text-[11px] tracking-[0.14em] uppercase font-bold px-6 py-3.5 transition items-center gap-2 min-h-[44px] touch-manipulation">
              Get Free Consultation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href={telHref(settings.primary_phone)} className="hidden lg:inline-flex w-10 h-10 border border-white/20 items-center justify-center text-white hover:bg-white hover:text-[#0A1931] transition min-h-[40px] min-w-[40px] touch-manipulation" aria-label="Call">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
            {/* Mobile: quick call icon + hamburger */}
            <a href={telHref(settings.primary_phone)} className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 bg-[#C5A253] flex items-center justify-center text-[#0A1931] active:bg-[#B8941F] transition touch-manipulation" aria-label="Call">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex flex-col items-center justify-center gap-1.5 border border-white/20 active:bg-white/10 transition touch-manipulation"
              aria-label="Menu"
              aria-expanded={open}
            >
              <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-[5px]" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-[5px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu - improved */}
        {open && (
          <div className="lg:hidden bg-[#0A1931] border-t border-white/10 max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-64px)] overflow-auto overscroll-contain">
            <div className="px-4 py-4 sm:py-6 space-y-1 pb-6">
              {navigation.map((item) =>
                item.children.length > 0 ? (
                  <div key={item.id} className="py-2 border-b border-white/10">
                    <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)} className="w-full flex items-center justify-between py-3 text-left touch-manipulation min-h-[48px]">
                      <span className="text-[#C5A253] tracking-[0.18em] uppercase text-xs font-bold">{item.label}</span>
                      <span className={`w-7 h-7 border border-white/15 flex items-center justify-center text-white/70 transition ${mobileServicesOpen ? "rotate-180 bg-white/5" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                      </span>
                    </button>
                    {mobileServicesOpen && (
                      <div className="space-y-1 pb-2">
                        {item.children.map((child) => (
                          <Link key={child.id} href={child.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-3 px-3 text-white/85 text-[13px] hover:text-white hover:bg-white/5 active:bg-white/10 transition min-h-[44px] touch-manipulation border-l-2 border-[#C5A253]/50 ml-1">
                            <span className="w-1 h-1 bg-[#C5A253] rounded-full shrink-0" />{child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-3.5 text-white/85 tracking-widest uppercase text-sm border-b border-white/10 min-h-[48px] touch-manipulation">
                    {item.label} <span className="text-white/30">→</span>
                  </Link>
                ),
              )}
              {settings.brochure_enabled !== false && (
                <a
                  href={settings.brochure_url || "/brochure.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3.5 text-[#C5A253] tracking-widest uppercase text-sm border-b border-white/10 min-h-[48px] touch-manipulation font-bold"
                >
                  Download Brochure <span className="text-white/40">📄</span>
                </a>
              )}
              <div className="pt-5 flex flex-col gap-2.5">
                <a href={telHref(settings.primary_phone)} className="bg-[#C5A253] active:bg-[#B8941F] text-[#0A1931] text-center font-bold tracking-widest uppercase text-sm py-4 min-h-[48px] flex items-center justify-center touch-manipulation">Call {settings.primary_phone}</a>
                {settings.secondary_phone && (
                  <a href={telHref(settings.secondary_phone)} className="bg-white text-[#0A1931] text-center font-bold tracking-widest uppercase text-sm py-3.5 min-h-[48px] flex items-center justify-center touch-manipulation">Call {settings.secondary_phone}</a>
                )}
                <a href={whatsappHref(settings.whatsapp_number, settings.whatsapp_message)} target="_blank" rel="noopener noreferrer" className="border border-white/20 text-white text-center font-semibold tracking-widest uppercase text-sm py-4 min-h-[48px] flex items-center justify-center gap-2 active:bg-white/10 touch-manipulation">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.03 2C6.54 2 2.07 6.45 2.07 11.94c0 1.75.46 3.45 1.33 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.78 1.22h.01c5.49 0 9.96-4.46 9.96-9.95 0-2.66-1.04-5.16-2.95-7.05Zm-7.02 15.2h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.26 8.24Zm6.78-6.18c-.37-.19-2.2-1.09-2.54-1.21-.34-.12-.59-.19-.84.19-.25.37-.96 1.21-1.18 1.46-.22.25-.44.28-.81.09-.37-.19-1.57-.58-2.99-1.84-1.1-.98-1.85-2.2-2.06-2.57-.22-.37-.02-.57.16-.76.16-.16.37-.44.56-.66.19-.22.25-.37.37-.62.12-.25.06-.47-.03-.66-.09-.19-.84-2.02-1.15-2.77-.3-.73-.61-.63-.84-.64l-.72-.01c-.25 0-.66.09-1 .47-.34.37-1.31 1.28-1.31 3.12s1.34 3.62 1.53 3.87c.19.25 2.64 4.03 6.4 5.65.89.39 1.59.62 2.13.79.9.29 1.71.25 2.36.15.72-.11 2.2-.9 2.51-1.77.31-.87.31-1.62.22-1.77-.09-.15-.34-.25-.71-.44Z"/></svg>
                  WhatsApp Us
                </a>
              </div>
              <div className="pt-4 text-center text-white/35 text-[11px] leading-relaxed px-4">{settings.support_text} • Trained Personnel • Customized Solutions<br />{settings.address_line_1}, {settings.city}</div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
