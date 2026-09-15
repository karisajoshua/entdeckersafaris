import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { useT } from "../lib/i18n";
import { useTranslatedTour } from "../lib/use-translated-content";
import { tourQuery } from "../lib/queries";
import { whatsappLink } from "../components/whatsapp-button";

export const Route = createFileRoute("/tours/$slug")({
  loader: async ({ context, params }) => {
    const tour = await context.queryClient.ensureQueryData(tourQuery(params.slug));
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
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
  component: TourDetail,
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
          to="/tour-packages"
          className="label rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial"
        >
          Browse all tours
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function TourDetail() {
  const t = useT();
  const { tour: rawTour } = Route.useLoaderData();
  const tour = useTranslatedTour(rawTour) ?? rawTour;

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
            <h1 className="text-headline-lg text-horizon-sand md:text-display-xl">{tour.title}</h1>
            <p className="mt-4 max-w-xl text-body-lg text-horizon-sand/90">{tour.tagline}</p>
          </div>
        </section>

        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          <div className="max-w-3xl space-y-6">
            {tour.intro.map((paragraph, i) => (
              <Reveal key={i} delay={i * 80}>
                <p className="text-body-lg text-on-surface-variant">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low px-gutter py-section-mobile md:py-section-desktop">
          <div className="mx-auto max-w-(--container-max)">
            <Reveal>
              <h2 className="mb-12 text-headline-md text-deep-forest md:text-headline-lg">
                {t("The Itinerary")}
              </h2>
            </Reveal>

            <ol className="relative max-w-3xl border-l border-deep-forest/15 pl-8">
              {tour.itinerary.map((step, i) => (
                <Reveal as="li" key={step.marker + i} delay={i * 60} className="relative pb-12 last:pb-0">
                  <span className="absolute -left-[41px] mt-2 flex h-4 w-4 items-center justify-center rounded-full border border-savannah-gold bg-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-savannah-gold" />
                  </span>
                  <p className="label mb-2 text-savannah-gold">{step.marker}</p>
                  <h3 className="mb-3 text-headline-md text-deep-forest">{step.heading}</h3>
                  <p className="text-body-md text-on-surface-variant">{step.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

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
