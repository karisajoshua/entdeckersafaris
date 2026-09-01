import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Plan Your Kenya Safari with Entdecker" },
      {
        name: "description",
        content:
          "Reach out to Entdecker Safaris in Nairobi, Kenya to begin crafting your bespoke safari experience. Call +254 721 886 882 or send us a message.",
      },
      { property: "og:title", content: "Contact Entdecker Safaris" },
      {
        property: "og:description",
        content: "Let's craft your bespoke Kenyan safari experience together.",
      },
    ],
  }),
  component: Contact,
});

const fieldClass =
  "w-full border-0 border-b border-deep-forest/20 bg-transparent px-0 py-2 text-body-md text-deep-forest outline-none transition-colors placeholder:text-surface-dim focus:border-deep-forest";

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="relative grow pb-section-desktop pt-32">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaUqZ8z8ZDfOh6L4tqUczwJwonFEmi5lbLqObp5LqoyuOyN9NpP7htpQlFlI_IX_eI6pvld2JBFuiZLEeTkSe38WEoE5DSyvlBzvY4upizLPT8cyKLuQR1t95QQk60-lL4aXWUY_XYfnZmpIAtlOJjHQFTE0Rc2RJAxFNQqFyJdCmsVIQt90u_2784bqqrqO-6o1ApBQi4nT1KGkSPQmnxuASshv-M4Pn_HSxQt9A36g1iDKr0A8FJ')",
          }}
        />

        <div className="relative z-10 mx-auto max-w-(--container-max) px-gutter">
          <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2 md:gap-section-desktop">
            <div className="space-y-12">
              <h1 className="text-headline-lg tracking-tight text-deep-forest md:text-display-xl">
                Would like to talk?
              </h1>
              <p className="max-w-md text-body-lg text-on-surface-variant">
                Reach out to us to begin crafting your bespoke safari experience. We are here to
                answer any questions and guide your journey.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-savannah-gold">
                    location_on
                  </span>
                  <div>
                    <h3 className="label mb-1 text-on-surface-variant">Office</h3>
                    <p className="text-body-md text-deep-forest">Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-savannah-gold">call</span>
                  <div>
                    <h3 className="label mb-1 text-on-surface-variant">Phone</h3>
                    <a
                      href="tel:+254721886882"
                      className="text-body-md text-deep-forest transition-colors hover:text-savannah-gold"
                    >
                      +254 721 886 882
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-savannah-gold">mail</span>
                  <div>
                    <h3 className="label mb-1 text-on-surface-variant">Email</h3>
                    <a
                      href="mailto:info@entdeckersafaris.com"
                      className="text-body-md text-deep-forest transition-colors hover:text-savannah-gold"
                    >
                      info@entdeckersafaris.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-deep-forest/10 bg-surface-container-lowest p-8 shadow-sm md:p-12">
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label className="label mb-2 block text-on-surface-variant" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="label mb-2 block text-on-surface-variant" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Your email address"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="label mb-2 block text-on-surface-variant" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your dream safari..."
                    className={`${fieldClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="label w-full rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial transition-all hover:opacity-90 hover:shadow-editorial-lg md:w-auto"
                >
                  Send Message
                </button>
                {sent && (
                  <p className="text-body-md text-savannah-gold">
                    Thank you — we'll be in touch shortly.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
