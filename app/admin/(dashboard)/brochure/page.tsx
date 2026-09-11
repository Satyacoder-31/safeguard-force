import { getSiteSettings, getHomepageSection, getBrochurePageSettings } from "@/lib/cms/queries";
import BrochureManager from "./BrochureManager";

export const metadata = { title: "Company Brochure — Admin" };

export default async function AdminBrochurePage() {
  const [settings, brochureSection, brochurePageSettings] = await Promise.all([
    getSiteSettings(),
    getHomepageSection("brochure"),
    getBrochurePageSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0A1931]">Company Brochure & Brochure Page</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload PDF brochure, customize the standalone Brochure Page (/brochure), and manage the Homepage Brochure section text and features.
        </p>
      </div>

      <BrochureManager
        settings={settings}
        section={brochureSection}
        brochurePageSettings={brochurePageSettings}
      />
    </div>
  );
}


