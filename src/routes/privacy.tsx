import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Entdecker Safaris" },
      {
        name: "description",
        content:
          "How Entdecker Safaris collects, uses and protects the personal information you share when enquiring about or booking a Kenyan safari.",
      },
      { property: "og:title", content: "Privacy Policy — Entdecker Safaris" },
      {
        property: "og:description",
        content: "How we handle and protect the personal information of our safari guests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    heading: "Information we collect",
    body: [
      "When you send an enquiry or book a safari we collect the details you give us: your name, email address, phone number and the message or travel preferences you share with us.",
      "We may also collect basic technical information such as your browser type and pages visited, which helps us keep the website working well.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "We use your details to respond to your enquiry, prepare itineraries and quotations, arrange accommodation, transport, park entries and guides, and to keep you informed about your trip.",
      "With your consent we may occasionally send you news about new tours or seasonal offers. You can ask us to stop at any time.",
    ],
  },
  {
    heading: "Sharing with third parties",
    body: [
      "To deliver your safari we share only the necessary details with the partners involved — lodges and camps, transport providers, guides and, where applicable, park authorities.",
      "We do not sell, rent or trade your personal information to anyone.",
    ],
  },
  {
    heading: "Keeping your data safe",
    body: [
      "Enquiry and booking records are stored in access-controlled systems, and only authorised Entdecker Safaris staff can view them. We keep records only for as long as needed for your trip, our accounting obligations and any follow-up you may request.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You may ask us for a copy of the personal information we hold about you, request corrections, or ask us to delete it where we are not required to keep it. Write to info@entdeckersafaris.com and we will respond as quickly as we can.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "This website uses only the cookies and local storage needed for the site and the administrator sign-in to function. We do not use advertising trackers.",
    ],
  },
  {
    heading: "Contact us",
    body: [
      "Questions about this policy? Email info@entdeckersafaris.com or call +254 721 886 882. Entdecker Safaris is based in Nairobi, Kenya.",
    ],
  },
];

function Privacy() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="grow pt-20">
        <section className="mx-auto max-w-(--container-max) px-gutter py-section-mobile md:py-section-desktop">
          <div className="max-w-3xl">
            <p className="label mb-4 text-savannah-gold">Legal</p>
            <h1 className="mb-6 text-headline-md text-deep-forest md:text-headline-lg">
              Privacy Policy
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              This policy explains what personal information Entdecker Safaris collects, why we
              collect it, and the choices you have. Last updated 2 September 2026.
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
