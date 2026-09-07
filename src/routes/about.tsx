import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const services = [
  { icon: "safari", label: "Tour and Safaris" },
  { icon: "location_city", label: "Excursion & City Tour" },
  { icon: "airport_shuttle", label: "Hotel & Airport Transfer" },
  { icon: "hiking", label: "Tour Guide Services" },
];

const reasons = [
  { value: "+500", label: "Customers" },
  { value: "+20", label: "Tours and Safari Packages" },
  { value: "100%", label: "Excellent Tour Guides" },
  { value: "+4", label: "Languages Available" },
];

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="grow pt-20">
        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          <div className="max-w-3xl">
            <p className="label mb-4 text-savannah-gold">About Us</p>
            <h1 className="mb-6 text-headline-md text-deep-forest md:text-headline-lg">
              Welcome to Entdecker Safaris
            </h1>
            <p className="mb-6 text-body-lg text-on-surface-variant">
              As travel consultants, we are here to help you create a memorable trip that meets your
              specific interests and needs, and to discover new adventures. From the start, we will
              create a specialized, customized safari according to your specification and advise you
              on making the best choices.
            </p>
            <p className="text-body-md text-on-surface-variant">
              We will look after all the details to make your journey effortless and seamless so you
              can relax and thoroughly enjoy your holiday. Welcome, and feel free to book with us!
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

        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          <Reveal>
            <h2 className="mb-12 text-headline-md text-deep-forest md:text-headline-lg">
              What We Do
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal
                key={service.label}
                delay={i * 80}
                className="rounded-lg border border-deep-forest/10 bg-surface-container-lowest p-8 transition-shadow duration-300 hover:shadow-editorial"
              >
                <span className="material-symbols-outlined mb-6 block text-[32px] text-savannah-gold">
                  {service.icon}
                </span>
                <h3 className="text-headline-md text-deep-forest">{service.label}</h3>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low px-gutter py-section-mobile md:py-section-desktop">
          <div className="mx-auto max-w-(--container-max)">
            <Reveal>
              <h2 className="mb-6 text-center text-headline-md text-deep-forest">
                Why Entdecker Safaris
              </h2>
              <div className="gold-rule mb-12" aria-hidden="true">
                <span />
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {reasons.map((reason, i) => (
                <Reveal key={reason.label} delay={i * 80}>
                  <p className="mb-2 font-display text-headline-lg text-savannah-gold">
                    {reason.value}
                  </p>
                  <p className="label text-on-surface-variant">{reason.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
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
