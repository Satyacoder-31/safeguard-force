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

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = "wztcnfqwxejrlzogxzgb";

const sql = `
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_url text NOT NULL DEFAULT '/brochure.pdf';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_title text NOT NULL DEFAULT 'SAFE Guard FORCE Corporate Brochure';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_enabled boolean NOT NULL DEFAULT true;
`;

async function run() {
  console.log("Adding missing brochure columns to public.site_settings...");
  
  if (SUPABASE_ACCESS_TOKEN) {
    const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });

    if (mgmtRes.ok) {
      console.log("✅ ALTER TABLE executed successfully via Management API!");
      return;
    } else {
      console.log("Management API response status:", mgmtRes.status);
    }
  }

  // Fallback: Use service key via RPC if available or create RPC function
  console.log("Attempting SQL via Supabase REST RPC...");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  console.log("REST RPC status:", res.status);
  const text = await res.text();
  console.log("Result:", text);
}

run().catch(console.error);
