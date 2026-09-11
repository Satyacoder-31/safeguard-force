"use client";

import { useActionState } from "react";
import { saveContactSettings } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import MediaPicker from "../../components/MediaPicker";
import type { ContactSettings } from "@/types/database";

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

export default function ContactForm({ contact }: { contact: ContactSettings | null }) {
  const [state, action] = useActionState(async (_prev: unknown, fd: FormData) => {
    const res = await saveContactSettings(_prev, fd);
    showToast(res.ok ? "Contact page saved — website updates automatically" : res.error || "Save failed", res.ok);
    return res;
  }, null);

  const addr = contact?.address;

  return (
    <form action={action} className="space-y-6">
      {state?.ok && <p className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3">Saved successfully.</p>}
      {state && !state.ok && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{state.error}</p>}

      {/* Page Hero & Imagery */}
      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Contact Page Hero & Images</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Page Heading (line breaks allowed)</label>
            <textarea name="contact_heading" defaultValue={contact?.contact_heading} rows={3} className={input} />
          </div>
          <div>
            <label className={label}>Page Subtitle</label>
            <textarea name="contact_subtitle" defaultValue={contact?.contact_subtitle} rows={3} className={input} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <MediaPicker
            name="hero_image_url"
            label="Contact Hero Banner Image"
            defaultValue={contact?.hero_image_url || "/images/team-inspection.png"}
            folder="contact"
          />
          <MediaPicker
            name="map_image_url"
            label="Office / Map Preview Card Image"
            defaultValue={contact?.map_image_url || "/images/mumbai-business-district.png"}
            folder="contact"
          />
        </div>
      </fieldset>

      {/* Contact Channels */}
      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Phone, WhatsApp & Email</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Phone Numbers (one per line)</label>
            <textarea
              name="phone_numbers"
              defaultValue={(contact?.phone_numbers ?? ["7977179807", "9136645289"]).join("\n")}
              rows={3}
              className={input}
            />
          </div>
          <div className="space-y-3">
            <div>
              <label className={label}>Official Email</label>
              <input name="email" type="email" defaultValue={contact?.email} className={input} />
            </div>
            <div>
              <label className={label}>WhatsApp Number (e.g. 917977179807)</label>
              <input name="whatsapp_number" defaultValue={contact?.whatsapp_number} className={input} />
            </div>
          </div>
        </div>
        <div>
          <label className={label}>WhatsApp Prefilled Message</label>
          <input name="whatsapp_message" defaultValue={contact?.whatsapp_message} className={input} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Assistance Hours</label>
            <input name="assistance_hours" defaultValue={contact?.assistance_hours} placeholder="24/7 Professional Assistance" className={input} />
          </div>
          <div>
            <label className={label}>Assistance Note</label>
            <input name="assistance_note" defaultValue={contact?.assistance_note} placeholder="Prompt response for enquiries" className={input} />
          </div>
        </div>
      </fieldset>

      {/* Head Office Address & Map */}
      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Head Office & Map</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Address Line 1</label>
            <input name="addr_line1" defaultValue={addr?.line1} className={input} />
          </div>
          <div>
            <label className={label}>Address Line 2</label>
            <input name="addr_line2" defaultValue={addr?.line2} className={input} />
          </div>
          <div>
            <label className={label}>City</label>
            <input name="addr_city" defaultValue={addr?.city} className={input} />
          </div>
          <div>
            <label className={label}>Pincode</label>
            <input name="addr_pincode" defaultValue={addr?.pincode} className={input} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Google Maps URL</label>
            <input name="map_url" defaultValue={contact?.map_url} className={input} />
          </div>
          <div>
            <label className={label}>Map Landmark Note</label>
            <input name="map_note" defaultValue={contact?.map_note} className={input} />
          </div>
        </div>
      </fieldset>

      {/* Form Settings & Property Types */}
      <fieldset className="border border-slate-200 bg-white p-5 space-y-4">
        <legend className="px-2 text-xs font-bold tracking-widest uppercase text-[#0A1931]">Inquiry Form Settings</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Form Heading</label>
            <input name="form_heading" defaultValue={contact?.form_heading} className={input} />
          </div>
          <div>
            <label className={label}>Form Subtitle</label>
            <input name="form_subtitle" defaultValue={contact?.form_subtitle} className={input} />
          </div>
        </div>
        <div>
          <label className={label}>Property Types for Dropdown (one per line)</label>
          <textarea
            name="property_types"
            defaultValue={(contact?.property_types ?? []).join("\n")}
            rows={4}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Form Submit / CTA Button Text</label>
          <input name="cta_text" defaultValue={contact?.cta_text} className={input} />
        </div>
      </fieldset>

      <div className="flex justify-end pt-2">
        <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-10 py-3 text-xs font-black uppercase tracking-widest">
          Save Contact Page Settings
        </SubmitButton>
      </div>
    </form>
  );
}
