import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { Lightbox } from "../components/lightbox";
import { galleryLocations } from "../data/gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Safari Gallery — Masai Mara Photography | Entdecker Safaris" },
      {
        name: "description",
        content:
          "Photographs from our own Kenya safaris: Masai Mara lion prides, Maasai giraffe and the Great Migration crossing the plains.",
      },
      { property: "og:title", content: "Safari Gallery — Entdecker Safaris" },
      {
        property: "og:description",
        content: "Lions, giraffe and the Great Migration, photographed on our Masai Mara safaris.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://smile-smith-project.lovable.app/gallery" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://smile-smith-project.lovable.app/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [open, setOpen] = useState<{ location: string; index: number } | null>(null);
  const activeLocation = galleryLocations.find((l) => l.slug === open?.location);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <header className="mx-auto mt-24 max-w-(--container-max) px-gutter pb-section-mobile pt-section-mobile md:pb-16 md:pt-section-desktop">
        <div className="max-w-3xl">
          <span className="label text-savannah-gold">Gallery</span>
          <h1 className="mb-6 mt-4 text-headline-md text-deep-forest md:text-headline-lg">
            Moments From The Wild
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Scenes captured on safari with our guides, sorted by location. Click any photograph to
            view it full size.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-(--container-max) grow px-gutter pb-section-desktop">
        {galleryLocations.map((location) => (
          <section key={location.slug} className="mb-section-desktop last:mb-0">
            <Reveal className="mb-10 max-w-2xl border-l-2 border-savannah-gold pl-6">
              <h2 className="mb-3 text-headline-md text-deep-forest">{location.name}</h2>
              <p className="text-body-md text-on-surface-variant">{location.blurb}</p>
            </Reveal>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {location.photos.map((photo, i) => (
                <Reveal
                  key={photo.src}
                  delay={i * 60}
                  className={photo.wide ? "col-span-2 md:col-span-3" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setOpen({ location: location.slug, index: i })}
                    className="group block w-full overflow-hidden rounded-lg border border-deep-forest/10 bg-surface-variant"
                    aria-label={`Open photo: ${photo.alt}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                        photo.wide ? "h-56 md:h-80" : "h-56 md:h-80"
                      }`}
                    />
                  </button>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </main>

      {activeLocation && open && (
        <Lightbox
          photos={activeLocation.photos}
          index={open.index}
          onClose={() => setOpen(null)}
          onChange={(index) => setOpen({ location: activeLocation.slug, index })}
        />
      )}

      <SiteFooter />
    </div>
  );
}
