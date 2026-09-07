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
import { ImageUpload } from "../../components/admin/image-upload";
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

const emptyLocation: LocationForm = { slug: "", name: "", blurb: "", sortOrder: 0 };

function AdminGallery() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListGallery);
  const saveLocation = useServerFn(saveGalleryLocation);
  const removeLocation = useServerFn(deleteGalleryLocation);
  const savePhoto = useServerFn(saveGalleryPhoto);
  const removePhoto = useServerFn(deleteGalleryPhoto);

  const [locationForm, setLocationForm] = useState<LocationForm | null>(null);
  const [photoFor, setPhotoFor] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoAlt, setPhotoAlt] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
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

  const photoMutation = useMutation({
    mutationFn: (input: { locationId: string; imageUrl: string; alt: string; caption: string }) =>
      savePhoto({ data: input }),
    onSuccess: () => {
      setPhotoFor(null);
      setPhotoUrl("");
      setPhotoAlt("");
      setPhotoCaption("");
      setError(null);
      invalidate();
    },
    onError: fail,
  });

  const photoDelete = useMutation({
    mutationFn: (id: string) => removePhoto({ data: { id } }),
    onSuccess: invalidate,
    onError: fail,
  });

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
                  onClick={() => setPhotoFor(photoFor === location.id ? null : location.id)}
                >
                  Add photo
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
              <form
                className="mt-6 grid gap-4 border-t border-deep-forest/10 pt-6 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  photoMutation.mutate({
                    locationId: location.id,
                    imageUrl: photoUrl,
                    alt: photoAlt,
                    caption: photoCaption,
                  });
                }}
              >
                <div className="md:col-span-2">
                  <ImageUpload value={photoUrl} onChange={setPhotoUrl} label="Photo" />
                </div>
                <Field label="Alt text">
                  <input
                    className={inputClass}
                    value={photoAlt}
                    onChange={(event) => setPhotoAlt(event.target.value)}
                  />
                </Field>
                <Field label="Caption">
                  <input
                    className={inputClass}
                    value={photoCaption}
                    onChange={(event) => setPhotoCaption(event.target.value)}
                  />
                </Field>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className={primaryButton}
                    disabled={photoMutation.isPending || !photoUrl}
                  >
                    Add photo
                  </button>
                </div>
              </form>
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
