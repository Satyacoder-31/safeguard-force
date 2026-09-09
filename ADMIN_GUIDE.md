# Admin Guide — SAFE Guard FORCE CMS

A plain-language guide to managing the website from `/admin` — no coding needed.

---

## Logging in

1. Open `yourdomain.com/admin` (or `/admin/login` directly).
2. Enter the email and password created for you (see SUPABASE_SETUP.md step 7 if you are the first admin).
3. Forgot your password? Another super admin can change it, or use Supabase Dashboard → Authentication to reset.

To log out, use the ⎋ button at the bottom of the sidebar (or "Logout" in the mobile header).

## The dashboard

The dashboard shows live numbers: total/new/in-progress/converted enquiries, services, industries, active hero slides and media count — plus recent enquiries and recent admin activity. Click any card to jump to that section.

---

## Changing the homepage

**Edit a section headline (e.g. "A Safer, Smarter Tomorrow"):**
1. Sidebar → **Website → Homepage**.
2. Click the section card (e.g. "Trust Intro").
3. Edit the title/paragraphs, click **Save Section**.

**Hide or show a section:** untick "Visible on homepage" in that section, then Save.

**Change the hero slideshow:**
1. Sidebar → **Website → Hero Slides**.
2. Click a slide to expand it — edit the big title, the gold italic line, the paragraph, button text, phone number, timing, or replace the image.
3. Use **Upload** to pick a new image from your computer, or **Select Media** to reuse an existing one.
4. Add a new slide with **+ Add Slide**, remove one with **Delete Slide**, control order with **Sort Order**.

**Reorder homepage services:** Website → **Services** → change each service's **Sort Order** (lower numbers appear first).

## Editing services

Sidebar → **Website → Services**. Click **Edit** on a service:

- **Name & slug** — the public URL is `/services/<slug>`; old links like `/security-services` keep working automatically.
- **Short description** — the card text on the homepage grid.
- **Hero title/subtitle/image** — the top of the service page.
- **Detail Items** — the cards below the page top (e.g. "Security Guard Services", "Patrolling"…). Add, edit, delete and reorder them right under the service editor.
- **SEO title/description** — what Google shows.

Untick **Active** to temporarily remove a service from the whole website without deleting it.

## Editing industries

Sidebar → **Website → Industries** — same idea: name, image, description, bullet points, homepage visibility (Featured) and Active toggle.

## Editing the About page

Sidebar → **Website → About**:

- Hero (eyebrow, title, subtitle, image)
- Who We Are paragraphs
- Mission / Vision / Commitment
- Management Approach heading + checklist (one item per line)
- Core Values grid (add/edit/delete/reorder below the form)
- CTA button and SEO fields

## Changing phone, email, WhatsApp, address

Sidebar → **Website → Site Settings**:

- **Contact Details** — primary/secondary phone, email, WhatsApp number + prefilled message.
- **Address & Map** — address lines, city, pincode, Google Maps link.
- **Header / Footer text** — top-bar text, support text, footer description, copyright.
- **Social links** — Facebook, Instagram, LinkedIn, YouTube, X.
- **Logo** — paste or upload a new logo URL.

Save once — the header, footer, floating buttons, contact page and hero phone button all update automatically.

## Uploading images

Two ways:

1. **Media Library** (sidebar → Website → Media Library): choose a folder (hero, services, industries…), click **Upload Image**. Hover an image to **Copy** its URL or **✕** to delete it. Click the alt-text link to describe the image (good for SEO/accessibility).
2. **Inside any editor** (hero slides, services, industries, about…): the image field has **Upload** (from your computer) and **Select Media** (reuse from the library), plus a live preview and a **Remove** button.

Supported: JPG, PNG, WebP, GIF, SVG, AVIF — up to 5 MB.

## Managing enquiries (leads)

Sidebar → **Leads → Enquiries**. Every website contact-form submission lands here.

**Find things:** search box (name/phone/email/company/location) and dropdown filters for status, priority and service.

**Work an enquiry:**
1. Click a row (or a mobile card) to open the full details.
2. Use **Quick Contact** on the right to call, WhatsApp or email the person directly.
3. Change **Status** (New → Contacted → In Progress → Converted/Closed/Spam), set **Priority**, assign it to a teammate (**Assigned To**), and keep **Internal Notes** of calls/quotes.
4. Save Changes. Delete is available for spam.

## Managing users (super admins only)

Sidebar → **System → Admin Users**:

- **Super Admin** — full access, including user management and settings.
- **Editor** — content, media and enquiries, but cannot manage users.

Click **Edit** to change someone's name, role, or disable their account (they immediately lose access).

## Activity logs

Sidebar → **System → Activity Logs** shows who changed what and when — services edited, settings saved, slides deleted, enquiry statuses updated, media uploaded.

---

## FAQ

**I saved but don't see the change on the website.**
Public pages cache for up to 5 minutes (and update immediately after most saves). Hard-refresh with Ctrl/Cmd+Shift+R. If still stale, wait one minute — content always comes from Supabase, never from code.

**Can I break the website?**
Deactivating is always safer than deleting. If something looks wrong on the site, check whether the relevant item is still **Active/Visible** in the admin.

**A deleted image shows as broken.**
Re-upload it in Media Library, then re-select it in the editor that used it.
