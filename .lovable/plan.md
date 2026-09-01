# Pinterest-style gallery + admin CMS

## 1. Gallery restyle (Pinterest / masonry)

- Replace the fixed 3-column grid with a true masonry layout: CSS multi-column
  (`columns-2 md:columns-3 lg:columns-4`) so photos keep their natural aspect
  ratio and tile at different heights, with rounded corners and a soft hover
  lift + caption overlay.
- Keep the existing lightbox (click to enlarge, arrow keys, Escape) and the
  scroll reveal animation; add a location filter row (All / Masai Mara / ...)
  above the wall so new locations slot in without redesign.

## 2. Backend (Lovable Cloud)

Enabling Lovable Cloud gives the site a database, image storage, and logins —
no external accounts needed.

Tables:
- `gallery_locations` — name, slug, blurb, sort order.
- `gallery_photos` — location, image URL, alt text, caption, sort order.
- `blog_posts` — title, slug, excerpt, cover image, author, date, body blocks,
  published flag.
- `tours` — title, slug, tagline, duration, hero image, intro, itinerary steps,
  sort order.
- `contact_enquiries` — name, email, phone, message, created date, handled flag.
- `user_roles` — separate role table so admin rights can never be edited from
  the browser.

Public visitors can read published content only. Writes, unpublished drafts,
and enquiries are admin-only. Images upload to a public `site-images` storage
bucket.

## 3. Existing content imported

The 10 Masai Mara photos, 3 blog posts, and 6 tour packages are inserted into
the database as editable records, pointing at the images already hosted for
the site — so the live pages look identical after the switch, but everything
is now editable.

## 4. Admin area

- `/auth` — sign-in page (email + password). `info@entdeckersafaris.com` is
  granted the admin role; anyone else who signs in sees nothing extra.
- `/admin` — dashboard with counts and latest enquiries.
- `/admin/gallery` — create locations, drag-free sort order field, drag-and-drop
  or file-picker image upload (multiple at once), edit alt/caption, delete.
- `/admin/blog` — list, create, edit, delete posts; title/slug/excerpt/date/
  author, cover image upload, and a simple block editor (heading / paragraph
  rows you can add, reorder and remove), plus Draft vs Published.
- `/admin/tours` — edit tour text, hero image, and itinerary steps.
- `/admin/enquiries` — read contact form submissions, mark as handled.
- Admin pages sit behind the auth gate; non-admins are bounced out.

## 5. Public site reads from the CMS

Gallery, blog index, blog article, tour packages and tour detail pages all load
from the database instead of the hard-coded files, keeping current design, SEO
metadata and animations. The contact form starts saving submissions so they
appear in `/admin/enquiries`.

## Technical notes

- Reads go through TanStack `createServerFn` (public, published-only) called
  from route loaders with TanStack Query; admin mutations use authenticated
  server functions with the current user's session, validated with zod.
- Admin routes live under `src/routes/_authenticated/`; the admin role is
  checked server-side via a `has_role` security-definer function, never in
  client storage.
- `src/data/*.ts` files are retired once the database is seeded; images stay on
  the existing CDN URLs, new uploads go to Cloud storage.
- Row-level security on every table plus explicit grants; masonry is pure CSS,
  no new animation library.
