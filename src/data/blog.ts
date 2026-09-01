import mara9 from "../assets/gallery/masai-mara-9.jpeg.asset.json";
import nairobiImg from "../assets/feature-nairobi-park.jpg";
import lionImg from "../assets/tour-lion.jpg";

export type BlogPostBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readableDate: string;
  author: string;
  cover: string;
  coverAlt: string;
  body: BlogPostBlock[];
};

export const posts: BlogPost[] = [
  {
    slug: "great-migration-masai-mara",
    title: "The Great Migration: When And Where To See It In The Masai Mara",
    excerpt:
      "Close to two million wildebeest and zebra pour into the Mara between July and October. Here is how to plan a migration safari that actually puts you at the river.",
    date: "2026-08-12",
    readableDate: "12 August 2026",
    author: "Entdecker Safaris",
    cover: mara9.url,
    coverAlt: "Herd of wildebeest moving across open Masai Mara grassland",
    body: [
      {
        type: "paragraph",
        text: "Every year the herds follow the rain north out of the Serengeti and across the Mara River into Kenya. It is the largest overland movement of animals on earth, and for a few months the Masai Mara becomes the most concentrated wildlife theatre in Africa.",
      },
      { type: "heading", text: "The best months" },
      {
        type: "paragraph",
        text: "The first columns usually appear in the southern Mara in July. August and September are the peak, when crossings at the Mara and Talek rivers happen almost daily and predators shadow the herds. By late October the animals begin drifting south again.",
      },
      { type: "heading", text: "Where to be" },
      {
        type: "paragraph",
        text: "Crossing points shift with water levels, so flexibility matters more than a fixed itinerary. Our guides track the herds daily and leave camp early — most crossings begin in the cool hours after sunrise, when the light is also at its best for photography.",
      },
      { type: "heading", text: "Practical advice" },
      {
        type: "paragraph",
        text: "Book several months ahead, allow at least three nights in the reserve so a slow day does not cost you the spectacle, and bring a long lens with a beanbag rest. Mornings are cold in an open vehicle; afternoons are hot. Layers solve both.",
      },
    ],
  },
  {
    slug: "nairobi-national-park-city-safari",
    title: "A Safari Before Breakfast: Nairobi National Park",
    excerpt:
      "The only national park in the world bordering a capital city. Lions roar eight kilometres from the office towers — and you can be back in town by lunch.",
    date: "2026-07-28",
    readableDate: "28 July 2026",
    author: "Entdecker Safaris",
    cover: nairobiImg,
    coverAlt: "Wildlife grazing in Nairobi National Park with the city skyline behind",
    body: [
      {
        type: "paragraph",
        text: "Seven kilometres from Nairobi's city centre, the plains open up and the skyline becomes a backdrop for rhino, buffalo, giraffe and lion. It is a genuinely unique ecosystem — no other capital city on earth has this on its doorstep.",
      },
      { type: "heading", text: "Perfect for a layover" },
      {
        type: "paragraph",
        text: "A half-day game drive fits neatly into a long connection or the day before a flight to the Mara. Leave at 0700, when the animals are active and the air is still cool, and you are back in the city by midday.",
      },
      { type: "heading", text: "What else to combine" },
      {
        type: "paragraph",
        text: "The park pairs naturally with the elephant orphanage, the giraffe centre and the Karen Blixen museum — a full day that covers wildlife, conservation and Kenya's colonial history without ever leaving the county.",
      },
    ],
  },
  {
    slug: "how-to-pack-for-a-kenya-safari",
    title: "How To Pack For A Kenya Safari",
    excerpt:
      "Soft bags, neutral colours, and far less than you think. A practical packing list from guides who load the vehicles every week.",
    date: "2026-07-05",
    readableDate: "5 July 2026",
    author: "Entdecker Safaris",
    cover: lionImg,
    coverAlt: "Lion resting in golden grass on the Kenyan savannah",
    body: [
      {
        type: "paragraph",
        text: "Safari packing is an exercise in restraint. Vehicles and light aircraft have limited space, laundry is available at most camps, and nobody on the plains cares what you wore yesterday.",
      },
      { type: "heading", text: "Clothing" },
      {
        type: "paragraph",
        text: "Neutral tones — khaki, olive, sand. Long sleeves and trousers for dawn drives and evening insects, shorts and t-shirts for the middle of the day, a warm fleece and a windbreaker for open-roof mornings, and a wide-brimmed hat. Avoid bright white and dark blue.",
      },
      { type: "heading", text: "Gear" },
      {
        type: "paragraph",
        text: "Binoculars per person, a camera with a zoom lens, spare batteries and cards, a power bank, sunscreen, insect repellent, and any personal medication. A soft duffel packs into a vehicle far better than a hard suitcase.",
      },
      { type: "heading", text: "Documents" },
      {
        type: "paragraph",
        text: "Passport valid at least six months beyond travel, your e-visa printout, travel insurance details, and yellow fever certification if you are arriving from a country where it is required. Keep digital copies as well.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
