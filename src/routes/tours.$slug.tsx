import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { useT } from "../lib/i18n";
import { useTranslatedTour } from "../lib/use-translated-content";
import { collections, findSource, durationMatches } from "../lib/collections";
import { toursQuery, tourQuery } from "../lib/queries";
import { whatsappLink } from "../components/whatsapp-button";
import mara1 from "../assets/gallery/masai-mara-1.jpeg.asset.json";
import mara3 from "../assets/gallery/masai-mara-3.jpeg.asset.json";
import mara8 from "../assets/gallery/masai-mara-8.jpeg.asset.json";

export const Route = createFileRoute("/tours/$slug")({
  loader: async ({ context, params }) => {
    const category = collections.find(c => c.packages.some(p => p.slug === params.slug));
    const item = category?.packages.find(p => p.slug === params.slug);
    if (item && category) {
      const tours = await context.queryClient.ensureQueryData(toursQuery);
      const source = findSource(tours, item);
      const tour = source ? await context.queryClient.ensureQueryData(tourQuery(source.slug)) : null;
      return { tour, item, category, confirmed: !!tour && durationMatches(tour, item.name) };
    }
    const tour = await context.queryClient.ensureQueryData(tourQuery(params.slug));
    if (!tour) throw notFound();
    return { tour, item: undefined, category: undefined, confirmed: true };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.tour) {
      return {
        meta: [{ title: "Tour unavailable — Entdecker Safaris" }, { name: "robots", content: "noindex" }],
      };
    }
    const { tour } = loaderData;
    const description = `${tour.title} (${tour.duration}) — ${tour.tagline} Detailed day-by-day itinerary from Entdecker Safaris, Nairobi.`;
    return {
      meta: [
        { title: `${tour.title} — Entdecker Safaris` },
        { name: "description", content: description },
        { property: "og:title", content: `${tour.title} — Entdecker Safaris` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: TourNotFound,
  errorComponent: TourNotFound,
  component: PackageDetail,
});

function TourNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="mx-auto flex max-w-(--container-max) grow flex-col items-center justify-center px-gutter py-section-desktop text-center">
        <h1 className="mb-6 text-headline-md text-deep-forest">Tour not found</h1>
        <p className="mb-8 text-body-md text-on-surface-variant">
          The itinerary you're looking for isn't available.
        </p>
        <Link
          to="/safaris"
          className="label rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial"
        >
          Browse all tours
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function PackageDetail() {
  const data = Route.useLoaderData();
  if (!data.tour || !data.confirmed) return <div className="flex min-h-screen flex-col bg-surface"><SiteHeader /><main className="mx-auto mt-32 w-full max-w-(--container-max) grow px-gutter py-section-mobile"><Link to="/tour-packages" search={{collection:data.category?.slug}} className="label text-savannah-gold">← {data.category?.name}</Link><h1 className="my-6 text-headline-lg text-deep-forest">{data.item?.name}</h1><p className="mb-8">The detailed itinerary is awaiting confirmation. Contact us to plan this journey.</p><a href={whatsappLink(`Hello Entdecker Safaris! I would like to enquire about ${data.item?.name ?? "this safari"}. Please share the itinerary, availability and pricing.`)} target="_blank" rel="noopener noreferrer" className="label inline-block rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand">Enquire Now →</a></main><SiteFooter /></div>;
  return <TourDetail key={data.item?.slug ?? data.tour.slug} />;
}

function TourDetail() {
  const t = useT();
  const { tour: rawTour, item, category, confirmed } = Route.useLoaderData();
  const sourceTour = rawTour!;
  const tour = useTranslatedTour(sourceTour) ?? sourceTour;
  const includesMasaiMara = [
    tour.title,
    tour.tagline,
    ...tour.intro,
    ...tour.itinerary.flatMap((step) => [step.heading, step.body]),
  ]
    .join(" ")
    .toLowerCase()
    .includes("mara");

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="grow">
        <section className="relative h-[60vh] min-h-[420px] w-full pt-20">
          <img
            src={tour.image}
            alt={tour.alt}
            width={1024}
            height={768}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 mx-auto flex h-full max-w-(--container-max) flex-col justify-end px-gutter pb-16">
            <span className="label mb-4 w-fit rounded-sm bg-savannah-gold px-3 py-1 text-deep-forest">
              {tour.duration}
            </span>
            <h1 className="text-headline-lg text-horizon-sand md:text-display-xl">{item?.name ?? tour.title}</h1>
            <p className="mt-4 max-w-xl text-body-lg text-horizon-sand/90">{tour.tagline}</p>
            {tour.priceUsd != null && (
              <p className="label mt-4 w-fit rounded-sm border border-savannah-gold/60 px-3 py-1 text-savannah-gold">
                {t("From")} ${tour.priceUsd.toLocaleString("en-US")} {t("per person")}
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          {category && <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-2 text-sm text-savannah-gold"><Link to="/tour-packages" search={{}}>Safari Escapes</Link><span>/</span><Link to="/tour-packages" search={{collection:category.slug}}>{category.name}</Link><span>/</span><span>{item?.name}</span></nav>}
          {!confirmed && <p className="mb-6 rounded-lg border border-savannah-gold/40 p-4">Proposed package duration is awaiting confirmation. The existing {tour.duration} itinerary below is a reference only.</p>}
          <div className="max-w-3xl space-y-6">
            {tour.intro.map((paragraph, i) => (
              <Reveal key={i} delay={i * 80}>
                <p className="text-body-lg text-on-surface-variant">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {includesMasaiMara && (
          <section className="mx-auto max-w-(--container-max) px-gutter pb-section-mobile md:pb-section-desktop">
            <Reveal>
              <span className="label text-savannah-gold">{t("Gallery")}</span>
              <h2 className="mb-8 mt-3 text-headline-md text-deep-forest md:text-headline-lg">
                {t("Moments From The Wild")}
              </h2>
            </Reveal>
            <div className="grid h-[620px] grid-cols-2 grid-rows-2 gap-3 md:h-[520px] md:grid-cols-[1.1fr_0.9fr_0.9fr] md:grid-rows-1">
              <Reveal className="col-span-2 overflow-hidden rounded-lg md:col-span-1">
                <img
                  src={mara8.url}
                  alt="Wildebeest gathering during the Great Migration in the Masai Mara"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </Reveal>
              <Reveal delay={80} className="overflow-hidden rounded-lg">
                <img
                  src={mara3.url}
                  alt="Male lion calling across the Masai Mara grasslands"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </Reveal>
              <Reveal delay={160} className="overflow-hidden rounded-lg">
                <img
                  src={mara1.url}
                  alt="Maasai giraffe walking through golden savannah grass"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </Reveal>
            </div>
          </section>
        )}

        <InteractiveItinerary steps={tour.itinerary} />

        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile text-center md:py-section-desktop">
          <Reveal>
            <h2 className="mb-6 text-headline-md text-deep-forest">
              {t("Ready to tailor this itinerary?")}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-body-md text-on-surface-variant">
              {t(
                "Every journey is flexible — tell us your dates, budget and interests and we will adapt it to you.",
              )}
            </p>
            <a
              href={whatsappLink(
                `Hello Entdecker Safaris! I'd like to enquire about the ${tour.title}${
                  tour.duration ? ` (${tour.duration})` : ""
                }.\n${tour.tagline}\nCould you share availability, pricing and what's included?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="label inline-block rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial transition-all hover:-translate-y-1"
            >
              {t("Enquire About This Safari")}
            </a>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

type MappedStep = { marker: string; heading: string; body: string; latitude?: number; longitude?: number; locationName?: string; destination?: { name: string; description: string; highlights: string[]; heroImage: string; galleryImages: string[] } };

function InteractiveItinerary({ steps }: { steps: MappedStep[] }) {
  const [active, setActive] = useState(0);
  const step = steps[active];
  if (!step) return null;
  const mapped = steps.filter((item) =>
    typeof item.latitude === "number" && Number.isFinite(item.latitude) &&
    typeof item.longitude === "number" && Number.isFinite(item.longitude) &&
    Math.abs(item.latitude) <= 90 && Math.abs(item.longitude) <= 180,
  );
  const selected = typeof step.latitude === "number" && typeof step.longitude === "number"
    ? step : mapped[0];
  const mapUrl = selected
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${selected.longitude! - 0.12}%2C${selected.latitude! - 0.09}%2C${selected.longitude! + 0.12}%2C${selected.latitude! + 0.09}&layer=mapnik&marker=${selected.latitude}%2C${selected.longitude}`
    : null;
  const routeUrl = mapped.length > 1
    ? `https://www.google.com/maps/dir/?api=1&origin=${mapped[0]!.latitude}%2C${mapped[0]!.longitude}&destination=${mapped[mapped.length - 1]!.latitude}%2C${mapped[mapped.length - 1]!.longitude}${mapped.length > 2 ? `&waypoints=${mapped.slice(1, -1).map((item) => `${item.latitude}%2C${item.longitude}`).join("%7C")}` : ""}&travelmode=driving`
    : null;

  return (
    <section className="bg-surface-container-low px-gutter py-section-mobile md:py-section-desktop">
      <div className="mx-auto max-w-(--container-max)">
        <h2 className="mb-8 text-headline-md text-deep-forest md:text-headline-lg">Explore the itinerary</h2>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="rounded-lg border border-deep-forest/10 bg-surface p-6 md:p-8" aria-live="polite">
            <p className="label mb-4 text-savannah-gold">Stop {active + 1} of {steps.length} · {step.marker}</p>
            <h3 className="mb-4 text-headline-md text-deep-forest">{step.heading}</h3>
            <p className="mb-8 whitespace-pre-line text-body-md text-on-surface-variant">{step.body}</p>
            {step.destination && <div className="mb-8 border-t border-deep-forest/10 pt-5">
              {step.destination.heroImage && <img src={step.destination.heroImage} alt={step.destination.name} loading="lazy" className="mb-4 h-48 w-full rounded-lg object-cover" />}
              <h4 className="mb-2 text-lg font-semibold text-deep-forest">{step.destination.name}</h4>
              {step.destination.description && <p className="text-body-md text-on-surface-variant">{step.destination.description}</p>}
              {step.destination.highlights.length > 0 && <ul className="mt-3 list-disc pl-5 text-body-md text-on-surface-variant">{step.destination.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
              {step.destination.galleryImages.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">{step.destination.galleryImages.slice(0, 3).filter(Boolean).map((photo) => <img key={photo} src={photo} alt={step.destination!.name} loading="lazy" className="h-24 w-full rounded object-cover" />)}</div>}
            </div>}
            <div className="flex items-center justify-between gap-4">
              <button type="button" disabled={active === 0} onClick={() => setActive((n) => Math.max(0, n - 1))}
                className="label rounded-sm border border-deep-forest/20 px-5 py-3 text-deep-forest disabled:cursor-not-allowed disabled:opacity-40">
                ← Previous
              </button>
              <button type="button" disabled={active === steps.length - 1} onClick={() => setActive((n) => Math.min(steps.length - 1, n + 1))}
                className="label rounded-sm bg-deep-forest px-5 py-3 text-horizon-sand disabled:cursor-not-allowed disabled:opacity-40">
                Next →
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Choose itinerary stop">
              {steps.map((item, index) => (
                <button key={index} type="button" onClick={() => setActive(index)} aria-label={`Show stop ${index + 1}: ${item.heading}`}
                  aria-current={index === active ? "step" : undefined}
                  className={`label h-9 min-w-9 rounded-full border px-2 ${index === active ? "border-deep-forest bg-deep-forest text-white" : "border-deep-forest/20 text-deep-forest"}`}>
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-deep-forest/10 bg-surface">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="label text-deep-forest">Journey map</p>
                <p className="text-body-md text-on-surface-variant">{selected?.locationName || (selected ? step.heading : "Location coordinates pending")}</p>
              </div>
              {routeUrl && <a href={routeUrl} target="_blank" rel="noopener noreferrer" className="label text-savannah-gold underline">View route ↗</a>}
            </div>
            {mapUrl ? (
              <iframe key={mapUrl} title={`Map for ${step.heading}`} src={mapUrl} loading="lazy"
                referrerPolicy="no-referrer" className="h-[360px] w-full border-0 md:h-[480px]" />
            ) : (
              <div className="flex h-[360px] items-center justify-center bg-surface-container-low px-8 text-center text-body-md text-on-surface-variant md:h-[480px]">
                This tour's map will appear when its stops have been assigned geographic coordinates in the tour editor.
              </div>
            )}
            <p className="px-5 py-3 text-body-md text-on-surface-variant">
              Map highlights the selected stop. Open the route for road directions; actual travel may differ by itinerary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
