import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import { getSiteSettings, getBrochurePageSettings } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, pageSettings] = await Promise.all([
    getSiteSettings(),
    getBrochurePageSettings(),
  ]);
  return {
    title: `${pageSettings.title || "Corporate Brochure"} — ${settings.site_name}`,
    description: pageSettings.subtitle || "View and download the official SAFE Guard FORCE Corporate Profile PDF.",
  };
}

export default async function BrochurePage() {
  const [settings, pageSettings] = await Promise.all([
    getSiteSettings(),
    getBrochurePageSettings(),
  ]);

  const effectivePdfUrl = pageSettings.pdf_url || settings.brochure_url || "/brochure.pdf";

  return (
    <>
      <PageHero
        eyebrow={pageSettings.eyebrow}
        title={pageSettings.title}
        subtitle={pageSettings.subtitle}
        image={pageSettings.hero_image || "/images/hero-mumbai-security.png"}
      />

      {/* Action Bar */}
      <section className="bg-[#070F1F] border-y border-white/10 text-white py-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {pageSettings.action_bar_text}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={effectivePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="SAFE_GUARD_FORCE_Corporate_Brochure.pdf"
              className="bg-[#C5A253] hover:bg-[#D4AF37] active:bg-[#B8941F] text-[#070F1F] px-6 py-2.5 text-xs tracking-[0.16em] uppercase font-black transition inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>📥</span> {pageSettings.download_button_text}
            </a>
            <a
              href={effectivePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 hover:bg-white hover:text-[#070F1F] text-white px-5 py-2.5 text-xs tracking-[0.16em] uppercase font-bold transition inline-flex items-center gap-2"
            >
              <span>↗</span> {pageSettings.open_button_text}
            </a>
          </div>
        </div>
      </section>

      {/* Embedded PDF Viewer Section */}
      <section className="py-8 lg:py-12 bg-slate-900 min-h-[750px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6">
          <div className="bg-white rounded shadow-2xl overflow-hidden border border-slate-700">
            {/* Embedded PDF viewer iframe */}
            <div className="w-full h-[80vh] min-h-[600px] max-h-[1050px] bg-slate-800 relative">
              <iframe
                src={`${effectivePdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={`${pageSettings.title} PDF`}
              >
                <div className="p-8 text-center text-slate-800 space-y-4">
                  <p className="text-lg font-bold">Your browser does not support embedded PDF viewing.</p>
                  <a
                    href={effectivePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#C5A253] text-[#070F1F] px-6 py-3 font-bold uppercase rounded shadow"
                  >
                    Click here to view/download the PDF brochure
                  </a>
                </div>
              </iframe>
            </div>
          </div>

          {/* Quick Info & Direct Download Footer Card */}
          <div className="bg-[#070F1F] text-white p-6 sm:p-8 rounded-sm border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-black text-white">{pageSettings.footer_card_title}</h3>
              <p className="text-xs text-white/70 mt-1">
                {pageSettings.footer_card_subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={effectivePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="SAFE_GUARD_FORCE_Corporate_Brochure.pdf"
                className="bg-[#C5A253] hover:bg-[#D4AF37] text-[#070F1F] px-6 py-3 text-xs tracking-wider uppercase font-black transition shadow-md"
              >
                📥 Download PDF File
              </a>
              <Link
                href="/contact"
                className="border border-white/30 hover:bg-white hover:text-[#070F1F] text-white px-6 py-3 text-xs tracking-wider uppercase font-bold transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


