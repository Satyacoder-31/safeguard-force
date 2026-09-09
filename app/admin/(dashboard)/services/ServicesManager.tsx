"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertService, upsertServiceItem } from "@/lib/actions/admin";
import { SubmitButton, showToast, SearchBox } from "../../components/ui";
import DeleteForm from "../../components/DeleteForm";
import MediaPicker from "../../components/MediaPicker";
import type { Service, ServiceItem } from "@/types/database";
import { slugify } from "@/lib/utils";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

const ICONS = ["shield", "building", "sparkles", "leaf", "flame", "paw", "users", "wrench", "bug", "headset", "search", "droplet"];

function ServiceForm({ service, onDone }: { service?: Service; onDone: () => void }) {
  const router = useRouter();
  const [name, setName] = useState(service?.name ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await upsertService(fd);
    showToast(res.ok ? "Service saved — website updates automatically" : res.error || "Save failed", res.ok);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Service Name *</label>
          <input name="name" required value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </div>
        <div>
          <label className={label}>Slug (URL) — leave blank to auto-generate</label>
          <input name="slug" defaultValue={service?.slug} className={input} placeholder={name ? slugify(name) : "security-services"} />
        </div>
      </div>
      <div>
        <label className={label}>Short Description (homepage card)</label>
        <textarea name="short_description" defaultValue={service?.short_description} rows={2} className={input} />
      </div>
      <div>
        <label className={label}>Full Description (service page intro)</label>
        <textarea name="full_description" defaultValue={service?.full_description} rows={3} className={input} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label}>Eyebrow</label>
          <input name="eyebrow" defaultValue={service?.eyebrow} className={input} />
        </div>
        <div>
          <label className={label}>Hero Title (line breaks allowed)</label>
          <textarea name="hero_title" defaultValue={service?.hero_title} rows={2} className={input} />
        </div>
        <div>
          <label className={label}>Icon</label>
          <select name="icon_name" defaultValue={service?.icon_name || "shield"} className={`${input} bg-white`}>
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Hero Subtitle</label>
        <textarea name="hero_subtitle" defaultValue={service?.hero_subtitle} rows={2} className={input} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <MediaPicker name="hero_image_url" label="Hero Image (page top)" defaultValue={service?.hero_image_url} folder="services" />
        <MediaPicker name="card_image_url" label="Card Image (homepage grid)" defaultValue={service?.card_image_url} folder="services" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>SEO Meta Title</label>
          <input name="meta_title" defaultValue={service?.meta_title} className={input} />
        </div>
        <div>
          <label className={label}>SEO Meta Description</label>
          <textarea name="meta_description" defaultValue={service?.meta_description} rows={2} className={input} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className={label}>Sort Order</label>
          <input name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 pb-2">
          <input type="checkbox" name="is_featured" defaultChecked={service?.is_featured ?? true} className="accent-[#C5A253] w-4 h-4" /> Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 pb-2">
          <input type="checkbox" name="is_active" defaultChecked={service?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active (visible on site)
        </label>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onDone} className="border border-slate-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
        <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-8 py-2.5 text-xs font-black uppercase tracking-widest">
          {service ? "Save Service" : "Add Service"}
        </SubmitButton>
      </div>
    </form>
  );
}

