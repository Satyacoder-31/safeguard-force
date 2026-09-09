"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertValue } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import DeleteForm from "../../components/DeleteForm";
import type { ValueItem } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

function ValueForm({ value, onDone }: { value?: ValueItem; onDone: () => void }) {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await upsertValue(fd);
    showToast(res.ok ? "Value saved" : res.error || "Save failed", res.ok);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="border border-slate-200 bg-white p-4 space-y-3">
      {value && <input type="hidden" name="id" value={value.id} />}
      <div className="grid sm:grid-cols-4 gap-3">
        <div className="sm:col-span-1">
          <label className={label}>Title *</label>
          <input name="title" required defaultValue={value?.title} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Description</label>
          <input name="description" defaultValue={value?.description} className={input} />
        </div>
        <div>
          <label className={label}>Sort Order</label>
          <input name="sort_order" type="number" defaultValue={value?.sort_order ?? 0} className={input} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="is_active" defaultChecked={value?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
          <SubmitButton className="bg-[#0A1931] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest">{value ? "Save" : "Add Value"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default function ValuesManager({ values }: { values: ValueItem[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function remove(id: string) {
    const { deleteValue } = await import("@/lib/actions/admin");
    const res = await deleteValue(id);
    showToast(res.ok ? "Value deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setAdding((a) => !a)} className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold">
          {adding ? "Close" : "+ Add Value"}
        </button>
      </div>
      {adding && <ValueForm onDone={() => setAdding(false)} />}
      {values.map((v) => (
        <div key={v.id}>
          <div className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3">
            <span className="text-slate-300 text-xs w-6">{v.sort_order}</span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-[#0A1931]">{v.title}</div>
              <div className="text-xs text-slate-400 truncate">{v.description}</div>
            </div>
            <button onClick={() => setEditing(editing === v.id ? null : v.id)} className="text-[11px] font-bold uppercase text-slate-500 hover:text-[#0A1931]">
              {editing === v.id ? "Close" : "Edit"}
            </button>
            <DeleteForm action={remove} id={v.id} />
          </div>
          {editing === v.id && <div className="mt-2"><ValueForm value={v} onDone={() => setEditing(null)} /></div>}
        </div>
      ))}
    </div>
  );
}
