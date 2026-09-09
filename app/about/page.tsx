import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import Link from "next/link";
import { getAboutContent, getValues, getSiteSettings } from "@/lib/cms/queries";
import { FALLBACK_ABOUT } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  const about = (await getAboutContent()) ?? FALLBACK_ABOUT;
  return {
    title: about.meta_title || "About Us — SAFE Guard FORCE",
    description: about.meta_description || undefined,
  };
}

export default async function AboutPage() {
  const [aboutRaw, values, settings] = await Promise.all([
    getAboutContent(),
    getValues(),
    getSiteSettings(),
  ]);
  const about = aboutRaw ?? FALLBACK_ABOUT;
  const checklist = about.management_checklist.length
    ? about.management_checklist
    : [
        "Regular site inspections & audits",
        "Personnel supervision & attendance control",
        "Quality checks & SLA reporting",
        "Complaint resolution & escalation matrix",
        "Vendor coordination & AMC oversight",
        "Preventive maintenance scheduling",
      ];

  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        title={about.page_title}
        subtitle={about.hero_subtitle}
        image={about.hero_image_url}
      />

      {/* Who we are */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-[#C5A253] text-[11px] tracking-[0.20em] uppercase font-bold mb-3">Who We Are</div>
            <h2 className="text-[#0A1931] font-black text-[30px] lg:text-[40px] leading-none tracking-tight whitespace-pre-line">{about.who_we_are_heading}</h2>
            <p className="text-slate-600 leading-relaxed mt-6">{about.who_we_are_description}</p>
            <p className="text-slate-500 leading-relaxed mt-4 text-sm">{about.who_we_are_secondary}</p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-[#F8FAFC] border border-slate-100 p-5">
                <div className="text-[#0A1931] font-bold text-sm">Mumbai-Centric</div>
                <div className="text-slate-500 text-xs mt-1">Deep local operational knowledge with nationwide capability</div>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-100 p-5">
                <div className="text-[#0A1931] font-bold text-sm">Discipline First</div>
                <div className="text-slate-500 text-xs mt-1">Verified, trained and continuously supervised personnel</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3">
                <img src={about.who_we_are_image_url} alt="SAFE Guard FORCE uniformed guard" className="w-full h-[380px] object-cover object-top border border-slate-200" />
              </div>
              <div className="col-span-2 flex flex-col gap-3">
                <div className="bg-white border border-slate-200 p-4 flex flex-col items-center text-center">
                  <img src={settings.logo_url} alt="SAFE Guard FORCE shield" className="w-24 h-24 object-contain" />
                  <div className="text-[#0A1931] font-black text-xs tracking-widest uppercase mt-2">SAFE GUARD FORCE</div>
                  <div className="text-[#C5A253] text-[10px] tracking-widest uppercase font-bold">{settings.tagline}</div>
                </div>
                <img src="/images/team-inspection.png" alt="Team" className="h-[118px] w-full object-cover" />
                <img src="/images/team-inspection.png" alt="Facility" className="h-[118px] w-full object-cover" />
              </div>
            </div>
            <div className="bg-[#0A1931] p-4 flex items-center gap-3">
              <img src={settings.logo_url} alt="Badge" className="w-10 h-10 object-contain" />
              <div className="text-white text-xs leading-tight">
                <span className="text-[#C5A253] font-bold tracking-widest uppercase">Authentic Personnel</span><br />
                <span className="text-white/70">Light blue shirt • Red beret • SAFE belt &amp; patch • White gloves</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-14 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 p-8">
            <div className="w-10 h-10 bg-[#0A1931] flex items-center justify-center text-[#C5A253] mb-5">◆</div>
            <h3 className="text-[#0A1931] font-bold tracking-widest uppercase text-sm">{about.mission_title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">{about.mission_description}</p>
          </div>
          <div className="bg-[#0A1931] p-8 text-white">
            <div className="w-10 h-10 bg-[#C5A253] flex items-center justify-center text-[#0A1931] mb-5">◆</div>
            <h3 className="font-bold tracking-widest uppercase text-sm">{about.vision_title}</h3>
            <p className="text-white/70 text-sm leading-relaxed mt-3">{about.vision_description}</p>
          </div>
          <div className="bg-white border border-slate-100 p-8">
            <div className="w-10 h-10 bg-[#0A1931] flex items-center justify-center text-[#C5A253] mb-5">◆</div>
            <h3 className="text-[#0A1931] font-bold tracking-widest uppercase text-sm">{about.commitment_title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">{about.commitment_description}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      {values.length > 0 && (
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[600px] mx-auto mb-10">
            <div className="text-[#C5A253] text-[11px] tracking-[0.20em] uppercase font-bold mb-3">Core Values</div>
            <h2 className="text-[#0A1931] font-black text-[32px] leading-none">Principles That Guide Us</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.id} className="border border-slate-200 p-6 hover:border-[#C5A253]/40 hover:shadow-md transition">
                <div className="text-[#C5A253] text-xs tracking-[0.18em] uppercase font-bold">{v.title}</div>
                <div className="text-slate-600 text-sm leading-relaxed mt-2">{v.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Management Approach */}
      <section className="py-16 bg-[#0A1931] text-white">
        <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[#C5A253] text-[11px] tracking-[0.20em] uppercase font-bold mb-3">Management Approach</div>
            <h2 className="font-black text-[30px] leading-none">Structured Operations. <span className="italic font-light text-[#C5A253]">Measurable Quality.</span></h2>
            {about.management_description && (
              <p className="text-white/70 text-sm leading-relaxed mt-4">{about.management_description}</p>
            )}
            <ul className="mt-8 space-y-4">
              {checklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#C5A253] text-[#0A1931] flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
            <Link href={about.cta_url || "/contact"} className="inline-flex mt-8 bg-[#C5A253] text-[#0A1931] px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-bold">{about.cta_text || "Discuss Your Requirements"}</Link>
          </div>
          <div className="relative">
            <img src="/images/hero-mumbai-security.png" alt="Management approach - guard" className="w-full h-[460px] object-cover object-top border border-white/10" />
            <div className="absolute bottom-4 left-4 right-4 bg-white p-3 flex items-center gap-3">
              <img src={settings.logo_url} alt="Logo" className="w-10 h-10 object-contain" />
              <div className="text-[#0A1931] text-xs font-bold tracking-widest uppercase">{settings.site_name} <span className="text-[#C5A253]">• Mumbai</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
