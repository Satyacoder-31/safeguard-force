import ServicePage from "../services/[slug]/page";

export const revalidate = 300;

export async function generateMetadata() {
  const mod = await import("../services/[slug]/page");
  return mod.generateMetadata({ params: Promise.resolve({ slug: "detective-services" }) });
}

export default async function Page() {
  const mod = await import("../services/[slug]/page");
  return mod.default({ params: Promise.resolve({ slug: "detective-services" }) });
}
