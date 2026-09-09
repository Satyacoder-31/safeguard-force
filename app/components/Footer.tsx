import Link from "next/link";
import type { SiteSettings } from "@/types/database";
import { telHref, whatsappHref } from "@/lib/utils";
import { getServices, getIndustries } from "@/lib/cms/queries";

export default async function Footer({ settings }: { settings: SiteSettings }) {
  const [services, industries] = await Promise.all([getServices(), getIndustries()]);
  const footerServices = services.slice(0, 7);
  const footerIndustries = industries.slice(0, 8);

  const socials = [
    { url: settings.facebook_url, label: "Facebook", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
    { url: settings.linkedin_url, label: "LinkedIn", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></> },
    { url: settings.instagram_url, label: "Instagram", icon: <><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" /></> },
    { url: settings.youtube_url, label: "YouTube", icon: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></> },
    { url: settings.twitter_url, label: "Twitter", icon: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /> },
  ].filter((s) => s.url);

  return (
    <footer className="bg-[#070F1F] text-white">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[#C5A253] text-[11px] tracking-[0.24em] uppercase font-bold mb-2">Ready to Secure Your Premises?</div>
            <div className="text-white text-xl lg:text-2xl font-bold tracking-tight">Partner with India&apos;s Integrated Security &amp; Facility Experts</div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/contact" className="bg-[#C5A253] hover:bg-[#D4AF37] text-[#070F1F] px-7 py-3.5 text-xs tracking-[0.14em] uppercase font-bold transition">Request Consultation</Link>
            <a href={telHref(settings.primary_phone)} className="border border-white/20 hover:bg-white hover:text-[#070F1F] px-7 py-3.5 text-xs tracking-[0.14em] uppercase font-bold transition">Call Now</a>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-transparent shrink-0 overflow-hidden">
                <img src={settings.logo_url || "/images/safelogo.png"} alt="SAFE Guard FORCE" className="w-full h-full object-contain" />
              </div>
              <div className="leading-none">
                <div className="text-white font-black tracking-wider text-base sm:text-lg">SAFE GUARD FORCE</div>
                <div className="text-[#C5A253] text-[8.5px] sm:text-[9.5px] tracking-[0.26em] uppercase font-bold mt-1">
                  {settings.tagline && !settings.tagline.toLowerCase().includes("nationwide") ? settings.tagline : "Your Security. Our Priority."}
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {settings.footer_description}
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/60 hover:text-[#C5A253] hover:border-[#C5A253]/30 transition cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="text-white text-xs tracking-[0.2em] uppercase font-bold mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#C5A253]" /> Services
            </div>
            <ul className="space-y-2.5 text-sm">
              {footerServices.map((s) => (
                <li key={s.id}><Link href={`/services/${s.slug}`} className="text-white/60 hover:text-[#C5A253] transition flex items-center gap-2"><span className="w-1 h-1 bg-[#C5A253]/60 rounded-full" />{s.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <div className="text-white text-xs tracking-[0.2em] uppercase font-bold mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#C5A253]" /> Industries
            </div>
            <ul className="space-y-2.5 text-sm">
              {footerIndustries.map((i) => (
                <li key={i.id}><Link href="/industries" className="text-white/60 hover:text-[#C5A253] transition flex items-center gap-2"><span className="w-1 h-1 bg-[#C5A253]/60 rounded-full" />{i.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-white text-xs tracking-[0.2em] uppercase font-bold mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#C5A253]" /> Contact
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-white/40 text-[11px] tracking-widest uppercase mb-1">Call Us 24/7</div>
                <a href={telHref(settings.primary_phone)} className="block text-white font-bold text-lg hover:text-[#C5A253] transition">{settings.primary_phone}</a>
                {settings.secondary_phone && (
                  <a href={telHref(settings.secondary_phone)} className="block text-white font-bold text-lg hover:text-[#C5A253] transition">{settings.secondary_phone}</a>
                )}
              </div>
              <div>
                <div className="text-white/40 text-[11px] tracking-widest uppercase mb-1">Visit Us</div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {settings.address_line_1}<br />
                  {settings.address_line_2}<br />
                  {settings.city} — {settings.pincode}
                </p>
                <a href={settings.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex mt-3 text-[#C5A253] text-xs tracking-widest uppercase font-bold hover:underline gap-1 items-center">
                  Get Directions <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-5">
          <p className="text-white/30 text-[11px] leading-relaxed">
            Services are provided subject to applicable laws, regulations, client requirements and operational feasibility. Investigation and information-gathering services are conducted professionally, discreetly and only through lawful means.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] bg-[#050C1A]">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-white/40">
            © {new Date().getFullYear()} {settings.copyright_text}
          </div>
          <div className="flex gap-6 text-white/40">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link>
            <Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
