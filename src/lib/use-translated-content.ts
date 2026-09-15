import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useI18n } from "./i18n";
import { translateContent, type TranslatedFields, type TranslationMap } from "./translate.functions";
import type { BlogPost, GalleryLocation, Tour } from "./content-types";

type Entity = "tour" | "blog_post" | "gallery_photo" | "gallery_location";

function str(fields: TranslatedFields | undefined, key: string, fallback: string): string {
  const value = fields?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function list(fields: TranslatedFields | undefined, key: string, fallback: string[]): string[] {
  const value = fields?.[key];
  if (Array.isArray(value) && value.length === fallback.length) return value;
  return fallback;
}

function useTranslations(
  items: Array<{ entity: Entity; id: string; fields: Record<string, string | string[]> }>,
) {
  const { lang } = useI18n();
  const translate = useServerFn(translateContent);
  const signature = items.map((item) => `${item.entity}:${item.id}`).join(",");

  const query = useQuery<TranslationMap>({
    queryKey: ["translations", lang, signature],
    enabled: lang !== "en" && items.length > 0,
    staleTime: 60 * 60 * 1000,
    queryFn: () =>
      translate({ data: { lang: lang as "fr" | "de" | "it", items } }) as Promise<TranslationMap>,
  });

  if (typeof window !== "undefined") console.log("i18n query", lang, items.length, query.status, query.fetchStatus, query.error);
  return lang === "en" ? {} : (query.data ?? {});
}

export function useTranslatedTours(tours: Tour[]): Tour[] {
  const map = useTranslations(
    tours.map((tour) => ({
      entity: "tour" as const,
      id: tour.id,
      fields: {
        title: tour.title,
        tagline: tour.tagline,
        duration: tour.duration,
        category: tour.category,
        intro: tour.intro,
        itineraryHeadings: tour.itinerary.map((step) => step.heading),
        itineraryBodies: tour.itinerary.map((step) => step.body),
      },
    })),
  );

  return tours.map((tour) => {
    const fields = map[`tour:${tour.id}`];
    if (!fields) return tour;
    const headings = list(
      fields,
      "itineraryHeadings",
      tour.itinerary.map((step) => step.heading),
    );
    const bodies = list(
      fields,
      "itineraryBodies",
      tour.itinerary.map((step) => step.body),
    );
    return {
      ...tour,
      title: str(fields, "title", tour.title),
      tagline: str(fields, "tagline", tour.tagline),
      duration: str(fields, "duration", tour.duration),
      category: str(fields, "category", tour.category),
      intro: list(fields, "intro", tour.intro),
      itinerary: tour.itinerary.map((step, index) => ({
        marker: step.marker,
        heading: headings[index] ?? step.heading,
        body: bodies[index] ?? step.body,
      })),
    };
  });
}

export function useTranslatedTour(tour: Tour | null | undefined): Tour | null | undefined {
  const translated = useTranslatedTours(tour ? [tour] : []);
  if (!tour) return tour;
  return translated[0] ?? tour;
}

export function useTranslatedPosts(posts: BlogPost[]): BlogPost[] {
  const map = useTranslations(
    posts.map((post) => ({
      entity: "blog_post" as const,
      id: post.id,
      fields: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body.map((block) => block.text),
      },
    })),
  );

  return posts.map((post) => {
    const fields = map[`blog_post:${post.id}`];
    if (!fields) return post;
    const bodies = list(
      fields,
      "body",
      post.body.map((block) => block.text),
    );
    return {
      ...post,
      title: str(fields, "title", post.title),
      excerpt: str(fields, "excerpt", post.excerpt),
      body: post.body.map((block, index) => ({
        type: block.type,
        text: bodies[index] ?? block.text,
      })),
    };
  });
}

export function useTranslatedPost(post: BlogPost | null | undefined): BlogPost | null | undefined {
  const translated = useTranslatedPosts(post ? [post] : []);
  if (!post) return post;
  return translated[0] ?? post;
}

export function useTranslatedGallery(locations: GalleryLocation[]): GalleryLocation[] {
  const map = useTranslations(
    locations.map((location) => ({
      entity: "gallery_location" as const,
      id: location.id,
      fields: {
        name: location.name,
        blurb: location.blurb,
        captions: location.photos.map((photo) => photo.caption ?? ""),
      },
    })),
  );

  return locations.map((location) => {
    const fields = map[`gallery_location:${location.id}`];
    if (!fields) return location;
    const captions = list(
      fields,
      "captions",
      location.photos.map((photo) => photo.caption ?? ""),
    );
    return {
      ...location,
      name: str(fields, "name", location.name),
      blurb: str(fields, "blurb", location.blurb),
      photos: location.photos.map((photo, index) => ({
        ...photo,
        caption: captions[index] ? captions[index]! : photo.caption,
      })),
    };
  });
}
