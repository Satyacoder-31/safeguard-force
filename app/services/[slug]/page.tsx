import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { getServiceBySlug, getServiceItems, getSiteSettings, getServices } from "@/lib/cms/queries";
import { telHref } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const services = await getServices().catch(() => []);
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.meta_title || `${service.name} — SAFE Guard FORCE`,
    description: service.meta_description || service.short_description,
    openGraph: {
      title: service.meta_title || service.name,
      description: service.meta_description || service.short_description,
      images: service.hero_image_url ? [service.hero_image_url] : undefined,
    },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);
  if (!service) notFound();

  const items = await getServiceItems(service.id);
  const hasImages = items.some((i) => i.image_url);

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow || service.name}
        title={service.hero_title || service.name}
        subtitle={service.hero_subtitle || service.short_description}
        image={service.hero_image_url || service.card_image_url}
        cta={{ label: "Request Assessment", href: "/contact" }}
      />

      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          {service.full_description && (
            <p className="text-slate-600 leading-relaxed max-w-[860px] mb-10">{service.full_description}</p>
          )}

          {items.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">Details for this service are being updated — please contact us for more information.</p>
          ) : hasImages ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((item) => (
                <div key={item.id} className="border border-slate-100 hover:shadow-xl hover:border-[#C5A253]/20 transition overflow-hidden group bg-white">
                  {item.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-[#0A1931] font-bold text-sm uppercase tracking-wide">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div key={item.id} className="border border-slate-100 p-6 hover:border-[#C5A253]/30 transition bg-[#F8FAFC]">
                  <div className="text-[#0A1931] font-bold text-sm uppercase tracking-wide">{item.title}</div>
                  <div className="text-slate-500 text-sm mt-2 leading-relaxed">{item.description}</div>
                  {item.points.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {item.points.map((p) => (
                        <li key={p} className="text-xs text-slate-500 flex gap-2"><span className="text-[#C5A253]">•</span>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className="bg-[#0A1931] text-white px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-bold">Request Assessment</Link>
            <a href={telHref(settings.primary_phone)} className="border border-slate-300 px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-bold text-[#0A1931]">Call {settings.primary_phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
