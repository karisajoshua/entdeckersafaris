import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import {
  readableDate,
  type BlogBlock,
  type BlogPost,
  type GalleryLocation,
  type ItineraryStep,
  type Tour,
} from "./content-types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const listGallery = createServerFn({ method: "GET" }).handler(
  async (): Promise<GalleryLocation[]> => {
    const supabase = publicClient();
    const [{ data: locations, error: locError }, { data: photos, error: photoError }] =
      await Promise.all([
        supabase
          .from("gallery_locations")
          .select("id, slug, name, blurb, sort_order")
          .order("sort_order"),
        supabase
          .from("gallery_photos")
          .select("id, location_id, image_url, alt, caption, sort_order")
          .order("sort_order"),
      ]);
    if (locError || photoError) return [];

    return (locations ?? []).map((location) => ({
      id: location.id,
      slug: location.slug,
      name: location.name,
      blurb: location.blurb,
      sortOrder: location.sort_order,
      photos: (photos ?? [])
        .filter((photo) => photo.location_id === location.id)
        .map((photo) => ({
          id: photo.id,
          src: photo.image_url,
          alt: photo.alt,
          caption: photo.caption,
          sortOrder: photo.sort_order,
        })),
    }));
  },
);

function mapPost(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  published_on: string;
  cover_url: string;
  cover_alt: string;
  body: unknown;
  published: boolean;
  sort_order: number;
}): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    author: row.author,
    date: row.published_on,
    readableDate: readableDate(row.published_on),
    cover: row.cover_url,
    coverAlt: row.cover_alt,
    body: (Array.isArray(row.body) ? row.body : []) as BlogBlock[],
    published: row.published,
    sortOrder: row.sort_order,
  };
}

const POST_COLUMNS =
  "id, slug, title, excerpt, author, published_on, cover_url, cover_alt, body, published, sort_order";

export const listPosts = createServerFn({ method: "GET" }).handler(async (): Promise<BlogPost[]> => {
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data.map(mapPost);
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data: input }): Promise<BlogPost | null> => {
    const { data, error } = await publicClient()
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("slug", input.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapPost(data);
  });

function mapTour(row: {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  price_usd: number | null;
  image_url: string;
  image_alt: string;
  category?: string | null;
  intro: unknown;
  itinerary: unknown;
  published: boolean;
  sort_order: number;
}): Tour {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    duration: row.duration,
    priceUsd: row.price_usd ?? null,
    image: row.image_url,
    alt: row.image_alt,
    category: row.category ?? "Safari Packages",
    intro: (Array.isArray(row.intro) ? row.intro : []) as string[],
    itinerary: (Array.isArray(row.itinerary) ? row.itinerary : []) as ItineraryStep[],
    published: row.published,
    sortOrder: row.sort_order,
  };
}

const TOUR_COLUMNS =
  "id, slug, title, tagline, duration, price_usd, image_url, image_alt, category, intro, itinerary, published, sort_order";

export const listTours = createServerFn({ method: "GET" }).handler(async (): Promise<Tour[]> => {
  const { data, error } = await publicClient()
    .from("tours")
    .select(TOUR_COLUMNS)
    .eq("published", true)
    .order("sort_order");
  if (error) {
    console.error("Unable to load published tours:", error.message);
    throw new Error("Tour packages could not be loaded. Please try again later.");
  }
  return (data ?? []).map(mapTour);
});

export const getTourBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data: input }): Promise<Tour | null> => {
    const { data, error } = await publicClient()
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("slug", input.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    const tour = mapTour(data);
    const ids = [...new Set(tour.itinerary.map((step) => step.destinationId).filter((id): id is string => Boolean(id)))];
    if (!ids.length) return tour;
    // The tour is published; fetch only the destination profiles referenced by its stops.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: destinations, error: destinationError } = await supabaseAdmin.from("destinations")
      .select("id, name, description, highlights, latitude, longitude, hero_image, gallery_images")
      .in("id", ids);
    if (destinationError) throw new Error("Tour destination details could not be loaded.");
    const byId = new Map((destinations ?? []).map((destination) => [destination.id, destination]));
    tour.itinerary = tour.itinerary.map((step) => {
      const destination = step.destinationId ? byId.get(step.destinationId) : undefined;
      if (!destination) return step;
      return {
        ...step,
        latitude: destination.latitude ?? undefined,
        longitude: destination.longitude ?? undefined,
        locationName: destination.name,
        destination: {
          name: destination.name,
          description: destination.description,
          highlights: destination.highlights ?? [],
          heroImage: destination.hero_image,
          galleryImages: destination.gallery_images ?? [],
        },
      };
    });
    return tour;
  });

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(4000),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input) => enquirySchema.parse(input))
  .handler(async ({ data: input }): Promise<{ ok: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_enquiries").insert({
      name: input.name,
      email: input.email,
      phone: input.phone ? input.phone : null,
      message: input.message,
    });
    if (error) {
      console.error("enquiry insert failed", error.message);
      throw new Error("We could not send your message. Please try again or email us directly.");
    }
    return { ok: true };
  });
