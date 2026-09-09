import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "../../components/ui";
import HeroSlidesManager from "./HeroSlidesManager";
import type { HeroSlide } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });
  const slides = (data as HeroSlide[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Hero Slides"
        subtitle="Homepage slideshow — images, headings, CTAs, order and timing."
      />
      <HeroSlidesManager slides={slides} />
    </div>
  );
}
