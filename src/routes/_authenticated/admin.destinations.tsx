import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAdminDestinations, saveDestination, removeDestination, type Destination } from "../../lib/destinations.functions";
import { ImageUpload } from "../../components/admin/image-upload";
import { Card, Field, PageHeading, inputClass, primaryButton, ghostButton, dangerButton } from "../../components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/destinations")({ component: DestinationsManager });

type FormState = Omit<Destination, "id"> & { id?: string };
const blank: FormState = {
  name: "", slug: "", country: "Kenya", region: "", description: "",
  highlights: [], latitude: null, longitude: null, hero_image: "",
  gallery_images: [], published: false,
};

function DestinationsManager() {
  const client = useQueryClient();
  const list = useServerFn(listAdminDestinations);
  const save = useServerFn(saveDestination);
  const remove = useServerFn(removeDestination);
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data = [], isPending } = useQuery({ queryKey: ["admin-destinations"], queryFn: () => list() });
  const refresh = () => void client.invalidateQueries({ queryKey: ["admin-destinations"] });
  const mutation = useMutation({
    mutationFn: (value: FormState) => save({ data: value }),
    onSuccess: () => { setForm(null); setError(null); refresh(); },
    onError: (err) => setError(err instanceof Error ? err.message : "Unable to save destination"),
  });
  const deletion = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: refresh,
    onError: (err) => setError(err instanceof Error ? err.message : "Unable to delete destination"),
  });
  const update = (changes: Partial<FormState>) => setForm((current) => current ? { ...current, ...changes } : current);
  return (
    <div>
      <PageHeading title="Destinations" description="Reusable destination profiles, coordinates, photographs and highlights."
        action={<button className={primaryButton} type="button" onClick={() => setForm({ ...blank })}>New destination</button>} />
      {error && <p role="alert" className="mb-5 text-red-700">{error}</p>}
      {form && <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); mutation.mutate(form); }}>
          <Field label="Destination name"><input required className={inputClass} value={form.name} onChange={(e) => update({ name: e.target.value })}/></Field>
          <Field label="Slug"><input required className={inputClass} value={form.slug} onChange={(e) => update({ slug: e.target.value })}/></Field>
          <Field label="Country"><input required className={inputClass} value={form.country} onChange={(e) => update({ country: e.target.value })}/></Field>
          <Field label="Region"><input className={inputClass} value={form.region} onChange={(e) => update({ region: e.target.value })}/></Field>
          <div className="md:col-span-2"><Field label="Description"><textarea className={inputClass} rows={5} value={form.description} onChange={(e) => update({ description: e.target.value })}/></Field></div>
          <Field label="Latitude"><input type="number" step="any" min={-90} max={90} className={inputClass} value={form.latitude ?? ""} onChange={(e) => update({ latitude: e.target.value === "" ? null : Number(e.target.value) })}/></Field>
          <Field label="Longitude"><input type="number" step="any" min={-180} max={180} className={inputClass} value={form.longitude ?? ""} onChange={(e) => update({ longitude: e.target.value === "" ? null : Number(e.target.value) })}/></Field>
          <div className="md:col-span-2"><Field label="Highlights (one per line)"><textarea rows={4} className={inputClass} value={form.highlights.join("\n")} onChange={(e) => update({ highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}/></Field></div>
          <div className="md:col-span-2"><ImageUpload value={form.hero_image} onChange={(url) => update({ hero_image: url })} label="Main destination photograph" /></div>
          <div className="md:col-span-2">
            <p className="label mb-3">Destination gallery (up to 12 photographs)</p>
            {form.gallery_images.map((url, index) => <div key={index} className="mb-4 flex items-end gap-3">
              <div className="flex-1"><ImageUpload value={url} onChange={(value) => update({ gallery_images: form.gallery_images.map((image, i) => i === index ? value : image) })} label={`Photo ${index + 1}`} /></div>
              <button type="button" className={dangerButton} onClick={() => update({ gallery_images: form.gallery_images.filter((_, i) => i !== index) })}>Remove</button>
            </div>)}
            {form.gallery_images.length < 12 && <button type="button" className={ghostButton} onClick={() => update({ gallery_images: [...form.gallery_images, ""] })}>Add gallery photo</button>}
          </div>
          <label className="flex items-center gap-2 md:col-span-2"><input type="checkbox" checked={form.published} onChange={(e) => update({ published: e.target.checked })}/> Published</label>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" disabled={mutation.isPending} className={primaryButton}>{mutation.isPending ? "Saving…" : "Save destination"}</button>
            <button type="button" className={ghostButton} onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      </Card>}
      <div className="mt-8 grid gap-4">
        {isPending && <p>Loading destinations…</p>}
        {data.map((item) => <Card key={item.id}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {item.hero_image && <img src={item.hero_image} alt="" className="h-16 w-20 rounded object-cover" />}
              <div><h2 className="text-lg font-semibold">{item.name}</h2><p className="text-sm text-on-surface-variant">{item.region}, {item.country} · {item.published ? "Published" : "Draft"}</p></div>
            </div>
            <div className="flex gap-2">
              <button type="button" className={ghostButton} onClick={() => setForm({ ...item })}>Edit</button>
              <button type="button" className={dangerButton} disabled={deletion.isPending} onClick={() => { if (window.confirm(`Delete ${item.name}?`)) deletion.mutate(item.id); }}>Delete</button>
            </div>
          </div>
        </Card>)}
      </div>
    </div>
  );
}
