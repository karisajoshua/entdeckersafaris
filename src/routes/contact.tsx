import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { submitEnquiry } from "../lib/content.functions";
import duskImg from "../assets/contact-dusk.jpg";
import { useT } from "../lib/i18n";

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
  const t = useT();
  const send = useServerFn(submitEnquiry);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setSending(true);
    setError(null);
    try {
      await send({
        data: {
          name: String(values.get("name") ?? ""),
          email: String(values.get("email") ?? ""),
          phone: String(values.get("phone") ?? ""),
          message: String(values.get("message") ?? ""),
        },
      });
      setSent(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not send your message. Please try again or email us directly.",
      );
    } finally {
      setSending(false);
    }
  }


  return (
    <div className="relative flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="relative grow pb-section-desktop pt-32">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('${duskImg}')` }}
        />

        <div className="relative z-10 mx-auto max-w-(--container-max) px-gutter">
          <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2 md:gap-section-desktop">
            <div className="space-y-12">
              <h1 className="text-headline-lg tracking-tight text-deep-forest md:text-display-xl">
                {t("Would like to talk?")}
              </h1>
              <div className="space-y-4">
                <h2 className="label text-savannah-gold">{t("Contact Details")}</h2>
                <p className="max-w-md text-body-lg text-on-surface-variant">
                  {t(
                    "If you have a story to share or a question that has not been answered on our website, please get in touch with us via the contact details listed below or fill in the form on the right.",
                  )}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-savannah-gold">
                    location_on
                  </span>
                  <div>
                    <h3 className="label mb-1 text-on-surface-variant">{t("Office")}</h3>
                    <p className="text-body-md text-deep-forest">{t("Nairobi, Kenya")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-savannah-gold">call</span>
                  <div>
                    <h3 className="label mb-1 text-on-surface-variant">{t("Phone")}</h3>
                    <a
                      href="tel:+254721886882"
                      className="block text-body-md text-deep-forest transition-colors hover:text-savannah-gold"
                    >
                      +254 721 886 882
                    </a>
                    <a
                      href="tel:+254104886882"
                      className="block text-body-md text-deep-forest transition-colors hover:text-savannah-gold"
                    >
                      +254 104 886 882
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-savannah-gold">mail</span>
                  <div>
                    <h3 className="label mb-1 text-on-surface-variant">{t("Email")}</h3>
                    <a
                      href="mailto:info@entdeckersafaris.com"
                      className="text-body-md text-deep-forest transition-colors hover:text-savannah-gold"
                    >
                      info@entdeckersafaris.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-savannah-gold">language</span>
                  <div>
                    <h3 className="label mb-1 text-on-surface-variant">{t("Website")}</h3>
                    <a
                      href="https://entdeckersafaris.com"
                      className="text-body-md text-deep-forest transition-colors hover:text-savannah-gold"
                    >
                      entdeckersafaris.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-deep-forest/10 bg-surface-container-lowest p-8 shadow-sm md:p-12">
              <form className="space-y-8" onSubmit={onSubmit}>
                <div>
                  <label className="label mb-2 block text-on-surface-variant" htmlFor="name">
                    {t("Name")}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder={t("Your full name")}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="label mb-2 block text-on-surface-variant" htmlFor="email">
                    {t("Email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t("Your email address")}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="label mb-2 block text-on-surface-variant" htmlFor="phone">
                    {t("Phone (optional)")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t("Your phone number")}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="label mb-2 block text-on-surface-variant" htmlFor="message">
                    {t("Message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder={t("Tell us about your dream safari...")}
                    className={`${fieldClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="label w-full rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial transition-all hover:opacity-90 hover:shadow-editorial-lg disabled:opacity-60 md:w-auto"
                >
                  {sending ? `${t("Sending")}…` : t("Send Message")}
                </button>
                {sent && (
                  <p className="text-body-md text-savannah-gold">
                    {t("Thank you — we'll be in touch shortly.")}
                  </p>
                )}
                {error && <p className="text-body-md text-red-700">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
