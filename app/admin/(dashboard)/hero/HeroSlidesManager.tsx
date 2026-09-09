"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertHeroSlide } from "@/lib/actions/admin";
import { SubmitButton, showToast, Collapsible } from "../../components/ui";
import DeleteForm from "../../components/DeleteForm";
import MediaPicker from "../../components/MediaPicker";
import type { HeroSlide } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

function SlideForm({ slide, onDone }: { slide?: HeroSlide; onDone: () => void }) {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await upsertHeroSlide(fd);
    showToast(res.ok ? "Hero slide saved — homepage updates automatically" : res.error || "Save failed", res.ok);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {slide && <input type="hidden" name="id" value={slide.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Title (line 1, bold white)</label>
          <input name="title" defaultValue={slide?.title} className={input} placeholder="SECURITY" />
        </div>
        <div>
          <label className={label}>Highlighted Title (gold italic line)</label>
          <input name="highlighted_title" defaultValue={slide?.highlighted_title} className={input} placeholder="THAT PROTECTS." />
        </div>
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea name="description" defaultValue={slide?.description} rows={3} className={input} />
      </div>
      <MediaPicker name="image_url" label="Slide Image (desktop)" defaultValue={slide?.image_url} folder="hero" />
      <MediaPicker name="mobile_image_url" label="Mobile Image (optional)" defaultValue={slide?.mobile_image_url} folder="hero" />
      <div>
        <label className={label}>Alt Text (accessibility + SEO)</label>
        <input name="alt_text" defaultValue={slide?.alt_text} className={input} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Button Text</label>
          <input name="button_text" defaultValue={slide?.button_text} className={input} />
        </div>
        <div>
          <label className={label}>Button URL</label>
          <input name="button_url" defaultValue={slide?.button_url || "/contact"} className={input} />
        </div>
        <div>
          <label className={label}>Phone Button Text</label>
          <input name="phone_button_text" defaultValue={slide?.phone_button_text} className={input} placeholder="Call 9323581437" />
        </div>
        <div>
          <label className={label}>Phone Number</label>
          <input name="phone_number" defaultValue={slide?.phone_number} className={input} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label}>Sort Order</label>
          <input name="sort_order" type="number" defaultValue={slide?.sort_order ?? 0} className={input} />
        </div>
        <div>
          <label className={label}>Duration (ms)</label>
          <input name="duration_ms" type="number" min={1500} max={30000} step={500} defaultValue={slide?.duration_ms ?? 5000} className={input} />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="is_active" defaultChecked={slide?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active
          </label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onDone} className="border border-slate-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
        <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-8 py-2.5 text-xs font-black uppercase tracking-widest">
          {slide ? "Save Slide" : "Add Slide"}
        </SubmitButton>
      </div>
    </form>
  );
}

export default function HeroSlidesManager({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  async function remove(id: string) {
    const { deleteHeroSlide } = await import("@/lib/actions/admin");
    const res = await deleteHeroSlide(id);
    showToast(res.ok ? "Slide deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setAdding((a) => !a)} className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold">
          {adding ? "Close" : "+ Add Slide"}
        </button>
      </div>
      {adding && (
        <div className="border border-slate-200 bg-white p-5">
          <SlideForm onDone={() => setAdding(false)} />
        </div>
      )}
      {slides.map((s, i) => (
        <Collapsible
          key={s.id}
          title={`${i + 1}. ${s.title} ${s.highlighted_title}`}
          meta={`${s.is_active ? "Active" : "Hidden"} · order ${s.sort_order} · ${s.image_url}`}
        >
          <SlideForm slide={s} onDone={() => {}} />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <DeleteForm action={remove} id={s.id} label="Delete Slide" />
          </div>
        </Collapsible>
      ))}
    </div>
  );
}
