# New circular logo and a bolder charcoal-and-gold theme

## 1. Logo swap
- Upload the new dark circular badge logo to the CDN and use it everywhere the current logo appears: header, footer, and the content manager header.
- Because the badge is dark on its own, the header shows it directly on the light background (no panel), and the footer drops the cream panel behind it since the badge already sits on charcoal.
- Sized to stay clearly visible: roughly the same generous height as now (about 96px on phones, 112px on desktop in the header; about 128-144px in the footer), kept round and never stretched.
- Generate a fresh square favicon from the new badge and point the site icon at it, replacing the old one.

## 2. Theme: light pages, deeper charcoal, stronger gold
- Keep the light, airy page backgrounds.
- Replace the current forest green with the logo's charcoal so buttons, footer, and dark panels match the badge exactly.
- Push the gold further: gold section labels, gold underlines on active navigation, gold hover states, a gold hairline on the header, gold rules under headings, and gold-outlined secondary buttons.
- Warm the cream/sand tone slightly toward the logo's off-white so text on charcoal reads the same as the wordmark.
- Add the logo's tagline treatment as a small motif: thin gold rule with a diamond, used as a section divider on Home, About, and Contact.

## 3. Consistency pass
- Check every page (Home, Tour Packages, tour detail, Gallery, Blog, article, About, Contact, Privacy, Terms, sign-in, content manager) so nothing still uses the old green and contrast stays comfortable in both directions.

## Technical notes
- New logo added via `lovable-assets` pointer JSON; favicon is a real square PNG in `public/` referenced from the root route.
- Colour changes are made on the existing design tokens in `src/styles.css` (`--color-deep-forest`, `--color-savannah-gold`, `--color-horizon-sand`), so every component picks them up without hardcoded colours.
- New `@utility` for the gold divider motif; no new dependencies.
