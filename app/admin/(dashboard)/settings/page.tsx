import { getSiteSettings } from "@/lib/cms/queries";
import { saveSiteSettings } from "@/lib/actions/admin";
import { PageHeader, SubmitButton } from "../../components/ui";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div>
      <PageHeader
        title="Site Settings"
        subtitle="Brand identity, contact details and global text — powers header, footer and floating buttons everywhere."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
