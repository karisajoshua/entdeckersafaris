import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminListGallery,
  deleteGalleryLocation,
  deleteGalleryPhoto,
  saveGalleryLocation,
  saveGalleryPhoto,
} from "../../lib/admin.functions";
import { suggestLocationBlurb, suggestPhotoText } from "../../lib/ai-content.functions";
import { MultiImageUpload, type UploadedImage } from "../../components/admin/multi-image-upload";
import {
  Card,
  Field,
  PageHeading,
  dangerButton,
  ghostButton,
  inputClass,
  primaryButton,
} from "../../components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: AdminGallery,
});

type LocationForm = {
  id?: string;
  slug: string;
  name: string;
  blurb: string;
  sortOrder: number;
};

type StagedPhoto = {
  key: string;
  url: string;
  filename: string;
  alt: string;
  caption: string;
  writing: boolean;
  note?: string;
};

const emptyLocation: LocationForm = { slug: "", name: "", blurb: "", sortOrder: 0 };

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "");

function AdminGallery() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListGallery);
  const saveLocation = useServerFn(saveGalleryLocation);
  const removeLocation = useServerFn(deleteGalleryLocation);
  const savePhoto = useServerFn(saveGalleryPhoto);
  const removePhoto = useServerFn(deleteGalleryPhoto);
  const writePhotoText = useServerFn(suggestPhotoText);
  const writeBlurb = useServerFn(suggestLocationBlurb);

  const [locationForm, setLocationForm] = useState<LocationForm | null>(null);
  const [blurbBusy, setBlurbBusy] = useState(false);
  const [photoFor, setPhotoFor] = useState<string | null>(null);
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  const [savingAll, setSavingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: () => list(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
  const fail = (err: unknown) =>
    setError(err instanceof Error ? err.message : "Something went wrong");

  const locationMutation = useMutation({
    mutationFn: (input: LocationForm) => saveLocation({ data: input }),
    onSuccess: () => {
      setLocationForm(null);
      setError(null);
      invalidate();
    },
    onError: fail,
  });

  const locationDelete = useMutation({
    mutationFn: (id: string) => removeLocation({ data: { id } }),
    onSuccess: invalidate,
    onError: fail,
  });

  const photoDelete = useMutation({
    mutationFn: (id: string) => removePhoto({ data: { id } }),
    onSuccess: invalidate,
    onError: fail,
  });

  const patchStaged = (key: string, patch: Partial<StagedPhoto>) =>
    setStaged((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  async function describe(row: StagedPhoto, locationName: string) {
    patchStaged(row.key, { writing: true, note: undefined });
    try {
      const result = await writePhotoText({
        data: { imageUrl: row.url, location: locationName },
      });
      patchStaged(row.key, {
        alt: result.alt,
        caption: result.caption,
        writing: false,
      });
    } catch (err) {
      patchStaged(row.key, {
        writing: false,
        note: err instanceof Error ? err.message : "AI could not describe this photo",
      });
    }
  }

  function stageUploads(images: UploadedImage[], locationName: string) {
    const rows: StagedPhoto[] = images.map((image) => ({
      key: `${image.url}-${Math.random().toString(36).slice(2)}`,
      url: image.url,
      filename: image.filename,
      alt: "",
      caption: "",
      writing: true,
    }));
    setStaged((current) => [...current, ...rows]);
    void Promise.all(rows.map((row) => describe(row, locationName)));
  }

  async function generateBlurb() {
    if (!locationForm?.name) return;
    setBlurbBusy(true);
    try {
      const result = await writeBlurb({ data: { name: locationForm.name } });
      setLocationForm((current) => (current ? { ...current, blurb: result.blurb } : current));
      setError(null);
    } catch (err) {
      fail(err);
    } finally {
      setBlurbBusy(false);
    }
  }

  async function saveAll(locationId: string, startIndex: number) {
    setSavingAll(true);
    setError(null);
    const failures: string[] = [];
    let index = startIndex;
    for (const row of staged) {
      try {
        await savePhoto({
          data: {
            locationId,
            imageUrl: row.url,
            alt: row.alt,
            caption: row.caption,
            sortOrder: index,
          },
        });
        index += 1;
      } catch (err) {
        failures.push(row.filename);
        if (err instanceof Error) setError(err.message);
      }
    }
    setSavingAll(false);
    if (failures.length > 0) {
      setError(`These photos could not be added: ${failures.join(", ")}`);
      setStaged((rows) => rows.filter((row) => failures.includes(row.filename)));
    } else {
      setStaged([]);
      setPhotoFor(null);
    }
    invalidate();
  }

  return (
    <div>
      <PageHeading
        title="Gallery"
        description="Locations and their photos, shown Pinterest-style on the public gallery."
        action={
          <button
            type="button"
            className={primaryButton}
            onClick={() => setLocationForm({ ...emptyLocation })}
          >
            New location
          </button>
        }
      />

      {error && <p className="mb-6 text-body-md text-red-700">{error}</p>}

      {locationForm && (
        <Card>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              locationMutation.mutate(locationForm);
            }}
          >
            <Field label="Name">
              <input
                className={inputClass}
                value={locationForm.name}
                required
                onChange={(event) => {
                  const name = event.target.value;
                  const autoSlug =
                    !locationForm.slug || locationForm.slug === slugify(locationForm.name);
                  setLocationForm({
                    ...locationForm,
                    name,
                    slug: autoSlug ? slugify(name) : locationForm.slug,
                  });
                }}
              />
            </Field>
            <Field label="Web address">
              <input
                className={inputClass}
                value={locationForm.slug}
                required
                placeholder="masai-mara"
                onChange={(event) =>
                  setLocationForm({ ...locationForm, slug: slugify(event.target.value) })
                }
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Blurb">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={locationForm.blurb}
                  onChange={(event) =>
                    setLocationForm({ ...locationForm, blurb: event.target.value })
                  }
                />
              </Field>
              <button
                type="button"
                className={`${ghostButton} mt-3`}
                disabled={blurbBusy || !locationForm.name}
                onClick={() => void generateBlurb()}
              >
                {blurbBusy ? "Writing…" : "Write with AI"}
              </button>
            </div>
            <Field label="Sort order">
              <input
                className={inputClass}
                type="number"
                min={0}
                value={locationForm.sortOrder}
                onChange={(event) =>
                  setLocationForm({
                    ...locationForm,
                    sortOrder: Number(event.target.value) || 0,
                  })
                }
              />
            </Field>
            <div className="flex items-end gap-3">
              <button type="submit" className={primaryButton} disabled={locationMutation.isPending}>
                Save
              </button>
              <button type="button" className={ghostButton} onClick={() => setLocationForm(null)}>
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {isPending && <p className="text-body-md text-on-surface-variant">Loading…</p>}

      <div className="mt-8 space-y-8">
        {(data ?? []).map((location) => (
          <Card key={location.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-headline-sm text-deep-forest">{location.name}</h2>
                <p className="label mt-1 text-savannah-gold">
                  /{location.slug} · {location.photos.length} photos
                </p>
                {location.blurb && (
                  <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                    {location.blurb}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className={ghostButton}
                  onClick={() =>
                    setLocationForm({
                      id: location.id,
                      slug: location.slug,
                      name: location.name,
                      blurb: location.blurb ?? "",
                      sortOrder: location.sortOrder,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={ghostButton}
                  onClick={() => {
                    setStaged([]);
                    setPhotoFor(photoFor === location.id ? null : location.id);
                  }}
                >
                  Add photos
                </button>
                <button
                  type="button"
                  className={dangerButton}
                  onClick={() => {
                    if (window.confirm(`Delete ${location.name} and all its photos?`))
                      locationDelete.mutate(location.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {photoFor === location.id && (
              <div className="mt-6 space-y-6 border-t border-deep-forest/10 pt-6">
                <MultiImageUpload
                  label="Add photos"
                  onUploaded={(images) => stageUploads(images, location.name)}
                />

                {staged.length > 0 && (
                  <div className="space-y-4">
                    <p className="label text-on-surface-variant">
                      {staged.length} photo{staged.length === 1 ? "" : "s"} ready — check the AI text,
                      then save.
                    </p>
                    {staged.map((row) => (
                      <div
                        key={row.key}
                        className="grid gap-4 rounded-sm border border-deep-forest/10 p-4 md:grid-cols-[8rem_1fr_1fr_auto]"
                      >
                        <img
                          src={row.url}
                          alt=""
                          className="h-24 w-full rounded-sm object-cover md:w-32"
                        />
                        <Field label="Alt text">
                          <input
                            className={inputClass}
                            value={row.alt}
                            placeholder={row.writing ? "AI is looking at the photo…" : ""}
                            onChange={(event) =>
                              patchStaged(row.key, { alt: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="Caption">
                          <input
                            className={inputClass}
                            value={row.caption}
                            placeholder={row.writing ? "AI is writing…" : ""}
                            onChange={(event) =>
                              patchStaged(row.key, { caption: event.target.value })
                            }
                          />
                        </Field>
                        <div className="flex flex-col justify-end gap-2">
                          <button
                            type="button"
                            className={ghostButton}
                            disabled={row.writing}
                            onClick={() => void describe(row, location.name)}
                          >
                            {row.writing ? "Writing…" : "Redo AI text"}
                          </button>
                          <button
                            type="button"
                            className={dangerButton}
                            onClick={() =>
                              setStaged((rows) => rows.filter((item) => item.key !== row.key))
                            }
                          >
                            Remove
                          </button>
                          {row.note && <p className="text-body-md text-red-700">{row.note}</p>}
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className={primaryButton}
                        disabled={savingAll || staged.some((row) => row.writing)}
                        onClick={() => void saveAll(location.id, location.photos.length)}
                      >
                        {savingAll ? "Saving…" : `Save all ${staged.length}`}
                      </button>
                      <button
                        type="button"
                        className={ghostButton}
                        onClick={() => {
                          setStaged([]);
                          setPhotoFor(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {location.photos.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {location.photos.map((photo) => (
                  <figure key={photo.id} className="space-y-2">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="h-32 w-full rounded-sm object-cover"
                    />
                    <button
                      type="button"
                      className={dangerButton}
                      onClick={() => {
                        if (window.confirm("Delete this photo?")) photoDelete.mutate(photo.id);
                      }}
                    >
                      Delete
                    </button>
                  </figure>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
