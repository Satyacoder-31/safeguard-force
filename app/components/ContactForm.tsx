"use client";

import { useActionState, useState } from "react";
import { submitEnquiry, type SubmitEnquiryResult } from "@/lib/actions/enquiries";
import { telHref, whatsappHref } from "@/lib/utils";
import type { ContactSettings, SiteSettings } from "@/types/database";

type ActionState = SubmitEnquiryResult | null;

const inputCls =
  "mt-2 w-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C5A253] focus:ring-1 focus:ring-[#C5A253] transition";
const labelCls = "text-[#0A1931] text-xs tracking-[0.12em] uppercase font-bold";
const errorCls = "text-red-600 text-xs mt-1";

export default function ContactForm({
  contact,
  settings,
  serviceOptions,
}: {
  contact: ContactSettings | null;
  settings: SiteSettings;
  serviceOptions: string[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const payload = {
        full_name: String(formData.get("full_name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        company_name: String(formData.get("company_name") ?? ""),
        location: String(formData.get("location") ?? ""),
        property_type: String(formData.get("property_type") ?? ""),
        service_required: String(formData.get("service_required") ?? ""),
        message: String(formData.get("message") ?? ""),
        website: String(formData.get("website") ?? ""),
      };
      return submitEnquiry(payload);
    },
    null,
  );

  const [formKey, setFormKey] = useState(0);

  if (state?.ok) {
    return (
      <div className="border border-slate-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <div className="bg-[#0A1931] px-8 py-6">
          <h2 className="text-white font-black text-xl tracking-tight">{contact?.form_heading || "Request a Consultation"}</h2>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h3 className="text-[#0A1931] font-black text-xl">Thank you — your enquiry has been received.</h3>
          <p className="text-slate-500 text-sm leading-relaxed mt-3 max-w-[420px] mx-auto">
            Our team will contact you shortly. For urgent requirements, call us at {settings.primary_phone} — available {contact?.assistance_hours || "24/7"}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
            <a href={telHref(settings.primary_phone)} className="bg-[#0A1931] text-white px-6 py-3 text-xs tracking-[0.14em] uppercase font-bold">Call {settings.primary_phone}</a>
            <button
              onClick={() => { setFormKey((k) => k + 1); }}
              className="border border-slate-300 px-6 py-3 text-xs tracking-[0.14em] uppercase font-bold text-[#0A1931]"
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fieldError = (name: string) => state && !state.ok ? state.fieldErrors?.[name] : undefined;

  return (
    <div className="border border-slate-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]" key={formKey}>
      <div className="bg-[#0A1931] px-8 py-6">
        <h2 className="text-white font-black text-xl tracking-tight">{contact?.form_heading || "Request a Consultation"}</h2>
        <p className="text-white/60 text-sm mt-1">{contact?.form_subtitle || "Tell us about your premises and service needs — we'll respond promptly."}</p>
      </div>

      <form action={formAction} className="p-8 space-y-5" noValidate>
        {/* Honeypot — hidden from humans */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {state && !state.ok && !state.fieldErrors && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{state.error}</div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cf-name" className={labelCls}>Full Name *</label>
            <input id="cf-name" name="full_name" required placeholder="Your name" className={inputCls} />
            {fieldError("full_name") && <p className={errorCls}>{fieldError("full_name")}</p>}
          </div>
          <div>
            <label htmlFor="cf-phone" className={labelCls}>Phone Number *</label>
            <input id="cf-phone" name="phone" required type="tel" inputMode="tel" placeholder="93235 81437" className={inputCls} />
            {fieldError("phone") && <p className={errorCls}>{fieldError("phone")}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cf-company" className={labelCls}>Company / Society Name</label>
            <input id="cf-company" name="company_name" placeholder="e.g. Green Valley CHS / Acme Corp" className={inputCls} />
          </div>
          <div>
            <label htmlFor="cf-email" className={labelCls}>Email</label>
            <input id="cf-email" name="email" type="email" placeholder="you@company.com" className={inputCls} />
            {fieldError("email") && <p className={errorCls}>{fieldError("email")}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cf-location" className={labelCls}>Location</label>
            <input id="cf-location" name="location" placeholder="e.g. Ghatkopar, Powai, Andheri" className={inputCls} />
          </div>
          <div>
            <label htmlFor="cf-property" className={labelCls}>Property Type</label>
            <select id="cf-property" name="property_type" className={`${inputCls} bg-white`} defaultValue="">
              <option value="">Select property type</option>
              {(contact?.property_types ?? []).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="cf-service" className={labelCls}>Service Required *</label>
          <select id="cf-service" name="service_required" required className={`${inputCls} bg-white`} defaultValue="">
            <option value="">Select a service</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Multiple / Integrated Services">Multiple / Integrated Services</option>
          </select>
          {fieldError("service_required") && <p className={errorCls}>{fieldError("service_required")}</p>}
        </div>

        <div>
          <label htmlFor="cf-message" className={labelCls}>Message</label>
          <textarea id="cf-message" name="message" rows={4} placeholder="Describe your premises, headcount, shift timings and any specific requirements..." className={inputCls} />
        </div>

        <button type="submit" disabled={pending} className="w-full bg-[#C5A253] hover:bg-[#B8941F] disabled:opacity-60 disabled:cursor-not-allowed text-[#0A1931] py-4 text-xs tracking-[0.18em] uppercase font-black transition">
          {pending ? "Sending…" : (contact?.cta_text || "Request a Consultation →")}
        </button>

        <p className="text-slate-400 text-xs leading-relaxed text-center">
          By submitting, you agree to our Privacy Policy. Investigation services are handled confidentially and lawfully.
        </p>

        <div className="flex gap-3 pt-2">
          <a href={telHref(settings.primary_phone)} className="flex-1 border border-slate-200 py-3 text-center text-xs tracking-[0.14em] uppercase font-bold text-[#0A1931] hover:bg-slate-50">Call {settings.primary_phone}</a>
          <a href={whatsappHref(settings.whatsapp_number, contact?.whatsapp_message || settings.whatsapp_message)} target="_blank" rel="noopener noreferrer" className="flex-1 border border-slate-200 py-3 text-center text-xs tracking-[0.14em] uppercase font-bold text-[#0A1931] hover:bg-slate-50">WhatsApp Us</a>
        </div>
      </form>
    </div>
  );
}
