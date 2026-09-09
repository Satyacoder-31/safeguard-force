/**
 * Create the first super admin.
 *
 * Usage:
 *   set -a; source .env.local; set +a
 *   node scripts/create-admin.mjs admin@example.com StrongPassword123 "Full Name"
 *
 * Safe by design: creates the auth user with the given credentials, then
 * upserts a profiles row with role=super_admin. If the user already exists
 * (email taken), it promotes the existing profile instead (idempotent).
 */
import { createClient } from "@supabase/supabase-js";

const [email, password, fullName] = process.argv.slice(2);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL must be set in the environment.");
  console.error("Run:  set -a; source .env.local; set +a   (then re-run this script)");
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> [\"Full Name\"]");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Error: password must be at least 8 characters.");
  process.exit(1);
}

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// 1. Create or fetch the auth user
const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: fullName ?? "" },
});

let userId = created?.user?.id;

if (createErr) {
  if (!String(createErr.message).toLowerCase().includes("already")) {
    console.error("Failed to create user:", createErr.message);
    process.exit(1);
  }
  // Existing user: look them up
  const { data: found } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const match = found?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!match) {
    console.error("User exists but could not be found. Check the email.");
    process.exit(1);
  }
  userId = match.id;
}

// 2. Upsert the profile row as super_admin
const { error: profileErr } = await admin.from("profiles").upsert({
  id: userId,
  email,
  full_name: fullName ?? "",
  role: "super_admin",
  is_active: true,
});

if (profileErr) {
  console.error("Failed to create profile:", profileErr.message);
  console.error("Did you run the database migrations first? See SUPABASE_SETUP.md step 6.");
  process.exit(1);
}

console.log(`✅ Super admin ready: ${email}`);
console.log("   You can now sign in at /admin/login");
