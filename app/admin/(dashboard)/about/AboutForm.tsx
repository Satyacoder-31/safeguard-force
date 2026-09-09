"use client";

import { useActionState } from "react";
import { saveAboutContent } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import MediaPicker from "../../components/MediaPicker";
import type { AboutContent } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

export default function AboutForm({ about }: { about: AboutContent | null }) {
  const [state, action] = useActionState(async (_prev: unknown, fd: FormData) => {
    const res = await saveAboutContent(_prev, fd);
    showToast(res.ok ? "About page saved — website updates automatically" : res.error || "Save failed", res.ok);
    return res;
  }, null);

  return (
    <form action={action} className="space-y-6">
      {state?.ok && <p className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3">Saved successfully.</p>}
      {state && !state.ok && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{state.error}</p>}

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Page Hero</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Eyebrow</label>
            <input name="eyebrow" defaultValue={about?.eyebrow} className={input} />
          </div>
          <div>
            <label className={label}>Hero Title (line breaks allowed)</label>
            <textarea name="page_title" defaultValue={about?.page_title} rows={2} className={input} />
          </div>
        </div>
        <div>
          <label className={label}>Hero Subtitle</label>
          <textarea name="hero_subtitle" defaultValue={about?.hero_subtitle} rows={2} className={input} />
        </div>
        <MediaPicker name="hero_image_url" label="Hero Image" defaultValue={about?.hero_image_url} folder="about" />
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Who We Are</legend>
        <div>
          <label className={label}>Heading</label>
          <input name="who_we_are_heading" defaultValue={about?.who_we_are_heading} className={input} />
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea name="who_we_are_description" defaultValue={about?.who_we_are_description} rows={4} className={input} />
        </div>
        <div>
          <label className={label}>Secondary Paragraph</label>
          <textarea name="who_we_are_secondary" defaultValue={about?.who_we_are_secondary} rows={3} className={input} />
        </div>
        <MediaPicker name="who_we_are_image_url" label="Section Image" defaultValue={about?.who_we_are_image_url} folder="about" />
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Mission · Vision · Commitment</legend>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className={label}>Mission Title</label>
            <input name="mission_title" defaultValue={about?.mission_title} className={input} />
            <textarea name="mission_description" defaultValue={about?.mission_description} rows={4} className={input} />
          </div>
          <div className="space-y-2">
            <label className={label}>Vision Title</label>
            <input name="vision_title" defaultValue={about?.vision_title} className={input} />
            <textarea name="vision_description" defaultValue={about?.vision_description} rows={4} className={input} />
          </div>
          <div className="space-y-2">
            <label className={label}>Commitment Title</label>
            <input name="commitment_title" defaultValue={about?.commitment_title} className={input} />
            <textarea name="commitment_description" defaultValue={about?.commitment_description} rows={4} className={input} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Management Approach</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Heading</label>
            <input name="management_heading" defaultValue={about?.management_heading} className={input} />
          </div>
          <div>
            <label className={label}>Sub-description (optional)</label>
            <input name="management_description" defaultValue={about?.management_description} className={input} />
          </div>
        </div>
        <div>
          <label className={label}>Checklist (one per line)</label>
          <textarea name="management_checklist" defaultValue={(about?.management_checklist ?? []).join("\n")} rows={5} className={input} />
        </div>
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">CTA & SEO</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>CTA Button Text</label>
            <input name="cta_text" defaultValue={about?.cta_text} className={input} />
          </div>
          <div>
            <label className={label}>CTA URL</label>
            <input name="cta_url" defaultValue={about?.cta_url || "/contact"} className={input} />
          </div>
          <div>
            <label className={label}>Meta Title</label>
            <input name="meta_title" defaultValue={about?.meta_title} className={input} />
          </div>
          <div>
            <label className={label}>Meta Description</label>
            <textarea name="meta_description" defaultValue={about?.meta_description} rows={2} className={input} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="is_published" defaultChecked={about?.is_published ?? true} className="accent-[#C5A253] w-4 h-4" /> Published (uncheck to hide page content behind fallback)
        </label>
      </fieldset>

      <div className="sticky bottom-4 bg-white border border-slate-200 shadow-lg px-5 py-4 flex justify-end">
        <SubmitButton className="bg-[#C5A253] hover:bg-[#B8941F] text-[#0A1931] px-8 py-3 text-xs tracking-widest uppercase font-black">
          Save About Page
        </SubmitButton>
      </div>
    </form>
  );
}
