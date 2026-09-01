import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { posts } from "../data/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Safari Journal — Kenya Travel Stories | Entdecker Safaris" },
      {
        name: "description",
        content:
          "Guides and stories from our Kenyan safaris: the Great Migration, Nairobi National Park city safaris and practical packing advice.",
      },
      { property: "og:title", content: "Safari Journal — Entdecker Safaris" },
      {
        property: "og:description",
        content: "Stories and practical guides from the plains of Kenya.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://smile-smith-project.lovable.app/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://smile-smith-project.lovable.app/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = posts;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <header className="mx-auto mt-24 max-w-(--container-max) px-gutter pb-12 pt-section-mobile md:pt-section-desktop">
        <div className="max-w-3xl">
          <span className="label text-savannah-gold">Journal</span>
          <h1 className="mb-6 mt-4 text-headline-md text-deep-forest md:text-headline-lg">
            Notes From The Field
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Migration timings, city safaris and hard-won packing wisdom — written by the guides who
            drive these routes every week.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-(--container-max) grow px-gutter pb-section-desktop">
        {featured && (
          <Reveal
            as="article"
            className="mb-16 grid grid-cols-1 gap-8 overflow-hidden rounded-lg border border-deep-forest/10 bg-surface-container-lowest md:grid-cols-2"
          >
            <img
              src={featured.cover}
              alt={featured.coverAlt}
              className="h-64 w-full object-cover md:h-full"
            />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="label text-savannah-gold">{featured.readableDate}</span>
              <h2 className="mb-4 mt-4 text-headline-md text-deep-forest">{featured.title}</h2>
              <p className="mb-8 text-body-md text-on-surface-variant">{featured.excerpt}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="label inline-flex w-fit items-center space-x-2 border-b border-transparent pb-1 text-savannah-gold transition-colors hover:border-deep-forest hover:text-deep-forest"
              >
                <span>Read Article</span>
                <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
              </Link>
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal
              as="article"
              key={post.slug}
              delay={i * 80}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-deep-forest/10 bg-surface-container-lowest transition-shadow duration-300 hover:shadow-editorial"
            >
              <div className="h-56 overflow-hidden bg-surface-variant">
                <img
                  src={post.cover}
                  alt={post.coverAlt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex grow flex-col p-8">
                <span className="label text-savannah-gold">{post.readableDate}</span>
                <h2 className="mb-4 mt-4 text-headline-md text-deep-forest">{post.title}</h2>
                <p className="mb-8 grow text-body-md text-on-surface-variant">{post.excerpt}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="label mt-auto inline-flex w-fit items-center space-x-2 border-b border-transparent pb-1 text-savannah-gold transition-colors hover:border-deep-forest hover:text-deep-forest"
                >
                  <span>Read Article</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
