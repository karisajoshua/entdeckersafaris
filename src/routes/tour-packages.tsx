import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { collections, findSource, durationMatches } from "../lib/collections";
import { toursQuery } from "../lib/queries";
import { ToursMessage } from "../components/tour-listing";

export const Route = createFileRoute("/tour-packages")({
  validateSearch: (search: Record<string, unknown>): { collection?: string } => ({ collection: typeof search.collection === "string" ? search.collection : undefined }),
  loader: ({ context }) => context.queryClient.ensureQueryData(toursQuery),
  head: () => ({ meta: [{ title: "Tour Packages — Entdecker Safaris" }] }),
  errorComponent: () => <ToursMessage title="Tours unavailable" />,
  component: CollectionsPage,
});

function CollectionsPage() {
  const tours = Route.useLoaderData();
  const { collection } = Route.useSearch();
  const selected = collections.find((item) => item.slug === collection);
  const findTour = (item: {name:string;source:string}) => findSource(tours, item);
  return <div className="flex min-h-screen flex-col bg-surface"><SiteHeader />
    <main className="mx-auto mt-32 w-full max-w-(--container-max) grow px-gutter py-section-mobile md:py-section-desktop">
      {selected && <Link to="/tour-packages" search={{}} className="label mb-6 inline-block text-savannah-gold">Tour Packages / Safari Escapes</Link>}
      <h1 className="mb-6 text-headline-lg text-deep-forest">{selected?.name ?? "Safari Escapes"}</h1>
      <p className="mb-10 text-body-lg text-on-surface-variant">{selected ? "Explore our curated journeys and existing safari itineraries." : "Discover our curated collections of East African journeys."}</p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {!selected ? collections.map((item) => {
          const tour = item.packages.map((p) => findTour(p)).find(Boolean);
          return <Link key={item.slug} to="/tour-packages" search={{ collection: item.slug }} className="group overflow-hidden rounded-lg border border-deep-forest/10 bg-surface-container-lowest hover:shadow-editorial">
            {tour && <img src={tour.image} alt={tour.alt} className="h-64 w-full object-cover" loading="lazy" />}
            <div className="p-8"><h2 className="mb-3 text-headline-md text-deep-forest">{item.name}</h2><p className="label text-savannah-gold">{item.packages.length} packages · Explore collection →</p></div>
          </Link>;
        }) : selected.packages.map((item) => {
          const tour = findTour(item);
          const confirmed = !!tour && durationMatches(tour, item.name);
          const title = item.name;
          return <article key={item.name} className="flex flex-col overflow-hidden rounded-lg border border-deep-forest/10 bg-surface-container-lowest">
            {tour && <img src={tour.image} alt={tour.alt} className="h-64 w-full object-cover" loading="lazy" />}
            <div className="flex grow flex-col p-8"><h2 className="mb-3 text-headline-md text-deep-forest">{title}</h2>
              {tour && <><p className="label mb-3 text-savannah-gold">{tour.duration}</p><p className="mb-5 text-body-md text-on-surface-variant">{tour.tagline}</p></>}
              {!confirmed && <p className="mb-5 text-body-md text-on-surface-variant">Contact us to confirm the proposed package itinerary.</p>}
              {tour && <p className="mb-4 text-sm text-on-surface-variant">{[...new Set(tour.itinerary.map(step => step.locationName).filter(Boolean))].slice(0,5).join(" · ") || tour.itinerary.slice(0,3).map(step => step.heading).join(" · ")}</p>}<Link to="/tours/$slug" params={{slug:item.slug}} className="label mt-auto text-savannah-gold">{confirmed ? "View Itinerary →" : "Enquire Now →"}</Link>
            </div>
          </article>;
        })}
      </div>
      <div className="mt-12 flex flex-wrap gap-6"><Link to="/safaris" className="label text-savannah-gold">Browse original safaris →</Link><Link to="/day-tours" className="label text-savannah-gold">Browse day tours →</Link></div>
    </main><SiteFooter /></div>;
}
