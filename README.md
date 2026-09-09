# SAFE Guard FORCE — Website + CMS

The public SAFE Guard FORCE website (Next.js 16 App Router) with a complete **Supabase-powered CMS**: edit every piece of website content from `/admin` — no code, no redeploy.

- **Public site:** navy/gold identity, hero slideshow, 12 services, industries, about, contact — all content from Supabase.
- **Admin panel:** dashboard, site settings, navigation, homepage sections, hero slides, services + detail items, industries, about, values, testimonials, statistics, media library, enquiry inbox, admin users, activity logs.
- **Secure:** Supabase Auth + roles (super_admin / editor), Row Level Security on every table, service-role key confined to server code.

## Quick start

```bash
npm install
cp .env.example .env.local    # fill in your Supabase URL + keys
```

Set up the database (one-time): see **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** — run the 4 SQL migrations in the Supabase SQL Editor, then create your first admin:

```bash
set -a; source .env.local; set +a
node scripts/create-admin.mjs admin@safeguardforce.in "StrongPassword123" "Site Owner"
```

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (login at `/admin/login`)

## Documentation

| Doc | Purpose |
|---|---|
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Create project, migrations, keys, storage, first admin, Vercel deploy |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | Everyday CMS usage — editing content, media, enquiries, users |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Data flow, caching, security model, file structure |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (passes with 0 errors) |
| `node scripts/create-admin.mjs <email> <pass> ["Name"]` | Create/promote a super admin |

## Environment variables

| Variable | Where it's used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Everywhere (public project URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser client (public by design) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server code only — never exposed to the browser |

## Deployment (Vercel)

1. Push to GitHub, import the repo in Vercel.
2. Add the three environment variables in Vercel → Settings → Environment Variables.
3. Deploy. CMS edits propagate to the live site automatically via cache revalidation — no redeploys needed.

## Legacy URLs preserved

`/security-services`, `/facility-management`, `/housekeeping`, `/fire-safety`, `/technical-maintenance`, `/detective-services` all render their CMS-driven service pages; new canonical routes live at `/services/<slug>`.
