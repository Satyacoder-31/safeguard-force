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

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = "wztcnfqwxejrlzogxzgb";

console.log("Token available:", !!token);

if (token) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_url text NOT NULL DEFAULT '/brochure.pdf';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_title text NOT NULL DEFAULT 'SAFE Guard FORCE Corporate Brochure';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS brochure_enabled boolean NOT NULL DEFAULT true;
      `
    })
  });
  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}
