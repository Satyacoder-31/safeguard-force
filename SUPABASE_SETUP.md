# Supabase Setup — SAFE Guard FORCE CMS

Beginner-friendly, step-by-step. Do the steps **in order**. Time: ~20 minutes.

---

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign up / log in.
2. Click **New project**.
3. Choose a name (e.g. `safeguardforce`), a strong database password (save it somewhere safe), and the region closest to your users (e.g. Mumbai `ap-south-1`).
4. Wait ~2 minutes for the project to finish provisioning.

## 2. Get your API keys

1. In your new project, open **Project Settings** (gear icon, bottom-left) → **API**.
2. Copy these three values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public key** — a long `eyJ...` string
   - **service_role key** — another long `eyJ...` string (⚠️ secret — never share or expose in the browser)

## 3. Configure environment variables

In the project folder:

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon...
SUPABASE_SERVICE_ROLE_KEY=eyJ...service...
```

> `.env.local` is git-ignored. Never commit real keys.

## 4. Run the database migrations

You have two options.

**Option A — Supabase Dashboard (easiest):**

1. Open **SQL Editor** in the Supabase Dashboard sidebar.
2. Open the file `supabase/migrations/20260101000000_initial_schema.sql` from this repo, copy **all** its content, paste into SQL Editor, click **Run**.
3. Repeat for `20260101000001_rls_policies.sql`.
4. Repeat for `20260101000002_storage.sql`.
5. Repeat for `20260101000003_seed_content.sql`.

**Option B — Supabase CLI:**

```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db push
```

When done you will have 16 tables: `profiles`, `site_settings`, `navigation_items`, `homepage_sections`, `hero_slides`, `services`, `service_items`, `industries`, `about_content`, `values`, `contact_settings`, `enquiries`, `testimonials`, `statistics`, `media_library`, `activity_logs` — with Row Level Security enabled and all existing website content seeded.

## 5. Verify the storage bucket

**SQL migration step 4 already created the `website-media` bucket** (public read, 5 MB limit, image-only).

To confirm: Dashboard → **Storage** → you should see a bucket named `website-media` with folders available for `logos`, `hero`, `services`, `industries`, `about`, `general`.

## 6. Configure authentication

1. Dashboard → **Authentication** → **Providers** → **Email** is enabled by default (leave it on).
2. For local testing you can disable email confirmation: **Authentication → Sign In / Providers → Confirm email = OFF**.
3. For production, consider turning confirmation back ON and adding **Site URL** under **Authentication → URL Configuration** (your production domain, e.g. `https://safeguardforce.in`).

## 7. Create the first admin

Never register admins through the public site. Use the provided script (server-side only):

```bash
set -a; source .env.local; set +a
node scripts/create-admin.mjs admin@safeguardforce.in "YourStrongPassword123" "Site Owner"
```

This creates the auth user **and** its `profiles` row with `role = super_admin`.

Run it once. After that, more admins can be added by a super admin from **Admin → Admin Users** (they still sign up via the script or Supabase Dashboard → Authentication → Add user, then get promoted in Admin Users).

## 8. Run locally

```bash
npm install
npm run dev
```

- Public website: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- Admin dashboard: http://localhost:3000/admin

## 9. Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Vercel auto-detects Next.js. Before deploying, open **Environment Variables** and add the same three variables from step 3 (add them for Production, Preview and Development).
4. Click **Deploy**.
5. After deploy, verify:
   - the public site loads with content from Supabase,
   - `/admin` redirects to `/admin/login` when signed out,
   - logging in with the admin account shows the dashboard.

## 10. Post-deploy checks (live CMS reflection test)

1. Log in at `yourdomain.com/admin`.
2. Edit **Site Settings → Primary Phone** → save → open the public site → header/footer/floating button show the new number.
3. Edit **Hero Slides → a slide title** → save → open homepage → new title appears.
4. Submit the contact form → check **Admin → Enquiries** — it appears instantly.
5. Upload an image in **Media Library**, then pick it in any editor — it renders on the site.

---

## Security model summary

| Layer | Detail |
|---|---|
| RLS | Enabled on all 16 tables. Public can read published content; only active admins can write. |
| Enquiries | Public can INSERT only; reads/admin actions require an admin session. |
| Service role key | Used exclusively in server code (`lib/supabase/admin.ts`, guarded by `server-only`). Never bundled to the client. |
| Admin routes | `proxy.ts` checks session cookie presence; layouts and server actions re-verify the profile via `requireAdmin()`. |
| Storage | `website-media` bucket: public read, admin-only write, image MIME types only, 5 MB cap. |
| Roles | `super_admin` (everything incl. users) and `editor` (content, media, enquiries). |
