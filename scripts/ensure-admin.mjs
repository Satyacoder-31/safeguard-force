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

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = "safeguardforce02@gmail.com";
  const password = "StrongPassword123";

  // Check if user exists
  const { data: usersData, error: listErr } = await admin.auth.admin.listUsers();
  let user = usersData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Super Admin" },
    });
    if (createErr) {
      console.error("Create error:", createErr);
      process.exit(1);
    }
    user = created.user;
    console.log("Created user:", user.id);
  } else {
    // Update password
    const { data: updated, error: updateErr } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });
    if (updateErr) {
      console.error("Update error:", updateErr);
      process.exit(1);
    }
    console.log("Updated password for user:", user.id);
  }

  // Upsert profile
  const { error: profileErr } = await admin.from("profiles").upsert({
    id: user.id,
    email,
    full_name: "Super Admin",
    role: "super_admin",
    is_active: true,
  });

  if (profileErr) {
    console.error("Profile error:", profileErr);
    process.exit(1);
  }

  console.log("SUCCESS");
}

main().catch(console.error);
