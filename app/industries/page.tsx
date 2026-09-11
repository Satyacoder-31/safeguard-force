import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import { getIndustries, getHomepageSections } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Industries We Serve — SAFE Guard FORCE",
  description:
    "Tailored security, facility management and housekeeping solutions for residential societies, corporate offices, hospitals, hotels, factories, warehouses, events and institutions.",
};

export default async function IndustriesPage() {
  const [industries, sections] = await Promise.all([
    getIndustries(),
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

        </div>
      </section>
    </>
  );
}
