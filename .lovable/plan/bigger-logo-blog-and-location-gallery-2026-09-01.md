# Bigger logo, Blog, and location Gallery

## 1. Logo size
- Header: grow the mark to roughly `h-24` on mobile / `h-28` on desktop with slightly more vertical padding, keeping the fixed header tidy and the nav aligned.
- Footer: grow the light-panel logo to about `h-32`.

## 2. Gallery
- New route `/gallery`, organised by location. Masai Mara is the first location, built from the 10 uploaded photos (lions, giraffe, wildebeest migration, safari vehicles).
- Layout: location heading + short intro, then a responsive masonry-style grid of photos with a lightbox on click (arrow keys / click outside to close), using existing scroll-reveal animation and design tokens.
- Structure allows more locations (Amboseli, Nairobi, Mombasa, etc.) to be added later by dropping images into a new location entry.
- Images uploaded to the CDN via the assets CLI and referenced through pointer JSON, so no binaries land in the repo.

## 3. Blog
- New routes `/blog` (index listing) and `/blog/$slug` (article page).
- Content lives in `src/data/blog.ts` — same pattern as `tours.ts`: slug, title, excerpt, date, author, cover image, and body paragraphs/headings.
- Seeded with 3 starter articles written from existing site material (Masai Mara migration, Nairobi National Park city safari, packing/planning tips for a Kenya safari), each using an existing safari photo as its cover. Replaceable with real posts later.
- Blog index: featured latest post + card grid; article page: hero cover, title, meta line, body, and a back link plus contact CTA.

## 4. Navigation and SEO
- Add "Gallery" and "Blog" to header nav (desktop + mobile) and to the footer.
- Each new route gets its own `head()` with unique title, description, and OG tags; article pages use the post title/excerpt and their cover image URL for `og:image`.

## Technical notes
- No new dependencies; lightbox is a small local component with `prefers-reduced-motion` respected.
- Reuses `Reveal`, `SiteHeader`, `SiteFooter`, and existing colour/typography tokens.
