"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBrochureSettings } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import MediaPicker from "../../components/MediaPicker";
import type { SiteSettings } from "@/types/database";

export default function BrochureManager({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState(settings.brochure_url || "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await saveBrochureSettings(fd);
      showToast(
        res.ok ? "Brochure updated — website reflects changes immediately" : res.error || "Save failed",
        res.ok
      );
      if (res.ok) {
        router.refresh();
      }
    } catch {
      showToast("Could not save brochure. Please try again.", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <form onSubmit={onSubmit} className="bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#0A1931] mb-1">
              Brochure File (PDF)
            </h3>
            <p className="text-slate-500 text-xs mb-4">
              Upload a new PDF brochure or enter an external URL. Visitors can view or download it directly from the site.
            </p>
            <MediaPicker
              name="brochure_url"
              label="Brochure PDF Document"
              defaultValue={settings.brochure_url}
              folder="brochures"
              accept="application/pdf,image/*"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5">
                Brochure Button Text / Label
              </label>
              <input
                name="brochure_title"
                defaultValue={settings.brochure_title || "SAFE Guard FORCE Corporate Brochure"}
                placeholder="e.g. SAFE Guard FORCE Corporate Brochure"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Shown as the tooltip or label on the website download button.
              </span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-100 bg-slate-50 rounded">
                <input
                  type="checkbox"
                  name="brochure_enabled"
                  defaultChecked={settings.brochure_enabled ?? true}
                  className="w-4 h-4 accent-[#C5A253]"
                />
                <div>
                  <div className="text-sm font-bold text-slate-800">Show Brochure on Website</div>
                  <div className="text-xs text-slate-500">
                    Displays &quot;Brochure&quot; in the header navigation and &quot;View Brochure →&quot; in the motto banner.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {settings.brochure_url ? (
              <a
                href={settings.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C5A253] font-bold hover:underline flex items-center gap-1.5"
              >
                <span>📄</span> Open Current Brochure in New Tab
              </a>
            ) : (
              <span className="text-xs text-slate-400">No brochure uploaded yet</span>
            )}

            <SubmitButton className="bg-[#C5A253] hover:bg-[#B8941F] text-[#0A1931] px-8 py-3 text-xs tracking-widest uppercase font-black">
              {loading ? "Saving…" : "Save Brochure"}
            </SubmitButton>
          </div>
        </form>
      </div>

      <div className="space-y-5">
        <div className="bg-white border border-slate-200 p-5 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#0A1931]">
            Where Brochure Appears
          </h4>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex gap-2 items-start">
              <span className="text-[#C5A253] font-bold">1.</span>
              <span><strong>Header Navigation:</strong> &quot;BROCHURE&quot; link in the top menu.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-[#C5A253] font-bold">2.</span>
              <span><strong>Homepage Banner:</strong> &quot;VIEW BROCHURE →&quot; gold button next to the motto.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-[#C5A253] font-bold">3.</span>
              <span><strong>Mobile Menu:</strong> Direct brochure download tap option.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0A1931] text-white p-5 space-y-3">
          <div className="text-[#C5A253] text-[11px] uppercase tracking-widest font-bold">Quick Tip</div>
          <p className="text-xs text-white/70 leading-relaxed">
            Upload PDF files up to 20 MB. Once uploaded, the download link will instantly update across all website visitor pages.
          </p>
        </div>
      </div>
    </div>
  );
}
