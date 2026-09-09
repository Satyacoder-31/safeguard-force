"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertIndustry } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import DeleteForm from "../../components/DeleteForm";
import MediaPicker from "../../components/MediaPicker";
import type { Industry } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

function IndustryForm({ industry, onDone }: { industry?: Industry; onDone: () => void }) {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await upsertIndustry(fd);
    showToast(res.ok ? "Industry saved — website updates automatically" : res.error || "Save failed", res.ok);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {industry && <input type="hidden" name="id" value={industry.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Name *</label>
          <input name="name" required defaultValue={industry?.name} className={input} />
        </div>
        <div>
          <label className={label}>Slug (auto if blank)</label>
          <input name="slug" defaultValue={industry?.slug} className={input} />
        </div>
      </div>
      <div>
        <label className={label}>Short Description (card body)</label>
        <textarea name="short_description" defaultValue={industry?.short_description} rows={2} className={input} />
      </div>
      <div>
        <label className={label}>Longer Description (optional)</label>
        <textarea name="description" defaultValue={industry?.description} rows={2} className={input} />
      </div>
      <MediaPicker name="image_url" label="Image" defaultValue={industry?.image_url} folder="industries" />
      <div>
        <label className={label}>Bullet Points (one per line)</label>
        <textarea name="points" defaultValue={(industry?.points ?? []).join("\n")} rows={3} className={input} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className={label}>Sort Order</label>
          <input name="sort_order" type="number" defaultValue={industry?.sort_order ?? 0} className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 pb-2">
          <input type="checkbox" name="is_featured" defaultChecked={industry?.is_featured ?? true} className="accent-[#C5A253] w-4 h-4" /> Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 pb-2">
          <input type="checkbox" name="is_active" defaultChecked={industry?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active
        </label>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onDone} className="border border-slate-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
        <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-8 py-2.5 text-xs font-black uppercase tracking-widest">
          {industry ? "Save Industry" : "Add Industry"}
        </SubmitButton>
      </div>
    </form>
  );
}

export default function IndustriesManager({ industries }: { industries: Industry[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function remove(id: string) {
    const { deleteIndustry } = await import("@/lib/actions/admin");
    const res = await deleteIndustry(id);
    showToast(res.ok ? "Industry deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setAdding((a) => !a)} className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold">
          {adding ? "Close" : "+ Add Industry"}
        </button>
      </div>
      {adding && <div className="border border-slate-200 bg-white p-5"><IndustryForm onDone={() => setAdding(false)} /></div>}
      <div className="space-y-2">
        {industries.map((ind, i) => (
          <div key={ind.id} className="border border-slate-200 bg-white">
            <div className="flex items-center gap-3 px-4 py-3">
              <img src={ind.image_url} alt="" className="w-12 h-12 object-cover border border-slate-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-[#0A1931]">{i + 1}. {ind.name}</div>
                <div className="text-[11px] text-slate-400">order {ind.sort_order} {ind.is_active ? "" : "· INACTIVE"} {ind.is_featured ? "" : "· not on homepage"}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing(editing === ind.id ? null : ind.id)} className="border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:border-[#0A1931]">
                  {editing === ind.id ? "Close" : "Edit"}
                </button>
                <DeleteForm action={remove} id={ind.id} />
              </div>
            </div>
            {editing === ind.id && (
              <div className="border-t border-slate-100 p-5">
                <IndustryForm industry={ind} onDone={() => setEditing(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
