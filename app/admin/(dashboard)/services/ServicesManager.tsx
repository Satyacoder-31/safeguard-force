"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertService, upsertServiceItem, toggleServiceFeatured } from "@/lib/actions/admin";
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
    <form onSubmit={onSubmit} className="space-y-6">
      {service && <input type="hidden" name="id" value={service.id} />}

      {/* Destination Page Live Preview Banner */}
      {service && (
        <div className="bg-[#0A1931] text-white p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#C5A253] text-[#0A1931] px-2 py-0.5 rounded-sm">
                Target Page
              </span>
              <span className="font-bold text-sm text-white">{service.name}</span>
            </div>
            <div className="text-xs text-white/60 font-mono mt-1">
              Destination URL: /services/{service.slug}
            </div>
          </div>
          <a
            href={service.redirect_url || `/services/${service.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#C5A253] border border-[#C5A253]/40 rounded-sm text-xs font-bold tracking-wider uppercase transition self-start sm:self-auto"
          >
            <span>View Live Page</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      )}

      {/* Section 1: Homepage Card & Action Settings */}
      <div className="border border-slate-200 bg-slate-50/50 p-5 space-y-4 rounded-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#0A1931] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A253]" />
            Homepage Core Service Card Settings
          </h3>
          <span className="text-[11px] text-slate-500">Controls the card displayed on the Homepage Core Services grid</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Service Name (Title on Card) *</label>
            <input name="name" required value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="e.g. Security Services" />
          </div>
          <div>
            <label className={label}>Slug (URL Key) — leave blank to auto-generate</label>
            <input name="slug" defaultValue={service?.slug} className={input} placeholder={name ? slugify(name) : "security-services"} />
          </div>
        </div>

        <div>
          <label className={label}>Short Description (Shown on Homepage Card)</label>
          <textarea name="short_description" defaultValue={service?.short_description} rows={2} className={input} placeholder="Brief summary displayed on the card..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <MediaPicker name="card_image_url" label="Card Photo (Homepage Grid Thumbnail)" defaultValue={service?.card_image_url} folder="services" />
          <div>
            <label className={label}>Card Icon</label>
            <select name="icon_name" defaultValue={service?.icon_name || "shield"} className={`${input} bg-white`}>
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>&apos;Learn More&apos; Redirect URL (Custom Target Page)</label>
          <input
            name="redirect_url"
            defaultValue={service?.redirect_url}
            className={input}
            placeholder={`/services/${service?.slug || "security-services"}`}
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Where the <strong>&quot;Learn More →&quot;</strong> button on the homepage card takes visitors. Leave blank to use the standard service page: <span className="font-mono text-slate-700">/services/{service?.slug || "slug"}</span>. You can also specify dedicated hub pages like <span className="font-mono text-slate-700">/security-services</span> or <span className="font-mono text-slate-700">/facility-management</span>.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-2 items-end">
          <div>
            <label className={label}>Homepage Sort Order</label>
            <input name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} className={input} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-800 font-semibold pb-2">
            <input type="checkbox" name="is_featured" defaultChecked={service?.is_featured ?? true} className="accent-[#C5A253] w-4 h-4" />
            <span>⭐ Feature in Core Services on Homepage</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-800 pb-2">
            <input type="checkbox" name="is_active" defaultChecked={service?.is_active ?? true} className="accent-[#C5A253] w-4 h-4" />
            <span>Active (visible on website)</span>
          </label>
        </div>
      </div>

      {/* Section 2: Destination Service Page Content */}
      <div className="border border-slate-200 bg-white p-5 space-y-4 rounded-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#0A1931] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Destination Page Content (Opened by &apos;Learn More&apos;)
          </h3>
          <span className="text-[11px] text-slate-500">Edit the page content visitors see when they click Learn More</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Page Eyebrow (Small Tag above Title)</label>
            <input name="eyebrow" defaultValue={service?.eyebrow} className={input} placeholder="e.g. Guarding & Protection" />
          </div>
          <div>
            <label className={label}>Page Hero Title (Line breaks allowed)</label>
            <textarea name="hero_title" defaultValue={service?.hero_title} rows={2} className={input} placeholder="Main title at the top of the service page" />
          </div>
        </div>

        <div>
          <label className={label}>Page Hero Subtitle</label>
          <textarea name="hero_subtitle" defaultValue={service?.hero_subtitle} rows={2} className={input} placeholder="Subtitle displayed under hero title" />
        </div>

        <MediaPicker name="hero_image_url" label="Page Hero Banner Image (Top of Service Page)" defaultValue={service?.hero_image_url} folder="services" />

        <div>
          <label className={label}>Full Description (Main Body of Service Page)</label>
          <textarea name="full_description" defaultValue={service?.full_description} rows={4} className={input} placeholder="Comprehensive description of this service and capabilities..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className={label}>SEO Meta Title</label>
            <input name="meta_title" defaultValue={service?.meta_title} className={input} placeholder="Service Page Browser Title" />
          </div>
          <div>
            <label className={label}>SEO Meta Description</label>
            <textarea name="meta_description" defaultValue={service?.meta_description} rows={2} className={input} placeholder="Search engine snippet description" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onDone} className="border border-slate-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50">Cancel</button>
        <SubmitButton className="bg-[#C5A253] hover:bg-[#B8941F] text-[#0A1931] px-8 py-2.5 text-xs font-black uppercase tracking-widest shadow-md">
          {service ? "Save Service & Page" : "Add Service"}
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
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const featuredCount = services.filter((s) => s.is_featured).length;

  const filtered = services.filter((s) => {
    if (filter === "featured" && !s.is_featured) return false;
    if (query) return s.name.toLowerCase().includes(query.toLowerCase()) || s.slug.toLowerCase().includes(query.toLowerCase());
    return true;
  });

  async function handleToggleFeatured(serviceId: string, currentVal: boolean) {
    setTogglingId(serviceId);
    const res = await toggleServiceFeatured(serviceId, !currentVal);
    setTogglingId(null);
    showToast(
      res.ok
        ? !currentVal
          ? "Service added to Homepage Core Services!"
          : "Service removed from Homepage Core Services"
        : res.error || "Update failed",
      res.ok
    );
    if (res.ok) router.refresh();
  }

  async function remove(id: string) {
    const { deleteService } = await import("@/lib/actions/admin");
    const res = await deleteService(id);
    showToast(res.ok ? "Service deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.refresh();
    return res;
  }

  return (
    <div className="space-y-4">
      {/* Top Banner explaining Core Services */}
      <div className="bg-[#0A1931]/5 border border-[#0A1931]/10 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">★</span>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0A1931]">
              Homepage Core Services ({featuredCount} Active)
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Services marked with <span className="font-semibold text-amber-700">⭐ Featured</span> are displayed in the Homepage "Core Services" section. Clicking <strong>Learn More →</strong> redirects to either the service detail page (<code>/services/[slug]</code>) or your custom URL, and all page content is editable below.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              filter === "all" ? "bg-[#0A1931] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
              filter === "featured" ? "bg-amber-500 text-[#0A1931]" : "bg-white border border-amber-300 text-amber-700 hover:bg-amber-50"
            }`}
          >
            ⭐ Core Services ({featuredCount})
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or slug…"
          className="w-full sm:w-72 border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]"
        />
        <button
          onClick={() => setAdding((a) => !a)}
          className="bg-[#0A1931] text-white px-5 py-2.5 text-xs tracking-widest uppercase font-bold shrink-0 hover:bg-[#142850] transition"
        >
          {adding ? "Close" : "+ Add Service"}
        </button>
      </div>

      {adding && (
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <ServiceForm onDone={() => setAdding(false)} />
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((s, i) => {
          const destinationUrl = s.redirect_url || `/services/${s.slug}`;
          const isFeatured = !!s.is_featured;

          return (
            <div key={s.id} className={`border bg-white transition ${isFeatured ? "border-amber-200 ring-1 ring-amber-200/50" : "border-slate-200"}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 px-4 py-3.5">
                <div className="relative shrink-0">
                  <img src={s.card_image_url} alt="" className="w-14 h-14 object-cover border border-slate-100 rounded-sm" />
                  {isFeatured && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow" title="Featured in Homepage Core Services">
                      ★
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#0A1931]">{s.name}</span>
                    {isFeatured && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        ⭐ Homepage Core Service (Sort: {s.sort_order})
                      </span>
                    )}
                    {!s.is_active && (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      Learn More URL:{" "}
                      <strong className="text-slate-800 font-mono text-[11px]">{destinationUrl}</strong>
                    </span>
                    <a
                      href={destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C5A253] hover:underline font-bold text-[11px]"
                    >
                      View Live ↗
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* 1-Click Homepage Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(s.id, isFeatured)}
                    disabled={togglingId === s.id}
                    title={isFeatured ? "Click to remove from Homepage Core Services" : "Click to display in Homepage Core Services"}
                    className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition rounded-sm border ${
                      isFeatured
                        ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {togglingId === s.id ? "Updating…" : isFeatured ? "⭐ In Homepage" : "+ Add to Homepage"}
                  </button>

                  <button
                    onClick={() => setEditing(editing === s.id ? null : s.id)}
                    className="border border-slate-200 bg-white hover:border-[#0A1931] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700"
                  >
                    {editing === s.id ? "Close" : "Edit Details & Page"}
                  </button>

                  <DeleteForm action={remove} id={s.id} confirm="Delete this service and all its detail items?" />
                </div>
              </div>

              {editing === s.id && (
                <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                  <ServiceForm service={s} onDone={() => setEditing(null)} />
                  <ServiceItemsSection service={s} items={items} />
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-10 border border-dashed border-slate-200">
            No services match your criteria.
          </p>
        )}
      </div>
    </div>
  );
}