function ItemForm({ serviceId, item, onDone }: { serviceId: string; item?: ServiceItem; onDone: () => void }) {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await upsertServiceItem(fd);
    showToast(res.ok ? "Item saved" : res.error || "Save failed", res.ok);
    if (res.ok) { onDone(); router.refresh(); }
  }

  return (
    <form onSubmit={onSubmit} className="border border-slate-200 bg-slate-50 p-4 space-y-3">
      <input type="hidden" name="service_id" value={serviceId} />
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={label}>Title *</label>
          <input name="title" required defaultValue={item?.title} className={input} />
        </div>
        <div>
          <label className={label}>Sort Order</label>
          <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={input} />
        </div>
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea name="description" defaultValue={item?.description} rows={2} className={input} />
      </div>
      <MediaPicker name="image_url" label="Image (optional)" defaultValue={item?.image_url} folder="services" />
      <div>
        <label className={label}>Bullet Points (one per line, optional)</label>
        <textarea name="points" defaultValue={(item?.points ?? []).join("\n")} rows={2} className={input} />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" /> Active
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Cancel</button>
          <SubmitButton className="bg-[#0A1931] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest">{item ? "Save" : "Add Item"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

function ServiceItemsSection({ service, items }: { service: Service; items: ServiceItem[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const mine = items.filter((i) => i.service_id === service.id);

  async function remove(id: string) {
    const { deleteServiceItem } = await import("@/lib/actions/admin");
    const res = await deleteServiceItem(id);
    showToast(res.ok ? "Item deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-black tracking-widest uppercase text-[#0A1931]">Detail Items ({mine.length})</h4>
        <button onClick={() => setAdding((a) => !a)} className="text-xs font-bold uppercase tracking-widest text-[#C5A253]">
          {adding ? "Close" : "+ Add Item"}
        </button>
      </div>
      {adding && <div className="mb-3"><ItemForm serviceId={service.id} onDone={() => setAdding(false)} /></div>}
      <div className="space-y-2">
        {mine.map((it) => (
          <div key={it.id}>
            <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5">
              <span className="text-slate-300 text-xs w-6">{it.sort_order}</span>
              <div className="w-10 h-10 border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center">
                {it.image_url ? (
                  <img src={it.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-400">No img</span>
                )}
              </div>
              <span className="text-sm text-slate-700 font-medium flex-1 min-w-0 truncate">{it.title}</span>
              {!it.is_active && <span className="text-[10px] uppercase text-slate-400 font-bold">hidden</span>}
              <button onClick={() => setEditing(editing === it.id ? null : it.id)} className="text-[11px] font-bold uppercase text-slate-500 hover:text-[#0A1931]">
                {editing === it.id ? "Close" : "Edit Photo & Details"}
              </button>
              <DeleteForm action={remove} id={it.id} />
            </div>
            {editing === it.id && (
              <div className="mt-2 mb-3">
                <ItemForm key={it.id} serviceId={service.id} item={it} onDone={() => setEditing(null)} />
              </div>
            )}
          </div>
        ))}
        {mine.length === 0 && <p className="text-xs text-slate-400 px-1 py-2">No detail items yet — these are the cards shown on the service page.</p>}
      </div>
    </div>
  );
}

export default function ServicesManager({ services, items }: { services: Service[]; items: ServiceItem[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = services.filter((s) =>
    query ? s.name.toLowerCase().includes(query.toLowerCase()) : true
  );

  async function remove(id: string) {
    const { deleteService } = await import("@/lib/actions/admin");
    const res = await deleteService(id);
    showToast(res.ok ? "Service deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          className="w-full sm:w-64 border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]"
        />
        <button onClick={() => setAdding((a) => !a)} className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold shrink-0">
          {adding ? "Close" : "+ Add Service"}
        </button>
      </div>
      {adding && (
        <div className="border border-slate-200 bg-white p-5">
          <ServiceForm onDone={() => setAdding(false)} />
        </div>
      )}
      <div className="space-y-2">
        {filtered.map((s, i) => (
          <div key={s.id} className="border border-slate-200 bg-white">
            <div className="flex items-center gap-3 px-4 py-3">
              <img src={s.card_image_url} alt="" className="w-12 h-12 object-cover border border-slate-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-[#0A1931]">{i + 1}. {s.name}</div>
                <div className="text-[11px] text-slate-400">/services/{s.slug} · order {s.sort_order} {s.is_active ? "" : "· INACTIVE"} {s.is_featured ? "" : "· not featured"}</div>
              </div>                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(editing === s.id ? null : s.id)} className="border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:border-[#0A1931]">
                    {editing === s.id ? "Close" : "Edit"}
                  </button>
                  <DeleteForm action={remove} id={s.id} confirm="Delete this service and all its detail items?" />
                </div>
            </div>
            {editing === s.id && (
              <div className="border-t border-slate-100 p-5">
                <ServiceForm service={s} onDone={() => setEditing(null)} />
                <ServiceItemsSection service={s} items={items} />
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No services match your search.</p>}
      </div>
    </div>
  );
}
