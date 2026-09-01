# Logo, full tour content, and motion polish

## 1. Brand logo
- Add the uploaded Entdecker Safaris logo as a CDN asset and use it in the header (replacing the text wordmark) and in the footer (light version on the dark background).
- Generate a square favicon from the logo in `public/` and point the root route's icon link at it.

## 2. Real content everywhere
- Expand `src/data/tours.ts` so each of the 6 tours carries: intro description, and a numbered itinerary (time/day + heading + text) exactly as supplied — Nairobi City Tour (4 steps), Mombasa City Tour (5 steps), 8 Days Kenya Experience (8 days), 7 Days Out of Africa (7 days), 6 Days Honeymoon (7 days), 6 Days Animal Kingdom (6 days).
- New detail route `src/routes/tours.$slug.tsx`: hero image with title + duration, intro paragraph, then a vertical timeline of the itinerary steps, and a CTA to Contact. "View Itinerary" / "Explore Details" links now go here instead of `/contact`.
- About page rewritten with the supplied copy: "Welcome to Entdecker Safaris" intro, "What We Do" (Tour and Safaris, Excursion & City Tour, Hotel & Airport Transfer, Tour Guide Services) and "Why Entdecker Safaris" (+500 customers, +20 packages, excellent guides, +4 languages).
- Contact page: add the "Contact Details" intro paragraph, the second phone number +254 104 886 882, and entdeckersafaris.com as a website line. Footer gets the same second phone.

## 3. Smooth motion
- Route transitions: a fade/slide wrapper keyed on the current path inside the root layout, plus scroll-to-top on navigation.
- Scroll entrance animations: a small `Reveal` component using IntersectionObserver that fades and lifts sections/cards into view (with staggered delay for grids), respecting `prefers-reduced-motion`.
- Keep the existing design tokens, palette and typography untouched; smooth scrolling enabled globally.

## Technical notes
- Logo via `lovable-assets` pointer imported as JSON; favicon is a real square PNG in `public/`.
- New route file follows the existing `createFileRoute` + `head()` pattern, with per-tour title/description/OG tags and 404 handling for unknown slugs.
- Animations are CSS keyframes in `src/styles.css` driven by a data attribute — no animation library added.
