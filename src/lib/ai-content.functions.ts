import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AuthedContext = {
  supabase: {
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
}

const BRAND_VOICE = `You write website copy for Entdecker Safaris, a Kenyan safari and tour company
based in Nairobi (Masai Mara, Amboseli, Rift Valley, Mombasa, Nairobi city tours, honeymoon safaris).
Write warm, concrete, specific English. Search-friendly and natural: use the real place and wildlife
names a traveller would search for, never keyword stuffing, never marketing cliché ("unforgettable
journey of a lifetime"), never invented prices, dates or guarantees. Respect every length limit.`;

async function friendlyError(response: Response): Promise<string> {
  let message = "";
  try {
    const body = (await response.json()) as { error?: { message?: string }; message?: string };
    message = body.error?.message ?? body.message ?? "";
  } catch {
    message = "";
  }
  if (response.status === 402)
    return message || "The AI credits for this site have run out. Add credits to keep using AI text.";
  if (response.status === 403)
    return message || "AI is switched off for this workspace, so text cannot be generated.";
  if (response.status === 429) return "AI is busy right now — try again in a moment.";
  return message || `AI request failed (${response.status}).`;
}

type Content = Array<
  { type: "input_text"; text: string } | { type: "input_image"; image_url: string }
>;

async function askAI<T>(args: {
  instructions: string;
  content: Content;
  schemaName: string;
  schema: Record<string, unknown>;
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this site yet.");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      instructions: `${BRAND_VOICE}\n\n${args.instructions}`,
      input: [{ role: "user", content: args.content }],
      stream: true,
      reasoning: { effort: "low" },
      text: {
        format: {
          type: "json_schema",
          name: args.schemaName,
          strict: true,
          schema: args.schema,
        },
      },
    }),
  });

  if (!response.ok || !response.body) throw new Error(await friendlyError(response));

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buffer += decoder.decode(chunk.value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
          text += event.delta;
        } else if (event.type === "response.completed" && !text) {
          text = event.response?.output_text ?? "";
        }
      } catch {
        /* ignore keep-alive and partial frames */
      }
    }
  }

  const trimmed = text.trim();
  if (!trimmed) throw new Error("AI returned nothing — try again.");
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    throw new Error("AI returned text we could not read — try again.");
  }
}

const objectSchema = (properties: Record<string, unknown>) => ({
  type: "object",
  additionalProperties: false,
  properties,
  required: Object.keys(properties),
});

/* ------------------------------- gallery photo ------------------------------ */

export const suggestPhotoText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        imageUrl: z.string().trim().min(1).max(2000),
        location: z.string().trim().max(120).default(""),
      })
      .parse(input),
  )
  .handler(async ({ context, data }): Promise<{ alt: string; caption: string }> => {
    await assertAdmin(context as unknown as AuthedContext);
    return askAI({
      instructions: `Look at the safari photograph and write:
- "alt": literal descriptive alt text of what is visible, under 125 characters, no "image of".
- "caption": one short evocative sentence for the public gallery, under 90 characters.
Mention the location only if the photo supports it.`,
      content: [
        {
          type: "input_text",
          text: data.location
            ? `Photo taken in ${data.location}, Kenya. Return JSON with alt and caption.`
            : `Photo taken on a Kenyan safari. Return JSON with alt and caption.`,
        },
        { type: "input_image", image_url: data.imageUrl },
      ],
      schemaName: "photo_text",
      schema: objectSchema({
        alt: { type: "string" },
        caption: { type: "string" },
      }),
    });
  });

/* ------------------------------ location blurb ------------------------------ */

export const suggestLocationBlurb = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ name: z.string().trim().min(1).max(120) }).parse(input))
  .handler(async ({ context, data }): Promise<{ blurb: string }> => {
    await assertAdmin(context as unknown as AuthedContext);
    return askAI({
      instructions: `Write "blurb": two or three sentences (max 420 characters) introducing this Kenyan
safari destination for a photo gallery — landscape, wildlife and the season worth visiting.`,
      content: [{ type: "input_text", text: `Destination: ${data.name}, Kenya.` }],
      schemaName: "location_blurb",
      schema: objectSchema({ blurb: { type: "string" } }),
    });
  });

/* ---------------------------------- blog ----------------------------------- */

export const suggestPostText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        topic: z.string().trim().min(1).max(600),
        title: z.string().trim().max(200).default(""),
      })
      .parse(input),
  )
  .handler(
    async ({
      context,
      data,
    }): Promise<{
      title: string;
      excerpt: string;
      body: Array<{ type: "heading" | "paragraph"; text: string }>;
    }> => {
      await assertAdmin(context as unknown as AuthedContext);
      const result = await askAI<{
        title: string;
        excerpt: string;
        body: Array<{ type: string; text: string }>;
      }>({
        instructions: `Write a blog article for the Entdecker Safaris journal. Return:
- "title": under 60 characters, includes the main search term naturally (keep the given title if one is supplied).
- "excerpt": one sentence summary under 155 characters.
- "body": 8 to 14 blocks alternating "heading" and "paragraph". Headings under 60 characters,
  paragraphs 2-4 sentences of practical, specific travel advice.`,
        content: [
          {
            type: "input_text",
            text: `Topic: ${data.topic}${data.title ? `\nExisting title: ${data.title}` : ""}`,
          },
        ],
        schemaName: "blog_draft",
        schema: objectSchema({
          title: { type: "string" },
          excerpt: { type: "string" },
          body: {
            type: "array",
            items: objectSchema({
              type: { type: "string", enum: ["heading", "paragraph"] },
              text: { type: "string" },
            }),
          },
        }),
      });
      return {
        title: result.title,
        excerpt: result.excerpt,
        body: (result.body ?? [])
          .filter((block) => typeof block?.text === "string" && block.text.trim() !== "")
          .slice(0, 40)
          .map((block) => ({
            type: block.type === "heading" ? "heading" : "paragraph",
            text: block.text.trim(),
          })),
      };
    },
  );

/* ---------------------------------- tours ---------------------------------- */

export const suggestTourText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        title: z.string().trim().min(1).max(200),
        duration: z.string().trim().max(60).default(""),
      })
      .parse(input),
  )
  .handler(async ({ context, data }): Promise<{ tagline: string; intro: string[] }> => {
    await assertAdmin(context as unknown as AuthedContext);
    const result = await askAI<{ tagline: string; intro: string[] }>({
      instructions: `Write tour page copy. Return:
- "tagline": one line under 120 characters naming the parks or highlights.
- "intro": two or three paragraphs (each 2-4 sentences) describing the experience, wildlife and pace.
Do not invent prices, inclusions or exact dates.`,
      content: [
        {
          type: "input_text",
          text: `Tour: ${data.title}${data.duration ? `\nDuration: ${data.duration}` : ""}`,
        },
      ],
      schemaName: "tour_copy",
      schema: objectSchema({
        tagline: { type: "string" },
        intro: { type: "array", items: { type: "string" } },
      }),
    });
    return {
      tagline: result.tagline,
      intro: (result.intro ?? []).filter((p) => typeof p === "string" && p.trim() !== "").slice(0, 6),
    };
  });
