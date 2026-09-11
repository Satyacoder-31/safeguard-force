import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";

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

const supabase = createClient(supabaseUrl, serviceKey);

async function inspect() {
  const tables = [
    "site_settings", "contact_settings", "homepage_sections", "navigation_items",
    "services", "service_items", "industries", "about_content", "values",
    "testimonials", "statistics", "media_library", "activity_logs", "profiles"
  ];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select("*").limit(1);
    if (error) console.log(`Table ${t}: Error (${error.message})`);
    else console.log(`Table ${t}: OK (${Object.keys(data[0] || {}).join(", ")})`);
  }
}

inspect().catch(console.error);
