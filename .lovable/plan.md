# Fix the safari imagery

## What's wrong right now

Checked the live pages and the image files they load:

- Every hotlinked image is only **512x512 px**. They are stretched into wide hero and card slots (1280px+), so they look soft, blurry and oddly cropped.
- The "8 Days Kenya Experience Safari" card is not a photo at all — the hotlinked file is a **screenshot of a mock web page** (visible nav bar, price box, "Book Now" button inside the image).

So the problem is the source images themselves, not the layout.

## The fix

Replace the hotlinked placeholder images with purpose-generated, correctly proportioned photography, and keep the current design intact.

New images, each generated at the aspect ratio of the slot it fills:

1. Home hero — wide cinematic Kenyan savannah at golden hour with a safari vehicle silhouette
2. "The Entdecker Experience" / About feature image — portrait-ish landscape of Nairobi skyline meeting the national park
3. Six tour card photos, 4:3 landscape:
   - Nairobi City Tour — skyline over the park
   - Mombasa City Tour — Swahili Old Town street with carved doors
   - 8 Days Kenya Experience — elephants in Amboseli with Kilimanjaro (replaces the mock-screenshot image)
   - 7 Days Out of Africa — Great Rift Valley escarpment
   - 6 Days Honeymoon — luxury open-air tent dinner for two at sunset
   - 6 Days Animal Kingdom — male lion in tall grass
4. Contact page background image — dusk savannah, keeps the existing overlay treatment

## Also fixed while in there

- Images get explicit `width`/`height` plus `loading="lazy"` (hero stays eager) so nothing shifts while loading.
- Existing alt text is preserved and reused for accessibility and SEO.
- A stale hydration warning on the home route is cleaned up.

## Technical notes

- Images are generated into `src/assets/` and referenced through `src/data/tours.ts` (ES6 imports instead of remote URLs), so nothing depends on an external CDN that can change or expire.
- No changes to layout, spacing, colors, typography, or copy — only the image sources and image-sizing attributes.
