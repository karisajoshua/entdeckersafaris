import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Item = z.object({
  entity: z.enum(["tour", "blog_post", "gallery_photo", "gallery_location"]),
  id: z.string(),
  fields: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

const Input = z.object({
  lang: z.enum(["fr", "de", "it", "es"]),
  items: z.array(Item).max(80),
});

export type TranslatedFields = Record<string, string | string[]>;
export type TranslationMap = Record<string, TranslatedFields>;

const LANG_NAMES: Record<string, string> = {
  fr: "French",
  de: "German",
  it: "Italian",
  es: "Spanish",
};

function hash(value: string): string {
  let h1 = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h1 ^= value.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  return h1.toString(16);
}

async function callAI(lang: string, payload: unknown): Promise<Record<string, TranslatedFields>> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      instructions: `You are a professional travel-industry translator for Entdecker Safaris, a Kenyan
safari company. Translate the given English website content into ${LANG_NAMES[lang]}.
Rules: keep proper nouns (Nairobi, Masai Mara, Fort Jesus, Entdecker Safaris, hotel names) unchanged;
keep the same structure — each field's translation must be the same shape (strings stay strings,
lists keep the same number of items and order); keep durations and numbers accurate; natural,
warm marketing tone; no added or removed information. Return JSON only, in the shape
{"items":[{"key":"<key as given>","fields":{"<field>":"<translated>"}}]} where list fields are
returned as JSON arrays of strings.`,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: JSON.stringify(payload) }],
        },
      ],
      stream: true,
      reasoning: { effort: "low" },
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Translation request failed (${response.status})`);
  }

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
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        const event = JSON.parse(raw) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (event.type === "response.output_text.delta" && event.delta) text += event.delta;
        else if (event.type === "response.completed" && event.response?.output_text) {
          text = event.response.output_text;
        }
      } catch {
        /* ignore partial event */
      }
    }
  }

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd < 0) throw new Error("Translation response was empty");
  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
    items?: Array<{ key?: string; fields?: TranslatedFields }>;
  };

  const out: Record<string, TranslatedFields> = {};
  for (const item of parsed.items ?? []) {
    if (item.key && item.fields) out[item.key] = item.fields;
  }
  return out;
}

export const translateContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<TranslationMap> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result: TranslationMap = {};
    if (data.items.length === 0) return result;

    const hashes = new Map<string, string>();
    for (const item of data.items) {
      hashes.set(`${item.entity}:${item.id}`, hash(JSON.stringify(item.fields)));
    }

    const { data: cached } = await supabaseAdmin
      .from("content_translations")
      .select("entity, entity_id, fields, source_hash")
      .eq("lang", data.lang)
      .in(
        "entity_id",
        data.items.map((item) => item.id),
      );

    const missing: typeof data.items = [];
    for (const item of data.items) {
      const key = `${item.entity}:${item.id}`;
      const row = (cached ?? []).find(
        (candidate) => candidate.entity === item.entity && candidate.entity_id === item.id,
      );
      if (row && row.source_hash === hashes.get(key)) {
        result[key] = row.fields as TranslatedFields;
      } else {
        missing.push(item);
      }
    }

    if (missing.length === 0) return result;

    // Translate in small batches to keep each request quick and resilient.
    const batchSize = 4;
    for (let start = 0; start < missing.length; start += batchSize) {
      const batch = missing.slice(start, start + batchSize);
      try {
        const translated = await callAI(
          data.lang,
          batch.map((item) => ({ key: `${item.entity}:${item.id}`, fields: item.fields })),
        );
        const rows = [];
        for (const item of batch) {
          const key = `${item.entity}:${item.id}`;
          const fields = translated[key];
          if (!fields) continue;
          result[key] = fields;
          rows.push({
            entity: item.entity,
            entity_id: item.id,
            lang: data.lang,
            fields,
            source_hash: hashes.get(key)!,
          });
        }
        if (rows.length > 0) {
          await supabaseAdmin
            .from("content_translations")
            .upsert(rows, { onConflict: "entity,entity_id,lang" });
        }
      } catch (error) {
        console.error("translateContent batch failed", error);
        // English stays in place for this batch.
      }
    }

    return result;
  });
