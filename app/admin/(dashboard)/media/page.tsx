import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader, EmptyState } from "../../components/ui";
import MediaLibraryClient from "./MediaLibraryClient";
import type { MediaItem } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const items = (data as MediaItem[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="Upload and manage website images. Files are stored in Supabase Storage (website-media bucket)."
      />
      <div className="mb-6">
        <MediaLibraryClient items={[]} uploadOnly />
      </div>
      {items.length === 0 ? (
        <EmptyState title="No media uploaded yet" hint="Upload your first image above, or upload directly from any content editor." />
      ) : (
        <MediaLibraryClient items={items} />
      )}
    </div>
  );
}
