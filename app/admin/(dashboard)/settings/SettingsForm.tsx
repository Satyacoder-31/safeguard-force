"use client";

import { useActionState } from "react";
import { saveSiteSettings } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import MediaPicker from "../../components/MediaPicker";
import type { SiteSettings } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

/** Module-level field component (not created during render). */
function TextField({ name, title, def = "", type = "text", placeholder }: { name: string; title: string; def?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={`ss-${name}`} className={label}>{title}</label>
      <input id={`ss-${name}`} name={name} type={type} defaultValue={def} placeholder={placeholder} className={input} />
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(async (_prev: unknown, fd: FormData) => {
    const res = await saveSiteSettings(_prev, fd);
    showToast(res.ok ? "Site settings saved — website updates automatically" : res.error || "Save failed", res.ok);
    return res;
  }, null);

  return (
    <form action={action} className="space-y-6">
      {state?.ok && <p className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3">Saved successfully.</p>}
      {state && !state.ok && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{state.error}</p>}

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Brand</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField name="site_name" title="Site Name" def={settings.site_name} />
          <TextField name="brand_name" title="Brand Name (sub-brand)" def={settings.brand_name} />
          <TextField name="tagline" title="Tagline" def={settings.tagline} />
        </div>
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Contact Details</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField name="primary_phone" title="Primary Phone" def={settings.primary_phone} />
          <TextField name="secondary_phone" title="Secondary Phone" def={settings.secondary_phone} />
          <TextField name="email" title="Email" type="email" def={settings.email} />
          <TextField name="whatsapp_number" title="WhatsApp Number (with country code)" def={settings.whatsapp_number} placeholder="917977179807" />
        </div>
        <div>
          <label htmlFor="ss-wa-msg" className={label}>WhatsApp Prefilled Message</label>
          <textarea id="ss-wa-msg" name="whatsapp_message" defaultValue={settings.whatsapp_message} rows={2} className={input} />
        </div>
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Address & Map</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField name="address_line_1" title="Address Line 1" def={settings.address_line_1} />
          <TextField name="address_line_2" title="Address Line 2" def={settings.address_line_2} />
          <TextField name="city" title="City" def={settings.city} />
          <TextField name="state" title="State" def={settings.state} />
          <TextField name="pincode" title="Pincode" def={settings.pincode} />
          <TextField name="country" title="Country" def={settings.country} />
        </div>
        <TextField name="google_maps_url" title="Google Maps URL" def={settings.google_maps_url} />
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Header / Footer Text</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField name="support_text" title="Support Text (top bar)" def={settings.support_text} />
          <TextField name="top_bar_text" title="Top Bar Text" def={settings.top_bar_text} />
        </div>
        <div>
          <label htmlFor="ss-footer" className={label}>Footer Description</label>
          <textarea id="ss-footer" name="footer_description" defaultValue={settings.footer_description} rows={3} className={input} />
        </div>
        <TextField name="copyright_text" title="Copyright Text" def={settings.copyright_text} />
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Social Links</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField name="facebook_url" title="Facebook URL" def={settings.facebook_url} placeholder="https://facebook.com/…" />
          <TextField name="instagram_url" title="Instagram URL" def={settings.instagram_url} />
          <TextField name="linkedin_url" title="LinkedIn URL" def={settings.linkedin_url} />
          <TextField name="youtube_url" title="YouTube URL" def={settings.youtube_url} />
          <TextField name="twitter_url" title="Twitter / X URL" def={settings.twitter_url} />
        </div>
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Logo & Colors</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <MediaPicker name="logo_url" label="Brand Logo" defaultValue={settings.logo_url} folder="logos" />
          <MediaPicker name="favicon_url" label="Favicon" defaultValue={settings.favicon_url} folder="logos" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <TextField name="primary_color" title="Primary Color" def={settings.primary_color} />
          <TextField name="secondary_color" title="Secondary / Accent Color" def={settings.secondary_color} />
        </div>
      </fieldset>

      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Company Brochure</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <MediaPicker
              name="brochure_url"
              label="Brochure PDF Document"
              defaultValue={settings.brochure_url}
              folder="brochures"
              accept="application/pdf,image/*"
            />
            {settings.brochure_url && (
              <div className="mt-2">
                <a
                  href={settings.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C5A253] hover:underline inline-flex items-center gap-1 font-bold"
                >
                  View current brochure →
                </a>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <TextField
              name="brochure_title"
              title="Brochure Button Title / Label"
              def={settings.brochure_title || "SAFE Guard FORCE Corporate Brochure"}
            />
            <label className="flex items-center gap-2 text-sm text-slate-700 pt-2 cursor-pointer">
              <input
                type="checkbox"
                name="brochure_enabled"
                defaultChecked={settings.brochure_enabled ?? true}
                className="w-4 h-4 accent-[#C5A253]"
              />
              <span className="font-medium">Enable Brochure link &amp; button on website</span>
            </label>
          </div>
        </div>
      </fieldset>

      <div className="sticky bottom-4 bg-white border border-slate-200 shadow-lg px-5 py-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">Changes appear on the website within a minute.</span>
        <SubmitButton className="bg-[#C5A253] hover:bg-[#B8941F] text-[#0A1931] px-8 py-3 text-xs tracking-widest uppercase font-black">
          Save Site Settings
        </SubmitButton>
      </div>
    </form>
  );
}
