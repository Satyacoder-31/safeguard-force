// run-migrations.mjs — runs all 4 SQL migrations against Supabase
// Uses the Supabase Management API /database/query endpoint
// Run: SUPABASE_ACCESS_TOKEN=<your-pat> node scripts/run-migrations.mjs

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wztcnfqwxejrlzogxzgb.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = 'wztcnfqwxejrlzogxzgb';

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY env var. Load .env.local first.');
  process.exit(1);
}

const migrations = [
  '20260101000000_initial_schema.sql',
  '20260101000001_rls_policies.sql',
  '20260101000002_storage.sql',
  '20260101000003_seed_content.sql',
];

async function runSQL(sql, label) {
  console.log(`\n▶ Running: ${label} ...`);
  
  // Try Supabase Management API
  const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (mgmtRes.ok) {
    const data = await mgmtRes.json();
    console.log(`✅ ${label} — success`);
    return true;
  }

  const errText = await mgmtRes.text();
  console.log(`⚠️  Management API failed (${mgmtRes.status}): ${errText}`);
  
  // Fallback: try via pg REST endpoint
  const restRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });

  if (restRes.ok) {
    console.log(`✅ ${label} — success via REST`);
    return true;
  }

  const restErr = await restRes.text();
  console.log(`❌ ${label} — both methods failed. REST error: ${restErr}`);
  return false;
}

async function main() {
  console.log('🚀 Supabase Migration Runner');
  console.log(`📦 Project: ${PROJECT_REF}`);
  console.log(`🌍 URL: ${SUPABASE_URL}\n`);

  // Test connectivity first
  const ping = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { 'apikey': SERVICE_ROLE_KEY },
  });
  console.log(`🔗 Connection test: ${ping.status} ${ping.statusText}`);

  let allOk = true;
  for (const file of migrations) {
    const filePath = join(rootDir, 'supabase', 'migrations', file);
    const sql = readFileSync(filePath, 'utf-8');
    console.log(`   (${sql.length} characters)`);
    const ok = await runSQL(sql, file);
    if (!ok) allOk = false;
  }

  if (allOk) {
    console.log('\n🎉 All migrations completed successfully!');
  } else {
    console.log('\n⚠️  Some migrations failed — check output above.');
    console.log('    Manual option: paste each .sql file into:');
    console.log(`    https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  }
}

main().catch(console.error);
