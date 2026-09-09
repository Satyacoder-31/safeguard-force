"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertNavigationItem } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import DeleteForm from "../../components/DeleteForm";
import type { NavigationItem } from "@/types/database";

const input = "border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C5A253] w-full";

function ItemForm({
  item,
  tops,
  onDone,
}: {
  item?: NavigationItem;
  tops: NavigationItem[];
  onDone: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await upsertNavigationItem(fd);
    showToast(res.ok ? "Navigation saved — website updates automatically" : res.error || "Save failed", res.ok);
    setBusy(false);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="border border-slate-200 bg-white p-5 space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-1">Label *</label>
          <input name="label" required defaultValue={item?.label} className={input} placeholder="About" />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-1">Link (href) *</label>
          <input name="href" required defaultValue={item?.href} className={input} placeholder="/about" />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-1">Parent (for dropdown)</label>
          <select name="parent_id" defaultValue={item?.parent_id ?? ""} className={`${input} bg-white`}>
            <option value="">— Top level —</option>
            {tops.filter((t) => t.id !== item?.id).map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-1">Sort Order</label>
          <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={input} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="open_in_new_tab" defaultChecked={item?.open_in_new_tab ?? false} className="accent-[#C5A253] w-4 h-4" /> Open in new tab
        </label>
        <div className="flex gap-2 ml-auto">
          <button type="button" onClick={onDone} className="border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
          <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-6 py-2 text-xs font-black uppercase tracking-widest" pendingLabel="Saving…">
            {item ? "Save Changes" : "Add Item"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default function NavigationManager({
  items,
  tops,
  childrenItems,
}: {
  items: NavigationItem[];
  tops: NavigationItem[];
  childrenItems: NavigationItem[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function remove(id: string) {
    const { deleteNavigationItem } = await import("@/lib/actions/admin");
    const res = await deleteNavigationItem(id);
    showToast(res.ok ? "Navigation item deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setAdding((a) => !a)} className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold">
          {adding ? "Close" : "+ Add Navigation Item"}
        </button>
      </div>
      {adding && <ItemForm tops={tops} onDone={() => setAdding(false)} />}

      <div className="space-y-2">
        {tops.map((t) => {
          const kids = childrenItems.filter((c) => c.parent_id === t.id);
          return (
            <div key={t.id} className="border border-slate-200 bg-white">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="w-1.5 h-8 bg-[#C5A253]" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-[#0A1931]">{t.label} <span className="text-slate-300 font-normal">·</span> <span className="text-slate-400 font-normal text-xs">{t.href}</span></div>
                  <div className="text-[11px] text-slate-400">Order {t.sort_order} {t.is_active ? "" : "· Hidden"}{kids.length ? ` · ${kids.length} sub-items` : ""}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(editing === t.id ? null : t.id)} className="border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:border-[#0A1931]">Edit</button>
                  <DeleteForm action={remove} id={t.id} confirm={kids.length ? "This will also delete all sub-items. Continue?" : "Delete this navigation item?"} />
                </div>
              </div>
              {editing === t.id && <div className="border-t border-slate-100 p-4"><ItemForm item={t} tops={tops} onDone={() => setEditing(null)} /></div>}
              {kids.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50/50 divide-y divide-slate-100">
                  {kids.map((k) => (
                    <div key={k.id} className="flex items-center gap-3 px-4 py-2.5 pl-10">
                      <span className="text-slate-300 text-xs">└</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-slate-700 font-medium">{k.label}</span>
                        <span className="text-slate-400 text-xs ml-2">{k.href}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditing(editing === k.id ? null : k.id)} className="text-[11px] font-bold uppercase text-slate-500 hover:text-[#0A1931]">Edit</button>
                        <DeleteForm action={remove} id={k.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {editing === t.id && kids.some((k) => editing === k.id) && <div className="border-t border-slate-100 p-4" />}
              {kids.map((k) => editing === k.id && (
                <div key={`edit-${k.id}`} className="border-t border-slate-100 p-4"><ItemForm item={k} tops={tops} onDone={() => setEditing(null)} /></div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Edit forms for children render at root level for simplicity */}
      {childrenItems.filter((k) => editing === k.id).map((k) => (
        <ItemForm key={`child-edit-${k.id}`} item={k} tops={tops} onDone={() => setEditing(null)} />
      ))}
    </div>
  );
}
