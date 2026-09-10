export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  sortOrder: number;
};

export type GalleryLocation = {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  sortOrder: number;
  photos: GalleryPhoto[];
};

export type BlogBlock = { type: "heading" | "paragraph"; text: string };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readableDate: string;
  cover: string;
  coverAlt: string;
  body: BlogBlock[];
  published: boolean;
  sortOrder: number;
};

export type ItineraryStep = { marker: string; heading: string; body: string };

export type Tour = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  image: string;
  alt: string;
  category: string;
  intro: string[];
  itinerary: ItineraryStep[];
  published: boolean;
  sortOrder: number;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
};

export function readableDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
