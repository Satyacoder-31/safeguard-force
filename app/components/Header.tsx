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
      <div className="hidden lg:block bg-[#070F1F] text-white text-[11px] tracking-[0.18em] uppercase border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
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
              <a href={`mailto:${settings.email}`} className="hidden xl:inline text-white/70 hover:text-white transition normal-case tracking-normal text-xs ml-1">{settings.email}</a>
            )}
            <span className="text-white/30 ml-1">|</span>
            <div className="flex items-center gap-2.5 ml-1">
              {settings.whatsapp_number && (
                <a href={whatsappHref(settings.whatsapp_number, settings.whatsapp_message)} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:opacity-80 transition" title="WhatsApp (7977179807)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#C5A253] transition" title="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" /></svg>
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#C5A253] transition" title="LinkedIn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "bg-[#0A1931]/95 nav-blur border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" : "bg-[#0A1931] border-white/5"}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[64px] sm:h-[70px] lg:h-[80px]">
          {/* Logo - always visible, optimized for mobile */}
          <Link href="/" className="flex items-center gap-3 sm:gap-3.5 shrink-0 touch-manipulation group" onClick={() => setOpen(false)}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-transparent shrink-0 overflow-hidden flex items-center justify-center">
              <img src={settings.logo_url || "/images/safelogo.png"} alt="SAFE Guard FORCE Logo" className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
            </div>
            <div className="leading-none">
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-white font-black text-[18px] sm:text-[20px] lg:text-[24px] tracking-[0.02em]">SAFE</span>
                <span className="text-[#C5A253] font-black text-[18px] sm:text-[20px] lg:text-[24px] tracking-[0.02em]">GUARD</span>
                <span className="text-white font-black text-[18px] sm:text-[20px] lg:text-[24px] tracking-[0.02em]">FORCE</span>
              </div>
              <div className="text-[#C5A253] text-[7.5px] sm:text-[8.5px] lg:text-[9.5px] tracking-[0.24em] sm:tracking-[0.28em] lg:tracking-[0.32em] uppercase font-bold mt-1">
                {settings.tagline && !settings.tagline.toLowerCase().includes("nationwide") ? settings.tagline : "Your Security. Our Priority."}
              </div>
            </div>
          </Link>

          {/* Desktop nav - clean balanced spacing */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7 mx-4 xl:mx-8">
            {navigation.map((item) =>
              item.children.length > 0 ? (
                <div key={item.id} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                  <button className="text-white/85 text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-semibold hover:text-[#C5A253] transition flex items-center gap-1.5 py-2">
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 ${servicesOpen ? "rotate-180 text-[#C5A253]" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                      <div className="bg-[#0A1931]/98 backdrop-blur-xl shadow-2xl min-w-[300px] py-2 border border-white/10 border-t-[3px] border-t-[#C5A253] rounded-b-sm">
                        {item.children.map((child) => (
                          <Link key={child.id} href={child.href} className="block px-6 py-3.5 text-[13px] font-medium text-white/85 hover:bg-white/5 hover:text-[#C5A253] border-b border-white/5 last:border-0 transition min-h-[44px] flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#C5A253]/60 shrink-0" />
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.id} href={item.href} className="text-white/85 text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-semibold hover:text-[#C5A253] transition py-2 flex items-center">
                  {item.label}
                </Link>
              ),
            )}

            {/* Brochure - with PDF badge and icon */}
            {settings.brochure_enabled !== false && (
              <Link
                href="/brochure"
                className="text-white/85 hover:text-[#C5A253] text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-semibold transition py-1.5 px-2.5 rounded-sm hover:bg-white/5 flex items-center gap-1.5"
                title="View SAFE Guard FORCE Corporate Brochure"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C5A253] shrink-0">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 0 1-2 2z" />
                </svg>
                <span>Brochure</span>
                <span className="text-[9px] bg-[#C5A253]/20 text-[#C5A253] border border-[#C5A253]/40 px-1.5 py-0.5 rounded font-black tracking-wider leading-none">PDF</span>
              </Link>
            )}
          </nav>

          {/* Right actions: Optimized Get Free Consultation CTA + Call Icon */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C5A253] via-[#d6b566] to-[#C5A253] hover:brightness-105 active:scale-[0.98] text-[#0A1931] text-[11px] xl:text-[12px] tracking-[0.15em] uppercase font-black px-5 xl:px-6 py-3 xl:py-3.5 rounded-sm shadow-md shadow-[#C5A253]/15 hover:shadow-lg hover:shadow-[#C5A253]/25 transition-all duration-300 group touch-manipulation shrink-0"
            >
              <span>Get Free Consultation</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="transition-transform duration-200 group-hover:translate-x-1 shrink-0"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <a
              href={telHref(settings.primary_phone)}
              className="hidden lg:inline-flex w-10 h-10 xl:w-11 xl:h-11 rounded-sm border border-white/20 items-center justify-center text-white hover:text-[#0A1931] hover:bg-[#C5A253] hover:border-[#C5A253] transition-all duration-200 shrink-0 touch-manipulation shadow-sm"
              aria-label={`Call ${settings.primary_phone}`}
              title={`Call 24/7: ${settings.primary_phone}`}
            >
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
                <Link
                  href="/brochure"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3.5 text-[#C5A253] tracking-widest uppercase text-sm border-b border-white/10 min-h-[48px] touch-manipulation font-bold"
                >
                  Corporate Brochure <span className="text-white/40">📄</span>
                </Link>
              )}
              <div className="pt-5 flex flex-col gap-2.5">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="bg-gradient-to-r from-[#C5A253] via-[#d6b566] to-[#C5A253] text-[#0A1931] text-center font-black tracking-widest uppercase text-xs py-3.5 min-h-[44px] flex items-center justify-center gap-2 touch-manipulation shadow-md"
                >
                  <span>Get Free Consultation</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
                <a href={telHref(settings.primary_phone)} className="bg-white/10 text-white hover:bg-white/15 border border-white/20 text-center font-bold tracking-widest uppercase text-xs py-3.5 min-h-[44px] flex items-center justify-center touch-manipulation">Call {settings.primary_phone}</a>
                {settings.secondary_phone && (
                  <a href={telHref(settings.secondary_phone)} className="bg-white text-[#0A1931] text-center font-bold tracking-widest uppercase text-xs py-3.5 min-h-[44px] flex items-center justify-center touch-manipulation">Call {settings.secondary_phone}</a>
                )}
                <a href={whatsappHref(settings.whatsapp_number, settings.whatsapp_message)} target="_blank" rel="noopener noreferrer" className="border border-[#25D366]/40 text-[#25D366] bg-[#25D366]/10 text-center font-semibold tracking-widest uppercase text-xs py-3.5 min-h-[44px] flex items-center justify-center gap-2 active:bg-[#25D366]/20 touch-manipulation">
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
