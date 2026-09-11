import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";

// Load .env.local if present
if (existsSync(".env.local")) {
  const envText = readFileSync(".env.local", "utf8");
  for (const line of envText.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function updateDb() {
  console.log("Updating live Supabase database rows...");

  // 1. Update site_settings
  const { data: ssData, error: ssError } = await supabase
    .from("site_settings")
    .update({
      primary_phone: "7977179807",
      secondary_phone: "9136645289",
      email: "safeguardforce02@gmail.com",
      whatsapp_number: "917977179807",
      instagram_url: "https://www.instagram.com/safeguardforce",
      linkedin_url: "https://www.linkedin.com/company/safeguardforce",
      top_bar_text: "Pan-India • Integrated Facility & Security Solutions"
    })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (ssError) console.error("Error updating site_settings:", ssError);
  else console.log("✅ Updated site_settings");

  // 2. Update contact_settings
  const { data: csData, error: csError } = await supabase
    .from("contact_settings")
    .update({
      email: "safeguardforce02@gmail.com",
      phone_numbers: ["7977179807", "9136645289"],
      whatsapp_number: "917977179807"
    })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (csError) console.error("Error updating contact_settings:", csError);
  else console.log("✅ Updated contact_settings");

  // 3. Update hero_slides
  const { data: hsData, error: hsError } = await supabase
    .from("hero_slides")
    .update({
      phone_number: "7977179807",
      phone_button_text: "Call 7977179807"
    })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (hsError) console.error("Error updating hero_slides:", hsError);
  else console.log("✅ Updated hero_slides");

  // 4. Update homepage_sections (why_choose_us eyebrow)
  const { data: secWhyData, error: secWhyError } = await supabase
    .from("homepage_sections")
    .update({
      eyebrow: "WHY CHOOSE US",
      title: "Why Organizations Trust SAFE Guard FORCE"
    })
    .eq("section_key", "why_choose_us");

  if (secWhyError) console.error("Error updating why_choose_us section:", secWhyError);
  else console.log("✅ Updated homepage_sections (why_choose_us)");

  // 5. Update homepage_sections (trust_intro items)
  const { data: trustData, error: trustError } = await supabase
    .from("homepage_sections")
    .update({
      items: [
        { a: "24/7", b: "Support" },
        { a: "Pan-India", b: "Presence" },
        { a: "One-Roof", b: "Solutions" }
      ]
    })
    .eq("section_key", "trust_intro");

  if (trustError) console.error("Error updating trust_intro section:", trustError);
  else console.log("✅ Updated homepage_sections (trust_intro)");

  console.log("🎉 Database content update completed!");
}

updateDb().catch(console.error);
