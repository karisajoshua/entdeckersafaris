import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Destination = {
  id: string; name: string; slug: string; country: string; region: string;
  description: string; highlights: string[]; latitude: number | null;
  longitude: number | null; hero_image: string; gallery_images: string[];
  published: boolean;
};

const destinationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  country: z.string().trim().min(1).max(100),
  region: z.string().trim().max(150),
  description: z.string().trim().max(8000),
  highlights: z.array(z.string().trim().min(1).max(200)).max(30),
  latitude: z.number().finite().min(-90).max(90).nullable(),
  longitude: z.number().finite().min(-180).max(180).nullable(),
  hero_image: z.string().trim().max(2000),
  gallery_images: z.array(z.string().trim().max(2000)).max(12),
  published: z.boolean(),
}).refine((d) => (d.latitude === null) === (d.longitude === null), {
  message: "Provide both latitude and longitude, or neither.",
});

async function requireAdmin(context: any) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId, _role: "admin",
  });
  if (error || data !== true) throw new Error("Forbidden");
  return context.supabase;
}

export const listAdminDestinations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Destination[]> => {
    const db = await requireAdmin(context);
    const { data, error } = await db.from("destinations").select("*").order("name");
    if (error) throw new Error(error.message);
    return data as Destination[];
  });

export const saveDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => destinationSchema.parse(input))
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context);
    const { id, ...fields } = data;
    const { error } = id
      ? await db.from("destinations").update(fields).eq("id", id)
      : await db.from("destinations").insert(fields);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context);
    const { error } = await db.from("destinations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
