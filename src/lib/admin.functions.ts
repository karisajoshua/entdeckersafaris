import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  readableDate,
  type BlogBlock,
  type BlogPost,
  type Enquiry,
  type GalleryLocation,
  type ItineraryStep,
  type Tour,
} from "./content-types";

type AuthedContext = {
  supabase: {
    from: (table: string) => any;
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };
  userId: string;
};

async function assertAdmin(context: AuthedContext) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || data !== true) throw new Error("Forbidden");
  return context.supabase;
}

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean }> => {
    const ctx = context as unknown as AuthedContext;
    const { data } = await ctx.supabase.rpc("has_role", {
      _user_id: ctx.userId,
      _role: "admin",
    });
    return { isAdmin: data === true };
  });

/* ---------------------------------- gallery --------------------------------- */

export const adminListGallery = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<GalleryLocation[]> => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const [{ data: locations }, { data: photos }] = await Promise.all([
      db.from("gallery_locations").select("id, slug, name, blurb, sort_order").order("sort_order"),
      db
        .from("gallery_photos")
        .select("id, location_id, image_url, alt, caption, sort_order")
        .order("sort_order"),
    ]);
    return ((locations ?? []) as any[]).map((location) => ({
      id: location.id,
      slug: location.slug,
      name: location.name,
      blurb: location.blurb,
      sortOrder: location.sort_order,
      photos: ((photos ?? []) as any[])
        .filter((photo) => photo.location_id === location.id)
        .map((photo) => ({
          id: photo.id,
          src: photo.image_url,
          alt: photo.alt,
          caption: photo.caption,
          sortOrder: photo.sort_order,
        })),
    }));
  });

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const slugField = z.preprocess(
  (value) => (typeof value === "string" ? slugify(value) : value),
  z.string().min(1, "Enter a name or slug").max(80),
);

const locationSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugField,
  name: z.string().trim().min(1).max(120),
  blurb: z.string().trim().max(2000).default(""),
  sortOrder: z.number().int().min(0).max(999).default(0),
});

export const saveGalleryLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => locationSchema.parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const row = {
      slug: data.slug,
      name: data.name,
      blurb: data.blurb,
      sort_order: data.sortOrder,
    };
    const { error } = data.id
      ? await db.from("gallery_locations").update(row).eq("id", data.id)
      : await db.from("gallery_locations").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteGalleryLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { error } = await db.from("gallery_locations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const photoSchema = z.object({
  id: z.string().uuid().optional(),
  locationId: z.string().uuid(),
  imageUrl: z.string().trim().min(1).max(2000),
  alt: z.string().trim().max(300).default(""),
  caption: z.string().trim().max(300).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

export const saveGalleryPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => photoSchema.parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const row = {
      location_id: data.locationId,
      image_url: data.imageUrl,
      alt: data.alt,
      caption: data.caption ? data.caption : null,
      sort_order: data.sortOrder,
    };
    const { error } = data.id
      ? await db.from("gallery_photos").update(row).eq("id", data.id)
      : await db.from("gallery_photos").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteGalleryPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { error } = await db.from("gallery_photos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ----------------------------------- blog ----------------------------------- */

const POST_COLUMNS =
  "id, slug, title, excerpt, author, published_on, cover_url, cover_alt, body, published, sort_order";

function mapPost(row: any): BlogPost {
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

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BlogPost[]> => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { data } = await db.from("blog_posts").select(POST_COLUMNS).order("sort_order");
    return ((data ?? []) as any[]).map(mapPost);
  });

const blockSchema = z.object({
  type: z.enum(["heading", "paragraph"]),
  text: z.string().trim().min(1).max(4000),
});

const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(600).default(""),
  author: z.string().trim().min(1).max(120).default("Entdecker Safaris"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker"),
  cover: z.string().trim().max(2000).default(""),
  coverAlt: z.string().trim().max(300).default(""),
  body: z.array(blockSchema).max(80).default([]),
  published: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(999).default(0),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => postSchema.parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const row = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      author: data.author,
      published_on: data.date,
      cover_url: data.cover,
      cover_alt: data.coverAlt,
      body: data.body,
      published: data.published,
      sort_order: data.sortOrder,
    };
    const { error } = data.id
      ? await db.from("blog_posts").update(row).eq("id", data.id)
      : await db.from("blog_posts").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { error } = await db.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ----------------------------------- tours ---------------------------------- */

const TOUR_COLUMNS =
  "id, slug, title, tagline, duration, image_url, image_alt, intro, itinerary, published, sort_order";

function mapTour(row: any): Tour {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    duration: row.duration,
    image: row.image_url,
    alt: row.image_alt,
    intro: (Array.isArray(row.intro) ? row.intro : []) as string[],
    itinerary: (Array.isArray(row.itinerary) ? row.itinerary : []) as ItineraryStep[],
    published: row.published,
    sortOrder: row.sort_order,
  };
}

export const adminListTours = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Tour[]> => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { data } = await db.from("tours").select(TOUR_COLUMNS).order("sort_order");
    return ((data ?? []) as any[]).map(mapTour);
  });

const stepSchema = z.object({
  marker: z.string().trim().min(1).max(80),
  heading: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
});

const tourSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
  title: z.string().trim().min(1).max(200),
  tagline: z.string().trim().max(400).default(""),
  duration: z.string().trim().max(60).default(""),
  image: z.string().trim().max(2000).default(""),
  alt: z.string().trim().max(300).default(""),
  intro: z.array(z.string().trim().min(1).max(4000)).max(20).default([]),
  itinerary: z.array(stepSchema).max(40).default([]),
  published: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(999).default(0),
});

export const saveTour = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => tourSchema.parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const row = {
      slug: data.slug,
      title: data.title,
      tagline: data.tagline,
      duration: data.duration,
      image_url: data.image,
      image_alt: data.alt,
      intro: data.intro,
      itinerary: data.itinerary,
      published: data.published,
      sort_order: data.sortOrder,
    };
    const { error } = data.id
      ? await db.from("tours").update(row).eq("id", data.id)
      : await db.from("tours").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTour = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { error } = await db.from("tours").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* --------------------------------- enquiries -------------------------------- */

export const adminListEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Enquiry[]> => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { data } = await db
      .from("contact_enquiries")
      .select("id, name, email, phone, message, handled, created_at")
      .order("created_at", { ascending: false });
    return ((data ?? []) as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      handled: row.handled,
      createdAt: row.created_at,
    }));
  });

export const setEnquiryHandled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), handled: z.boolean() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { error } = await db
      .from("contact_enquiries")
      .update({ handled: data.handled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const db = await assertAdmin(context as unknown as AuthedContext);
    const { error } = await db.from("contact_enquiries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
