# WhatsApp chat button and tour enquiries

## What you get

1. A floating WhatsApp button in the bottom-right corner of every page, linking to +254 721 886 882. It opens WhatsApp with a short greeting already typed in.
2. On each tour page, the "Enquire About This Safari" button opens WhatsApp instead of the contact form, with a ready-made message summarising that trip, for example:

```text
Hello Entdecker Safaris! I'd like to enquire about the Nairobi City Tour (Full day).
Could you share availability, pricing and what's included?
```

The contact page and its form stay exactly as they are.

## Details

- New `src/components/whatsapp-button.tsx`: fixed round button, gold/forest styling from the existing tokens, WhatsApp glyph, accessible label, opens in a new tab.
- Rendered once in `src/routes/__root.tsx` so it appears on all pages, positioned so it doesn't cover the footer links.
- New helper builds the `https://wa.me/254721886882?text=...` link with encoded text; used by both the floating button and the tour page.
- `src/routes/tours.$slug.tsx`: the CTA becomes an external link built from the tour's title and duration.
