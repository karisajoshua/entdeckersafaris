import mara1 from "../assets/gallery/masai-mara-1.jpeg.asset.json";
import mara2 from "../assets/gallery/masai-mara-2.jpeg.asset.json";
import mara3 from "../assets/gallery/masai-mara-3.jpeg.asset.json";
import mara4 from "../assets/gallery/masai-mara-4.jpeg.asset.json";
import mara5 from "../assets/gallery/masai-mara-5.jpeg.asset.json";
import mara6 from "../assets/gallery/masai-mara-6.jpeg.asset.json";
import mara7 from "../assets/gallery/masai-mara-7.jpeg.asset.json";
import mara8 from "../assets/gallery/masai-mara-8.jpeg.asset.json";
import mara9 from "../assets/gallery/masai-mara-9.jpeg.asset.json";
import mara10 from "../assets/gallery/masai-mara-10.jpeg.asset.json";

export type GalleryPhoto = {
  src: string;
  alt: string;
  wide?: boolean;
};

export type GalleryLocation = {
  slug: string;
  name: string;
  blurb: string;
  photos: GalleryPhoto[];
};

export const galleryLocations: GalleryLocation[] = [
  {
    slug: "masai-mara",
    name: "Masai Mara",
    blurb:
      "Kenya's most celebrated reserve — endless golden plains, resident lion prides and the thundering Great Migration of wildebeest crossing from the Serengeti. Every photograph below was taken on one of our own safaris.",
    photos: [
      {
        src: mara2.url,
        alt: "Male lion with a full mane walking through tall grass in the Masai Mara",
      },
      {
        src: mara3.url,
        alt: "Male lion roaring among green bush in the Masai Mara",
      },
      {
        src: mara1.url,
        alt: "Maasai giraffe standing in golden savannah grass",
      },
      {
        src: mara5.url,
        alt: "Lion resting on a granite kopje at dawn",
      },
      {
        src: mara4.url,
        alt: "Lion surveying the plains from a rocky outcrop",
      },
      {
        src: mara6.url,
        alt: "Lioness walking through long grass towards an acacia thicket",
      },
      {
        src: mara7.url,
        alt: "Wildebeest picking their way down a riverbank during the Great Migration",
      },
      {
        src: mara8.url,
        alt: "Long line of wildebeest crossing a gully watched by safari vehicles",
      },
      {
        src: mara9.url,
        alt: "Herd of wildebeest moving across open Mara grassland under a wide sky",
      },
      {
        src: mara10.url,
        alt: "Guests photographing the migration from open-roof safari vehicles",
        wide: true,
      },
    ],
  },
];
