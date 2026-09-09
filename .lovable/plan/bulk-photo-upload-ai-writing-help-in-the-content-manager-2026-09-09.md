# Bulk photo upload + AI writing help in the content manager

## 1. Gallery: add many photos at once

- The "Add photo" panel becomes an "Add photos" drop zone: pick or drag several
  images in one go.
- Each image uploads to storage in the background, then appears as a row in a
  review list with a thumbnail, an alt-text box and a caption box.
- AI reads each photo and fills in suggested alt text and a short caption
  automatically; you can edit any of them, remove a row, or re-run the
  suggestion for one photo.
- Press "Save all" once and every photo is added to that location, in the order
  shown. Progress and any per-photo failure are shown inline so a single bad
  file never blocks the rest.

## 2. AI writing help on blog and tours

A small "Write with AI" button next to the relevant fields, which fills in text
you can edit before saving:

- Blog: title suggestions, SEO-friendly excerpt, and a full draft body
  (headings + paragraphs) from a short prompt or the existing title.
- Tours: tagline and intro paragraphs from the tour title and duration.
- Gallery locations: the blurb, written from the location name.

Every suggestion is search-friendly by design: natural Kenya/safari wording,
descriptive alt text under ~125 characters, excerpts under ~155 characters, and
no keyword stuffing.

## 3. Nothing changes on the public site

Same pages, same design. Only the content manager gains the bulk upload and the
AI buttons.

## Technical notes

- New `src/lib/ai-content.functions.ts` with authenticated `createServerFn`
  endpoints, admin-checked with the existing `has_role` helper:
  `suggestPhotoText` (image in, alt + caption out), `suggestLocationBlurb`,
  `suggestPostText`, `suggestTourText`. All use Lovable AI through the gateway
  with a strict JSON output schema; `LOVABLE_API_KEY` stays server-side.
- Photo suggestions pass the uploaded image URL as an `image_url` block; images
  live in the `site-images` bucket and are already reachable by signed URL.
- `src/components/admin/image-upload.tsx` gains a `multiple` sibling component
  (`MultiImageUpload`) that uploads files in parallel and reports
  `{ url, filename }[]`; the existing single-image control stays for covers and
  tour heroes.
- `admin.gallery.tsx` gets a staged-rows state array and reuses the existing
  `saveGalleryPhoto` mutation once per row, with `sortOrder` continuing from the
  location's current photo count. No schema or migration changes.
- Gateway failures surface as inline messages in the form (never silent), per
  the gateway error rules; 402/403 tell the admin what to do.
