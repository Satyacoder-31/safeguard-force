"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateHomepageSection, toggleHomepageSection, toggleServiceFeatured } from "@/lib/actions/admin";
import { SubmitButton, showToast, Collapsible } from "../../components/ui";
import MediaPicker from "../../components/MediaPicker";
import type { HomepageSection, Service } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

const SECTION_LABELS: Record<string, string> = {
  trust_intro: "Trust Intro (A Safer, Smarter Tomorrow)",
  services: "Core Services (Section Header & Cards)",
  why_choose_us: "Why Organizations Trust Us",
  process: "How We Work",
  industries: "Industries We Serve Header",
  personnel: "Our Personnel",
  stats_band: "Stats Band (managed under Statistics)",
  final_cta: "Final Call-To-Action",
};

function HomepageCoreServicesEditor({ services }: { services: Service[] }) {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const featured = services
    .filter((s) => s.is_featured)
    .sort((a, b) => a.sort_order - b.sort_order);

  const nonFeatured = services.filter((s) => !s.is_featured);

  async function handleToggle(serviceId: string, willBeFeatured: boolean) {
    setTogglingId(serviceId);
    const res = await toggleServiceFeatured(serviceId, willBeFeatured);
    setTogglingId(null);
    showToast(
      res.ok
        ? willBeFeatured
          ? "Service added to Homepage Core Services!"
          : "Service removed from Homepage Core Services"
        : res.error || "Update failed",
      res.ok
    );
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-8 pt-6 border-t-2 border-slate-200/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-base">★</span>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0A1931]">
              Homepage Core Services Cards ({featured.length} Displayed)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            These services are currently featured in the Core Services grid on the Homepage. Clicking <strong>Learn More →</strong> redirects visitors to the destination URL below.
          </p>
        </div>
        <Link
          href="/admin/services"
          className="text-[11px] font-bold uppercase tracking-wider text-[#C5A253] hover:text-[#B8941F] flex items-center gap-1 shrink-0"
        >
          Open Services Manager →
        </Link>
      </div>

      {/* Featured Services List */}
      <div className="space-y-2.5">
        {featured.map((s, idx) => {
          const destination = s.redirect_url || `/services/${s.slug}`;
          return (
            <div
              key={s.id}
              className="bg-amber-50/40 border border-amber-200/70 p-3.5 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#0A1931] text-amber-400 text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <img
                  src={s.card_image_url}
                  alt=""
                  className="w-12 h-12 object-cover border border-slate-200 rounded-sm shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-[#0A1931] truncate">{s.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">order: {s.sort_order}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>
                      Learn More Link:{" "}
                      <code className="text-[11px] font-bold text-slate-700 bg-white px-1.5 py-0.5 border border-slate-200 rounded">
                        {destination}
                      </code>
                    </span>
                    <a
                      href={destination}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C5A253] hover:underline font-bold text-[11px]"
                    >
                      View Live ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Link
                  href={`/admin/services`}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:border-[#0A1931] rounded-sm"
                >
                  Edit Page Content ↗
                </Link>
                <button
                  type="button"
                  onClick={() => handleToggle(s.id, false)}
                  disabled={togglingId === s.id}
                  className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-[11px] font-bold uppercase tracking-wider rounded-sm transition"
                >
                  {togglingId === s.id ? "Removing…" : "Remove from Home"}
                </button>
              </div>
            </div>
          );
        })}

        {featured.length === 0 && (
          <p className="text-xs text-amber-800 bg-amber-50 p-4 border border-amber-200">
            No services are currently featured on the homepage. Add services below to show them in the Core Services section.
          </p>
        )}
      </div>

      {/* Add non-featured service to homepage */}
      {nonFeatured.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-2 mt-3">
          <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-600">
            + Add Another Service to Homepage Core Services:
          </h5>
          <div className="flex flex-wrap gap-2">
            {nonFeatured.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleToggle(s.id, true)}
                disabled={togglingId === s.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-xs font-semibold text-slate-700 rounded-sm transition"
              >
                <span>+</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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

export default function HomepageSectionsManager({
  sections,
  services = [],
}: {
  sections: HomepageSection[];
  services?: Service[];
}) {
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

          {s.section_key === "services" && services.length > 0 && (
            <HomepageCoreServicesEditor services={services} />
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

