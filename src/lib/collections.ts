import type { Tour } from "./content-types";
export const collections = [
  {
    "slug": "exclusive-safari-escapes",
    "name": "Exclusive Safari Escapes",
    "packages": [
      {
        "name": "10 Days Out of Africa",
        "source": "7 Days Out of Africa Safari",
        "slug": "escape-10-days-out-of-africa"
      },
      {
        "name": "6 Days Exclusive Wilderness Experience",
        "source": "6 Days Animal Kingdom Safari",
        "slug": "escape-6-days-exclusive-wilderness-experience"
      }
    ]
  },
  {
    "slug": "premium-safari-escapes",
    "name": "Premium Safari Escapes",
    "packages": [
      {
        "name": "14 Days Kenya Discovery Circuit",
        "source": "",
        "slug": "escape-14-days-kenya-discovery-circuit"
      },
      {
        "name": "10 Days African Wilderness Escape",
        "source": "Kenya Tanzania Safari",
        "slug": "escape-10-days-african-wilderness-escape"
      },
      {
        "name": "7 Days Discover Kenya",
        "source": "7 Days Discover Kenya Safari",
        "slug": "escape-7-days-discover-kenya"
      },
      {
        "name": "6 Days Into Animal Kingdom",
        "source": "6 Days Animal Kingdom Safari",
        "slug": "escape-6-days-into-animal-kingdom"
      }
    ]
  },
  {
    "slug": "wildbeach-escapes",
    "name": "WildBeach Escapes",
    "packages": [
      {
        "name": "10 Days WildBeach Vacation",
        "source": "7 Days Magical Kenya Honeymoon Safari",
        "slug": "escape-10-days-wildbeach-vacation"
      },
      {
        "name": "10 Days Africa Beyond & the Lost Paradise",
        "source": "Kenya Zanzibar Safari",
        "slug": "escape-10-days-africa-beyond-the-lost-paradise"
      }
    ]
  },
  {
    "slug": "peaks-and-primates",
    "name": "Peaks & Primates of Africa",
    "packages": [
      {
        "name": "8 Days The Roof of Africa Expedition",
        "source": "Mount Kilimanjaro Climbing",
        "slug": "escape-8-days-the-roof-of-africa-expedition"
      },
      {
        "name": "5 Days Above the Equator Adventures",
        "source": "Mount Kenya Climbing",
        "slug": "escape-5-days-above-the-equator-adventures"
      }
    ]
  }
];
export const normalizeTour = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function findSource(tours: Tour[], item: {name:string;source:string}) { return tours.find(t => [t.title,t.slug].some(v => normalizeTour(v) === normalizeTour(item.name))) ?? (item.source ? tours.find(t => [t.title,t.slug].some(v => normalizeTour(v) === normalizeTour(item.source))) : undefined); }
export function durationMatches(tour: Tour, name: string) { return tour.duration.match(/\d+/)?.[0] === name.match(/^\d+/)?.[0]; }
