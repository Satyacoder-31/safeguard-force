"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBrochureSettings, saveBrochurePageSettings } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import MediaPicker from "../../components/MediaPicker";
import type { SiteSettings, HomepageSection } from "@/types/database";
import type { BrochurePageSettings } from "@/lib/cms/queries";

export default function BrochureManager({
  settings,
  section,
  brochurePageSettings,
}: {
  settings: SiteSettings;
  section?: HomepageSection;
  brochurePageSettings?: BrochurePageSettings;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"brochure_page" | "homepage_section">("brochure_page");
  const [loading, setLoading] = useState(false);

  // Form State for Brochure Page (/brochure)
  const [bpEyebrow, setBpEyebrow] = useState(brochurePageSettings?.eyebrow || "Official Corporate Profile");
  const [bpTitle, setBpTitle] = useState(brochurePageSettings?.title || "SAFE GUARD FORCE Corporate Brochure");
  const [bpSubtitle, setBpSubtitle] = useState(
    brochurePageSettings?.subtitle ||
      "Explore our official corporate brochure containing operational capabilities, leadership foreword, statutory compliance, and service portfolio."
  );
  const [bpHeroImage, setBpHeroImage] = useState(brochurePageSettings?.hero_image || "/images/hero-mumbai-security.png");
  const [bpPdfUrl, setBpPdfUrl] = useState(
    brochurePageSettings?.pdf_url || settings.brochure_url || "/brochure.pdf"
  );
  const [bpActionBarText, setBpActionBarText] = useState(
    brochurePageSettings?.action_bar_text || "Official Corporate Profile • PASARA License No. 293 • Govt. of Maharashtra"
  );
  const [bpDownloadBtnText, setBpDownloadBtnText] = useState(
    brochurePageSettings?.download_button_text || "Download PDF Brochure"
  );
  const [bpOpenBtnText, setBpOpenBtnText] = useState(
    brochurePageSettings?.open_button_text || "Open PDF in New Tab"
  );
  const [bpFooterTitle, setBpFooterTitle] = useState(
    brochurePageSettings?.footer_card_title || "SAFE GUARD FORCE Corporate Profile"
  );
  const [bpFooterSubtitle, setBpFooterSubtitle] = useState(
    brochurePageSettings?.footer_card_subtitle ||
      "View the complete brochure above or download the official PDF file directly to your device."
  );

  // Form State for Homepage Section Preview
  const [eyebrow, setEyebrow] = useState(section?.eyebrow || "Official Company Document");
  const [title, setTitle] = useState(section?.title || settings.brochure_title || "SAFE Guard FORCE Corporate Brochure");
  const [description, setDescription] = useState(
    section?.description ||
      section?.subtitle ||
      "Explore our official 13-page corporate profile covering our 20+ years track record, leadership foreword by Founder & Director Mr. Shashikant Shukla, 30-day training methodologies in Karjat & Gorakhpur, statutory compliance (PASARA License No. 293), and valued client portfolio."
  );
  const [buttonText, setButtonText] = useState(section?.button_text || "View Corporate Profile (13 Pages) →");
  const [brochureUrl, setBrochureUrl] = useState(section?.button_url || settings.brochure_url || "/brochure.pdf");

  // Highlight Cards State for Homepage Section
  const defaultItems = (section?.items && section.items.length > 0
    ? section.items
    : [
        { a: "20+ Years", b: "Industry Experience" },
        { a: "PASARA #293", b: "Maharashtra Police Reg." },
        { a: "2 Centres", b: "Karjat & Gorakhpur Training" },
        { a: "Full Audit", b: "PF, ESIC, GST & PT Compliant" },
      ]) as Array<{ a?: string; b?: string; title?: string; subtitle?: string }>;

  const [card1A, setCard1A] = useState(defaultItems[0]?.a || defaultItems[0]?.title || "20+ Years");
  const [card1B, setCard1B] = useState(defaultItems[0]?.b || defaultItems[0]?.subtitle || "Industry Experience");
  const [card2A, setCard2A] = useState(defaultItems[1]?.a || defaultItems[1]?.title || "PASARA #293");
  const [card2B, setCard2B] = useState(defaultItems[1]?.b || defaultItems[1]?.subtitle || "Maharashtra Police Reg.");
  const [card3A, setCard3A] = useState(defaultItems[2]?.a || defaultItems[2]?.title || "2 Centres");
  const [card3B, setCard3B] = useState(defaultItems[2]?.b || defaultItems[2]?.subtitle || "Karjat & Gorakhpur Training");
  const [card4A, setCard4A] = useState(defaultItems[3]?.a || defaultItems[3]?.title || "Full Audit");
  const [card4B, setCard4B] = useState(defaultItems[3]?.b || defaultItems[3]?.subtitle || "PF, ESIC, GST & PT Compliant");

  async function onSaveBrochurePage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await saveBrochurePageSettings(fd);
      showToast(
        res.ok ? "Brochure Page (/brochure) updated — public page reflects changes immediately!" : res.error || "Save failed",
        res.ok
      );
      if (res.ok) router.refresh();
    } catch {
      showToast("Could not save Brochure Page settings.", false);
    } finally {
      setLoading(false);
    }
  }

  async function onSaveHomepageSection(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await saveBrochureSettings(fd);
      showToast(
        res.ok ? "Homepage brochure section updated — homepage reflects changes immediately!" : res.error || "Save failed",
        res.ok
      );
      if (res.ok) router.refresh();
    } catch {
      showToast("Could not save homepage brochure section.", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-slate-100 p-1.5 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab("brochure_page")}
          className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider rounded-md transition flex items-center justify-center gap-2 ${
            activeTab === "brochure_page"
              ? "bg-[#0A1931] text-[#C5A253] shadow-md"
              : "text-slate-600 hover:text-[#0A1931] hover:bg-slate-200"
          }`}
        >
          <span>📄</span> 1. Edit Brochure Page (/brochure)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("homepage_section")}
          className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider rounded-md transition flex items-center justify-center gap-2 ${
            activeTab === "homepage_section"
              ? "bg-[#0A1931] text-[#C5A253] shadow-md"
              : "text-slate-600 hover:text-[#0A1931] hover:bg-slate-200"
          }`}
        >
          <span>🏠</span> 2. Edit Homepage Showcase Section
        </button>
      </div>

      {/* TAB 1: BROCHURE PAGE EDITOR */}
      {activeTab === "brochure_page" && (
        <div className="space-y-8">
          {/* Live Preview Container for Brochure Page */}
          <div className="bg-[#070F1F] text-white p-6 sm:p-8 rounded-lg border border-[#C5A253]/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">
                  Live Preview: Standalone Brochure Page (/brochure)
                </span>
              </div>
              <a
                href="/brochure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#C5A253] hover:underline font-bold"
              >
                View Live Page ↗
              </a>
            </div>

            {/* Page Hero Preview */}
            <div className="space-y-3 pt-2">
              <div className="text-[#C5A253] text-[10px] uppercase font-bold tracking-widest">
                {bpEyebrow || "Official Corporate Profile"}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {bpTitle || "SAFE GUARD FORCE Corporate Brochure"}
              </h3>
              <p className="text-white/70 text-xs leading-relaxed max-w-[650px]">
                {bpSubtitle}
              </p>
            </div>

            {/* Action Bar Preview */}
            <div className="bg-white/5 border border-white/10 p-3 rounded flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <div className="text-xs text-white/90 font-medium">
                🟢 {bpActionBarText}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#C5A253] text-[#070F1F] px-3 py-1.5 text-[10px] uppercase font-black rounded">
                  📥 {bpDownloadBtnText}
                </span>
                <span className="border border-white/30 text-white px-3 py-1.5 text-[10px] uppercase font-bold rounded">
                  ↗ {bpOpenBtnText}
                </span>
              </div>
            </div>

            {/* Footer Summary Card Preview */}
            <div className="bg-white/5 border border-white/10 p-4 rounded space-y-1">
              <h4 className="text-xs font-bold text-white">{bpFooterTitle}</h4>
              <p className="text-[10px] text-white/70">{bpFooterSubtitle}</p>
            </div>
          </div>

          {/* Brochure Page Admin Edit Form */}
          <form onSubmit={onSaveBrochurePage} className="bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-[#0A1931]">Edit Standalone Brochure Page (/brochure)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the hero title, subtitle, header image, button labels, notice bar, and PDF file for <code className="text-[#C5A253] font-bold">https://safeforcegaurad.vercel.app/brochure</code>.
              </p>
            </div>

            {/* PDF File Upload */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1931] mb-2">
                1. Brochure PDF Document
              </h4>
              <MediaPicker
                name="pdf_url"
                label="Brochure PDF File"
                defaultValue={bpPdfUrl}
                folder="brochures"
                accept="application/pdf,image/*"
              />
            </div>

            {/* Hero Section Fields */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1931]">
                2. Hero Header Content
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Eyebrow Badge Text
                  </label>
                  <input
                    name="eyebrow"
                    value={bpEyebrow}
                    onChange={(e) => setBpEyebrow(e.target.value)}
                    placeholder="e.g. Official Corporate Profile"
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Main Page Title
                  </label>
                  <input
                    name="title"
                    value={bpTitle}
                    onChange={(e) => setBpTitle(e.target.value)}
                    placeholder="e.g. SAFE GUARD FORCE Corporate Brochure"
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  name="subtitle"
                  rows={3}
                  value={bpSubtitle}
                  onChange={(e) => setBpSubtitle(e.target.value)}
                  placeholder="Subtitle text for the brochure page..."
                  className="w-full border border-slate-200 p-3 text-sm focus:outline-none focus:border-[#C5A253]"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                  Hero Background Image
                </label>
                <MediaPicker
                  name="hero_image"
                  label="Hero Banner Image"
                  defaultValue={bpHeroImage}
                  folder="pages"
                />
              </div>
            </div>

            {/* Action Bar & Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1931]">
                3. Sticky Action Bar & Button Labels
              </h4>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                  Sticky Notice Bar Text
                </label>
                <input
                  name="action_bar_text"
                  value={bpActionBarText}
                  onChange={(e) => setBpActionBarText(e.target.value)}
                  placeholder="e.g. Official Corporate Profile • PASARA License No. 293 • Govt. of Maharashtra"
                  className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Download Button Label
                  </label>
                  <input
                    name="download_button_text"
                    value={bpDownloadBtnText}
                    onChange={(e) => setBpDownloadBtnText(e.target.value)}
                    placeholder="e.g. Download PDF Brochure"
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Open in New Tab Button Label
                  </label>
                  <input
                    name="open_button_text"
                    value={bpOpenBtnText}
                    onChange={(e) => setBpOpenBtnText(e.target.value)}
                    placeholder="e.g. Open PDF in New Tab"
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Summary Card */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1931]">
                4. Bottom Info Card Content
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Footer Card Title
                  </label>
                  <input
                    name="footer_card_title"
                    value={bpFooterTitle}
                    onChange={(e) => setBpFooterTitle(e.target.value)}
                    placeholder="e.g. SAFE GUARD FORCE Corporate Profile"
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Footer Card Subtitle
                  </label>
                  <input
                    name="footer_card_subtitle"
                    value={bpFooterSubtitle}
                    onChange={(e) => setBpFooterSubtitle(e.target.value)}
                    placeholder="e.g. View the complete brochure above..."
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {bpPdfUrl ? (
                <a
                  href={bpPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C5A253] font-bold hover:underline flex items-center gap-1.5"
                >
                  <span>📄</span> Test / Open Uploaded PDF File
                </a>
              ) : (
                <span className="text-xs text-slate-400">No PDF file specified</span>
              )}

              <SubmitButton className="bg-[#C5A253] hover:bg-[#B8941F] text-[#0A1931] px-8 py-3 text-xs tracking-widest uppercase font-black shadow-md">
                {loading ? "Saving Changes…" : "Save Brochure Page (/brochure)"}
              </SubmitButton>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: HOMEPAGE SHOWCASE SECTION EDITOR */}
      {activeTab === "homepage_section" && (
        <div className="space-y-8">
          {/* Live Homepage Preview Container */}
          <div className="bg-[#070F1F] text-white p-6 sm:p-8 rounded-lg border border-[#C5A253]/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">
                  Live Preview: Homepage Brochure Showcase Section
                </span>
              </div>
              <span className="text-[10px] text-white/50 uppercase font-semibold">Updates live as you type</span>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-center pt-2">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 text-[#C5A253] text-[10px] uppercase font-bold tracking-widest">
                  <span className="w-6 h-px bg-[#C5A253]" /> {eyebrow || "Official Company Document"}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {title || "SAFE Guard FORCE Corporate Brochure"}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed max-w-[540px] line-clamp-3">
                  {description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="bg-[#C5A253] text-[#070F1F] px-5 py-2 text-xs uppercase font-black rounded-xs shadow">
                    📄 {buttonText}
                  </span>
                  <span className="border border-white/30 text-white px-4 py-2 text-xs uppercase font-bold rounded-xs">
                    📥 Download PDF
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 border border-white/10 p-4 rounded space-y-3">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
                  <img src={settings.logo_url || "/images/safelogo.png"} alt="Logo" className="w-8 h-8 object-contain" />
                  <div>
                    <div className="text-[11px] font-black text-white">SAFE GUARD FORCE</div>
                    <div className="text-[#C5A253] text-[9px] uppercase font-bold">13-Page Profile</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-white/80">
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    <strong className="text-[#C5A253] block font-bold text-xs">{card1A}</strong>
                    <span className="text-[10px] leading-tight block">{card1B}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    <strong className="text-[#C5A253] block font-bold text-xs">{card2A}</strong>
                    <span className="text-[10px] leading-tight block">{card2B}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    <strong className="text-[#C5A253] block font-bold text-xs">{card3A}</strong>
                    <span className="text-[10px] leading-tight block">{card3B}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    <strong className="text-[#C5A253] block font-bold text-xs">{card4A}</strong>
                    <span className="text-[10px] leading-tight block">{card4B}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Edit Form */}
          <form onSubmit={onSaveHomepageSection} className="bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#0A1931]">Edit Homepage Brochure Section</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit text, brochure file, button labels, and feature badges shown on the homepage.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
                <input
                  type="checkbox"
                  name="brochure_enabled"
                  defaultChecked={section?.is_visible ?? settings.brochure_enabled ?? true}
                  className="w-4 h-4 accent-[#C5A253]"
                />
                <span className="text-xs font-bold text-slate-800">Show Section on Website</span>
              </label>
            </div>

            {/* PDF File Picker */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1931] mb-2">
                1. Upload PDF Brochure Document
              </h4>
              <MediaPicker
                name="brochure_url"
                label="Brochure PDF File"
                defaultValue={brochureUrl}
                folder="brochures"
                accept="application/pdf,image/*"
              />
            </div>

            {/* Header & Content Fields */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1931]">
                2. Section Header & Paragraph Content
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Eyebrow Text (Small Gold Label)
                  </label>
                  <input
                    name="eyebrow"
                    value={eyebrow}
                    onChange={(e) => setEyebrow(e.target.value)}
                    placeholder="e.g. Official Company Document"
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                    Main Section Title / Heading
                  </label>
                  <input
                    name="brochure_title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SAFE Guard FORCE Corporate Brochure"
                    className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                  Description Paragraph
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your corporate profile and key details..."
                  className="w-full border border-slate-200 p-3 text-sm focus:outline-none focus:border-[#C5A253]"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase font-bold text-slate-500 mb-1">
                  Primary Button Text (View Brochure)
                </label>
                <input
                  name="button_text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. View Corporate Profile (13 Pages) →"
                  className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253]"
                />
              </div>
            </div>

            {/* 4 Highlight Cards */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1931]">
                3. Highlight Badges (Right Preview Card)
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 border border-slate-200 rounded space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A253]">Badge 1</span>
                  <input
                    name="card_1_a"
                    value={card1A}
                    onChange={(e) => setCard1A(e.target.value)}
                    placeholder="Stat (e.g. 20+ Years)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#C5A253]"
                  />
                  <input
                    name="card_1_b"
                    value={card1B}
                    onChange={(e) => setCard1B(e.target.value)}
                    placeholder="Label (e.g. Industry Experience)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A253]"
                  />
                </div>

                <div className="bg-slate-50 p-3 border border-slate-200 rounded space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A253]">Badge 2</span>
                  <input
                    name="card_2_a"
                    value={card2A}
                    onChange={(e) => setCard2A(e.target.value)}
                    placeholder="Stat (e.g. PASARA #293)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#C5A253]"
                  />
                  <input
                    name="card_2_b"
                    value={card2B}
                    onChange={(e) => setCard2B(e.target.value)}
                    placeholder="Label (e.g. Maharashtra Police Reg.)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A253]"
                  />
                </div>

                <div className="bg-slate-50 p-3 border border-slate-200 rounded space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A253]">Badge 3</span>
                  <input
                    name="card_3_a"
                    value={card3A}
                    onChange={(e) => setCard3A(e.target.value)}
                    placeholder="Stat (e.g. 2 Centres)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#C5A253]"
                  />
                  <input
                    name="card_3_b"
                    value={card3B}
                    onChange={(e) => setCard3B(e.target.value)}
                    placeholder="Label (e.g. Karjat & Gorakhpur Training)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A253]"
                  />
                </div>

                <div className="bg-slate-50 p-3 border border-slate-200 rounded space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A253]">Badge 4</span>
                  <input
                    name="card_4_a"
                    value={card4A}
                    onChange={(e) => setCard4A(e.target.value)}
                    placeholder="Stat (e.g. Full Audit)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#C5A253]"
                  />
                  <input
                    name="card_4_b"
                    value={card4B}
                    onChange={(e) => setCard4B(e.target.value)}
                    placeholder="Label (e.g. PF, ESIC, GST & PT Compliant)"
                    className="w-full border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A253]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {brochureUrl ? (
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C5A253] font-bold hover:underline flex items-center gap-1.5"
                >
                  <span>📄</span> Test / Open Uploaded Brochure PDF
                </a>
              ) : (
                <span className="text-xs text-slate-400">No brochure PDF uploaded</span>
              )}

              <SubmitButton className="bg-[#C5A253] hover:bg-[#B8941F] text-[#0A1931] px-8 py-3 text-xs tracking-widest uppercase font-black shadow-md">
                {loading ? "Saving Changes…" : "Save Homepage Brochure Section"}
              </SubmitButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
