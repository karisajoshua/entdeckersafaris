# Website in English, French, German and Italian

Visitors pick a language from the top menu and the whole site — menus, buttons, page text, tour descriptions, blog posts, photo captions — appears in that language. Web addresses stay exactly as they are today.

## How it works for visitors

- A small language control (EN / FR / DE / IT) sits in the top menu, on desktop and in the mobile menu.
- The choice is remembered on that device, so returning visitors see their language straight away.
- On first visit, if the visitor's browser is set to French, German or Italian, the site opens in that language; otherwise English.

## Fixed site wording

All the wording written into the pages (menu labels, buttons like "Book Now" and "Enquire About This Safari", headings, the About and Contact pages, privacy and terms, form labels and messages) gets a translation file per language. English stays the source; the other three are translated once and stored in the app so they load instantly with no waiting.

## Tour, blog and gallery text

This text lives in your content manager, so it is translated automatically:

- The first time a page is viewed in French, German or Italian, the site translates that item's text and saves the result.
- Every later visit uses the saved translation — instant, no repeated cost.
- When you edit a tour or blog post, its saved translations for that item are cleared and rebuilt on the next visit, so translations never go stale.
- Names stay untouched: place names, "Masai Mara", "Entdecker Safaris", phone numbers, email, prices and durations.
- If a translation cannot be produced (AI unavailable), the page falls back to English rather than showing blank text.

## Notes

- Google will still index only the English pages, since addresses stay the same. If you later want German or French pages to rank in those countries, we can add `/de/`, `/fr/`, `/it/` addresses as a follow-up.
- Photos and layout are unchanged.

## Technical outline

- `src/lib/i18n.tsx`: language context + provider (localStorage `edsf.lang`, `navigator.language` fallback, `<ClientOnly>`-safe read in `useEffect` to avoid hydration mismatch), `useLang()` and `t(key)` helpers.
- `src/locales/{en,fr,de,it}.ts`: flat key/value dictionaries for all hardcoded UI copy. Route and component text is switched to `t("...")` keys.
- New table `content_translations`: `id`, `entity` (`tour|blog_post|gallery_photo|gallery_location`), `entity_id`, `lang`, `fields jsonb`, `source_hash text`, timestamps; unique on (`entity`,`entity_id`,`lang`). GRANT select to `anon`/`authenticated`, all to `service_role`; RLS: public SELECT true, admin manage via `has_role`.
- `src/lib/translate.functions.ts` (`createServerFn`, public, no auth): input `{ entity, ids, lang }`. Reads rows via the server publishable client, returns cached translations whose `source_hash` matches the current source text; for misses calls the Lovable AI Gateway Responses API (`openai/gpt-6-astra`, streamed, strict json_schema, one request per batch) and writes results with `supabaseAdmin` loaded inside the handler. Reuses the error-mapping style already in `src/lib/ai-content.functions.ts`.
- `source_hash` is a hash of the translatable source fields, so an admin edit automatically invalidates that item's translations without extra bookkeeping.
- Reads stay as they are: existing `toursQuery` etc. keep loading English; a `useTranslatedContent` hook layers translations in via TanStack Query keyed by `[entity, ids, lang]`, falling back to English on error or while pending.
- Route `head()` metadata keeps its current English titles/descriptions (addresses are shared across languages).
