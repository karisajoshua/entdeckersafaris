# Itinerary cleanup, new city tours, and 9 new safaris

## 1. Remove all times

Every itinerary step loses its time label.
- Day tours (Nairobi, Mombasa, and the new day experiences): steps become "Stop 1", "Stop 2", "Stop 3" …
- Multi-day safaris keep their existing "Day 1", "Day 2" … labels; only times inside the wording are removed.

## 2. Mombasa City Tour — rebuilt

Positioned around the keyword "Ancient City of Mombasa" (used in the title line, intro and page description for search visibility). Stops:

1. Mama Ngina City Park
2. Fort Jesus
3. Old Town
4. Mackinnon Market
5. Elephant Tusks
6. Hindu Temple
7. Sunset cruise aboard the Tamarind Dhow

Each stop gets a short written description.

## 3. Nairobi City Tour — rebuilt

1. Pick up and Nairobi National Park game drive
2. David Sheldrick Wildlife Trust
3. Giraffe Centre
4. Lunch break
5. City tour

## 4. New tours

Three new day/short experiences, written out with stops and intros:

- **Lake Naivasha Experience** — Mount Longonot hiking, Hell's Gate cycling safari, boat ride and nature walk, horse ride safari, agri-tour of a flower farm.
- **Sagana River Experience** — white water rafting, zip lining, bungee jumping, cycling, nature walk.
- **Loita Experience** — culture tour, cattle grazing, donkey safari, hiking.

Cross-border safaris (one card each, with intro and outline itinerary):

- Kenya – Tanzania
- Kenya – Zanzibar
- Tanzania – Zanzibar

Adventure safaris:

- Gorilla Safari — Uganda
- Mount Kilimanjaro Climbing
- Mount Kenya Climbing

The tour packages page will group these under headings: Day Tours & Excursions, Safari Packages, Cross-Border Safaris, Adventure Safaris.

## 5. Photos

A new photo is generated for each of the 9 new tours (Naivasha crater lake, Hell's Gate, Sagana rapids, Maasai culture, Serengeti crossing, Zanzibar beach, mountain gorilla, Kilimanjaro, Mount Kenya) and uploaded so the pages and the manager use them. You can replace any of them later in the content manager.

## Technical notes

- Content lives in the `tours` table, so the changes ship as a data migration/SQL update: rewritten `itinerary` JSON and intros for Nairobi and Mombasa, time markers stripped across all existing rows, and INSERTs for the 9 new tours with slugs, taglines, durations, alt text and sort order.
- `src/data/tours.ts` (the static fallback/type source) is updated to match.
- New images are generated into `src/assets`, then uploaded to the public `site-images` bucket so the DB rows can hold stable public URLs.
- `src/routes/tour-packages.tsx` gains category grouping; `tours.$slug.tsx` needs no structural change.
- Mombasa keyword usage flows into that route's `head()` title/description.
