import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Entdecker Safaris" },
      {
        name: "description",
        content:
          "The booking, payment, cancellation and travel terms that apply to safaris, city tours and transfers arranged by Entdecker Safaris in Kenya.",
      },
      { property: "og:title", content: "Terms of Service — Entdecker Safaris" },
      {
        property: "og:description",
        content: "Booking, payment, cancellation and travel terms for Entdecker Safaris journeys.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    heading: "About these terms",
    body: [
      "These terms apply to every safari, excursion, city tour, transfer and guiding service arranged by Entdecker Safaris, Nairobi, Kenya. By sending an enquiry or confirming a booking with us you accept them.",
    ],
  },
  {
    heading: "Enquiries and quotations",
    body: [
      "Prices quoted are based on the itinerary, travel dates, group size and accommodation agreed at the time of quoting. Quotations are valid until the stated date and may change if park fees, accommodation rates or exchange rates change before confirmation.",
    ],
  },
  {
    heading: "Bookings and payment",
    body: [
      "A booking becomes confirmed once we receive the agreed deposit and issue a written confirmation. The balance is payable before your trip begins, on the date shown on your invoice.",
      "Bank charges and transfer fees are the responsibility of the traveller.",
    ],
  },
  {
    heading: "Changes and cancellations",
    body: [
      "Tell us as soon as possible if your plans change and we will do our best to adjust your itinerary. Cancellation charges reflect the amounts our lodges, camps, transport partners and park authorities hold us to, and are confirmed in writing when you book.",
      "If circumstances beyond our control — weather, road conditions, wildlife movement, closures or safety concerns — require a change, we will offer the closest reasonable alternative.",
    ],
  },
  {
    heading: "What is included",
    body: [
      "Each itinerary states exactly what is included. Unless stated otherwise, international flights, visas, travel insurance, tips, drinks and items of a personal nature are not included.",
    ],
  },
  {
    heading: "Travel documents, health and insurance",
    body: [
      "You are responsible for holding a valid passport, the correct visas and any required vaccinations. We strongly recommend comprehensive travel insurance covering medical treatment, evacuation, cancellation and baggage.",
    ],
  },
  {
    heading: "Conduct and wildlife safety",
    body: [
      "Guests must follow the instructions of their guide and park regulations at all times. For your safety and the welfare of the animals, we may decline to continue an activity where instructions are not followed.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "Entdecker Safaris acts with care in selecting its partners but is not liable for loss, injury or delay caused by third-party suppliers or events outside our reasonable control. Nothing in these terms limits liability where the law does not allow it.",
    ],
  },
  {
    heading: "Website content",
    body: [
      "Photographs, itineraries and text on this website belong to Entdecker Safaris or are used with permission, and may not be reproduced without our written consent.",
    ],
  },
  {
    heading: "Questions",
    body: [
      "Email info@entdeckersafaris.com or call +254 721 886 882 / +254 104 886 882. These terms are governed by the laws of Kenya. Last updated 2 September 2026.",
    ],
  },
];

function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="grow pt-20">
        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          <div className="max-w-3xl">
            <p className="label mb-4 text-savannah-gold">Legal</p>
            <h1 className="mb-6 text-headline-md text-deep-forest md:text-headline-lg">
              Terms of Service
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              The terms below govern the safaris, tours and transfers we arrange for you. Please read
              them before confirming a booking.
            </p>
          </div>

          <div className="mt-16 max-w-3xl space-y-12">
            {sections.map((section, i) => (
              <Reveal key={section.heading} delay={i * 60} as="article">
                <h2 className="mb-4 text-title-lg text-deep-forest">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mb-4 text-body-md text-on-surface-variant">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
