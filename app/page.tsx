import Link from "next/link";
import HeroSlideshow from "./components/HeroSlideshow";
import { getSiteSettings, getNavigation, getHeroSlides, getStatistics, getServices, getIndustries, getHomepageSections } from "@/lib/cms/queries";
import { telHref } from "@/lib/utils";
import type { SiteSettings, Statistic } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings.site_name} | Integrated Security & Facility Management Mumbai`,
    description:
      "Integrated security, facility management, housekeeping, technical maintenance, STP operations & investigation solutions for residential, commercial and institutional environments. Mumbai • Nationwide Capability.",
  };
}

function Icon({ name }: { name: string }) {
  const cls = "w-5 h-5";
  const map: Record<string, React.ReactNode> = {
    shield: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2l7 4v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-4z"/><path d="M9 12l2 2 4-4"/></svg>,
    building: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21V9h6v12"/><path d="M9 13h6M9 17h6"/></svg>,
    sparkles: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/><path d="M19 11l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/><path d="M5 15l1 1.5L7.5 17l-1.5 1-1 1.5-1-1.5L2.5 17l1.5-.5L5 15z"/></svg>,
    leaf: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
    flame: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2c0 3-3 5-3 8a3 3 0 0 0 6 0c0-3-3-5-3-8z"/><path d="M9 13a3 3 0 0 0 6 0c0-1.5-1-2.5-1-3"/><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.5-2.5-4.5"/></svg>,
    paw: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3H7v-2a7 7 0 0 1 2-5z"/></svg>,
    users: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    wrench: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    bug: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 8V4"/><path d="M8 12H4"/><path d="M16 12h4"/><path d="M12 16v4"/><rect x="8" y="8" width="8" height="8" rx="4"/><path d="M8 8l-2-2M16 8l2-2M8 16l-2 2M16 16l2 2"/></svg>,
    headset: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 11a9 9 0 1 0 18 0"/><path d="M5 11v4a2 2 0 0 0 2 2h1"/><path d="M17 15h1a2 2 0 0 0 2-2v-4"/><path d="M9 18a3 3 0 0 0 6 0"/></svg>,
    search: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/><path d="M8 11h6"/></svg>,
    droplet: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2l7 7c0 5-3.5 9-7 11-3.5-2-7-6-7-11l7-7z"/><path d="M9 14a3 3 0 1 0 6 0"/></svg>,
  };
  return map[name] || null;
}

function statsByContext(stats: Statistic[], context: Statistic["context"]) {
  return stats.filter((s) => s.context === context);
}

export default async function HomePage() {
  const [settings, heroSlides, allStats, services, industries, sections] =
    await Promise.all([
      getSiteSettings(),
      getHeroSlides(),
      getStatistics(),
      getServices(),
      getIndustries(),
      getHomepageSections(),
    ]);

  const section = (key: string) => sections.find((s) => s.section_key === key);
  const visible = (key: string) => {
    const s = section(key);
    return s ? s.is_visible !== false : true;
  };

  const trust = section("trust_intro");
  const servicesSec = section("services");
  const whySec = section("why_choose_us");
  const processSec = section("process");
  const industriesSec = section("industries");
  const personnelSec = section("personnel");
  const ctaSec = section("final_cta");

  const featuredServices = services.filter((s) => s.is_featured);
  const featuredIndustries = industries.filter((i) => i.is_featured);
  const trustStats = statsByContext(allStats, "trust");
  const bandStats = statsByContext(allStats, "stats_band");
  const heroBarStats = statsByContext(allStats, "hero_bar");

  return (
    <>
      <HeroSlideshow slides={heroSlides} heroBarStats={heroBarStats} settings={settings} />

      {/* Corporate Motto & Brochure Banner */}
      <section className="bg-[#070F1F] border-y border-white/10 text-white py-4 sm:py-5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A253] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div className="text-[#C5A253] text-[9.5px] sm:text-[10.5px] tracking-[0.24em] sm:tracking-[0.28em] uppercase font-bold">
                SAFE GUARD FORCE CORPORATE MOTTO
              </div>
              <div className="text-white font-black text-base sm:text-xl lg:text-2xl tracking-tight mt-0.5">
                &ldquo;{settings.tagline || "Your Security. Our Priority."}&rdquo;
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap justify-center">
            <div className="border border-white/15 bg-white/5 px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs tracking-wider uppercase font-bold text-white/90">
              <strong className="text-[#C5A253]">20+</strong> YEARS EXP
            </div>
            <div className="border border-white/15 bg-white/5 px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs tracking-wider uppercase font-bold text-white/90">
              <strong className="text-[#C5A253]">PASARA</strong> LIC. 293
            </div>
            {settings.brochure_enabled !== false && (
              <Link
                href="/brochure"
                className="bg-[#C5A253] hover:bg-[#B8941F] active:bg-[#A9893A] text-[#0A1931] px-5 sm:px-6 py-2.5 sm:py-2 text-[11px] sm:text-xs tracking-[0.14em] uppercase font-black transition inline-flex items-center gap-2 shadow-md min-h-[38px]"
              >
                <span>📄</span> VIEW BROCHURE →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Corporate Brochure Showcase Section */}
      {(() => {
        const brochureSec = section("brochure");
        const isVisible = brochureSec ? brochureSec.is_visible : (settings.brochure_enabled !== false);
        if (!isVisible) return null;

        const effectiveTitle = brochureSec?.title || settings.brochure_title || "SAFE Guard FORCE Corporate Brochure";
        const effectiveEyebrow = brochureSec?.eyebrow || "Official Company Document";
        const effectiveDesc = brochureSec?.subtitle || brochureSec?.description || "Explore our official 13-page corporate profile covering our 20+ years track record, leadership foreword by Founder & Director Mr. Shashikant Shukla, 30-day training methodologies in Karjat & Gorakhpur, statutory compliance (PASARA License No. 293), and valued client portfolio.";
        const effectiveBtnText = brochureSec?.button_text || "View Corporate Profile (13 Pages) →";
        const effectivePdf = brochureSec?.button_url || settings.brochure_url || "/brochure.pdf";
        const highlightItems = (brochureSec?.items && brochureSec.items.length > 0 ? brochureSec.items : [
          { a: "20+ Years", b: "Industry Experience" },
          { a: "PASARA #293", b: "Maharashtra Police Reg." },
          { a: "2 Centres", b: "Karjat & Gorakhpur Training" },
          { a: "Full Audit", b: "PF, ESIC, GST & PT Compliant" },
        ]) as Array<{ a?: string; b?: string; title?: string; subtitle?: string; n?: string; d?: string }>;

        return (
          <section className="py-12 lg:py-16 bg-[#070F1F] text-white border-b border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C5A253]/15 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-[#C5A253] text-[10.5px] sm:text-[11px] tracking-[0.2em] uppercase font-bold">
                  <span className="w-8 h-px bg-[#C5A253]" /> {effectiveEyebrow}
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {effectiveTitle}
                </h2>
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed max-w-[620px]">
                  {effectiveDesc}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href="/brochure"
                    className="bg-[#C5A253] hover:bg-[#D4AF37] text-[#070F1F] px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-black transition shadow-lg inline-flex items-center gap-2"
                  >
                    <span>📄</span> {effectiveBtnText}
                  </Link>
                  {effectivePdf && (
                    <a
                      href={effectivePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="SAFE_GUARD_FORCE_Corporate_Brochure.pdf"
                      className="border border-white/30 hover:bg-white hover:text-[#070F1F] text-white px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-bold transition inline-flex items-center gap-2"
                    >
                      <span>📥</span> Download PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-white/5 border border-white/15 p-6 rounded-sm space-y-4 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <img src={settings.logo_url || "/images/safelogo.png"} alt="Logo" className="w-12 h-12 object-contain" />
                    <div>
                      <div className="text-xs font-black text-white tracking-wider">SAFE GUARD FORCE</div>
                      <div className="text-[#C5A253] text-[10px] uppercase font-bold">13-Page Corporate Profile</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                    {highlightItems.map((item, idx) => (
                      <div key={idx} className="bg-white/5 p-2.5 rounded border border-white/5">
                        <strong className="text-[#C5A253] block text-sm font-black">{item.a || item.title || item.n}</strong>
                        {item.b || item.subtitle || item.d}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 text-center">
                    <Link href="/brochure" className="text-xs text-[#C5A253] font-bold hover:underline">
                      Click to read full 13-page profile online →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Trust intro */}
      {visible("trust_intro") && trust && (
      <section className="py-10 sm:py-12 lg:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[#C5A253] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.20em] uppercase font-bold mb-3 sm:mb-4">
              <span className="w-6 sm:w-8 h-px bg-[#C5A253]" /> {trust.eyebrow}
            </div>
            <h2 className="text-[#0A1931] font-black text-[28px] sm:text-[32px] lg:text-[44px] leading-[0.92] sm:leading-[0.95] tracking-[-0.02em] whitespace-pre-line">
              {trust.title}
            </h2>
            <p className="text-slate-600 text-[14px] sm:text-[15px] leading-relaxed mt-4 sm:mt-6">
              {trust.subtitle}
            </p>
            <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed mt-3 sm:mt-4">
              {trust.description}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
              {(trustStats.length > 0
                ? trustStats.map((s) => [s.value, s.label])
                : [["24/7", "Support"], ["Pan-India", "Presence"], ["One-Roof", "Solutions"]]
              ).map(([a, b]) => (
                <div key={a} className="border border-slate-200 px-2 sm:px-4 py-3 sm:py-4 text-center">
                  <div className="text-[#0A1931] font-black text-xs sm:text-sm">{a}</div>
                  <div className="text-slate-500 text-[10px] sm:text-xs tracking-widest uppercase font-semibold">{b}</div>
                </div>
              ))}
            </div>
            {trust.button_text && (
              <Link href={trust.button_url || "/about"} className="inline-flex mt-6 sm:mt-8 border border-[#0A1931] text-[#0A1931] hover:bg-[#0A1931] hover:text-white active:bg-[#0A1931] active:text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs tracking-[0.16em] uppercase font-bold transition min-h-[44px] items-center touch-manipulation">
                {trust.button_text}
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="relative overflow-hidden border border-slate-200">
              <img src={trust.image_url || "/images/hero-mumbai-security.png"} alt="SAFE Guard FORCE personnel in ceremonial uniform" className="w-full h-[380px] sm:h-[440px] lg:h-[520px] object-cover object-top" />
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-transparent">
                <img src={settings.logo_url || "/images/safelogo.png"} alt="Badge" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
              </div>
              <a
                href={settings.google_maps_url || "https://maps.google.com/?q=C+517+Kailash+Esplanade+Ghatkopar+West+Mumbai"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-0 left-0 right-0 bg-[#0A1931] hover:bg-[#0E2242] transition p-4 sm:p-6 flex items-center justify-between gap-2 group cursor-pointer"
                title="Open Google Maps Directions"
              >
                <div className="min-w-0">
                  <div className="text-[#C5A253] text-[10px] sm:text-xs tracking-widest uppercase font-bold">Trained &amp; Verified Personnel</div>
                  <div className="text-white text-xs sm:text-sm mt-1 leading-tight group-hover:underline flex items-center gap-1.5">
                    <span>📍</span> {settings.address_line_1} • {settings.city}
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 group-hover:border-[#C5A253] group-hover:bg-[#C5A253] group-hover:text-[#0A1931] flex items-center justify-center text-white shrink-0 transition shadow-sm font-bold">
                  ↗
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Core Services */}
      {visible("services") && (
      <section className="py-10 sm:py-12 lg:py-20 bg-[#F8FAFC] border-t border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div>
              <div className="text-[#C5A253] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.20em] uppercase font-bold mb-2 sm:mb-3">{servicesSec?.eyebrow}</div>
              <h2 className="text-[#0A1931] font-black text-[26px] sm:text-[30px] lg:text-[42px] leading-none tracking-tight">{servicesSec?.title}</h2>
              <p className="text-slate-500 text-[13px] sm:text-sm mt-2 sm:mt-3 max-w-[560px]">{servicesSec?.subtitle}</p>
            </div>
            <Link href={servicesSec?.button_url || "/security-services"} className="hidden lg:inline-flex border border-slate-300 hover:border-[#0A1931] hover:bg-[#0A1931] hover:text-white active:bg-[#0A1931] active:text-white text-[#0A1931] px-6 py-3 text-xs tracking-[0.16em] uppercase font-bold transition min-h-[44px] items-center touch-manipulation">{servicesSec?.button_text}</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {featuredServices.map((s) => {
              const targetUrl = s.redirect_url || `/services/${s.slug}`;
              return (
                <Link
                  key={s.id}
                  href={targetUrl}
                  className="group bg-white border border-slate-100 hover:border-[#C5A253]/30 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 overflow-hidden relative">
                      <img src={s.card_image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1931]/60 to-transparent" />
                      <div className="absolute top-3 left-3 w-9 h-9 bg-white/95 backdrop-blur flex items-center justify-center text-[#0A1931] group-hover:bg-[#C5A253] group-hover:text-white transition">
                        <Icon name={s.icon_name} />
                      </div>
                    </div>
                    <div className="p-5 pb-0">
                      <h3 className="text-[#0A1931] font-bold text-[13px] tracking-[0.04em] uppercase">{s.name}</h3>
                      <p className="text-slate-500 text-[13px] leading-relaxed mt-2 line-clamp-3">{s.short_description}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-4">
                    <div className="flex items-center gap-2 text-[#C5A253] text-[11px] tracking-[0.14em] uppercase font-bold">
                      Learn More <span className="group-hover:translate-x-1 transition">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Why Choose */}
      {visible("why_choose_us") && whySec && (
      <section className="py-10 sm:py-12 lg:py-20 bg-[#0A1931] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/images/mumbai-business-district.png)", backgroundSize: "cover" }} />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-[640px] mb-6 sm:mb-10">
            <div className="text-[#C5A253] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.20em] uppercase font-bold mb-2 sm:mb-3">
              {whySec.eyebrow?.toLowerCase().includes("trust") ? "WHY CHOOSE US" : whySec.eyebrow}
            </div>
            <h2 className="text-white font-black text-[24px] sm:text-[30px] lg:text-[42px] leading-none tracking-tight whitespace-pre-line">Why Organizations Trust <span className="text-[#C5A253] font-black italic">SAFE Guard FORCE</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {whySec.items.map((f, i) => (
              <div key={f.title ?? i} className="bg-white/[0.06] backdrop-blur border border-white/10 p-7 hover:bg-white/[0.09] hover:border-[#C5A253]/30 transition">
                <div className="w-10 h-10 bg-[#C5A253] flex items-center justify-center text-[#0A1931] font-black text-sm mb-5">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-white font-bold text-sm tracking-wide">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* How We Work */}
      {visible("process") && processSec && (
      <section className="py-10 sm:py-12 lg:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[640px] mx-auto mb-8 sm:mb-12">
            <div className="text-[#C5A253] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.20em] uppercase font-bold mb-2 sm:mb-3">{processSec.eyebrow}</div>
            <h2 className="text-[#0A1931] font-black text-[26px] sm:text-[30px] lg:text-[42px] leading-none tracking-tight">{processSec.title}</h2>
            <p className="text-slate-500 text-[13px] sm:text-sm mt-2 sm:mt-3">{processSec.subtitle}</p>
          </div>

          <div className="relative">
            {/* line desktop */}
            <div className="hidden lg:block absolute top-[34px] left-[5%] right-[5%] h-px bg-slate-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {processSec.items.map((s) => (
                <div key={s.n ?? s.t} className="relative text-center lg:text-left bg-[#F8FAFC] lg:bg-white border border-slate-100 p-6 lg:p-0 lg:border-0">
                  <div className="w-16 h-16 mx-auto lg:mx-0 bg-[#0A1931] text-white flex items-center justify-center font-black text-sm relative z-10 border-4 border-white lg:border-0 shadow-lg">
                    {s.n}
                  </div>
                  <div className="hidden lg:block w-3 h-3 bg-[#C5A253] mx-auto lg:mx-6 mt-3 relative z-10 rotate-45" />
                  <h3 className="text-[#0A1931] font-bold text-sm tracking-widest uppercase mt-4">{s.t}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Industries */}
      {visible("industries") && (
      <section className="py-10 sm:py-12 lg:py-20 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
            <div>
              <div className="text-[#C5A253] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.20em] uppercase font-bold mb-2 sm:mb-3">{industriesSec?.eyebrow}</div>
              <h2 className="text-[#0A1931] font-black text-[26px] sm:text-[30px] lg:text-[42px] leading-none tracking-tight">{industriesSec?.title}</h2>
            </div>
            <Link href={industriesSec?.button_url || "/industries"} className="text-[#0A1931] text-xs tracking-[0.16em] uppercase font-bold border-b-2 border-[#C5A253] pb-1 self-start lg:self-auto min-h-[32px] flex items-center touch-manipulation">{industriesSec?.button_text}</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredIndustries.map((ind) => (
              <Link key={ind.id} href="/industries" className="group relative h-[148px] sm:h-[160px] lg:h-[200px] overflow-hidden bg-[#0A1931] touch-manipulation">
                <img src={ind.image_url} alt={ind.name} className="w-full h-full object-cover group-hover:scale-105 group-active:scale-105 transition duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070F1F] via-[#070F1F]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                  <div className="text-white font-bold text-xs sm:text-sm leading-tight">{ind.name}</div>
                  <div className="text-[#C5A253] text-[9px] sm:text-[10px] tracking-widest uppercase font-bold mt-1 opacity-0 group-hover:opacity-100 transition hidden sm:block">View Solutions →</div>
                </div>
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 border border-white/30 flex items-center justify-center text-white/70 group-hover:bg-[#C5A253] group-hover:text-[#0A1931] group-hover:border-[#C5A253] transition text-[10px] sm:text-xs">↗</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Our Personnel - Real Team */}
      {visible("personnel") && personnelSec && (
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img src={personnelSec.image_url || "/images/hero-mumbai-security.png"} alt="SAFE Guard FORCE guard" className="w-full h-[380px] sm:h-[440px] lg:h-[520px] object-cover object-top border border-slate-200" />
            <div className="absolute -bottom-4 -right-4 hidden lg:flex bg-[#0A1931] border-2 border-white shadow-xl p-5 items-center gap-4">
              <img src={settings.logo_url || "/images/safelogo.png"} alt="Logo" className="w-16 h-16 object-contain" />
              <div>
                <div className="text-[#C5A253] text-base lg:text-lg tracking-[0.20em] uppercase font-extrabold">{settings.site_name || "SAFE GUARD FORCE"}</div>
                <div className="text-white font-black text-sm tracking-wide mt-0.5">{settings.tagline || "YOUR SECURITY. OUR PRIORITY."}</div>
                <div className="text-white/60 text-xs mt-1">Disciplined • Verified • Presentable</div>
              </div>
            </div>
            {/* Mobile badge */}
            <div className="flex lg:hidden bg-[#0A1931] p-3.5 items-center gap-3 mt-0 border border-slate-200 border-t-0">
              <img src={settings.logo_url || "/images/safelogo.png"} alt="Logo" className="w-11 h-11 object-contain shrink-0" />
              <div>
                <div className="text-[#C5A253] text-xs sm:text-sm tracking-[0.18em] uppercase font-extrabold">{settings.site_name || "SAFE GUARD FORCE"}</div>
                <div className="text-white font-bold text-xs mt-0.5">{settings.tagline || "YOUR SECURITY. OUR PRIORITY."}</div>
                <div className="text-white/70 text-[11px] mt-0.5">Disciplined • Verified • Presentable</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-[#C5A253] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.20em] uppercase font-bold mb-2 sm:mb-3">{personnelSec.eyebrow}</div>
            <h2 className="text-[#0A1931] font-black text-[24px] sm:text-[28px] lg:text-[38px] leading-none tracking-tight whitespace-pre-line">
              {personnelSec.title}
            </h2>
            <p className="text-slate-600 text-[13px] sm:text-[15px] leading-relaxed mt-4 sm:mt-5">
              {personnelSec.subtitle}
            </p>
            <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
              {personnelSec.items.map((t, i) => (
                <li key={typeof t === "string" ? t : i} className="flex gap-2.5 sm:gap-3 text-[13px] sm:text-sm text-slate-700">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C5A253] text-[#0A1931] flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">✓</span>
                  <span className="pt-0.5 sm:pt-1">{typeof t === "string" ? t : t.title}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 sm:mt-8">
              <Link href={personnelSec.button_url || "/security-services"} className="bg-[#0A1931] text-white px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-bold min-h-[44px] flex items-center justify-center touch-manipulation active:bg-[#132D4F]">
                {personnelSec.button_text}
              </Link>
              <Link href="/contact" className="border border-slate-300 px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-bold text-[#0A1931] min-h-[44px] flex items-center justify-center touch-manipulation active:bg-slate-50">
                Request Deployment
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Stats band */}
      <section className="bg-[#070F1F] py-8 sm:py-10 lg:py-16 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-0 divide-y lg:divide-y-0 divide-white/10 lg:divide-x border border-white/10 lg:border-0">
          {(bandStats.length > 0
            ? bandStats.map((s) => [s.value, s.label] as const)
            : [
                ["24/7", "Professional Assistance"],
                ["12+", "Integrated Service Categories"],
                ["100%", "Customized Service Approach"],
                ["360°", "Security & Facility Solutions"],
              ] as const
          ).map(([a, b]) => (
            <div key={a} className="px-4 sm:px-6 py-6 sm:py-0 text-center lg:text-left border-r border-white/10 even:border-r-0 lg:even:border-r lg:border-r-0 lg:first:pl-0 odd:border-r sm:border-r-0">
              <div className="text-[#C5A253] font-black text-[28px] sm:text-[32px] lg:text-[44px] leading-none tracking-tighter">{a}</div>
              <div className="text-white/60 text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.16em] uppercase font-semibold mt-2 leading-tight">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      {visible("final_cta") && ctaSec && (
      <section className="relative min-h-[420px] sm:h-[420px] lg:h-[480px] overflow-hidden bg-[#070F1F] py-10 sm:py-0">
        <img src={ctaSec.image_url || "/images/mumbai-business-district.png"} alt="Corporate building night" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070F1F] via-[#070F1F]/80 sm:via-[#070F1F]/75 to-[#070F1F]/60 sm:to-[#070F1F]/40" />
        <div className="relative z-10 h-full min-h-[420px] sm:min-h-0 max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col justify-center py-8 sm:py-0">
          <div className="max-w-[640px]">
            <h2 className="text-white font-black text-[26px] sm:text-[30px] lg:text-[44px] leading-[0.92] sm:leading-[0.95] tracking-tight whitespace-pre-line">
              {ctaSec.title}
            </h2>
            <p className="text-white/75 sm:text-white/70 text-[13px] sm:text-sm leading-relaxed mt-3 sm:mt-4 max-w-[520px]">
              {ctaSec.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 sm:mt-8">
              <Link href={ctaSec.button_url || "/contact"} className="inline-flex items-center justify-center gap-2 bg-[#C5A253] hover:bg-[#D4AF37] active:bg-[#B8941F] text-[#070F1F] px-6 sm:px-8 py-3.5 sm:py-4 text-xs tracking-[0.16em] uppercase font-bold transition min-h-[48px] touch-manipulation">
                {ctaSec.button_text}
              </Link>
              <a href={telHref(settings.primary_phone)} className="inline-flex items-center justify-center border border-white/30 hover:bg-white hover:text-[#070F1F] active:bg-white active:text-[#070F1F] text-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs tracking-[0.16em] uppercase font-bold transition min-h-[48px] touch-manipulation">
                Call Now — {settings.primary_phone}
              </a>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
