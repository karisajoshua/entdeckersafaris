import nairobiImg from "../assets/tour-nairobi.jpg";
import mombasaImg from "../assets/tour-mombasa.jpg";
import amboseliImg from "../assets/tour-amboseli.jpg";
import riftValleyImg from "../assets/tour-rift-valley.jpg";
import honeymoonImg from "../assets/tour-honeymoon.jpg";
import lionImg from "../assets/tour-lion.jpg";

export type Tour = {
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  image: string;
  alt: string;
};

export const tours: Tour[] = [
  {
    slug: "nairobi-city-tour",
    title: "Nairobi City Tour",
    tagline: "Skyscrapers meet the savannah.",
    duration: "1 Day",
    image: nairobiImg,
    alt: "Aerial view of Nairobi city at dusk with the national park in the foreground",
  },
  {
    slug: "mombasa-city-tour",
    title: "Mombasa City Tour",
    tagline: "History and Swahili culture.",
    duration: "1 Day",
    image: mombasaImg,
    alt: "Winding streets of Mombasa Old Town with carved wooden doors and Swahili architecture",
  },
  {
    slug: "8-days-kenya-experience",
    title: "8 Days Kenya Experience Safari",
    tagline: "From Amboseli to Masai Mara.",
    duration: "8 Days",
    image: amboseliImg,
    alt: "Elephants in Amboseli grasslands with Mount Kilimanjaro rising behind them",
  },
  {
    slug: "7-days-out-of-africa",
    title: "7 Days Out of Africa Safari",
    tagline: "The Rift Valley and iconic landscapes.",
    duration: "7 Days",
    image: riftValleyImg,
    alt: "Dramatic landscape of the Great Rift Valley escarpment with acacia trees",
  },
  {
    slug: "6-days-honeymoon",
    title: "6 Days Honeymoon Safari",
    tagline: "Romantic escapes.",
    duration: "6 Days",
    image: honeymoonImg,
    alt: "Luxury open-air safari tent with a candlelit dining table for two at sunset",
  },
  {
    slug: "6-days-animal-kingdom",
    title: "6 Days Animal Kingdom Safari",
    tagline: "The heart of the wild.",
    duration: "6 Days",
    image: lionImg,
    alt: "Close-up portrait of a male lion resting in tall savannah grass",
  },
];
