"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertStatistic } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import DeleteForm from "../../components/DeleteForm";
import type { Statistic } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

function StatForm({ stat, onDone }: { stat?: Statistic; onDone: () => void }) {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await upsertStatistic(fd);
    showToast(res.ok ? "Statistic saved" : res.error || "Save failed", res.ok);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="border border-slate-200 bg-white p-4 space-y-3">
      {stat && <input type="hidden" name="id" value={stat.id} />}
      <div className="grid sm:grid-cols-5 gap-3">
        <div>
          <label className={label}>Value *</label>
          <input name="value" required defaultValue={stat?.value} className={input} placeholder="24/7" />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Label *</label>
          <input name="label" required defaultValue={stat?.label} className={input} placeholder="Professional Assistance" />
        </div>
        <div>
          <label className={label}>Where</label>
          <select name="context" defaultValue={stat?.context ?? "stats_band"} className={`${input} bg-white`}>
            <option value="hero_bar">Hero Bar (desktop)</option>
            <option value="trust">Trust Intro (3 mini cards)</option>
            <option value="stats_band">Dark Stats Band</option>
          </select>
        </div>
        <div>
          <label className={label}>Order</label>
          <input name="sort_order" type="number" defaultValue={stat?.sort_order ?? 0} className={input} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="is_active" defaultChecked={stat?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
          <SubmitButton className="bg-[#0A1931] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest">{stat ? "Save" : "Add Statistic"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default function StatisticsManager({ stats }: { stats: Statistic[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function remove(id: string) {
    const { deleteStatistic } = await import("@/lib/actions/admin");
    const res = await deleteStatistic(id);
    showToast(res.ok ? "Statistic deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setAdding((a) => !a)} className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold">
          {adding ? "Close" : "+ Add Statistic"}
        </button>
      </div>
      {adding && <StatForm onDone={() => setAdding(false)} />}
      {stats.map((s) => (
        <div key={s.id}>
          <div className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3">
            <span className="text-[#C5A253] font-black text-lg w-16 shrink-0">{s.value}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-slate-700 font-medium">{s.label}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{s.context} · order {s.sort_order} {s.is_active ? "" : "· hidden"}</div>
            </div>
            <button onClick={() => setEditing(editing === s.id ? null : s.id)} className="text-[11px] font-bold uppercase text-slate-500 hover:text-[#0A1931]">
              {editing === s.id ? "Close" : "Edit"}
            </button>
            <DeleteForm action={remove} id={s.id} />
          </div>
          {editing === s.id && <div className="mt-2"><StatForm stat={s} onDone={() => setEditing(null)} /></div>}
        </div>
      ))}
    </div>
  );
}
