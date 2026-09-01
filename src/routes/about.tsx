import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import featureImg from "../assets/feature-nairobi-park.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — The Entdecker Safaris Story" },
      {
        name: "description",
        content:
          "Meet the Entdecker Safaris team: Nairobi-based travel consultants crafting personalized, respectful and luxurious Kenyan safari journeys.",
      },
      { property: "og:title", content: "About Entdecker Safaris" },
      {
        property: "og:description",
        content: "Travel consultants crafting memorable, personalized journeys across Kenya.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="grow pt-20">
        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-headline-md text-deep-forest md:text-headline-lg">
              The Entdecker Experience
            </h1>
            <p className="mb-6 text-body-lg text-on-surface-variant">
              Discover Nairobi, the 'place of cool waters'. We offer a unique blend where the vibrant
              energy of a modern metropolis seamlessly meets the raw, untamed beauty of the African
              wild.
            </p>
            <p className="text-body-md text-on-surface-variant">
              Our curated experiences are designed for those who seek both comfort and genuine
              adventure — from a single day among Nairobi's wildlife sanctuaries to eight days across
              Amboseli, the Rift Valley and the Masai Mara.
            </p>
          </div>
        </section>

        <section className="relative h-[420px] overflow-hidden">
          <img
            className="h-full w-full object-cover"
            alt="Giraffes grazing in Nairobi National Park with the city skyline behind"
            src={featureImg}
            width={1280}
            height={1024}
            loading="lazy"
          />
        </section>

        <section className="bg-deep-forest px-gutter py-section-mobile text-horizon-sand md:py-section-desktop">
          <div className="mx-auto max-w-[800px] text-center">
            <span className="material-symbols-outlined mb-6 text-[32px] text-savannah-gold">
              format_quote
            </span>
            <p className="text-headline-md leading-relaxed text-horizon-sand/90">
              "As travel consultants, we are here to help you create a memorable trip. Our passion
              for Kenya's landscapes and deep respect for its heritage ensures every safari is a
              masterpiece of discovery."
            </p>
            <p className="label mt-8 text-savannah-gold">The Entdecker Team</p>
          </div>
        </section>

        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile text-center md:py-section-desktop">
          <h2 className="mb-6 text-headline-md text-deep-forest">Ready to explore?</h2>
          <Link
            to="/tour-packages"
            className="label inline-block rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial transition-all hover:-translate-y-1"
          >
            View Tour Packages
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
