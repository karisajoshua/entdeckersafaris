import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (uploadError) throw uploadError;

      const { data, error: signError } = await supabase.storage
        .from("site-images")
        .createSignedUrl(path, TEN_YEARS_SECONDS);
      if (signError || !data?.signedUrl) throw signError ?? new Error("Could not link the image");
      onChange(data.signedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <span className="label block text-on-surface-variant">{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        {value && (
          <img
            src={value}
            alt=""
            className="h-20 w-28 rounded-sm border border-deep-forest/10 object-cover"
          />
        )}
        <label className="label cursor-pointer rounded-sm border border-deep-forest/20 px-4 py-2 text-deep-forest transition-colors hover:border-deep-forest">
          {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="…or paste an image URL"
        className="w-full rounded-sm border border-deep-forest/20 bg-transparent px-3 py-2 text-body-md text-deep-forest outline-none focus:border-deep-forest"
      />
      {error && <p className="text-body-md text-red-700">{error}</p>}
    </div>
  );
}
