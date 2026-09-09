import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import { getContactSettings, getSiteSettings, getServices } from "@/lib/cms/queries";
import { telHref, whatsappHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactSettings();
  return {
    title: "Contact Us — SAFE Guard FORCE",
    description: contact?.contact_subtitle || "Reach our team for a free consultation, site assessment or confidential discussion.",
  };
}

export default async function ContactPage() {
  const [contact, settings, services] = await Promise.all([
    getContactSettings(),
    getSiteSettings(),
    getServices(),
  ]);

  const addr = contact?.address;
  const primaryPhone = contact?.phone_numbers?.[0] || settings.primary_phone;
  const secondaryPhone = contact?.phone_numbers?.[1] || settings.secondary_phone;

  return (
    <>
      <PageHero
        eyebrow="Contact SAFE Guard FORCE"
        title={contact?.contact_heading || "Let's Make Your\nPremises Safer,\nCleaner & Better Managed."}
        subtitle={contact?.contact_subtitle || "Reach our team for a free consultation, site assessment or confidential discussion. Mumbai-based, nationwide capability."}
        image={contact?.hero_image_url || "/images/team-inspection.png"}
      />

      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A1931] p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#C5A253] flex items-center justify-center text-[#0A1931] font-black text-sm">SG</div>
                <div>
                  <div className="font-black tracking-widest text-sm">SAFE GUARD FORCE</div>
                  <div className="text-[#C5A253] text-[10px] tracking-[0.24em] uppercase font-semibold">
                    {settings.tagline && !settings.tagline.toLowerCase().includes("nationwide") ? settings.tagline : "Your Security. Our Priority."}
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="text-white/40 text-[11px] tracking-[0.18em] uppercase font-bold">Call Us — 24/7</div>
                  <a href={telHref(primaryPhone)} className="block text-2xl font-black mt-1 hover:text-[#C5A253] transition">{primaryPhone}</a>
                  {secondaryPhone && (
                    <a href={telHref(secondaryPhone)} className="block text-xl font-bold hover:text-[#C5A253] transition">{secondaryPhone}</a>
                  )}
                  <div className="flex gap-2 mt-3">
                    <a href={telHref(primaryPhone)} className="flex-1 bg-[#C5A253] text-[#0A1931] text-center py-3 text-xs tracking-[0.16em] uppercase font-bold">Call Now</a>
                    <a href={whatsappHref(settings.whatsapp_number, contact?.whatsapp_message || settings.whatsapp_message)} target="_blank" rel="noopener noreferrer" className="flex-1 border border-white/20 text-center py-3 text-xs tracking-[0.16em] uppercase font-bold hover:bg-white hover:text-[#0A1931] transition">WhatsApp</a>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <div className="text-white/40 text-[11px] tracking-[0.18em] uppercase font-bold">Head Office</div>
                  <p className="text-white/80 text-sm leading-relaxed mt-2">
                    {addr?.line1 || settings.address_line_1}<br />
                    {addr?.line2 || settings.address_line_2}<br />
                    {addr?.city || settings.city} — {addr?.pincode || settings.pincode}
                  </p>
                  <a href={contact?.map_url || settings.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex mt-3 bg-white text-[#0A1931] px-4 py-2 text-xs tracking-[0.14em] uppercase font-bold">Get Directions →</a>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <div className="text-white/40 text-[11px] tracking-[0.18em] uppercase font-bold">Assistance Hours</div>
                  <div className="text-white text-sm mt-2 font-semibold">{contact?.assistance_hours || "24/7 Professional Assistance"}</div>
                  <div className="text-white/60 text-xs mt-1">{contact?.assistance_note || "Prompt response for enquiries and operational support."}</div>
                </div>
              </div>
            </div>

            {/* Map card */}
            <div className="border border-slate-200 p-6 bg-[#F8FAFC]">
              <div className="text-[#0A1931] font-bold text-sm">{addr?.city || settings.city}</div>
              <p className="text-slate-500 text-sm mt-1">{contact?.map_note || "Located opposite Shreyash Cinema on LBS Marg — accessible from Ghatkopar Metro and Eastern Express Highway."}</p>
              <div className="mt-4 h-48 bg-slate-200 relative overflow-hidden">
                <img src={contact?.map_image_url || "/images/mumbai-business-district.png"} alt="Map" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#0A1931] text-white px-4 py-2 text-xs tracking-widest uppercase font-bold shadow-lg">📍 {addr?.line1 || "Kailash Esplanade, LBS Marg"}</div>
                </div>
              </div>
              <a href={contact?.map_url || settings.google_maps_url} target="_blank" rel="noopener noreferrer" className="block mt-3 bg-[#0A1931] text-white text-center py-3 text-xs tracking-[0.16em] uppercase font-bold">Open in Google Maps</a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm
              contact={contact}
              settings={settings}
              serviceOptions={services.filter((s) => s.is_active).map((s) => s.name)}
            />
          </div>
        </div>
      </section>
    </>
  );
}
