import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListTours, deleteTour, saveTour } from "../../lib/admin.functions";
import type { ItineraryStep, Tour } from "../../lib/content-types";
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

export const Route = createFileRoute("/_authenticated/admin/tours")({
  component: AdminTours,
});

type TourForm = {
  id?: string;
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  image: string;
  alt: string;
  intro: string[];
  itinerary: ItineraryStep[];
  published: boolean;
  sortOrder: number;
};

const emptyTour: TourForm = {
  slug: "",
  title: "",
  tagline: "",
  duration: "",
  image: "",
  alt: "",
  intro: [""],
  itinerary: [{ marker: "Day 1", heading: "", body: "" }],
  published: true,
  sortOrder: 0,
};

function toForm(tour: Tour): TourForm {
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    tagline: tour.tagline ?? "",
    duration: tour.duration ?? "",
    image: tour.image ?? "",
    alt: tour.alt ?? "",
    intro: tour.intro.length > 0 ? tour.intro : [""],
    itinerary:
      tour.itinerary.length > 0 ? tour.itinerary : [{ marker: "Day 1", heading: "", body: "" }],
    published: tour.published,
    sortOrder: tour.sortOrder,
  };
}

function AdminTours() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListTours);
  const save = useServerFn(saveTour);
  const remove = useServerFn(deleteTour);

  const [form, setForm] = useState<TourForm | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending } = useQuery({ queryKey: ["admin", "tours"], queryFn: () => list() });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "tours"] });
  const fail = (err: unknown) =>
    setError(err instanceof Error ? err.message : "Something went wrong");

  const saveMutation = useMutation({
    mutationFn: (input: TourForm) =>
      save({
        data: {
          ...input,
          intro: input.intro.filter((paragraph) => paragraph.trim() !== ""),
          itinerary: input.itinerary.filter(
            (step) => step.marker.trim() !== "" && step.heading.trim() !== "" && step.body.trim() !== "",
          ),
        },
      }),
    onSuccess: () => {
      setForm(null);
      setError(null);
      invalidate();
    },
    onError: fail,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
    onError: fail,
  });

  return (
    <div>
      <PageHeading
        title="Tours"
        description="Packages, itineraries and imagery for the tour pages."
        action={
          <button type="button" className={primaryButton} onClick={() => setForm({ ...emptyTour })}>
            New tour
          </button>
        }
      />

      {error && <p className="mb-6 text-body-md text-red-700">{error}</p>}

      {form && (
        <Card>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate(form);
            }}
          >
            <Field label="Title">
              <input
                className={inputClass}
                value={form.title}
                required
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Field>
            <Field label="Slug">
              <input
                className={inputClass}
                value={form.slug}
                required
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
              />
            </Field>
            <Field label="Tagline">
              <input
                className={inputClass}
                value={form.tagline}
                onChange={(event) => setForm({ ...form, tagline: event.target.value })}
              />
            </Field>
            <Field label="Duration">
              <input
                className={inputClass}
                value={form.duration}
                placeholder="8 days"
                onChange={(event) => setForm({ ...form, duration: event.target.value })}
              />
            </Field>
            <div className="md:col-span-2">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Hero image"
              />
            </div>
            <div className="md:col-span-2">
              <Field label="Image alt text">
                <input
                  className={inputClass}
                  value={form.alt}
                  onChange={(event) => setForm({ ...form, alt: event.target.value })}
                />
              </Field>
            </div>

            <div className="space-y-4 md:col-span-2">
              <p className="label text-on-surface-variant">Intro paragraphs</p>
              {form.intro.map((paragraph, index) => (
                <div key={index} className="flex gap-3">
                  <textarea
                    className={`${inputClass} flex-1`}
                    rows={2}
                    value={paragraph}
                    onChange={(event) => {
                      const intro = [...form.intro];
                      intro[index] = event.target.value;
                      setForm({ ...form, intro });
                    }}
                  />
                  <button
                    type="button"
                    className={dangerButton}
                    onClick={() =>
                      setForm({ ...form, intro: form.intro.filter((_, i) => i !== index) })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={ghostButton}
                onClick={() => setForm({ ...form, intro: [...form.intro, ""] })}
              >
                Add paragraph
              </button>
            </div>

            <div className="space-y-4 md:col-span-2">
              <p className="label text-on-surface-variant">Itinerary</p>
              {form.itinerary.map((step, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[8rem_1fr_1fr_auto]">
                  <input
                    className={inputClass}
                    value={step.marker}
                    placeholder="Day 1"
                    onChange={(event) => {
                      const itinerary = [...form.itinerary];
                      itinerary[index] = { ...step, marker: event.target.value };
                      setForm({ ...form, itinerary });
                    }}
                  />
                  <input
                    className={inputClass}
                    value={step.heading}
                    placeholder="Heading"
                    onChange={(event) => {
                      const itinerary = [...form.itinerary];
                      itinerary[index] = { ...step, heading: event.target.value };
                      setForm({ ...form, itinerary });
                    }}
                  />
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={step.body}
                    placeholder="Description"
                    onChange={(event) => {
                      const itinerary = [...form.itinerary];
                      itinerary[index] = { ...step, body: event.target.value };
                      setForm({ ...form, itinerary });
                    }}
                  />
                  <button
                    type="button"
                    className={dangerButton}
                    onClick={() =>
                      setForm({
                        ...form,
                        itinerary: form.itinerary.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={ghostButton}
                onClick={() =>
                  setForm({
                    ...form,
                    itinerary: [
                      ...form.itinerary,
                      { marker: `Day ${form.itinerary.length + 1}`, heading: "", body: "" },
                    ],
                  })
                }
              >
                Add step
              </button>
            </div>

            <Field label="Sort order">
              <input
                className={inputClass}
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  setForm({ ...form, sortOrder: Number(event.target.value) || 0 })
                }
              />
            </Field>
            <label className="flex items-end gap-2 text-body-md text-deep-forest">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setForm({ ...form, published: event.target.checked })}
              />
              Published
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className={primaryButton} disabled={saveMutation.isPending}>
                Save tour
              </button>
              <button type="button" className={ghostButton} onClick={() => setForm(null)}>
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {isPending && <p className="text-body-md text-on-surface-variant">Loading…</p>}

      <div className="mt-8 space-y-4">
        {(data ?? []).map((tour) => (
          <Card key={tour.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-headline-sm text-deep-forest">{tour.title}</h2>
                <p className="label mt-1 text-savannah-gold">
                  {tour.duration} · {tour.published ? "published" : "draft"} ·{" "}
                  {tour.itinerary.length} steps
                </p>
                {tour.tagline && (
                  <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                    {tour.tagline}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className={ghostButton} onClick={() => setForm(toForm(tour))}>
                  Edit
                </button>
                <button
                  type="button"
                  className={dangerButton}
                  onClick={() => {
                    if (window.confirm(`Delete “${tour.title}”?`)) removeMutation.mutate(tour.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
