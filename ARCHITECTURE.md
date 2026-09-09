# Architecture — SAFE Guard FORCE CMS

## Overview

The public website keeps its original Next.js App Router design (navy/gold identity, animations, responsiveness). All content now lives in **Supabase PostgreSQL**, images in **Supabase Storage**, and the admin panel at `/admin` is a purpose-built CMS writing through **Server Actions**.

```
Browser ──► Next.js (Vercel)
             │
             ├─ Public pages (Server Components)
             │    └─ lib/cms/queries.ts ──► unstable_cache ──► Supabase (service-role, read-only)
             │
             ├─ Admin pages /admin/** (Server Components + proxy.ts guard)
             │    └─ lib/actions/admin.ts (Server Actions)
             │         ├─ requireAdmin()  → profile check (role, is_active)
             │         ├─ Supabase write (service-role, server-side)
             │         ├─ logActivity()   → activity_logs
             │         └─ revalidatePath()/revalidateTag() → fresh public pages
             │
             └─ Contact form (client) → submitEnquiry() Server Action
                  ├─ zod validation + honeypot + rate limit
                  └─ Supabase insert (enquiries) — public INSERT-only via RLS
```

## Directory map

```
app/
  layout.tsx                 # fetches SiteSettings + Navigation from Supabase
  page.tsx                   # homepage — every section rendered from homepage_sections etc.
  about/, industries/, contact/
  services/[slug]/           # dynamic service pages (generateStaticParams + ISR 300s)
  security-services/ …       # legacy URL wrappers → reuse the [slug] page
  sitemap.ts, robots.ts, not-found.tsx
  components/                # Header, Footer, HeroSlideshow, FloatingActions, PageHero, ContactForm
  admin/
    login/                   # sign-in (own route, outside protected layout)
    (dashboard)/             # protected route group: layout redirects if no admin profile
      page.tsx               # live dashboard
      settings/ navigation/ homepage/ hero/ about/ services/
      industries/ testimonials/ statistics/ media/ enquiries/ users/ activity/
    components/              # AdminSidebar, MediaPicker, ui primitives, DeleteForm
lib/
  supabase/browser.ts        # anon-key client (client components)
  supabase/server.ts         # cookie-bound client (RLS-aware)
  supabase/admin.ts          # service-role client, "server-only" import guard
  supabase/auth.ts           # requireAdmin / getAdminProfile / signOut
  cms/queries.ts             # tagged unstable_cache data layer + fallbacks
  cms/logs.ts                # activity audit helpers
  actions/admin.ts           # all admin CRUD server actions
  actions/enquiries.ts       # public form submission
  validation.ts              # zod schemas
  utils.ts                   # tel/WhatsApp link builders, slugify, formatting
proxy.ts                     # Next 16 middleware (renamed): /admin gate
supabase/migrations/         # schema, RLS, storage, seed
types/database.ts            # row + Database types
scripts/create-admin.mjs     # first super-admin bootstrap
```

## Data model (16 tables)

`profiles` · `site_settings` · `navigation_items` (self-referencing tree) · `homepage_sections` (keyed sections with JSONB `items`) · `hero_slides` · `services` → `service_items` (FK cascade) · `industries` · `about_content` · `values` · `contact_settings` · `enquiries` · `testimonials` · `statistics` (context-tagged: hero_bar / trust / stats_band) · `media_library` (Storage paths) · `activity_logs`.

Conventions: UUID PKs, `updated_at` triggers, indexes on slugs, `is_active`, `sort_order`, `created_at`, FKs. JSONB for flexible lists (checklists, bullet points, phone lists, section items).

## Caching & revalidation

- Public reads go through `unstable_cache` with **tags** (`cms:settings`, `cms:hero`, `cms:services`, …) and 300 s TTL.
- Every admin mutation calls `revalidatePath` on all public routes; tag-based invalidation via `revalidateTag(tag, "max")` is available through `revalidateAllCms()`.
- Service pages are ISR (`revalidate = 300`) with `generateStaticParams`.
- Net effect: CMS edits appear on the website within seconds — no redeploy.

## Security model

| Concern | Implementation |
|---|---|
| Secrets | `SUPABASE_SERVICE_ROLE_KEY` only in server-only modules (`lib/supabase/admin.ts` imports `server-only`, so any client import fails the build). Anon key is public by design. |
| Auth gate | `proxy.ts` redirects cookieless requests from `/admin/**` to `/admin/login`. `(dashboard)/layout.tsx` re-checks via `requireAdmin()` on every request (proxy is optimization, not the boundary). |
| Authorization | Server Actions call `requireAdmin()` first; `updateAdminUser` additionally requires `role === "super_admin"`. |
| RLS | Enabled on all tables. Public: SELECT on content tables, INSERT-only on `enquiries`. Admin writes require `is_admin()` (SQL security-definer helper checking `profiles`). |
| Storage | Public-read bucket, admin-only write policies, MIME allow-list, 5 MB cap enforced client + bucket side. |
| Form abuse | Zod validation, honeypot field, in-memory IP rate limit (3 per 10 min), max lengths. |
| XSS | No rich HTML from admins is rendered raw; content is stored and rendered as React-escaped text. |
| Error hygiene | Users see friendly messages; raw DB errors go to server logs only. |

## Design preservation

The original components' markup and Tailwind classes were preserved; only their data sources changed. Compare `app/components/*` pre/post migration: same layout, same class names, same animations — the arrays became props fed by `lib/cms/queries.ts`.

## Fallback behavior

If Supabase is unreachable or a table is empty, `lib/cms/queries.ts` returns the seeded fallback constants (original website content) or empty arrays with visible empty-states — the public site degrades gracefully instead of crashing.

## Known limitations

- Rich-text editing is plain textarea + line-break lists by design (content model is structured); a rich-text editor can be added per-field later.
- In-memory rate limiting resets on serverless cold starts; move to an Upstash/Redis counter if abuse becomes a concern.
- Types are hand-maintained; regenerate with `npx supabase gen types typescript` for full fidelity after schema changes.
- Media library does not yet auto-detect image dimensions (width/height nullable).
