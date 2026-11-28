import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toursQuery } from "../lib/queries";
import heroImg from "../assets/hero-savannah.jpg";
import featureImg from "../assets/feature-nairobi-park.jpg";
import { Reveal } from "../components/reveal";
import { useT } from "../lib/i18n";
import { collections, findSource, durationMatches } from "../lib/collections";
import { whatsappLink } from "../components/whatsapp-button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entdecker Safaris — Luxury Kenya Safaris from Nairobi" },
      {
        name: "description",
        content:
          "Personalized luxury safaris across Kenya. Explore, discover and connect with curated journeys from Nairobi to the Masai Mara.",
      },
      { property: "og:title", content: "Entdecker Safaris — Luxury Kenya Safaris" },
      {
        property: "og:description",
        content: "Experience the unique beauty of Kenya with personalized luxury safaris.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(toursQuery),
  component: Index,
});

const stats = [
  { icon: "group", value: "+500", label: "Happy Customers" },
  { icon: "map", value: "+20", label: "Curated Tours" },
  { icon: "explore", value: "100%", label: "Excellent Guides" },
  { icon: "language", value: "+4", label: "Languages Spoken" },
];

function Index() {
  const t = useT();
  const { data: rawTours } = useSuspenseQuery(toursQuery);
  const packageItem = collections[0]!.packages[0]!;
  const tour = findSource(rawTours, packageItem);
  const confirmed = !!tour && durationMatches(tour, packageItem.name);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center pt-20">
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImg}')` }}
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center px-gutter text-center">
            <h1 className="mb-6 text-headline-lg text-horizon-sand md:text-display-xl">
              {t("Explore. Discover. Connect.")}
            </h1>
            <p className="mb-10 max-w-[600px] text-body-lg text-horizon-sand/90">
              {t("Experience the unique beauty of Kenya with personalized luxury safaris.")}
            </p>
            <Link
              to="/tour-packages"
              className="label rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial transition-all duration-300 hover:-translate-y-1 hover:opacity-90"
            >
              {t("Start Your Journey")}
            </Link>
          </div>
        </section>

        {/* Experience */}
        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <Reveal>
              <h2 className="mb-6 text-headline-md text-deep-forest md:text-headline-lg">
                {t("The Entdecker Experience")}
              </h2>
              <p className="mb-6 text-body-md text-on-surface-variant">
                {t(
                  "Discover Nairobi, the 'place of cool waters'. We offer a unique blend where the vibrant energy of a modern metropolis seamlessly meets the raw, untamed beauty of the African wild. Our curated experiences are designed for those who seek both comfort and genuine adventure.",
                )}
              </p>
              <Link
                to="/about"
                className="label inline-flex items-center gap-2 text-savannah-gold transition-opacity hover:opacity-80"
              >
                {t("Read Our Story")}
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </Reveal>
            <Reveal delay={120} className="relative h-[400px] overflow-hidden rounded-lg border border-deep-forest/10">
              <img
                className="h-full w-full object-cover"
                alt="Giraffes grazing in Nairobi National Park with the city skyline behind"
                src={featureImg}
                width={1280}
                height={1024}
                loading="lazy"
              />
            </Reveal>
          </div>
        </section>

        {/* Featured */}
        <section className="bg-surface-container-low px-gutter py-section-mobile md:py-section-desktop">
          <div className="mx-auto max-w-(--container-max)">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="text-headline-md text-deep-forest md:text-headline-lg">
                {t("Featured Safaris")}
              </h2>
              <Link
                to="/tour-packages"
                className="label hidden items-center gap-2 text-deep-forest transition-colors hover:text-savannah-gold md:inline-flex"
              >
                {t("View All Tours")}
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <Reveal className="group grid overflow-hidden rounded-lg border border-deep-forest/10 bg-surface shadow-editorial md:grid-cols-2">
              <div className="relative min-h-[280px] overflow-hidden md:min-h-[380px]">
                <img src={tour?.image || heroImg} alt={tour?.alt || "African savannah"} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="label mb-4 text-savannah-gold">Exclusive Safari Escapes · 10 Days</span>
                <h3 className="mb-4 text-headline-lg text-deep-forest">{packageItem.name}</h3>
                <p className="mb-6 text-body-md text-on-surface-variant">{confirmed ? tour?.tagline : "Discover our exclusive Out of Africa safari. Contact us for the detailed itinerary, availability and pricing."}</p>
                {confirmed ? <Link to="/tours/$slug" params={{slug:packageItem.slug}} className="label w-fit rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand">View Itinerary</Link> : <a href={whatsappLink("Hello Entdecker Safaris! I would like to enquire about 10 Days Out of Africa. Please share the itinerary, availability and pricing.")} target="_blank" rel="noopener noreferrer" className="label w-fit rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand">Enquire Now</a>}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Standard */}
        <section className="mx-auto max-w-(--container-max) border-t border-deep-forest/10 px-gutter py-section-mobile md:py-section-desktop">
          <div className="mx-auto max-w-5xl">
            <div>
              <h2 className="mb-6 text-center text-headline-md text-deep-forest">
                {t("The Entdecker Standard")}
              </h2>
              <div className="gold-rule mb-12 justify-center" aria-hidden="true">
                <span />
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-center md:grid-cols-4">
                {stats.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 80} className="flex flex-col items-center">
                    <span className="material-symbols-outlined mb-4 text-[40px] text-savannah-gold">
                      {stat.icon}
                    </span>
                    <h4 className="mb-2 text-headline-md text-deep-forest">{stat.value}</h4>
                    <p className="label text-on-surface-variant">{t(stat.label)}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="bg-deep-forest px-gutter py-section-mobile text-horizon-sand md:py-section-desktop">
          <div className="mx-auto max-w-[800px] text-center">
            <span className="material-symbols-outlined mb-6 text-[32px] text-savannah-gold">
              format_quote
            </span>
            <p className="text-headline-md leading-relaxed text-horizon-sand/90">
              {t(
                '"As travel consultants, we are here to help you create a memorable trip. Our passion for Kenya\'s landscapes and deep respect for its heritage ensures every safari is a masterpiece of discovery."',
              )}
            </p>
            <div className="mt-8">
              <p className="label text-savannah-gold">{t("The Entdecker Team")}</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
