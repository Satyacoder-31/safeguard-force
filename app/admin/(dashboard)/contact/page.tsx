import { getContactSettings } from "@/lib/cms/queries";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactAdminPage() {
  const contact = await getContactSettings();

  return (
    <div className="space-y-6 max-w-[1000px]">
      <div>
        <div className="text-[#C5A253] text-[11px] tracking-[0.20em] uppercase font-bold">Content Management</div>
        <h1 className="text-2xl font-black text-[#0A1931] tracking-tight mt-1">Contact Page &amp; Photos</h1>
        <p className="text-slate-500 text-sm mt-1">
          Customize the Contact page hero image, map card image, office addresses, emergency phone lines and consultation inquiry options.
        </p>
      </div>

      <ContactForm contact={contact} />
    </div>
  );
}
