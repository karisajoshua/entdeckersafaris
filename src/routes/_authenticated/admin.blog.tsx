import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListPosts, deletePost, savePost } from "../../lib/admin.functions";
import type { BlogBlock, BlogPost } from "../../lib/content-types";
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

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: AdminBlog,
});

type PostForm = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  cover: string;
  coverAlt: string;
  body: BlogBlock[];
  published: boolean;
  sortOrder: number;
};

const emptyPost: PostForm = {
  slug: "",
  title: "",
  excerpt: "",
  author: "Entdecker Safaris",
  date: new Date().toISOString().slice(0, 10),
  cover: "",
  coverAlt: "",
  body: [{ type: "paragraph", text: "" }],
  published: false,
  sortOrder: 0,
};

function toForm(post: BlogPost): PostForm {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    author: post.author,
    date: post.date,
    cover: post.cover ?? "",
    coverAlt: post.coverAlt ?? "",
    body: post.body.length > 0 ? post.body : [{ type: "paragraph", text: "" }],
    published: post.published,
    sortOrder: post.sortOrder,
  };
}

function AdminBlog() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListPosts);
  const save = useServerFn(savePost);
  const remove = useServerFn(deletePost);

  const [form, setForm] = useState<PostForm | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending } = useQuery({ queryKey: ["admin", "posts"], queryFn: () => list() });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
  const fail = (err: unknown) =>
    setError(err instanceof Error ? err.message : "Something went wrong");

  const saveMutation = useMutation({
    mutationFn: (input: PostForm) => save({ data: { ...input, body: input.body.filter((block) => block.text.trim() !== "") } }),
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
        title="Journal"
        description="Write and publish articles for the blog."
        action={
          <button type="button" className={primaryButton} onClick={() => setForm({ ...emptyPost })}>
            New article
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
            <Field label="Author">
              <input
                className={inputClass}
                value={form.author}
                onChange={(event) => setForm({ ...form, author: event.target.value })}
              />
            </Field>
            <Field label="Published on">
              <input
                className={inputClass}
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Excerpt">
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.excerpt}
                  onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                value={form.cover}
                onChange={(url) => setForm({ ...form, cover: url })}
                label="Cover image"
              />
            </div>
            <div className="md:col-span-2">
              <Field label="Cover alt text">
                <input
                  className={inputClass}
                  value={form.coverAlt}
                  onChange={(event) => setForm({ ...form, coverAlt: event.target.value })}
                />
              </Field>
            </div>

            <div className="space-y-4 md:col-span-2">
              <p className="label text-on-surface-variant">Body</p>
              {form.body.map((block, index) => (
                <div key={index} className="flex flex-wrap gap-3">
                  <select
                    className={`${inputClass} w-40`}
                    value={block.type}
                    onChange={(event) => {
                      const body = [...form.body];
                      body[index] = {
                        ...block,
                        type: event.target.value as BlogBlock["type"],
                      };
                      setForm({ ...form, body });
                    }}
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="heading">Heading</option>
                  </select>
                  <textarea
                    className={`${inputClass} flex-1`}
                    rows={block.type === "heading" ? 1 : 3}
                    value={block.text}
                    onChange={(event) => {
                      const body = [...form.body];
                      body[index] = { ...block, text: event.target.value };
                      setForm({ ...form, body });
                    }}
                  />
                  <button
                    type="button"
                    className={dangerButton}
                    onClick={() =>
                      setForm({ ...form, body: form.body.filter((_, i) => i !== index) })
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
                  setForm({ ...form, body: [...form.body, { type: "paragraph", text: "" }] })
                }
              >
                Add block
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
                Save article
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
        {(data ?? []).map((post) => (
          <Card key={post.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-headline-sm text-deep-forest">{post.title}</h2>
                <p className="label mt-1 text-savannah-gold">
                  {post.readableDate} · {post.published ? "published" : "draft"}
                </p>
                {post.excerpt && (
                  <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                    {post.excerpt}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className={ghostButton} onClick={() => setForm(toForm(post))}>
                  Edit
                </button>
                <button
                  type="button"
                  className={dangerButton}
                  onClick={() => {
                    if (window.confirm(`Delete “${post.title}”?`)) removeMutation.mutate(post.id);
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
