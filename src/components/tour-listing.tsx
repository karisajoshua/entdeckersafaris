import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Reveal } from "./reveal";
import { toursQuery } from "../lib/queries";
import { useT } from "../lib/i18n";
import { useTranslatedTours } from "../lib/use-translated-content";
import mara10 from "../assets/gallery/masai-mara-10.jpeg.asset.json";

export const DAY_TOUR_CATEGORY = "Day Tours & Excursions";

const CATEGORY_ORDER = [
  "Day Tours & Excursions",
  "Safari Packages",
  "Cross-Border Safaris",
  "Adventure Safaris",
];

export function ToursMessage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-(--container-max) grow items-center justify-center px-gutter py-section-desktop">
        <h1 className="text-headline-md text-deep-forest">{title}</h1>
      </main>
      <SiteFooter />
    </div>
  );
}

export function TourListing({ kind, heading, intro }: { kind: "day" | "safari"; heading: string; intro: string }) {
  const t = useT();
  const { data: rawTours } = useSuspenseQuery(toursQuery);
  const tours = useTranslatedTours(rawTours).filter((tour) =>
    kind === "day" ? tour.category === DAY_TOUR_CATEGORY : tour.category !== DAY_TOUR_CATEGORY,
  );

  const categories = [
    ...CATEGORY_ORDER.filter((name) => tours.some((tour) => tour.category === name)),
    ...[...new Set(tours.map((tour) => tour.category))].filter(
      (name) => !CATEGORY_ORDER.includes(name),
    ),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <header className="mx-auto mt-20 w-full max-w-(--container-max) px-gutter pb-section-mobile pt-section-mobile md:pb-section-desktop md:pt-section-desktop">
        <div className="grid items-end gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-headline-md text-deep-forest md:text-headline-lg">
              {t(heading)}
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              {t(intro)}
            </p>
          </div>
          <Reveal className="h-[280px] overflow-hidden rounded-lg border border-deep-forest/10 md:h-[360px]">
            <img
              src={mara10.url}
              alt="Safari vehicles observing the Great Migration in the Masai Mara"
              width={1200}
              height={720}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </header>

      <main className="mx-auto w-full max-w-(--container-max) grow px-gutter pb-section-desktop">
        {tours.length === 0 && (
          <div className="rounded-lg border border-deep-forest/10 bg-surface-container-lowest px-8 py-16 text-center">
            <h2 className="mb-4 text-headline-md text-deep-forest">No tour packages available</h2>
            <p className="text-body-md text-on-surface-variant">Please check back soon or contact us to plan your journey.</p>
          </div>
        )}
        {categories.map((category) => (
          <section key={category} className="mb-20 last:mb-0">
            <Reveal>
              <h2 className="mb-10 text-headline-md text-deep-forest">{t(category)}</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {tours
                .filter((tour) => tour.category === category)
                .map((tour, i) => (
                  <Reveal
                    as="article"
                    delay={i * 70}
                    key={tour.slug}
                    className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-deep-forest/10 bg-surface-container-lowest transition-shadow duration-300 hover:shadow-editorial"
                  >
                    <div className="relative h-64 overflow-hidden bg-surface-variant">
                      <img
                        alt={tour.alt}
                        src={tour.image}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute right-4 top-4 rounded-sm border border-deep-forest/10 bg-surface/90 px-3 py-1 backdrop-blur-sm">
                        <span className="label text-deep-forest">{tour.duration}</span>
                      </div>
                    </div>
                    <div className="flex grow flex-col p-8">
                      <h3 className="mb-4 text-headline-md text-deep-forest">{tour.title}</h3>
                      <p className="mb-4 grow text-body-md text-on-surface-variant">
                        {tour.tagline}
                      </p>
                      {tour.priceUsd != null && (
                        <p className="label mb-6 text-savannah-gold">
                          {t("From")} ${tour.priceUsd.toLocaleString("en-US")} {t("per person")}
                        </p>
                      )}
                      <Link
                        to="/tours/$slug"
                        params={{ slug: tour.slug }}
                        className="label mt-auto inline-flex w-fit items-center space-x-2 border-b border-transparent pb-1 text-savannah-gold transition-colors hover:border-deep-forest hover:text-deep-forest"
                      >
                        <span>{t("View Itinerary")}</span>
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_right_alt
                        </span>
                      </Link>
                    </div>
                  </Reveal>
                ))}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
