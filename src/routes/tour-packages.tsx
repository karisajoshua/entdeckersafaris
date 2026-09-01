import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { toursQuery } from "../lib/queries";

export const Route = createFileRoute("/tour-packages")({
  loader: ({ context }) => context.queryClient.ensureQueryData(toursQuery),
  head: () => ({
    meta: [
      { title: "Tour Packages — Curated Kenya Safari Journeys" },
      {
        name: "description",
        content:
          "Browse curated safari itineraries: Nairobi and Mombasa city tours, 8 days Kenya experience, Out of Africa, honeymoon and wildlife safaris.",
      },
      { property: "og:title", content: "Curated Journeys — Entdecker Safaris" },
      {
        property: "og:description",
        content: "Meticulously crafted safari itineraries across Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => <ToursMessage title="Tours unavailable" />,
  notFoundComponent: () => <ToursMessage title="Tours not found" />,
  component: TourPackages,
});

function ToursMessage({ title }: { title: string }) {
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

function TourPackages() {
  const { data: tours } = useSuspenseQuery(toursQuery);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <header className="mx-auto mt-20 w-full max-w-(--container-max) px-gutter pb-section-mobile pt-section-mobile md:pb-section-desktop md:pt-section-desktop">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-headline-md text-deep-forest md:text-headline-lg">
            Curated Journeys
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Discover the untamed beauty of Africa through our meticulously crafted itineraries. From
            the bustling streets of Nairobi to the vast plains of the Masai Mara, every journey is an
            invitation to explore.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-(--container-max) grow px-gutter pb-section-desktop">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour, i) => (
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
                <h2 className="mb-4 text-headline-md text-deep-forest">{tour.title}</h2>
                <p className="mb-8 grow text-body-md text-on-surface-variant">{tour.tagline}</p>
                <Link
                  to="/tours/$slug"
                  params={{ slug: tour.slug }}
                  className="label mt-auto inline-flex w-fit items-center space-x-2 border-b border-transparent pb-1 text-savannah-gold transition-colors hover:border-deep-forest hover:text-deep-forest"
                >
                  <span>View Itinerary</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
