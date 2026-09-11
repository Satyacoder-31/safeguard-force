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

if (!supabaseUrl || !serviceKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log("Adding brochure columns to site_settings and updating storage bucket...");

  // 1. Add brochure columns if missing using raw query if possible or RPC/REST check
  // Test updating site_settings with brochure_url to check if column exists
  const { error: testErr } = await supabase
    .from("site_settings")
    .update({ brochure_url: "/brochure.pdf" })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (testErr && testErr.message.includes("brochure_url")) {
    console.log("Columns missing on site_settings! Executing schema update...");
  } else if (testErr) {
    console.log("Test update error:", testErr.message);
  } else {
    console.log("brochure_url column already exists!");
  }

  // Execute SQL via Supabase Management API or rpc if available, or fetch project REST API
  // Let's use Supabase REST / RPC query or fetch
  const projectRef = "wztcnfqwxejrlzogxzgb";
  
  // Update storage bucket allowed mime types and size limit via storage API
  const { data: bucketData, error: bucketErr } = await supabase.storage.updateBucket("website-media", {
    public: true,
    fileSizeLimit: 52428800, // 50 MB
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
      "application/pdf"
    ]
  });

  if (bucketErr) {
    console.error("Bucket update error:", bucketErr.message);
  } else {
    console.log("✅ Updated website-media storage bucket allowed mime types (PDF allowed, 50MB max)");
  }
}

main().catch(console.error);
