export const collections = [
  {
    "slug": "exclusive-safaris",
    "name": "Exclusive Safaris",
    "packages": [
      {
        "name": "10 Days Out of Africa",
        "source": "7 Days Out of Africa Safari"
      },
      {
        "name": "6 Days Exclusive Wilderness Experience",
        "source": "6 Days Animal Kingdom Safari"
      }
    ]
  },
  {
    "slug": "premium-safaris",
    "name": "Premium Safaris",
    "packages": [
      {
        "name": "14 Days Kenya Discovery Circuit",
        "source": ""
      },
      {
        "name": "10 Days African Wilderness Escape",
        "source": "Kenya Tanzania Safari"
      },
      {
        "name": "10 Days Essence of Africa",
        "source": "10 Days Kenya Experience Safari"
      },
      {
        "name": "7 Days Discover Kenya",
        "source": "7 Days Discover Kenya Safari"
      },
      {
        "name": "6 Days Into Animal Kingdom",
        "source": "6 Days Animal Kingdom Safari"
      }
    ]
  },
  {
    "slug": "wildbeach-vacation",
    "name": "WildBeach Vacation",
    "packages": [
      {
        "name": "10 Days WildBeach Experience",
        "source": "7 Days Magical Kenya Honeymoon Safari"
      },
      {
        "name": "10 Days Beyond Africa & The Lost Paradise",
        "source": "Kenya Zanzibar Safari"
      }
    ]
  },
  {
    "slug": "wild-beach-escape",
    "name": "Wild Beach Escape",
    "packages": [
      {
        "name": "10 Days Safari & Spice Island Escape",
        "source": "Tanzania Zanzibar Safari"
      },
      {
        "name": "10 Days African Savanna and the Lost Paradise Holiday",
        "source": "Kenya Zanzibar Safari"
      }
    ]
  },
  {
    "slug": "peaks-and-primates",
    "name": "Peaks & Primates of Africa",
    "packages": [
      {
        "name": "8 Days The Roof of Africa Expeditions",
        "source": "Mount Kilimanjaro Climbing"
      },
      {
        "name": "5 Days Above the Equator Adventures",
        "source": "Mount Kenya Climbing"
      },
      {
        "name": "5 Days Into the Wild Trekking",
        "source": "Gorilla Safari Uganda"
      }
    ]
  },
  {
    "slug": "treasures-of-east-africa",
    "name": "Treasures of East Africa",
    "packages": [
      {
        "name": "The Magical Nairobi Experience",
        "source": "Nairobi City Tour"
      },
      {
        "name": "Discover the Ancient City of Mombasa",
        "source": "Mombasa City Tour"
      },
      {
        "name": "Naivasha Wild Escape",
        "source": "Lake Naivasha Experience"
      },
      {
        "name": "The Great Sagana Escape",
        "source": "Sagana River Experience"
      },
      {
        "name": "Loita Adventure Experience",
        "source": "Loita Experience"
      }
    ]
  }
];
export const normalizeTour = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
