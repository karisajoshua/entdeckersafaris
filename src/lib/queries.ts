import { queryOptions } from "@tanstack/react-query";
import {
  getPostBySlug,
  getTourBySlug,
  listGallery,
  listPosts,
  listTours,
} from "./content.functions";

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => listGallery(),
});

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: () => listPosts(),
});

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug({ data: { slug } }),
  });

export const toursQuery = queryOptions({
  queryKey: ["tours"],
  queryFn: () => listTours(),
});

export const tourQuery = (slug: string) =>
  queryOptions({
    queryKey: ["tour", slug],
    queryFn: () => getTourBySlug({ data: { slug } }),
  });
