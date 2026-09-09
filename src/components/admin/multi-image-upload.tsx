import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

export type UploadedImage = { url: string; filename: string };

type Props = {
  onUploaded: (images: UploadedImage[]) => void;
  label?: string;
};

async function uploadOne(file: File): Promise<UploadedImage> {
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
  return { url: data.signedUrl, filename: file.name };
}

export function MultiImageUpload({ onUploaded, label = "Photos" }: Props) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: File[]) {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    setBusy(true);
    setError(null);
    setProgress({ done: 0, total: images.length });

    const uploaded: UploadedImage[] = [];
    const failed: string[] = [];
    let done = 0;

    await Promise.all(
      images.map(async (file) => {
        try {
          uploaded.push(await uploadOne(file));
        } catch (err) {
          failed.push(file.name);
          if (err instanceof Error && !error) setError(err.message);
        } finally {
          done += 1;
          setProgress({ done, total: images.length });
        }
      }),
    );

    uploaded.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));
    if (uploaded.length > 0) onUploaded(uploaded);
    if (failed.length > 0) setError(`These files did not upload: ${failed.join(", ")}`);
    setBusy(false);
    setProgress(null);
  }

  return (
    <div className="space-y-3">
      <span className="label block text-on-surface-variant">{label}</span>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(Array.from(event.dataTransfer.files));
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? "border-savannah-gold bg-savannah-gold/5" : "border-deep-forest/25"
        }`}
      >
        <span className="label text-deep-forest">
          {busy && progress
            ? `Uploading ${progress.done} of ${progress.total}…`
            : "Drop photos here or click to choose"}
        </span>
        <span className="text-body-md text-on-surface-variant">
          You can select many photos at once.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy}
          onChange={(event) => {
            void handleFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </label>
      {error && <p className="text-body-md text-red-700">{error}</p>}
    </div>
  );
}
