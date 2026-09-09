"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { HeroSlide, Statistic, SiteSettings } from "@/types/database";
import { telHref } from "@/lib/utils";

export default function HeroSlideshow({
  slides,
  heroBarStats,
  settings,
}: {
  slides: HeroSlide[];
  heroBarStats: Statistic[];
  settings: SiteSettings;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = Math.max(slides.length, 1);
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const duration = current?.duration_ms ?? 5000;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), duration);
    return () => clearInterval(t);
  }, [paused, slides.length, current?.duration_ms]);

  if (!current) {
    return (
      <section className="relative h-[78vh] min-h-[540px] sm:min-h-[580px] lg:h-[88vh] lg:min-h-[560px] max-h-[680px] lg:max-h-[820px] overflow-hidden bg-[#070F1F]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-black text-3xl">SAFE GUARD <span className="text-[#C5A253]">FORCE</span></div>
        </div>
      </section>
    );
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setIndex((i) => (i - 1 + count) % count);
      else setIndex((i) => (i + 1) % count);
    }
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 3000);
  };

  return (
    <section
      className="relative h-[78vh] min-h-[540px] sm:min-h-[580px] lg:h-[88vh] lg:min-h-[560px] max-h-[680px] lg:max-h-[820px] overflow-hidden bg-[#070F1F]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[1000ms] ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <picture>
            {s.mobile_image_url && <source media="(max-width: 640px)" srcSet={s.mobile_image_url} />}
            <img
              src={s.image_url}
              alt={s.alt_text}
              className={`w-full h-full object-cover ${s.image_url.includes("safeforce") ? "object-top object-[center_top]" : "object-center"} ${i === index ? "kenburns" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </picture>
          {/* Mobile needs stronger overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070F1F] via-[#070F1F]/55 lg:via-[#0A1931]/55 to-[#0A1931]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070F1F]/80 via-[#070F1F]/40 to-transparent lg:from-[#070F1F]/70 lg:via-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col justify-center pt-10 sm:pt-0">
        <div className="max-w-[720px]">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
            <span className="w-6 sm:w-8 h-px bg-[#C5A253]" />
            <span className="text-[#C5A253] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.24em] uppercase font-bold">Integrated Security &amp; Facility Solutions</span>
          </div>

          <h1 className="text-white font-black leading-[0.90] tracking-[-0.03em] text-[30px] sm:text-[38px] lg:text-[64px]">
            {current.title}
            <span className="block font-light italic text-[#C5A253]">{current.highlighted_title}</span>
          </h1>

          <p className="text-white/80 sm:text-white/75 text-[13.5px] sm:text-[15px] lg:text-[17px] leading-relaxed mt-4 sm:mt-6 max-w-[560px] pr-2 sm:pr-0">
            {current.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 sm:mt-8">
            <Link href={current.button_url || "/contact"} className="inline-flex items-center justify-center gap-2 bg-[#C5A253] hover:bg-[#D4AF37] active:bg-[#B8941F] text-[#070F1F] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.14em] sm:tracking-[0.16em] uppercase font-bold transition min-h-[48px] touch-manipulation">
              {current.button_text || "Get a Free Consultation"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href={telHref(current.phone_number || settings.primary_phone)} className="inline-flex items-center justify-center gap-2 border border-white/40 sm:border-white/30 hover:bg-white hover:text-[#070F1F] active:bg-white active:text-[#070F1F] text-white px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.14em] sm:tracking-[0.16em] uppercase font-bold transition min-h-[48px] touch-manipulation">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {current.phone_button_text || `Call ${settings.primary_phone}`}
            </a>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-6 text-white/60 text-[11px] sm:text-xs flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            24/7 Assistance • Trained Personnel • Customized Solutions
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-6 lg:left-[max(1.5rem,calc((100%-1280px)/2+1.5rem))] z-10 flex items-center gap-2 sm:gap-3">
        <div className="flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`h-1 sm:h-1 transition-all duration-500 touch-manipulation min-w-[16px] ${i === index ? "w-8 sm:w-10 bg-[#C5A253]" : "w-5 sm:w-6 bg-white/30 active:bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-white/40 text-[10px] sm:text-xs tracking-widest ml-1 sm:ml-2">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      {/* Stats bar - desktop only */}
      {heroBarStats.length > 0 && (
        <div className="hidden lg:flex absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-[#070F1F]/70 backdrop-blur">
          <div className="max-w-[1280px] mx-auto px-6 w-full grid grid-cols-4 divide-x divide-white/10">
            {heroBarStats.map((stat) => (
              <div key={stat.id} className="py-5 px-6 flex items-center gap-4">
                <span className="text-[#C5A253] font-black text-lg">{stat.value}</span>
                <span className="text-white/70 text-xs tracking-widest uppercase font-semibold leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
