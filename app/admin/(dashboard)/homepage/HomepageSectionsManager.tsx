"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHomepageSection, toggleHomepageSection } from "@/lib/actions/admin";
import { SubmitButton, showToast, Collapsible } from "../../components/ui";
import MediaPicker from "../../components/MediaPicker";
import type { HomepageSection } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

const SECTION_LABELS: Record<string, string> = {
  trust_intro: "Trust Intro (A Safer, Smarter Tomorrow)",
  services: "Core Services Header",
  why_choose_us: "Why Organizations Trust Us",
  process: "How We Work",
  industries: "Industries We Serve Header",
  personnel: "Our Personnel",
  stats_band: "Stats Band (managed under Statistics)",
  final_cta: "Final Call-To-Action",
};

function SectionForm({ section }: { section: HomepageSection }) {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("id", section.id);
    fd.set("section_key", section.section_key);
    const res = await updateHomepageSection(fd);
    showToast(res.ok ? "Section saved — homepage updates automatically" : res.error || "Save failed", res.ok);
    if (res.ok) router.refresh();
  }

  const isWhyOrProcess = section.section_key === "why_choose_us" || section.section_key === "process";
  const showTitle = !["stats_band"].includes(section.section_key);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="id" value={section.id} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Eyebrow (small gold label)</label>
          <input name="eyebrow" defaultValue={section.eyebrow} className={input} />
        </div>
        {showTitle && (
          <div>
            <label className={label}>Title (line breaks allowed)</label>
            <textarea name="title" defaultValue={section.title} rows={2} className={input} />
          </div>
        )}
      </div>
      <div>
        <label className={label}>Subtitle / Primary Paragraph</label>
        <textarea name="subtitle" defaultValue={section.subtitle} rows={3} className={input} />
      </div>
      <div>
        <label className={label}>Secondary Paragraph (optional)</label>
        <textarea name="description" defaultValue={section.description} rows={2} className={input} />
      </div>
      {!isWhyOrProcess && (
        <MediaPicker name="image_url" label="Section Image" defaultValue={section.image_url} folder="general" />
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Button Text</label>
          <input name="button_text" defaultValue={section.button_text} className={input} />
        </div>
        <div>
          <label className={label}>Button URL</label>
          <input name="button_url" defaultValue={section.button_url} className={input} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="is_visible" defaultChecked={section.is_visible} className="accent-[#C5A253] w-4 h-4" /> Visible on homepage
        </label>
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Order</label>
            <input name="sort_order" type="number" defaultValue={section.sort_order} className="border border-slate-200 px-2 py-1.5 w-20 text-sm" />
          </div>
          <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-7 py-2.5 text-xs font-black uppercase tracking-widest">Save Section</SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default function HomepageSectionsManager({ sections }: { sections: HomepageSection[] }) {
  const router = useRouter();

  async function toggle(id: string, visible: boolean) {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("visible", String(visible));
    const res = await toggleHomepageSection(fd);
    showToast(res.ok ? (visible ? "Section shown" : "Section hidden") : res.error || "Update failed", res.ok);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <Collapsible
          key={s.id}
          title={SECTION_LABELS[s.section_key] ?? s.section_key}
          meta={`${s.is_visible ? "Visible" : "Hidden"} · ${s.title.split("\n")[0]}`}
        >
          {["stats_band"].includes(s.section_key) ? (
            <p className="text-sm text-slate-500">This section renders the statistics managed under <strong>Statistics</strong> in the sidebar. Toggle visibility here.</p>
          ) : (
            <SectionForm section={s} />
          )}
          {["stats_band"].includes(s.section_key) && (
            <div className="mt-4">
              <button
                onClick={() => toggle(s.id, !s.is_visible)}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 border ${s.is_visible ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
              >
                {s.is_visible ? "Hide Section" : "Show Section"}
              </button>
            </div>
          )}
        </Collapsible>
      ))}
    </div>
  );
}
