import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import Link from "next/link";
import { getIndustries, getContactSettings, getHomepageSections } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Industries We Serve — SAFE Guard FORCE",
  description:
    "Tailored security, facility management and housekeeping solutions for residential societies, corporate offices, hospitals, hotels, factories, warehouses, events and institutions.",
};

export default async function IndustriesPage() {
  const [industries, contact, sections] = await Promise.all([
    getIndustries(),
    getContactSettings(),
    getHomepageSections(),
  ]);

  const industriesSec = sections.find((s) => s.section_key === "industries");

  return (
    <>
      <PageHero
        eyebrow={industriesSec?.eyebrow || "Industries We Serve"}
        title={industriesSec?.title ? industriesSec.title : "Solutions Designed\nAround Your Environment."}
        subtitle={industriesSec?.subtitle || "Every premises has distinct risks, footfall and operational rhythms — we tailor manpower, SOPs and supervision accordingly."}
        image={industriesSec?.image_url || "/images/mumbai-business-district.png"}
      />

      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          {industries.length === 0 ? (
            <p className="text-slate-500 text-sm py-12 text-center">
              Industry details are being updated — please check back shortly or contact us directly.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((it) => (
                <div key={it.id} className="border border-slate-100 overflow-hidden hover:shadow-xl hover:border-[#C5A253]/20 transition group bg-white">
                  <div className="h-48 overflow-hidden relative">
                    <img src={it.image_url} alt={it.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute bottom-0 left-0 bg-[#0A1931] px-4 py-2">
                      <span className="text-white text-xs font-bold tracking-widest uppercase">{it.name}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 text-sm leading-relaxed">{it.short_description}</p>
                    <ul className="mt-4 space-y-1.5">
                      {it.points.map((p) => (
                        <li key={p} className="text-xs text-slate-500 flex gap-2"><span className="text-[#C5A253]">•</span>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-[#0A1931] p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[#C5A253] text-xs tracking-[0.18em] uppercase font-bold">Not sure which package fits?</div>
              <div className="text-white font-bold text-lg mt-1">Tell us your property type — we&apos;ll propose a tailored plan.</div>
            </div>
            <Link href="/contact" className="bg-[#C5A253] text-[#0A1931] px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-bold shrink-0">{contact?.cta_text || "Request Consultation"}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
