import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { Lightbox } from "../components/lightbox";
import { galleryQuery } from "../lib/queries";
import { useT } from "../lib/i18n";
import { useTranslatedGallery } from "../lib/use-translated-content";

export const Route = createFileRoute("/gallery")({
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery),
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
  errorComponent: () => <GalleryMessage title="Gallery unavailable" />,
  notFoundComponent: () => <GalleryMessage title="Gallery not found" />,
  component: GalleryPage,
});

function GalleryMessage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-(--container-max) grow items-center justify-center px-gutter py-section-desktop">
        <h1 className="text-headline-md text-deep-forest">{title}</h1>
      </main>
      <SiteFooter />
    </div>
  );
}

function GalleryPage() {
  const t = useT();
  const { data: rawLocations } = useSuspenseQuery(galleryQuery);
  const locations = useTranslatedGallery(rawLocations);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<{ location: string; index: number } | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? locations : locations.filter((l) => l.slug === filter)),
    [locations, filter],
  );
  const activeLocation = locations.find((l) => l.slug === open?.location);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <header className="mx-auto mt-24 w-full max-w-(--container-max) px-gutter pb-10 pt-section-mobile md:pt-section-desktop">
        <div className="max-w-3xl">
          <span className="label text-savannah-gold">{t("Gallery")}</span>
          <h1 className="mb-6 mt-4 text-headline-md text-deep-forest md:text-headline-lg">
            {t("Moments From The Wild")}
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            {t(
              "Scenes captured on safari with our guides, sorted by location. Click any photograph to view it full size.",
            )}
          </p>
        </div>

        {locations.length > 1 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {[{ slug: "all", name: t("All locations") }, ...locations].map((option) => (
              <button
                key={option.slug}
                type="button"
                onClick={() => setFilter(option.slug)}
                className={`label rounded-full border px-5 py-2 transition-colors ${
                  filter === option.slug
                    ? "border-deep-forest bg-deep-forest text-horizon-sand"
                    : "border-deep-forest/20 text-on-surface-variant hover:border-deep-forest hover:text-deep-forest"
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-(--container-max) grow px-gutter pb-section-desktop">
        {visible.map((location) => (
          <section key={location.slug} className="mb-section-desktop last:mb-0">
            <Reveal className="mb-10 max-w-2xl border-l-2 border-savannah-gold pl-6">
              <h2 className="mb-3 text-headline-md text-deep-forest">{location.name}</h2>
              <p className="text-body-md text-on-surface-variant">{location.blurb}</p>
            </Reveal>

            <div className="gap-4 [column-fill:_balance] columns-2 md:gap-6 md:columns-3 lg:columns-4">
              {location.photos.map((photo, i) => (
                <Reveal key={photo.id} delay={Math.min(i, 8) * 60} className="mb-4 md:mb-6">
                  <button
                    type="button"
                    onClick={() => setOpen({ location: location.slug, index: i })}
                    className="group relative block w-full overflow-hidden rounded-lg border border-deep-forest/10 bg-surface-variant transition-all duration-500 hover:-translate-y-1 hover:shadow-editorial"
                    aria-label={`Open photo: ${photo.alt}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-deep-forest/90 to-transparent p-4 text-left text-body-md text-horizon-sand opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {photo.caption ?? photo.alt}
                    </span>
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
