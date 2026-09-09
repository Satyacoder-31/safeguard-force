import { getSiteSettings } from "@/lib/cms/queries";
import BrochureManager from "./BrochureManager";

export const metadata = { title: "Company Brochure — Admin" };

export default async function AdminBrochurePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0A1931]">Company Brochure</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload and manage the downloadable company brochure (PDF) shown in the header navigation and homepage motto banner.
        </p>
      </div>

      <BrochureManager settings={settings} />
    </div>
  );
}
