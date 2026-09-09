"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertTestimonial } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import DeleteForm from "../../components/DeleteForm";
import MediaPicker from "../../components/MediaPicker";
import type { Testimonial } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

function TestimonialForm({ t, onDone }: { t?: Testimonial; onDone: () => void }) {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await upsertTestimonial(fd);
    showToast(res.ok ? "Testimonial saved" : res.error || "Save failed", res.ok);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="border border-slate-200 bg-white p-5 space-y-4">
      {t && <input type="hidden" name="id" value={t.id} />}
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label}>Client Name *</label>
          <input name="client_name" required defaultValue={t?.client_name} className={input} />
        </div>
        <div>
          <label className={label}>Company</label>
          <input name="company" defaultValue={t?.company} className={input} />
        </div>
        <div>
          <label className={label}>Role</label>
          <input name="role" defaultValue={t?.role} className={input} />
        </div>
      </div>
      <div>
        <label className={label}>Testimonial *</label>
        <textarea name="testimonial" required defaultValue={t?.testimonial} rows={3} className={input} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4 items-start">
        <MediaPicker name="photo_url" label="Photo (optional)" defaultValue={t?.photo_url} folder="general" />
        <div>
          <label className={label}>Rating (1–5)</label>
          <input name="rating" type="number" min={1} max={5} defaultValue={t?.rating ?? 5} className={input} />
        </div>
        <div>
          <label className={label}>Sort Order</label>
          <input name="sort_order" type="number" defaultValue={t?.sort_order ?? 0} className={input} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="is_featured" defaultChecked={t?.is_featured ?? true} className="accent-[#C5A253] w-4 h-4" /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="is_active" defaultChecked={t?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active
          </label>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
          <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-6 py-2 text-xs font-black uppercase tracking-widest">{t ? "Save" : "Add Testimonial"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function remove(id: string) {
    const { deleteTestimonial } = await import("@/lib/actions/admin");
    const res = await deleteTestimonial(id);
    showToast(res.ok ? "Testimonial deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex justify-end">
        <button onClick={() => setAdding((a) => !a)} className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold">
          {adding ? "Close" : "+ Add Testimonial"}
        </button>
      </div>
      {adding && <TestimonialForm onDone={() => setAdding(false)} />}
      {testimonials.map((t) => (
        <div key={t.id}>
          <div className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3">
            <div className="text-[#C5A253] text-sm shrink-0">{"★".repeat(t.rating)}</div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-[#0A1931]">{t.client_name} {t.company && <span className="text-slate-400 font-normal">· {t.company}</span>}</div>
              <div className="text-xs text-slate-400 truncate">{t.testimonial}</div>
            </div>
            <button onClick={() => setEditing(editing === t.id ? null : t.id)} className="text-[11px] font-bold uppercase text-slate-500 hover:text-[#0A1931]">
              {editing === t.id ? "Close" : "Edit"}
            </button>
            <DeleteForm action={remove} id={t.id} />
          </div>
          {editing === t.id && <div className="mt-2"><TestimonialForm t={t} onDone={() => setEditing(null)} /></div>}
        </div>
      ))}
    </div>
  );
}
