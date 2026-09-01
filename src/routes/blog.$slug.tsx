import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { getPost } from "../data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found — Entdecker Safaris" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    const url = `https://smile-smith-project.lovable.app/blog/${params.slug}`;
    return {
      meta: [
        { title: `${post.title} — Entdecker Safaris` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Organization", name: post.author },
          }),
        },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPostPage,
});

function PostNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="mx-auto flex max-w-(--container-max) grow flex-col items-center justify-center px-gutter py-section-desktop text-center">
        <h1 className="mb-6 text-headline-md text-deep-forest">Article not found</h1>
        <Link to="/blog" className="label text-savannah-gold">
          Back to the journal
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <div className="relative mt-24 h-[45vh] min-h-[320px] w-full overflow-hidden">
        <img src={post.cover} alt={post.coverAlt} className="h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-(--container-max) px-gutter pb-10">
          <span className="label text-horizon-sand/80">{post.readableDate}</span>
          <h1 className="mt-4 max-w-4xl text-headline-md text-horizon-sand md:text-headline-lg">
            {post.title}
          </h1>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl grow px-gutter py-section-mobile md:py-section-desktop">
        <p className="label mb-10 text-savannah-gold">By {post.author}</p>

        <p className="mb-10 text-body-lg text-deep-forest">{post.excerpt}</p>

        {post.body.map((block, i) =>
          block.type === "heading" ? (
            <Reveal key={i} delay={i * 40}>
              <h2 className="mb-4 mt-12 text-headline-md text-deep-forest">{block.text}</h2>
            </Reveal>
          ) : (
            <Reveal key={i} delay={i * 40}>
              <p className="mb-6 text-body-lg text-on-surface-variant">{block.text}</p>
            </Reveal>
          ),
        )}

        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-deep-forest/10 pt-10">
          <Link
            to="/contact"
            className="label rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial transition-opacity hover:opacity-90"
          >
            Plan Your Safari
          </Link>
          <Link to="/blog" className="label text-savannah-gold hover:text-deep-forest">
            ← Back to the journal
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
